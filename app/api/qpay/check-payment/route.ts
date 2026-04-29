import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const QPAY_AUTH_URL = "https://merchant.qpay.mn/v2/auth/token";
const QPAY_CHECK_URL = "https://merchant.qpay.mn/v2/payment/check";

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

type QPayCheckRow = {
  payment_status?: string;
  payment_amount?: string | number;
};

type QPayCheckResponse = {
  rows?: QPayCheckRow[];
  paid_amount?: string | number;
  count?: number;
};

async function getQPayToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const username = process.env.QPAY_USERNAME;
  const password = process.env.QPAY_PASSWORD;

  if (!username || !password) {
    throw new Error("QPay credentials not configured");
  }

  const credentials = Buffer.from(`${username}:${password}`).toString("base64");

  const response = await axios.post(
    QPAY_AUTH_URL,
    {},
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in ? response.data.expires_in * 1000 - 60000 : 3500000);

  return cachedToken!;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId, expectedAmount } = body;

    if (!invoiceId) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    const token = await getQPayToken();

    const response = await axios.post(
      QPAY_CHECK_URL,
      {
        object_type: "INVOICE",
        object_id: invoiceId,
        offset: {
          page_number: 1,
          page_limit: 100,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data as QPayCheckResponse;
    const paidRow = data.rows?.find((row) => row.payment_status === "PAID");
    let isPaid = !!paidRow;

    if (isPaid && expectedAmount && paidRow) {
      const paidAmt = parseFloat(paidRow.payment_amount);
      if (paidAmt < expectedAmount) {
        isPaid = false;
      }
    }

    return NextResponse.json({
      success: true,
      paid: isPaid,
      paidAmount: data.paid_amount || 0,
      count: data.count || 0,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      cachedToken = null;
      tokenExpiry = 0;
    }

    console.error("QPay payment check error:", error instanceof Error ? error.message : error);

    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}
