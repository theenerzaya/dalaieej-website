import { NextRequest, NextResponse } from "next/server";
import { cloudbedsGet } from "@/lib/cloudbeds";
import {
  cancelCloudbedsReservation,
  cloudbedsErrorMessage,
} from "@/lib/cloudbeds-reservations";
import {
  extractReservationId,
  extractReservationRows,
  shouldCancelUnpaidReservation,
} from "@/lib/cloudbeds-unpaid-cleanup";

type CloudbedsReservationsResponse = unknown;

function minutesEnv(name: string, fallback: number): number {
  const parsed = Number(process.env[name] || "");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function integerEnv(name: string, fallback: number): number {
  const parsed = Number.parseInt(process.env[name] || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CLOUDBEDS_CLEANUP_SECRET || process.env.CRON_SECRET || "";
  if (!secret && process.env.NODE_ENV !== "production") return true;
  if (!secret) return false;

  const auth = request.headers.get("authorization") || "";
  const headerSecret = request.headers.get("x-cloudbeds-cleanup-secret") || "";
  return auth === `Bearer ${secret}` || headerSecret === secret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unpaid reservation cleanup is not authorized" },
      { status: 403 }
    );
  }

  const dryRun = request.nextUrl.searchParams.get("dryRun") === "1";
  const cancelAfterMs = minutesEnv("CLOUDBEDS_CANCEL_UNPAID_AFTER_MINUTES", 30) * 60 * 1000;
  const unpaidStatus = process.env.CLOUDBEDS_UNPAID_RESERVATION_STATUS || "not_confirmed";
  const maxCancellations = integerEnv("CLOUDBEDS_CANCEL_UNPAID_MAX_PER_RUN", 20);
  const nowMs = Date.now();

  try {
    const reservationsData = await cloudbedsGet<CloudbedsReservationsResponse>(
      "/getReservations",
      { status: unpaidStatus }
    );
    const rows = extractReservationRows(reservationsData);
    const candidates = rows
      .map((row) => ({ row, decision: shouldCancelUnpaidReservation(row, { nowMs, cancelAfterMs, unpaidStatus }) }))
      .filter((item) => item.decision.cancel)
      .slice(0, maxCancellations);

    const canceled: Array<{ reservationId: string; status?: string; dryRun?: boolean }> = [];
    const failed: Array<{ reservationId: string; error: string }> = [];

    for (const item of candidates) {
      const reservationId = extractReservationId(item.row);
      if (dryRun) {
        canceled.push({ reservationId, dryRun: true });
        continue;
      }

      try {
        const result = await cancelCloudbedsReservation(reservationId);
        canceled.push({ reservationId, status: result.status });
      } catch (error) {
        failed.push({
          reservationId,
          error: cloudbedsErrorMessage(error, "Failed to cancel unpaid reservation"),
        });
      }
    }

    return NextResponse.json({
      success: failed.length === 0,
      dryRun,
      checked: rows.length,
      eligible: candidates.length,
      canceled,
      failed,
      maxCancellations,
      cancelAfterMinutes: Math.round(cancelAfterMs / 60000),
      unpaidStatus,
    });
  } catch (error) {
    console.error("Unpaid reservation cleanup error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: cloudbedsErrorMessage(error, "Failed to clean up unpaid reservations") },
      { status: 500 }
    );
  }
}
