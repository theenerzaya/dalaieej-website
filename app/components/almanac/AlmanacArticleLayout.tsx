"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import PageShell from "@/app/components/layout/PageShell";
import FrostedMapSection from "@/app/components/getting-here/FrostedMapSection";
import GettingHereToc from "@/app/components/getting-here/GettingHereToc";
import FadeInBlock from "@/app/components/getting-here/FadeInBlock";
import {
  ArticleFigure,
  ArticleImage,
  ArticleSection,
  ArticleVideo,
  EpilogueQuote,
  Prose,
  Subhead,
} from "@/app/components/almanac/AlmanacArticlePrimitives";
import type {
  AlmanacArticle,
  AlmanacArticleSection,
  AlmanacContentBlock,
} from "@/app/data/almanacArticles";
import { BodyText, CTALink, Eyebrow, Headline } from "@/app/components/ui/Typography";

type Props = {
  article: AlmanacArticle;
};

function renderBlock(sectionId: string, block: AlmanacContentBlock, index: number) {
  if (block.type === "prose") {
    return <Prose key={`${sectionId}-p-${index}`}>{block.text}</Prose>;
  }
  if (block.type === "image") {
    return (
      <ArticleFigure
        key={`${sectionId}-i-${index}`}
        src={block.src}
        alt={block.alt}
        captionTitle={block.captionTitle}
        caption={block.caption}
        aspectClass={block.aspectClass}
        fit={block.fit}
        size={block.size}
      />
    );
  }
  if (block.type === "video") {
    return (
      <ArticleVideo
        key={`${sectionId}-v-${index}`}
        src={block.src}
        alt={block.alt}
        caption={block.caption}
        credit={block.credit}
      />
    );
  }
  return <Subhead key={`${sectionId}-s-${index}`}>{block.text}</Subhead>;
}

function SectionContent({ section }: { section: AlmanacArticleSection }) {
  const compactAsideImage = section.image?.size === "compact" ? section.image : null;
  const proseBlocks = section.blocks.filter((block) => block.type === "prose");

  const compactImageBlockIndex = section.blocks.findIndex(
    (block) => block.type === "image" && block.size === "compact"
  );
  const compactImageBlock =
    compactImageBlockIndex >= 0 ? section.blocks[compactImageBlockIndex] : null;
  const blocksBeforeCompactImage =
    compactImageBlockIndex >= 0 ? section.blocks.slice(0, compactImageBlockIndex) : [];
  const blocksAfterCompactImage =
    compactImageBlockIndex >= 0 ? section.blocks.slice(compactImageBlockIndex + 1) : [];

  if (
    compactImageBlock?.type === "image" &&
    blocksBeforeCompactImage.length > 0 &&
    blocksBeforeCompactImage.every((block) => block.type === "prose")
  ) {
    return (
      <>
        <FadeInBlock delay={0.08}>
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
            <div className="min-w-0 flex-1 space-y-6">
              {blocksBeforeCompactImage.map((block, index) =>
                renderBlock(section.id, block, index)
              )}
            </div>
            <ArticleFigure
              src={compactImageBlock.src}
              alt={compactImageBlock.alt}
              captionTitle={compactImageBlock.captionTitle}
              caption={compactImageBlock.caption}
              fit={compactImageBlock.fit}
              size="compact"
            />
          </div>
        </FadeInBlock>
        {blocksAfterCompactImage.map((block, index) => (
          <FadeInBlock key={`${section.id}-tail-${index}`} delay={0.08}>
            {renderBlock(section.id, block, compactImageBlockIndex + 1 + index)}
          </FadeInBlock>
        ))}
      </>
    );
  }

  if (compactAsideImage && proseBlocks.length > 0) {
    const nonProseBlocks = section.blocks.filter((block) => block.type !== "prose");
    return (
      <>
        <FadeInBlock delay={0.08}>
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
            <div className="min-w-0 flex-1 space-y-6">
              {section.blocks.map((block, index) =>
                block.type === "prose" ? renderBlock(section.id, block, index) : null
              )}
            </div>
            <ArticleImage
              src={compactAsideImage.src}
              alt={compactAsideImage.alt}
              label={compactAsideImage.label}
              caption={compactAsideImage.caption}
              size="compact"
            />
          </div>
        </FadeInBlock>
        {nonProseBlocks.map((block, index) => (
          <FadeInBlock key={`${section.id}-b-${index}`} delay={0.08}>
            {renderBlock(section.id, block, index)}
          </FadeInBlock>
        ))}
      </>
    );
  }

  return (
    <>
      {section.image && section.image.size !== "compact" ? (
        <ArticleImage
          src={section.image.src}
          alt={section.image.alt}
          label={section.image.label}
          caption={section.image.caption}
          aspectClass={section.image.aspectClass}
          size={section.image.size}
        />
      ) : null}
      {section.blocks.map((block, index) => (
        <FadeInBlock key={`${section.id}-${index}`} delay={0.08}>
          {renderBlock(section.id, block, index)}
        </FadeInBlock>
      ))}
    </>
  );
}

export default function AlmanacArticleLayout({ article }: Props) {
  const locale = useLocale();
  const localePrefix = locale === "mn" ? "/mn" : "";
  const reduceMotion = useReducedMotion();

  const tocItems = article.sections.map((section) => ({
    id: section.id,
    label: section.tocLabel,
  }));

  return (
    <PageShell>
      <FrostedMapSection
        aria-label={article.title}
        className="pb-16 md:pb-24 pt-10 md:pt-14 min-h-[min(52vh,28rem)]"
        imageSrc={article.heroImage.src}
        imagePriority
        frostOpacity={14}
        frostBlurPx={6}
        mapObjectPosition={article.heroImage.objectPosition ?? "50% 50%"}
        contentClassName="mx-auto flex max-w-3xl flex-col items-start gap-8 px-6 text-left"
      >
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7 }}
        >
          <Eyebrow className="!text-water-deep/70 mb-5">
            {article.chapterEyebrow}
          </Eyebrow>
          <Headline as="h1" size="section" align="left" className="!text-left">
            {article.title}
          </Headline>
        </motion.div>
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            delay: reduceMotion ? 0 : 0.15,
          }}
          className="flex flex-col gap-6"
        >
          {article.lede.map((paragraph) => (
            <BodyText key={paragraph.slice(0, 40)} size="md" className="!text-left text-ink/80">
              {paragraph}
            </BodyText>
          ))}
        </motion.div>
      </FrostedMapSection>

      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <FadeInBlock className="mb-12 md:mb-16">
            <CTALink
              href={`${localePrefix}/almanac`}
              arrow={false}
              className="!text-ink/50 hover:!text-water-deep [&>span]:!border-ink/20 [&>span]:group-hover:!border-water-deep/40"
            >
              ← The Almanac
            </CTALink>
          </FadeInBlock>

          <article
            aria-label={article.title}
            className="lg:grid lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)] lg:gap-x-14 xl:gap-x-20"
          >
            <aside className="mb-12 lg:mb-0">
              <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-2">
                <FadeInBlock>
                  <GettingHereToc items={tocItems} />
                </FadeInBlock>
              </div>
            </aside>

            <div className="min-w-0 space-y-0">
              {article.sections.map((section) => (
                <ArticleSection key={section.id} id={section.id} title={section.title}>
                  <SectionContent section={section} />
                </ArticleSection>
              ))}
              {article.epilogue ? (
                <EpilogueQuote
                  quote={article.epilogue.quote}
                  attribution={article.epilogue.attribution}
                />
              ) : null}
            </div>
          </article>

          {(article.prev || article.next) && (
            <FadeInBlock className="mt-20 flex flex-col gap-6 border-t border-ink/10 pt-12 sm:flex-row sm:justify-between">
              {article.prev ? (
                <Link
                  href={`${localePrefix}${article.prev.href}`}
                  className="group font-body text-sm text-ink/60 transition-colors hover:text-water-deep"
                >
                  <span className="font-cta text-[10px] uppercase tracking-[0.25em] text-ink/40">
                    Previous
                  </span>
                  <span className="mt-1 block text-base text-ink group-hover:text-water-deep">
                    {article.prev.label}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {article.next ? (
                <Link
                  href={`${localePrefix}${article.next.href}`}
                  className="group text-right font-body text-sm text-ink/60 transition-colors hover:text-water-deep sm:ml-auto"
                >
                  <span className="font-cta text-[10px] uppercase tracking-[0.25em] text-ink/40">
                    Next
                  </span>
                  <span className="mt-1 block text-base text-ink group-hover:text-water-deep">
                    {article.next.label}
                  </span>
                </Link>
              ) : null}
            </FadeInBlock>
          )}
        </div>
      </section>
    </PageShell>
  );
}
