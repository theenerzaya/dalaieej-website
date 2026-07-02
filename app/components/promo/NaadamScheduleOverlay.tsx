"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useLocale } from "next-intl";
import {
  getKhatgalNaadam2026SchedulePath,
  isNaadam2026Active,
  NAADAM_SCHEDULE_OPEN_EVENT,
  type NaadamScheduleOpenDetail,
} from "@/lib/naadamSchedule";

export default function NaadamScheduleOverlay() {
  const locale = useLocale();
  const [portalMounted, setPortalMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [scheduleLocale, setScheduleLocale] = useState(locale);

  const schedulePath = getKhatgalNaadam2026SchedulePath(scheduleLocale);
  const scheduleAlt =
    scheduleLocale === "mn"
      ? "2026 оны Хатгалын Наадмын хөтөлбөр"
      : "2026 Khatgal Naadam schedule";
  const closeLabel = scheduleLocale === "mn" ? "Хөтөлбөр хаах" : "Close schedule";

  const close = useCallback(() => {
    setOpen(false);
    setZoomed(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setPortalMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onOpen = (event: Event) => {
      if (!isNaadam2026Active()) return;
      const detail = (event as CustomEvent<NaadamScheduleOpenDetail>).detail;
      setScheduleLocale(detail?.locale ?? locale);
      setZoomed(false);
      setOpen(true);
    };

    window.addEventListener(NAADAM_SCHEDULE_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(NAADAM_SCHEDULE_OPEN_EVENT, onOpen);
  }, [locale]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  if (!portalMounted || !open) return null;

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={scheduleAlt} className="fixed inset-0 z-[200]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/90"
        aria-label={closeLabel}
        onClick={close}
      />
      <div
        className={`absolute inset-0 z-[1] p-4 pt-16 md:p-8 ${
          zoomed
            ? "overflow-auto"
            : "pointer-events-none flex items-center justify-center"
        }`}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <img
          src={schedulePath}
          alt={scheduleAlt}
          onClick={(event) => {
            event.stopPropagation();
            setZoomed((isZoomed) => !isZoomed);
          }}
          className={`pointer-events-auto select-none object-contain shadow-2xl [-webkit-touch-callout:none] ${
            zoomed
              ? "mx-auto block h-auto max-h-none max-w-none cursor-zoom-out"
              : "max-h-full max-w-full cursor-zoom-in"
          }`}
          draggable={false}
        />
      </div>
      <button
        type="button"
        onClick={close}
        className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        aria-label={closeLabel}
      >
        <X className="h-5 w-5" strokeWidth={2} aria-hidden />
      </button>
    </div>,
    document.body,
  );
}
