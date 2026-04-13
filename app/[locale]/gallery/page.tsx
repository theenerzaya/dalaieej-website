import GalleryGrid from '@/app/components/gallery/GalleryGrid';
import { generatePageMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return generatePageMetadata({ locale, namespace: 'metadata.gallery', path: '/gallery' });
}

const galleryJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: 'Dalai Eej Resort Photo Gallery',
  description: 'A visual journey through Dalai Eej Resort on Lake Khuvsgul, Mongolia',
  url: 'https://dalaieej.com/gallery',
  about: {
    '@type': 'Resort',
    name: 'Dalai Eej Resort'
  },
  publisher: {
    '@type': 'Organization',
    name: 'Dalai Eej Resort',
    url: 'https://dalaieej.com'
  }
};

export default async function GalleryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }}
      />
      <GalleryGrid />
    </>
  );
}
