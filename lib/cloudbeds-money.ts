export function parseCloudbedsMoney(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (value == null) return 0;

  const raw = String(value).trim();
  if (!raw) return 0;

  const cleaned = raw.replace(/[^\d.,+-]/g, "");
  if (!/\d/.test(cleaned)) return 0;

  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");
  let normalized = cleaned;

  if (hasComma && hasDot) {
    normalized =
      cleaned.lastIndexOf(",") > cleaned.lastIndexOf(".")
        ? cleaned.replace(/\./g, "").replace(",", ".")
        : cleaned.replace(/,/g, "");
  } else if (hasComma) {
    normalized = normalizeSingleSeparator(cleaned, ",");
  } else if (hasDot) {
    normalized = normalizeSingleSeparator(cleaned, ".");
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeSingleSeparator(value: string, separator: "," | "."): string {
  const parts = value.split(separator);
  if (parts.length === 1) return value;

  const last = parts[parts.length - 1] ?? "";
  const integerGroups = parts.slice(0, -1);
  const looksLikeThousands =
    last.length === 3 &&
    integerGroups.every((part, index) => {
      const digits = part.replace(/[+-]/g, "");
      return index === 0 ? digits.length >= 1 && digits.length <= 3 : digits.length === 3;
    });

  if (looksLikeThousands || parts.length > 2) {
    return parts.join("");
  }

  return separator === "," ? value.replace(",", ".") : value;
}
