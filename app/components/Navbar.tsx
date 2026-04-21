"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import NavigationOverlay from "./layout/NavigationOverlay";
import { CTAButton } from "./ui/Typography";
import { useHeroPastForNav } from "@/hooks/useHeroPastForNav";

function isHomePathname(pathname: string) {
  return pathname === "/" || pathname === "/mn" || pathname === "/mn/";
}

function isAboutUsPathname(pathname: string) {
  return pathname === "/about-us" || pathname.startsWith("/about-us/") || pathname.includes("/mn/about-us");
}

export default function Navbar() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isBookingPage = pathname.includes('/booking') || pathname.includes('/checkout') || pathname.includes('/payment');
  const isHome = isHomePathname(pathname);
  const isAboutUs = isAboutUsPathname(pathname);
  const heroPast = useHeroPastForNav(isHome);
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
                backgroundImage:
                  'url("/images/about-us/decorations/paper.jpg")',
                backgroundRepeat: "repeat",
                backgroundSize: "720px 720px",
                backgroundBlendMode: "multiply",
              }
            : undefined
        }
      >
        <div className="relative flex min-h-[calc(5rem*1.05)] w-full items-stretch pt-[calc(5rem*0.05)]">
          <div className="flex items-center pl-8 md:pl-12 z-10">
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
              <span className="flex w-9 flex-col justify-center gap-[5px] md:w-[2.925rem] md:gap-1.5" aria-hidden>
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
              </span>
            </button>
          </div>

          <Link
            href={localePrefix || "/"}
            className={`absolute left-1/2 top-[calc(50%+5rem*0.05/2)] z-10 -translate-x-1/2 -translate-y-1/2 hover:opacity-90 transition-all duration-500 ${
              showFullChrome ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!showFullChrome}
            tabIndex={showFullChrome ? undefined : -1}
          >
            <Image
              src="/images/logo-white.png"
              alt="Dalai Eej Resort"
              width={180}
              height={50}
              className={`h-8 w-auto max-w-[7.5rem] sm:h-10 sm:max-w-none md:h-12 ${
                paperNav ? "brightness-0" : ""
              }`}
              priority
            />
          </Link>

          <div className="ml-auto flex items-center pr-8 md:pr-12 z-10">
            <div className="hidden md:flex items-center gap-4 md:gap-6 pr-3 md:pr-5">
              <LanguageSwitcher
                className={
                  paperNav
                    ? "font-cta text-xs font-medium uppercase tracking-[0.18em] px-2 py-1 rounded text-black/70 hover:text-black transition-colors"
                    : undefined
                }
              />
            </div>

            <CTAButton
              href={`${localePrefix}/booking`}
              variant={paperNav ? "ghost" : "secondary"}
              size="sm"
              className={`!px-5 sm:!px-6 !py-[calc(0.625rem*1.6)] sm:!py-[calc(0.75rem*1.6)] ${
                paperNav
                  ? "!border-black/45 !text-black hover:!bg-black/[0.06] focus-visible:!ring-black/30"
                  : ""
              }`}
            >
              {locale === 'mn' ? "Захиалах" : "Book"}
            </CTAButton>
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
