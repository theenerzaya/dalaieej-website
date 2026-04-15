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
      cloudbedsGet<any>("/getAvailableRoomTypes", params),
      cloudbedsGet<any>("/getRatePlans", { ...params, detailedRates: "true" }).catch((err) => {
        console.error("Failed to fetch rate plan restrictions:", err);
        return null;
      }),
      cloudbedsGet<any>("/getHotelDetails", {}).catch((err) => {
        console.error("Failed to fetch hotel details:", err);
        return null;
      }),
    ]);

    console.log("Cloudbeds availability response:", JSON.stringify(availabilityData, null, 2));
    console.log("Cloudbeds ratePlans response:", JSON.stringify(ratePlansData, null, 2));

    const restrictionByRateID = new Map<string, RateRestriction>();
    const baseRestrictionByRoomType = new Map<string, RateRestriction>();
    const cancellationByRateID = new Map<string, RateCancellation>();
    const baseCancellationByRoomType = new Map<string, RateCancellation>();

    if (ratePlansData?.data) {
      for (const rate of ratePlansData.data) {
        const detailed: any[] = rate.roomRateDetailed || [];
        if (detailed.length === 0) continue;

        const checkinDay = detailed[0];
        const lastDay = detailed[detailed.length - 1];

        const restriction: RateRestriction = {
          closedToArrival: !!checkinDay?.closedToArrival,
          closedToDeparture: !!lastDay?.closedToDeparture,
          minLos: checkinDay?.minLos || 0,
          maxLos: checkinDay?.maxLos || 0,
        };

        restrictionByRateID.set(String(rate.rateID), restriction);

        if (!rate.isDerived && rate.roomTypeID) {
          baseRestrictionByRoomType.set(String(rate.roomTypeID), restriction);
        }

        const cancellation = extractRateCancellationFromPlan(rate as Record<string, unknown>);
        if (cancellation) {
          cancellationByRateID.set(String(rate.rateID), cancellation);
          if (!rate.isDerived && rate.roomTypeID) {
            baseCancellationByRoomType.set(String(rate.roomTypeID), cancellation);
          }
        }
      }
    }

    function mergeRestrictions(rateID: string, roomTypeID: string): RateRestriction | null {
      const derived = restrictionByRateID.get(rateID);
      const base = baseRestrictionByRoomType.get(roomTypeID);
      if (!derived && !base) return null;
      if (!base) return derived!;
      if (!derived) return base;
      return {
        closedToArrival: derived.closedToArrival || base.closedToArrival,
        closedToDeparture: derived.closedToDeparture || base.closedToDeparture,
        minLos: Math.max(derived.minLos, base.minLos),
        maxLos: derived.maxLos > 0 && base.maxLos > 0
          ? Math.min(derived.maxLos, base.maxLos)
          : derived.maxLos || base.maxLos,
      };
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

    const enrichedRooms = propertyRooms.map((room: any) => {
      const photos = (room.roomTypePhotos || []).map((p: any) => 
        typeof p === 'string' ? p : p.image || p.thumb || ''
      ).filter(Boolean);

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

      const mergedRestriction = mergeRestrictions(String(room.roomRateID), String(room.roomTypeID));
      const mergedCancellation = mergeCancellationForRoom(String(room.roomRateID), String(room.roomTypeID));

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
        maxGuests: parseInt(room.maxGuests) || 2,
        photos: photos,
        features: room.roomTypeFeatures || [],
        restrictions: mergedRestriction,
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
