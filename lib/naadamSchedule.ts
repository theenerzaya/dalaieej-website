export const KHATGAL_NAADAM_2026_SCHEDULE_PATHS = {
  en: "/images/events/naadam/khatgal-naadam-2026-en.jpg",
  mn: "/images/events/naadam/khatgal-naadam-2026-mn.jpg",
} as const;

export const NAADAM_SCHEDULE_OPEN_EVENT = "dalaieej:open-naadam-schedule";

export type NaadamScheduleOpenDetail = {
  locale?: string;
};

export function getKhatgalNaadam2026SchedulePath(locale: string): string {
  return locale === "mn"
    ? KHATGAL_NAADAM_2026_SCHEDULE_PATHS.mn
    : KHATGAL_NAADAM_2026_SCHEDULE_PATHS.en;
}

export function isNaadam2026Active(): boolean {
  // Expires after July 14, 2026
  return new Date() < new Date("2026-07-15T00:00:00Z");
}

export function openNaadamSchedule(locale?: string): void {
  if (typeof window === "undefined" || !isNaadam2026Active()) return;
  const detail: NaadamScheduleOpenDetail | undefined = locale ? { locale } : undefined;
  window.dispatchEvent(
    new CustomEvent<NaadamScheduleOpenDetail>(NAADAM_SCHEDULE_OPEN_EVENT, { detail }),
  );
}

export function handleNaadamScheduleInteraction(
  event?: { preventDefault(): void },
  locale?: string,
): void {
  event?.preventDefault();
  openNaadamSchedule(locale);
}
