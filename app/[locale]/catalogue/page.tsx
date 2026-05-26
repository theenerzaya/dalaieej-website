"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { withLocalePath } from "@/lib/localePath";
import PageShell from "@/app/components/layout/PageShell";
import FrostedMapSection from "@/app/components/getting-here/FrostedMapSection";
import FadeInBlock from "@/app/components/getting-here/FadeInBlock";
import {
  BodyText,
  CTAButton,
  CTALink,
  Eyebrow,
  Headline,
} from "@/app/components/ui/Typography";

const HERO_IMAGE = "/images/gallery/the-resort/DBR_7361.webp";
const CATALOGUE_PDF = "/s/catalogue2026.pdf";
const FLIPBOOK_SRC = "https://online.fliphtml5.com/scxec/iewd/?wmode=opaque";

export default function CataloguePage() {
  const locale = useLocale();
  const t = useTranslations("catalogue");
  const reduceMotion = useReducedMotion();

  return (
    <PageShell>
      <FrostedMapSection
        aria-label={t("mainTitle")}
        className="pb-16 md:pb-24 pt-10 md:pt-14 min-h-[min(58vh,32rem)]"
        imageSrc={HERO_IMAGE}
        imagePriority
        frostOpacity={52}
        frostBlurPx={10}
        mapObjectPosition="50% 40%"
      >
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7 }}
        >
          <Eyebrow className="!text-water-deep/70 mb-6">
            {t("archiveLabel")}
          </Eyebrow>
          <Headline as="h1" size="section">
            {t("mainTitle")}
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
            {t("subtitle")}
          </BodyText>
        </motion.div>
      </FrostedMapSection>

      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <FadeInBlock>
            <div className="relative w-full aspect-[4/3] md:aspect-video overflow-hidden border border-ink/10 bg-surface-alt/30">
              <iframe
                src={FLIPBOOK_SRC}
                className="absolute inset-0 h-full w-full"
                scrolling="no"
                allowFullScreen
                title="The Dalai Eej Journal"
              />
            </div>
          </FadeInBlock>
        </div>
      </section>

      <section className="border-t border-ink/10 px-6 pb-24 pt-16 md:pb-32 md:pt-20">
        <div className="mx-auto max-w-6xl">
          <FadeInBlock>
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <Eyebrow className="!text-water-deep/70 mb-4">
                  {t("archiveLabel")}
                </Eyebrow>
                <BodyText size="md" className="!text-left max-w-none text-ink/75">
                  {t("downloadSubtext")}
                </BodyText>
                <div className="mt-6">
                  <CTALink href={CATALOGUE_PDF} external>
                    {t("downloadButton")}
                  </CTALink>
                </div>
              </div>
              <CTAButton href={withLocalePath(locale, "/")} variant="secondary" size="md">
                {t("returnToMainSite")}
              </CTAButton>
            </div>
          </FadeInBlock>
        </div>
      </section>
    </PageShell>
  );
}
