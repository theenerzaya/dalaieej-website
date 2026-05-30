import Link from "next/link";
import { Eyebrow } from "@/app/components/ui/Typography";

type Props = {
  label: string;
  href?: string;
  linkLabel?: string;
};

const chapterLinkFocus =
  "rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water-deep";

/** Centered blue chapter label with flanking hairlines. */
export default function AlmanacChapterMarker({ label, href, linkLabel }: Props) {
  const labelNode = href ? (
    <Link
      href={href}
      className={`group inline-block ${chapterLinkFocus}`}
      aria-label={linkLabel ?? label}
    >
      <Eyebrow
        as="span"
        className="!text-water-deep/70 mb-0 transition-colors group-hover:!text-water-deep"
      >
        {label}
      </Eyebrow>
    </Link>
  ) : (
    <Eyebrow as="span" className="!text-water-deep/70 mb-0">
      {label}
    </Eyebrow>
  );

  return (
    <div className="mx-auto mb-8 flex max-w-2xl items-center gap-4 md:mb-10 md:gap-6">
      <span className="h-px flex-1 bg-water-deep/15" aria-hidden />
      <div className="shrink-0 text-center">{labelNode}</div>
      <span className="h-px flex-1 bg-water-deep/15" aria-hidden />
    </div>
  );
}
