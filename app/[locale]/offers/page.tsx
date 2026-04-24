"use client";

import { useTranslations, useLocale } from 'next-intl';
import { ArrowLeft } from 'lucide-react';

const offers = [
  {
    id: "couples",
    image: "/images/specialoffers/family-getaway.jpg",
    titleKey: "offers.couples.title",
    descKey: "offers.couples.desc",
    offerKey: "offers.couples.offer",
    ctaType: "book"
  },
  {
    id: "erdenet",
    image: "/images/specialoffers/erdenet-jubilee.jpg",
    titleKey: "offers.erdenet.title",
    descKey: "offers.erdenet.desc",
    offerKey: "offers.erdenet.offer",
    ctaType: "book"
  },
  {
    id: "pioneer",
    image: "/images/gallery/adventures/DBR_1996.webp",
    titleKey: "offers.pioneer.title",
    descKey: "offers.pioneer.desc",
    offerKey: "offers.pioneer.offer",
    ctaType: "book"
  },
  {
    id: "early",
    image: "/images/specialoffers/early-bird.jpg",
    titleKey: "offers.early.title",
    descKey: "offers.early.desc",
    offerKey: "offers.early.offer",
    ctaType: "check"
  },
  {
    id: "longstay",
    image: "/images/specialoffers/shoulder-season.jpg",
    titleKey: "offers.longstay.title",
    descKey: "offers.longstay.desc",
    offerKey: "offers.longstay.offer",
    ctaType: "book"
  },
  {
    id: "family",
    image: "/images/gallery/the-resort/DBR_7676.webp",
    titleKey: "offers.family.title",
    descKey: "offers.family.desc",
    offerKey: "offers.family.offer",
    ctaType: "contact"
  }
];

export default function OffersPage() {
  const t = useTranslations();
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';

  const getCtaText = (type: string) => {
    switch (type) {
      case 'check': return t('offers.checkAvailability');
      case 'contact': return t('offers.contactBook');
      default: return t('offers.bookNow');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white pt-24 md:pt-16">
      <div className="bg-gradient-to-r from-sky-700 to-sky-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <a
            href={localePrefix || "/"}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-body text-sm">{t('nav.home')}</span>
          </a>
          <h1 className="font-heading text-4xl md:text-6xl text-white">
            {locale === 'mn' ? "Тусгай Багцууд" : "Curated Escapes"}
          </h1>
          <p className="font-body text-white/80 text-lg mt-4 max-w-2xl">
            {t('offers.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-sky-100"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={offer.image}
                  alt={t(offer.titleKey)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h2 className="font-heading text-xl text-sky-900 mb-3">
                  {t(offer.titleKey)}
                </h2>
                <p className="font-body text-slate-600 text-sm mb-4 leading-relaxed">
                  {t(offer.descKey)}
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-5">
                  <p className="font-body text-amber-800 font-semibold text-sm">
                    {t(offer.offerKey)}
                  </p>
                </div>
                <a
                  href={offer.ctaType === 'contact' ? '#contact' : `${localePrefix}/booking`}
                  className="block w-full text-center px-6 py-3 bg-sky-700 text-white font-body font-semibold rounded-lg hover:bg-sky-800 transition-colors duration-300 uppercase tracking-wide text-sm"
                >
                  {getCtaText(offer.ctaType)}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-leaf rounded-2xl p-8 md:p-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-main/50 mb-4 font-sans">
            {t('offers.tourOperators.label')}
          </p>
          <h2 className="font-heading text-2xl md:text-3xl text-main mb-4">
            {t('offers.tourOperators.title')}
          </h2>
          <p className="font-body text-main/70 max-w-2xl mx-auto mb-8">
            {t('offers.tourOperators.desc')}
          </p>
          <a
            href={`${localePrefix}/fam-tour-application`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-surface-alt text-leaf font-body font-semibold rounded-lg hover:bg-white transition-colors duration-300"
          >
            {t('offers.tourOperators.button')}
          </a>
        </div>
      </div>

      <footer className="bg-sky-900 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-body text-white/50 text-sm">
            &copy; 2026 {t('hero.title')}. {t('footer.rights')}
          </p>
        </div>
      </footer>
    </main>
  );
}
