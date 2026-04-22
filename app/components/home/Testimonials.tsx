"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { BodyText, Eyebrow } from "../ui/Typography";

const REVIEW_IDS = ["review1", "review2", "review3"] as const;
const AUTO_ADVANCE_MS = 5000;
const RATING = 4.9;
const FULL_STARS = 4;

export default function Testimonials() {
  const locale = useLocale();
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
  const author = t(`${reviewId}.author`);

  const slideTransition = prefersReducedMotion
    ? { duration: 0.2, ease: "easeOut" as const }
    : { duration: 0.55, ease: "easeInOut" as const };

  return (
    <section className="relative bg-surface overflow-hidden">
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24 flex flex-col items-center">
        {/* Section eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-10"
        >
          <Eyebrow className="!text-water-deep/70">
            {t("sectionEyebrow")}
          </Eyebrow>
        </motion.div>

        {/* Rating cluster — dark circle + label + stars + review count */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:flex-nowrap sm:justify-start"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1F2A23] shadow-sm">
            <span className="font-cta text-base font-medium text-main">
              {RATING}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-editorial-en italic text-xl md:text-2xl text-ink leading-tight">
              {t("ratingLabel")}
            </span>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) =>
                i < FULL_STARS ? (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-[#E0A82E] text-[#E0A82E]"
                  />
                ) : (
                  <span key={i} className="relative w-3.5 h-3.5">
                    <Star className="absolute inset-0 w-3.5 h-3.5 fill-[#E0A82E]/25 text-[#E0A82E]/25" />
                    <span
                      aria-hidden
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: "90%" }}
                    >
                      <Star className="w-3.5 h-3.5 fill-[#E0A82E] text-[#E0A82E]" />
                    </span>
                  </span>
                )
              )}
              <span className="ml-2 font-body text-xs text-ink/55">
                {t("reviewCount")}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            delay: prefersReducedMotion ? 0 : 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative w-full mt-12 md:mt-16"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={reviewId}
              className="flex w-full flex-col items-center justify-start px-2 text-center"
              initial={
                prefersReducedMotion
                  ? { opacity: 0, x: 0 }
                  : { opacity: 0, x: "8%" }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0, x: 0 }
                  : { opacity: 0, x: "-8%" }
              }
              transition={slideTransition}
            >
              <blockquote
                className={[
                  "mx-auto max-w-3xl break-words text-pretty",
                  "font-editorial-en italic text-water-deep",
                  "text-2xl sm:text-3xl md:text-[2rem] lg:text-[2.25rem]",
                  "leading-snug md:leading-[1.35]",
                ].join(" ")}
              >
                &ldquo;{t(`${reviewId}.text`)}&rdquo;
              </blockquote>

              <div className="mt-8 md:mt-10 flex flex-col items-center gap-1">
                <p
                  className={[
                    "font-body text-ink",
                    locale === "mn" ? "text-sm font-light" : "text-sm font-medium",
                  ].join(" ")}
                >
                  {author}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Pagination — pill for active, dots for inactive */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            delay: prefersReducedMotion ? 0 : 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex items-center justify-center gap-2 mt-10 md:mt-12"
        >
          {REVIEW_IDS.map((_, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleDotClick(index)}
                className={[
                  "h-2 rounded-full transition-all duration-300",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:ring-water-deep",
                  isActive
                    ? "w-6 bg-water-deep"
                    : "w-2 bg-water-deep/15 hover:bg-water-deep/30",
                ].join(" ")}
                aria-label={`Go to review ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
              />
            );
          })}
        </motion.div>

        {/* Visually hidden heritage line — kept for SEO/screen readers */}
        <BodyText size="sm" align="center" className="sr-only">
          {t("heritage")}
        </BodyText>
      </div>
    </section>
  );
}
