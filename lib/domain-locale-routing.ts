export type SupportedLocale = 'en' | 'mn';

export function localeFromHostname(hostname: string): SupportedLocale | null {
  if (hostname === 'dalaieej.mn' || hostname === 'www.dalaieej.mn') return 'mn';
  if (hostname === 'dalaieej.com' || hostname === 'www.dalaieej.com') return 'en';
  return null;
}

export function localizePath(pathname: string, locale: SupportedLocale): string {
  if (pathname === '/') return `/${locale}`;
  if (pathname.startsWith('/en/')) return pathname.replace('/en/', `/${locale}/`);
  if (pathname.startsWith('/mn/')) return pathname.replace('/mn/', `/${locale}/`);
  if (pathname === '/en' || pathname === '/mn') return `/${locale}`;
  return `/${locale}${pathname}`;
}
