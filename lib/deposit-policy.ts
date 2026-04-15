/**
 * Mirrors Cloudbeds-style rules on the custom booking flow:
 * non-refundable rates = pay full stay online; other rates = 50% now, 50% on arrival.
 * Add-ons are charged in full with the online deposit (no split).
 */
export function isNonRefundableRate(rateName: string): boolean {
  const n = rateName.toLowerCase().replace(/[\s_]+/g, " ").trim();
  return (
    n.includes("non-refundable") ||
    n.includes("non refundable") ||
    n.includes("nonrefundable") ||
    n.includes("буцаан олгогдохгүй")
  );
}

export function depositPortionForLineTotal(rateName: string, lineTotal: number): number {
  if (lineTotal <= 0) return 0;
  if (isNonRefundableRate(rateName)) return lineTotal;
  return Math.round(lineTotal * 0.5);
}

export function sumDepositDueForRoomLines(
  lines: { rateName: string; pricePerNight: number; quantity: number }[],
  nights: number
): number {
  return lines.reduce((sum, line) => {
    const lineTotal = line.pricePerNight * line.quantity * nights;
    return sum + depositPortionForLineTotal(line.rateName, lineTotal);
  }, 0);
}

export function depositPortionForAddonTotal(addonTotal: number): number {
  if (addonTotal <= 0) return 0;
  return Math.round(addonTotal);
}
