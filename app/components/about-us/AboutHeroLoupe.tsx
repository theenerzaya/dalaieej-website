"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";

/** iOS text-loupe feel: gentle zoom, not product zoom. */
const ZOOM = 1.4;
const LENS_PX = 240;
const GAP = 20;

/**
 * Soft, low-contrast float — closer to the iOS loupe where the shadow reads as
 * a diffuse glow pooling below the lens rather than a hard drop shadow. No
 * bright white ring; just a cool-gray hairline sits on the edge.
 */
const LENS_OUTER: CSSProperties["boxShadow"] = [
  "0 0 0 0.5px rgba(60, 65, 80, 0.18)",
  "0 1px 2px rgba(0, 0, 0, 0.05)",
  "0 6px 14px rgba(0, 0, 0, 0.07)",
  "0 18px 34px rgba(0, 0, 0, 0.09)",
  "0 34px 60px rgba(0, 0, 0, 0.08)",
].join(", ");

/** Inner glass edge: faint top highlight + very faint full inner hairline. */
const LENS_INNER: CSSProperties["boxShadow"] = [
  "inset 0 1px 0 rgba(255, 255, 255, 0.55)",
  "inset 0 -0.5px 0 rgba(0, 0, 0, 0.04)",
  "inset 0 0 0 0.5px rgba(255, 255, 255, 0.12)",
].join(", ");

/** Top crescent — subtle, not a strong reflection. */
const GLASS_TOP = `linear-gradient(
  180deg,
  rgba(255, 255, 255, 0.22) 0%,
  rgba(255, 255, 255, 0.06) 18%,
  rgba(255, 255, 255, 0) 38%
)`;

/** Slight frost over the content — that real-glass "slightly washed" look. */
const GLASS_FROST = "rgba(255, 255, 255, 0.08)";

type LoupeState = {
  left: number;
  top: number;
  relX: number;
  relY: number;
  w: number;
  h: number;
};

type AboutHeroLoupeProps = {
  src: string;
  alt: string;
  expandLabel: string;
  onRequestFullscreen: () => void;
  className?: string;
};

/**
 * iOS-style loupe: a circular lens above the pointer showing a live zoomed clip of the hero image.
 * Lens is `pointer-events: none` so the image keeps receiving move/click.
 */
export function AboutHeroLoupe({
  src,
  alt,
  expandLabel,
  onRequestFullscreen,
  className = "",
}: AboutHeroLoupeProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [loupe, setLoupe] = useState<LoupeState | null>(null);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "touch" || reduced) return;
    const img = imgRef.current;
    if (!img) return;
    const r = img.getBoundingClientRect();
    const w = r.width;
    const h = r.height;
    const relX = Math.max(0, Math.min(w, e.clientX - r.left));
    const relY = Math.max(0, Math.min(h, e.clientY - r.top));
    const pad = 8;
    let left = e.clientX - LENS_PX / 2;
    let top = e.clientY - LENS_PX - GAP;
    left = Math.max(pad, Math.min(left, window.innerWidth - LENS_PX - pad));
    top = Math.max(pad, Math.min(top, window.innerHeight - LENS_PX - pad));
    setLoupe({ left, top, relX, relY, w, h });
  };

  const onPointerEnter = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "touch" || reduced) return;
    onPointerMove(e);
  };

  const onPointerLeave = () => setLoupe(null);

  const lens = loupe && portalReady && (
    <div
      className="pointer-events-none fixed z-[90]"
      style={{ left: loupe.left, top: loupe.top, width: LENS_PX, height: LENS_PX }}
      aria-hidden
    >
      {/* Lens: circle with soft float shadow + cool-gray hairline rim. */}
      <div
        className="relative h-full w-full overflow-hidden rounded-full"
        style={{ boxShadow: LENS_OUTER }}
      >
        <img
          src={src}
          alt=""
          className="absolute max-w-none select-none will-change-transform"
          draggable={false}
          style={{
            width: loupe.w * ZOOM,
            height: loupe.h * ZOOM,
            left: LENS_PX / 2 - loupe.relX * ZOOM,
            top: LENS_PX / 2 - loupe.relY * ZOOM,
          }}
        />
        {/* Glass: subtle frost wash + top crescent reflection + inner bevel. */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            backgroundColor: GLASS_FROST,
            backgroundImage: GLASS_TOP,
            boxShadow: LENS_INNER,
          }}
          aria-hidden
        />
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={onRequestFullscreen}
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        aria-label={expandLabel}
        className={`group about-hero w-full overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40 ${
          loupe && !reduced ? "cursor-none" : "cursor-zoom-in"
        } ${className}`}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="pointer-events-none w-full h-auto transition-transform duration-300 group-hover:scale-[1.02] group-active:scale-[0.99] select-none"
          draggable={false}
        />
      </button>
      {portalReady && !reduced && lens
        ? createPortal(lens, document.body)
        : null}
    </>
  );
}
