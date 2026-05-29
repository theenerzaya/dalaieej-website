import { buildAlmanacArticleJsonLd, resolveAlmanacArticleSeoCopy } from "@/lib/almanac-seo";
import { getAlmanacArticle } from "@/app/data/almanacArticles";
import { getTranslations } from "next-intl/server";

type Props = {
  locale: string;
  slug: string;
};

export default async function AlmanacArticleStructuredData({ locale, slug }: Props) {
  const article = getAlmanacArticle(slug);
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
