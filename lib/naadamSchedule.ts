const KHATGAL_NAADAM_2026_IMAGE_VERSIONS = {
  en: "20260702-1518",
  mn: "20260702-1555",
} as const;

export const KHATGAL_NAADAM_2026_SCHEDULE_PATHS = {
  en: `/images/events/naadam/khatgal-naadam-2026-en.jpg?v=${KHATGAL_NAADAM_2026_IMAGE_VERSIONS.en}`,
  mn: `/images/events/naadam/khatgal-naadam-2026-mn.jpg?v=${KHATGAL_NAADAM_2026_IMAGE_VERSIONS.mn}`,
} as const;

export const NAADAM_SCHEDULE_OPEN_EVENT = "dalaieej:open-naadam-schedule";
export type NaadamScheduleLocale = keyof typeof KHATGAL_NAADAM_2026_SCHEDULE_PATHS;

export type NaadamScheduleOpenDetail = {
  locale?: string;
};

export function normalizeNaadamScheduleLocale(locale?: string): NaadamScheduleLocale {
  return locale === "mn" ? "mn" : "en";
}

export function getKhatgalNaadam2026SchedulePath(locale?: string): string {
  return KHATGAL_NAADAM_2026_SCHEDULE_PATHS[normalizeNaadamScheduleLocale(locale)];
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
