import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
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
    const sessionToken = String(body.session || "");
    const session = verifyPaymentSession(sessionToken);
    const amount = session.amountMnt;

    const mntToEurRate = getMntToEurRate();
    const amountInEur = mntToEurCents(amount, mntToEurRate);

    if (amountInEur < 50) {
      return NextResponse.json(
        { error: "Amount too small for Stripe payment (minimum 0.50 EUR)" },
        { status: 400 }
      );
    }

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: amountInEur,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bookingId: session.reservationId,
        guestName: session.guestName,
        originalAmountMNT: amount.toString(),
        mntToEurRate: String(mntToEurRate),
        paymentSessionId: session.sessionId,
        paymentSessionFingerprint: paymentSessionFingerprint(sessionToken),
      },
      description: `Dalai Eej Resort - Booking ${session.reservationId}`,
    }, {
      idempotencyKey: `payment-session-${session.sessionId}`,
    });

    const amountEurDisplay = (amountInEur / 100).toFixed(2);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amountEur: amountEurDisplay,
      amountMnt: amount,
      bookingId: session.reservationId,
    });
  } catch (error) {
    console.error("Stripe payment intent error:", error);

    if (error instanceof PaymentSessionError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
