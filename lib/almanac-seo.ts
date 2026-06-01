import type { Metadata } from "next";
import { openGraphAssetUrl } from "@/lib/assetUrl";
import type { AlmanacArticle } from "@/app/data/almanacArticles";
import { absoluteSiteUrl } from "@/lib/site-urls";

export const ALMANAC_HUB_OG_IMAGE = "/images/almanac/og/hub.jpg";
export const ALMANAC_OG_WIDTH = 1200;
export const ALMANAC_OG_HEIGHT = 630;
const PUBLISHER_NAME = "Dalai Eej Resort";
const ALMANAC_SERIES_NAME = "The Almanac";
const ALMANAC_SERIES_NAME_MN = "Товчоон";

export type AlmanacArticleSeoCopy = {
  metaTitle: string;
  description: string;
  ogImageAlt: string;
};

export function almanacArticleOgImagePath(slug: string): string {
  return `/images/almanac/og/${slug}.jpg`;
}

export function resolveAlmanacArticleSeoCopy(
  slug: string,
  t: (key: string) => string
): AlmanacArticleSeoCopy {
  return {
    metaTitle: t(`${slug}.metaTitle`),
    description: t(`${slug}.description`),
    ogImageAlt: t(`${slug}.ogImageAlt`),
  };
}

export function buildAlmanacArticlePageTitle(metaTitle: string, locale: string): string {
  const series = locale === "mn" ? ALMANAC_SERIES_NAME_MN : ALMANAC_SERIES_NAME;
  const brand = locale === "mn" ? "Далай ээж ресорт" : PUBLISHER_NAME;
  return `${metaTitle} | ${series} | ${brand}`;
}

export function buildAlmanacArticleOpenGraphTitle(metaTitle: string, locale: string): string {
  const series = locale === "mn" ? ALMANAC_SERIES_NAME_MN : ALMANAC_SERIES_NAME;
  return `${metaTitle} | ${series}`;
}

type BuildArticleMetadataInput = {
  locale: string;
  slug: string;
  article: AlmanacArticle;
  seo: AlmanacArticleSeoCopy;
};

export function buildAlmanacArticleMetadata({
  locale,
  slug,
  article,
  seo,
}: BuildArticleMetadataInput): Metadata {
  const path = `/almanac/${slug}`;
  const canonical = absoluteSiteUrl(locale, path);
  const ogImagePath = almanacArticleOgImagePath(slug);
  const ogImageUrl = openGraphAssetUrl(ogImagePath, locale);
  const pageTitle = buildAlmanacArticlePageTitle(seo.metaTitle, locale);
  const ogTitle = buildAlmanacArticleOpenGraphTitle(seo.metaTitle, locale);
  const { published, modified } = article.metadata;

  return {
    title: pageTitle,
    description: seo.description,
    alternates: {
      canonical,
      languages: {
        en: absoluteSiteUrl("en", path),
        mn: absoluteSiteUrl("mn", path),
        "x-default": absoluteSiteUrl("en", path),
      },
    },
    openGraph: {
      title: ogTitle,
      description: seo.description,
      url: canonical,
      siteName: PUBLISHER_NAME,
      locale: locale === "mn" ? "mn_MN" : "en_US",
      type: "article",
      publishedTime: published,
      modifiedTime: modified,
      images: [
        {
          url: ogImageUrl,
          width: ALMANAC_OG_WIDTH,
          height: ALMANAC_OG_HEIGHT,
          alt: seo.ogImageAlt,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: seo.description,
      images: [ogImageUrl],
    },
  };
}

type BuildArticleJsonLdInput = {
  locale: string;
  slug: string;
  article: AlmanacArticle;
  seo: AlmanacArticleSeoCopy;
};

export function buildAlmanacArticleJsonLd({
  locale,
  slug,
  article,
  seo,
}: BuildArticleJsonLdInput): Record<string, unknown> {
  const path = `/almanac/${slug}`;
  const url = absoluteSiteUrl(locale, path);
  const hubUrl = absoluteSiteUrl(locale, "/almanac");
  const image = openGraphAssetUrl(almanacArticleOgImagePath(slug), locale);
  const { published, modified } = article.metadata;
  const seriesName = locale === "mn" ? ALMANAC_SERIES_NAME_MN : ALMANAC_SERIES_NAME;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: seo.metaTitle,
    description: seo.description,
    image,
    url,
    inLanguage: locale === "mn" ? "mn" : "en",
    datePublished: published,
    dateModified: modified,
    author: {
      "@type": "Organization",
      name: PUBLISHER_NAME,
      url: absoluteSiteUrl(locale, ""),
    },
    publisher: {
      "@type": "Organization",
      name: PUBLISHER_NAME,
      url: absoluteSiteUrl(locale, ""),
      logo: {
        "@type": "ImageObject",
        url: openGraphAssetUrl("/branding/favicons/favicon-96x96.png", locale),
      },
    },
    isPartOf: {
      "@type": "CollectionPage",
      name: seriesName,
      url: hubUrl,
      description:
        locale === "mn"
          ? "Хөвсгөлийн умардын хязгаарын олон бүлэгт талбарын гарын авлага."
          : "A multi-chapter field guide to the northern frontier of Lake Khövsgöl.",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: article.chapterEyebrow,
  };
}
