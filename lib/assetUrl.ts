import { siteOriginForLocale } from "@/lib/site-urls";

/**
 * Resolves a path under `/public` to a same-origin URL.
 */
export function assetUrl(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Absolute URL for Open Graph / Twitter images. Uses CDN when configured, otherwise
 * the site origin for the locale (for correct dalaieej.com vs dalaieej.mn).
 */
export function openGraphAssetUrl(path: string, locale: string): string {
  const u = assetUrl(path);
  if (u.startsWith("http")) return u;
  const origin = siteOriginForLocale(locale).replace(/\/$/, "");
  return `${origin}${u}`;
}
