import type { MetadataRoute } from 'next';
import { getCanonicalCabinHrefs } from '@/lib/cabinCatalog';
import { RESTAURANT_MENU_PDF_PATH } from '@/lib/restaurantMenuPdf';
import { SITE_URL_EN, SITE_URL_MN, hreflangLanguages } from '@/lib/site-urls';

const routes = [
  '',
  '/booking',
  '/about-us',
  '/amenities',
  '/cabins',
  '/lodge',
  '/catalogue',
  '/contact',
  '/getting-here',
  '/almanac',
  '/almanac/murun',
  '/almanac/borders-and-industry',
  '/almanac/forest-and-steppe',
  '/almanac/khovsgol-and-baikal',
  '/experiences',
  '/offers',
  '/route-finder',
  '/fam-tour-application',
  '/groups',
  '/journal',
  ...getCanonicalCabinHrefs(),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const hosts = [SITE_URL_EN, SITE_URL_MN] as const;

  const pageEntries = routes.flatMap((route) =>
    hosts.map((origin) => ({
      url: `${origin}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
      priority: route === '' ? 1.0 : route === '/booking' ? 0.9 : 0.7,
      alternates: {
        languages: hreflangLanguages(route),
      },
    }))
  );

  const menuPdfEntries = hosts.map((origin) => ({
    url: `${origin}${RESTAURANT_MENU_PDF_PATH}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...pageEntries, ...menuPdfEntries];
}
