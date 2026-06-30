/** Public path to the à la carte menu PDF. */
export const RESTAURANT_MENU_PDF_PATH = "/documents/dalai-eej-menu.pdf";

/** Gallery dining tab — primary destination for restaurant / dining nav. */
export const RESTAURANT_DINING_GALLERY_PATH = "/gallery?filter=dining";

export function openRestaurantMenuPdf(): void {
  if (typeof window === "undefined") return;
  window.open(RESTAURANT_MENU_PDF_PATH, "_blank", "noopener,noreferrer");
}

export function isDiningGalleryHref(href: string): boolean {
  return (
    href === RESTAURANT_DINING_GALLERY_PATH ||
    (href.includes("/gallery") && href.includes("filter=dining"))
  );
}
