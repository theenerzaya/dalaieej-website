"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { CTAButton } from "./ui/Typography";
import { useScrolledPast } from "@/hooks/useScrolledPast";
import { withLocalePath } from "@/lib/localePath";
import { formatIsoDateAsDots } from "@/lib/dateFormat";

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

function HomeDateField({
  label,
  value,
  onChange,
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
}) {
  return (
    <label className="relative min-w-0 flex flex-col cursor-pointer">
      <span className="font-cta text-main/60 text-[10px] md:text-xs font-medium uppercase tracking-[0.18em] mb-1 whitespace-nowrap">
        {label}
      </span>
      <span className="block min-h-10 border-b border-main/25 py-2 pr-2 font-body text-main text-sm md:text-base leading-6">
        {value ? formatIsoDateAsDots(value) : "DD.MM.YYYY"}
      </span>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-x-0 bottom-0 h-10 cursor-pointer opacity-0 [color-scheme:dark]"
        aria-label={label}
      />
    </label>
  );
}

export default function AvailabilityBar() {
  const t = useTranslations('booking');
  const router = useRouter();
  const pathname = usePathname();
  const navOpen = useNavOpen();
  const scrolledPast = useScrolledPast();
  
  const currentLocale = pathname.startsWith('/mn') ? 'mn' : 'en';
  const bookingPath = withLocalePath(currentLocale, "/booking");
  
  // Initialize booking dates without setting state in `useEffect` (ESLint rule).
  // Note: values are derived from the client/server's current time.
  const [checkIn, setCheckIn] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return getDateString(d);
  });
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4); // defaultCheckout is defaultCheckIn + 3 days
    return getDateString(d);
  });
  const [minDate] = useState(() => getDateString(new Date()));

  if (navOpen) return null;

  const handleCheckAvailability = () => {
    if (checkIn && checkOut) {
      router.push(`${bookingPath}?checkin=${checkIn}&checkout=${checkOut}`);
    } else {
      router.push(bookingPath);
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-ink pt-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] px-4 sm:px-6 md:pt-2.5 md:pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] md:px-12 transition-all duration-500 ease-out ${
        scrolledPast
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
      inert={!scrolledPast ? true : undefined}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-stretch md:flex-row md:items-center justify-center gap-3 md:gap-6 min-w-0">
        <p className="hidden md:block font-cta text-main text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-center md:text-left shrink-0">
          {t('planYourStay')}
        </p>

        <div className="w-full min-w-0 max-w-full md:w-auto md:max-w-none grid gap-2 md:gap-4 [grid-template-columns:repeat(2,minmax(0,1fr))]">
          <HomeDateField
            label={t('checkIn')}
            value={checkIn}
            onChange={setCheckIn}
            min={minDate}
          />

          <HomeDateField
            label={t('checkOut')}
            value={checkOut}
            onChange={setCheckOut}
            min={checkIn || minDate}
          />
        </div>

        <CTAButton
          variant="secondary"
          size="sm"
          onClick={handleCheckAvailability}
          className="group !px-5 sm:!px-6 !py-3 sm:!py-[calc(0.75rem*1.6)] w-full md:w-auto"
        >
          {t('checkAvailability')}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </CTAButton>
      </div>
    </div>
  );
}
