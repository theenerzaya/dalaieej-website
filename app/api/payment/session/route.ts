import { NextRequest, NextResponse } from "next/server";
import {
  paymentSessionPublicDetails,
  PaymentSessionError,
  verifyPaymentSession,
} from "@/lib/payment-session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = verifyPaymentSession(body.session);

    return NextResponse.json({
      success: true,
      ...paymentSessionPublicDetails(session),
    });
  } catch (error) {
    if (error instanceof PaymentSessionError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Payment session verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment session" },
      { status: 500 }
    );
  }
}
