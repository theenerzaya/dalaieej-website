import { getTranslations } from "next-intl/server";
import { absoluteSiteUrl, hreflangLanguages } from "@/lib/site-urls";

type Props = {
  children: React.ReactNode;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.experiences" });
  const canonical = absoluteSiteUrl(locale, "/experiences");

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical,
      languages: hreflangLanguages("/experiences"),
    },
    openGraph: {
      title: t("openGraphTitle"),
      description: t("openGraphDescription"),
      url: canonical,
      siteName: "Dalai Eej Resort",
      locale: locale === "mn" ? "mn_MN" : "en_US",
      type: "website",
    },
  };
}

export default function ExperiencesLayout({ children }: Props) {
  return children;
}
