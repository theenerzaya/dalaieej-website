"use client";

import { useLocale, useTranslations } from "next-intl";
import PageShell from "@/app/components/layout/PageShell";
import ContentSection from "@/app/components/ui/ContentSection";
import AlmanacChapterBlock from "@/app/components/almanac/AlmanacChapterBlock";
import FadeInBlock from "@/app/components/getting-here/FadeInBlock";
import { ALMANAC_CHAPTERS } from "@/app/data/almanacChapters";
import { BodyText, Eyebrow, Headline } from "@/app/components/ui/Typography";

export default function AlmanacPage() {
  const locale = useLocale();
  const t = useTranslations("almanacPage");
  const localePrefix = locale === "mn" ? "/mn" : "";

  const chapters = ALMANAC_CHAPTERS.map((chapter) => ({
    ...chapter,
    href: chapter.href ? `${localePrefix}${chapter.href}` : undefined,
  }));

  const introParagraphs = [t("intro1"), t("intro2"), t("intro3")];

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
            <Eyebrow className="!text-water-deep/70">{t("eyebrow")}</Eyebrow>
            <Headline as="h1" size="section" align="left" className="!text-left">
              {t("title")}
            </Headline>
            <BodyText size="md" className="!text-left text-ink/70 max-w-2xl">
              {t("seriesLead")}
            </BodyText>
          </div>
          <div className="flex max-w-2xl flex-col gap-7">
            {introParagraphs.map((paragraph) => (
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
