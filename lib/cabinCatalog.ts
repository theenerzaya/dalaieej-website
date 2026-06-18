type Bilingual = { en: string; mn: string };
type StartingPriceCurrency = "MNT";

export type CabinStartingPrice = {
  amount: number;
  currency: StartingPriceCurrency;
};

export type CabinSlug =
  | "superior-cabin"
  | "triple-traditional-cabin"
  | "lakeside-cabin"
  | "triple-electric-cabin"
  | "signature-cabin"
  | "quad-electric-cabin"
  | "grand-peninsula-suite"
  | "camping";

export type CabinRouteSlug =
  | "superior-cabin"
  | "tuhtai-house-wood-fired"
  | "lakeside-house"
  | "tuhtai-house-electric"
  | "simple-stay"
  | "family-house-electric"
  | "family-house-wood-fired"
  | "traveler-camp";

export type SupportedLocale = "en" | "mn";

export type CabinCatalogEntry = {
  slug: CabinSlug;
  routeSlug: CabinRouteSlug;
  legacyRouteSlugs: string[];
  name: Bilingual;
  href: string;
  cardImage: string;
  gallery: string[];
  cloudbedsIds: string[];
  aliases: string[][];
  /** Fallback public display price only. Booking and checkout always reprice through Cloudbeds. */
  priceFrom: CabinStartingPrice | null;
};

export const CABIN_CATALOG: CabinCatalogEntry[] = [
  {
    slug: "superior-cabin",
    routeSlug: "superior-cabin",
    legacyRouteSlugs: ["ikh-urguu"],
    name: { en: "Их Өргөө", mn: "Их Өргөө" },
    href: "/superior-cabin",
    cardImage: "/images/cabins/room-superior.webp",
    gallery: [
      "/images/rooms/superior-cabin/00.webp",
      "/images/rooms/superior-cabin/01.webp",
      "/images/rooms/superior-cabin/02.webp",
      "/images/rooms/superior-cabin/03.webp",
      "/images/rooms/superior-cabin/04.webp",
    ],
    cloudbedsIds: ["198039847624896"],
    aliases: [
      ["superior"],
      ["их өргөө"],
      ["их оргоо"],
    ],
    priceFrom: { amount: 980000, currency: "MNT" },
  },
  {
    slug: "triple-traditional-cabin",
    routeSlug: "tuhtai-house-wood-fired",
    legacyRouteSlugs: ["triple-traditional-cabin"],
    name: { en: "Тухтай Хаус (Галлагаатай)", mn: "Тухтай Хаус (Галлагаатай)" },
    href: "/tuhtai-house-wood-fired",
    cardImage: "/images/cabins/room-triple-traditional.webp",
    gallery: [
      "/images/rooms/triple-traditional-cabin/00.webp",
      "/images/rooms/triple-traditional-cabin/01.webp",
      "/images/rooms/triple-traditional-cabin/02.webp",
      "/images/rooms/triple-traditional-cabin/03.webp",
      "/images/rooms/triple-traditional-cabin/04.webp",
    ],
    cloudbedsIds: ["EST", "196467430240449"],
    aliases: [
      ["triple", "traditional"],
      ["тухтай", "галлагаатай"],
    ],
    priceFrom: { amount: 690000, currency: "MNT" },
  },
  {
    slug: "lakeside-cabin",
    routeSlug: "lakeside-house",
    legacyRouteSlugs: ["lakeside-cabin"],
    name: { en: "Эрэг дээрх Хаус", mn: "Эрэг дээрх Хаус" },
    href: "/lakeside-house",
    cardImage: "/images/cabins/room-lakeside.webp",
    gallery: [
      "/images/rooms/lakeside-cabin/00.webp",
      "/images/rooms/lakeside-cabin/01.webp",
      "/images/rooms/lakeside-cabin/02.webp",
      "/images/rooms/lakeside-cabin/03.webp",
      "/images/rooms/lakeside-cabin/04.webp",
    ],
    cloudbedsIds: ["SCW", "198020352975040"],
    aliases: [
      ["lakeside"],
      ["эрэг", "хаус"],
    ],
    priceFrom: { amount: 550000, currency: "MNT" },
  },
  {
    slug: "triple-electric-cabin",
    routeSlug: "tuhtai-house-electric",
    legacyRouteSlugs: ["triple-electric-cabin"],
    name: { en: "Тухтай Хаус (Цахилгаан халаалт)", mn: "Тухтай Хаус (Цахилгаан халаалт)" },
    href: "/tuhtai-house-electric",
    cardImage: "/images/cabins/room-triple-electric.webp",
    gallery: [
      "/images/rooms/triple-electric-cabin/00.webp",
      "/images/rooms/triple-electric-cabin/01.webp",
      "/images/rooms/triple-electric-cabin/02.webp",
      "/images/rooms/triple-electric-cabin/03.webp",
      "/images/rooms/triple-electric-cabin/04.webp",
    ],
    cloudbedsIds: ["198036698427584"],
    aliases: [
      ["triple", "electric"],
      ["тухтай", "цахилгаан", "халаалт"],
    ],
    priceFrom: { amount: 690000, currency: "MNT" },
  },
  {
    slug: "signature-cabin",
    routeSlug: "simple-stay",
    legacyRouteSlugs: ["signature-cabin"],
    name: { en: "Энгийн Байр", mn: "Энгийн Байр" },
    href: "/simple-stay",
    cardImage: "/images/cabins/room-signature.webp",
    gallery: [
      "/images/rooms/signature-cabin/00.webp",
      "/images/rooms/signature-cabin/01.webp",
      "/images/rooms/signature-cabin/02.webp",
      "/images/rooms/signature-cabin/03.webp",
      "/images/rooms/signature-cabin/04.webp",
    ],
    cloudbedsIds: ["LDG", "197943412437120"],
    aliases: [
      ["signature"],
      ["энгийн", "байр"],
    ],
    priceFrom: { amount: 250000, currency: "MNT" },
  },
  {
    slug: "quad-electric-cabin",
    routeSlug: "family-house-electric",
    legacyRouteSlugs: ["quad-electric-cabin"],
    name: { en: "Гэр Бүлийн Хаус (Цахилгаан халаалт)", mn: "Гэр Бүлийн Хаус (Цахилгаан халаалт)" },
    href: "/family-house-electric",
    cardImage: "/images/cabins/room-quad-electric.webp",
    gallery: [
      "/images/rooms/quad-electric-cabin/00.webp",
      "/images/rooms/quad-electric-cabin/01.webp",
      "/images/rooms/quad-electric-cabin/02.webp",
      "/images/rooms/quad-electric-cabin/03.webp",
      "/images/rooms/quad-electric-cabin/04.webp",
    ],
    cloudbedsIds: ["198046100787328"],
    aliases: [
      ["quad", "electric"],
      ["гэр", "бүлийн", "цахилгаан", "халаалт"],
      ["гэр", "булийн", "цахилгаан", "халаалт"],
    ],
    priceFrom: { amount: 850000, currency: "MNT" },
  },
  {
    slug: "grand-peninsula-suite",
    routeSlug: "family-house-wood-fired",
    legacyRouteSlugs: ["grand-peninsula-suite"],
    name: { en: "Гэр Бүлийн Хаус (Галлагаатай)", mn: "Гэр Бүлийн Хаус (Галлагаатай)" },
    href: "/family-house-wood-fired",
    cardImage: "/images/cabins/room-grand-peninsula.webp",
    gallery: [
      "/images/rooms/grand-peninsula-suite/00.webp",
      "/images/rooms/grand-peninsula-suite/01.webp",
      "/images/rooms/grand-peninsula-suite/02.webp",
      "/images/rooms/grand-peninsula-suite/03.webp",
      "/images/rooms/grand-peninsula-suite/04.webp",
    ],
    cloudbedsIds: ["ESH", "198038298677377"],
    aliases: [
      ["grand", "peninsula"],
      ["гэр", "бүлийн", "галлагаатай"],
      ["гэр", "булийн", "галлагаатай"],
    ],
    priceFrom: { amount: 850000, currency: "MNT" },
  },
  {
    slug: "camping",
    routeSlug: "traveler-camp",
    legacyRouteSlugs: ["camping"],
    name: { en: "Аялагчийн Отог", mn: "Аялагчийн Отог" },
    href: "/traveler-camp",
    cardImage: "/images/rooms/camping.webp",
    gallery: ["/images/rooms/camping.webp"],
    cloudbedsIds: ["C", "198042256253056"],
    aliases: [
      ["camp"],
      ["аялагчийн", "отог"],
    ],
    priceFrom: null,
  },
];

const CABIN_CATALOG_BY_SLUG = new Map(CABIN_CATALOG.map((entry) => [entry.slug, entry]));
const CABIN_CATALOG_BY_ROUTE_SLUG = new Map<string, CabinCatalogEntry>();
const CABIN_CATALOG_BY_CLOUDBEDS_ID = new Map<string, CabinCatalogEntry>();

for (const entry of CABIN_CATALOG) {
  CABIN_CATALOG_BY_ROUTE_SLUG.set(entry.routeSlug, entry);
  CABIN_CATALOG_BY_ROUTE_SLUG.set(entry.slug, entry);
  for (const legacySlug of entry.legacyRouteSlugs) {
    CABIN_CATALOG_BY_ROUTE_SLUG.set(legacySlug, entry);
  }

  for (const id of entry.cloudbedsIds) {
    const normalized = normalizeCloudbedsRoomTypeId(id);
    CABIN_CATALOG_BY_CLOUDBEDS_ID.set(normalized, entry);
    CABIN_CATALOG_BY_CLOUDBEDS_ID.set(normalized.toUpperCase(), entry);
  }
}

export function getCabinCatalogEntry(slug: string): CabinCatalogEntry | undefined {
  return CABIN_CATALOG_BY_SLUG.get(slug as CabinSlug);
}

export function getCabinCatalogEntryByRouteSlug(routeSlug: string): CabinCatalogEntry | undefined {
  return CABIN_CATALOG_BY_ROUTE_SLUG.get(routeSlug);
}

export function resolveCabinSlugFromRouteSlug(routeSlug: string): CabinSlug | null {
  return CABIN_CATALOG_BY_ROUTE_SLUG.get(routeSlug)?.slug ?? null;
}

export function getCanonicalCabinHrefFromRouteSlug(routeSlug: string): string | null {
  return CABIN_CATALOG_BY_ROUTE_SLUG.get(routeSlug)?.href ?? null;
}

export function isCanonicalCabinRouteSlug(routeSlug: string): boolean {
  return CABIN_CATALOG_BY_ROUTE_SLUG.get(routeSlug)?.routeSlug === routeSlug;
}

export function getCanonicalCabinHrefs(): string[] {
  return CABIN_CATALOG.map((entry) => entry.href);
}

export function getCanonicalCabinPathForPathname(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] === "en" || segments[0] === "mn" ? segments[0] : null;
  const routeSlug = locale ? segments[1] : segments[0];
  if (!routeSlug || segments.length !== (locale ? 2 : 1)) return null;

  const canonicalHref = getCanonicalCabinHrefFromRouteSlug(routeSlug);
  if (!canonicalHref || isCanonicalCabinRouteSlug(routeSlug)) return null;
  return locale ? `/${locale}${canonicalHref}` : canonicalHref;
}

export function getLowestCabinPriceFrom(): CabinStartingPrice | null {
  return CABIN_CATALOG.reduce<CabinStartingPrice | null>((lowest, current) => {
    if (!current.priceFrom) return lowest;
    if (!lowest || current.priceFrom.amount < lowest.amount) return current.priceFrom;
    return lowest;
  }, null);
}

export function formatCabinStartingPrice(
  price: CabinStartingPrice,
  locale: SupportedLocale = "en",
): string {
  const amount = new Intl.NumberFormat(locale === "mn" ? "mn-MN" : "en-US").format(price.amount);
  if (price.currency === "MNT") {
    return locale === "mn" ? `${amount} төг` : `MNT ${amount}`;
  }
  return `${amount} ${price.currency}`;
}

export function formatLowestCabinPriceFrom(locale: SupportedLocale = "en"): string {
  const lowest = getLowestCabinPriceFrom();
  if (!lowest) return locale === "mn" ? "Шууд үнэ" : "Live rates";

  const formatted = formatCabinStartingPrice(lowest, locale);
  return locale === "mn" ? `1 шөнө ${formatted}-өөс` : `From ${formatted}/night`;
}

export function getCabinFallbackName(slug: CabinSlug, locale: SupportedLocale = "en"): string {
  return CABIN_CATALOG_BY_SLUG.get(slug)?.name[locale] ?? slug;
}

export function getCabinDisplayName(
  slug: CabinSlug | null | undefined,
  locale: SupportedLocale,
  cloudbedsRoomTypeName?: string | null,
): string {
  const providerName = cloudbedsRoomTypeName?.trim();
  if (providerName) return providerName;
  return slug ? getCabinFallbackName(slug, locale) : "";
}

export function getCabinDetailHref(slug: CabinSlug | null | undefined): string {
  return slug ? CABIN_CATALOG_BY_SLUG.get(slug)?.href ?? "/cabins" : "/cabins";
}

export function getCabinGallery(slug: CabinSlug | null | undefined): string[] {
  return slug ? CABIN_CATALOG_BY_SLUG.get(slug)?.gallery ?? [] : [];
}

export function resolveCabinSlugFromCloudbeds(
  roomTypeID: string | number | null | undefined,
  roomTypeName: string | null | undefined,
): CabinSlug | null {
  const normalizedId = normalizeCloudbedsRoomTypeId(roomTypeID);
  if (normalizedId) {
    const byId =
      CABIN_CATALOG_BY_CLOUDBEDS_ID.get(normalizedId) ??
      CABIN_CATALOG_BY_CLOUDBEDS_ID.get(normalizedId.toUpperCase());
    if (byId) return byId.slug;
  }

  const normalizedName = normalizeRoomName(roomTypeName || "");
  if (!normalizedName) return null;

  for (const entry of CABIN_CATALOG) {
    if (entry.aliases.some((tokens) => tokens.every((token) => normalizedName.includes(normalizeRoomName(token))))) {
      return entry.slug;
    }
  }

  return null;
}

function normalizeCloudbedsRoomTypeId(value: string | number | null | undefined): string {
  return String(value || "").trim().replace(/-\d+$/, "");
}

function normalizeRoomName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
