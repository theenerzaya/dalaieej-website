import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout', '/payment', '/booking/confirmation'],
      },
    ],
    sitemap: 'https://dalaieej.com/sitemap.xml',
  };
}
