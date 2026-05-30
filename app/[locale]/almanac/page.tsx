"use client";

import { useLocale, useTranslations } from "next-intl";
import PageShell from "@/app/components/layout/PageShell";
import ContentSection from "@/app/components/ui/ContentSection";
import AlmanacChapterBlock from "@/app/components/almanac/AlmanacChapterBlock";
import FadeInBlock from "@/app/components/getting-here/FadeInBlock";
import { ALMANAC_CHAPTERS as EN_CHAPTERS } from "@/app/data/almanacChapters";
import { ALMANAC_CHAPTERS as MN_CHAPTERS } from "@/app/data/almanacChapters.mn";
import { BodyText, Eyebrow, Headline } from "@/app/components/ui/Typography";

export default function AlmanacPage() {
  const locale = useLocale();
  const t = useTranslations("almanacPage");
  const localePrefix = locale === "mn" ? "/mn" : "";
  const sourceChapters = locale === "mn" ? MN_CHAPTERS : EN_CHAPTERS;

  const chapters = sourceChapters.map((chapter) => ({
    ...chapter,
    href: chapter.href ? `${localePrefix}${chapter.href}` : undefined,
  }));

  return (
    <PageShell>
      <ContentSection
        tone="surface"
        width="wide"
        align="left"
        stack={false}
        className="!pt-28 !pb-32 md:!pt-36 md:!pb-44"
      >
        <div className="mb-10 flex max-w-2xl flex-col gap-5 md:mb-12">
          <FadeInBlock distance={20}>
            <Eyebrow className="!text-water-deep/70">{t("eyebrow")}</Eyebrow>
          </FadeInBlock>
          <FadeInBlock delay={0.06} distance={20}>
            <Headline as="h1" size="section" align="left" className="!text-left">
              {t("title")}
            </Headline>
          </FadeInBlock>
          <FadeInBlock delay={0.12} distance={20}>
            <BodyText size="md" className="!text-left text-ink/75">
              {t("hook")}
            </BodyText>
          </FadeInBlock>
          <FadeInBlock delay={0.18} distance={20}>
            <p className="font-cta text-[11px] font-medium uppercase leading-relaxed tracking-[0.15em] text-ink/50">
              {t("seoMeta")}
            </p>
          </FadeInBlock>
        </div>

        <div className="flex flex-col">
          {chapters.map((chapter, index) => (
            <AlmanacChapterBlock
              key={chapter.id}
              index={index}
              isLast={index === chapters.length - 1}
              {...chapter}
            />
          ))}
        </div>
      </ContentSection>
    </PageShell>
  );
}
