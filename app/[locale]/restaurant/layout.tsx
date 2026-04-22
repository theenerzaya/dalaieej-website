import { generatePageMetadata } from '@/lib/metadata';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    namespace: 'metadata.restaurant',
    path: '/restaurant',
  });
}

export default async function RestaurantLayout({ children }: Props) {
  return children;
}
