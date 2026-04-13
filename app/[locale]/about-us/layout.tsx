import { generatePageMetadata } from '@/lib/metadata';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({ locale, namespace: 'metadata.story', path: '/about-us' });
}

export default async function AboutUsLayout({ children }: Props) {
  return children;
}
