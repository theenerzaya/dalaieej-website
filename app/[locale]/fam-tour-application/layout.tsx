import { generatePageMetadata } from '@/lib/metadata';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({ locale, namespace: 'metadata.fam', path: '/fam-tour-application' });
}

export default async function FamTourLayout({ children }: Props) {
  return children;
}
