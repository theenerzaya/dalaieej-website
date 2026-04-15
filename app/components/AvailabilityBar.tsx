"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { useScrolledPast } from "@/hooks/useScrolledPast";

function useNavOpen() {
  const [navOpen, setNavOpen] = useState(false);
  
  useEffect(() => {
    const checkNavOpen = () => {
      setNavOpen(document.body.classList.contains('nav-open'));
    };
    
    checkNavOpen();
    
    const observer = new MutationObserver(checkNavOpen);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);
  
  return navOpen;
}

function getDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

export default function AvailabilityBar() {
  const t = useTranslations('booking');
  const router = useRouter();
  const pathname = usePathname();
  const navOpen = useNavOpen();
  const scrolledPast = useScrolledPast();
  
  const currentLocale = pathname.startsWith('/mn') ? 'mn' : 'en';
  const localePrefix = currentLocale === 'mn' ? '/mn' : '';
  
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const defaultCheckout = new Date(now);
    defaultCheckout.setDate(defaultCheckout.getDate() + 3);
    
    setMinDate(getDateString(now));
    setCheckIn(getDateString(now));
    setCheckOut(getDateString(defaultCheckout));
  }, []);

  if (navOpen) return null;

  const handleCheckAvailability = () => {
    if (checkIn && checkOut) {
      router.push(`${localePrefix}/booking?checkin=${checkIn}&checkout=${checkOut}`);
    } else {
      router.push(`${localePrefix}/booking`);
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-ink/95 backdrop-blur-md border-t border-white/10 py-4 px-4 md:py-5 md:px-6 shadow-2xl transition-all duration-500 ease-out ${
        scrolledPast
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
      inert={!scrolledPast ? true : undefined}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
        <div className="text-center md:text-left hidden md:block">
          <p className="font-serif text-main text-lg tracking-wide">{t('planYourStay')}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
          <div className="flex flex-row gap-3 md:gap-4 w-full md:w-auto justify-center min-w-0">
            <div className="flex flex-col flex-1 min-w-0 basis-0">
              <label className="text-main/60 text-xs uppercase tracking-wider mb-1 font-body whitespace-nowrap">
                {t('checkIn')}
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={minDate}
                className="w-full min-w-0 px-2.5 md:px-4 py-2.5 bg-white/10 border border-white/20 text-main rounded-lg focus:outline-none focus:border-bark focus:ring-1 focus:ring-bark/50 transition-colors cursor-pointer"
              />
            </div>

            <div className="flex flex-col flex-1 min-w-0 basis-0">
              <label className="text-main/60 text-xs uppercase tracking-wider mb-1 font-body whitespace-nowrap">
                {t('checkOut')}
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || minDate}
                className="w-full min-w-0 px-2.5 md:px-4 py-2.5 bg-white/10 border border-white/20 text-main rounded-lg focus:outline-none focus:border-bark focus:ring-1 focus:ring-bark/50 transition-colors cursor-pointer"
              />
            </div>
          </div>
          
          <button
            onClick={handleCheckAvailability}
            className="mt-4 sm:mt-6 group inline-flex items-center gap-2 px-8 py-3 bg-bark text-white font-serif uppercase tracking-widest hover:bg-bark/80 active:scale-[0.98] transition-all cursor-pointer rounded-lg font-semibold shadow-lg shadow-bark/20"
          >
            {t('checkAvailability')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
