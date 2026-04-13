import type { MetadataRoute } from 'next';

const BASE_URL = 'https://dalaieej.com';

const routes = [
  '',
  '/booking',
  '/gallery',
  '/about-us',
  '/amenities',
  '/accommodation',
  '/cabins',
  '/lodge',
  '/catalogue',
  '/contact',
  '/dining',
  '/experiences',
  '/wellness',
  '/offers',
  '/route-finder',
  '/fam-tour-application',
  '/groups',
  '/journal',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'mn'];

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${BASE_URL}${locale === 'en' ? '' : `/${locale}`}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
      priority: route === '' ? 1.0 : route === '/booking' ? 0.9 : 0.7,
      alternates: {
        languages: {
          en: `${BASE_URL}${route}`,
          mn: `${BASE_URL}/mn${route}`,
        },
      },
    }))
  );
}
