import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const turbopackRoot = path.dirname(fileURLToPath(import.meta.url));

/** Allow next/image to load optimized images from optional CDN origins (R2, S3, Vercel Blob, etc.). */
function cdnRemotePatterns(): { protocol: "http" | "https"; hostname: string; pathname: string }[] {
  const raws = [process.env.NEXT_PUBLIC_IMAGES_CDN_URL, process.env.NEXT_PUBLIC_ASSET_CDN_URL].filter(
    (v): v is string => Boolean(v),
  );
  const seen = new Set<string>();
  const out: { protocol: "http" | "https"; hostname: string; pathname: string }[] = [];
  for (const s of raws) {
    try {
      const u = new URL(s);
      const key = `${u.protocol}//${u.hostname}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        protocol: u.protocol === "https:" ? "https" : "http",
        hostname: u.hostname,
        pathname: "/**",
      });
    } catch {
      /* invalid URL in env */
    }
  }
  return out;
}

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
      { source: '/faqs', destination: '/', permanent: true },
      { source: '/getting-here-mn', destination: '/', permanent: true },
      { source: '/home-kr', destination: '/', permanent: true },
      { source: '/home-mn', destination: '/', permanent: true },
      { source: '/rooms-and-facilities-kr', destination: '/', permanent: true },
      { source: '/tour-packages-kr', destination: '/', permanent: true },
      { source: '/gallery-kr', destination: '/en/gallery', permanent: true },
      { source: '/rooms-and-facilities-mn', destination: '/', permanent: true },
      { source: '/services-mn', destination: '/', permanent: true },
      { source: '/gallery-mn', destination: '/mn/gallery', permanent: true },
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
      ...cdnRemotePatterns(),
    ],
  },
};

export default withNextIntl(nextConfig);