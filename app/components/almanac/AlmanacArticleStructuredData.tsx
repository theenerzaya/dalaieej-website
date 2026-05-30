import { buildAlmanacArticleJsonLd, resolveAlmanacArticleSeoCopy } from "@/lib/almanac-seo";
import { getAlmanacArticle } from "@/app/data/almanacArticles";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  locale: string;
  slug: string;
};

export default async function AlmanacArticleStructuredData({ locale, slug }: Props) {
  setRequestLocale(locale);
  const article = getAlmanacArticle(slug, locale);
  if (!article) return null;

  const t = await getTranslations({ locale, namespace: "metadata.almanacArticles" });
  const seo = resolveAlmanacArticleSeoCopy(slug, t);
  const jsonLd = buildAlmanacArticleJsonLd({ locale, slug, article, seo });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
