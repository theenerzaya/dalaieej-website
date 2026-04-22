"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";

/** Closer to iOS text loupe (subtle) vs. retail “product zoom” */
const ZOOM = 1.45;
const LENS_PX = 240;
const GAP = 20;

const LENS_RIM = "rgba(255, 255, 255, 0.92)";
const LENS_OUTER: CSSProperties["boxShadow"] = [
  "0 0 0 0.5px rgba(0, 0, 0, 0.07)",
  "0 0 0 1px rgba(255, 255, 255, 0.45)",
  "0 1px 1px rgba(0, 0, 0, 0.04)",
  "0 3px 8px rgba(0, 0, 0, 0.08)",
  "0 10px 28px rgba(0, 0, 0, 0.12)",
  "0 20px 48px rgba(0, 0, 0, 0.14)",
].join(", ");

const GLASS_TOP = `linear-gradient(
  180deg,
  rgba(255, 255, 255, 0.5) 0%,
  rgba(255, 255, 255, 0.16) 14%,
  rgba(255, 255, 255, 0.04) 32%,
  rgba(255, 255, 255, 0) 50%
)`;

const GLASS_SPEC = `radial-gradient(
  85% 45% at 50% 8%,
  rgba(255, 255, 255, 0.55) 0%,
  rgba(255, 255, 255, 0) 55%
)`;

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
      {/* Outer shell: iOS float shadow + light rim; inner clips content to a perfect circle. */}
      <div
        className="h-full w-full overflow-visible rounded-full p-[0.4px] sm:p-px"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${LENS_RIM} 0%, rgba(210, 215, 225, 0.55) 100%)`,
          boxShadow: LENS_OUTER,
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-full"
          style={{
            boxShadow: [
              "inset 0 1.5px 0 rgba(255, 255, 255, 0.7)",
              "inset 0 0 0 0.5px rgba(0, 0, 0, 0.04)",
            ].join(", "),
          }}
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
          {/* “Glass” — top-down specular + edge highlight (readability + Apple-like sheen) */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background: [GLASS_SPEC, GLASS_TOP].join(", "),
            }}
            aria-hidden
          />
        </div>
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
