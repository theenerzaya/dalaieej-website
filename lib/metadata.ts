import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { absoluteSiteUrl, hreflangLanguages } from '@/lib/site-urls';

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

  const canonical = absoluteSiteUrl(locale, path);

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical,
      languages: hreflangLanguages(path),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: canonical,
      siteName: 'Dalai Eej Resort',
      locale: locale === 'mn' ? 'mn_MN' : 'en_US',
      type: 'website',
    },
  };
}
