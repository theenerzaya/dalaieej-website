"use client";

import { useState } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { ArrowLeft, CheckCircle, Calendar, Building2 } from 'lucide-react';

export default function FamTourApplicationPage() {
  const t = useTranslations();
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    website: '',
    email: '',
    requestedDates: '',
    clientele: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('fam.form.submitted'));
  };

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-16">
      <section className="relative pt-8 pb-16 bg-leaf">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <a
            href={`${localePrefix}/offers`}
            className="inline-flex items-center gap-2 text-main/70 hover:text-main transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-body text-sm">{t('offers.title')}</span>
          </a>
          <h1 className="font-heading text-3xl md:text-5xl text-main mb-6">
            {t('fam.hero.title')}
          </h1>
          <p className="font-body text-main/80 text-lg max-w-2xl mx-auto">
            {t('fam.hero.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-surface-alt/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-leaf/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-leaf" />
              </div>
              <h3 className="font-heading text-lg text-leaf mb-2">
                {t('fam.benefits.complimentary.title')}
              </h3>
              <p className="font-body text-leaf/70 text-sm">
                {t('fam.benefits.complimentary.desc')}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-leaf/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-leaf" />
              </div>
              <h3 className="font-heading text-lg text-leaf mb-2">
                {t('fam.benefits.verification.title')}
              </h3>
              <p className="font-body text-leaf/70 text-sm">
                {t('fam.benefits.verification.desc')}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-leaf/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-leaf" />
              </div>
              <h3 className="font-heading text-lg text-leaf mb-2">
                {t('fam.benefits.blackout.title')}
              </h3>
              <p className="font-body text-leaf/70 text-sm">
                {t('fam.benefits.blackout.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl text-leaf mb-4">
              {t('fam.form.title')}
            </h2>
            <p className="font-body text-leaf/70">
              {t('fam.form.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-body text-sm text-leaf mb-2">
                  {t('fam.form.companyName')} *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block font-body text-sm text-leaf mb-2">
                  {t('fam.form.contactPerson')} *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-body text-sm text-leaf mb-2">
                  {t('fam.form.website')}
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block font-body text-sm text-leaf mb-2">
                  {t('fam.form.email')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-sm text-leaf mb-2">
                {t('fam.form.requestedDates')} *
              </label>
              <input
                type="text"
                name="requestedDates"
                value={formData.requestedDates}
                onChange={handleChange}
                required
                placeholder={t('fam.form.datesPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block font-body text-sm text-leaf mb-2">
                {t('fam.form.clientele')} *
              </label>
              <textarea
                name="clientele"
                value={formData.clientele}
                onChange={handleChange}
                required
                rows={4}
                placeholder={t('fam.form.clientelePlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 bg-leaf text-main font-body font-semibold rounded-lg hover:bg-leaf/90 transition-colors duration-300"
              >
                {t('fam.form.submit')}
              </button>
            </div>

            <p className="text-center font-body text-xs text-gray-500">
              {t('fam.form.disclaimer')}
            </p>
          </form>
        </div>
      </section>

      <footer className="bg-leaf py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-body text-main/50 text-sm">
            &copy; {new Date().getFullYear()} {t('hero.title')}. {t('footer.rights')}
          </p>
        </div>
      </footer>
    </main>
  );
}
