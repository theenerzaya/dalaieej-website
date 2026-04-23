"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const MIN_VISIBLE_MS = 650;
const FADE_MS = 600;

export default function Preloader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    setMounted(true);
    setVisible(true);

    const mountedAt = performance.now();

    const hide = () => {
      const elapsed = performance.now() - mountedAt;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => setVisible(false), wait);
    };

    if (document.readyState === "complete") {
      hide();
    } else {
      window.addEventListener("load", hide, { once: true });
      const safety = window.setTimeout(hide, 3500);
      return () => {
        window.removeEventListener("load", hide);
        window.clearTimeout(safety);
      };
    }

    return undefined;
  }, [pathname]);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (!visible) {
      const t = window.setTimeout(() => setMounted(false), FADE_MS);
      return () => window.clearTimeout(t);
    }
  }, [visible]);

  useEffect(() => {
    if (mounted) {
      const previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = previousOverflow;
      };
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      role="presentation"
      className="fixed inset-0 z-[999] flex items-center justify-center bg-ink transition-opacity ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transitionDuration: `${FADE_MS}ms`,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="flex flex-col items-center justify-center">
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
    </div>
  );
}
