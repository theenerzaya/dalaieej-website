"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import { Eyebrow, Headline, CTALink } from "../ui/Typography";

export default function EditorialIntro() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';
  const reduceMotion = useReducedMotion();
  const storyHref = `${localePrefix}/#`;

  return (
    <section
      id="editorial-intro"
      className="scroll-mt-24 py-24 md:py-32 px-6 bg-surface"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 text-center">
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
        >
          <Eyebrow>
            {locale === 'mn'
              ? "Монгол орны хоймор хязгаарт"
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
                Ариун дагшин, хосгүй, үнэт өв
                <br />
                — ЗҮҮН ЭРГИЙН АМИН ЗҮРХ.
              </>
            ) : (
              <>
                SOLITARY, SACRED, SINGULAR
                <br />
                — THE HEART OF KHUVSGUL.
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
          <CTALink href={storyHref}>
            {locale === "mn" ? "Бидний тухай" : "About us"}
          </CTALink>
        </motion.div>
      </div>
    </section>
  );
}
