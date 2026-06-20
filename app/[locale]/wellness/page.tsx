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

const HERO_COPY: Record<LocaleKey, { title: string }> = {
  en: { title: "Wellness" },
  mn: { title: "Алжаал тайлах" },
};

const BOOK_CTA_COPY: Record<
  LocaleKey,
  { eyebrow: string; title: string; body: string; cta: string }
> = {
  en: {
    eyebrow: "Plan your stay",
    title: "Enter the Sanctuary",
    body: "Access to the shoreline hot pool, private sauna, yoga, and hiking trails is reserved exclusively for our guests. Secure your dates at the resort to begin your recovery.",
    cta: "Book your stay",
  },
  mn: {
    eyebrow: "Амралтаа төлөвлөх",
    title: "Амар амгалангийн орон зай",
    body: "Далайн хөвөөнд байрлах халуун усан сан, хувийн саун, иог болон явган аяллын жим нь зөвхөн манай зочдод зориулагдсан. Бие, сэтгэлээ сэргээх аяллаа эхлүүлэхийн тулд амрах өдрөө урьдчилан захиалаарай.",
    cta: "Амралтаа захиалах",
  },
};

export default function WellnessPage() {
  const locale = useLocale();
  const lang: LocaleKey = locale === "mn" ? "mn" : "en";
  const localePrefix = lang === "mn" ? "/mn" : "";
  const reduceMotion = useReducedMotion();
  const hero = HERO_COPY[lang];
  const bookCta = BOOK_CTA_COPY[lang];

  return (
    <PageShell offsetNavbar={false}>
      <FrostedMapSection
        aria-label={hero.title}
        className="flex min-h-[min(46.2vh,24.2rem)] items-center pb-12 md:pb-16 pt-[calc(var(--navbar-h)+2.5rem)] md:pt-[calc(var(--navbar-h)+3.5rem)]"
        imageSrc="/images/wellness/sauna-hero.webp"
        imagePriority
        frostOpacity={13.87}
        frostBlurPx={6.2}
        mapObjectPosition="50% 38%"
      >
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7 }}
          className="flex flex-col items-center"
        >
          <Headline as="h1" size="section">
            {hero.title}
          </Headline>
          <div
            id="hero-nav-sentinel"
            aria-hidden
            className="pointer-events-none h-px w-full shrink-0"
          />
        </motion.div>
      </FrostedMapSection>

      <section className="px-6 pt-24 md:pt-32 pb-20 md:pb-32">
        <WellnessSaunaCollage locale={lang} />
      </section>

      <FrostedMapSection
        aria-label={bookCta.title}
        className="mt-16 lg:mt-20 pt-24 md:pt-32 pb-24 md:pb-32"
        imageSrc="/images/map/sauna.webp"
        contentClassName="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center"
        fadeTop
        fadeBottom={false}
        mapObjectPosition="50% 58%"
      >
        <FadeInBlock className="flex w-full flex-col items-center gap-8 text-center">
          <Eyebrow className="!text-water-deep/70">{bookCta.eyebrow}</Eyebrow>
          <Headline as="h2" size="sub">
            {bookCta.title}
          </Headline>
          <BodyText size="md" className="max-w-xl">
            {bookCta.body}
          </BodyText>
          <CTALink href={`${localePrefix}/booking`} arrow>
            {bookCta.cta}
          </CTALink>
        </FadeInBlock>
      </FrostedMapSection>
    </PageShell>
  );
}
