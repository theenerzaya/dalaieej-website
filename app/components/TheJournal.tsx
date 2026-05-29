/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { withLocalePath } from "@/lib/localePath";

interface TheJournalProps {
  locale?: string;
}

export default function TheJournal({ locale = 'en' }: TheJournalProps) {
  const isMn = locale === 'mn';

  const profiles = [
    {
      image: "/images/gallery/the-resort/DBR_1902.webp",
      title: isMn ? "Ээж" : "The Matriarch",
      quote: isMn 
        ? "Би яагаад кампын сүнсийг амьд байлгасан." 
        : "Why I kept the camp's spirit alive.",
      alt: "The Matriarch looking at the lake"
    },
    {
      image: "/images/gallery/the-resort/DBR_1914.webp",
      title: isMn ? "Нийгмийн менежер" : "The Social Director",
      quote: isMn 
        ? "Далай ээж дэх төгс зуны өдөр." 
        : "The perfect summer day at Dalai Eej.",
      alt: "The Social Director smiling"
    },
    {
      image: "/images/gallery/the-resort/DBR_4760.webp",
      title: isMn ? "Завны ахмад" : "The Captain",
      quote: isMn 
        ? "Хөх сувдын нууцууд." 
        : "Secrets of the Blue Pearl.",
      alt: "The Boat Captain"
    }
  ];

  return (
    <section className="bg-leaf/5 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="font-body text-leaf text-sm tracking-[0.2em] uppercase mb-4">
            {isMn ? "Манай тосгон" : "Our Village"}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink">
            {isMn ? "Нуурын хүмүүс." : "People of the Lake."}
          </h2>
        </motion.div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
          {profiles.map((profile, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-6">
                <img
                  src={profile.image}
                  alt={profile.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-secondary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-surface flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <ArrowRight className="w-4 h-4 text-ink" />
                </div>
              </div>

              {/* Text Content */}
              <div className="px-2">
                <h3 className="font-serif text-2xl text-ink mb-3 group-hover:text-leaf transition-colors">
                  {profile.title}
                </h3>
                <p className="font-body text-ink/60 italic leading-relaxed">
                  &quot;{profile.quote}&quot;
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link
            href={withLocalePath(locale, "/almanac")}
            className="inline-flex items-center gap-2 font-body text-leaf hover:text-water-deep transition-colors group"
          >
            <span className="border-b border-leaf/30 group-hover:border-ink pb-1">
              {isMn ? "Бүх түүхийг унших" : "Read All Stories"}
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
