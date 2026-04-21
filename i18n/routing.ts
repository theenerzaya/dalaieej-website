import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'mn'],
  defaultLocale: 'mn',
  localePrefix: 'always'
});
