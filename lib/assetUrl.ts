import { siteOriginForLocale } from "@/lib/site-urls";

/**
 * Optional CDN / object-store bases (no trailing slash).
 * - NEXT_PUBLIC_IMAGES_CDN_URL — only paths under `/images/...` (e.g. R2 bucket with an `images/` prefix).
 * - NEXT_PUBLIC_ASSET_CDN_URL — any public path: `/images/...`, `/branding/...`, etc.
 * If both are set, `/images/...` uses the images base; everything else uses the asset base.
 * Unset = same-origin assets from Next.js `/public`.
 */
function imagesCdnBase(): string {
  return (process.env.NEXT_PUBLIC_IMAGES_CDN_URL ?? "").trim().replace(/\/$/, "");
}

function assetCdnBase(): string {
  return (process.env.NEXT_PUBLIC_ASSET_CDN_URL ?? "").trim().replace(/\/$/, "");
}

/**
 * Resolves a path under `/public` to either a same-origin URL or an absolute CDN URL.
 */
export function assetUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const imgBase = imagesCdnBase();
  if (p.startsWith("/images") && imgBase) {
    return `${imgBase}${p}`;
  }
  const allBase = assetCdnBase();
  if (allBase) {
    return `${allBase}${p}`;
  }
  return p;
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
