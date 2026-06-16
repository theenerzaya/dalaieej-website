/** Keep in sync with `translucentNavbar: true` on almanac articles (EN + MN). */
export const ALMANAC_TRANSLUCENT_NAV_SLUGS = [
  "forest-and-steppe",
  "khovsgol-and-baikal",
] as const;

/** Standalone almanac-style pages with hero-over-nav (EN + MN). */
export const TRANSLUCENT_NAV_STANDALONE_ROUTES = [
  "/getting-here",
  "/experiences",
] as const;

export function isAlmanacTranslucentNavPathname(pathname: string | null): boolean {
  if (!pathname) return false;
  if (
    TRANSLUCENT_NAV_STANDALONE_ROUTES.some((route) => pathname.includes(route))
  ) {
    return true;
  }
  return ALMANAC_TRANSLUCENT_NAV_SLUGS.some((slug) =>
    pathname.includes(`/almanac/${slug}`),
  );
}
