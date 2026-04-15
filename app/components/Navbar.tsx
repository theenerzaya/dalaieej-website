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
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-main hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-surface/50 rounded-lg p-2"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="navigation-overlay"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link 
              href={localePrefix || "/"}
              className={`absolute left-1/2 -translate-x-1/2 hover:opacity-90 transition-all duration-500 ${
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

            <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={`hidden md:inline-flex text-main/70 hover:text-white transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-surface/50 rounded-lg p-1 ${
                  showFullChrome ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                aria-label={locale === 'mn' ? "Хайлт" : "Search"}
                aria-hidden={!showFullChrome}
                tabIndex={showFullChrome ? undefined : -1}
              >
                <Search className="w-5 h-5" />
              </button>

              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>
              
              <Link
                href={`${localePrefix}/booking`}
                className="px-3 py-2 md:px-5 md:py-2.5 bg-surface text-water-deep font-body text-[10px] md:text-xs font-semibold tracking-[0.08em] md:tracking-[0.1em] uppercase hover:bg-white transition-colors rounded shrink-0"
              >
                {locale === 'mn' ? "Захиалах" : "Book"}
              </Link>
            </div>
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
