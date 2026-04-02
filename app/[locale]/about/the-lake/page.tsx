"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Droplets, Mountain, Fish, TreePine, Snowflake, Sun } from "lucide-react";

export default function TheLakePage() {
  const t = useTranslations();
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';

  const facts = [
    { icon: Droplets, label: locale === 'mn' ? "Гүн" : "Depth", value: "262m", desc: locale === 'mn' ? "Хамгийн гүн цэг" : "At deepest point" },
    { icon: Mountain, label: locale === 'mn' ? "Өндөр" : "Elevation", value: "1,645m", desc: locale === 'mn' ? "Далайн түвшнээс" : "Above sea level" },
    { icon: Fish, label: locale === 'mn' ? "Төрөл зүйл" : "Species", value: "9+", desc: locale === 'mn' ? "Загасны төрөл" : "Native fish species" },
    { icon: TreePine, label: locale === 'mn' ? "Ой" : "Forest", value: "70%", desc: locale === 'mn' ? "Ойн хамралт" : "Surrounding coverage" },
  ];

  const seasons = [
    { icon: Sun, title: locale === 'mn' ? "Зун (6-8 сар)" : "Summer (Jun-Aug)", desc: locale === 'mn' ? "Загас барих, морин аялал, усан спорт" : "Fishing, horseback riding, water activities" },
    { icon: Snowflake, title: locale === 'mn' ? "Өвөл (12-2 сар)" : "Winter (Dec-Feb)", desc: locale === 'mn' ? "Мөсөн дээр жолоодох, мөсөн загас барих" : "Ice driving, ice fishing, frozen lake walks" },
  ];

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-16">
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&auto=format&fit=crop&q=80"
            alt="Lake Khuvsgul"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-leaf/40 via-transparent to-leaf/60" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl text-main mb-6"
          >
            {locale === 'mn' ? "Хөвсгөл нуур" : "The Lake"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-main/90 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {locale === 'mn' 
              ? "Монголын далай—дэлхийн хамгийн цэвэр нуурнуудын нэг"
              : "The 'Younger Sister of the Sea'—one of the world's last pristine freshwater lakes"}
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
              {locale === 'mn' ? "Нуурын тухай" : "About the Lake"}
            </h2>
            <p className="font-body text-leaf/70 text-lg max-w-3xl mx-auto">
              {locale === 'mn'
                ? "Хөвсгөл нуур нь Азийн хоёр дахь том цэнгэг устай нуур бөгөөд дэлхийн нийт цэнгэг усны нөөцийн 2%-ийг агуулдаг."
                : "Lake Khuvsgul is Asia's second-largest freshwater lake by volume, holding nearly 2% of the world's fresh surface water."}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {facts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm text-center"
              >
                <fact.icon className="w-8 h-8 text-leaf mx-auto mb-3" />
                <p className="font-serif text-3xl text-leaf mb-1">{fact.value}</p>
                <p className="font-body text-leaf font-medium text-sm">{fact.label}</p>
                <p className="font-body text-leaf/50 text-xs mt-1">{fact.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-3xl text-leaf mb-6">
                {locale === 'mn' ? "Байгалийн гайхамшиг" : "A Natural Wonder"}
              </h2>
              <p className="font-body text-leaf/70 mb-4">
                {locale === 'mn'
                  ? "136 км урт, 262 м гүн энэ нуур нь 2 сая жилийн настай. Түүний эргийг эрт үеийн шилмүүст ой, уулс хүрээлдэг."
                  : "Stretching 136 kilometers long and plunging to depths of 262 meters, this 2-million-year-old lake is surrounded by ancient taiga forests and rugged mountains."}
              </p>
              <p className="font-body text-leaf/70">
                {locale === 'mn'
                  ? "Усны ил тод байдал нь 24 м хүртэл хүрдэг бөгөөд энэ нь дэлхийн хамгийн цэвэр нуурнуудын нэг болгодог."
                  : "The water clarity reaches up to 24 meters, making it one of the clearest lakes on Earth—so pure you can drink directly from its shores."}
              </p>
            </motion.div>
            <motion.img
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=80"
              alt="Lake scenery"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-surface-alt">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl text-leaf text-center mb-12">
            {locale === 'mn' ? "Улирлын хөтөлбөр" : "Seasonal Experiences"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {seasons.map((season, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-sm"
              >
                <season.icon className="w-10 h-10 text-leaf mb-4" />
                <h3 className="font-serif text-xl text-leaf mb-2">{season.title}</h3>
                <p className="font-body text-leaf/60">{season.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-leaf">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-main mb-6">
            {locale === 'mn' ? "Нуурыг үзэх" : "Experience the Lake"}
          </h2>
          <a
            href={`${localePrefix}/experiences`}
            className="inline-block px-8 py-4 bg-surface-alt text-leaf font-body text-lg hover:bg-white transition-colors rounded"
          >
            {locale === 'mn' ? "Туршлагууд үзэх" : "View Experiences"}
          </a>
        </div>
      </section>
    </main>
  );
}
