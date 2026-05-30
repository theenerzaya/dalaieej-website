"use client";

import { useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

export function AboutUsAlmanacFloatingBanner({
  triggerRef,
  endRef,
  message,
  ctaLabel,
  href,
  dismissLabel,
}: {
  triggerRef: RefObject<HTMLElement | null>;
  /** Sentinel at page bottom — banner hides once this enters the viewport (footer zone). */
  endRef: RefObject<HTMLElement | null>;
  message: string;
  ctaLabel: string;
  href: string;
  dismissLabel: string;
}) {
  const reduceMotion = useReducedMotion();
  const [portalMounted] = useState(() => typeof window !== "undefined");
  const [pastPillar, setPastPillar] = useState(false);
  const [reachedFooter, setReachedFooter] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setPastPillar(true);
        } else if (entry.isIntersecting) {
          setPastPillar(false);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerRef]);

  useEffect(() => {
    const el = endRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setReachedFooter(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [endRef]);

  const visible = pastPillar && !reachedFooter && !dismissed;

  if (!portalMounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible ? (
        <motion.aside
          role="region"
          aria-label={message}
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[160] flex justify-center px-4 pb-5 pt-2 md:px-6 md:pb-6"
        >
          <div className="pointer-events-auto flex w-full max-w-3xl items-center gap-3 rounded-full border border-white/10 bg-[#2f3129]/95 py-3 pl-5 pr-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm md:gap-4 md:py-3.5 md:pl-7 md:pr-4">
            <p className="min-w-0 flex-1 font-body text-sm leading-snug text-white/88 md:text-[0.9375rem]">
              {message}{" "}
              <Link
                href={href}
                className="font-cta text-[10px] font-medium uppercase tracking-[0.2em] text-white/95 underline decoration-white/35 underline-offset-[5px] transition-colors hover:text-white hover:decoration-white/70 md:text-[11px] md:tracking-[0.22em]"
              >
                {ctaLabel}
                <span aria-hidden> →</span>
              </Link>
            </p>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/10 hover:text-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
              aria-label={dismissLabel}
            >
              <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
