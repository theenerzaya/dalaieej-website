"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import { Eyebrow, Headline, CTALink } from "../ui/Typography";

export default function EditorialIntro() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';
  const reduceMotion = useReducedMotion();
  const storyHref = `${localePrefix}/about-us`;

  return (
    <section
      id="editorial-intro"
      className="sticky top-0 z-0 scroll-mt-24 min-h-screen flex items-center px-6 bg-surface"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 text-center w-full">
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
        >
          <Eyebrow className="!text-water-deep/70">
            {locale === 'mn'
              ? "Монголын хоймор нутагт"
              : "In the far north of Mongolia"}
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
          <Headline as="h2" size="section">
            {locale === 'mn' ? (
              <>
                Анир нам, ариун дагшин.
                <br />
                ХӨВСГӨЛИЙН ЗҮРХЭН ЦЭГ.
              </>
            ) : (
              <>
                SOLITARY, SACRED, SINGULAR.
                <br />
                THE HEART OF KHÖVSGÖL.
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
          <CTALink
            href={storyHref}
            className="!text-water-deep [&>span]:!border-water-deep/40 [&>span]:group-hover:!border-water-deep"
          >
            {locale === "mn" ? "Бидний түүх" : "About us"}
          </CTALink>
        </motion.div>
      </div>
    </section>
  );
}
