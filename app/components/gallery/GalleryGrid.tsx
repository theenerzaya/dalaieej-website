"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { X } from "lucide-react";

export default function GalleryGrid() {
  const locale = useLocale();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filters = [
    { id: "all", label: locale === 'mn' ? "Бүгд" : "All" },
    { id: "resort", label: locale === 'mn' ? "Ресорт" : "The Resort" },
    { id: "rooms", label: locale === 'mn' ? "Байр" : "Accommodations" },
    { id: "dining", label: locale === 'mn' ? "Хоол" : "Culinary" },
    { id: "wellness", label: locale === 'mn' ? "Эрүүл мэнд" : "Wellness" },
    { id: "adventures", label: locale === 'mn' ? "Адал явдал" : "Adventures" },
    { id: "landscape", label: locale === 'mn' ? "Нуур" : "The Lake" },
  ];

  const images = [
    { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80", category: "landscape", alt: "Lake Khuvsgul panoramic view" },
    { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80", category: "rooms", alt: "Luxury cabin bedroom" },
    { src: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&auto=format&fit=crop&q=80", category: "adventures", alt: "Cultural experience" },
    { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=80", category: "landscape", alt: "Mountain reflection on lake" },
    { src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80", category: "resort", alt: "Resort main building" },
    { src: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&auto=format&fit=crop&q=80", category: "adventures", alt: "Horseback riding" },
    { src: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=800&auto=format&fit=crop&q=80", category: "landscape", alt: "Winter landscape" },
    { src: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=80", category: "dining", alt: "Fine dining setup" },
    { src: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&auto=format&fit=crop&q=80", category: "adventures", alt: "Horse riding excursion" },
    { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80", category: "landscape", alt: "Night sky over lake" },
    { src: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop&q=80", category: "rooms", alt: "Cabin interior view" },
    { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80", category: "dining", alt: "Local cuisine" },
    { src: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80", category: "landscape", alt: "Sunset over Khuvsgul" },
    { src: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&auto=format&fit=crop&q=80", category: "rooms", alt: "Forest cabin exterior" },
    { src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80", category: "wellness", alt: "Spa treatment" },
    { src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80", category: "resort", alt: "Resort exterior" },
    { src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80", category: "wellness", alt: "Relaxation area" },
  ];

  const filteredImages = activeFilter === "all" 
    ? images 
    : images.filter(img => img.category === activeFilter);

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-16">
      <section className="py-12 px-4 bg-ink">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-5xl text-main mb-4"
          >
            {locale === 'mn' ? "Дурсамж Гэрэл Зурагт" : "Visual Journey"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-body text-main/70 max-w-2xl mx-auto"
          >
            {locale === 'mn' 
              ? "Хөвсгөлийн хэмнэлд автаарай"
              : "Immerse yourself in the rhythm of Khuvsgul."}
          </motion.p>
        </div>
      </section>

      <section className="py-8 px-4 bg-surface sticky top-16 z-40">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-5 py-2 font-body text-sm rounded-full transition-all ${
                  activeFilter === filter.id
                    ? "bg-ink text-main"
                    : "bg-white text-water-deep hover:bg-ink/10"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.src}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="break-inside-avoid cursor-pointer group"
                  onClick={() => setSelectedImage(image.src)}
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                        index % 3 === 0 ? "h-80" : index % 3 === 1 ? "h-64" : "h-72"
                      }`}
                    />
                    <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage.replace("w=800", "w=1600")}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
