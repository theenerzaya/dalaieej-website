import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import qs from "qs";
import { createHash } from "crypto";
import {
  cloudbedsGet,
  normalizeCloudbedsRoomTypeID,
} from "@/lib/cloudbeds";
import { parseBoundedInteger, validateStayDates } from "@/lib/booking-guards";
import { parseCloudbedsMoney } from "@/lib/cloudbeds-money";
import { stayTotalForRoom } from "@/lib/cloudbeds-pricing";
import {
  depositPortionForAddonTotal,
  sumDepositDueForRoomLines,
} from "@/lib/deposit-policy";
import { createPaymentSession } from "@/lib/payment-session";
import { createPendingPaymentNote } from "@/lib/cloudbeds-unpaid-cleanup";

const CLOUDBEDS_API_BASE = "https://hotels.cloudbeds.com/api/v1.2";
const IDEMPOTENCY_TTL_MS = 30 * 60 * 1000;

function minutesEnv(name: string, fallback: number): number {
  const parsed = Number(process.env[name] || "");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const UNPAID_CANCEL_AFTER_MS = minutesEnv("CLOUDBEDS_CANCEL_UNPAID_AFTER_MINUTES", 30) * 60 * 1000;

interface RoomBooking {
  roomTypeID: string;
  roomRateID?: string;
  quantity: number;
  adults: number;
  children: number;
}

type SanitizedRoomBooking = {
  roomTypeID: string;
  roomRateID: string;
  quantity: 1;
  adults: number;
  children: number;
};

type CloudbedsPropertyRoom = {
  roomTypeID?: string;
  roomTypeName?: string;
  roomsAvailable?: number | string;
  roomRateID?: string | number;
  ratePlanNamePublic?: string;
  maxGuests?: number | string;
} & Record<string, unknown>;

type CloudbedsAvailabilityResponse = {
  success?: boolean;
  data?: Array<{
    propertyCurrency?: { currencyCode?: string };
    propertyRooms?: CloudbedsPropertyRoom[];
  }>;
};

type CloudbedsAddonItem = {
  itemID?: string;
  id?: string;
  itemPrice?: number | string;
  price?: number | string;
  priceType?: string;
  maxQuantity?: number | string;
};

type CloudbedsItemsResponse = {
  success?: boolean;
  data?: unknown;
};

type SanitizedAddonCharge = {
  id: string;
  quantity: number;
};

type ReservationSuccessPayload = {
  success: true;
  reservationId: string;
  guestName: string;
  totalAmount: number;
  depositDueNow: number;
  balanceOnArrival: number;
  currency: string;
  paymentSession: string;
  message: string;
  idempotentReplay?: boolean;
};

class BookingValidationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "BookingValidationError";
    this.status = status;
  }
}

function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

const reservationIdempotencyCache = new Map<
  string,
  {
    fingerprint: string;
    expiresAt: number;
    promise: Promise<ReservationSuccessPayload>;
  }
>();

function cleanReservationIdempotencyCache() {
  const now = Date.now();
  for (const [key, entry] of reservationIdempotencyCache.entries()) {
    if (entry.expiresAt <= now) reservationIdempotencyCache.delete(key);
  }
}

function parseIdempotencyKey(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, 120);
}

function reservationRequestFingerprint(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function roomKey(roomTypeID: string, roomRateID: string): string {
  return `${normalizeCloudbedsRoomTypeID(roomTypeID)}__${String(roomRateID)}`;
}

function roomsAvailableCount(value: unknown): number {
  const parsed =
    typeof value === "number" ? value : Number.parseInt(String(value ?? "0"), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function parseMaxGuests(value: unknown): number {
  const parsed =
    typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function sanitizeRooms(rooms: unknown): SanitizedRoomBooking[] | string {
  if (!Array.isArray(rooms) || rooms.length === 0) {
    return "At least one room is required";
  }

  if (rooms.length > 10) {
    return "Please contact us directly for reservations over 10 rooms";
  }

  const out: SanitizedRoomBooking[] = [];
  for (const raw of rooms) {
    const room = raw as Partial<RoomBooking>;
    const roomTypeID = normalizeCloudbedsRoomTypeID(String(room.roomTypeID || ""));
    const roomRateID = String(room.roomRateID || "").trim();
    const quantity = parseBoundedInteger(room.quantity ?? 1, {
      min: 1,
      max: 1,
      label: "quantity",
    });
    const adults = parseBoundedInteger(room.adults ?? 1, {
      min: 1,
      max: 20,
      label: "adults",
    });
    const children = parseBoundedInteger(room.children ?? 0, {
      min: 0,
      max: 10,
      label: "children",
    });

    if (!roomTypeID) return "Each room must include a room type";
    if (!roomRateID) return "Each room must include a rate";
    if (quantity !== 1) return "Room quantity must be one per cart line";
    if (adults == null || children == null) {
      return "Guest counts must be whole numbers within the allowed range";
    }

    out.push({ roomTypeID, roomRateID, quantity: 1, adults, children });
  }

  return out;
}

async function fetchAvailableRooms(
  checkin: string,
  checkout: string,
  promo: string | undefined
): Promise<{ rooms: CloudbedsPropertyRoom[]; currency: string }> {
  const params: Record<string, string> = {
    startDate: checkin,
    endDate: checkout,
    rooms: "1",
    adults: "1",
    children: "0",
  };
  if (promo) params.promoCode = promo;

  const availability = await cloudbedsGet<CloudbedsAvailabilityResponse>(
    "/getAvailableRoomTypes",
    params
  );
  const property = availability.data?.[0];
  return {
    rooms: property?.propertyRooms ?? [],
    currency: property?.propertyCurrency?.currencyCode || "MNT",
  };
}

function validateRoomQuotes(
  requestedRooms: SanitizedRoomBooking[],
  availableRooms: CloudbedsPropertyRoom[],
  nights: number
) {
  const availableByKey = new Map<string, CloudbedsPropertyRoom>();
  const availableByRoomType = new Map<string, number>();
  for (const room of availableRooms) {
    if (!room.roomTypeID || room.roomRateID == null) continue;
    const roomTypeID = normalizeCloudbedsRoomTypeID(room.roomTypeID);
    availableByKey.set(roomKey(roomTypeID, String(room.roomRateID)), room);
    availableByRoomType.set(
      roomTypeID,
      Math.max(
        availableByRoomType.get(roomTypeID) ?? 0,
        roomsAvailableCount(room.roomsAvailable)
      )
    );
  }

  const requestedCounts = new Map<string, number>();
  const requestedRoomTypeCounts = new Map<string, number>();
  const rateByRoomType = new Map<string, string>();
  const lines = requestedRooms.map((room) => {
    const key = roomKey(room.roomTypeID, room.roomRateID);
    const match = availableByKey.get(key);
    if (!match) {
      throw new BookingValidationError("A selected room or rate is no longer available", 409);
    }

    const existingRate = rateByRoomType.get(room.roomTypeID);
    if (existingRate && existingRate !== room.roomRateID) {
      throw new BookingValidationError("Please choose one rate per room type", 400);
    }
    rateByRoomType.set(room.roomTypeID, room.roomRateID);

    const maxGuests = parseMaxGuests(match.maxGuests);
    if (maxGuests > 0 && room.adults + room.children > maxGuests) {
      throw new BookingValidationError(
        `${match.roomTypeName || "Selected room"} fits up to ${maxGuests} guests`,
        400
      );
    }

    requestedCounts.set(key, (requestedCounts.get(key) ?? 0) + 1);
    if ((requestedCounts.get(key) ?? 0) > roomsAvailableCount(match.roomsAvailable)) {
      throw new BookingValidationError(
        `${match.roomTypeName || "Selected room"} no longer has enough availability`,
        409
      );
    }

    requestedRoomTypeCounts.set(
      room.roomTypeID,
      (requestedRoomTypeCounts.get(room.roomTypeID) ?? 0) + 1
    );
    if ((requestedRoomTypeCounts.get(room.roomTypeID) ?? 0) > (availableByRoomType.get(room.roomTypeID) ?? 0)) {
      throw new BookingValidationError(
        `${match.roomTypeName || "Selected room"} no longer has enough availability`,
        409
      );
    }

    const totalRate = stayTotalForRoom(match, room.adults, room.children);
    if (!(totalRate > 0)) {
      throw new BookingValidationError(
        `${match.roomTypeName || "Selected room"} could not be priced`,
        409
      );
    }

    return {
      ...room,
      roomTypeName: match.roomTypeName || room.roomTypeID,
      rateName: match.ratePlanNamePublic || "Standard",
      totalRate,
      pricePerNight: nights > 0 ? totalRate / nights : totalRate,
    };
  });

  return lines;
}

async function quoteAddons(
  addons: unknown,
  checkin: string,
  checkout: string,
  firstRoomTypeID: string,
  nights: number
): Promise<{ total: number; charges: SanitizedAddonCharge[] }> {
  if (!Array.isArray(addons) || addons.length === 0) return { total: 0, charges: [] };

  const itemsData = await cloudbedsGet<CloudbedsItemsResponse>("/getItems", {
    startDate: checkin,
    endDate: checkout,
    roomTypeID: firstRoomTypeID,
  });
  const items = Array.isArray(itemsData.data)
    ? (itemsData.data as CloudbedsAddonItem[])
    : [];
  const byId = new Map<string, CloudbedsAddonItem>();
  for (const item of items) {
    const id = String(item.itemID || item.id || "").trim();
    if (id) byId.set(id, item);
  }

  let total = 0;
  const charges: SanitizedAddonCharge[] = [];
  for (const raw of addons) {
    const row = raw as { id?: unknown; quantity?: unknown };
    const id = String(row.id || "").trim();
    const item = byId.get(id);
    if (!item) {
      throw new BookingValidationError("A selected add-on is no longer available", 409);
    }

    const maxQuantity =
      parseBoundedInteger(item.maxQuantity ?? 10, {
        min: 1,
        max: 99,
        label: "maxQuantity",
      }) ?? 10;
    const quantity = parseBoundedInteger(row.quantity ?? 1, {
      min: 1,
      max: maxQuantity,
      label: "quantity",
    });
    if (quantity == null) {
      throw new BookingValidationError("A selected add-on has an invalid quantity", 400);
    }

    const unitPrice = parseCloudbedsMoney(item.itemPrice ?? item.price);
    const multiplier = item.priceType === "per_night" ? nights : 1;
    total += unitPrice * quantity * multiplier;
    charges.push({ id, quantity });
  }

  return { total, charges };
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.CLOUDBEDS_API_KEY;
    const propertyId = process.env.CLOUDBEDS_PROPERTY_ID;

    if (!apiKey || !propertyId) {
      throw new Error("Cloudbeds API credentials not configured");
    }

    const body = await request.json();
    const {
      rooms,
      checkin,
      checkout,
      guestFirstName,
      guestLastName,
      guestEmail,
      guestPhone,
      guestCountry,
      specialRequests,
      addons,
      totalAmount,
      promo,
    } = body;

    const stayDates = validateStayDates(checkin, checkout);
    if (!stayDates.ok) {
      return fail(stayDates.error);
    }

    const firstName = typeof guestFirstName === "string" ? guestFirstName.trim() : "";
    const lastName = typeof guestLastName === "string" ? guestLastName.trim() : "";
    const email = typeof guestEmail === "string" ? guestEmail.trim() : "";
    const phone = typeof guestPhone === "string" ? guestPhone.trim() : "";
    const country = typeof guestCountry === "string" ? guestCountry.trim().toUpperCase() : "";
    const notes = typeof specialRequests === "string" ? specialRequests.trim() : "";
    const pendingPaymentExpiresAt = new Date(Date.now() + UNPAID_CANCEL_AFTER_MS);

    if (!firstName || !lastName || !email) {
      return fail("Missing required fields");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail("A valid guest email is required");
    }

    const roomList = sanitizeRooms(rooms);
    if (typeof roomList === "string") {
      return fail(roomList);
    }

    const promoCode = typeof promo === "string" ? promo.trim() : "";
    const { rooms: availableRooms, currency } = await fetchAvailableRooms(
      checkin,
      checkout,
      promoCode || undefined
    );
    const quotedRooms = validateRoomQuotes(roomList, availableRooms, stayDates.nights);
    const addonQuote = await quoteAddons(
      addons,
      checkin,
      checkout,
      roomList[0].roomTypeID,
      stayDates.nights
    );
    const addonsTotal = addonQuote.total;
    const roomsTotal = quotedRooms.reduce((sum, room) => sum + room.totalRate, 0);
    const serverTotalAmount = Math.round(roomsTotal + addonsTotal);
    const depositDueNow = Math.round(
      sumDepositDueForRoomLines(
        quotedRooms.map((room) => ({
          rateName: room.rateName,
          pricePerNight: room.pricePerNight,
          quantity: 1,
        })),
        stayDates.nights
      ) + depositPortionForAddonTotal(addonsTotal)
    );

    if (Number.isFinite(Number(totalAmount)) && Math.abs(Number(totalAmount) - serverTotalAmount) > 1) {
      console.warn("Client reservation total differed from server quote:", {
        clientTotalAmount: Number(totalAmount),
        serverTotalAmount,
      });
    }

    const createReservationPayload = async (): Promise<ReservationSuccessPayload> => {
      const payloadObj: Record<string, unknown> = {
        propertyID: propertyId,
        startDate: checkin,
        endDate: checkout,
        guestFirstName: firstName,
        guestLastName: lastName,
        guestEmail: email,
        source: "Website",
        status: "not_confirmed",
        paymentMethod: "bank_transfer",
        rooms: roomList.map((room) => ({
          roomTypeID: room.roomTypeID,
          roomRateID: room.roomRateID,
          quantity: 1,
        })),
        adults: roomList.map((room) => ({
          roomTypeID: room.roomTypeID,
          quantity: room.adults,
        })),
        children: roomList.map((room) => ({
          roomTypeID: room.roomTypeID,
          quantity: room.children,
        })),
      };

      if (phone) payloadObj.guestPhone = phone;
      if (country) {
        payloadObj.guestCountry = country.length === 2 ? country : "MN";
      }
      if (promoCode) payloadObj.promoCode = promoCode;
      payloadObj.customNotes = createPendingPaymentNote(notes, pendingPaymentExpiresAt);

      const formattedBody = qs.stringify(payloadObj, { arrayFormat: "indices" });

      console.log("Creating Cloudbeds reservation:", {
        roomCount: roomList.length,
        checkin,
        checkout,
        hasAddons: addonQuote.charges.length > 0,
        totalAmount: serverTotalAmount,
      });

      const response = await axios.post(
        `${CLOUDBEDS_API_BASE}/postReservation`,
        formattedBody,
        {
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to create reservation");
      }

      const reservationId = response.data.reservationID || response.data.data?.reservationID;
      if (!reservationId) {
        throw new Error("Cloudbeds did not return a reservation ID");
      }
      console.log("Cloudbeds reservation created:", { reservationId });

      if (addonQuote.charges.length > 0) {
        for (const addon of addonQuote.charges) {
          try {
            const chargePayload = {
              propertyID: propertyId,
              reservationID: reservationId,
              itemID: addon.id,
              quantity: addon.quantity,
            };

            await axios.post(
              `${CLOUDBEDS_API_BASE}/postCharge`,
              qs.stringify(chargePayload),
              {
                headers: {
                  "x-api-key": apiKey,
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              }
            );
          } catch (addonError) {
            console.error("Failed to add addon:", addon.id, addonError);
          }
        }
      }

      return {
        success: true,
        reservationId,
        guestName: `${firstName} ${lastName}`,
        totalAmount: serverTotalAmount,
        depositDueNow,
        balanceOnArrival: Math.max(0, serverTotalAmount - depositDueNow),
        currency,
        paymentSession: createPaymentSession({
          reservationId,
          amountMnt: depositDueNow,
          totalAmountMnt: serverTotalAmount,
          currency,
          guestName: `${firstName} ${lastName}`,
          nights: stayDates.nights,
        }),
        message: "Reservation created successfully",
      };
    };

    const idempotencyKey = parseIdempotencyKey(
      body.idempotencyKey || request.headers.get("idempotency-key")
    );
    if (idempotencyKey) {
      cleanReservationIdempotencyCache();
      const fingerprint = reservationRequestFingerprint({
        rooms: roomList,
        checkin,
        checkout,
        guestFirstName: firstName,
        guestLastName: lastName,
        guestEmail: email,
        guestPhone: phone,
        guestCountry: country,
        specialRequests: notes,
        addons: addonQuote.charges,
        promo: promoCode,
        totalAmount: serverTotalAmount,
      });
      const cached = reservationIdempotencyCache.get(idempotencyKey);

      if (cached) {
        if (cached.fingerprint !== fingerprint) {
          return fail("This checkout attempt was already used for a different booking", 409);
        }
        const replay = await cached.promise;
        return NextResponse.json({ ...replay, idempotentReplay: true });
      }

      const promise = createReservationPayload();
      reservationIdempotencyCache.set(idempotencyKey, {
        fingerprint,
        expiresAt: Date.now() + IDEMPOTENCY_TTL_MS,
        promise,
      });

      try {
        return NextResponse.json(await promise);
      } catch (error) {
        if (reservationIdempotencyCache.get(idempotencyKey)?.promise === promise) {
          reservationIdempotencyCache.delete(idempotencyKey);
        }
        throw error;
      }
    }

    return NextResponse.json(await createReservationPayload());
  } catch (error) {
    console.error(
      "Cloudbeds reservation error:",
      error instanceof Error ? error.message : error
    );

    if (error instanceof BookingValidationError) {
      return fail(error.message, error.status);
    }

    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return NextResponse.json(
        { error: `Failed to create reservation: ${message}` },
        { status: 500 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}
