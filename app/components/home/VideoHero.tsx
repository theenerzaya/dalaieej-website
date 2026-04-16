"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";

/** Desktop: `.env.local` → `NEXT_PUBLIC_MUX_HERO_PLAYBACK_ID` (Mux → Playback ID). */
const DEFAULT_PLAYBACK_ID_DESKTOP =
  "jE3kksx6nNQaWGYiY600x66owXHHn2SRPs02ki6oD003tU";
/** Mobile (max-width 767px, below Tailwind `md`): `NEXT_PUBLIC_MUX_HERO_PLAYBACK_ID_MOBILE`. */
const DEFAULT_PLAYBACK_ID_MOBILE =
  "mK12ANdmNxuuntw4F31ga8KEptjC9sZyk2qPT02zmvPo";

const PLAYBACK_ID_DESKTOP =
  process.env.NEXT_PUBLIC_MUX_HERO_PLAYBACK_ID?.trim() ||
  DEFAULT_PLAYBACK_ID_DESKTOP;
const PLAYBACK_ID_MOBILE =
  process.env.NEXT_PUBLIC_MUX_HERO_PLAYBACK_ID_MOBILE?.trim() ||
  DEFAULT_PLAYBACK_ID_MOBILE;

function muxPosterUrl(playbackId: string) {
  return `https://image.mux.com/${playbackId}/thumbnail.webp`;
}

function muxHlsUrl(playbackId: string) {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

export default function VideoHero() {
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const playbackId = isMobileViewport ? PLAYBACK_ID_MOBILE : PLAYBACK_ID_DESKTOP;
  const posterUrl = muxPosterUrl(playbackId);
  const hlsUrl = muxHlsUrl(playbackId);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobileViewport(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setVideoFailed(false);
  }, [playbackId]);

  useEffect(() => {
    if (!mounted || videoFailed) return;
    const video = videoRef.current;
    if (!video) return;

    let hls: any = null;

    const tryPlayNative = () => {
      video.src = hlsUrl;
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
            hls.loadSource(hlsUrl);
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
  }, [mounted, videoFailed, hlsUrl]);

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
            poster={posterUrl}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        ) : (
          <img
            src={posterUrl}
            alt="Dalai Eej Resort aerial view"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/20 to-ink/70" />
      </div>
      
      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={
            reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: reduceMotion ? 0 : 1,
            delay: reduceMotion ? 0 : 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 text-hero-glow"
        >
          Dalai Eej
        </motion.h1>
        <motion.p
          initial={
            reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: reduceMotion ? 0 : 1,
            delay: reduceMotion ? 0 : 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="font-body text-base md:text-lg text-white tracking-[0.2em] uppercase text-overlay-glow"
        >
          {locale === 'mn' ? "Хөвсгөл далайн хөвөөнд" : "On the shores of Lake Khuvsgul"}
        </motion.p>
      </div>

      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          delay: reduceMotion ? 0 : 1.2,
          duration: reduceMotion ? 0 : 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="hidden md:block absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2"
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
