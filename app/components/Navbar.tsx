"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SiteImage from "@/app/components/SiteImage";
import LanguageSwitcher from "./LanguageSwitcher";
import NavigationOverlay from "./layout/NavigationOverlay";
import { CTAButton } from "./ui/Typography";
import { useHeroPastForNav } from "@/hooks/useHeroPastForNav";
import { withLocalePath } from "@/lib/localePath";
import { siteOriginForLocale } from "@/lib/site-urls";
import { assetUrl } from "@/lib/assetUrl";

function isHomePathname(pathname: string) {
  return /^\/(en|mn)\/?$/.test(pathname) || pathname === "/";
}

function isWellnessPathname(pathname: string) {
  return /\/wellness(\/|$)/.test(pathname);
}

function isAboutUsPathname(pathname: string) {
  // localePrefix is always: /{locale}/about-us (en | mn)
  return /\/about-us(\/|$)/.test(pathname);
}

export default function Navbar() {
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const localePrefix = locale === 'mn' ? '/mn' : '';
  const siteHost = new URL(siteOriginForLocale(locale)).hostname;
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isBookingPage = pathname.includes('/booking') || pathname.includes('/checkout') || pathname.includes('/payment');
  const isHome = isHomePathname(pathname);
  const isWellness = isWellnessPathname(pathname);
  const isAboutUs = isAboutUsPathname(pathname);
  const heroPast = useHeroPastForNav(isHome || isWellness, pathname);
  const showFullChrome = isBookingPage || heroPast;
  const paperNav = isAboutUs && !isBookingPage;

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('nav-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('nav-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('nav-open');
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          paperNav
            ? "bg-main text-ink"
            : isBookingPage || heroPast
              ? "bg-ink shadow-lg"
              : "bg-transparent"
        }`}
        style={
          paperNav
            ? {
                paddingTop: "env(safe-area-inset-top, 0px)",
                backgroundImage: `url("${assetUrl("/images/about-us/decorations/paper.jpg")}")`,
                backgroundRepeat: "repeat",
                backgroundSize: "720px 720px",
                backgroundBlendMode: "multiply",
              }
            : undefined
        }
      >
        <div className="relative flex min-h-[calc(5rem*1.05)] w-full items-stretch pt-[calc(5rem*0.05)]">
          <div className="flex items-center pl-5 md:pl-12 z-10">
            <button
              onClick={() => setMenuOpen(true)}
              className={`transition-colors focus:outline-none focus:ring-2 rounded-lg px-2 py-3 ${
                paperNav
                  ? "text-black hover:text-black/70 focus:ring-black/25"
                  : "text-main hover:text-white focus:ring-surface/50"
              }`}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="navigation-overlay"
            >
              <span className="flex w-7 flex-col justify-center gap-[5px] md:w-[2.925rem] md:gap-1.5" aria-hidden>
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
              </span>
            </button>
          </div>

          <Link
            href={withLocalePath(locale, "/")}
            className={`group/brand absolute left-1/2 top-[calc(50%+5rem*0.05/2)] z-10 -translate-x-1/2 -translate-y-1/2 hover:opacity-90 transition-all duration-500 ${
              showFullChrome ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!showFullChrome}
            tabIndex={showFullChrome ? undefined : -1}
          >
            <SiteImage
              src="/branding/logos/logo-white.png"
              alt="Dalai Eej Resort"
              width={180}
              height={50}
              className={`h-7 w-auto max-w-[6.5rem] sm:h-10 sm:max-w-none md:h-12 ${
                paperNav ? "brightness-0" : ""
              }`}
              priority
            />
            <span
              role="tooltip"
              className="pointer-events-none absolute left-1/2 top-[calc(100%+0.5rem)] z-50 min-w-[10rem] -translate-x-1/2 rounded-xl bg-zinc-800/95 px-3 py-2 text-left shadow-lg opacity-0 shadow-black/40 transition-opacity duration-150 group-hover/brand:opacity-100 group-focus-visible/brand:opacity-100"
            >
              <span className="block font-semibold text-sm text-white">
                {tNav("brandShort")}
              </span>
              <span className="mt-0.5 block text-xs text-zinc-400">{siteHost}</span>
            </span>
          </Link>

          <div className="ml-auto flex items-center pr-5 md:pr-12 z-10">
            <div className="hidden md:flex items-center gap-4 md:gap-6 pr-3 md:pr-5">
              <LanguageSwitcher
                className={
                  paperNav
                    ? "font-cta text-xs font-medium uppercase tracking-[0.18em] px-2 py-1 rounded text-black/70 hover:text-black transition-colors"
                    : undefined
                }
              />
            </div>

            {paperNav ? (
              <Link
                href={`${localePrefix}/booking`}
                className="group relative inline-flex items-center justify-center px-5 py-2.5 sm:px-10 sm:py-5"
                aria-label={locale === 'mn' ? 'Захиалах' : 'Book'}
              >
                <SiteImage
                  src="/images/about-us/decorations/accent-3.svg"
                  alt=""
                  fill
                  aria-hidden
                  className="pointer-events-none select-none object-contain transition-opacity duration-200 group-hover:opacity-0"
                  sizes="(min-width: 640px) 200px, 120px"
                />
                <SiteImage
                  src="/images/about-us/decorations/accent-4.svg"
                  alt=""
                  fill
                  aria-hidden
                  className="pointer-events-none select-none object-contain text-black opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  sizes="(min-width: 640px) 200px, 120px"
                />
                <span className="relative font-cta text-[10px] font-light uppercase tracking-[0.16em] text-black transition-colors duration-200 group-hover:text-white sm:text-xs sm:tracking-[0.18em]">
                  {locale === 'mn' ? 'Захиалах' : 'Book'}
                </span>
              </Link>
            ) : (
              <CTAButton
                href={`${localePrefix}/booking`}
                variant="secondary"
                size="sm"
                className="!px-3.5 sm:!px-6 !py-2.5 sm:!py-[calc(0.75rem*1.6)] !text-[10px] sm:!text-xs !tracking-[0.16em] sm:!tracking-[0.18em]"
              >
                {locale === 'mn' ? 'Захиалах' : 'Book'}
              </CTAButton>
            )}
          </div>
        </div>
      </nav>

      <NavigationOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
