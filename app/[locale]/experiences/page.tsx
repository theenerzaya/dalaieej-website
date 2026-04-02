"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Compass, Fish, Mountain, Tent, Camera, Users } from "lucide-react";

export default function ExperiencesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';

  const experiences = [
    { 
      icon: Fish, 
      title: locale === 'mn' ? "Загас барих" : "Fishing Expeditions",
      desc: locale === 'mn' ? "Хөвсгөл нуурын цэвэр усанд загас барих" : "Fly fishing in the pristine waters of Lake Khuvsgul",
      image: "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=600&auto=format&fit=crop&q=80"
    },
    { 
      icon: Mountain, 
      title: locale === 'mn' ? "Уулын аялал" : "Mountain Treks",
      desc: locale === 'mn' ? "Хөтөчтэй уулын аялал" : "Guided hikes through ancient forests and alpine meadows",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&auto=format&fit=crop&q=80"
    },
    { 
      icon: Tent, 
      title: locale === 'mn' ? "Нүүдлийн амьдрал" : "Nomadic Life",
      desc: locale === 'mn' ? "Нүүдэлчдийн гэрт айлчлах" : "Visit authentic nomadic families and their herds",
      image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600&auto=format&fit=crop&q=80"
    },
    { 
      icon: Compass, 
      title: locale === 'mn' ? "Морин аялал" : "Horseback Riding",
      desc: locale === 'mn' ? "Монгол морьтой аялах" : "Explore the steppe on Mongolian horses",
      image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&auto=format&fit=crop&q=80"
    },
    { 
      icon: Camera, 
      title: locale === 'mn' ? "Гэрэл зургийн аялал" : "Photography Tours",
      desc: locale === 'mn' ? "Үзэсгэлэнт газруудаар аялах" : "Capture stunning landscapes with expert guides",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=80"
    },
    { 
      icon: Users, 
      title: locale === 'mn' ? "Соёлын аялал" : "Cultural Tours",
      desc: locale === 'mn' ? "Орон нутгийн соёлтой танилцах" : "Discover local traditions, crafts, and ceremonies",
      image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&auto=format&fit=crop&q=80"
    },
  ];

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-16">
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1920&auto=format&fit=crop&q=80"
            alt="Experiences"
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
            {locale === 'mn' ? "Дурсамж Бүтээх" : "Roam the Wilds"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-main/90 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {locale === 'mn' 
              ? "Хөвсгөлийн байгаль, соёлын онцгой туршлагууд"
              : "Curated adventures that reveal the soul of Lake Khuvsgul and its timeless traditions"}
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
              {locale === 'mn' ? "Онцгой адал явдал" : "Signature Adventures"}
            </h2>
            <p className="font-body text-leaf/70 text-lg max-w-3xl mx-auto">
              {locale === 'mn'
                ? "Манай туршлагатай хөтчүүд таныг Хөвсгөлийн нууц газруудаар хөтөлнө."
                : "Our expert guides lead you through unforgettable journeys across land, water, and culture."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <exp.icon className="w-8 h-8 text-leaf mb-3" />
                  <h3 className="font-serif text-xl text-leaf mb-2">{exp.title}</h3>
                  <p className="font-body text-leaf/60">{exp.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-leaf">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-main mb-6">
            {locale === 'mn' ? "Тусгай хөтөлбөр" : "Custom Itineraries"}
          </h2>
          <p className="font-body text-main/70 mb-8">
            {locale === 'mn' 
              ? "Таны сонирхолд нийцсэн хувийн хөтөлбөр боловсруулна"
              : "Let us craft a personalized adventure tailored to your interests"}
          </p>
          <a
            href={`${localePrefix}/booking`}
            className="inline-block px-8 py-4 bg-surface-alt text-leaf font-body text-lg hover:bg-white transition-colors rounded"
          >
            {locale === 'mn' ? "Холбогдох" : "Plan Your Adventure"}
          </a>
        </div>
      </section>
    </main>
  );
}
