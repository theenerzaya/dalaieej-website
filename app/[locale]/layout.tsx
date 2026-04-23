import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { absoluteSiteUrl, hreflangLanguages, siteOriginForLocale } from '@/lib/site-urls';
import "../globals.css";
import { araboto, cormorantGaramondItalic, montserrat, playfairDisplayItalic } from "../fonts";
import NavbarWrapper from "../components/NavbarWrapper";
import Footer from "../components/layout/Footer";

// Dynamic SEO, Social Media, and Favicon Metadata
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.index' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const canonical = absoluteSiteUrl(locale, '');

  return {
    applicationName: tNav('brandShort'),
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(siteOriginForLocale(locale)),

    icons: {
      icon: [
        { url: '/branding/favicons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        { url: '/branding/favicons/favicon.svg', type: 'image/svg+xml' },
      ],
      shortcut: '/branding/favicons/favicon.ico',
      apple: [
        { url: '/branding/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    manifest: '/branding/favicons/site.webmanifest',

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

  const messages = await getMessages();
  const resortCanonical = absoluteSiteUrl(locale, '');
  const resortImageBase = siteOriginForLocale(locale);

  return (
    <div
      lang={locale}
      className={`${araboto.variable} ${montserrat.variable} ${cormorantGaramondItalic.variable} ${playfairDisplayItalic.variable} antialiased`}
      suppressHydrationWarning
    >
      {/* Schema.org Markup for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Resort',
            name: 'Dalai Eej Heritage Site',
            image: `${resortImageBase}/images/og-heritage.jpg`,
            telephone: '+976-9500-5595',
            email: 'hello@dalaieej.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: "Mergen's Ridge, Haichin Am, eastern shore of Lake Khuvsgul",
              addressLocality: 'Khatgal',
              addressRegion: 'Khuvsgul',
              postalCode: '67143',
              addressCountry: 'MN'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '50.485139',
              longitude: '100.198139'
            },
            url: resortCanonical,
            priceRange: '$$$'
          })
        }}
      />
      <NextIntlClientProvider messages={messages}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-ink focus:text-main focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-surface">
          Skip to main content
        </a>
        <NavbarWrapper />
        <div className="relative z-10">{children}</div>
        <Footer />
      </NextIntlClientProvider>
    </div>
  );
}