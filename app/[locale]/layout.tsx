import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/request';
import { absoluteSiteUrl, hreflangLanguages, siteOriginForLocale } from '@/lib/site-urls';
import "../globals.css";
import NavbarWrapper from "../components/NavbarWrapper";
import Footer from "../components/layout/Footer";

// Font Configurations for the "Heritage" Aesthetic
const vogun = localFont({
  src: "../../public/fonts/Vogun-Medium.ttf",
  variable: "--font-heading",
  weight: "500",
  display: "swap",
});

const gip = localFont({
  src: "../../public/fonts/GIP-Medium.otf",
  variable: "--font-body",
  weight: "500",
  display: "swap",
});

// Dynamic SEO, Social Media, and Favicon Metadata
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.index' });

  const canonical = absoluteSiteUrl(locale, '');

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(siteOriginForLocale(locale)),

    icons: {
      icon: [
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      shortcut: '/favicon.ico',
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    manifest: '/site.webmanifest',

    alternates: {
      canonical,
      languages: hreflangLanguages(''),
    },

    openGraph: {
      title: t('title'),
      description: t('description'),
      url: canonical,
      siteName: 'Dalai Eej Resort',
      locale: locale === 'mn' ? 'mn_MN' : 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://dalaieej.com/images/og-heritage.jpg', 
          width: 1200,
          height: 630,
          alt: 'Dalai Eej Heritage Resort at Lake Khuvsgul',
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['https://dalaieej.com/images/og-heritage.jpg'],
    },

    other: {
      'facebook-domain-verification': 'fbzj6dj5kddr5k4wktv59ukuvx1avi',
    },
  };
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const resortCanonical = absoluteSiteUrl(locale, '');
  const resortImageBase = siteOriginForLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Schema.org Markup for Search Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Resort',
            name: 'Dalai Eej Heritage Site',
            image: `${resortImageBase}/images/hero.jpg`,
            telephone: '+976-9500-5595',
            email: 'hello@dalaieej.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Khuvsgul Lake National Park',
              addressLocality: 'Khatgal',
              addressRegion: 'Khuvsgul',
              postalCode: '67143',
              addressCountry: 'MN'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '50.48479874018978',
              longitude: '100.18977589128245'
            },
            url: resortCanonical,
            priceRange: '$$$'
          }) }}
        />
      </head>
      <body className={`${vogun.variable} ${gip.variable} antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-ink focus:text-main focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-surface">
            Skip to main content
          </a>
          <NavbarWrapper />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}