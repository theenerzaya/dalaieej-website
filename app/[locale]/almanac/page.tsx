"use client";

import { useLocale } from "next-intl";
import PageShell from "@/app/components/layout/PageShell";
import ContentSection from "@/app/components/ui/ContentSection";
import AlmanacChapterBlock from "@/app/components/almanac/AlmanacChapterBlock";
import FadeInBlock from "@/app/components/getting-here/FadeInBlock";
import { ALMANAC_CHAPTERS } from "@/app/data/almanacChapters";
import { BodyText, Eyebrow, Headline } from "@/app/components/ui/Typography";

const INTRO_PARAGRAPHS = [
  "Lake Khövsgöl is not merely a destination; it is a geographic and cultural fault line.",
  "To travel to the Khaich Valley is to step into a region where the open Central Asian steppe abruptly ends and the dense Siberian taiga begins. It is a landscape that has been shaped by the sweeping territories of the Zasagt Khan, the border administration of the Qing Dynasty, the heavy industry of Soviet socialism, and the ancient, unyielding traditions of the forest tribes.",
  "This collection of field notes and historical archives is designed to give you a true sense of place before you arrive on our shores.",
];

export default function AlmanacPage() {
  const locale = useLocale();
  const localePrefix = locale === "mn" ? "/mn" : "";

  const chapters = ALMANAC_CHAPTERS.map((chapter) => ({
    ...chapter,
    href: chapter.href ? `${localePrefix}${chapter.href}` : undefined,
  }));

  return (
    <PageShell>
      <ContentSection
        tone="surface"
        width="narrow"
        align="left"
        className="!pb-12 !pt-28 md:!pb-16 md:!pt-36"
      >
        <FadeInBlock className="flex flex-col gap-10 md:gap-12">
          <div className="flex flex-col gap-5">
            <Eyebrow className="!text-water-deep/70">The Almanac</Eyebrow>
            <Headline as="h1" size="section" align="left" className="!text-left">
              A Guide to the Northern Frontier
            </Headline>
          </div>
          <div className="flex max-w-2xl flex-col gap-7">
            {INTRO_PARAGRAPHS.map((paragraph) => (
              <BodyText
                key={paragraph.slice(0, 32)}
                size="md"
                className="!text-left text-ink/75"
              >
                {paragraph}
              </BodyText>
            ))}
          </div>
        </FadeInBlock>
      </ContentSection>

      <ContentSection
        tone="surface"
        width="wide"
        align="left"
        stack={false}
        className="!pt-8 !pb-32 md:!pb-44"
      >
        <div className="flex flex-col gap-28 md:gap-36 lg:gap-40">
          {chapters.map((chapter, index) => (
            <AlmanacChapterBlock key={chapter.id} index={index} {...chapter} />
          ))}
        </div>
      </ContentSection>
    </PageShell>
  );
}
