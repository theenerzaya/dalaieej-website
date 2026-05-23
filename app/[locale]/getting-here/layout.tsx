import { getTranslations } from 'next-intl/server';
import { absoluteSiteUrl, hreflangLanguages } from '@/lib/site-urls';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.gettingHere' });
  const canonical = absoluteSiteUrl(locale, '/getting-here');

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical,
      languages: hreflangLanguages('/getting-here'),
    },
    openGraph: {
      title: t('openGraphTitle'),
      description: t('openGraphDescription'),
      url: canonical,
      siteName: 'Dalai Eej Resort',
      locale: locale === 'mn' ? 'mn_MN' : 'en_US',
      type: 'website',
    },
  };
}

export default async function GettingHereLayout({ children }: Props) {
  return children;
}
