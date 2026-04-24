type Bilingual = { en: string; mn: string };

export type CabinCatalogEntry = {
  slug: string;
  name: Bilingual;
  priceFrom: number;
};

export const CABIN_CATALOG: CabinCatalogEntry[] = [
  {
    slug: "superior-cabin",
    name: { en: "Superior Cabin", mn: "Их Өргөө" },
    priceFrom: 300,
  },
  {
    slug: "triple-traditional-cabin",
    name: { en: "Triple Traditional Cabin", mn: "Тухтай Хаус (Галлагаатай)" },
    priceFrom: 470,
  },
  {
    slug: "lakeside-cabin",
    name: { en: "Lakeside Cabin", mn: " Эрэг дээрх Хаус" },
    priceFrom: 420,
  },
  {
    slug: "triple-electric-cabin",
    name: { en: "Triple Electric Cabin", mn: "Тухтай Хаус (Цахилгаан халаалт)" },
    priceFrom: 510,
  },
  {
    slug: "signature-cabin",
    name: { en: "Signature Cabin", mn: "Энгийн Байр" },
    priceFrom: 560,
  },
  {
    slug: "quad-electric-cabin",
    name: { en: "Quad Electric Cabin", mn: "Гэр Бүлийн Хаус (Цахилгаан халаалт)" },
    priceFrom: 540,
  },
  {
    slug: "grand-peninsula-suite",
    name: { en: "Grand Peninsula Suite", mn: "Гэр Бүлийн Хаус (Галлагаатай)" },
    priceFrom: 1200,
  },
  {
    slug: "camping",
    name: { en: "Camping", mn: "Аялагчийн Отог" },
    priceFrom: 180,
  },
];

const CABIN_CATALOG_BY_SLUG = new Map(CABIN_CATALOG.map((entry) => [entry.slug, entry]));

export function getCabinCatalogEntry(slug: string): CabinCatalogEntry | undefined {
  return CABIN_CATALOG_BY_SLUG.get(slug);
}

export function getLowestCabinPriceFrom(): number {
  return CABIN_CATALOG.reduce(
    (lowest, current) => Math.min(lowest, current.priceFrom),
    Number.POSITIVE_INFINITY,
  );
}
