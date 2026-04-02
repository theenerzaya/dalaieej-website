"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';

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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-leaf border-t border-main/20 py-4 px-4 md:py-6 md:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
        <div className="text-center md:text-left hidden md:block">
          <p className="font-serif text-main text-lg">{t('planYourStay')}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
          <div className="flex flex-col">
            <label className="text-main/70 text-xs uppercase tracking-wider mb-1 font-sans">
              {t('checkIn')}
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={minDate}
              className="px-4 py-2 bg-transparent border border-main/50 text-main rounded-lg focus:outline-none focus:border-main transition-colors cursor-pointer"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-main/70 text-xs uppercase tracking-wider mb-1 font-sans">
              {t('checkOut')}
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || minDate}
              className="px-4 py-2 bg-transparent border border-main/50 text-main rounded-lg focus:outline-none focus:border-main transition-colors cursor-pointer"
            />
          </div>
          
          <button
            onClick={handleCheckAvailability}
            className="mt-4 sm:mt-6 px-8 py-3 bg-surface-alt text-leaf font-serif uppercase tracking-widest hover:bg-white transition-all cursor-pointer rounded-lg font-semibold"
          >
            {t('checkAvailability')}
          </button>
        </div>
      </div>
    </div>
  );
}
