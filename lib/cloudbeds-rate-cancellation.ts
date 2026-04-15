/**
 * Cloudbeds getRatePlans does not document cancellation fields in OpenAPI,
 * but properties often receive extra keys. We pick common shapes and merge
 * derived rates with base rate plans (same idea as LOS restrictions).
 */
export interface RateCancellation {
  daysBeforeArrival?: number;
  policyText?: string;
}

const NUMERIC_KEYS = [
  "freeCancellationDays",
  "refundableUntilDays",
  "cancellationDays",
  "daysBeforeArrival",
  "free_cancellation_days",
  "refundable_until_days",
  "cancelPolicyDays",
  "cancellationDeadlineDays",
] as const;

const TEXT_KEYS = [
  "cancellationPolicy",
  "cancellation_policy",
  "policyDescription",
  "cancellationDescription",
  "cancellationTerms",
  "cancelPolicy",
  "ratePolicy",
  "cancellationText",
] as const;

function parsePositiveInt(v: unknown): number | undefined {
  if (v == null || v === "") return undefined;
  const n = typeof v === "number" ? v : parseInt(String(v), 10);
  if (Number.isNaN(n) || n < 0) return undefined;
  return n;
}

export function extractRateCancellationFromPlan(rate: Record<string, unknown>): RateCancellation | null {
  let daysBeforeArrival: number | undefined;
  for (const k of NUMERIC_KEYS) {
    const n = parsePositiveInt(rate[k]);
    if (n !== undefined) {
      daysBeforeArrival = n;
      break;
    }
  }

  let policyText: string | undefined;
  for (const k of TEXT_KEYS) {
    const v = rate[k];
    if (typeof v === "string" && v.trim()) {
      policyText = v.trim();
      break;
    }
  }

  const detailed = rate.roomRateDetailed;
  if (daysBeforeArrival === undefined && !policyText && Array.isArray(detailed) && detailed[0] && typeof detailed[0] === "object") {
    const sub = extractRateCancellationFromPlan(detailed[0] as Record<string, unknown>);
    if (sub) {
      daysBeforeArrival = sub.daysBeforeArrival;
      policyText = sub.policyText;
    }
  }

  if (daysBeforeArrival === undefined && !policyText) return null;
  return { daysBeforeArrival, policyText };
}

export function mergeCancellation(
  derived: RateCancellation | null | undefined,
  base: RateCancellation | null | undefined
): RateCancellation | null {
  if (!derived && !base) return null;
  if (!base) return derived!;
  if (!derived) return base;
  return {
    daysBeforeArrival: derived.daysBeforeArrival ?? base.daysBeforeArrival,
    policyText: derived.policyText ?? base.policyText,
  };
}
