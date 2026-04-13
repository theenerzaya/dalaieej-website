"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// STRATEGY UPDATE:
// 1. Erdenet 50th: Targeted local intent.
// 2. Early Bird: Urgency for February/March traffic.
// 3. Workation: New "Long Stay" offer to increase occupancy length.
// 4. June Couples: Fills the low-occupancy dates before the school rush.

const offers = [
  {
    id: 1,
    en: { 
      tag: "Limited Time",
      title: "Erdenet 50th Jubilee", 
      description: "Exclusive 50th Anniversary benefits for Erdenet residents." 
    },
    mn: { 
      tag: "Тусгай Санал",
      title: "Эрдэнэт 50 Жил", 
      description: "Эрдэнэт хотын оршин суугчдад зориулсан баярын тусгай хөнгөлөлт." 
    },
  image: "/images/specialoffers/erdenet-jubilee.jpg"
  },
  {
    id: 2,
    en: { 
      tag: "Best Value",
      title: "Summer 2026 Early Bird", 
      description: "Book before March 31 to lock in 2025 rates." 
    },
    mn: { 
      tag: "Хамгийн Ашигтай",
      title: "Зун 2026 Эрт Захиалга", 
      description: "3-р сарын 31-ээс өмнө захиалаад 2025 оны үнээр амраарай." 
    },
  image: "images/specialoffers/early-bird.jpg"
  },
  {
    id: 3,
    en: { 
      tag: "Most Popular", // "Most Popular" builds trust for families
      title: "Ultimate Family Getaway", 
      description: "Spacious cabins & daily kids' activities included." 
    },
    mn: { 
      tag: "Эрэлттэй",
      title: "Гэр Бүлийн Аялал", 
      description: "Гэр бүлийн том байшин + хүүхдийн тоглоомын хөтөлбөр." 
    },
    image: "/images/specialoffers/family-getaway.jpg"
  },
  {
    id: 4,
    en: { 
      tag: "June Special",
      title: "Shoulder Season Escape", 
      description: "Enjoy the peace of the lake before the July rush." 
    },
    mn: { 
      tag: "6-р Сарын Санал",
      title: "Намуухан Нуурын Эрэгт", 
      description: "7-р сарын их хөл хөдөлгөөнөөс урьтаж тухлан амраарай." 
    },
  image: "/images/specialoffers/shoulder-season.jpg"
  }
];

export default function OffersCarousel() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';

  const filtered = locale === 'en' ? offers.filter(o => o.id === 3) : offers;
  const visibleOffers = filtered.length > 0 ? filtered : offers;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % visibleOffers.length);
    }, 7000);
  }, [visibleOffers.length]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isPaused) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isPaused, startAutoPlay, stopAutoPlay]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    stopAutoPlay();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    if (!isPaused) {
      startAutoPlay();
    }
  };

  const currentOffer = visibleOffers[activeIndex];
  const content = locale === 'mn' ? currentOffer.mn : currentOffer.en;

  return (
    <section className="bg-main py-0">
      <div 
        className="max-w-7xl mx-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
          {/* Image Side */}
          <div className="relative h-[350px] lg:h-auto overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentOffer.id}
                src={currentOffer.image}
                alt={content.title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Mobile Overlay Text (Optional visibility boost) */}
            <div className="absolute inset-0 bg-black/10 lg:hidden" />
          </div>

          {/* Content Side */}
          <div className="flex flex-col items-center justify-center px-8 lg:px-16 py-16 lg:py-0 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentOffer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col items-center"
              >
                <p className="text-xs tracking-[0.3em] uppercase text-leaf/70 mb-6">
                  {content.tag}
                </p>

                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-leaf mb-6 font-light leading-tight">
                  {content.title}
                </h3>

                <p className="font-body text-leaf/60 text-base mb-10 max-w-md mx-auto">
                  {content.description}
                </p>

                <Link
                  href=/*{`${localePrefix}/offers`}*/{`${localePrefix}/#`}
                  className="group inline-flex items-center gap-2 text-sm tracking-widest uppercase text-leaf border-b border-leaf/30 pb-1 hover:text-leaf/70 hover:border-leaf/70 transition-all duration-300"
                >
                  <span>{locale === 'mn' ? "Дэлгэрэнгүй" : "View Offer"}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="flex gap-3 mt-16">
              {visibleOffers.map((offer, index) => (
                <button
                  key={offer.id}
                  onClick={() => handleDotClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? "bg-leaf w-6" 
                      : "bg-leaf/20 hover:bg-leaf/40"
                  }`}
                  aria-label={`Go to offer ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}