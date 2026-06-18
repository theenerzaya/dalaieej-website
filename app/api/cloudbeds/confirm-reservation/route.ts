import { NextRequest, NextResponse } from "next/server";
import {
  cloudbedsErrorMessage,
  confirmCloudbedsReservation,
} from "@/lib/cloudbeds-reservations";

export async function POST(request: NextRequest) {
  try {
    const confirmSecret = process.env.CLOUDBEDS_CONFIRM_SECRET;
    const suppliedSecret = request.headers.get("x-cloudbeds-confirm-secret");

    if (!confirmSecret || suppliedSecret !== confirmSecret) {
      return NextResponse.json(
        { error: "Reservation confirmation is restricted to verified payment flows" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { reservationId } = body;

    if (!reservationId) {
      return NextResponse.json(
        { error: "Reservation ID is required" },
        { status: 400 }
      );
    }

    return NextResponse.json(await confirmCloudbedsReservation(reservationId));
  } catch (error) {
    console.error("Cloudbeds confirm reservation error:", error instanceof Error ? error.message : error);

    return NextResponse.json(
      { error: cloudbedsErrorMessage(error, "Failed to confirm reservation") },
      { status: 500 }
    );
  }
}
