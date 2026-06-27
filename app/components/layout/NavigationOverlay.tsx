"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Facebook, Images, Instagram, Mail } from "lucide-react";
import SiteImage from "@/app/components/SiteImage";
import WeatherWidget from "@/app/components/WeatherWidget";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/localePath";
import { formatLowestCabinPriceFrom } from "@/lib/cabinCatalog";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CTAButton } from "../ui/Typography";
import { absoluteSiteUrl } from "@/lib/site-urls";

/**
 * NavigationOverlay — Hoteller-styled fullscreen menu.
 *
 * Layout (matches the Hoteller "Our Rooms" overlay reference):
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │  ✕  EN | MN                LOGO              BOOK YOUR STAY  │
 *   │ ──────────────────────────────────────────────────────────── │
 *   │                                                              │
 *   │  Our Rooms                                                   │
 *   │  Dining                                                      │
 *   │  Adventures                                                  │
 *   │  Our Story                                                   │
 *   │                                                              │
 *   │  Call us: +976 …                                             │
 *   │  [f] [ig] [@]                                                │
 *   │  Weather Conditions                                          │
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
  imagePosition?: string;
  label: { en: string; mn: string };
  meta: { en: string; mn: string };
  available: boolean;
};

const mainNavItems: MainNavItem[] = [
  {
    id: "stay",
    href: "/booking",
    image: "/images/cabins/room-lakeside.webp",
    imagePosition: "50% 50%",
    label: { en: "Cabins & Camps", mn: "Амрах байрууд" },
    meta: {
      en: `Cabins & Suites · ${formatLowestCabinPriceFrom("en")}`,
      mn: `Модон хаус · ${formatLowestCabinPriceFrom("mn")}`,
    },
    available: true,
  },
  {
    id: "dining",
    href: "/gallery?filter=dining",
    image: "/images/gallery/restaurant/DBR_6767.jpg",
    label: { en: "Dining", mn: "Зоог" },
    meta: { en: "Lakeside kitchen", mn: "Нуурын эрэг дэх амтат зоог" },
    available: true,
  },
  {
    id: "adventure",
    href: "/experiences",
    image: "/images/nav-overlay/adventure.jpg",
    label: { en: "Adventures", mn: "Аялал, адал явдал" },
    meta: { en: "Guided expeditions", mn: "Байгальтай танилцах хөтөлбөр" },
    available: true,
  },
  {
    id: "about",
    href: "/about-us",
    image: "/images/nav-overlay/our-story.jpg",
    label: { en: "Our Story", mn: "Бидний түүх" },
    meta: { en: "The family behind Dalai Eej", mn: "Далай ээжийг үүсгэн байгуулагчид" },
    available: true,
  },
  {
    id: "getting-here",
    href: "/getting-here",
    image: "/images/almanac/getting-here/murun-airport-terminal-interior.jpg",
    imagePosition: "43% 50%",
    label: { en: "Getting Here", mn: "Хүрэлцэн ирэх" },
    meta: {
      en: "Flights, coaches & the final leg",
      mn: "Нислэг, газрын зам болон эцсийн зогсоол",
    },
    available: true,
  },
];

const PHONE_DISPLAY = "+976 77 809010";
const PHONE_HREF = "tel:+97677809010";
const DESKTOP_FEATURE_IMAGE = "/images/gallery/the-resort/DBR_7075.webp";

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

function getPathWithoutLocale(pathname: string): string {
  if (pathname.startsWith("/mn")) {
    return pathname.replace(/^\/mn/, "") || "/";
  }
  if (pathname.startsWith("/en")) {
    return pathname.replace(/^\/en/, "") || "/";
  }
  return pathname;
}

function getNavItemHref(locale: string, href: string): string {
  if (href.startsWith("#")) return href;
  return withLocalePath(locale, href);
}

export default function NavigationOverlay({ isOpen, onClose }: NavigationOverlayProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const isMn = locale === "mn";
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const reduceMotion = useReducedMotion();

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

  const handleNavClick = (href: string) => (event: React.MouseEvent) => {
    if (!href.startsWith("#")) {
      onClose();
      return;
    }

    event.preventDefault();
    onClose();

    // Wait for overlay exit + body scroll unlock before scrolling.
    window.setTimeout(() => {
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", href);
    }, 320);
  };

  const goToLocaleHost = (targetLocale: "en" | "mn") => {
    const targetHref = absoluteSiteUrl(targetLocale, pathWithoutLocale);
    onClose();
    window.location.assign(targetHref);
  };

  const languageToggle = (
    <div className="font-cta text-sm md:text-[15px] font-semibold uppercase tracking-[0.28em] leading-none text-left">
      <a
        href={absoluteSiteUrl("en", pathWithoutLocale)}
        onClick={(event) => {
          event.preventDefault();
          goToLocaleHost("en");
        }}
        aria-label="Switch to English"
        className={[
          "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-surface/50",
          locale === "en" ? "text-main" : "text-main/40 hover:text-main/70",
        ].join(" ")}
      >
        EN
      </a>
      <span className="mx-2 text-main/30" aria-hidden="true">
        /
      </span>
      <a
        href={absoluteSiteUrl("mn", pathWithoutLocale)}
        onClick={(event) => {
          event.preventDefault();
          goToLocaleHost("mn");
        }}
        aria-label="Switch to Mongolian"
        className={[
          "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-surface/50",
          locale === "mn" ? "text-main" : "text-main/40 hover:text-main/70",
        ].join(" ")}
      >
        MN
      </a>
    </div>
  );

  return (
    <>
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
                Close stays viewport-aligned and the wordmark stays centered. */}
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
                  href={withLocalePath(locale, "/")}
                  onClick={onClose}
                  className="absolute left-1/2 top-[calc(50%+5rem*0.10/2)] z-20 -translate-x-1/2 -translate-y-1/2 transition-opacity hover:opacity-90"
                >
                  <SiteImage
                    src="/branding/logos/logo-white.png"
                    alt="Dalai Eej Resort"
                    width={180}
                    height={59}
                    className="h-8 w-auto max-w-[7.5rem] sm:h-10 sm:max-w-none md:h-12"
                    style={{ width: "auto" }}
                    priority
                  />
                </Link>

                <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-5 md:px-12 pointer-events-none">
                  <div className="pointer-events-auto ml-auto flex shrink-0 items-center">
                    <CTAButton
                      href={withLocalePath(locale, "/booking")}
                      variant="secondary"
                      size="sm"
                      onClick={onClose}
                      className="!px-3.5 sm:!px-6 !py-2.5 sm:!py-[calc(0.75rem*1.6)] !text-[10px] sm:!text-xs !tracking-[0.16em] sm:!tracking-[0.18em]"
                    >
                      {isMn ? "Захиалах" : "Book"}
                    </CTAButton>
                  </div>
                </div>
              </div>
            </div>

            {/* ───────── Main body ───────── */}
            <div className="min-h-0 flex-1 overflow-hidden">
              <div className="mx-auto grid min-h-full w-full max-w-7xl grid-cols-1 gap-5 px-5 py-6 md:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)] md:items-end md:gap-12 md:px-12 md:py-10 lg:gap-16 xl:py-14">
                <div className="flex min-w-0 flex-col md:self-center">
                  <nav
                    aria-label="Primary"
                    className="flex flex-col gap-2 md:gap-3.5"
                  >
                    {mainNavItems.map((item, i) => {
                      const label = isMn ? item.label.mn : item.label.en;
                      const linkClass = [
                        "group inline-flex items-center gap-3",
                        "leading-[1.05]",
                        isMn
                          ? "font-editorial-mn italic text-[2.35rem] md:text-[clamp(3.1rem,5vw,4.8rem)]"
                          : "font-editorial-en italic text-[2.35rem] md:text-[clamp(3.1rem,5vw,4.8rem)]",
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
                        >
                          {item.available ? (
                            <Link
                              href={getNavItemHref(locale, item.href)}
                              onClick={handleNavClick(item.href)}
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

                  <motion.div
                    initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.5 }}
                    className="mt-5 md:mt-7"
                  >
                    {languageToggle}
                  </motion.div>
                </div>

                <div className="flex min-w-0 flex-col md:self-center">
                  <motion.div
                    initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.28 }}
                    className="relative mb-4 block h-[clamp(4.25rem,11vh,6rem)] w-full overflow-hidden bg-main/5 md:mb-6 md:h-[clamp(7rem,20vh,10rem)] lg:mb-7 lg:h-[clamp(15rem,40vh,25rem)]"
                  >
                    <SiteImage
                      src={DESKTOP_FEATURE_IMAGE}
                      alt={isMn ? "Далай Ээжийн оройн түүдэг гал" : "Evening campfire at Dalai Eej"}
                      fill
                      sizes="(min-width: 1024px) 22rem, 100vw"
                      className="object-cover object-[50%_38%] opacity-85 lg:object-[50%_58%]"
                      priority
                    />
                    <div className="absolute inset-0 bg-ink/15" aria-hidden="true" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-main/10" aria-hidden="true" />
                  </motion.div>

                  <motion.div
                    initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.5 }}
                    className="mb-4 h-px w-16 origin-left bg-main/20 md:mb-7"
                  />
                  <motion.div
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.6 }}
                    className="flex flex-col gap-3 md:gap-4"
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
                      <li>
                        <Link
                          href={withLocalePath(locale, "/gallery")}
                          onClick={onClose}
                          aria-label={isMn ? "Галерей" : "Gallery"}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-main/25 text-main/70 transition-colors hover:border-main hover:text-main"
                        >
                          <Images className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </li>
                    </ul>

                    <WeatherWidget className="pt-1 md:pt-3 [@media(max-height:700px)_and_(max-width:767px)]:hidden" />
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
