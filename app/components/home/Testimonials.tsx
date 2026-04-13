"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star, ShieldCheck } from "lucide-react";

const REVIEW_IDS = ["review1", "review2", "review3"] as const;
const AUTO_ADVANCE_MS = 8000;
const RATING = 4.9;
const FULL_STARS = 4;

export default function Testimonials() {
  const t = useTranslations("amenities.testimonials");

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % REVIEW_IDS.length);
    }, AUTO_ADVANCE_MS);
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    startAutoPlay();
  };

  const reviewId = REVIEW_IDS[activeIndex];

  return (
    <section className="py-20 md:py-28 bg-surface relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center font-body text-water-deep/60 text-xs tracking-[0.3em] uppercase mb-10"
        >
          {t("subtitle")}
        </motion.p>

        {/* Aggregate Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center gap-3 mb-14"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-leaf to-ink flex items-center justify-center">
              <span className="font-serif text-main text-lg font-bold">{RATING}</span>
            </div>
            <div>
              <p className="font-serif text-xl text-ink">{t("ratingLabel")}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  i < FULL_STARS ? (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ) : (
                    <span key={i} className="relative w-3.5 h-3.5">
                      <Star className="absolute inset-0 w-3.5 h-3.5 fill-amber-400/20 text-amber-400/20" />
                      <span className="absolute inset-0 overflow-hidden" style={{ width: "90%" }}>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </span>
                    </span>
                  )
                ))}
                <span className="ml-2 font-body text-xs text-ink/50">{t("reviewCount")}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rotating Quote */}
        <div className="min-h-[180px] md:min-h-[160px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={reviewId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="font-serif text-xl md:text-2xl lg:text-3xl text-water-deep leading-relaxed mb-6">
                &ldquo;{t(`${reviewId}.text`)}&rdquo;
              </p>
              <footer className="flex flex-col items-center gap-1">
                <cite className="font-body text-sm text-ink/70 not-italic font-medium tracking-wide">
                  {t(`${reviewId}.author`)}
                </cite>
                {t.has(`${reviewId}.source`) && (
                  <span className="font-body text-xs text-ink/40">
                    {t(`${reviewId}.source`)}
                  </span>
                )}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Dot Navigation */}
        <div className="flex justify-center gap-2.5 mt-10">
          {REVIEW_IDS.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "bg-water-deep w-6"
                  : "bg-water-deep/20 w-2 hover:bg-water-deep/40"
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>

        {/* Heritage Line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-14 pt-8 border-t border-ink/[0.06] flex items-center justify-center gap-3"
        >
          <ShieldCheck className="w-4.5 h-4.5 text-ink/30 flex-shrink-0" />
          <p className="font-body text-ink/40 text-sm tracking-wide">
            {t("heritage")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
