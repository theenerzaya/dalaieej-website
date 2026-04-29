/* eslint-disable @next/next/no-img-element */
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
 *   • Infinite loop: the strip always continues in the direction of travel
 *     (never snaps back to slide 0). When the virtual index walks past the
 *     real slide range, we silently rebase it AFTER the animation finishes —
 *     the on-screen images are identical before/after the rebase, so the
 *     rebase is invisible.
 */

import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
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

// How many copies of the slide list to render. Needs to be odd so we can
// centre on the middle copy; >=5 gives us 2 copies of headroom in each
// direction, which is more than enough for a rebase cycle.
const STRIP_COPIES = 5;
const CENTRE_COPY = Math.floor(STRIP_COPIES / 2); // 2 for 5 copies

export default function RestaurantCarousel({
  slides,
  autoPlayMs = 6500,
  className = "",
}: RestaurantCarouselProps) {
  // `index` is a virtual, unbounded integer. The displayed image at any time
  // is `slides[((index % n) + n) % n]`.
  const [index, setIndex] = useState(0);
  const [animEnabled, setAnimEnabled] = useState(true);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const n = slides.length;

  const go = useCallback((delta: number) => {
    setAnimEnabled(true);
    setIndex((i) => i + delta);
  }, []);

  useEffect(() => {
    if (reduce || paused || n <= 1) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setAnimEnabled(true);
      setIndex((i) => i + 1);
    }, autoPlayMs);
    return () => window.clearInterval(id);
  }, [paused, reduce, autoPlayMs, n]);

  // After a silent rebase (animEnabled=false), re-enable animation on the
  // very next frame so the subsequent transition is smooth again.
  useEffect(() => {
    if (animEnabled) return;
    const raf = window.requestAnimationFrame(() => setAnimEnabled(true));
    return () => window.cancelAnimationFrame(raf);
  }, [animEnabled]);

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

  const repeatedSlides = useMemo(() => {
    if (n <= 1) return slides;
    return Array.from({ length: STRIP_COPIES }, () => slides).flat();
  }, [slides, n]);

  if (n === 0) return null;

  // Each slide occupies SLIDE_W of the strip; the strip is shifted so that the
  // active slide centres in the viewport.
  // SLIDE_W=55 → ~22.5% peek on each side (left + right).
  const SLIDE_W = 55;

  // Position of the active slide in the repeated strip. We centre on the
  // middle copy so the virtual index can walk one full set in either
  // direction before it needs to be rebased.
  const visibleIndex = n > 1 ? CENTRE_COPY * n + index : 0;
  const stripOffsetPct = 50 - (visibleIndex + 0.5) * SLIDE_W;

  // After an animation finishes, if we've drifted out of the canonical
  // [0, n) window, silently rebase `index` by one full set. The strip's
  // on-screen images don't change (we just shift the reference copy),
  // so the rebase is invisible to the user.
  const handleAnimationComplete = () => {
    if (n <= 1) return;
    if (index >= n) {
      setAnimEnabled(false);
      setIndex((i) => i - n);
    } else if (index < 0) {
      setAnimEnabled(false);
      setIndex((i) => i + n);
    }
  };

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
          reduce || !animEnabled
            ? { duration: 0 }
            : { duration: 1.05, ease: EASE_OUT_EXPO }
        }
        onAnimationComplete={handleAnimationComplete}
        style={{ willChange: "transform" }}
      >
        {repeatedSlides.map((s, i) => {
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
      {n > 1 ? (
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
