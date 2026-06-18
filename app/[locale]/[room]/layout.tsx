import type { Metadata } from "next";
import { getCabinCatalogEntryByRouteSlug } from "@/lib/cabinCatalog";
import { getCabinCloudbedsFact } from "@/lib/cabinCloudbedsSnapshot";
import { absoluteSiteUrl, hreflangLanguages } from "@/lib/site-urls";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string; room: string }>;
};

export async function generateMetadata({ params }: { params: Props["params"] }): Promise<Metadata> {
  const { locale, room } = await params;
  const lang = locale === "mn" ? "mn" : "en";
  const entry = getCabinCatalogEntryByRouteSlug(room);
  const fact = entry ? getCabinCloudbedsFact(entry.slug) : null;
  const path = entry?.href ?? `/${room}`;
  const title = fact
    ? `${fact.name} | ${locale === "mn" ? "Далай ээж ресорт" : "Dalai Eej Resort"}`
    : locale === "mn"
      ? "Өрөө | Далай ээж ресорт"
      : "Room | Dalai Eej Resort";
  const description = fact
    ? fact.shortDescription[lang]
    : locale === "mn"
      ? "Далай ээж ресортын байрлах сонголтууд."
      : "Room details at Dalai Eej Resort.";

  return {
    title,
    description,
    alternates: {
      canonical: absoluteSiteUrl(locale, path),
      languages: hreflangLanguages(path),
    },
    openGraph: {
      title,
      description,
      url: absoluteSiteUrl(locale, path),
      type: "website",
    },
  };
}

export default async function RoomLayout({ children }: Props) {
  return children;
}
