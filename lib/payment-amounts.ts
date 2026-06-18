export const DEFAULT_MNT_TO_EUR_RATE = 3700;

export function getMntToEurRate(): number {
  const raw = process.env.STRIPE_MNT_TO_EUR_RATE || process.env.MNT_TO_EUR_RATE || "";
  const parsed = Number(raw);

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  if (raw && process.env.NODE_ENV === "production") {
    throw new Error("STRIPE_MNT_TO_EUR_RATE must be a positive number");
  }

  return DEFAULT_MNT_TO_EUR_RATE;
}

export function mntToEurCents(amountMnt: number, rate = getMntToEurRate()): number {
  return Math.round((amountMnt / rate) * 100);
}
