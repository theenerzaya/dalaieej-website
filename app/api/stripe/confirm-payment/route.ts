import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  cloudbedsErrorMessage,
  confirmCloudbedsReservation,
} from "@/lib/cloudbeds-reservations";
import { getMntToEurRate, mntToEurCents } from "@/lib/payment-amounts";
import {
  paymentSessionFingerprint,
  PaymentSessionError,
  verifyPaymentSession,
} from "@/lib/payment-session";

let stripeClient: Stripe | null = null;

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not configured");
  }
  stripeClient ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripeClient;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paymentIntentId = String(body.paymentIntentId || "").trim();
    const sessionToken = String(body.session || "");
    const session = verifyPaymentSession(sessionToken);

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment intent is required" },
        { status: 400 }
      );
    }

    const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        {
          error: `Payment has not succeeded yet (${paymentIntent.status})`,
          paymentStatus: paymentIntent.status,
        },
        { status: 409 }
      );
    }

    if (paymentIntent.metadata.bookingId !== session.reservationId) {
      return NextResponse.json(
        { error: "Payment does not match this booking reference" },
        { status: 400 }
      );
    }

    if (paymentIntent.metadata.paymentSessionId !== session.sessionId) {
      return NextResponse.json(
        { error: "Payment does not match this payment session" },
        { status: 400 }
      );
    }

    const fingerprint = paymentSessionFingerprint(sessionToken);
    if (
      paymentIntent.metadata.paymentSessionFingerprint &&
      paymentIntent.metadata.paymentSessionFingerprint !== fingerprint
    ) {
      return NextResponse.json(
        { error: "Payment session fingerprint mismatch" },
        { status: 400 }
      );
    }

    const paymentRate = Number(paymentIntent.metadata.mntToEurRate) || getMntToEurRate();
    if (paymentIntent.amount !== mntToEurCents(session.amountMnt, paymentRate)) {
      return NextResponse.json(
        { error: "Payment amount does not match the booking deposit" },
        { status: 400 }
      );
    }

    const confirmation = await confirmCloudbedsReservation(session.reservationId);

    return NextResponse.json({
      success: true,
      paymentStatus: paymentIntent.status,
      paymentIntentId,
      reservationId: confirmation.reservationId,
      reservationStatus: confirmation.status,
    });
  } catch (error) {
    console.error(
      "Stripe payment confirmation error:",
      error instanceof Error ? error.message : error
    );

    if (error instanceof PaymentSessionError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    return NextResponse.json(
      { error: cloudbedsErrorMessage(error, "Payment verified but reservation confirmation failed") },
      { status: 502 }
    );
  }
}
