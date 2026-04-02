"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Mountain, Wifi, Coffee, Bath, Flame, Users } from "lucide-react";

export default function CabinsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';

  const features = [
    { icon: Mountain, title: locale === 'mn' ? "Уулын харагдац" : "Mountain Views", desc: locale === 'mn' ? "Хөвсгөл нуурын гайхалтай харагдац" : "Stunning views of Lake Khuvsgul" },
    { icon: Users, title: locale === 'mn' ? "2-4 зочин" : "2-4 Guests", desc: locale === 'mn' ? "Хос эсвэл жижиг гэр бүлд тохиромжтой" : "Perfect for couples or small families" },
    { icon: Flame, title: locale === 'mn' ? "Модон зуух" : "Wood Fireplace", desc: locale === 'mn' ? "Уламжлалт дулаан" : "Traditional warmth and comfort" },
    { icon: Bath, title: locale === 'mn' ? "Хувийн угаалгын өрөө" : "Private Bathroom", desc: locale === 'mn' ? "Орчин үеийн тохилог" : "Modern amenities with luxury finishes" },
    { icon: Coffee, title: locale === 'mn' ? "Өглөөний цай" : "Morning Coffee", desc: locale === 'mn' ? "Өглөө бүр үнэгүй" : "Complimentary coffee service each morning" },
    { icon: Wifi, title: locale === 'mn' ? "Үнэгүй WiFi" : "Free WiFi", desc: locale === 'mn' ? "Интернэт холболт" : "Stay connected during your retreat" },
  ];

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-16">
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1920&auto=format&fit=crop&q=80"
            alt="Forest Cabin"
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
            {locale === 'mn' ? "Модон байшингууд" : "Forest Cabins"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-main/90 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {locale === 'mn' 
              ? "Байгалийн гоо үзэсгэлэнтэй хамт орчин үеийн тохилогтой модон байшингууд"
              : "Rustic elegance meets modern comfort in our handcrafted wooden cabins nestled among ancient pines"}
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
              {locale === 'mn' ? "Таны хоёр дахь гэр" : "Your Home in the Wilderness"}
            </h2>
            <p className="font-body text-leaf/70 text-lg max-w-3xl mx-auto">
              {locale === 'mn'
                ? "Манай модон байшингууд нь уламжлалт Монгол гар урлалыг орчин үеийн тохитой хослуулсан болно."
                : "Each cabin is a sanctuary of warmth and tranquility, where traditional Mongolian craftsmanship meets contemporary luxury."}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <img
              src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop&q=80"
              alt="Cabin interior"
              className="w-full h-80 object-cover rounded-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&auto=format&fit=crop&q=80"
              alt="Cabin exterior"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-leaf">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-main mb-6">
            {locale === 'mn' ? "Өрөө захиалах" : "Reserve Your Cabin"}
          </h2>
          <a
            href={`${localePrefix}/booking`}
            className="inline-block px-8 py-4 bg-surface-alt text-leaf font-body text-lg hover:bg-white transition-colors rounded"
          >
            {locale === 'mn' ? "Захиалга хийх" : "Book Now"}
          </a>
        </div>
      </section>
    </main>
  );
}
