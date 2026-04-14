import GalleryGrid from '@/app/components/gallery/GalleryGrid';
import { generatePageMetadata } from '@/lib/metadata';
import { absoluteSiteUrl, siteOriginForLocale } from '@/lib/site-urls';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return generatePageMetadata({ locale, namespace: 'metadata.gallery', path: '/gallery' });
}

function galleryJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Dalai Eej Resort Photo Gallery',
    description: 'A visual journey through Dalai Eej Resort on Lake Khuvsgul, Mongolia',
    url: absoluteSiteUrl(locale, '/gallery'),
    about: {
      '@type': 'Resort',
      name: 'Dalai Eej Resort'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dalai Eej Resort',
      url: siteOriginForLocale(locale),
    }
  };
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd(locale)) }}
      />
      <GalleryGrid />
    </>
  );
}
