"use client";

import { useState, useEffect } from "react";

export const NAV_SCROLL_REVEAL_THRESHOLD_PX = 50;

export function useScrolledPast(
  thresholdPx: number = NAV_SCROLL_REVEAL_THRESHOLD_PX
): boolean {
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const update = () => {
      setScrolledPast(window.scrollY > thresholdPx);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [thresholdPx]);

  return scrolledPast;
}
