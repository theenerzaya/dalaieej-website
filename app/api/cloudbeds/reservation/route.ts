import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import qs from "qs";
import { normalizeCloudbedsRoomTypeID } from "@/lib/cloudbeds";

const CLOUDBEDS_API_BASE = "https://hotels.cloudbeds.com/api/v1.2";

interface RoomBooking {
  roomTypeID: string;
  roomRateID?: string;
  quantity: number;
  adults: number;
  children: number;
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
    } = body;

    if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
      return NextResponse.json(
        { error: "At least one room is required" },
        { status: 400 }
      );
    }

    if (!checkin || !checkout || !guestFirstName || !guestLastName || !guestEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const roomList = (rooms as RoomBooking[]).map((room) => ({
      ...room,
      roomTypeID: normalizeCloudbedsRoomTypeID(room.roomTypeID),
    }));

    const payloadObj: Record<string, unknown> = {
      propertyID: propertyId,
      startDate: checkin,
      endDate: checkout,
      guestFirstName,
      guestLastName,
      guestEmail,
      source: "Website",
      status: "not_confirmed",
      paymentMethod: "bank_transfer",
      rooms: roomList.map((room) => ({
        roomTypeID: room.roomTypeID,
        ...(room.roomRateID && { roomRateID: room.roomRateID }),
        quantity: room.quantity || 1,
      })),
      adults: roomList.map((room) => ({
        roomTypeID: room.roomTypeID,
        quantity: parseInt(String(room.adults)) || 1,
      })),
      children: roomList.map((room) => ({
        roomTypeID: room.roomTypeID,
        quantity: parseInt(String(room.children)) || 0,
      })),
    };

    if (guestPhone) payloadObj.guestPhone = guestPhone;
    if (guestCountry) {
      payloadObj.guestCountry = guestCountry.length === 2 ? guestCountry : "MN";
    }
    if (specialRequests) payloadObj.customNotes = specialRequests;

    const formattedBody = qs.stringify(payloadObj, { arrayFormat: "indices" });

    console.log("Final Cloudbeds Payload:", formattedBody);

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

    console.log("Cloudbeds reservation response:", JSON.stringify(response.data, null, 2));

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Failed to create reservation");
    }

    const reservationId = response.data.reservationID || response.data.data?.reservationID;

    if (addons && addons.length > 0 && reservationId) {
      for (const addon of addons) {
        try {
          const chargePayload = {
            propertyID: propertyId,
            reservationID: reservationId,
            itemID: addon.id,
            quantity: addon.quantity || 1,
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

    return NextResponse.json({
      success: true,
      reservationId,
      guestName: `${guestFirstName} ${guestLastName}`,
      totalAmount,
      message: "Reservation created successfully",
    });
  } catch (error) {
    console.error("Cloudbeds reservation error:", error);

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
