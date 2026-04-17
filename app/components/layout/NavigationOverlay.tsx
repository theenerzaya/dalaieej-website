"use client";

import { useState, useEffect } from "react";
import { Phone, MapPin, LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import WeatherWidget from "../WeatherWidget";

// 1. Primary Navigation with Images
const mainNavItems = [
  { 
    id: "stay",
    href: "/accommodation", 
    label: "Stay", 
    mn: "Өргөө",
    image: "/images/nav-overlay/stay.jpg"
  },
  { 
    id: "dining",
    href: "/dining", 
    label: "Dining", 
    mn: "Зоог",
    image: "/images/nav-overlay/dining.jpg"
  },
  { 
    id: "wellness",
    href: "/wellness", 
    label: "Wellness", 
    mn: "Амрахуй",
    image: "/images/nav-overlay/wellness.jpg"
  },
  { 
    id: "adventure",
    href: "/experiences", 
    label: "Adventures", 
    mn: "Адал явдал",
    image: "/images/nav-overlay/adventure.jpg"
  },
  { 
    id: "about",
    href: "/about", 
    label: "Our Story", 
    mn: "Бидний тухай",
    image: "/images/nav-overlay/our-story.jpg"
  },
];

// 2. Secondary Navigation (Utilities)
const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Dalai+Eej+Resort+%7C+%D0%94%D0%B0%D0%BB%D0%B0%D0%B9+%D1%8D%D1%8D%D0%B6+%D1%80%D0%B5%D1%81%D0%BE%D1%80%D1%82/@50.4846993,100.1867456,582m/data=!3m1!1e3!4m15!1m5!8m4!1e2!2s118380989629208568150!3m1!1e1!3m8!1s0x5d0dbb730711f929:0xb57b13f8b35c0cf3!5m2!4m1!1i2!8m2!3d50.4846951!4d100.1893209!16s%2Fg%2F11stqvr5td";

const secondaryNavItems = [
  { href: "/contact", label: "Contact", mn: "Холбоо барих", icon: Phone, external: false },
  { href: GOOGLE_MAPS_URL, label: "Map", mn: "Байршил", icon: MapPin, external: true },
  { href: "/gallery", label: "Gallery", mn: "Зургийн сан", icon: LayoutGrid, external: false },
];

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavigationOverlay({ isOpen, onClose }: NavigationOverlayProps) {
  const pathname = usePathname();
  const isMongolian = pathname.startsWith("/mn");

  // State for the hover effect
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Determine which image to show
  const activeImage = hoveredLink 
    ? mainNavItems.find(item => item.id === hoveredLink)?.image 
    : mainNavItems[0].image;

  // Lock body scroll
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

  const toggleLanguage = () => {
    const newLocale = isMongolian ? "" : "/mn";
    const pathWithoutLocale = isMongolian 
      ? pathname.replace("/mn", "") || "/" 
      : pathname;
    const newPath = `${newLocale}${pathWithoutLocale}`.replace("//", "/");
    window.location.href = newPath;
  };

  return (
    <>
      {/* Preload nav images so they're cached before the overlay opens */}
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
          transition={{ duration: 0.3 }}
          id="navigation-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-[100] bg-leaf text-main flex flex-col"
        >
          {/* Header: close control — same slot as navbar hamburger */}
          <div className="relative flex min-h-[calc(5rem*1.10)] w-full shrink-0 items-stretch pt-[calc(5rem*0.10)] z-20">
            <div className="flex items-center pl-8 md:pl-12 z-10">
              <button
                onClick={onClose}
                className="text-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/40 rounded-lg px-2 py-3"
                aria-label="Close menu"
              >
                <span
                  className="flex w-9 shrink-0 flex-col justify-center md:w-[2.925rem]"
                  aria-hidden
                >
                  {/* Same outer slot as Navbar hamburger; 0.75× icon centered; h-px weight */}
                  <span className="relative flex h-[13px] w-full items-center justify-center md:h-[15px]">
                    <span className="relative h-[9.75px] w-[1.6875rem] shrink-0 md:h-[11.25px] md:w-[2.19375rem]">
                      <span className="absolute left-1/2 top-1/2 h-px w-[140%] max-w-none origin-center -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
                      <span className="absolute left-1/2 top-1/2 h-px w-[140%] max-w-none origin-center -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-white" />
                    </span>
                  </span>
                </span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row w-full h-full max-w-7xl mx-auto">

            {/* LEFT COLUMN: Navigation Links */}
            <div className="flex-1 flex flex-col justify-center px-6 md:px-12 pb-12">

              {/* A. Main Navigation */}
              <nav className="flex flex-col items-center md:items-start gap-4 md:gap-6">
                {mainNavItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.1 }}
                  >
                    {item.id === "about" ? (
                      <Link
                        href={`${isMongolian ? "/mn" : ""}/about-us`}
                        onClick={onClose}
                        onMouseEnter={() => setHoveredLink(item.id)}
                        onMouseLeave={() => setHoveredLink(null)}
                        className="font-serif text-4xl md:text-6xl text-main/60 hover:text-white transition-colors tracking-wide block"
                      >
                        {isMongolian ? item.mn : item.label}
                      </Link>
                    ) : (
                      <span
                        role="link"
                        aria-disabled="true"
                        onMouseEnter={() => setHoveredLink(item.id)}
                        onMouseLeave={() => setHoveredLink(null)}
                        className="font-serif text-4xl md:text-6xl text-main/60 hover:text-white transition-colors tracking-wide block cursor-default"
                      >
                        {isMongolian ? item.mn : item.label}
                        <span className="ml-3 font-body text-xs md:text-sm tracking-[0.15em] uppercase text-main/40 align-middle">
                          {isMongolian ? "Тун удахгүй" : "Coming Soon"}
                        </span>
                      </span>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Separator */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="w-12 h-px bg-white/30 my-8 mx-auto md:mx-0"
              />

              {/* B. Secondary Navigation (Icons) */}
              <nav className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-6 mb-8 md:mb-0">
                {secondaryNavItems.map((item, i) => {
                  const Icon = item.icon;
                  const linkClass = "group flex items-center gap-2 font-body text-xs md:text-sm tracking-[0.2em] uppercase text-main/80 hover:text-white transition-colors";
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + (i * 0.1) }}
                    >
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClass}
                        >
                          <Icon className="w-4 h-4 text-main/60 group-hover:text-white transition-colors" aria-hidden="true" />
                          <span>{isMongolian ? item.mn : item.label}</span>
                        </a>
                      ) : (
                        <Link
                          href={`${isMongolian ? "/mn" : ""}${item.href}`}
                          onClick={onClose}
                          className={linkClass}
                        >
                          <Icon className="w-4 h-4 text-main/60 group-hover:text-white transition-colors" aria-hidden="true" />
                          <span>{isMongolian ? item.mn : item.label}</span>
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
                className="flex justify-center md:justify-start mt-8 md:mt-10"
              >
                <WeatherWidget />
              </motion.div>

              {/* C. Language Switcher (Visible on Mobile Only) */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                // CHANGED: Added 'md:hidden' to remove this block on desktop screens
                className="mt-auto flex justify-center md:hidden"
              >
                <button
                  onClick={toggleLanguage}
                  className="font-body text-xs tracking-[0.2em] font-normal text-main/70 hover:text-white transition-colors uppercase py-3 px-6 border border-white/10 rounded-full hover:border-white/30"
                >
                  <span className={!isMongolian ? "text-white" : ""}>EN</span>
                  <span className="mx-3 opacity-50">|</span>
                  <span className={isMongolian ? "text-white" : ""}>MN</span>
                </button>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Image Preview (Desktop Only) */}
            <div className="hidden md:flex flex-1 items-center justify-center p-8 lg:p-12">
              <div className="relative w-full max-w-lg aspect-[3/4] rounded-lg overflow-hidden bg-black/20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeImage!}
                      alt="Menu preview"
                      fill
                      sizes="(min-width: 768px) 33vw, 0px"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}