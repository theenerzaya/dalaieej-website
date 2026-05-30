import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import AlmanacArticleStructuredData from "@/app/components/almanac/AlmanacArticleStructuredData";
import { getAlmanacArticle } from "@/app/data/almanacArticles";
import {
  buildAlmanacArticleMetadata,
  resolveAlmanacArticleSeoCopy,
} from "@/lib/almanac-seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getAlmanacArticle(slug);

  if (!article) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "metadata.almanacArticles" });
  const seo = resolveAlmanacArticleSeoCopy(slug, t);

  return buildAlmanacArticleMetadata({ locale, slug, article, seo });
}

export default async function AlmanacArticleRouteLayout({
  children,
  params,
}: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getAlmanacArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <AlmanacArticleStructuredData locale={locale} slug={slug} />
      {children}
    </>
  );
}
