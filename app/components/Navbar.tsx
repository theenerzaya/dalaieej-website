"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import NavigationOverlay from "./layout/NavigationOverlay";

export default function Navbar() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 bg-ink ${
        scrolled ? 'shadow-lg' : ''
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
              className="absolute left-1/2 -translate-x-1/2 hover:opacity-90 transition-opacity"
            >
              <Image
                src="/images/logo-white.png"
                alt="Dalai Eej Resort"
                width={180}
                height={50}
                className="h-10 md:h-12 w-auto"
                priority
              />
            </Link>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>
              
              <Link
                href={`${localePrefix}/booking`}
                className="px-5 py-2.5 bg-surface text-water-deep font-body text-xs font-semibold tracking-[0.1em] uppercase hover:bg-white transition-colors rounded"
              >
                {locale === 'mn' ? "Захиалах" : "Book"}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <NavigationOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
