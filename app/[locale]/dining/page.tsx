/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Utensils, Leaf, Clock, Wine, ChefHat, Heart } from "lucide-react";

export default function RestaurantPage() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';

  const features = [
    { icon: ChefHat, title: locale === 'mn' ? "Мэргэжлийн тогооч" : "Executive Chef", desc: locale === 'mn' ? "Олон улсын туршлагатай" : "Internationally trained culinary artist" },
    { icon: Leaf, title: locale === 'mn' ? "Орон нутгийн бүтээгдэхүүн" : "Local Ingredients", desc: locale === 'mn' ? "Шинэ, органик хүнс" : "Fresh, organic produce from local farms" },
    { icon: Utensils, title: locale === 'mn' ? "Монгол хоол" : "Mongolian Cuisine", desc: locale === 'mn' ? "Уламжлалт амт" : "Traditional flavors with modern presentation" },
    { icon: Wine, title: locale === 'mn' ? "Дарсны сан" : "Wine Selection", desc: locale === 'mn' ? "Дэлхийн дарс" : "Curated wines from around the world" },
    { icon: Clock, title: locale === 'mn' ? "Өдөр бүр нээлттэй" : "Open Daily", desc: locale === 'mn' ? "Өглөөний цай, үдийн хоол, оройн хоол" : "Breakfast, lunch, and dinner service" },
    { icon: Heart, title: locale === 'mn' ? "Тусгай хоол" : "Dietary Options", desc: locale === 'mn' ? "Вегетариан, веган сонголт" : "Vegetarian, vegan, and allergy-friendly" },
  ];

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-16">
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&auto=format&fit=crop&q=80"
            alt="Restaurant"
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
            {locale === 'mn' ? "Амтлаг Аялал" : "A Taste of the North"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-main/90 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {locale === 'mn' 
              ? "Монголын уламжлалт амтыг орчин үеийн хоол хийхтэй хослуулсан"
              : "Where Mongolian culinary heritage meets contemporary gastronomy"}
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
              {locale === 'mn' ? "Хоолны туршлага" : "A Culinary Journey"}
            </h2>
            <p className="font-body text-leaf/70 text-lg max-w-3xl mx-auto">
              {locale === 'mn'
                ? "Манай ресторан нь Хөвсгөлийн байгалийн бүтээгдэхүүнийг ашиглан дэлхийн түвшний хоол бэлтгэдэг."
                : "Our restaurant celebrates the bounty of Lake Khuvsgul, crafting memorable dishes from the freshest local ingredients."}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-serif text-3xl text-leaf mb-6">
                {locale === 'mn' ? "Өглөөний цай" : "Breakfast"}
              </h3>
              <p className="font-body text-leaf/70 mb-4">
                {locale === 'mn' 
                  ? "7:00 - 10:30. Шинэхэн бэлтгэсэн өглөөний хоол, орон нутгийн сүү, тараг, талх"
                  : "7:00am - 10:30am. Start your day with freshly prepared dishes, local dairy, and artisan breads."}
              </p>
              <h3 className="font-serif text-3xl text-leaf mb-6 mt-8">
                {locale === 'mn' ? "Оройн хоол" : "Dinner"}
              </h3>
              <p className="font-body text-leaf/70">
                {locale === 'mn' 
                  ? "18:00 - 22:00. Олон үеийн хоол, дарсны хослол, нуурын харагдац"
                  : "6:00pm - 10:00pm. Multi-course dining experience with wine pairings and lake views."}
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"
              alt="Cuisine"
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-leaf">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-main mb-6">
            {locale === 'mn' ? "Ширээ захиалах" : "Reserve a Table"}
          </h2>
          <a
            href={`${localePrefix}/booking`}
            className="inline-block px-8 py-4 bg-surface-alt text-leaf font-body text-lg hover:bg-white transition-colors rounded"
          >
            {locale === 'mn' ? "Захиалах" : "Make Reservation"}
          </a>
        </div>
      </section>
    </main>
  );
}
