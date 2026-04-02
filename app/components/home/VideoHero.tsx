"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Video from "next-video";

const resortAerial = {
  status: "ready" as const,
  originalFilePath: "videos/resort-aerial.mp4",
  provider: "mux" as const,
  providerMetadata: {
    mux: {
      assetId: "A5RubJHFuc1uJs9VQ02dfw00VlOTA7IegdFZkahEEQ2wI",
      playbackId: "01PQp009SKEfaXSKTQHovctcbBvzQUVVQf1CfRg5oOnWI",
    },
  },
  sources: [
    {
      src: "https://stream.mux.com/01PQp009SKEfaXSKTQHovctcbBvzQUVVQf1CfRg5oOnWI.m3u8",
      type: "application/x-mpegURL",
    },
  ],
  poster: "https://image.mux.com/01PQp009SKEfaXSKTQHovctcbBvzQUVVQf1CfRg5oOnWI/thumbnail.webp",
  createdAt: 1772030111923,
  updatedAt: 1772030266449,
};

export default function VideoHero() {
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-ink">
        <Video
          src={resortAerial}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          className="w-full h-full object-cover opacity-80"
          style={{ '--media-object-fit': 'cover', '--media-object-position': 'center' } as Record<string, string>}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/60" />
      </div>
      
      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 drop-shadow-lg"
        >
          Dalai Eej
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-body text-base md:text-lg text-white tracking-[0.2em] uppercase drop-shadow-md"
        >
          {locale === 'mn' ? "Хөвсгөл нуурын эрэг дээр" : "On the shores of Lake Khuvsgul"}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2"
      >
        <svg 
          className="w-8 h-8 text-white animate-bounce drop-shadow-lg" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-label="Scroll down"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </motion.div>
    </section>
  );
}
