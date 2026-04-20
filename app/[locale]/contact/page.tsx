"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Plane, Car, MapPin, Phone, Mail, Clock, Play } from "lucide-react";

export default function LocationPage() {
  const t = useTranslations();
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';

  const directions = [
    {
      icon: Plane,
      title: locale === 'mn' ? "Нисэх онгоцоор" : "By Air",
      steps: locale === 'mn' 
        ? ["Улаанбаатар → Мөрөн хот (1 цаг 15 минут)", "Мөрөн → Далай ээж ресорт (3 цаг машинаар)"]
        : ["Fly from Ulaanbaatar to Murun (1h 15m)", "Resort transfer from Murun Airport (3 hours)"]
    },
    {
      icon: Car,
      title: locale === 'mn' ? "Автомашинаар" : "By Road",
      steps: locale === 'mn'
        ? ["Улаанбаатар → Мөрөн (10-12 цаг)", "Мөрөн → Хатгал → Далай ээж ресорт (3 цаг)"]
        : ["Drive from Ulaanbaatar to Murun (10-12 hours)", "Continue to Khatgal and the resort (3 hours)"]
    },
  ];

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
              ? "Хөвсгөл нуурын зүүн эргийн Далай ээж ресортод тавтай морил"
              : "Your journey to Lake Khuvsgul begins here"}
          </motion.p>
        </div>
      </section>

      <section className="py-16 px-4 bg-surface-alt">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-serif text-3xl text-leaf text-center mb-8">
              {locale === 'mn' ? "Хөвсгөл рүү аялал" : "The Journey to Khuvsgul"}
            </h2>
            <div className="relative aspect-video bg-gradient-to-br from-leaf/20 to-leaf/40 rounded-2xl overflow-hidden shadow-xl group cursor-pointer">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-leaf/90 flex items-center justify-center mb-6 group-hover:bg-leaf transition-colors group-hover:scale-110 duration-300">
                  <Play className="w-10 h-10 text-main ml-1" fill="currentColor" />
                </div>
                <p className="font-serif text-2xl text-leaf mb-2">
                  {locale === 'mn' ? "Хөвсгөл рүү аялал" : "The Journey to Khuvsgul"}
                </p>
                <p className="font-body text-leaf/60 text-sm">
                  {locale === 'mn' ? "Далай ээж ресорт руу хүрэх замын видео" : "Experience the off-road adventure to our resort"}
                </p>
              </div>
              <div className="absolute bottom-4 right-4 bg-leaf/80 text-main px-3 py-1 rounded text-sm font-body">
                {locale === 'mn' ? "Видео тун удахгүй" : "Coming Soon"}
              </div>
            </div>
          </motion.div>

          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center mb-12">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-leaf/40 mx-auto mb-4" />
              <p className="font-body text-leaf/60">
                {locale === 'mn' ? "Google газрын зураг энд байрлана" : "Google Map Placeholder"}
              </p>
              <p className="font-body text-leaf/40 text-sm mt-2">
                50.4847° N, 100.1897° E
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {directions.map((direction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-sm"
              >
                <direction.icon className="w-12 h-12 text-leaf mb-4" />
                <h3 className="font-serif text-2xl text-leaf mb-4">{direction.title}</h3>
                <ul className="space-y-3">
                  {direction.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-3 font-body text-leaf/70">
                      <span className="bg-leaf text-main w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        {stepIndex + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
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
              <p className="font-body text-leaf/70">+976 7011 1234</p>
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
