"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import NavigationOverlay from "./layout/NavigationOverlay";
import SearchOverlay from "./SearchOverlay";
import { useScrolledPast } from "@/hooks/useScrolledPast";

export default function Navbar() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const scrolled = useScrolledPast();

  const isBookingPage = pathname.includes('/booking') || pathname.includes('/checkout') || pathname.includes('/payment');
  const showFullChrome = isBookingPage || scrolled;

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
        isBookingPage || scrolled ? 'bg-ink shadow-lg' : 'bg-transparent'
      }`}>
        <div className="relative flex h-20 w-full items-stretch">
          <div className="flex items-center pl-4 md:pl-8 z-10">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-main hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-surface/50 rounded-lg p-2"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="navigation-overlay"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <Link
            href={localePrefix || "/"}
            className={`absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 hover:opacity-90 transition-all duration-500 ${
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

          <div className="ml-auto flex items-stretch z-10">
            <div className="hidden md:flex items-center gap-4 md:gap-6 pr-3 md:pr-5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={`inline-flex text-main/70 hover:text-white transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-surface/50 rounded-lg p-1 ${
                  showFullChrome ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                aria-label={locale === 'mn' ? "Хайлт" : "Search"}
                aria-hidden={!showFullChrome}
                tabIndex={showFullChrome ? undefined : -1}
              >
                <Search className="w-5 h-5" />
              </button>

              <LanguageSwitcher />
            </div>

            <Link
              href={`${localePrefix}/booking`}
              className="flex min-h-20 w-[10.75rem] sm:w-[11.75rem] md:w-[12.5rem] shrink-0 items-center justify-center self-stretch px-3 sm:px-4 bg-bark text-white font-body text-xs sm:text-sm font-bold uppercase tracking-wide whitespace-nowrap rounded-none hover:bg-bark/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-inset"
            >
              {locale === 'mn' ? "Захиалах" : "Book"}
            </Link>
          </div>
        </div>
      </nav>

      <NavigationOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenSearch={() => {
          setMenuOpen(false);
          setSearchOpen(true);
        }}
      />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
