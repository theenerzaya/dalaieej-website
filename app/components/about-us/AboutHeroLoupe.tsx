"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ZOOM = 1.75;
const LENS_PX = 240;
const GAP = 20;

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

  const onPointerMove = (e: React.PointerEvent) => {
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

  const onPointerEnter = (e: React.PointerEvent) => {
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
      <div
        className="h-full w-full overflow-hidden rounded-full border border-white/50 bg-main/5 shadow-[0_8px_40px_rgba(13,15,28,0.2),0_0_0_1px_rgba(13,15,28,0.08)]"
        style={{ boxShadow: "0 10px 48px rgba(13, 15, 28, 0.18), 0 0 0 1.5px rgba(255, 255, 255, 0.5), inset 0 0 0 1px rgba(13, 15, 28, 0.06)" }}
      >
        <div className="relative h-full w-full">
          <img
            src={src}
            alt=""
            className="absolute max-w-none select-none"
            draggable={false}
            style={{
              width: loupe.w * ZOOM,
              height: loupe.h * ZOOM,
              left: LENS_PX / 2 - loupe.relX * ZOOM,
              top: LENS_PX / 2 - loupe.relY * ZOOM,
            }}
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
