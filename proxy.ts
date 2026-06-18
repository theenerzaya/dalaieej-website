import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { localizePath, localeFromHostname } from './lib/domain-locale-routing';
import { routing } from './i18n/routing';
import { getCanonicalCabinPathForPathname } from './lib/cabinCatalog';

const handleI18nRouting = createMiddleware(routing);

function getHostname(request: NextRequest): string {
  const hostHeader =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '';
  return hostHeader.split(',')[0].trim().split(':')[0].toLowerCase();
}

export default function proxy(request: NextRequest) {
  const hostname = getHostname(request);
  const { pathname, search } = request.nextUrl;
  const domainLocale = localeFromHostname(hostname);

  if (domainLocale) {
    const targetPath = localizePath(pathname, domainLocale);
    if (targetPath !== pathname) {
      return NextResponse.redirect(new URL(`${targetPath}${search}`, request.url));
    }
  }

  const canonicalCabinPath = getCanonicalCabinPathForPathname(pathname);
  if (canonicalCabinPath) {
    return NextResponse.redirect(new URL(`${canonicalCabinPath}${search}`, request.url), 308);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/', '/(en|mn)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
