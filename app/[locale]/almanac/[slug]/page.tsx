import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import AlmanacArticleLayout from "@/app/components/almanac/AlmanacArticleLayout";
import {
  ALMANAC_ARTICLE_SLUGS,
  getAlmanacArticle,
} from "@/app/data/almanacArticles";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ALMANAC_ARTICLE_SLUGS.map((slug) => ({ locale, slug }))
  );
}

export default async function AlmanacArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getAlmanacArticle(slug, locale);

  if (!article) {
    notFound();
  }

  return <AlmanacArticleLayout article={article} />;
}
