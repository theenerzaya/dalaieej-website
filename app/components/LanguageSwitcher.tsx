"use client";

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();

  const getPathWithoutLocale = () => {
    if (pathname.startsWith('/mn')) {
      return pathname.replace(/^\/mn/, '') || '/';
    }
    if (pathname.startsWith('/en')) {
      return pathname.replace(/^\/en/, '') || '/';
    }
    return pathname;
  };

  const pathWithoutLocale = getPathWithoutLocale();
  const targetLocale = currentLocale === 'en' ? 'mn' : 'en';
  const label = currentLocale === 'en' ? 'MN' : 'EN';
  const ariaLabel =
    currentLocale === 'en' ? 'Switch to Mongolian (MN)' : 'Switch to English (EN)';

  return (
    <Link
      href={pathWithoutLocale}
      locale={targetLocale}
      className="text-sm font-body px-2 py-1 rounded text-main/70 hover:text-main transition-colors"
      aria-label={ariaLabel}
    >
      {label}
    </Link>
  );
}
