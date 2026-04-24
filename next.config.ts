import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const turbopackRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: turbopackRoot,
  },
  async redirects() {
    const mnDomainHosts = [
      { type: 'host' as const, value: 'dalaieej.com' },
      { type: 'host' as const, value: 'www.dalaieej.com' },
    ];

    return [
      ...mnDomainHosts.flatMap((host) => [
        {
          source: '/mn',
          destination: 'https://dalaieej.mn',
          permanent: true,
          has: [host],
        },
        {
          source: '/mn/:path*',
          destination: 'https://dalaieej.mn/:path*',
          permanent: true,
          has: [host],
        },
      ]),
      // Legacy Slugs to Home Page
      { source: '/about', destination: '/', permanent: true },
      { source: '/reserve', destination: '/', permanent: true },
      { source: '/secret', destination: '/', permanent: true },
      { source: '/services', destination: '/', permanent: true },
      { source: '/rooms-and-facilities', destination: '/', permanent: true },
      { source: '/gallery', destination: '/', permanent: true },
      { source: '/en/gallery', destination: '/', permanent: true },
      { source: '/mn/gallery', destination: '/', permanent: true },
      { source: '/faqs', destination: '/', permanent: true },
      { source: '/getting-here-mn', destination: '/', permanent: true },
      { source: '/home-kr', destination: '/', permanent: true },
      { source: '/home-mn', destination: '/', permanent: true },
      { source: '/rooms-and-facilities-kr', destination: '/', permanent: true },
      { source: '/tour-packages-kr', destination: '/', permanent: true },
      { source: '/gallery-kr', destination: '/', permanent: true },
      { source: '/rooms-and-facilities-mn', destination: '/', permanent: true },
      { source: '/services-mn', destination: '/', permanent: true },
      { source: '/gallery-mn', destination: '/', permanent: true },
      { source: '/faqs-mn', destination: '/', permanent: true },
      { source: '/getting-here-kr', destination: '/', permanent: true },
      { source: '/faqs-kr', destination: '/', permanent: true },
      { source: '/virtual-tour', destination: '/', permanent: true },
      { source: '/aerial-360', destination: '/', permanent: true },
      // Accommodations index → all-rooms listing (same content, new canonical path)
      { source: '/en/accommodation', destination: '/en/cabins', permanent: true },
      { source: '/mn/accommodation', destination: '/mn/cabins', permanent: true },
      { source: '/mongolia-itinerary-planner', destination: '/', permanent: true },
      { source: '/mongolia-itinerary-planner-gobi-khuvsgul', destination: '/', permanent: true },
    ];
  },
  allowedDevOrigins: [
    "*.picard.replit.dev",
    "*.replit.dev",
    "127.0.0.1",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);