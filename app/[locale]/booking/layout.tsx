import { generatePageMetadata } from '@/lib/metadata';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({ locale, namespace: 'metadata.booking', path: '/booking' });
}

export default async function BookingLayout({ children }: Props) {
  return children;
}
