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
  ArchivalFurtherReading,
  EditorialPullQuote,
  EpilogueQuote,
  isCompactFigureSize,
  Prose,
  Subhead,
} from "@/app/components/almanac/AlmanacArticlePrimitives";
import type {
  AlmanacArticle,
  AlmanacArticleSection,
  AlmanacContentBlock,
  AsidePlacement,
} from "@/app/data/almanacArticles";
import { BodyText, CTALink, Eyebrow, Headline } from "@/app/components/ui/Typography";

type Props = {
  article: AlmanacArticle;
};

type ImageBlock = Extract<AlmanacContentBlock, { type: "image" }>;

function blockPlacement(block: AlmanacContentBlock): AsidePlacement | undefined {
  if (block.type === "prose" || block.type === "image") return block.placement;
  return undefined;
}

function hasSplitAsidePlacements(blocks: AlmanacContentBlock[]) {
  return blocks.some((block) => {
    const placement = blockPlacement(block);
    return placement === "aside-left" || placement === "aside-right";
  });
}

function partitionSplitAside(blocks: AlmanacContentBlock[], firstCompactIdx: number) {
  const headBlocks = blocks.slice(0, firstCompactIdx);
  const introBlocks = headBlocks.filter((block) => {
    const placement = blockPlacement(block);
    return placement !== "aside-span" && placement !== "center";
  });
  const centerBlocks: AlmanacContentBlock[] = [];
  const spanBlocks: AlmanacContentBlock[] = [];
  const leftAside: AlmanacContentBlock[] = [];
  const rightAside: AlmanacContentBlock[] = [];

  for (const block of blocks.slice(firstCompactIdx)) {
    const placement = blockPlacement(block);
    if (placement === "center") {
      centerBlocks.push(block);
    } else if (placement === "aside-span") {
      spanBlocks.push(block);
    } else if (placement === "aside-right") {
      rightAside.push(block);
    } else if (placement === "aside-left") {
      leftAside.push(block);
    }
  }

  return { introBlocks, centerBlocks, spanBlocks, leftAside, rightAside };
}

function renderAsideBlock(sectionId: string, block: AlmanacContentBlock, key: string) {
  if (block.type === "prose") {
    return <Prose key={key}>{block.text}</Prose>;
  }
  if (block.type === "image") {
    return (
      <ArticleFigure
        key={key}
        src={block.src}
        alt={block.alt}
        captionTitle={block.captionTitle}
        caption={block.caption}
        fit={block.fit}
        frameless={block.frameless}
        size={block.size && isCompactFigureSize(block.size) ? block.size : "compact"}
      />
    );
  }
  return null;
}

function collectCompactAsideRun(blocks: AlmanacContentBlock[]) {
  const firstIdx = blocks.findIndex(
    (block) => block.type === "image" && isCompactFigureSize(block.size)
  );
  if (firstIdx < 0) return null;

  let lastIdx = firstIdx;
  while (lastIdx + 1 < blocks.length) {
    const next = blocks[lastIdx + 1];
    if (next.type !== "image") break;
    if (!isCompactFigureSize(next.size)) break;
    if (next.placement === "aside-right" || next.placement === "center") break;
    lastIdx += 1;
  }

  const blocksBefore = blocks.slice(0, firstIdx);
  const compactImageBlocks = blocks.slice(firstIdx, lastIdx + 1) as ImageBlock[];

  const asideProseBlocks: Extract<AlmanacContentBlock, { type: "prose" }>[] = [];
  let tailIdx = lastIdx + 1;
  while (tailIdx < blocks.length && blocks[tailIdx].type === "prose") {
    asideProseBlocks.push(blocks[tailIdx] as Extract<AlmanacContentBlock, { type: "prose" }>);
    tailIdx += 1;
  }
  const blocksAfter = blocks.slice(tailIdx);

  if (
    blocksBefore.length === 0 ||
    !blocksBefore.every((block) => block.type === "prose")
  ) {
    return null;
  }

  return { blocksBefore, compactImageBlocks, asideProseBlocks, blocksAfter, firstIdx };
}

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
        frameless={block.frameless}
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
  const compactAsideImage =
    section.image && isCompactFigureSize(section.image.size) ? section.image : null;
  const proseBlocks = section.blocks.filter((block) => block.type === "prose");

  const firstCompactIdx = section.blocks.findIndex(
    (block) => block.type === "image" && isCompactFigureSize(block.size)
  );

  if (
    firstCompactIdx >= 0 &&
    section.compactAside === "left" &&
    hasSplitAsidePlacements(section.blocks)
  ) {
    const { introBlocks, centerBlocks, spanBlocks, leftAside, rightAside } =
      partitionSplitAside(section.blocks, firstCompactIdx);

    return (
      <>
        {introBlocks.length > 0 ? (
          <FadeInBlock delay={0.08} className="mb-8 md:mb-10">
            <div className="space-y-6">
              {introBlocks.map((block, index) =>
                renderBlock(section.id, block, index)
              )}
            </div>
          </FadeInBlock>
        ) : null}
        {centerBlocks.length > 0 ? (
          <FadeInBlock delay={0.08} className="mb-8 md:mb-10">
            <div className="mx-auto w-full max-w-[min(100%,24rem)] [&_figcaption]:text-center">
              {centerBlocks.map((block, index) =>
                renderAsideBlock(section.id, block, `${section.id}-center-${index}`)
              )}
            </div>
          </FadeInBlock>
        ) : null}
        {spanBlocks.length > 0 ? (
          <FadeInBlock delay={0.08} className="mb-8 md:mb-10">
            <div className="min-w-0 space-y-6">
              {spanBlocks.map((block, index) =>
                renderBlock(section.id, block, introBlocks.length + centerBlocks.length + index)
              )}
            </div>
          </FadeInBlock>
        ) : null}
        <FadeInBlock delay={0.08}>
          <div className="flex min-w-0 flex-col gap-8 md:flex-row md:items-end md:gap-8">
            <div className="min-w-0 flex-1 space-y-8 md:max-w-[34rem]">
              {leftAside.map((block, index) =>
                renderAsideBlock(section.id, block, `${section.id}-left-${index}`)
              )}
            </div>
            <div className="flex min-w-0 w-full flex-col gap-8 md:w-auto md:max-w-[9.2rem] md:shrink-0">
              {rightAside.map((block, index) =>
                renderAsideBlock(section.id, block, `${section.id}-right-${index}`)
              )}
            </div>
          </div>
        </FadeInBlock>
      </>
    );
  }

  const compactAsideRun = collectCompactAsideRun(section.blocks);

  if (compactAsideRun) {
    const { blocksBefore, compactImageBlocks, asideProseBlocks, blocksAfter, firstIdx } =
      compactAsideRun;
    const imagesOnLeft =
      section.compactAside === "left" && asideProseBlocks.length > 0;
    const asideEndRightImages = blocksAfter.filter(
      (block): block is ImageBlock =>
        block.type === "image" && block.placement === "aside-right"
    );
    const tailBlocks = imagesOnLeft
      ? blocksAfter.filter(
          (block) => block.type !== "image" || block.placement !== "aside-right"
        )
      : [...asideProseBlocks, ...blocksAfter];

    const imageColumn = (
      <div className="flex min-w-0 w-full shrink-0 flex-col gap-8 md:w-auto">
        {compactImageBlocks.map((block, imageIndex) => (
          <ArticleFigure
            key={`${section.id}-aside-${imageIndex}`}
            src={block.src}
            alt={block.alt}
            captionTitle={block.captionTitle}
            caption={block.caption}
            fit={block.fit}
            frameless={block.frameless}
            size={block.size && isCompactFigureSize(block.size) ? block.size : "compact"}
          />
        ))}
      </div>
    );

    const proseColumn = (
      <div className="min-w-0 flex-1 space-y-6 md:max-w-[34rem]">
        {(imagesOnLeft ? asideProseBlocks : blocksBefore).map((block, index) =>
          renderBlock(section.id, block, index)
        )}
        {imagesOnLeft
          ? asideEndRightImages.map((block, imageIndex) => (
              <div key={`${section.id}-aside-right-${imageIndex}`} className="ml-auto w-fit max-w-full">
                <ArticleFigure
                  src={block.src}
                  alt={block.alt}
                  captionTitle={block.captionTitle}
                  caption={block.caption}
                  fit={block.fit}
                  frameless={block.frameless}
                  size={
                    block.size && isCompactFigureSize(block.size) ? block.size : "compact"
                  }
                />
              </div>
            ))
          : null}
      </div>
    );

    return (
      <>
        {imagesOnLeft && blocksBefore.length > 0 ? (
          <FadeInBlock delay={0.08} className="mb-8 md:mb-10">
            <div className="space-y-6">
              {blocksBefore.map((block, index) => renderBlock(section.id, block, index))}
            </div>
          </FadeInBlock>
        ) : null}
        <FadeInBlock delay={0.08}>
          <div className="flex min-w-0 flex-col gap-8 md:flex-row md:items-start md:gap-8">
            {imagesOnLeft ? (
              <>
                {imageColumn}
                {proseColumn}
              </>
            ) : (
              <>
                {proseColumn}
                {imageColumn}
              </>
            )}
          </div>
        </FadeInBlock>
        {tailBlocks.map((block, index) => (
          <FadeInBlock key={`${section.id}-tail-${index}`} delay={0.08}>
            {renderBlock(
              section.id,
              block,
              firstIdx + compactImageBlocks.length + index
            )}
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
              size={
                compactAsideImage.size && isCompactFigureSize(compactAsideImage.size)
                  ? compactAsideImage.size
                  : "compact"
              }
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
      {section.image && !isCompactFigureSize(section.image.size) ? (
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
        <div className="mx-auto min-w-0 max-w-6xl overflow-x-hidden">
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
                  {section.epilogue ? (
                    <EpilogueQuote
                      quote={section.epilogue.quote}
                      attribution={section.epilogue.attribution}
                      compact
                    />
                  ) : null}
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

          {article.pullQuote ? (
            <EditorialPullQuote
              eyebrow={article.pullQuote.eyebrow}
              title={article.pullQuote.title}
              body={article.pullQuote.body}
              image={article.pullQuote.image}
            />
          ) : null}

          {article.closingImage ? (
            <FadeInBlock className="mt-12 px-6 md:mt-16">
              <div className="mx-auto max-w-3xl">
                <ArticleFigure
                  src={article.closingImage.src}
                  alt={article.closingImage.alt}
                  caption={article.closingImage.caption}
                  aspectClass={article.closingImage.aspectClass ?? "aspect-[4/3]"}
                />
              </div>
            </FadeInBlock>
          ) : null}

          {article.furtherReading?.length ? (
            <ArchivalFurtherReading items={article.furtherReading} />
          ) : null}

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
