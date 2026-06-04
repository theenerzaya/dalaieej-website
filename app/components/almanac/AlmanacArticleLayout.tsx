"use client";

import type { ReactNode } from "react";
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
  ArchivalCard,
  ArchivalFurtherReading,
  JournalInsetVideo,
  EditorialPullQuote,
  EpilogueQuote,
  InlineDataCard,
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

function appearDelay(index: number) {
  return Math.min(index * 0.05, 0.3);
}

function Appear({
  index = 0,
  className,
  children,
}: {
  index?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <FadeInBlock delay={appearDelay(index)} distance={20} className={className}>
      {children}
    </FadeInBlock>
  );
}

type ImageBlock = Extract<AlmanacContentBlock, { type: "image" }>;

function blockPlacement(block: AlmanacContentBlock): AsidePlacement | undefined {
  if (block.type === "prose" || block.type === "image") return block.placement;
  return undefined;
}

function hasSplitAsidePlacements(blocks: AlmanacContentBlock[]) {
  const centerImageCount = blocks.filter(
    (block) => block.type === "image" && blockPlacement(block) === "center"
  ).length;
  if (centerImageCount >= 2) return true;
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

function renderBlock(_sectionId: string, block: AlmanacContentBlock) {
  if (block.type === "prose") {
    return <Prose>{block.text}</Prose>;
  }
  if (block.type === "image") {
    return (
      <ArticleFigure
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
        src={block.src}
        alt={block.alt}
        caption={block.caption}
        credit={block.credit}
        width={block.width}
      />
    );
  }
  if (block.type === "dataCard") {
    return (
      <InlineDataCard
        eyebrow={block.eyebrow}
        body={block.body}
      />
    );
  }
  return <Subhead>{block.text}</Subhead>;
}

function FlowSectionContent({ section }: { section: AlmanacArticleSection }) {
  let animIndex = 0;

  return (
    <>
      {section.image && !isCompactFigureSize(section.image.size) ? (
        <Appear index={animIndex++}>
          <ArticleImage
            src={section.image.src}
            alt={section.image.alt}
            label={section.image.label}
            caption={section.image.caption}
            aspectClass={section.image.aspectClass}
            fit={section.image.fit}
            size={section.image.size}
          />
        </Appear>
      ) : null}
      <div className="flow-root min-w-0">
        {section.blocks.map((block, index) => {
          const currentIndex = animIndex++;
          if (block.type === "prose") {
            return (
              <Appear
                key={`${section.id}-flow-p-${index}`}
                index={currentIndex}
                className="mb-6 last:mb-0"
              >
                <Prose>{block.text}</Prose>
              </Appear>
            );
          }
          return (
            <Appear
              key={`${section.id}-flow-${index}`}
              index={currentIndex}
              className={
                block.type === "image"
                  ? block.size === "featured"
                    ? "clear-both my-10 md:my-16"
                    : "my-8"
                  : undefined
              }
            >
              {renderBlock(section.id, block)}
            </Appear>
          );
        })}
      </div>
    </>
  );
}

function SectionContent({ section }: { section: AlmanacArticleSection }) {
  if (section.layout === "flow") {
    return <FlowSectionContent section={section} />;
  }

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
          <div className="mb-8 space-y-6 md:mb-10">
            {introBlocks.map((block, index) => (
              <Appear key={`${section.id}-intro-${index}`} index={index}>
                {renderBlock(section.id, block)}
              </Appear>
            ))}
          </div>
        ) : null}
        {centerBlocks.length > 0 ? (
          <div
            className={
              centerBlocks.length > 1
                ? "mb-8 flex w-full max-w-[min(100%,52rem)] flex-col items-center justify-center gap-8 mx-auto md:mb-10 md:flex-row md:items-center md:justify-center md:gap-8 md:translate-x-[min(6vw,3.25rem)] [&_figure]:mx-0 [&_figcaption]:text-center"
                : "mb-8 mx-auto w-full max-w-[min(100%,24rem)] md:mb-10 [&_figcaption]:text-center"
            }
          >
            {centerBlocks.map((block, index) => (
              <Appear
                key={`${section.id}-center-${index}`}
                index={introBlocks.length + index}
              >
                {renderAsideBlock(section.id, block, `${section.id}-center-${index}`)}
              </Appear>
            ))}
          </div>
        ) : null}
        {spanBlocks.length > 0 ? (
          <div className="mb-8 min-w-0 space-y-6 md:mb-10">
            {spanBlocks.map((block, index) => (
              <Appear
                key={`${section.id}-span-${index}`}
                index={introBlocks.length + centerBlocks.length + index}
              >
                {renderBlock(section.id, block)}
              </Appear>
            ))}
          </div>
        ) : null}
        {leftAside.length > 0 || rightAside.length > 0 ? (
          <div className="flex min-w-0 flex-col gap-8 md:flex-row md:items-end md:gap-8">
            {leftAside.length > 0 ? (
              <div className="min-w-0 flex-1 space-y-8 md:max-w-[34rem]">
                {leftAside.map((block, index) => (
                  <Appear
                    key={`${section.id}-left-${index}`}
                    index={
                      introBlocks.length +
                      centerBlocks.length +
                      spanBlocks.length +
                      index
                    }
                  >
                    {renderAsideBlock(section.id, block, `${section.id}-left-${index}`)}
                  </Appear>
                ))}
              </div>
            ) : null}
            {rightAside.length > 0 ? (
              <div className="flex min-w-0 w-full flex-col gap-8 md:w-auto md:max-w-[9.2rem] md:shrink-0">
                {rightAside.map((block, index) => (
                  <Appear
                    key={`${section.id}-right-${index}`}
                    index={
                      introBlocks.length +
                      centerBlocks.length +
                      spanBlocks.length +
                      leftAside.length +
                      index
                    }
                  >
                    {renderAsideBlock(section.id, block, `${section.id}-right-${index}`)}
                  </Appear>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </>
    );
  }

  const compactAsideRun = collectCompactAsideRun(section.blocks);

  if (compactAsideRun) {
    const { blocksBefore, compactImageBlocks, asideProseBlocks, blocksAfter } =
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

    const proseSource = imagesOnLeft ? asideProseBlocks : blocksBefore;
    const animIndex = imagesOnLeft && blocksBefore.length > 0 ? blocksBefore.length : 0;

    const imageColumn = (
      <div className="flex min-w-0 w-full shrink-0 flex-col gap-8 md:w-auto">
        {compactImageBlocks.map((block, imageIndex) => (
          <Appear
            key={`${section.id}-aside-img-${imageIndex}`}
            index={animIndex + imageIndex}
          >
            <ArticleFigure
              src={block.src}
              alt={block.alt}
              captionTitle={block.captionTitle}
              caption={block.caption}
              fit={block.fit}
              frameless={block.frameless}
              size={block.size && isCompactFigureSize(block.size) ? block.size : "compact"}
            />
          </Appear>
        ))}
      </div>
    );

    const proseStartIndex = animIndex + compactImageBlocks.length;
    const proseColumn = (
      <div className="min-w-0 flex-1 space-y-6 md:max-w-[34rem]">
        {proseSource.map((block, index) => (
          <Appear key={`${section.id}-aside-prose-${index}`} index={proseStartIndex + index}>
            {renderBlock(section.id, block)}
          </Appear>
        ))}
        {imagesOnLeft
          ? asideEndRightImages.map((block, imageIndex) => (
              <Appear
                key={`${section.id}-aside-right-${imageIndex}`}
                index={proseStartIndex + proseSource.length + imageIndex}
              >
                <div className="ml-auto w-fit max-w-full">
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
              </Appear>
            ))
          : null}
      </div>
    );

    const tailStartIndex =
      proseStartIndex + proseSource.length + (imagesOnLeft ? asideEndRightImages.length : 0);

    return (
      <>
        {imagesOnLeft && blocksBefore.length > 0 ? (
          <div className="mb-8 space-y-6 md:mb-10">
            {blocksBefore.map((block, index) => (
              <Appear key={`${section.id}-before-${index}`} index={index}>
                {renderBlock(section.id, block)}
              </Appear>
            ))}
          </div>
        ) : null}
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
        {tailBlocks.map((block, index) => (
          <Appear key={`${section.id}-tail-${index}`} index={tailStartIndex + index}>
            {renderBlock(section.id, block)}
          </Appear>
        ))}
      </>
    );
  }

  if (compactAsideImage && proseBlocks.length > 0) {
    const nonProseBlocks = section.blocks.filter((block) => block.type !== "prose");
    const proseCount = section.blocks.filter((block) => block.type === "prose").length;

    return (
      <>
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
          <div className="min-w-0 flex-1 space-y-6">
            {section.blocks.map((block, index) =>
              block.type === "prose" ? (
                <Appear key={`${section.id}-p-${index}`} index={index}>
                  {renderBlock(section.id, block)}
                </Appear>
              ) : null
            )}
          </div>
          <Appear index={proseCount} className="shrink-0">
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
          </Appear>
        </div>
        {nonProseBlocks.map((block, index) => (
          <Appear key={`${section.id}-b-${index}`} index={proseCount + 1 + index}>
            {renderBlock(section.id, block)}
          </Appear>
        ))}
      </>
    );
  }

  return (
    <>
      {section.image && !isCompactFigureSize(section.image.size) ? (
        <Appear index={0}>
          <ArticleImage
            src={section.image.src}
            alt={section.image.alt}
            label={section.image.label}
            caption={section.image.caption}
            aspectClass={section.image.aspectClass}
            fit={section.image.fit}
            size={section.image.size}
          />
        </Appear>
      ) : null}
      {section.blocks.map((block, index) => (
        <Appear
          key={`${section.id}-${index}`}
          index={section.image && !isCompactFigureSize(section.image.size) ? index + 1 : index}
        >
          {renderBlock(section.id, block)}
        </Appear>
      ))}
    </>
  );
}

export default function AlmanacArticleLayout({ article }: Props) {
  const locale = useLocale();
  const localePrefix = locale === "mn" ? "/mn" : "/en";
  const reduceMotion = useReducedMotion();

  const tocItems = [
    ...article.sections.map((section) => ({
      id: section.id,
      label: section.tocLabel,
    })),
    ...(article.archivalCard?.id && article.archivalCard.tocLabel
      ? [{ id: article.archivalCard.id, label: article.archivalCard.tocLabel }]
      : []),
    ...(article.journalInset?.id && article.journalInset.tocLabel
      ? [{ id: article.journalInset.id, label: article.journalInset.tocLabel }]
      : []),
  ];

  const translucentNav = article.translucentNavbar ?? false;

  return (
    <PageShell offsetNavbar={!translucentNav}>
      <FrostedMapSection
        aria-label={article.title}
        className={
          translucentNav
            ? "pb-16 md:pb-24 pt-[calc(var(--navbar-h)+2.5rem)] md:pt-[calc(var(--navbar-h)+3.5rem)] min-h-[min(52vh,28rem)]"
            : "pb-16 md:pb-24 pt-10 md:pt-14 min-h-[min(52vh,28rem)]"
        }
        imageSrc={article.heroImage.src}
        imagePriority
        frostOpacity={article.heroImage.frostOpacity ?? 14}
        frostBlurPx={article.heroImage.frostBlurPx ?? 6}
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
        {translucentNav ? (
          <div
            id="hero-nav-sentinel"
            aria-hidden
            className="pointer-events-none h-px w-full shrink-0"
          />
        ) : null}
      </FrostedMapSection>

      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto min-w-0 max-w-6xl">
          <FadeInBlock distance={20} className="mb-12 md:mb-16">
            <CTALink
              href={`${localePrefix}/almanac`}
              arrow={false}
              className="!text-ink/50 hover:!text-water-deep [&>span]:!border-ink/20 [&>span]:group-hover:!border-water-deep/40"
            >
              ← {locale === "mn" ? "Товчоон" : "The Almanac"}
            </CTALink>
          </FadeInBlock>

          <article
            aria-label={article.title}
            className="lg:grid lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)] lg:gap-x-14 xl:gap-x-20"
          >
            <aside className="mb-12 lg:mb-0">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <FadeInBlock distance={20}>
                  <GettingHereToc items={tocItems} />
                </FadeInBlock>
              </div>
            </aside>

            <div className="min-w-0 space-y-0 overflow-x-clip">
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
              {article.archivalCard ? (
                <ArchivalCard
                  id={article.archivalCard.id}
                  eyebrow={article.archivalCard.eyebrow}
                  body={article.archivalCard.body}
                  image={article.archivalCard.image}
                  link={article.archivalCard.link}
                  review={article.archivalCard.review}
                />
              ) : null}

              {article.journalInset ? (
                <JournalInsetVideo
                  id={article.journalInset.id}
                  eyebrow={article.journalInset.eyebrow}
                  title={article.journalInset.title}
                  body={article.journalInset.body}
                  src={article.journalInset.src}
                  alt={article.journalInset.alt}
                />
              ) : null}

              {article.pullQuote ? (
                <EditorialPullQuote
                  eyebrow={article.pullQuote.eyebrow}
                  title={article.pullQuote.title}
                  body={article.pullQuote.body}
                  image={article.pullQuote.image}
                />
              ) : null}

              {article.closingImage ? (
                <Appear className="mt-12 md:mt-16">
                  <div className="mx-auto max-w-3xl">
                    <ArticleFigure
                      src={article.closingImage.src}
                      alt={article.closingImage.alt}
                      caption={article.closingImage.caption}
                      aspectClass={article.closingImage.aspectClass ?? "aspect-[4/3]"}
                    />
                  </div>
                </Appear>
              ) : null}

              {article.epilogue ? (
                <EpilogueQuote
                  quote={article.epilogue.quote}
                  attribution={article.epilogue.attribution}
                  compact
                />
              ) : null}

              {article.furtherReading?.length ? (
                <ArchivalFurtherReading items={article.furtherReading} />
              ) : null}

              {(article.prev || article.next) && (
                <FadeInBlock distance={20} className="mt-20 flex flex-col gap-6 border-t border-ink/10 pt-12 sm:flex-row sm:justify-between">
                  {article.prev ? (
                    <Link
                      href={`${localePrefix}${article.prev.href}`}
                      className="group font-body text-sm text-ink/60 transition-colors hover:text-water-deep"
                    >
                      <span className="font-cta text-[10px] uppercase tracking-[0.25em] text-ink/40">
                        {locale === "mn" ? "Өмнөх" : "Previous"}
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
                        {locale === "mn" ? "Дараах" : "Next"}
                      </span>
                      <span className="mt-1 block text-base text-ink group-hover:text-water-deep">
                        {article.next.label}
                      </span>
                    </Link>
                  ) : null}
                </FadeInBlock>
              )}
            </div>
          </article>
        </div>
      </section>
    </PageShell>
  );
}
