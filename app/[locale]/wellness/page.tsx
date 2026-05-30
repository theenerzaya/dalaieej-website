"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import PageShell from "@/app/components/layout/PageShell";
import {
  BodyText,
  CTALink,
  Eyebrow,
  Headline,
} from "@/app/components/ui/Typography";
import FadeInBlock from "@/app/components/getting-here/FadeInBlock";
import FrostedMapSection from "@/app/components/getting-here/FrostedMapSection";
import WellnessSaunaCollage from "@/app/components/wellness/WellnessSaunaCollage";

type LocaleKey = "en" | "mn";

const HERO_COPY: Record<
  LocaleKey,
  { eyebrow: string; title: string; body: string }
> = {
  en: {
    eyebrow: "Wellness",
    title: "Restore Your Rhythm",
    body: "Restore mind, body, and spirit in the tranquility of nature's embrace.",
  },
  mn: {
    eyebrow: "Сэргээлт",
    title: "Байгальд Уусах",
    body: "Байгалийн тайван орчинд бие сэтгэлийг сэргээх.",
  },
};

const BOOK_CTA_COPY: Record<LocaleKey, { bookTitle: string; bookCta: string }> = {
  en: { bookTitle: "Book a Treatment", bookCta: "Reserve Now" },
  mn: { bookTitle: "Цаг захиалах", bookCta: "Захиалах" },
};

export default function WellnessPage() {
  const locale = useLocale();
  const lang: LocaleKey = locale === "mn" ? "mn" : "en";
  const localePrefix = lang === "mn" ? "/mn" : "";
  const reduceMotion = useReducedMotion();
  const hero = HERO_COPY[lang];
  const bookCta = BOOK_CTA_COPY[lang];

  return (
    <PageShell>
      <FrostedMapSection
        aria-label={hero.title}
        className="pb-16 md:pb-24 pt-10 md:pt-14 min-h-[min(58vh,32rem)]"
        imageSrc="/images/silogrid/wellness.webp"
        imagePriority
        frostOpacity={13.87}
        frostBlurPx={6.2}
        mapObjectPosition="50% 42%"
      >
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7 }}
        >
          <Eyebrow className="!text-water-deep/70 mb-6">{hero.eyebrow}</Eyebrow>
          <Headline as="h1" size="section">
            {hero.title}
          </Headline>
        </motion.div>
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            delay: reduceMotion ? 0 : 0.15,
          }}
        >
          <BodyText size="md" className="max-w-2xl">
            {hero.body}
          </BodyText>
        </motion.div>
      </FrostedMapSection>

      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl space-y-20 md:space-y-28">
          <WellnessSaunaCollage locale={lang} />
        </div>
      </section>

      <FrostedMapSection
        aria-label={bookCta.bookTitle}
        className="py-24 md:py-32"
        imageSrc="/images/gallery/wellness/DBR_3098.webp"
        contentClassName="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center"
        fadeTop
        fadeBottom={false}
        mapObjectPosition="50% 40%"
      >
        <FadeInBlock className="flex w-full flex-col items-center gap-8 text-center">
          <Eyebrow className="!text-water-deep/70">Plan your stay</Eyebrow>
          <Headline as="h2" size="sub">
            {bookCta.bookTitle}
          </Headline>
          <BodyText size="md" className="max-w-xl">
            {lang === "mn"
              ? "Далайн эрэг дээрх спа, саун, йогийн цагийг урьдчилан захиалаарай."
              : "Reserve spa, sauna, and yoga sessions ahead of your arrival on the lake shore."}
          </BodyText>
          <CTALink href={`${localePrefix}/booking`} arrow>
            {bookCta.bookCta}
          </CTALink>
        </FadeInBlock>
      </FrostedMapSection>
    </PageShell>
  );
}
