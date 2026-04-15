"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

/** Set in `.env.local` as `NEXT_PUBLIC_MUX_HERO_PLAYBACK_ID` (Mux asset → Playback ID). */
const DEFAULT_PLAYBACK_ID = "RznyTa0219reEqqGVM4HDlAjdu6bpgNJ025zj8YZNe1Ww";
const PLAYBACK_ID =
  process.env.NEXT_PUBLIC_MUX_HERO_PLAYBACK_ID?.trim() || DEFAULT_PLAYBACK_ID;
const POSTER_URL = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.webp`;
const HLS_URL = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;

export default function VideoHero() {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || videoFailed) return;
    const video = videoRef.current;
    if (!video) return;

    let hls: any = null;

    const tryPlayNative = () => {
      video.src = HLS_URL;
      video.load();
      video.play().catch(() => setVideoFailed(true));
    };

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      tryPlayNative();
    } else {
      import("hls.js")
        .then((mod) => {
          const Hls = mod.default;
          if (Hls.isSupported()) {
            hls = new Hls({ enableWorker: false });
            hls.on(Hls.Events.ERROR, (_: any, data: any) => {
              if (data.fatal) {
                setVideoFailed(true);
                hls.destroy();
              }
            });
            hls.loadSource(HLS_URL);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              video.play().catch(() => {});
            });
          } else {
            tryPlayNative();
          }
        })
        .catch(() => setVideoFailed(true));
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [mounted, videoFailed, HLS_URL]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-ink">
        {mounted && !videoFailed ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={POSTER_URL}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        ) : (
          <img
            src={POSTER_URL}
            alt="Dalai Eej Resort aerial view"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/20 to-ink/70" />
      </div>
      
      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 text-hero-glow"
        >
          Dalai Eej
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-body text-base md:text-lg text-white tracking-[0.2em] uppercase text-overlay-glow"
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
