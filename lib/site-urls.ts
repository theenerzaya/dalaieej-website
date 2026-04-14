export const SITE_URL_EN = 'https://dalaieej.com';
export const SITE_URL_MN = 'https://dalaieej.mn';

/** Path segment after host: '' for home, or '/booking', '/gallery', etc. */
export function normalizeSitePath(path: string): string {
  if (path === '') return '';
  return path.startsWith('/') ? path : `/${path}`;
}

export function siteOriginForLocale(locale: string): string {
  return locale === 'mn' ? SITE_URL_MN : SITE_URL_EN;
}

export function absoluteSiteUrl(locale: string, path: string): string {
  const p = normalizeSitePath(path);
  return `${siteOriginForLocale(locale)}${p}`;
}

/** Hreflang cluster: final URLs on each host (no /mn path on .com). */
export function hreflangLanguages(path: string) {
  const p = normalizeSitePath(path);
  return {
    en: `${SITE_URL_EN}${p}`,
    mn: `${SITE_URL_MN}${p}`,
    'x-default': `${SITE_URL_EN}${p}`,
  };
}
