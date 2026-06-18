import { describe, expect, it } from "vitest";
import {
  createPendingPaymentNote,
  extractReservationRows,
  shouldCancelUnpaidReservation,
  WEBSITE_PAYMENT_PENDING_MARKER,
} from "./cloudbeds-unpaid-cleanup";

describe("cloudbeds unpaid reservation cleanup", () => {
  const nowMs = Date.parse("2026-07-01T12:00:00.000Z");

  it("adds an expiring website payment marker to notes", () => {
    const note = createPendingPaymentNote(
      "Guest requested lake view",
      new Date("2026-07-01T12:30:00.000Z")
    );

    expect(note).toContain("Guest requested lake view");
    expect(note).toContain(WEBSITE_PAYMENT_PENDING_MARKER);
    expect(note).toContain("2026-07-01T12:30:00.000Z");
  });

  it("cancels marked unpaid reservations after the payment window expires", () => {
    const decision = shouldCancelUnpaidReservation(
      {
        reservationID: "ABC123",
        status: "not_confirmed",
        customNotes: `[${WEBSITE_PAYMENT_PENDING_MARKER} expires=2026-07-01T11:59:00.000Z]`,
      },
      { nowMs, cancelAfterMs: 30 * 60 * 1000, unpaidStatus: "not_confirmed" }
    );

    expect(decision).toEqual({
      cancel: true,
      reservationId: "ABC123",
      reason: "website payment window expired",
    });
  });

  it("keeps marked unpaid reservations while the payment window is open", () => {
    const decision = shouldCancelUnpaidReservation(
      {
        reservationID: "ABC123",
        status: "not_confirmed",
        customNotes: `[${WEBSITE_PAYMENT_PENDING_MARKER} expires=2026-07-01T12:01:00.000Z]`,
      },
      { nowMs, cancelAfterMs: 30 * 60 * 1000, unpaidStatus: "not_confirmed" }
    );

    expect(decision).toEqual({
      cancel: false,
      reason: "website payment window still open",
    });
  });

  it("does not cancel confirmed reservations", () => {
    const decision = shouldCancelUnpaidReservation(
      {
        reservationID: "ABC123",
        status: "confirmed",
        customNotes: `[${WEBSITE_PAYMENT_PENDING_MARKER} expires=2026-07-01T11:00:00.000Z]`,
      },
      { nowMs, cancelAfterMs: 30 * 60 * 1000, unpaidStatus: "not_confirmed" }
    );

    expect(decision).toEqual({ cancel: false, reason: "status is confirmed" });
  });

  it("does not cancel unmarked non-website rows", () => {
    const decision = shouldCancelUnpaidReservation(
      {
        reservationID: "STAFF-HOLD",
        status: "not_confirmed",
        dateCreated: "2026-07-01T10:00:00.000Z",
      },
      { nowMs, cancelAfterMs: 30 * 60 * 1000, unpaidStatus: "not_confirmed" }
    );

    expect(decision).toEqual({
      cancel: false,
      reason: "not identified as website reservation",
    });
  });

  it("extracts reservation arrays from common Cloudbeds response shapes", () => {
    expect(extractReservationRows({ data: [{ reservationID: "1" }] })).toHaveLength(1);
    expect(extractReservationRows({ data: { reservations: [{ reservationID: "2" }] } })).toHaveLength(1);
    expect(extractReservationRows({ reservations: [{ reservationID: "3" }] })).toHaveLength(1);
  });
});
