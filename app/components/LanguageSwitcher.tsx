"use client";

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
}

export default function LanguageSwitcher({ variant = 'light' }: LanguageSwitcherProps) {
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

  const isDark = variant === 'dark';

  return (
    <div className="flex items-center gap-2">
      <Globe className={`w-4 h-4 ${isDark ? 'text-ink/50' : 'text-main/70'}`} />
      <div className="flex items-center gap-1 text-sm font-body">
        <Link
          href={pathWithoutLocale}
          locale="en"
          className={`px-2 py-1 rounded transition-colors ${
            currentLocale === 'en' 
              ? isDark ? 'bg-ink/10 text-ink font-semibold' : 'bg-surface text-water-deep font-semibold'
              : isDark ? 'text-ink/50 hover:text-ink' : 'text-main/70 hover:text-main'
          }`}
        >
          EN
        </Link>
        <span className={isDark ? 'text-ink/20' : 'text-main/30'}>|</span>
        <Link
          href={pathWithoutLocale}
          locale="mn"
          className={`px-2 py-1 rounded transition-colors ${
            currentLocale === 'mn' 
              ? isDark ? 'bg-ink/10 text-ink font-semibold' : 'bg-surface text-water-deep font-semibold'
              : isDark ? 'text-ink/50 hover:text-ink' : 'text-main/70 hover:text-main'
          }`}
        >
          MN
        </Link>
      </div>
    </div>
  );
}
