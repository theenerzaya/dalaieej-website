import { NextRequest, NextResponse } from "next/server";

interface QPayWebhookPayload {
  payment_id: string;
  payment_status: string;
  payment_date: string;
  payment_amount: number;
  payment_currency: string;
  payment_wallet: string;
  sender_invoice_no: string;
  invoice_id: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload: QPayWebhookPayload = await request.json();

    console.log("QPay webhook received:", {
      invoiceId: payload.invoice_id,
      status: payload.payment_status,
      amount: payload.payment_amount,
      currency: payload.payment_currency,
      hasPaymentId: Boolean(payload.payment_id),
      hasSenderInvoiceNo: Boolean(payload.sender_invoice_no),
    });

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error("QPay webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "QPay webhook endpoint is running",
  });
}
