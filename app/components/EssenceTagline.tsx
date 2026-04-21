"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface EssenceTaglineProps {
  locale?: string;
}

export default function EssenceTagline({ locale = 'en' }: EssenceTaglineProps) {
  const isMn = locale === 'mn';
  const localePrefix = isMn ? '/mn' : '';

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-water-deep text-3xl md:text-4xl lg:text-5xl font-serif uppercase tracking-wider leading-tight mb-8"
        >
          {isMn ? (
            <>
              ТАЙВАН БАЙДЛЫН МӨН ЧАНАР. ТАЙГЫН{" "}
              <span className="italic normal-case">Зүрх</span>.
            </>
          ) : (
            <>
              THE ESSENCE OF TRANQUILITY. THE{" "}
              <span className="italic normal-case">Heart</span> OF THE TAIGA.
            </>
          )}
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            href={`${localePrefix}/about-us`}
            className="text-water-deep font-serif uppercase text-sm inline-block border-b border-ink pb-1 hover:opacity-75 transition-opacity tracking-wide"
          >
            {isMn ? "Дэлгэрэнгүй" : "Discover More"}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
