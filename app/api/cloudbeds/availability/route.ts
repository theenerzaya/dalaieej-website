import { NextRequest, NextResponse } from "next/server";
import { cloudbedsGet, AvailabilityResponse } from "@/app/lib/cloudbeds";

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
    
    const params: Record<string, string> = {
      startDate: checkin,
      endDate: checkout,
    };
    
    if (promo) {
      params.promoCode = promo;
      console.log("Applying promo code:", promo);
    }

    const availabilityData = await cloudbedsGet<any>("/getAvailableRoomTypes", params);

    console.log("Cloudbeds availability response:", JSON.stringify(availabilityData, null, 2));

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
