import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { openGraphAssetUrl } from "@/lib/assetUrl";
import {
  ALMANAC_HUB_OG_IMAGE,
  ALMANAC_OG_HEIGHT,
  ALMANAC_OG_WIDTH,
} from "@/lib/almanac-seo";
import { absoluteSiteUrl, hreflangLanguages } from "@/lib/site-urls";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "metadata.almanac" });
  const canonical = absoluteSiteUrl(locale, "/almanac");
  const ogImageUrl = openGraphAssetUrl(ALMANAC_HUB_OG_IMAGE, locale);

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical,
      languages: hreflangLanguages("/almanac"),
    },
    openGraph: {
      title: t("openGraphTitle"),
      description: t("openGraphDescription"),
      url: canonical,
      siteName: "Dalai Eej Resort",
      locale: locale === "mn" ? "mn_MN" : "en_US",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: ALMANAC_OG_WIDTH,
          height: ALMANAC_OG_HEIGHT,
          alt: t("openGraphImageAlt"),
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("openGraphTitle"),
      description: t("openGraphDescription"),
      images: [ogImageUrl],
    },
  };
}

export default async function AlmanacLayout({ children }: Props) {
  return children;
}
