/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import { Eyebrow, Headline } from "../ui/Typography";

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

    type HlsInstance = {
      destroy: () => void;
      loadSource: (src: string) => void;
      attachMedia: (media: HTMLVideoElement) => void;
      on: (event: unknown, handler: (...args: unknown[]) => void) => void;
    };

    let hls: HlsInstance | null = null;

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
            hls = new Hls({ enableWorker: false }) as unknown as HlsInstance;
            hls.on(Hls.Events.ERROR, (_: unknown, data: unknown) => {
              const d = data as { fatal?: boolean };
              if (d.fatal) {
                setVideoFailed(true);
                hls?.destroy();
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
    <section
      id="site-hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
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
      
      <div className="relative z-10 text-center px-6 flex flex-col items-center gap-6">
        <motion.div
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
        >
          <Headline
            as="h1"
            size="hero"
            variant="editorial"
            tone="dark"
            className={`text-white text-hero-glow ${
              locale === "mn" ? "" : "font-editorial-mn"
            }`}
          >
            {locale === "mn" ? "Далай ээж" : "Dalai Eej"}
          </Headline>
        </motion.div>
        <div
          id="hero-nav-sentinel"
          aria-hidden
          className="pointer-events-none h-px w-full shrink-0"
        />
        <motion.div
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
        >
          <Eyebrow tone="dark" className="text-white text-overlay-glow">
            {locale === "mn"
              ? "Хөвсгөл далайн хөвөөнд"
              : "On the shores of Lake Khuvsgul"}
          </Eyebrow>
        </motion.div>
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
        className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2"
      >
        <button
          type="button"
          onClick={() => {
            document.getElementById("editorial-intro")?.scrollIntoView({
              behavior: reduceMotion ? "auto" : "smooth",
              block: "start",
            });
          }}
          aria-label={locale === "mn" ? "Доош гүйлгэх" : "Scroll down"}
          className="block cursor-pointer border-0 bg-transparent p-0 text-3xl md:text-4xl font-light uppercase tracking-[0.18em] text-white animate-bounce drop-shadow-lg leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm"
        >
          ↓
        </button>
      </motion.div>
    </section>
  );
}
