/** Keep in sync with `translucentNavbar: true` on almanac articles (EN + MN). */
export const ALMANAC_TRANSLUCENT_NAV_SLUGS = [
  "forest-and-steppe",
  "khovsgol-and-baikal",
] as const;

export function isAlmanacTranslucentNavPathname(pathname: string | null): boolean {
  if (!pathname) return false;
  return ALMANAC_TRANSLUCENT_NAV_SLUGS.some((slug) =>
    pathname.includes(`/almanac/${slug}`),
  );
}
