import { notFound } from "next/navigation";
import { absoluteSiteUrl, hreflangLanguages } from "@/lib/site-urls";
import { getAlmanacArticle } from "@/app/data/almanacArticles";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const article = getAlmanacArticle(slug);

  if (!article) {
    return {};
  }

  const path = `/almanac/${slug}`;
  const canonical = absoluteSiteUrl(locale, path);

  return {
    title: `${article.title} | The Almanac | Dalai Eej Resort`,
    description: article.metadata.description,
    alternates: {
      canonical,
      languages: hreflangLanguages(path),
    },
    openGraph: {
      title: `${article.title} | The Almanac`,
      description: article.metadata.description,
      url: canonical,
      siteName: "Dalai Eej Resort",
      locale: locale === "mn" ? "mn_MN" : "en_US",
      type: "article",
    },
  };
}

export default async function AlmanacArticleRouteLayout({
  children,
  params,
}: Props) {
  const { slug } = await params;
  const article = getAlmanacArticle(slug);

  if (!article) {
    notFound();
  }

  return children;
}
