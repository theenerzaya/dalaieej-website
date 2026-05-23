import type { ReactNode } from "react";
import SiteImage from "@/app/components/SiteImage";

const MAP_SRC = "/map.jpg";

type FrostedMapSectionProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  "aria-label"?: string;
  imagePriority?: boolean;
  /** Fade the top edge into the page background (surface). */
  fadeTop?: boolean;
  /** Fade the bottom edge into the page background (surface). */
  fadeBottom?: boolean;
};

/**
 * Full-width band with zoomed map.jpg and shared frost treatment (Getting Here).
 */
export default function FrostedMapSection({
  children,
  className = "",
  contentClassName = "mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center",
  "aria-label": ariaLabel,
  imagePriority = false,
  fadeTop = false,
  fadeBottom = true,
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
              src={MAP_SRC}
              alt=""
              fill
              priority={imagePriority}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-main/[14.6] backdrop-blur-[6.5px] backdrop-saturate-90" />
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
