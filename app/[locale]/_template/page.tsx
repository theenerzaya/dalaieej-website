"use client";

/**
 * Page template — reference scaffold for new routes.
 *
 * This folder starts with an underscore, so Next.js App Router treats it as
 * a *private folder* and will NOT serve it at any URL. Copy this file (and,
 * if you want per-page SEO, the `_template.metadata.example.ts` sibling) into
 * a new route folder such as `app/[locale]/<your-route>/page.tsx` to start a
 * new page.
 *
 * Composition pattern used across the site:
 *   <PageShell>              // navbar offset + surface bg
 *     <ContentSection>       // vertical rhythm + max-width + bg tone
 *       <Eyebrow />
 *       <Headline />
 *       <BodyText />
 *       <CTALink /> or <CTAButton />
 *     </ContentSection>
 *     ... more ContentSections ...
 *   </PageShell>
 *
 * Typography primitives live in `@/app/components/ui/Typography.tsx`.
 *
 * i18n: the home sections inline `locale === 'mn' ? ... : ...` for small
 * copy, and use `useTranslations('namespace')` against `messages/{en,mn}.json`
 * for larger content. Pick whichever fits your page and stay consistent.
 */

import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import PageShell from "@/app/components/layout/PageShell";
import ContentSection from "@/app/components/ui/ContentSection";
import {
  Eyebrow,
  Headline,
  BodyText,
  CTAButton,
} from "@/app/components/ui/Typography";

export default function TemplatePage() {
  const locale = useLocale();
  const localePrefix = locale === "mn" ? "/mn" : "";
  const reduceMotion = useReducedMotion();

  return (
    <PageShell>
      <ContentSection id="editorial-intro" tone="surface" width="default">
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
        >
          <Eyebrow className="!text-water-deep/70">
            {locale === "mn" ? "Жишээ хэсэг" : "Placeholder eyebrow"}
          </Eyebrow>
        </motion.div>

        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reduceMotion ? 0 : 0.8,
            delay: reduceMotion ? 0 : 0.1,
          }}
        >
          <Headline as="h1" size="section">
            {locale === "mn" ? (
              <>
                Жишээ гарчиг
                <br />— орлуулах дэд гарчиг.
              </>
            ) : (
              <>
                Dummy title goes here
                <br />— placeholder subtitle.
              </>
            )}
          </Headline>
        </motion.div>

        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            delay: reduceMotion ? 0 : 0.2,
          }}
        >
          <BodyText size="md" className="max-w-2xl">
            {locale === "mn"
              ? "Энэ бол жишээ үндсэн текст — байршил, хэмнэл, зайг харах зориулалттай орлуулах догол мөр."
              : "This is dummy body copy — a placeholder paragraph used to preview layout, rhythm, and spacing."}
          </BodyText>
        </motion.div>
      </ContentSection>

      <ContentSection tone="leaf-tint" width="narrow">
        <Eyebrow className="!text-water-deep/70">
          {locale === "mn" ? "Хэсгийн гарчиг" : "Section eyebrow"}
        </Eyebrow>
        <Headline as="h2" size="sub">
          {locale === "mn" ? "Өөр нэг жишээ гарчиг" : "Another placeholder headline"}
        </Headline>
        <BodyText size="md">
          {locale === "mn"
            ? "Дараагийн догол мөрийн орлуулах текст."
            : "More dummy body text lives here."}
        </BodyText>
      </ContentSection>

      <ContentSection tone="ink" width="default">
        <Headline as="h2" size="sub" tone="dark">
          {locale === "mn" ? "Хаалтын хэсэг" : "Closing envelope"}
        </Headline>
        <BodyText size="md" tone="dark" className="max-w-xl">
          {locale === "mn"
            ? "Хуудсыг төгсгөх богино орлуулах өгүүлбэр."
            : "A short placeholder line to round out the page."}
        </BodyText>
        <CTAButton href={`${localePrefix}/`} variant="secondary">
          {locale === "mn" ? "Жишээ товч" : "Placeholder CTA"}
        </CTAButton>
      </ContentSection>
    </PageShell>
  );
}
