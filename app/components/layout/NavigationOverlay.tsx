"use client";

import { useEffect, useRef } from "react";
import { Facebook, Instagram, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CTAButton } from "../ui/Typography";

/**
 * NavigationOverlay — Hoteller-styled fullscreen menu.
 *
 * Layout (matches the Hoteller "Our Rooms" overlay reference):
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │  ✕  EN | MN                LOGO              BOOK YOUR STAY  │
 *   │ ──────────────────────────────────────────────────────────── │
 *   │                                                              │
 *   │  Our Rooms            ┌──────┐ ┌──────┐ ┌──────┐ ┌────      │
 *   │  Dining               │ IMG  │ │ IMG  │ │ IMG  │ │ IMG      │
 *   │  Wellness             │      │ │      │ │      │ │          │
 *   │  Adventures           └──────┘ └──────┘ └──────┘ └────      │
 *   │  Our Story            Title    Title    Title    Title      │
 *   │  Contact              meta     meta     meta     meta       │
 *   │                                                              │
 *   │  Call us: +976 …                                             │
 *   │  [f] [ig] [@]                                                │
 *   └──────────────────────────────────────────────────────────────┘
 *
 * Typography mirrors the rest of the site:
 *   - Nav links → editorial italic (Playfair EN / Cormorant MN)
 *   - Small caps → `font-cta` uppercase tracked
 */

type MainNavItem = {
  id: string;
  href: string;
  image: string;
  label: { en: string; mn: string };
  meta: { en: string; mn: string };
  available: boolean;
};

// NOTE: only `about` is live today; the rest show a "Coming Soon" tag and
// render as non-interactive links (to preserve the overlay's visual rhythm).
const mainNavItems: MainNavItem[] = [
  {
    id: "stay",
    href: "/accommodation",
    image: "/images/nav-overlay/stay.jpg",
    label: { en: "Our Rooms", mn: "Өргөө" },
    meta: { en: "Cabins & Suites · From $300/night", mn: "Модон өрөө · 1 шөнө $300-аас" },
    available: false,
  },
  {
    id: "dining",
    href: "/dining",
    image: "/images/nav-overlay/dining.jpg",
    label: { en: "Dining", mn: "Зоог" },
    meta: { en: "Lakeside kitchen", mn: "Нуурын эрэг дээрх гал тогоо" },
    available: false,
  },
  {
    id: "wellness",
    href: "/wellness",
    image: "/images/nav-overlay/wellness.jpg",
    label: { en: "Wellness", mn: "Амрахуй" },
    meta: { en: "Sauna · Lake soak · Rituals", mn: "Саун · Нуурын усанд орох" },
    available: false,
  },
  {
    id: "adventure",
    href: "/experiences",
    image: "/images/nav-overlay/adventure.jpg",
    label: { en: "Adventures", mn: "Адал явдал" },
    meta: { en: "Guided expeditions", mn: "Хөтөчтэй аялал" },
    available: false,
  },
  {
    id: "about",
    href: "/about-us",
    image: "/images/nav-overlay/our-story.jpg",
    label: { en: "Our Story", mn: "Бидний тухай" },
    meta: { en: "The family behind Dalai Eej", mn: "Дэлайн эжийн өгүүлэмж" },
    available: true,
  },
  {
    id: "contact",
    href: "/contact",
    image: "/images/address.jpeg",
    label: { en: "Contact", mn: "Холбоо барих" },
    meta: { en: "Plan your stay with us", mn: "Бидэнтэй төлөвлөөрэй" },
    available: true,
  },
];

const PHONE_DISPLAY = "+976 9500 5595";
const PHONE_HREF = "tel:+97695005595";

const socialLinks: Array<{
  href: string;
  label: string;
  external: boolean;
  icon: typeof Facebook;
}> = [
  { href: "https://www.facebook.com/dalaieej", label: "Facebook", external: true, icon: Facebook },
  { href: "https://www.instagram.com/dalaieejresort", label: "Instagram", external: true, icon: Instagram },
  { href: "mailto:hello@dalaieej.com", label: "Email", external: true, icon: Mail },
];

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavigationOverlay({ isOpen, onClose }: NavigationOverlayProps) {
  const pathname = usePathname();
  const isMn = pathname.startsWith("/mn");
  const localePrefix = isMn ? "/mn" : "";
  const reduceMotion = useReducedMotion();

  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const pathWithoutLocale = isMn
    ? pathname.replace("/mn", "") || "/"
    : pathname;
  const enPath = pathWithoutLocale;
  const mnPath = `/mn${pathWithoutLocale}`.replace("//", "/");

  const scrollCardIntoView = (id: string) => {
    const el = stripRef.current?.querySelector<HTMLElement>(`[data-card="${id}"]`);
    if (!el || !stripRef.current) return;
    stripRef.current.scrollTo({
      left: el.offsetLeft - 24,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const languageToggle = (
    <div className="font-cta text-sm md:text-[15px] font-semibold uppercase tracking-[0.28em] leading-none text-left">
      <Link
        href={enPath}
        onClick={onClose}
        aria-label="Switch to English"
        className={[
          "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-surface/50",
          !isMn ? "text-main" : "text-main/40 hover:text-main/70",
        ].join(" ")}
      >
        EN
      </Link>
      <span className="mx-2 text-main/30" aria-hidden="true">
        /
      </span>
      <Link
        href={mnPath}
        onClick={onClose}
        aria-label="Switch to Mongolian"
        className={[
          "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-surface/50",
          isMn ? "text-main" : "text-main/40 hover:text-main/70",
        ].join(" ")}
      >
        MN
      </Link>
    </div>
  );

  return (
    <>
      {/* Preload nav-strip images so the overlay opens fully populated */}
      <div className="hidden" aria-hidden="true">
        {mainNavItems.map((item) => (
          <Image
            key={item.id}
            src={item.image}
            alt=""
            width={1}
            height={1}
            sizes="(min-width: 768px) 33vw, 0px"
          />
        ))}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            id="navigation-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-[100] flex flex-col bg-ink text-main"
            style={{
              paddingTop: "env(safe-area-inset-top, 0px)",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            {/* ───────── Header row ─────────
                Close stays viewport-aligned (matches navbar hamburger). EN/MN sits in
                the same max-w-7xl inset + left column width as the nav labels below. */}
            <div className="shrink-0 border-b border-main/10">
              <div className="relative flex min-h-[calc(5rem*1.10)] w-full items-stretch pt-[calc(5rem*0.10)]">
                <button
                  onClick={onClose}
                  className="absolute left-5 top-[calc(50%+5rem*0.10/2)] z-20 -translate-y-1/2 rounded-lg px-2 py-3 text-main transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-surface/50 md:left-12"
                  aria-label="Close menu"
                >
                  <span
                    className="flex w-9 shrink-0 flex-col justify-center md:w-[2.925rem]"
                    aria-hidden
                  >
                    <span className="relative flex h-[13px] w-full items-center justify-center md:h-[15px]">
                      <span className="relative h-[9.75px] w-[1.6875rem] shrink-0 md:h-[11.25px] md:w-[2.19375rem]">
                        <span className="absolute left-1/2 top-1/2 h-px w-[140%] max-w-none origin-center -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
                        <span className="absolute left-1/2 top-1/2 h-px w-[140%] max-w-none origin-center -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
                      </span>
                    </span>
                  </span>
                </button>

                {/* Centered wordmark — matches Navbar positioning exactly */}
                <Link
                  href={localePrefix || "/"}
                  onClick={onClose}
                  className="absolute left-1/2 top-[calc(50%+5rem*0.10/2)] z-10 -translate-x-1/2 -translate-y-1/2 transition-opacity hover:opacity-90"
                >
                  <Image
                    src="/images/logo-white.png"
                    alt="Dalai Eej Resort"
                    width={180}
                    height={50}
                    className="h-8 w-auto max-w-[7.5rem] sm:h-10 sm:max-w-none md:h-12"
                    priority
                  />
                </Link>

                <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-5 md:px-12">
                  {/* Left column: matches body nav column — EN/MN aligns with "Өргөө" etc. */}
                  <div className="hidden min-w-0 flex-1 items-center md:flex md:w-[35%] md:max-w-[35%] md:flex-none">
                    {languageToggle}
                  </div>

                  <div className="ml-auto flex shrink-0 items-center">
                    <CTAButton
                      href={`${localePrefix}/booking`}
                      variant="secondary"
                      size="sm"
                      onClick={onClose}
                      className="!px-3.5 sm:!px-6 !py-2.5 sm:!py-[calc(0.75rem*1.6)] !text-[10px] sm:!text-xs !tracking-[0.16em] sm:!tracking-[0.18em]"
                    >
                      {isMn ? "Захиалах" : "Book your stay"}
                    </CTAButton>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-4 md:hidden">
                {languageToggle}
              </div>
            </div>

            {/* ───────── Main body ───────── */}
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-8 px-5 py-8 md:flex-row md:gap-8 md:px-12 md:py-14 lg:gap-10">

                {/* LEFT COLUMN — nav links + contact */}
                <div className="flex w-full shrink-0 flex-col md:w-[35%]">
                  <nav
                    aria-label="Primary"
                    className="flex flex-col gap-2.5 md:gap-4"
                  >
                    {mainNavItems.map((item, i) => {
                      const label = isMn ? item.label.mn : item.label.en;
                      const linkClass = [
                        "group inline-flex items-center gap-3",
                        "leading-[1.05]",
                        isMn
                          ? "font-editorial-mn italic text-[2.35rem] md:text-5xl lg:text-[3.25rem]"
                          : "font-editorial-en italic text-[2.35rem] md:text-5xl lg:text-[3.25rem]",
                        item.available
                          ? "text-main/90 hover:text-main transition-colors"
                          : "cursor-default text-main/50",
                      ].join(" ");

                      return (
                        <motion.div
                          key={item.id}
                          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: reduceMotion ? 0 : 0.5,
                            delay: reduceMotion ? 0 : 0.08 * i + 0.1,
                          }}
                          onMouseEnter={() => scrollCardIntoView(item.id)}
                          onFocus={() => scrollCardIntoView(item.id)}
                        >
                          {item.available ? (
                            <Link
                              href={`${localePrefix}${item.href}`}
                              onClick={onClose}
                              className={linkClass}
                            >
                              <span>{label}</span>
                            </Link>
                          ) : (
                            <span role="link" aria-disabled="true" className={linkClass}>
                              <span>{label}</span>
                              <span className="mt-1 font-cta text-[9px] font-medium uppercase tracking-[0.2em] text-main/40 not-italic md:mt-0 md:text-[10px] md:tracking-[0.22em]">
                                {isMn ? "Тун удахгүй" : "Soon"}
                              </span>
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </nav>

                  {/* Separator */}
                  <motion.div
                    initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.5 }}
                    className="my-8 h-px w-16 origin-left bg-main/20 md:my-10"
                  />

                  {/* Call us + socials */}
                  <motion.div
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.6 }}
                    className="flex flex-col gap-5"
                  >
                    <a
                      href={PHONE_HREF}
                      className="group flex items-baseline gap-4 text-main/80 transition-colors hover:text-main"
                    >
                      <span className="font-cta text-[11px] font-medium uppercase tracking-[0.28em] text-main/50">
                        {isMn ? "Утас:" : "Call us:"}
                      </span>
                      <span className="font-body text-sm md:text-base">
                        {PHONE_DISPLAY}
                      </span>
                    </a>

                    <ul className="flex items-center gap-3">
                      {socialLinks.map(({ href, label, icon: Icon }) => (
                        <li key={label}>
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-main/25 text-main/70 transition-colors hover:border-main hover:text-main"
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* RIGHT COLUMN — horizontal image strip */}
                <div className="relative -mx-6 mt-2 h-44 shrink-0 md:mx-0 md:mt-0 md:h-auto md:flex-1">
                  <motion.div
                    ref={stripRef}
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.2 }}
                    className="flex h-full gap-5 overflow-x-auto scroll-smooth px-6 pb-2 md:gap-6 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    role="list"
                  >
                    {mainNavItems.map((item) => {
                      const label = isMn ? item.label.mn : item.label.en;
                      const meta = isMn ? item.meta.mn : item.meta.en;

                      const card = (
                        <figure
                          data-card={item.id}
                          role="listitem"
                          className="group flex w-[62vw] shrink-0 flex-col sm:w-[40vw] md:w-[clamp(16rem,28vw,22rem)]"
                        >
                          <div className="relative aspect-[3/4] w-full overflow-hidden bg-main/5">
                            <Image
                              src={item.image}
                              alt={label}
                              fill
                              sizes="(min-width: 768px) 30vw, 65vw"
                              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                              priority={item.id === "stay"}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                            {!item.available && (
                              <span className="absolute right-3 top-3 bg-ink/70 px-2 py-1 font-cta text-[9px] font-medium uppercase tracking-[0.22em] text-main/80 backdrop-blur-sm">
                                {isMn ? "Тун удахгүй" : "Coming soon"}
                              </span>
                            )}
                          </div>
                          <figcaption className="mt-5 flex items-baseline justify-between gap-4">
                            <span
                              className={[
                                "text-main",
                                isMn
                                  ? "font-editorial-mn italic text-xl md:text-2xl"
                                  : "font-editorial-en italic text-xl md:text-2xl",
                              ].join(" ")}
                            >
                              {label}
                            </span>
                            <span className="font-cta text-[10px] font-medium uppercase tracking-[0.24em] text-main/50">
                              {meta}
                            </span>
                          </figcaption>
                        </figure>
                      );

                      if (!item.available) {
                        return (
                          <div key={item.id} className="shrink-0">
                            {card}
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={item.id}
                          href={`${localePrefix}${item.href}`}
                          onClick={onClose}
                          className="shrink-0"
                        >
                          {card}
                        </Link>
                      );
                    })}

                    {/* Trailing spacer so the last card can sit flush with the padding */}
                    <div aria-hidden="true" className="w-2 shrink-0 md:w-4" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
