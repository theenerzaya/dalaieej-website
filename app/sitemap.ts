import type { MetadataRoute } from 'next';
import { SITE_URL_EN, SITE_URL_MN, hreflangLanguages } from '@/lib/site-urls';

const routes = [
  '',
  '/booking',
  '/gallery',
  '/about-us',
  '/amenities',
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
  const hosts = [SITE_URL_EN, SITE_URL_MN] as const;

  return routes.flatMap((route) =>
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
}
