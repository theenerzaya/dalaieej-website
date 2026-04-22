import { generatePageMetadata } from '@/lib/metadata';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    namespace: 'metadata.superiorCabin',
    path: '/superior-cabin',
  });
}

export default async function SuperiorCabinLayout({ children }: Props) {
  return children;
}
