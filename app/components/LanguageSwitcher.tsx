"use client";

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import type { MouseEvent } from 'react';
import { absoluteSiteUrl } from '@/lib/site-urls';

type Props = {
  /** Replaces default light-on-dark link colors (e.g. paper / light hero). */
  className?: string;
};

export default function LanguageSwitcher({ className }: Props) {
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
  const href = absoluteSiteUrl(targetLocale, pathWithoutLocale);
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.assign(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={
        className ??
        "font-cta text-xs font-medium uppercase tracking-[0.18em] px-2 py-1 rounded text-main/70 hover:text-main transition-colors"
      }
      aria-label={ariaLabel}
    >
      {label}
    </a>
  );
}
