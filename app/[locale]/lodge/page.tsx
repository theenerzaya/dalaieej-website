/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Home, Users, Utensils, Flame, Mountain, Star } from "lucide-react";

export default function LodgePage() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';

  const features = [
    { icon: Home, title: locale === 'mn' ? "Өргөн зочны өрөө" : "Grand Living Room", desc: locale === 'mn' ? "20 хүнд зориулсан зочны өрөө" : "Spacious gathering area for up to 20 guests" },
    { icon: Users, title: locale === 'mn' ? "8 унтлагын өрөө" : "8 Bedrooms", desc: locale === 'mn' ? "Тус тусдаа угаалгын өрөөтэй" : "Each with private en-suite bathroom" },
    { icon: Utensils, title: locale === 'mn' ? "Бүрэн тоноглогдсон гал тогоо" : "Full Kitchen", desc: locale === 'mn' ? "Мэргэжлийн тоног төхөөрөмж" : "Professional-grade equipment for private dining" },
    { icon: Flame, title: locale === 'mn' ? "2 зуух" : "Two Fireplaces", desc: locale === 'mn' ? "Зочны болон хоолны өрөөнд" : "In living room and dining area" },
    { icon: Mountain, title: locale === 'mn' ? "Панорама харагдац" : "Panoramic Views", desc: locale === 'mn' ? "Нуур болон уулын харагдац" : "Unobstructed lake and mountain vistas" },
    { icon: Star, title: locale === 'mn' ? "Хувийн үйлчилгээ" : "Private Staff", desc: locale === 'mn' ? "Зориулалтын үйлчлэгч" : "Dedicated butler and housekeeping" },
  ];

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-16">
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/gallery/the-resort/DBR_7025.webp"
            alt="Main Lodge"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-leaf/60 via-leaf/40 to-leaf/80" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl text-main mb-6"
          >
            {locale === 'mn' ? "Гол байшин" : "The Main Lodge"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-main/90 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {locale === 'mn' 
              ? "16 хүртэл зочин багтах тансаг зэрэглэлийн байшин, онцгой арга хэмжээ болон гэр бүлийн цугларалтанд тохиромжтой"
              : "An exclusive retreat for groups up to 16, perfect for celebrations, reunions, and extraordinary gatherings"}
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-4 bg-surface-alt">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-leaf mb-6">
              {locale === 'mn' ? "Онцгой туршлага" : "An Exclusive Experience"}
            </h2>
            <p className="font-body text-leaf/70 text-lg max-w-3xl mx-auto">
              {locale === 'mn'
                ? "Гол байшин нь бүх өрөөг хамарсан захиалгаар хувийн амралтын газар болно."
                : "The Lodge offers complete privacy with exclusive full-house bookings, ensuring an intimate and personalized retreat."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className="w-10 h-10 text-leaf mb-4" />
                <h3 className="font-serif text-xl text-leaf mb-2">{feature.title}</h3>
                <p className="font-body text-leaf/60">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <img
              src="/images/gallery/accommodations/DBR_4872.webp"
              alt="Lodge living room"
              className="w-full h-64 object-cover rounded-lg md:col-span-2"
            />
            <img
              src="/images/rooms/superior-cabin/03.webp"
              alt="Lodge bedroom"
              className="w-full h-64 object-cover rounded-lg"
            />
            <img
              src="/images/gallery/restaurant/DBR_4946.webp"
              alt="Lodge dining"
              className="w-full h-64 object-cover rounded-lg"
            />
            <img
              src="/images/gallery/the-resort/DBR_7684.webp"
              alt="Lodge view"
              className="w-full h-64 object-cover rounded-lg md:col-span-2"
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-leaf">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-main mb-6">
            {locale === 'mn' ? "Хувийн захиалга" : "Private Bookings"}
          </h2>
          <p className="font-body text-main/70 mb-8">
            {locale === 'mn' 
              ? "Бүтэн байшин захиалах үнийн санал авах"
              : "Contact us for exclusive full-lodge rental rates"}
          </p>
          <a
            href={`${localePrefix}/booking`}
            className="inline-block px-8 py-4 bg-surface-alt text-leaf font-body text-lg hover:bg-white transition-colors rounded"
          >
            {locale === 'mn' ? "Холбогдох" : "Inquire Now"}
          </a>
        </div>
      </section>
    </main>
  );
}
