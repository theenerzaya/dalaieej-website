/**
 * Example `generateMetadata` for a new page.
 *
 * Copy the body of this file into a *server* `page.tsx` (a file WITHOUT the
 * "use client" directive) alongside your route. If your page must be a client
 * component (uses hooks, framer-motion, etc. — like `_template/page.tsx`),
 * put `generateMetadata` in a sibling `layout.tsx` file inside the same route
 * folder instead; metadata from a route-segment layout is inherited by the
 * page.
 *
 * Patterns mirror `app/[locale]/layout.tsx` so canonical URLs, hreflang, and
 * OpenGraph/Twitter fields stay consistent across the site.
 */

import { getTranslations } from "next-intl/server";
import { absoluteSiteUrl, hreflangLanguages, siteOriginForLocale } from "@/lib/site-urls";

type RouteParams = { locale: string };

// 1. Add an entry for this page in `messages/{en,mn}.json` under
//    `metadata.<yourNamespace>` with `title` and `description`.
// 2. Replace `<yourNamespace>` and `<route-path>` below.
//    `<route-path>` is relative to the locale root, e.g. "about", "journal".

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.<yourNamespace>" });

  const routePath = "<route-path>";
  const canonical = absoluteSiteUrl(locale, routePath);

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(siteOriginForLocale(locale)),

    alternates: {
      canonical,
      languages: hreflangLanguages(routePath),
    },

    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonical,
      siteName: "Dalai Eej Resort",
      locale: locale === "mn" ? "mn_MN" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}
