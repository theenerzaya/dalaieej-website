import { NextRequest, NextResponse } from "next/server";
import { cloudbedsGet } from "@/lib/cloudbeds";

interface RateRestriction {
  closedToArrival: boolean;
  closedToDeparture: boolean;
  minLos: number;
  maxLos: number;
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
    
    const params: Record<string, string> = {
      startDate: checkin,
      endDate: checkout,
    };
    
    if (promo) {
      params.promoCode = promo;
      console.log("Applying promo code:", promo);
    }
    if (adults) params.adults = adults;
    if (children) params.children = children;

    const [availabilityData, ratePlansData] = await Promise.all([
      cloudbedsGet<any>("/getAvailableRoomTypes", params),
      cloudbedsGet<any>("/getRatePlans", { ...params, detailedRates: "true" }).catch((err) => {
        console.error("Failed to fetch rate plan restrictions:", err);
        return null;
      }),
    ]);

    console.log("Cloudbeds availability response:", JSON.stringify(availabilityData, null, 2));
    console.log("Cloudbeds ratePlans response:", JSON.stringify(ratePlansData, null, 2));

    const restrictionByRateID = new Map<string, RateRestriction>();
    const baseRestrictionByRoomType = new Map<string, RateRestriction>();

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

    const propertyData = availabilityData?.data?.[0];
    if (!propertyData || !propertyData.propertyRooms) {
      console.log("No property rooms found in response, returning empty");
      return NextResponse.json({
        success: true,
        checkin,
        checkout,
        rooms: [],
      });
    }

    const currency = propertyData.propertyCurrency?.currencyCode || "MNT";
    const propertyRooms = propertyData.propertyRooms || [];

    const baseRates = new Map<string, number>();
    for (const room of propertyRooms) {
      if (!room.derivedType && !room.derivedValue) {
        baseRates.set(room.roomTypeID, room.roomRate || 0);
      }
    }

    const enrichedRooms = propertyRooms.map((room: any) => {
      const photos = (room.roomTypePhotos || []).map((p: any) => 
        typeof p === 'string' ? p : p.image || p.thumb || ''
      ).filter(Boolean);
      
      let originalRate: number | undefined;
      if (room.derivedType && room.derivedValue) {
        const baseRate = baseRates.get(room.roomTypeID);
        if (baseRate) {
          originalRate = baseRate;
        } else {
          const pct = parseFloat(room.derivedValue);
          if (pct !== 0) {
            originalRate = Math.round((room.roomRate || 0) / (1 + pct / 100));
          }
        }
      }

      const mergedRestriction = mergeRestrictions(String(room.roomRateID), String(room.roomTypeID));

      return {
        roomTypeID: room.roomTypeID,
        roomTypeName: room.roomTypeName,
        roomsAvailable: room.roomsAvailable || 0,
        rateID: room.roomRateID,
        rateName: room.ratePlanNamePublic || "Standard",
        totalRate: room.roomRate || 0,
        originalRate,
        currency: currency,
        description: room.roomTypeDescription || "",
        maxGuests: parseInt(room.maxGuests) || 2,
        photos: photos,
        features: room.roomTypeFeatures || [],
        restrictions: mergedRestriction,
      };
    });

    return NextResponse.json({
      success: true,
      checkin,
      checkout,
      rooms: enrichedRooms,
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
