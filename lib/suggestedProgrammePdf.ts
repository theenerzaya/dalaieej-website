/** Public path to the suggested experiences programme PDF. */
export const SUGGESTED_PROGRAMME_PDF_PATH = "/documents/suggested-programme.pdf";

export function openSuggestedProgrammePdf(): void {
  if (typeof window === "undefined") return;
  window.open(SUGGESTED_PROGRAMME_PDF_PATH, "_blank", "noopener,noreferrer");
}

export function isExperiencesHref(href: string): boolean {
  return href.endsWith("/experiences") || href === "/experiences";
}
