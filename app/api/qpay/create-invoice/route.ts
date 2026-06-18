import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  createQPayInvoiceSession,
  PaymentSessionError,
  verifyPaymentSession,
} from "@/lib/payment-session";

const QPAY_AUTH_URL = "https://merchant.qpay.mn/v2/auth/token";
const QPAY_INVOICE_URL = "https://merchant.qpay.mn/v2/invoice";

interface InvoiceRequest {
  amount?: number;
  description?: string;
  callbackUrl?: string;
  /** Browser `window.location.origin` — used when reverse proxies omit x-forwarded-proto. */
  siteOrigin?: string;
  session?: string;
}

function normalizeBaseUrl(base: string): string {
  return base.replace(/\/+$/, "").trim();
}

/** Hosts that cannot be used as QPay callback bases (local / RFC1918). */
function isNonPublicHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h === "127.0.0.1" || h === "::1" || h === "0.0.0.0") return true;
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
  return false;
}

/** Public origin for server-side callbacks (QPay webhook). */
function getConfiguredPublicBaseUrl(): string {
  const explicit = normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_URL || "");
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return normalizeBaseUrl(`https://${vercel.replace(/^https?:\/\//, "")}`);
  }
  return "";
}

/**
 * HTTPS origin the client used to reach this app (tunnel, production, Vercel URL).
 * For public hostnames, assumes https when TLS terminates at the edge and x-forwarded-proto
 * is missing (common); still requires https for QPay.
 */
function getPublicOriginFromRequest(request: NextRequest): string | null {
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const hostHeader = request.headers.get("host")?.split(",")[0]?.trim();
  const host = forwardedHost || hostHeader;
  if (!host) return null;

  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  if (isNonPublicHostname(hostname)) {
    return null;
  }

  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();

  let proto: string;
  if (forwardedProto === "https" || forwardedProto === "http") {
    proto = forwardedProto;
  } else if (request.nextUrl.protocol === "https:") {
    proto = "https";
  } else {
    proto = "https";
  }

  if (proto !== "https") {
    return null;
  }

  return normalizeBaseUrl(`https://${host}`);
}

/**
 * QPay requires a public HTTPS callback. Localhost and relative URLs are rejected by their API.
 * Prefers the request's public origin so the webhook matches where the app is actually opened.
 */
function resolveQPayWebhookUrl(
  explicitCallback: string | undefined,
  request: NextRequest,
  siteOrigin?: string | undefined
): string {
  const trimmed = explicitCallback?.trim();
  if (trimmed) {
    return trimmed;
  }
  /** Full webhook URL QPay must accept — use when the portal only allows an exact host (www vs apex). */
  const envCallback = normalizeBaseUrl(process.env.QPAY_CALLBACK_URL || "").trim();
  if (envCallback) {
    return envCallback;
  }
  const fromRequest = getPublicOriginFromRequest(request);
  if (fromRequest) {
    return `${fromRequest}/api/qpay/webhook`;
  }
  const clientOrigin = normalizeBaseUrl(siteOrigin?.trim() || "");
  if (clientOrigin) {
    return `${clientOrigin}/api/qpay/webhook`;
  }
  const base = getConfiguredPublicBaseUrl();
  return `${base}/api/qpay/webhook`;
}

function validateQPayCallbackUrl(callbackUrl: string):
  | { ok: true; url: string }
  | { ok: false; message: string } {
  let parsed: URL;
  try {
    parsed = new URL(callbackUrl);
  } catch {
    return {
      ok: false,
      message:
        "Invalid QPay callback_url: no public HTTPS origin was resolved (often http://localhost). Use an HTTPS tunnel or production URL in the browser, set NEXT_PUBLIC_BASE_URL to that https origin, or pass callbackUrl. On Vercel, VERCEL_URL applies when unset.",
    };
  }

  if (parsed.protocol !== "https:") {
    return {
      ok: false,
      message:
        "Invalid QPay callback_url: QPay requires https://. Use a public HTTPS base URL (e.g. production domain or an HTTPS tunnel for local development).",
    };
  }

  const host = parsed.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "127.0.0.1" ||
    host === "::1"
  ) {
    return {
      ok: false,
      message:
        "Invalid QPay callback_url: localhost is not allowed. Use your public https URL in the browser (tunnel or production), or set NEXT_PUBLIC_BASE_URL to that origin.",
    };
  }

  return { ok: true, url: parsed.toString() };
}

interface QPayTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface QPayInvoiceResponse {
  invoice_id: string;
  qr_text: string;
  qr_image: string;
  qPay_shortUrl: string;
  urls: Array<{
    name: string;
    description: string;
    logo: string;
    link: string;
  }>;
}

type QPayInvoicePayload = {
  success: true;
  invoiceId: string;
  invoiceToken: string;
  qrCode: string;
  qrText: string;
  shortUrl: string;
  bankUrls: QPayInvoiceResponse["urls"];
  idempotentReplay?: boolean;
};

const QPAY_INVOICE_CACHE_TTL_MS = 30 * 60 * 1000;
const qpayInvoiceCache = new Map<
  string,
  { expiresAt: number; response: QPayInvoicePayload }
>();

function cleanQPayInvoiceCache() {
  const now = Date.now();
  for (const [key, entry] of qpayInvoiceCache.entries()) {
    if (entry.expiresAt <= now) qpayInvoiceCache.delete(key);
  }
}

async function getQPayToken(): Promise<string> {
  const username = process.env.QPAY_USERNAME;
  const password = process.env.QPAY_PASSWORD;

  if (!username || !password) {
    throw new Error("QPay credentials not configured");
  }

  const credentials = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await axios.post<QPayTokenResponse>(
      QPAY_AUTH_URL,
      {},
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("QPay token obtained successfully");
    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("QPay Auth Error:", error.response?.data || error.message);
    }
    throw error;
  }
}

async function createInvoice(
  token: string,
  amount: number,
  description: string,
  callbackUrl: string,
  senderInvoiceNo?: string
): Promise<QPayInvoiceResponse> {
  const invoiceCode = process.env.QPAY_INVOICE_CODE || "DALAI_EEJ_INVOICE";
  const senderCode = senderInvoiceNo || uuidv4();

  console.log("Creating QPay invoice:", {
    invoice_code: invoiceCode,
    amount: amount,
    hasCallbackUrl: Boolean(callbackUrl),
  });

  try {
    const response = await axios.post<QPayInvoiceResponse>(
      QPAY_INVOICE_URL,
      {
        invoice_code: invoiceCode,
        sender_invoice_no: senderCode,
        invoice_receiver_code: "terminal",
        invoice_description: description,
        amount: amount,
        callback_url: callbackUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("QPay invoice created successfully:", response.data.invoice_id);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("QPay Invoice Error:", error.response?.data || error.message);
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: InvoiceRequest = await request.json();
    const {
      description,
      callbackUrl,
      siteOrigin,
      session: sessionToken,
    } = body;
    const session = verifyPaymentSession(sessionToken);
    const amount = session.amountMnt;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount provided" },
        { status: 400 }
      );
    }

    const webhookCandidate = resolveQPayWebhookUrl(
      callbackUrl,
      request,
      siteOrigin
    );
    const validated = validateQPayCallbackUrl(webhookCandidate);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.message }, { status: 400 });
    }

    cleanQPayInvoiceCache();
    const cached = qpayInvoiceCache.get(session.sessionId);
    if (cached) {
      return NextResponse.json({ ...cached.response, idempotentReplay: true });
    }

    const token = await getQPayToken();
    const invoice = await createInvoice(
      token,
      amount,
      description?.trim() || `Dalai Eej Resort - Booking ${session.reservationId}`,
      validated.url,
      session.sessionId
    );

    const responsePayload: QPayInvoicePayload = {
      success: true,
      invoiceId: invoice.invoice_id,
      invoiceToken: createQPayInvoiceSession({
        invoiceId: invoice.invoice_id,
        paymentSessionId: session.sessionId,
        reservationId: session.reservationId,
        amountMnt: session.amountMnt,
      }),
      qrCode: invoice.qr_image,
      qrText: invoice.qr_text,
      shortUrl: invoice.qPay_shortUrl,
      bankUrls: invoice.urls,
    };
    qpayInvoiceCache.set(session.sessionId, {
      expiresAt: Date.now() + QPAY_INVOICE_CACHE_TTL_MS,
      response: responsePayload,
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("QPay invoice creation error:", error);

    if (error instanceof PaymentSessionError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (axios.isAxiosError(error)) {
      const qpayError = error.response?.data;
      const statusCode = error.response?.status || 500;
      
      console.error("QPay API response:", {
        status: statusCode,
        message:
          typeof qpayError === "object" && qpayError != null && "message" in qpayError
            ? String((qpayError as { message?: unknown }).message)
            : String(qpayError || error.message),
        url: error.config?.url,
      });

      let userMessage = "Failed to create QPay invoice";
      const errorDetail = typeof qpayError === 'object' 
        ? JSON.stringify(qpayError) 
        : String(qpayError || 'Unknown error');
      if (statusCode === 401) {
        userMessage = "QPay authentication failed - invalid credentials";
      } else if (statusCode === 400) {
        userMessage = `QPay rejected the request: ${errorDetail}`;
        if (
          /callback_url/i.test(errorDetail) &&
          /invalid/i.test(errorDetail)
        ) {
          userMessage +=
            " Register the exact callback URL in the QPay merchant settings (www vs non-www must match what you send). On the server, set QPAY_CALLBACK_URL to the full https URL QPay expects, e.g. https://www.dalaieej.mn/api/qpay/webhook";
        }
      } else {
        userMessage = `QPay error (${statusCode}): ${errorDetail}`;
      }

      return NextResponse.json(
        {
          error: userMessage,
          details: qpayError,
          statusCode,
        },
        { status: statusCode }
      );
    }

    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    );
  }
}
