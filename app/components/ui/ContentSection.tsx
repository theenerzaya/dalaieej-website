import type { ReactNode } from "react";

export type ContentSectionTone = "surface" | "leaf-tint" | "ink";
export type ContentSectionWidth = "narrow" | "default" | "wide";

const toneToBg: Record<ContentSectionTone, string> = {
  surface: "bg-surface",
  "leaf-tint": "bg-leaf/5",
  ink: "bg-ink",
};

const widthToMax: Record<ContentSectionWidth, string> = {
  narrow: "max-w-3xl",
  default: "max-w-4xl",
  wide: "max-w-6xl",
};

export interface ContentSectionProps {
  /** Rendered as the section's `id` (useful for anchor links / scroll targets). */
  id?: string;
  /** Background tone from the design system. Defaults to "surface". */
  tone?: ContentSectionTone;
  /** Inner container max-width. Defaults to "default" (max-w-4xl). */
  width?: ContentSectionWidth;
  /** When true, children are stacked in a vertical flex with gap-8. Defaults to true. */
  stack?: boolean;
  /** Text alignment for the inner container. Defaults to "center". */
  align?: "left" | "center";
  /** Extra classes merged onto the `<section>`. */
  className?: string;
  children: ReactNode;
}

/**
 * Canonical content section wrapper. Owns the repeated pattern used across
 * home / template / editorial pages:
 *
 *   <section class="py-24 md:py-32 px-6 bg-*">
 *     <div class="max-w-*xl mx-auto flex flex-col items-center gap-8 text-center">
 *       ...children...
 *     </div>
 *   </section>
 *
 * Use this instead of re-writing the same spacing tokens on every page.
 */
export default function ContentSection({
  id,
  tone = "surface",
  width = "default",
  stack = true,
  align = "center",
  className,
  children,
}: ContentSectionProps) {
  const sectionClass = [
    "scroll-mt-24 py-24 md:py-32 px-6",
    toneToBg[tone],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";
  const stackClass = stack ? `flex flex-col gap-8 ${alignClass}` : "";
  const containerClass = [widthToMax[width], "mx-auto", stackClass]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} className={sectionClass}>
      <div className={containerClass}>{children}</div>
    </section>
  );
}
