"use client";

import { useState, useEffect } from "react";

/**
 * When `enabled` (home with full-viewport hero), false until `#site-hero` has
 * fully left the viewport. When disabled, always true so the bar uses full chrome.
 */
export function useHeroPastForNav(enabled: boolean): boolean {
  const [past, setPast] = useState(() => !enabled);

  useEffect(() => {
    if (!enabled) {
      setPast(true);
      return;
    }

    setPast(false);

    const el = document.getElementById("site-hero");
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setPast(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return past;
}
