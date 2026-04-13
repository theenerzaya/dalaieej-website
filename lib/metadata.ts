import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

const BASE_URL = 'https://dalaieej.com';

export async function generatePageMetadata({
  locale,
  namespace,
  path = '',
}: {
  locale: string;
  namespace: string;
  path?: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });

  const localePath = locale === 'en' ? '' : `/${locale}`;

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}${localePath}${path}`,
      languages: {
        en: `${BASE_URL}${path}`,
        mn: `${BASE_URL}/mn${path}`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URL}${localePath}${path}`,
      siteName: 'Dalai Eej Resort',
      locale: locale === 'mn' ? 'mn_MN' : 'en_US',
      type: 'website',
    },
  };
}
