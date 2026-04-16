"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function EditorialIntro() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="editorial-intro"
      className="scroll-mt-24 py-24 md:py-32 px-6 bg-surface"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={
            reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          className="font-body text-water-deep/60 text-sm tracking-[0.3em] uppercase mb-8"
        >
          {locale === 'mn' ? "Монгол орны хоймор хязгаарт" : "In the far north of Mongolia"}
        </motion.p>
        
        <motion.h2
          initial={
            reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reduceMotion ? 0 : 0.8,
            delay: reduceMotion ? 0 : 0.1,
          }}
          className="font-serif text-3xl md:text-4xl lg:text-5xl text-water-deep leading-relaxed mb-8"
        >
          {locale === 'mn' 
            ? "Хязгаар нутгийн амар амгалангийн орон. Хөвч тайга хөх сувдтай золгох газар."
            : "A refuge at the edge of the world. Where the taiga meets the blue pearl."}
        </motion.h2>
        
        <motion.div
          initial={
            reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            delay: reduceMotion ? 0 : 0.2,
          }}
        >
          <Link
            href=/*{`${localePrefix}/about`}*/{`${localePrefix}/#`}
            className="inline-flex items-center gap-2 font-body text-water-deep font-medium hover:gap-4 transition-all group"
          >
            <span className="border-b border-ink/30 group-hover:border-ink transition-colors">
              {locale === 'mn' ? "Бидний түүхтэй танилцах" : "Discover Our Story"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
