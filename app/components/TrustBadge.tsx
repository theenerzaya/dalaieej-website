"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Headline } from "./ui/Typography";

interface TrustBadgeProps {
  locale?: string;
}

export default function TrustBadge({ locale = 'en' }: TrustBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20"
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-leaf to-ink flex items-center justify-center">
            <span className="font-cta text-main text-xl font-semibold">5.0</span>
          </div>
        </div>

        <div className="flex-1">
          <Headline
            as="h3"
            size="sub"
            align="left"
            className="!text-xl md:!text-2xl !text-ink mb-1 leading-tight"
          >
            {locale === "mn" ? "Маш сайн" : "Excellent"}
          </Headline>

          <div className="flex items-center gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-amber-400 text-amber-400"
              />
            ))}
          </div>

          <a
            href="#reviews"
            className="font-body text-sm text-ink/60 hover:text-leaf transition-colors"
          >
            {locale === 'mn' ? "35+ үнэлгээнд үндэслэсэн" : "Based on 35+ Reviews"}
          </a>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-ink-secondary/10">
        <div className="flex items-center justify-between text-xs text-ink/50">
          <span className="font-body">
            {locale === 'mn' ? "Баталгаажсан зочдын үнэлгээ" : "Verified Guest Reviews"}
          </span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-cta uppercase tracking-[0.18em] text-[10px]">
              {locale === 'mn' ? "Баталгаатай" : "Verified"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
