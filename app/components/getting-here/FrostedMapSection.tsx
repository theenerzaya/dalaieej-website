import type { ReactNode } from "react";
import SiteImage from "@/app/components/SiteImage";

const DEFAULT_IMAGE_SRC = "/images/almanac/getting-here/travel-route-map.jpg";

type FrostedMapSectionProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  "aria-label"?: string;
  /** Background image. Defaults to the Getting Here route map. */
  imageSrc?: string;
  imagePriority?: boolean;
  /** Fade the top edge into the page background (surface). */
  fadeTop?: boolean;
  /** Fade the bottom edge into the page background (surface). */
  fadeBottom?: boolean;
  /** White wash opacity (percent). Default 14.6 */
  frostOpacity?: number;
  /** Backdrop blur in px. Default 6.5 */
  frostBlurPx?: number;
  /** CSS object-position for the map crop (e.g. "50% 55%"). */
  mapObjectPosition?: string;
};

const DEFAULT_FROST_OPACITY = 14.6;
const DEFAULT_FROST_BLUR_PX = 6.5;

/**
 * Full-width band with a background image and shared frost treatment (Getting Here, Catalogue, etc.).
 */
export default function FrostedMapSection({
  children,
  className = "",
  contentClassName = "mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center",
  "aria-label": ariaLabel,
  imageSrc = DEFAULT_IMAGE_SRC,
  imagePriority = false,
  fadeTop = false,
  fadeBottom = true,
  frostOpacity = DEFAULT_FROST_OPACITY,
  frostBlurPx = DEFAULT_FROST_BLUR_PX,
  mapObjectPosition = "50% 50%",
}: FrostedMapSectionProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={`relative w-full overflow-hidden ${className}`.trim()}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 scale-[1.35] md:scale-[1.25]">
            <SiteImage
              src={imageSrc}
              alt=""
              fill
              priority={imagePriority}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: mapObjectPosition }}
            />
          </div>
        </div>
        <div
          className="absolute inset-0 backdrop-saturate-90"
          style={{
            backgroundColor: `color-mix(in srgb, var(--bg-main) ${frostOpacity}%, transparent)`,
            backdropFilter: `blur(${frostBlurPx}px)`,
          }}
        />
        {fadeTop ? (
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-surface to-transparent md:h-36" />
        ) : null}
        {fadeBottom ? (
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-surface md:h-36" />
        ) : null}
      </div>

      <div className={`relative z-10 ${contentClassName}`.trim()}>{children}</div>
    </section>
  );
}
