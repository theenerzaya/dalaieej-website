"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Star, ShieldCheck } from "lucide-react";
import FadeInWhenVisible from "./FadeInWhenVisible";
import { BodyText, Eyebrow, Headline } from "../ui/Typography";

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
    <section className="relative min-h-[85vh] flex flex-col overflow-hidden bg-surface">
      <div className="relative z-10 flex flex-col flex-1 min-h-[85vh] px-4 sm:px-6 py-10 md:py-14">
        {/* Section eyebrow — narrative bridge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Eyebrow>{t("sectionEyebrow")}</Eyebrow>
        </motion.div>

        {/* Aggregate rating — outside card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="flex flex-col items-center gap-3 shrink-0"
        >
          <div className="flex items-center gap-4 rounded-2xl bg-main px-5 py-3 shadow-sm border border-bark/15">
            <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-bark/80 bg-leaf/95 shadow-md">
              <span className="font-cta text-lg font-medium text-main">
                {RATING}
              </span>
            </div>
            <div>
              <Headline as="h3" size="sub" align="left" className="!text-xl md:!text-2xl leading-tight">
                {t("ratingLabel")}
              </Headline>
              <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                {[...Array(5)].map((_, i) =>
                  i < FULL_STARS ? (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-sun text-sun"
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
                <span className="ml-2 font-cta text-xs font-medium text-ink/65">
                  {t("reviewCount")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Centered paper card — cream with bark text + deckle-edge inner border */}
        <div className="flex-1 flex items-center justify-center py-10 md:py-12 min-h-0">
          <FadeInWhenVisible
            className="relative w-full max-w-[min(90vw,56rem)] md:w-[min(62vw,56rem)] px-8 sm:px-12 md:px-16 py-12 md:py-14 bg-[#F4EBD9] text-bark shadow-[0_18px_40px_-18px_rgba(149,121,78,0.35),0_2px_6px_rgba(0,0,0,0.06)]"
            y={26}
            duration={0.65}
            amount={0.12}
          >
            {/* Deckle-edge inner border — letterpress platemark */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-3 sm:inset-4 border border-bark/35"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-[0.375rem] sm:inset-[0.625rem] border border-bark/15"
            />

            <div className="relative">
              <div className="text-center mb-8 md:mb-10">
                <Eyebrow className="!text-bark/65">
                  {t("cardEyebrow")}
                </Eyebrow>
              </div>

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
                    <Headline
                      as="h3"
                      size="sub"
                      className="!text-xl sm:!text-2xl md:!text-3xl lg:!text-[1.75rem] !text-bark leading-relaxed mb-6 md:mb-8"
                    >
                      &ldquo;{t(`${reviewId}.text`)}&rdquo;
                    </Headline>
                    <p
                      className={[
                        "font-cta uppercase text-bark/75",
                        locale === "mn"
                          ? "text-[10px] sm:text-xs font-light tracking-[0.18em]"
                          : "text-[10px] sm:text-xs font-medium tracking-[0.2em]",
                      ].join(" ")}
                    >
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
                    className={`w-2.5 h-2.5 rounded-full border-2 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBD9] focus-visible:ring-bark ${
                      index === activeIndex
                        ? "bg-bark border-bark"
                        : "bg-transparent border-bark/40 hover:border-bark"
                    }`}
                    aria-label={`Go to review ${index + 1}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                  />
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>

        {/* Heritage line — outside card */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex items-center justify-center gap-3 shrink-0 pb-2 md:pb-4 max-w-2xl mx-auto text-center"
        >
          <ShieldCheck className="w-4.5 h-4.5 flex-shrink-0 text-bark" />
          <BodyText size="sm" align="center" className="!text-ink/70">
            {t("heritage")}
          </BodyText>
        </motion.div>
      </div>
    </section>
  );
}
