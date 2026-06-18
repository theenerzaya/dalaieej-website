import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  randomUUID,
} from "crypto";

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;

export type PaymentSessionPayload = {
  v: 1;
  sessionId: string;
  reservationId: string;
  amountMnt: number;
  totalAmountMnt: number;
  currency: string;
  guestName: string;
  nights: number;
  iat: number;
  exp: number;
};

export type QPayInvoiceSessionPayload = {
  v: 1;
  kind: "qpay-invoice";
  invoiceId: string;
  paymentSessionId: string;
  reservationId: string;
  amountMnt: number;
  iat: number;
  exp: number;
};

type CreatePaymentSessionInput = {
  reservationId: string;
  amountMnt: number;
  totalAmountMnt: number;
  currency: string;
  guestName: string;
  nights: number;
};

type SessionOptions = {
  now?: number;
  ttlMs?: number;
};

type CreateQPayInvoiceSessionInput = {
  invoiceId: string;
  paymentSessionId: string;
  reservationId: string;
  amountMnt: number;
};

export class PaymentSessionError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "PaymentSessionError";
    this.status = status;
  }
}

function getPaymentSessionSecret(): string {
  const secret =
    process.env.PAYMENT_SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.STRIPE_SECRET_KEY ||
    process.env.CLOUDBEDS_API_KEY ||
    "";

  if (secret.length >= 16) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new PaymentSessionError("Payment session signing secret is not configured", 500);
  }

  return "development-payment-session-secret";
}

function encryptionKey(): Buffer {
  return createHash("sha256").update(getPaymentSessionSecret()).digest();
}

function createEncryptedPayload(payload: unknown): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const plaintext = JSON.stringify(payload);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [
    "ps1",
    iv.toString("base64url"),
    ciphertext.toString("base64url"),
    tag.toString("base64url"),
  ].join(".");
}

function verifyEncryptedPayload(token: unknown): unknown {
  if (typeof token !== "string" || token.length > 8192) {
    throw new PaymentSessionError("Payment session is required");
  }

  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "ps1" || !parts[1] || !parts[2] || !parts[3]) {
    throw new PaymentSessionError("Invalid payment session");
  }

  try {
    const iv = Buffer.from(parts[1], "base64url");
    const ciphertext = Buffer.from(parts[2], "base64url");
    const tag = Buffer.from(parts[3], "base64url");
    const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString("utf8");
    return JSON.parse(plaintext);
  } catch {
    throw new PaymentSessionError("Invalid payment session");
  }
}

function positiveInteger(value: unknown, label: string): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n) || n <= 0) {
    throw new PaymentSessionError(`Invalid payment session ${label}`, 500);
  }
  return n;
}

function validatePayload(value: unknown): PaymentSessionPayload {
  if (!value || typeof value !== "object") {
    throw new PaymentSessionError("Invalid payment session");
  }

  const payload = value as Partial<PaymentSessionPayload>;
  const reservationId = String(payload.reservationId || "").trim();
  const sessionId = String(payload.sessionId || "").trim();
  const currency = String(payload.currency || "").trim() || "MNT";
  const guestName = String(payload.guestName || "").trim();
  const iat = Number(payload.iat);
  const exp = Number(payload.exp);

  if (payload.v !== 1 || !sessionId || !reservationId) {
    throw new PaymentSessionError("Invalid payment session");
  }
  if (!Number.isFinite(iat) || !Number.isFinite(exp) || exp <= iat) {
    throw new PaymentSessionError("Invalid payment session expiry");
  }

  return {
    v: 1,
    sessionId,
    reservationId,
    amountMnt: positiveInteger(payload.amountMnt, "amount"),
    totalAmountMnt: positiveInteger(payload.totalAmountMnt, "total"),
    currency,
    guestName,
    nights: positiveInteger(payload.nights, "nights"),
    iat,
    exp,
  };
}

function validateQPayInvoicePayload(value: unknown): QPayInvoiceSessionPayload {
  if (!value || typeof value !== "object") {
    throw new PaymentSessionError("Invalid QPay invoice session");
  }

  const payload = value as Partial<QPayInvoiceSessionPayload>;
  const invoiceId = String(payload.invoiceId || "").trim();
  const paymentSessionId = String(payload.paymentSessionId || "").trim();
  const reservationId = String(payload.reservationId || "").trim();
  const iat = Number(payload.iat);
  const exp = Number(payload.exp);

  if (
    payload.v !== 1 ||
    payload.kind !== "qpay-invoice" ||
    !invoiceId ||
    !paymentSessionId ||
    !reservationId
  ) {
    throw new PaymentSessionError("Invalid QPay invoice session");
  }
  if (!Number.isFinite(iat) || !Number.isFinite(exp) || exp <= iat) {
    throw new PaymentSessionError("Invalid QPay invoice session expiry");
  }

  return {
    v: 1,
    kind: "qpay-invoice",
    invoiceId,
    paymentSessionId,
    reservationId,
    amountMnt: positiveInteger(payload.amountMnt, "amount"),
    iat,
    exp,
  };
}

export function createPaymentSession(
  input: CreatePaymentSessionInput,
  options: SessionOptions = {}
): string {
  const now = options.now ?? Date.now();
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  const payload: PaymentSessionPayload = {
    v: 1,
    sessionId: randomUUID(),
    reservationId: String(input.reservationId || "").trim(),
    amountMnt: positiveInteger(input.amountMnt, "amount"),
    totalAmountMnt: positiveInteger(input.totalAmountMnt, "total"),
    currency: String(input.currency || "MNT").trim() || "MNT",
    guestName: String(input.guestName || "").trim(),
    nights: positiveInteger(input.nights, "nights"),
    iat: now,
    exp: now + ttlMs,
  };

  if (!payload.reservationId) {
    throw new PaymentSessionError("Reservation ID is required for payment", 500);
  }

  return createEncryptedPayload(payload);
}

export function verifyPaymentSession(
  token: unknown,
  options: { now?: number } = {}
): PaymentSessionPayload {
  const payload = validatePayload(verifyEncryptedPayload(token));
  const now = options.now ?? Date.now();
  if (payload.exp < now) {
    throw new PaymentSessionError("Payment session has expired", 410);
  }

  return payload;
}

export function createQPayInvoiceSession(
  input: CreateQPayInvoiceSessionInput,
  options: SessionOptions = {}
): string {
  const now = options.now ?? Date.now();
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  const payload: QPayInvoiceSessionPayload = {
    v: 1,
    kind: "qpay-invoice",
    invoiceId: String(input.invoiceId || "").trim(),
    paymentSessionId: String(input.paymentSessionId || "").trim(),
    reservationId: String(input.reservationId || "").trim(),
    amountMnt: positiveInteger(input.amountMnt, "amount"),
    iat: now,
    exp: now + ttlMs,
  };

  if (!payload.invoiceId || !payload.paymentSessionId || !payload.reservationId) {
    throw new PaymentSessionError("QPay invoice details are incomplete", 500);
  }

  return createEncryptedPayload(payload);
}

export function verifyQPayInvoiceSession(
  token: unknown,
  options: { now?: number } = {}
): QPayInvoiceSessionPayload {
  const payload = validateQPayInvoicePayload(verifyEncryptedPayload(token));
  const now = options.now ?? Date.now();
  if (payload.exp < now) {
    throw new PaymentSessionError("QPay invoice session has expired", 410);
  }

  return payload;
}

export function paymentSessionFingerprint(token: string): string {
  return createHash("sha256").update(token).digest("hex").slice(0, 24);
}

export function paymentSessionPublicDetails(payload: PaymentSessionPayload) {
  return {
    sessionId: payload.sessionId,
    reservationId: payload.reservationId,
    amountMnt: payload.amountMnt,
    totalAmountMnt: payload.totalAmountMnt,
    currency: payload.currency,
    guestName: payload.guestName,
    nights: payload.nights,
    expiresAt: payload.exp,
  };
}
