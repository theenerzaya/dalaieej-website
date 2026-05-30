/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Heart, Users, Briefcase, PartyPopper, Camera, Music } from "lucide-react";

export default function CelebratePage() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';

  const events = [
    { icon: Heart, title: locale === 'mn' ? "Хурим" : "Weddings", desc: locale === 'mn' ? "Онцгой хуримын өдөр" : "Intimate ceremonies with breathtaking lake views" },
    { icon: PartyPopper, title: locale === 'mn' ? "Төрсөн өдөр" : "Celebrations", desc: locale === 'mn' ? "Онцгой баяр ёслол" : "Birthday parties, anniversaries, and milestones" },
    { icon: Briefcase, title: locale === 'mn' ? "Корпорейт арга хэмжээ" : "Corporate Retreats", desc: locale === 'mn' ? "Баг бүрдүүлэх арга хэмжээ" : "Team building and executive meetings" },
    { icon: Users, title: locale === 'mn' ? "Гэр бүлийн цугларалт" : "Family Reunions", desc: locale === 'mn' ? "Олон үеийн уулзалт" : "Multi-generational gatherings in nature" },
    { icon: Camera, title: locale === 'mn' ? "Фото сешн" : "Photo Shoots", desc: locale === 'mn' ? "Мэргэжлийн гэрэл зураг" : "Professional photography in stunning locations" },
    { icon: Music, title: locale === 'mn' ? "Хувийн үйл явдал" : "Private Events", desc: locale === 'mn' ? "Тусгай захиалгат арга хэмжээ" : "Customised events for any occasion" },
  ];

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-16">
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/gallery/restaurant/DBR_7786.webp"
            alt="Celebration venue"
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
            {locale === 'mn' ? "Уулзалт & Баяр" : "Meet & Celebrate"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-main/90 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {locale === 'mn' 
              ? "Онцгой мөчүүдийг үл мартагдах дурсамж болгох"
              : "Transform special moments into unforgettable memories in an extraordinary setting"}
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
              {locale === 'mn' ? "Арга хэмжээний төрлүүд" : "Event Occasions"}
            </h2>
            <p className="font-body text-leaf/70 text-lg max-w-3xl mx-auto">
              {locale === 'mn'
                ? "Хөвсгөл нуурын эрэг дээр таны онцгой арга хэмжээг зохион байгуулна."
                : "From intimate gatherings to grand celebrations, we create bespoke experiences on the shores of Lake Khövsgöl."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <event.icon className="w-12 h-12 text-leaf mx-auto mb-4" />
                <h3 className="font-serif text-xl text-leaf mb-2">{event.title}</h3>
                <p className="font-body text-leaf/60">{event.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-serif text-3xl text-leaf mb-6">
                {locale === 'mn' ? "Бидний үйлчилгээ" : "Our Services"}
              </h3>
              <ul className="space-y-4 font-body text-leaf/70">
                <li className="flex items-start gap-3">
                  <span className="text-leaf">•</span>
                  {locale === 'mn' ? "Арга хэмжээний менежер" : "Dedicated event coordinator"}
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-leaf">•</span>
                  {locale === 'mn' ? "Тусгай цэс боловсруулалт" : "Custom menu design with our executive chef"}
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-leaf">•</span>
                  {locale === 'mn' ? "Чимэглэл, цэцэг" : "Floral arrangements and décor"}
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-leaf">•</span>
                  {locale === 'mn' ? "Дуу хөгжим, гэрэлтүүлэг" : "Audio-visual equipment and lighting"}
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-leaf">•</span>
                  {locale === 'mn' ? "Тээвэр зохион байгуулалт" : "Guest transportation coordination"}
                </li>
              </ul>
            </div>
            <img
              src="/images/gallery/restaurant/DBR_4932.webp"
              alt="Event setup"
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-leaf">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-main mb-6">
            {locale === 'mn' ? "Арга хэмжээ төлөвлөх" : "Plan Your Event"}
          </h2>
          <p className="font-body text-main/70 mb-8">
            {locale === 'mn' 
              ? "Манай арга хэмжээний багтай холбогдоорой"
              : "Connect with our events team to begin planning your perfect occasion"}
          </p>
          <a
            href={`${localePrefix}/booking`}
            className="inline-block px-8 py-4 bg-surface-alt text-leaf font-body text-lg hover:bg-white transition-colors rounded"
          >
            {locale === 'mn' ? "Холбогдох" : "Get in Touch"}
          </a>
        </div>
      </section>
    </main>
  );
}
