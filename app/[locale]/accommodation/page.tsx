/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";

export default function AccommodationPage() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';

  const accommodations = [
    {
      href: `${localePrefix}/cabins`,
      title: locale === 'mn' ? "Ойн байшингууд" : "Forest Cabins",
      subtitle: locale === 'mn' ? "Байгаль дунд" : "Nestled in Nature",
      description: locale === 'mn' 
        ? "Шинэсэн ойн дунд байрлах 6 тусдаа модон байшин. Галын зуухтай, хувийн террастай."
        : "Six private log cabins tucked into the larch forest. Each with a wood-burning stove and private terrace.",
      image: "/images/cabins/room-triple-traditional.webp",
      capacity: locale === 'mn' ? "2-4 зочин" : "2-4 Guests"
    },
    {
      href: `${localePrefix}/lodge`,
      title: locale === 'mn' ? "Гол байшин" : "The Lodge",
      subtitle: locale === 'mn' ? "Нуурын эрэг дээр" : "On the Lakeshore",
      description: locale === 'mn' 
        ? "Хөвсгөл нуурын эрэг дээрх түүхэн гол байшин. Нуурын харагдац бүхий өрөөнүүд."
        : "Our historic main lodge overlooking the lake. Rooms with panoramic views of Lake Khövsgöl.",
      image: "/images/gallery/the-resort/DBR_8136.webp",
      capacity: locale === 'mn' ? "2-3 зочин" : "2-3 Guests"
    }
  ];

  return (
    <main className="min-h-screen bg-surface pt-24 md:pt-16">
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <img
            src="/images/cabins/hero-our-rooms.webp"
            alt="Accommodation"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-body text-main/70 text-sm tracking-[0.3em] uppercase mb-6"
          >
            {locale === 'mn' ? "Байрлах сонголтууд" : "Accommodation"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl text-main mb-6"
          >
            {locale === 'mn' ? "Тухтай Амрах" : "Find Your Sanctuary"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-main/80 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {locale === 'mn' 
              ? "Хөвсгөл нуурын эргэнд байгалийн гоо үзэсгэлэнгийн дунд амрах"
              : "Where the forest meets the lake, find your perfect retreat"}
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {accommodations.map((accommodation, index) => (
              <motion.a
                key={index}
                href={accommodation.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-6">
                  <img
                    src={accommodation.image}
                    alt={accommodation.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-surface/90 text-water-deep px-4 py-2 rounded font-body text-sm">
                    {accommodation.capacity}
                  </div>
                </div>
                <p className="font-body text-leaf text-sm tracking-[0.15em] uppercase mb-2">
                  {accommodation.subtitle}
                </p>
                <h2 className="font-serif text-3xl text-ink mb-4 group-hover:text-water-deep transition-colors">
                  {accommodation.title}
                </h2>
                <p className="font-body text-ink/70 mb-4 leading-relaxed">
                  {accommodation.description}
                </p>
                <span className="inline-flex items-center gap-2 font-body text-water-deep font-medium group-hover:gap-4 transition-all">
                  {locale === 'mn' ? "Дэлгэрэнгүй үзэх" : "View Details"}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-leaf/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
              {locale === 'mn' ? "Таны хүлээж байгаа зүйлс" : "What Awaits You"}
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { en: "Lake Views", mn: "Нуурын харагдац" },
              { en: "Private Terraces", mn: "Хувийн террас" },
              { en: "Wood Stoves", mn: "Галын зуух" },
              { en: "Daily Housekeeping", mn: "Өдөр бүрийн цэвэрлэгээ" }
            ].map((amenity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white rounded-lg shadow-sm"
              >
                <p className="font-body text-ink font-medium">
                  {locale === 'mn' ? amenity.mn : amenity.en}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-ink">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-main mb-6">
            {locale === 'mn' ? "Захиалга хийх" : "Reserve Your Stay"}
          </h2>
          <p className="font-body text-main/70 mb-10">
            {locale === 'mn' 
              ? "Хөвсгөл нуурын эргэнд тантай уулзахыг хүлээж байна"
              : "Experience the tranquility of Lake Khövsgöl"}
          </p>
          <a
            href={`${localePrefix}/booking`}
            className="inline-block px-10 py-4 bg-surface text-water-deep font-body font-semibold tracking-wide hover:bg-white transition-colors rounded"
          >
            {locale === 'mn' ? "Захиалах" : "Book Now"}
          </a>
        </div>
      </section>
    </main>
  );
}
