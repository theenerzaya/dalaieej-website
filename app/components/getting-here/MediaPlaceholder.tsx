import { ImageIcon, MapPin, Plane, Train, Bus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SiteImage from "@/app/components/SiteImage";

type Variant = "photo" | "map" | "icons";

type Props = {
  variant?: Variant;
  label: string;
  imageSrc?: string;
  imageAlt?: string;
  icons?: LucideIcon[];
  className?: string;
};

const defaultIcons = [Plane, Bus, Train];

export default function MediaPlaceholder({
  variant = "photo",
  label,
  imageSrc,
  imageAlt = "",
  icons = defaultIcons,
  className = "",
}: Props) {
  if (imageSrc) {
    return (
      <div
        className={`relative aspect-[21/9] w-full overflow-hidden rounded-sm bg-leaf/10 ${className}`}
      >
        <SiteImage
          src={imageSrc}
          alt={imageAlt || label}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 720px"
        />
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  if (variant === "map") {
    return (
      <div
        className={`flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-ink/20 bg-leaf/5 ${className}`}
        aria-hidden={false}
      >
        <MapPin className="h-10 w-10 text-leaf/50" strokeWidth={1.25} />
        <p className="font-cta text-[10px] uppercase tracking-[0.25em] text-ink/45">
          {label}
        </p>
      </div>
    );
  }

  if (variant === "icons") {
    return (
      <div
        className={`flex aspect-[21/9] w-full items-center justify-center gap-10 rounded-sm border border-dashed border-ink/20 bg-surface-alt ${className}`}
      >
        {icons.map((Icon, i) => (
          <Icon key={i} className="h-10 w-10 text-leaf/40" strokeWidth={1.25} />
        ))}
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex aspect-[21/9] w-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-ink/20 bg-leaf/5 ${className}`}
    >
      <ImageIcon className="h-9 w-9 text-leaf/40" strokeWidth={1.25} />
      <p className="font-cta text-[10px] uppercase tracking-[0.25em] text-ink/45">
        {label}
      </p>
    </div>
  );
}
