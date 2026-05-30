/** Keep in sync with `translucentNavbar: true` on almanac articles (EN + MN). */
export const ALMANAC_TRANSLUCENT_NAV_SLUGS = [
  "forest-and-steppe",
  "khovsgol-and-baikal",
] as const;

/** Chapter I — standalone getting-here page (EN + MN). */
export const GETTING_HERE_TRANSLUCENT_NAV = "/getting-here";

export function isAlmanacTranslucentNavPathname(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname.includes(GETTING_HERE_TRANSLUCENT_NAV)) return true;
  return ALMANAC_TRANSLUCENT_NAV_SLUGS.some((slug) =>
    pathname.includes(`/almanac/${slug}`),
  );
}
