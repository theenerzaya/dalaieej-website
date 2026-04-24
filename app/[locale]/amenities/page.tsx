"use client";

import { useState } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { ArrowLeft, Check, ChevronDown, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const amenityKeys = ['yurts', 'shoreline', 'restaurant', 'sauna', 'tours'];
const inclusionKeys = ['breakfast', 'firewood', 'parking', 'security', 'concierge', 'wifi', 'water', 'luggage'];
const policyKeys = ['checkin', 'cancellation', 'quiet', 'pets'];

const featureImages = {
  dining: "/images/gallery/restaurant/DBR_4975.webp",
  activities: "/images/gallery/adventures/DBR_4303.webp",
  relaxation: "/images/gallery/wellness/DBR_3098.webp"
};

export default function AmenitiesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';
  const [openPolicy, setOpenPolicy] = useState<string | null>(null);

  const togglePolicy = (key: string) => {
    setOpenPolicy(openPolicy === key ? null : key);
  };

  return (
    <main id="main-content" className="min-h-screen bg-white pt-24 md:pt-16">
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-sky-900 to-sky-700">
        <div className="absolute inset-0">
          <img 
            src="/images/cabins/hero-our-rooms.webp"
            alt="Lake Khuvsgul"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <a
            href={localePrefix || "/"}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-body text-sm">{t('nav.home')}</span>
          </a>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-white mb-6">
            {t('amenities.hero.title')}
          </h1>
          <p className="font-body text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {t('amenities.hero.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl text-sky-900 mb-8">
                {t('amenities.keyAmenities.title')}
              </h2>
              <ul className="space-y-4">
                {amenityKeys.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-sky-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-body text-slate-700 text-lg">
                      {t(`amenities.keyAmenities.items.${key}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <img
                src="/images/gallery/accommodations/DBR_4885.webp"
                alt="Resort amenities"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl order-2 lg:order-1">
              <img
                src={featureImages.dining}
                alt="Dining"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-heading text-3xl md:text-4xl text-sky-900 mb-6">
                {t('amenities.dining.title')}
              </h2>
              <p className="font-body text-slate-600 text-lg leading-relaxed mb-8">
                {t('amenities.dining.desc')}
              </p>
              <button className="px-6 py-3 bg-amber-600 text-white font-body font-semibold rounded-lg hover:bg-amber-700 transition-colors uppercase tracking-wide text-sm">
                {t('amenities.dining.cta')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl text-sky-900 mb-6">
                {t('amenities.activities.title')}
              </h2>
              <p className="font-body text-slate-600 text-lg leading-relaxed mb-8">
                {t('amenities.activities.desc')}
              </p>
              <button className="px-6 py-3 bg-sky-700 text-white font-body font-semibold rounded-lg hover:bg-sky-800 transition-colors uppercase tracking-wide text-sm">
                {t('amenities.activities.cta')}
              </button>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <img
                src={featureImages.activities}
                alt="Activities"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl order-2 lg:order-1">
              <img
                src={featureImages.relaxation}
                alt="Relaxation"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-heading text-3xl md:text-4xl text-sky-900 mb-6">
                {t('amenities.relaxation.title')}
              </h2>
              <p className="font-body text-slate-600 text-lg leading-relaxed mb-8">
                {t('amenities.relaxation.desc')}
              </p>
              <a 
                href={`${localePrefix}/booking`}
                className="inline-block px-6 py-3 bg-stone-700 text-white font-body font-semibold rounded-lg hover:bg-stone-800 transition-colors uppercase tracking-wide text-sm"
              >
                {t('amenities.relaxation.cta')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-sky-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-white mb-12">
            {t('amenities.inclusions.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inclusionKeys.map((key) => (
              <div key={key} className="flex items-center gap-4 bg-white/10 rounded-lg px-6 py-4">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="font-body text-white text-left">
                  {t(`amenities.inclusions.${key}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-stone-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl text-sky-900 text-center mb-12">
            {t('amenities.testimonials.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['review1', 'review2', 'review3'].map((review) => (
              <div key={review} className="bg-white rounded-xl p-8 shadow-lg relative">
                <Quote className="w-10 h-10 text-sky-200 absolute top-6 right-6" />
                <p className="font-body text-slate-600 italic mb-6 leading-relaxed">
                  "{t(`amenities.testimonials.${review}.text`)}"
                </p>
                <p className="font-body text-sky-900 font-semibold">
                  — {t(`amenities.testimonials.${review}.author`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl text-sky-900 text-center mb-12">
            {t('amenities.policies.title')}
          </h2>
          <div className="space-y-4">
            {policyKeys.map((key) => (
              <div key={key} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => togglePolicy(key)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-stone-50 hover:bg-stone-100 transition-colors"
                >
                  <span className="font-heading text-lg text-sky-900">
                    {t(`amenities.policies.${key}.title`)}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-sky-700 transition-transform duration-300 ${
                      openPolicy === key ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                <AnimatePresence>
                  {openPolicy === key && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 bg-white">
                        <p className="font-body text-slate-600">
                          {t(`amenities.policies.${key}.desc`)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

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
