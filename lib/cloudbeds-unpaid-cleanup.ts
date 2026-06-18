export const WEBSITE_PAYMENT_PENDING_MARKER = "website-payment-pending";

export type CloudbedsReservationRow = Record<string, unknown>;

export type UnpaidReservationDecision =
  | { cancel: true; reservationId: string; reason: string }
  | { cancel: false; reason: string };

function stringField(row: CloudbedsReservationRow, names: string[]): string {
  for (const name of names) {
    const value = row[name];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return "";
}

function parseDateMs(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const parsed = Date.parse(String(value).trim().replace(" ", "T"));
  return Number.isFinite(parsed) ? parsed : null;
}

function searchableText(row: CloudbedsReservationRow): string {
  return [
    row.source,
    row.sourceName,
    row.sourceTitle,
    row.channel,
    row.customNotes,
    row.notes,
    row.guestNotes,
    row.internalNotes,
  ]
    .map((value) => (value == null ? "" : String(value)))
    .join(" ")
    .toLowerCase();
}

export function createPendingPaymentNote(existingNotes: string, expiresAt: Date): string {
  const marker = `[${WEBSITE_PAYMENT_PENDING_MARKER} expires=${expiresAt.toISOString()}]`;
  const trimmed = existingNotes.trim();
  return trimmed ? `${trimmed}\n\n${marker}` : marker;
}

export function extractReservationRows(response: unknown): CloudbedsReservationRow[] {
  if (Array.isArray(response)) return response as CloudbedsReservationRow[];
  if (!response || typeof response !== "object") return [];

  const root = response as Record<string, unknown>;
  const data = root.data;
  if (Array.isArray(data)) return data as CloudbedsReservationRow[];
  if (data && typeof data === "object") {
    const dataObj = data as Record<string, unknown>;
    for (const key of ["reservations", "reservation", "items", "results"]) {
      if (Array.isArray(dataObj[key])) return dataObj[key] as CloudbedsReservationRow[];
    }
  }

  for (const key of ["reservations", "reservation", "items", "results"]) {
    if (Array.isArray(root[key])) return root[key] as CloudbedsReservationRow[];
  }

  return [];
}

export function extractReservationId(row: CloudbedsReservationRow): string {
  return stringField(row, ["reservationID", "reservationId", "id"]);
}

export function extractReservationStatus(row: CloudbedsReservationRow): string {
  return stringField(row, ["status", "reservationStatus", "reservation_status"]).toLowerCase();
}

export function extractReservationCreatedAt(row: CloudbedsReservationRow): number | null {
  for (const name of [
    "dateCreated",
    "dateCreatedUTC",
    "createdAt",
    "created_at",
    "creationDate",
    "createdDate",
    "reservationCreatedAt",
  ]) {
    const parsed = parseDateMs(row[name]);
    if (parsed != null) return parsed;
  }
  return null;
}

export function extractPendingPaymentExpiresAt(row: CloudbedsReservationRow): number | null {
  const text = searchableText(row);
  const pattern = new RegExp(`${WEBSITE_PAYMENT_PENDING_MARKER}\\s+expires=([^\\]\\s]+)`, "i");
  const match = text.match(pattern);
  return match?.[1] ? parseDateMs(match[1]) : null;
}

export function isLikelyWebsiteReservation(row: CloudbedsReservationRow): boolean {
  const text = searchableText(row);
  return text.includes(WEBSITE_PAYMENT_PENDING_MARKER) || /\bwebsite\b/i.test(text);
}

export function shouldCancelUnpaidReservation(
  row: CloudbedsReservationRow,
  options: {
    nowMs: number;
    cancelAfterMs: number;
    unpaidStatus: string;
  }
): UnpaidReservationDecision {
  const reservationId = extractReservationId(row);
  if (!reservationId) return { cancel: false, reason: "missing reservation id" };

  const status = extractReservationStatus(row);
  if (status && status !== options.unpaidStatus.toLowerCase()) {
    return { cancel: false, reason: `status is ${status}` };
  }

  const markerExpiresAt = extractPendingPaymentExpiresAt(row);
  if (markerExpiresAt != null) {
    return markerExpiresAt <= options.nowMs
      ? { cancel: true, reservationId, reason: "website payment window expired" }
      : { cancel: false, reason: "website payment window still open" };
  }

  if (!isLikelyWebsiteReservation(row)) {
    return { cancel: false, reason: "not identified as website reservation" };
  }

  const createdAt = extractReservationCreatedAt(row);
  if (createdAt == null) return { cancel: false, reason: "missing created timestamp" };

  return options.nowMs - createdAt >= options.cancelAfterMs
    ? { cancel: true, reservationId, reason: "unpaid website reservation older than cutoff" }
    : { cancel: false, reason: "reservation younger than cutoff" };
}
