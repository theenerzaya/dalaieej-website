export const WELLNESS_PROMO_OPEN_EVENT = "dalaieej:open-wellness-promo";

/** Sentinel href for wellness tiles/links that open the jacuzzi promo modal. */
export const WELLNESS_INTERACTION_HREF = "#wellness-promo";

export function isWellnessInteractionHref(href: string): boolean {
  return (
    href === WELLNESS_INTERACTION_HREF ||
    href.endsWith("/wellness") ||
    href === "/wellness"
  );
}

export function openWellnessPromo(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(WELLNESS_PROMO_OPEN_EVENT));
}

export function handleWellnessInteraction(event?: { preventDefault(): void }): void {
  event?.preventDefault();
  openWellnessPromo();
}

export function navigateExperienceCardHref(href: string): void {
  if (isWellnessInteractionHref(href)) {
    openWellnessPromo();
    return;
  }
  if (typeof window !== "undefined") {
    window.location.href = href;
  }
}
