import { NextRequest, NextResponse } from "next/server";
import { cloudbedsGet } from "@/lib/cloudbeds";
import {
  extractRateCancellationFromPlan,
  mergeCancellation,
  type RateCancellation,
} from "@/lib/cloudbeds-rate-cancellation";

interface RateRestriction {
  closedToArrival: boolean;
  closedToDeparture: boolean;
  minLos: number;
  maxLos: number;
}

type CloudbedsRateDetailedRow = {
  date?: string;
  closedToArrival?: unknown;
  closedToDeparture?: unknown;
  minLos?: number;
  maxLos?: number;
} & Record<string, unknown>;

type CloudbedsRatePlan = {
  rateID?: string | number;
  roomTypeID?: string;
  isDerived?: boolean;
  roomRateDetailed?: CloudbedsRateDetailedRow[];
} & Record<string, unknown>;

type CloudbedsRatePlansResponse = {
  success?: boolean;
  data?: CloudbedsRatePlan[];
};

type CloudbedsAvailabilityPropertyCurrency = {
  currencyCode?: string;
};

type CloudbedsPropertyPhoto = {
  image?: string | null;
  thumb?: string | null;
};

type CloudbedsPropertyRoom = {
  roomTypeID: string;
  roomTypeName?: string;
  roomsAvailable?: number;
  roomRateID: string | number;
  ratePlanNamePublic?: string;
  derivedType?: string;
  derivedValue?: string;
  roomTypePhotos?: Array<string | CloudbedsPropertyPhoto>;
  roomTypeDescription?: string;
  maxGuests?: number | string;
  roomTypeFeatures?: string[];
} & Record<string, unknown>;

type CloudbedsAvailabilityResponse = {
  success?: boolean;
  data?: Array<{
    propertyCurrency?: CloudbedsAvailabilityPropertyCurrency;
    propertyRooms?: CloudbedsPropertyRoom[];
    propertyID?: string;
  }>;
};

type CloudbedsHotelDetailsResponse = {
  success?: boolean;
  data?: {
    propertyPolicy?: {
      propertyTermsAndConditions?: string;
    };
  };
};

/** Normalize Cloudbeds roomRateDetailed `date` (or YYYY-MM-DD) for comparison. */
function normDetailDate(value: unknown): string {
  if (value == null) return "";
  const s = String(value);
  return s.length >= 10 ? s.slice(0, 10) : s;
}

/** Cloudbeds returns adultsExtraCharge / childrenExtraCharge as an array of single-key objects. */
function flattenExtraChargeMap(extra: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (extra == null) return out;
  const rows = Array.isArray(extra) ? extra : [extra];
  for (const row of rows) {
    if (row && typeof row === "object" && !Array.isArray(row)) {
      for (const [k, v] of Object.entries(row as Record<string, unknown>)) {
        const n = typeof v === "number" ? v : parseFloat(String(v));
        if (!Number.isNaN(n)) out[k] = n;
      }
    }
  }
  return out;
}

function extraChargeForGuestCount(map: Record<string, number>, count: number): number {
  if (count <= 0) return 0;
  const direct = map[String(count)];
  if (direct != null) return direct;
  const numericKeys = Object.keys(map)
    .map((k) => parseInt(k, 10))
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b);
  let best = 0;
  for (const k of numericKeys) {
    if (k <= count) best = map[String(k)] ?? best;
  }
  return best;
}

/** Full stay total: base roomRate plus occupancy-based extras (per-person / extra guest). */
function stayTotalForRoom(room: Record<string, unknown>, adults: number, children: number): number {
  const base = typeof room.roomRate === "number" ? room.roomRate : parseFloat(String(room.roomRate || 0)) || 0;
  const adultExtra = extraChargeForGuestCount(flattenExtraChargeMap(room.adultsExtraCharge), adults);
  const childExtra = extraChargeForGuestCount(flattenExtraChargeMap(room.childrenExtraCharge), children);
  return base + adultExtra + childExtra;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const checkin = searchParams.get("checkin");
    const checkout = searchParams.get("checkout");

    if (!checkin || !checkout) {
      return NextResponse.json(
        { error: "checkin and checkout dates are required" },
        { status: 400 }
      );
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(checkin) || !dateRegex.test(checkout)) {
      return NextResponse.json(
        { error: "Dates must be in YYYY-MM-DD format" },
        { status: 400 }
      );
    }

    const promo = searchParams.get("promo");
    const adults = searchParams.get("adults");
    const children = searchParams.get("children");
    const rooms = searchParams.get("rooms") || "1";

    const adultsNum = Math.max(1, parseInt(adults || "1", 10) || 1);
    const childrenNum = Math.max(0, parseInt(children || "0", 10) || 0);

    const params: Record<string, string> = {
      startDate: checkin,
      endDate: checkout,
      rooms,
      adults: String(adultsNum),
      children: String(childrenNum),
    };

    if (promo) {
      params.promoCode = promo;
      console.log("Applying promo code:", promo);
    }

    const [availabilityData, ratePlansData, hotelDetailsData] = await Promise.all([
      cloudbedsGet<CloudbedsAvailabilityResponse>("/getAvailableRoomTypes", params),
      cloudbedsGet<CloudbedsRatePlansResponse>("/getRatePlans", { ...params, detailedRates: "true" }).catch((err) => {
        console.error("Failed to fetch rate plan restrictions:", err);
        return null;
      }),
      cloudbedsGet<CloudbedsHotelDetailsResponse>("/getHotelDetails", {}).catch((err) => {
        console.error("Failed to fetch hotel details:", err);
        return null;
      }),
    ]);

    console.log("Cloudbeds availability response:", JSON.stringify(availabilityData, null, 2));
    console.log("Cloudbeds ratePlans response:", JSON.stringify(ratePlansData, null, 2));

    const restrictionByRateID = new Map<string, RateRestriction>();
    const cancellationByRateID = new Map<string, RateCancellation>();
    const baseCancellationByRoomType = new Map<string, RateCancellation>();

    if (ratePlansData?.data) {
      const checkinKey = normDetailDate(checkin);
      const checkoutKey = normDetailDate(checkout);

      for (const rate of ratePlansData.data) {
        const detailed = rate.roomRateDetailed ?? [];
        if (detailed.length === 0) continue;

        // Per-day flags apply to that row's `date`. Using only the last row tied CTD on the
        // last *priced night* to the guest's checkout day and caused false "checkout blocked" banners.
        const byDate = new Map<string, (typeof detailed)[0]>();
        for (const row of detailed) {
          const k = normDetailDate(row?.date);
          if (k) byDate.set(k, row);
        }

        const checkinDay = byDate.get(checkinKey) ?? detailed[0];
        const checkoutDay = byDate.get(checkoutKey) ?? undefined;

        const restriction: RateRestriction = {
          closedToArrival: !!checkinDay?.closedToArrival,
          closedToDeparture: !!checkoutDay?.closedToDeparture,
          minLos: checkinDay?.minLos || 0,
          maxLos: checkinDay?.maxLos || 0,
        };

        restrictionByRateID.set(String(rate.rateID), restriction);

        const cancellation = extractRateCancellationFromPlan(rate as Record<string, unknown>);
        if (cancellation) {
          cancellationByRateID.set(String(rate.rateID), cancellation);
          if (!rate.isDerived && rate.roomTypeID) {
            baseCancellationByRoomType.set(String(rate.roomTypeID), cancellation);
          }
        }
      }
    }

    function mergeCancellationForRoom(rateID: string, roomTypeID: string): RateCancellation | null {
      return mergeCancellation(
        cancellationByRateID.get(rateID),
        baseCancellationByRoomType.get(roomTypeID)
      );
    }

    const propertyTermsAndConditions =
      typeof hotelDetailsData?.data?.propertyPolicy?.propertyTermsAndConditions === "string"
        ? hotelDetailsData.data.propertyPolicy.propertyTermsAndConditions.trim() || null
        : null;

    const propertyData = availabilityData?.data?.[0];
    if (!propertyData || !propertyData.propertyRooms) {
      console.log("No property rooms found in response, returning empty");
      return NextResponse.json({
        success: true,
        checkin,
        checkout,
        rooms: [],
        propertyTermsAndConditions,
      });
    }

    const currency = propertyData.propertyCurrency?.currencyCode || "MNT";
    const propertyRooms = propertyData.propertyRooms || [];

    const baseRates = new Map<string, number>();
    for (const room of propertyRooms) {
      if (!room.derivedType && !room.derivedValue) {
        baseRates.set(room.roomTypeID, stayTotalForRoom(room, adultsNum, childrenNum));
      }
    }

    const enrichedRooms = propertyRooms.map((room) => {
      const photos = (room.roomTypePhotos ?? [])
        .map((p) => {
          if (typeof p === "string") return p;
          return p?.image ?? p?.thumb ?? "";
        })
        .filter(Boolean);

      const fullStayTotal = stayTotalForRoom(room, adultsNum, childrenNum);
      
      let originalRate: number | undefined;
      if (room.derivedType && room.derivedValue) {
        const baseRate = baseRates.get(room.roomTypeID);
        if (baseRate) {
          originalRate = baseRate;
        } else {
          const pct = parseFloat(room.derivedValue);
          if (pct !== 0) {
            originalRate = Math.round(fullStayTotal / (1 + pct / 100));
          }
        }
      }

      const restrictionsForRate = restrictionByRateID.get(String(room.roomRateID)) ?? null;
      const mergedCancellation = mergeCancellationForRoom(String(room.roomRateID), String(room.roomTypeID));

      const maxGuestsValue =
        typeof room.maxGuests === "number"
          ? room.maxGuests
          : parseInt(room.maxGuests ?? "", 10);

      return {
        roomTypeID: room.roomTypeID,
        roomTypeName: room.roomTypeName,
        roomsAvailable: room.roomsAvailable || 0,
        rateID: room.roomRateID,
        rateName: room.ratePlanNamePublic || "Standard",
        totalRate: fullStayTotal,
        originalRate,
        currency: currency,
        description: room.roomTypeDescription || "",
        maxGuests: Number.isFinite(maxGuestsValue) && maxGuestsValue > 0 ? maxGuestsValue : 2,
        photos: photos,
        features: room.roomTypeFeatures || [],
        restrictions: restrictionsForRate,
        cancellation: mergedCancellation,
      };
    });

    return NextResponse.json({
      success: true,
      checkin,
      checkout,
      rooms: enrichedRooms,
      propertyTermsAndConditions,
    });
  } catch (error) {
    console.error("Cloudbeds availability error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
