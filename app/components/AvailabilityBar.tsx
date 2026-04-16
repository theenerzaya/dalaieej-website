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
      className={`fixed bottom-0 left-0 right-0 z-50 bg-ink border-t border-white/10 py-4 px-8 md:py-5 md:px-12 transition-all duration-500 ease-out ${
        scrolledPast
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
      inert={!scrolledPast ? true : undefined}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 min-w-0">
        <div className="text-center md:text-left hidden md:block">
          <p className="font-body text-main text-base md:text-lg font-light tracking-wide">{t('planYourStay')}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 w-full md:w-auto min-w-0">
          <div className="w-full min-w-0 max-w-full md:w-auto md:max-w-none grid gap-2.5 md:gap-4 [grid-template-columns:repeat(2,minmax(0,1fr))]">
            <div className="min-w-0 flex flex-col">
              <label className="text-main/60 text-[10px] md:text-xs uppercase tracking-[0.18em] mb-1 font-body whitespace-nowrap">
                {t('checkIn')}
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={minDate}
                className="box-border w-full max-w-full min-w-0 px-2 md:px-4 py-2.5 bg-white/10 border border-white/20 text-main text-sm md:text-base rounded-none focus:outline-none focus-visible:border-bark focus-visible:ring-2 focus-visible:ring-bark/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent transition-colors cursor-pointer"
              />
            </div>

            <div className="min-w-0 flex flex-col">
              <label className="text-main/60 text-[10px] md:text-xs uppercase tracking-[0.18em] mb-1 font-body whitespace-nowrap">
                {t('checkOut')}
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || minDate}
                className="box-border w-full max-w-full min-w-0 px-2 md:px-4 py-2.5 bg-white/10 border border-white/20 text-main text-sm md:text-base rounded-none focus:outline-none focus-visible:border-bark focus-visible:ring-2 focus-visible:ring-bark/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent transition-colors cursor-pointer"
              />
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleCheckAvailability}
            className="mt-4 sm:mt-6 group inline-flex items-center gap-2 px-5 sm:px-6 py-[calc(0.625rem*1.6)] sm:py-[calc(0.75rem*1.6)] bg-bark text-white font-body text-[11px] sm:text-xs font-light uppercase tracking-[0.18em] hover:bg-bark-hover transition-colors cursor-pointer rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-bark/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            {t('checkAvailability')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
