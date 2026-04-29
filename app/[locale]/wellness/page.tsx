/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Flower2, Droplets, Wind, Moon, Sun, Heart } from "lucide-react";

export default function WellnessPage() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';

  const treatments = [
    { icon: Flower2, title: locale === 'mn' ? "Массаж" : "Massage Therapy", desc: locale === 'mn' ? "Уламжлалт болон орчин үеийн массаж" : "Traditional and contemporary massage techniques" },
    { icon: Droplets, title: locale === 'mn' ? "Халуун усан сан" : "Thermal Baths", desc: locale === 'mn' ? "Эрдэс усан сан" : "Mineral-rich waters for deep relaxation" },
    { icon: Wind, title: locale === 'mn' ? "Йога" : "Yoga Sessions", desc: locale === 'mn' ? "Өглөө, орой йога" : "Morning and sunset yoga with lake views" },
    { icon: Moon, title: locale === 'mn' ? "Бясалгал" : "Meditation", desc: locale === 'mn' ? "Удирдамжтай бясалгал" : "Guided meditation in nature" },
    { icon: Sun, title: locale === 'mn' ? "Саун" : "Sauna & Steam", desc: locale === 'mn' ? "Орос саун, уурын өрөө" : "Russian banya and steam rooms" },
    { icon: Heart, title: locale === 'mn' ? "Эрүүл мэнд" : "Wellness Programs", desc: locale === 'mn' ? "Бүрэн эрүүл мэндийн хөтөлбөр" : "Multi-day detox and renewal packages" },
  ];

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-16">
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&auto=format&fit=crop&q=80"
            alt="Wellness Spa"
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
            {locale === 'mn' ? "Байгальд Уусах" : "Restore Your Rhythm"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-main/90 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {locale === 'mn' 
              ? "Байгалийн тайван орчинд бие сэтгэлийг сэргээх"
              : "Restore mind, body, and spirit in the tranquility of nature's embrace"}
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
              {locale === 'mn' ? "Спа үйлчилгээ" : "Spa Treatments"}
            </h2>
            <p className="font-body text-leaf/70 text-lg max-w-3xl mx-auto">
              {locale === 'mn'
                ? "Уламжлалт Монгол болон орчин үеийн эрүүл мэндийн үйлчилгээнүүд."
                : "Drawing from traditional Mongolian healing practices and modern wellness techniques."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {treatments.map((treatment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <treatment.icon className="w-12 h-12 text-leaf mx-auto mb-4" />
                <h3 className="font-serif text-xl text-leaf mb-2">{treatment.title}</h3>
                <p className="font-body text-leaf/60">{treatment.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80"
              alt="Spa treatment"
              className="w-full h-96 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-serif text-3xl text-leaf mb-6">
                {locale === 'mn' ? "Байгалийн эмчилгээ" : "Nature's Healing Power"}
              </h3>
              <p className="font-body text-leaf/70 mb-6">
                {locale === 'mn' 
                  ? "Хөвсгөл нуурын цэвэр агаар, тайван орчин нь таны эрүүл мэндэд эерэг нөлөө үзүүлнэ. Манай спа нь энэхүү байгалийн гоо сайханыг ашигладаг."
                  : "The pristine air and serene environment of Lake Khuvsgul naturally promotes healing and renewal. Our spa harnesses this natural beauty to enhance every treatment."}
              </p>
              <p className="font-body text-leaf/70">
                {locale === 'mn' 
                  ? "Бүх эмчилгээ нь орон нутгийн ургамал, эрдэс бодисыг ашигладаг."
                  : "All treatments incorporate locally sourced herbs, minerals, and therapeutic elements."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-leaf">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-main mb-6">
            {locale === 'mn' ? "Цаг захиалах" : "Book a Treatment"}
          </h2>
          <a
            href={`${localePrefix}/booking`}
            className="inline-block px-8 py-4 bg-surface-alt text-leaf font-body text-lg hover:bg-white transition-colors rounded"
          >
            {locale === 'mn' ? "Захиалах" : "Reserve Now"}
          </a>
        </div>
      </section>
    </main>
  );
}
