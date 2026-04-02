"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Heart, Star, Users, Award } from "lucide-react";

export default function TheFamilyPage() {
  const t = useTranslations();
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';

  const values = [
    { icon: Heart, title: locale === 'mn' ? "Хүндлэл" : "Hospitality", desc: locale === 'mn' ? "Монголын уламжлалт зочломтгой зан" : "Traditional Mongolian warmth and welcome" },
    { icon: Star, title: locale === 'mn' ? "Чанар" : "Excellence", desc: locale === 'mn' ? "Дэлхийн түвшний үйлчилгээ" : "World-class service in every detail" },
    { icon: Users, title: locale === 'mn' ? "Гэр бүл" : "Family", desc: locale === 'mn' ? "Гурван үеийн өв уламжлал" : "Three generations of heritage" },
    { icon: Award, title: locale === 'mn' ? "Тогтвортой байдал" : "Sustainability", desc: locale === 'mn' ? "Байгаль орчныг хамгаалах" : "Protecting our natural heritage" },
  ];

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-16">
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&auto=format&fit=crop&q=80"
            alt="The Family"
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
            {locale === 'mn' ? "Манай гэр бүл" : "The Family"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-main/90 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {locale === 'mn' 
              ? "Гурван үеийн өв уламжлал, нэг алсын хараа"
              : "Three generations united by a single vision—to share the magic of Lake Khuvsgul"}
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-4 bg-surface-alt">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-4xl text-leaf mb-6">
                {locale === 'mn' ? "Бидний түүх" : "Our Story"}
              </h2>
              <p className="font-body text-leaf/70 mb-4">
                {locale === 'mn'
                  ? "Далай Ээж Resort нь гэр бүлийн мөрөөдлөөс эхэлсэн. Манай өвөг дээдэс энэ газарт олон үеийн турш амьдарч, нутгийн үзэсгэлэнг хамгаалж ирсэн."
                  : "Dalai Eej Resort began as a family dream. For generations, our ancestors called these shores home, guardians of this pristine wilderness."}
              </p>
              <p className="font-body text-leaf/70">
                {locale === 'mn'
                  ? "Өнөөдөр бид энэхүү өв уламжлалыг дэлхийн аялагчидтай хуваалцахаар зорьж байна—орчин үеийн тохитой, уламжлалт зочломтгой байдлаар."
                  : "Today, we continue this legacy by welcoming travelers from around the world, offering modern comforts while honoring the traditions that make this place special."}
              </p>
            </motion.div>
            <motion.img
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80"
              alt="Family heritage"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm text-center"
              >
                <value.icon className="w-10 h-10 text-leaf mx-auto mb-4" />
                <h3 className="font-serif text-lg text-leaf mb-2">{value.title}</h3>
                <p className="font-body text-leaf/60 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-2xl md:text-3xl text-leaf italic mb-8"
          >
            {locale === 'mn'
              ? '"Бид зочдоо гэр бүлийнхээ гишүүн шиг хүлээн авдаг. Энэ бол манай уламжлал."'
              : '"We welcome every guest as we would family. This is our tradition, our way of life."'}
          </motion.blockquote>
          <p className="font-body text-leaf/60">
            {locale === 'mn' ? "— Үндэсний гэр бүл" : "— The Founding Family"}
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-leaf">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-main mb-6">
            {locale === 'mn' ? "Бидэнтэй нэгдээрэй" : "Join Our Family"}
          </h2>
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
