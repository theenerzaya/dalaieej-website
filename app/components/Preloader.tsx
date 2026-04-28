"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const MIN_VISIBLE_MS = 650;
const FADE_MS = 600;

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const mountedAt = performance.now();

    const hide = () => {
      const elapsed = performance.now() - mountedAt;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => setVisible(false), wait);
    };

    if (document.readyState !== "loading") {
      hide();
      return;
    }

    document.addEventListener("DOMContentLoaded", hide, { once: true });
    const safety = window.setTimeout(hide, 1200);
    return () => {
      document.removeEventListener("DOMContentLoaded", hide);
      window.clearTimeout(safety);
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      const t = window.setTimeout(() => setMounted(false), FADE_MS);
      return () => window.clearTimeout(t);
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      role="presentation"
      className="fixed inset-0 z-[999] flex items-center justify-center bg-ink"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease-out`,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <Image
        src="/branding/logos/logo-white.png"
        alt=""
        width={240}
        height={120}
        priority
        sizes="(max-width: 640px) 160px, 240px"
        className="h-auto w-[160px] sm:w-[200px] md:w-[240px] opacity-90"
      />
    </div>
  );
}
