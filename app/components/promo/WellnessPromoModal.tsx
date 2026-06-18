"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import SiteImage from "@/app/components/SiteImage";
import { BodyText, CTAButton, Eyebrow, Headline } from "@/app/components/ui/Typography";
import { useHeroPastForNav } from "@/hooks/useHeroPastForNav";
import { CABIN_CATALOG } from "@/lib/cabinCatalog";
import { withLocalePath } from "@/lib/localePath";
import {
  araboto,
  cormorantGaramondItalic,
  montserrat,
  playfairDisplayItalic,
} from "@/app/fonts";

const STORAGE_KEY = "dalaieej-wellness-promo-dismissed-at";
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;
const SHOW_DELAY_MS = 1300;
const ROOM_JOURNEY_PATHS = CABIN_CATALOG.flatMap((entry) => [
  entry.href,
  `/${entry.slug}`,
  ...entry.legacyRouteSlugs.map((slug) => `/${slug}`),
]);
const JOURNEY_PATHS = [
  "/cabins",
  ...ROOM_JOURNEY_PATHS,
  "/booking",
  "/checkout",
  "/payment",
  "/gallery",
];

function isDismissedRecently(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const dismissedAt = Date.parse(raw);
    if (Number.isNaN(dismissedAt)) return false;
    return Date.now() - dismissedAt < DISMISS_MS;
  } catch {
    return false;
  }
}

function persistDismiss() {
  try {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  } catch {
    /* ignore quota / private mode */
  }
}

function pathWithoutLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "en" || segments[0] === "mn") {
    const stripped = `/${segments.slice(1).join("/")}`;
    return stripped === "/" ? "/" : stripped.replace(/\/$/, "");
  }
  return pathname.replace(/\/$/, "") || "/";
}

function shouldSuppressPromo(pathname: string): boolean {
  const normalized = pathWithoutLocale(pathname);
  return JOURNEY_PATHS.some(
    (path) => normalized === path || normalized.startsWith(`${path}/`),
  );
}

/** Portals to `document.body` sit outside `[locale]/layout` — re-apply font variables so editorial titles load. */
const portalFontVariables = [
  araboto.variable,
  montserrat.variable,
  cormorantGaramondItalic.variable,
  playfairDisplayItalic.variable,
].join(" ");

export default function WellnessPromoModal() {
  const t = useTranslations("promo.wellness");
  const locale = useLocale();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [portalMounted, setPortalMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const bookingHref = withLocalePath(locale, "/booking");
  const isHome = pathWithoutLocale(pathname) === "/";
  const suppressPromo = shouldSuppressPromo(pathname);
  const heroPast = useHeroPastForNav(isHome, pathname);
  const canShowPromo = portalMounted && !suppressPromo && (!isHome || heroPast);

  const dismiss = useCallback(() => {
    persistDismiss();
    setOpen(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setPortalMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!canShowPromo || isDismissedRecently()) return;

    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [canShowPromo]);

  useEffect(() => {
    if (canShowPromo) return;
    const timer = window.setTimeout(() => setOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [canShowPromo]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [open, dismiss]);

  const handleCtaClick = () => {
    dismiss();
  };

  if (!portalMounted || suppressPromo) return null;

  const editorialHeadlineClass =
    locale === "mn" ? "font-editorial-mn" : "font-editorial-en";

  return createPortal(
    <div className={portalFontVariables}>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="wellness-promo-backdrop"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm sm:p-6"
            onClick={dismiss}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t("headline")}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex max-h-[min(90dvh,100vh)] w-full max-w-4xl flex-col overflow-hidden rounded-none bg-main shadow-xl md:max-h-[min(85dvh,720px)] md:max-w-[56rem] md:grid md:grid-cols-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full shrink-0 md:aspect-auto md:min-h-0 md:h-full">
                <SiteImage
                  src="/images/wellness/sauna-exterior.jpg"
                  alt={t("imageAlt")}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 28rem"
                  className="object-cover object-center"
                />
              </div>

              <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto bg-main p-8 md:p-10 lg:p-12">
                <button
                  ref={closeRef}
                  type="button"
                  onClick={dismiss}
                  aria-label={t("closeLabel")}
                  className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center border border-ink/15 bg-main text-ink/60 transition-colors hover:border-ink/25 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf md:top-6 md:right-6"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </button>

                <div className="flex flex-1 flex-col justify-center pr-10 md:pr-12">
                  <div className="flex max-w-md flex-col gap-6 md:gap-7 md:py-4">
                    <Eyebrow className="!text-water-deep/70">{t("eyebrow")}</Eyebrow>
                    <Headline
                      as="h2"
                      variant="editorial"
                      size="sub"
                      align="left"
                      className={`!text-left ${editorialHeadlineClass}`}
                    >
                      {t("headline")}
                    </Headline>
                    <BodyText size="md" className="!text-left text-ink/75">
                      {t("body")}
                    </BodyText>
                    <CTAButton
                      href={bookingHref}
                      variant="secondary"
                      size="md"
                      onClick={handleCtaClick}
                      className="mt-1 w-fit"
                    >
                      {t("cta")}
                    </CTAButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>,
    document.body
  );
}
