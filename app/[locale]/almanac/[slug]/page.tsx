import { notFound } from "next/navigation";
import AlmanacArticleLayout from "@/app/components/almanac/AlmanacArticleLayout";
import {
  ALMANAC_ARTICLE_SLUGS,
  getAlmanacArticle,
} from "@/app/data/almanacArticles";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ALMANAC_ARTICLE_SLUGS.map((slug) => ({ slug }));
}

export default async function AlmanacArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getAlmanacArticle(slug);

  if (!article) {
    notFound();
  }

  return <AlmanacArticleLayout article={article} />;
}
