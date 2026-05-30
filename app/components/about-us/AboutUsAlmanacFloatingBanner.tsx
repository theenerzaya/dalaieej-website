"use client";

import { useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { CTALink } from "@/app/components/ui/Typography";

export function AboutUsAlmanacFloatingBanner({
  triggerRef,
  endRef,
  message,
  ctaLabel,
  href,
  dismissLabel,
}: {
  /** Top of the pillars section — banner appears once this band enters view after the timeline. */
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
  const [pastHistory, setPastHistory] = useState(false);
  const [reachedFooter, setReachedFooter] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const update = () => {
      const top = el.getBoundingClientRect().top;
      const vh = window.innerHeight;
      setPastHistory((prev) => {
        if (top > vh) return false;
        if (top <= vh * 0.88) return true;
        return prev;
      });
    };

    update();
    const observer = new IntersectionObserver(update, {
      threshold: [0, 0.01, 0.1, 0.5, 1],
    });
    observer.observe(el);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
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

  const visible = pastHistory && !reachedFooter && !dismissed;

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
          <div className="pointer-events-auto relative w-full max-w-3xl rounded-full border border-white/10 bg-[#2f3129]/95 px-10 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm md:px-12 md:py-4">
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/10 hover:text-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 md:right-3"
              aria-label={dismissLabel}
            >
              <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </button>
            <div className="flex flex-col items-center gap-2 text-center sm:gap-2.5">
              <p className="font-body text-sm leading-snug text-white/85 md:text-[0.9375rem]">
                {message}
              </p>
              <CTALink
                href={href}
                tone="dark"
                className="!text-white [&>span]:!border-white/50 hover:[&>span]:!border-white"
              >
                {ctaLabel}
              </CTALink>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
