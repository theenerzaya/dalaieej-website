import { parseCloudbedsMoney } from "./cloudbeds-money";

export function flattenExtraChargeMap(extra: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (extra == null) return out;

  const rows = Array.isArray(extra) ? extra : [extra];
  for (const row of rows) {
    if (row && typeof row === "object" && !Array.isArray(row)) {
      for (const [k, v] of Object.entries(row as Record<string, unknown>)) {
        const n = parseCloudbedsMoney(v);
        if (!Number.isNaN(n)) out[k] = n;
      }
    }
  }

  return out;
}

export function extraChargeForGuestCount(map: Record<string, number>, count: number): number {
  if (count <= 0) return 0;

  const direct = map[String(count)];
  if (direct != null) return direct;

  const numericKeys = Object.keys(map)
    .map((k) => Number.parseInt(k, 10))
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b);

  let best = 0;
  for (const k of numericKeys) {
    if (k <= count) best = map[String(k)] ?? best;
  }

  return best;
}

/**
 * Cloudbeds returns the base stay price plus optional occupancy extra-charge maps.
 * The custom booking flow quotes each physical room line with its assigned guests.
 */
export function stayTotalForRoom(
  room: Record<string, unknown>,
  quoteAdults: number,
  quoteChildren: number
): number {
  const base = parseCloudbedsMoney(room.roomRate);
  const adultExtra = extraChargeForGuestCount(
    flattenExtraChargeMap(room.adultsExtraCharge),
    quoteAdults
  );
  const childExtra = extraChargeForGuestCount(
    flattenExtraChargeMap(room.childrenExtraCharge),
    quoteChildren
  );

  return base + adultExtra + childExtra;
}
