"use client";

import { useState, useEffect } from "react";

/** ~5.5rem at 16px root; matches fixed navbar band (must be `px` — `rem` in rootMargin throws in some browsers). */
const NAV_TOP_INSET_PX = 88;
const HERO_SENTINEL_RETRY_MS = 50;
const HERO_SENTINEL_RETRY_MAX = 40;

function findHeroSentinel(): HTMLElement | null {
  return (
    document.getElementById("hero-nav-sentinel") ??
    document.getElementById("site-hero")
  );
}

/**
 * When `enabled` (home / wellness with hero), false until the hero sentinel
 * (`#hero-nav-sentinel`) has scrolled past the top nav band. Falls back to
 * `#site-hero` if the sentinel is missing. When disabled, always true.
 */
export function useHeroPastForNav(enabled: boolean, pathname: string): boolean {
  const [past, setPast] = useState(() => !enabled);

  useEffect(() => {
    if (!enabled) {
      setPast(true);
      return;
    }

    setPast(false);

    let observer: IntersectionObserver | null = null;
    let retryTimer: ReturnType<typeof setInterval> | null = null;
    let attempts = 0;

    const callback: IntersectionObserverCallback = ([entry]) => {
      if (!entry) return;
      setPast(!entry.isIntersecting);
    };

    const observe = (el: HTMLElement) => {
      observer?.disconnect();
      try {
        observer = new IntersectionObserver(callback, {
          threshold: 0,
          rootMargin: `-${NAV_TOP_INSET_PX}px 0px 0px 0px`,
        });
      } catch {
        observer = new IntersectionObserver(callback, { threshold: 0 });
      }
      observer.observe(el);
    };

    const tryAttach = () => {
      const el = findHeroSentinel();
      if (!el) return false;

      if (retryTimer) {
        clearInterval(retryTimer);
        retryTimer = null;
      }
      observe(el);
      return true;
    };

    if (!tryAttach()) {
      retryTimer = setInterval(() => {
        attempts += 1;
        if (tryAttach() || attempts >= HERO_SENTINEL_RETRY_MAX) {
          if (retryTimer) {
            clearInterval(retryTimer);
            retryTimer = null;
          }
        }
      }, HERO_SENTINEL_RETRY_MS);
    }

    return () => {
      if (retryTimer) clearInterval(retryTimer);
      observer?.disconnect();
    };
  }, [enabled, pathname]);

  return past;
}
