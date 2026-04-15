"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star, ShieldCheck } from "lucide-react";

const REVIEW_IDS = ["review1", "review2", "review3"] as const;
const AUTO_ADVANCE_MS = 5000;
const RATING = 4.9;
const FULL_STARS = 4;

const BG_IMAGE = "/images/silogrid/hearth.webp";

export default function Testimonials() {
  const t = useTranslations("amenities.testimonials");
  const prefersReducedMotion = useReducedMotion();

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

  const attributionLine = (() => {
    const author = t(`${reviewId}.author`);
    if (t.has(`${reviewId}.source`)) {
      return `— ${t(`${reviewId}.source`)} | ${author}`;
    }
    return `— ${author}`;
  })();

  const slideTransition = prefersReducedMotion
    ? { duration: 0.2, ease: "easeOut" as const }
    : { duration: 0.55, ease: "easeInOut" as const };

  return (
    <section className="relative min-h-[85vh] flex flex-col overflow-hidden">
      <Image
        src={BG_IMAGE}
        alt=""
        fill
        className="object-cover pointer-events-none select-none"
        sizes="100vw"
        priority={false}
      />
      <div className="absolute inset-0 bg-black/25 pointer-events-none" aria-hidden />

      <div className="relative z-10 flex flex-col flex-1 min-h-[85vh] px-4 sm:px-6 py-10 md:py-14">
        {/* Section eyebrow — narrative bridge */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-body text-main/60 text-xs tracking-[0.3em] uppercase mb-6 text-overlay-glow"
        >
          {t("sectionEyebrow")}
        </motion.p>

        {/* Aggregate rating — on photo, outside card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="flex flex-col items-center gap-3 shrink-0"
        >
          <div className="flex items-center gap-4 rounded-2xl bg-ink/35 px-5 py-3 backdrop-blur-sm shadow-lg border border-main/10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-main/80 bg-leaf/95 shadow-md">
              <span className="font-heading text-lg font-medium text-main">{RATING}</span>
            </div>
            <div>
              <p className="font-heading text-xl text-main text-overlay-glow">
                {t("ratingLabel")}
              </p>
              <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                {[...Array(5)].map((_, i) =>
                  i < FULL_STARS ? (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-sun text-sun drop-shadow-sm"
                    />
                  ) : (
                    <span key={i} className="relative w-3.5 h-3.5">
                      <Star className="absolute inset-0 w-3.5 h-3.5 fill-sun/25 text-sun/25" />
                      <span className="absolute inset-0 overflow-hidden" style={{ width: "90%" }}>
                        <Star className="w-3.5 h-3.5 fill-sun text-sun" />
                      </span>
                    </span>
                  )
                )}
                <span className="ml-2 font-body text-xs text-main/75 text-overlay-glow">
                  {t("reviewCount")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Centered shade card */}
        <div className="flex-1 flex items-center justify-center py-10 md:py-12 min-h-0">
          <div className="w-full max-w-[min(90vw,56rem)] md:w-[min(62vw,56rem)] px-8 sm:px-12 md:px-16 py-12 md:py-14 shadow-2xl bg-ink-muted text-main border border-main/10">
            <p className="text-center font-body text-[11px] sm:text-xs tracking-[0.3em] uppercase mb-8 md:mb-10 text-main/80">
              {t("cardEyebrow")}
            </p>

            <div className="relative min-h-[200px] sm:min-h-[220px] md:min-h-[240px] overflow-hidden">
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={reviewId}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-1"
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0, x: 0 }
                      : { opacity: 1, x: "100%" }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0, x: 0 }
                      : { opacity: 1, x: "-100%" }
                  }
                  transition={slideTransition}
                >
                  <p className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-[1.75rem] leading-relaxed mb-6 md:mb-8 font-medium">
                    &ldquo;{t(`${reviewId}.text`)}&rdquo;
                  </p>
                  <p className="font-body text-[10px] sm:text-xs tracking-[0.2em] uppercase text-main/85">
                    {attributionLine}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-3 mt-10 md:mt-12">
              {REVIEW_IDS.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDotClick(index)}
                  className={`w-2.5 h-2.5 rounded-full border-2 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-muted focus-visible:ring-main ${
                    index === activeIndex
                      ? "bg-main border-main"
                      : "bg-transparent border-main/55 hover:border-main"
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Heritage line — on photo, outside card */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex items-center justify-center gap-3 shrink-0 pb-2 md:pb-4 max-w-2xl mx-auto text-center"
        >
          <ShieldCheck className="w-4.5 h-4.5 flex-shrink-0 text-main/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)]" />
          <p className="font-body text-sm tracking-wide text-main/85 text-overlay-glow">
            {t("heritage")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
