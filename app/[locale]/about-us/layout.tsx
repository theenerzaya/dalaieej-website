import type { Viewport } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import AboutUsDocumentPaper from '@/app/components/about-us/AboutUsDocumentPaper';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/** Warm paper tone for browser chrome (status bar / tab bar) on mobile. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f7f4e6',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({ locale, namespace: 'metadata.story', path: '/about-us' });
}

export default async function AboutUsLayout({ children }: Props) {
  return (
    <>
      <AboutUsDocumentPaper />
      {children}
    </>
  );
}
