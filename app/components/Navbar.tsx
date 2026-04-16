"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import NavigationOverlay from "./layout/NavigationOverlay";
import { useHeroPastForNav } from "@/hooks/useHeroPastForNav";

function isHomePathname(pathname: string) {
  return pathname === "/" || pathname === "/mn" || pathname === "/mn/";
}

export default function Navbar() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isBookingPage = pathname.includes('/booking') || pathname.includes('/checkout') || pathname.includes('/payment');
  const isHome = isHomePathname(pathname);
  const heroPast = useHeroPastForNav(isHome);
  const showFullChrome = isBookingPage || heroPast;

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
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isBookingPage || heroPast ? 'bg-ink shadow-lg' : 'bg-transparent'
      }`}>
        <div className="relative flex min-h-[calc(5rem*1.10)] w-full items-stretch pt-[calc(5rem*0.10)]">
          <div className="flex items-center pl-8 md:pl-12 z-10">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-main hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-surface/50 rounded-lg px-2 py-3"
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
            className={`absolute left-1/2 top-[calc(50%+5rem*0.10/2)] z-10 -translate-x-1/2 -translate-y-1/2 hover:opacity-90 transition-all duration-500 ${
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
              className="h-8 w-auto max-w-[7.5rem] sm:h-10 sm:max-w-none md:h-12"
              priority
            />
          </Link>

          <div className="ml-auto flex items-center pr-8 md:pr-12 z-10">
            <div className="hidden md:flex items-center gap-4 md:gap-6 pr-3 md:pr-5">
              <LanguageSwitcher />
            </div>

            <Link
              href={`${localePrefix}/booking`}
              className="inline-flex shrink-0 items-center justify-center bg-bark px-5 py-[calc(0.625rem*1.6)] sm:px-6 sm:py-[calc(0.75rem*1.6)] font-body text-[11px] sm:text-xs font-light uppercase tracking-[0.18em] text-white whitespace-nowrap rounded-none transition-colors hover:bg-bark-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-bark/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              {locale === 'mn' ? "Захиалах" : "Book"}
            </Link>
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
