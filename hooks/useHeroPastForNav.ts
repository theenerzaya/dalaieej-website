"use client";

import { useState, useEffect } from "react";

/** ~5.5rem at 16px root; matches fixed navbar band (must be `px` — `rem` in rootMargin throws in some browsers). */
const NAV_TOP_INSET_PX = 88;

/**
 * When `enabled` (home with full-viewport hero), false until the hero title
 * sentinel (`#hero-nav-sentinel`) has scrolled past the top nav band. Falls
 * back to `#site-hero` if the sentinel is missing. When disabled, always true.
 */
export function useHeroPastForNav(enabled: boolean): boolean {
  const [past, setPast] = useState(() => !enabled);

  useEffect(() => {
    if (!enabled) return;

    const el =
      document.getElementById("hero-nav-sentinel") ??
      document.getElementById("site-hero");
    if (!el) return;

    const callback: IntersectionObserverCallback = ([entry]) => {
      if (!entry) return;
      setPast(!entry.isIntersecting);
    };

    let observer: IntersectionObserver;
    try {
      observer = new IntersectionObserver(callback, {
        threshold: 0,
        rootMargin: `-${NAV_TOP_INSET_PX}px 0px 0px 0px`,
      });
    } catch {
      observer = new IntersectionObserver(callback, { threshold: 0 });
    }

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return past;
}
