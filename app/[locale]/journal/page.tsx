"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Calendar, ArrowRight } from "lucide-react";

export default function StoriesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';

  const stories = [
    {
      title: locale === 'mn' ? "Өвлийн шидэт Хөвсгөл" : "Winter Magic at Lake Khuvsgul",
      excerpt: locale === 'mn' ? "Хөвсгөл нуурын өвлийн гоо үзэсгэлэн, мөсөн дээрх адал явдал" : "Discover the enchanting beauty of frozen Lake Khuvsgul and winter adventures that await.",
      date: "January 15, 2026",
      image: "/images/gallery/the-resort/DBR_9425.webp",
      category: locale === 'mn' ? "Улирал" : "Seasons"
    },
    {
      title: locale === 'mn' ? "Нүүдэлчдийн соёл" : "The Nomadic Way of Life",
      excerpt: locale === 'mn' ? "Хөвсгөл нуурын эргийн нүүдэлчин малчдын өвөрмөц соёл" : "An intimate look at the reindeer herders who call these mountains home.",
      date: "December 28, 2025",
      image: "/images/gallery/adventures/DBR_5227.webp",
      category: locale === 'mn' ? "Соёл" : "Culture"
    },
    {
      title: locale === 'mn' ? "Орон нутгийн хоол" : "Farm to Table: Local Flavors",
      excerpt: locale === 'mn' ? "Манай тогооч орон нутгийн бүтээгдэхүүнээр хоол хийх тухай" : "How our chef transforms local ingredients into culinary masterpieces.",
      date: "December 10, 2025",
      image: "/images/gallery/restaurant/DBR_4944.webp",
      category: locale === 'mn' ? "Хоол" : "Cuisine"
    },
    {
      title: locale === 'mn' ? "Зуны баяр" : "Summer Celebrations",
      excerpt: locale === 'mn' ? "Наадам баярын үеийн онцгой арга хэмжээнүүд" : "Celebrating Naadam Festival traditions at Dalai Eej Resort.",
      date: "November 25, 2025",
      image: "/images/gallery/restaurant/DBR_6908.webp",
      category: locale === 'mn' ? "Арга хэмжээ" : "Events"
    },
    {
      title: locale === 'mn' ? "Шувуу ажиглах" : "Birdwatching Paradise",
      excerpt: locale === 'mn' ? "Хөвсгөлийн ховор шувууд" : "Rare and beautiful birds that make Lake Khuvsgul their home.",
      date: "November 10, 2025",
      image: "/images/gallery/the-resort/DBR_9430.webp",
      category: locale === 'mn' ? "Байгаль" : "Nature"
    },
    {
      title: locale === 'mn' ? "Одны тэнгэр" : "Stargazing Nights",
      excerpt: locale === 'mn' ? "Хөвсгөлийн цэлмэг тэнгэр дэх одод" : "Experience some of the darkest skies in the world at Dalai Eej.",
      date: "October 28, 2025",
      image: "/images/gallery/the-resort/DBR_9069.webp",
      category: locale === 'mn' ? "Туршлага" : "Experience"
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
            {locale === 'mn' ? "Далай ээж Stories" : "Dalai Eej Stories"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-main/90 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {locale === 'mn' 
              ? "Хөвсгөлийн түүх, соёл, байгалийн тухай өгүүлэл"
              : "Tales from the shores of Lake Khuvsgul—nature, culture, and the art of living well"}
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-4 bg-surface-alt">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-leaf text-main text-xs font-body px-3 py-1 rounded-full">
                    {story.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-leaf/50 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <span className="font-body">{story.date}</span>
                  </div>
                  <h3 className="font-serif text-xl text-leaf mb-3 group-hover:text-leaf/80 transition-colors">
                    {story.title}
                  </h3>
                  <p className="font-body text-leaf/60 text-sm mb-4">
                    {story.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 font-body text-sm text-leaf group-hover:gap-3 transition-all">
                    {locale === 'mn' ? "Дэлгэрэнгүй" : "Read More"}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-leaf">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-main mb-6">
            {locale === 'mn' ? "Цахим шуудан бүртгүүлэх" : "Subscribe to Our Newsletter"}
          </h2>
          <p className="font-body text-main/70 mb-8">
            {locale === 'mn' 
              ? "Шинэ мэдээ, онцгой санал авах"
              : "Stay updated with our latest stories and exclusive offers"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder={locale === 'mn' ? "Имэйл хаяг" : "Your email address"}
              className="flex-1 px-4 py-3 rounded font-body text-leaf focus:outline-none focus:ring-2 focus:ring-surface-alt"
            />
            <button className="px-6 py-3 bg-surface-alt text-leaf font-body hover:bg-white transition-colors rounded">
              {locale === 'mn' ? "Бүртгүүлэх" : "Subscribe"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
