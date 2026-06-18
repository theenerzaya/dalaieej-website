const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type StayDateValidation =
  | { ok: true; nights: number }
  | { ok: false; error: string };

export function parseDateOnly(value: unknown): Date | null {
  if (typeof value !== "string" || !DATE_ONLY_RE.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

export function validateStayDates(
  checkin: unknown,
  checkout: unknown,
  options: { maxNights?: number } = {}
): StayDateValidation {
  const start = parseDateOnly(checkin);
  const end = parseDateOnly(checkout);

  if (!start || !end) {
    return { ok: false, error: "Dates must be valid YYYY-MM-DD values" };
  }

  const nights = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
  if (nights < 1) {
    return { ok: false, error: "Checkout must be after check-in" };
  }

  const maxNights = options.maxNights ?? 60;
  if (nights > maxNights) {
    return { ok: false, error: `Stays longer than ${maxNights} nights require direct assistance` };
  }

  return { ok: true, nights };
}

export function parseBoundedInteger(
  value: unknown,
  options: { min: number; max: number; label: string }
): number | null {
  const raw = String(value ?? "").trim();
  if (!/^-?\d+$/.test(raw)) return null;

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isInteger(parsed) || parsed < options.min || parsed > options.max) {
    return null;
  }

  return parsed;
}
