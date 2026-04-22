import { generatePageMetadata } from '@/lib/metadata';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    namespace: 'metadata.cabins',
    path: '/cabins',
  });
}

export default async function CabinsLayout({ children }: Props) {
  return children;
}
