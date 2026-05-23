"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Phone, Mail, Clock } from "lucide-react";

export default function LocationPage() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-16">
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-leaf">
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl text-main mb-6"
          >
            {locale === 'mn' ? "Аялал Төлөвлөх" : "Plan Your Journey"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-main/90 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {locale === 'mn' 
              ? "Таны аялал эндээс эхэлнэ — Хөвсгөлийн зүүн эрэг рүү"
              : "Your journey to Lake Khövsgöl begins here"}
          </motion.p>
        </div>
      </section>

      <section className="py-16 px-4 bg-surface-alt">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-serif text-3xl text-leaf">
              {locale === 'mn' ? "Хөвсгөл рүү аялал" : "How We Get to Khövsgöl"}
            </h2>
            <p className="font-body text-leaf/70 text-lg">
              {locale === 'mn'
                ? "Улаанбаатараас Хайчийн хөндий хүртэлх бүрэн аяллын гарын авлага одоо тусдаа хуудсанд байна."
                : "Our full arrival guide — flights, overland routes, coaches, railway, and the final leg to the resort — lives on a dedicated page."}
            </p>
            <a
              href={`${localePrefix}/getting-here`}
              className="inline-block px-8 py-4 bg-leaf text-main font-body hover:bg-leaf/90 transition-colors rounded"
            >
              {locale === 'mn' ? "Аяллын гарын авлага" : "Read the arrival guide"}
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl text-leaf text-center mb-12">
            {locale === 'mn' ? "Холбоо барих" : "Contact Information"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone className="w-10 h-10 text-leaf mx-auto mb-4" />
              <h4 className="font-serif text-lg text-leaf mb-2">
                {locale === 'mn' ? "Утас" : "Phone"}
              </h4>
              <p className="font-body text-leaf/70">+976 77 809010</p>
            </div>
            <div className="text-center">
              <Mail className="w-10 h-10 text-leaf mx-auto mb-4" />
              <h4 className="font-serif text-lg text-leaf mb-2">
                {locale === 'mn' ? "Имэйл" : "Email"}
              </h4>
              <p className="font-body text-leaf/70">hello@dalaieej.com</p>
            </div>
            <div className="text-center">
              <Clock className="w-10 h-10 text-leaf mx-auto mb-4" />
              <h4 className="font-serif text-lg text-leaf mb-2">
                {locale === 'mn' ? "Улирал" : "Season"}
              </h4>
              <p className="font-body text-leaf/70">
                {locale === 'mn' ? "5-р сар - 10-р сар" : "May - October"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-leaf">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-main mb-6">
            {locale === 'mn' ? "Тээврийн үйлчилгээ" : "Transfer Services"}
          </h2>
          <p className="font-body text-main/70 mb-8">
            {locale === 'mn' 
              ? "Бид Мөрөн хотоос resort хүртэлх тээврийн үйлчилгээ үзүүлдэг"
              : "We offer complimentary transfers from Murun Airport for bookings of 3+ nights"}
          </p>
          <a
            href={`${localePrefix}/booking`}
            className="inline-block px-8 py-4 bg-surface-alt text-leaf font-body text-lg hover:bg-white transition-colors rounded"
          >
            {locale === 'mn' ? "Захиалга хийх" : "Book Your Stay"}
          </a>
        </div>
      </section>
    </main>
  );
}
