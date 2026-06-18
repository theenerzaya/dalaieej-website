const HTML_ENTITY_MAP: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  hellip: "...",
  laquo: "<<",
  ldquo: '"',
  lsquo: "'",
  mdash: "-",
  ndash: "-",
  nbsp: " ",
  quot: '"',
  raquo: ">>",
  rdquo: '"',
  rsquo: "'",
  shy: "",
  lt: "<",
};

function decodeNumericEntity(entity: string): string | null {
  const isHex = entity.slice(0, 2).toLowerCase() === "#x";
  const raw = entity.slice(isHex ? 2 : 1);
  const codePoint = Number.parseInt(raw, isHex ? 16 : 10);
  if (!Number.isFinite(codePoint) || codePoint <= 0 || codePoint > 0x10ffff) {
    return null;
  }

  try {
    return String.fromCodePoint(codePoint);
  } catch {
    return null;
  }
}

export function decodeProviderHtmlEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z][a-z0-9]+);/gi, (match, entity) => {
    const key = String(entity).toLowerCase();
    if (key.startsWith("#")) {
      return decodeNumericEntity(key) ?? match;
    }
    return HTML_ENTITY_MAP[key] ?? match;
  });
}

export function toPlainProviderText(value: unknown): string {
  if (typeof value !== "string" && typeof value !== "number") return "";

  const withoutTags = String(value).replace(/<[^>]*>/g, " ");
  const decoded = decodeProviderHtmlEntities(withoutTags);

  return decoded
    .replace(/<[^>]*>/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function toPlainProviderTextList(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values.map(toPlainProviderText).filter(Boolean);
}
