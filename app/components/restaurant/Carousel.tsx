"use client";

/**
 * Restaurant peek carousel — port of the Hoteller Food & Beverage slider
 * (https://hotellerv5.themegoods.com/resort/restaurant/).
 *
 * Layout: a 3-image strip where the centre slide is fully visible (~55% of the
 * viewport width on desktop) and the previous + next slides peek in on either
 * edge, dimmed and slightly inset. Clicking an arrow advances the strip; the
 * whole strip translates with a soft eased motion so the new slide eases into
 * the centre.
 *
 * Behaviour:
 *   • Auto-advances every `autoPlayMs` (default 6.5s); pauses on pointer
 *     hover, focus, and when the tab is hidden.
 *   • Prev / next arrows are always visible (matches Hoteller).
 *   • Keyboard ←/→ when the slider is focused.
 *   • prefers-reduced-motion → strip jumps instantly between slides.
 */

import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

type Slide = {
  src: string;
  alt: string;
};

export type RestaurantCarouselProps = {
  slides: Slide[];
  autoPlayMs?: number;
  className?: string;
};

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export default function RestaurantCarousel({
  slides,
  autoPlayMs = 6500,
  className = "",
}: RestaurantCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (reduce || paused || slides.length <= 1) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % slides.length);
    }, autoPlayMs);
    return () => window.clearInterval(id);
  }, [paused, reduce, autoPlayMs, slides.length]);

  const onKey = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    },
    [go],
  );

  if (slides.length === 0) return null;

  // Each slide occupies SLIDE_W of the strip; the strip is shifted so that the
  // active slide centres in the viewport.
  // SLIDE_W=55 → ~22.5% peek on each side (left + right).
  const SLIDE_W = 55; // percent of viewport per slide

  // To get a peek on BOTH edges (including at index 0 and the last index) we
  // render the slide list three times in a row and centre on the middle copy.
  // The visible active slide is always at position `slides.length + index`
  // inside the tripled strip, so a peek of the previous + next slides is
  // guaranteed at every step. When the index wraps, the apparent translation
  // jumps by exactly one set, which we hide by detecting wrap and snapping the
  // strip without animation on that frame.
  const tripled = slides.length > 1 ? [...slides, ...slides, ...slides] : slides;
  const visibleIndex = slides.length > 1 ? slides.length + index : index;
  const stripOffsetPct = 50 - (visibleIndex + 0.5) * SLIDE_W;

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Restaurant gallery"
      tabIndex={0}
      onKeyDown={onKey}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`group relative w-full overflow-hidden bg-ink outline-none ${className}`}
    >
      {/* Strip ----------------------------------------------------------- */}
      <motion.div
        className="flex h-[58vh] min-h-[380px] md:h-[68vh] md:min-h-[460px] items-stretch"
        animate={{ x: `${stripOffsetPct}%` }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 1.05, ease: EASE_OUT_EXPO }
        }
        style={{ willChange: "transform" }}
      >
        {tripled.map((s, i) => {
          const isActive = i === visibleIndex;
          return (
            <motion.div
              key={`${s.src}-${i}`}
              className="relative shrink-0 px-1.5 md:px-2"
              style={{ width: `${SLIDE_W}%` }}
              animate={{
                opacity: isActive ? 1 : 0.45,
                scale: isActive ? 1 : 0.94,
              }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.9, ease: EASE_OUT_EXPO }
              }
            >
              <div className="relative h-full w-full overflow-hidden bg-white/5">
                <img
                  src={s.src}
                  alt={s.alt}
                  className="h-full w-full object-cover select-none"
                  draggable={false}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Arrows ---------------------------------------------------------- */}
      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-ink/55 hover:bg-ink/80 text-main transition-colors backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.4} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-ink/55 hover:bg-ink/80 text-main transition-colors backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.4} />
          </button>
        </>
      ) : null}
    </div>
  );
}
