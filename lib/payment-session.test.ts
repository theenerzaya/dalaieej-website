import { describe, expect, it } from "vitest";
import {
  createPaymentSession,
  createQPayInvoiceSession,
  paymentSessionFingerprint,
  verifyQPayInvoiceSession,
  verifyPaymentSession,
} from "./payment-session";

describe("payment sessions", () => {
  it("round-trips signed booking payment details", () => {
    process.env.PAYMENT_SESSION_SECRET = "test-payment-session-secret";
    const token = createPaymentSession(
      {
        reservationId: "ABC123",
        amountMnt: 250000,
        totalAmountMnt: 500000,
        currency: "MNT",
        guestName: "Test Guest",
        nights: 4,
      },
      { now: 1000, ttlMs: 60_000 }
    );

    const payload = verifyPaymentSession(token, { now: 2000 });
    expect(payload.reservationId).toBe("ABC123");
    expect(payload.amountMnt).toBe(250000);
    expect(payload.totalAmountMnt).toBe(500000);
    expect(payload.nights).toBe(4);
    expect(token).not.toContain("ABC123");
    expect(token).not.toContain("Test Guest");
  });

  it("rejects tampered tokens", () => {
    process.env.PAYMENT_SESSION_SECRET = "test-payment-session-secret";
    const token = createPaymentSession(
      {
        reservationId: "ABC123",
        amountMnt: 250000,
        totalAmountMnt: 500000,
        currency: "MNT",
        guestName: "Test Guest",
        nights: 4,
      },
      { now: 1000, ttlMs: 60_000 }
    );

    const parts = token.split(".");
    parts[3] = `${parts[3].startsWith("A") ? "B" : "A"}${parts[3].slice(1)}`;
    const tamperedToken = parts.join(".");

    expect(() => verifyPaymentSession(tamperedToken, { now: 2000 })).toThrow(
      "Invalid payment session"
    );
  });

  it("rejects expired tokens", () => {
    process.env.PAYMENT_SESSION_SECRET = "test-payment-session-secret";
    const token = createPaymentSession(
      {
        reservationId: "ABC123",
        amountMnt: 250000,
        totalAmountMnt: 500000,
        currency: "MNT",
        guestName: "Test Guest",
        nights: 4,
      },
      { now: 1000, ttlMs: 60_000 }
    );

    expect(() => verifyPaymentSession(token, { now: 61_001 })).toThrow(
      "Payment session has expired"
    );
  });

  it("creates a short non-secret fingerprint for metadata", () => {
    expect(paymentSessionFingerprint("example-token")).toHaveLength(24);
  });

  it("round-trips a QPay invoice token bound to a payment session", () => {
    process.env.PAYMENT_SESSION_SECRET = "test-payment-session-secret";
    const token = createQPayInvoiceSession(
      {
        invoiceId: "invoice-123",
        paymentSessionId: "session-123",
        reservationId: "ABC123",
        amountMnt: 250000,
      },
      { now: 1000, ttlMs: 60_000 }
    );

    const payload = verifyQPayInvoiceSession(token, { now: 2000 });
    expect(payload.invoiceId).toBe("invoice-123");
    expect(payload.paymentSessionId).toBe("session-123");
    expect(payload.reservationId).toBe("ABC123");
    expect(payload.amountMnt).toBe(250000);
  });
});
