"use client";

import FadeInBlock from "@/app/components/getting-here/FadeInBlock";
import { CTALink } from "@/app/components/ui/Typography";
import type { LucideIcon } from "lucide-react";

export type TransferOption = {
  id: string;
  icon: LucideIcon;
  title: string;
  meta: string;
  body: string;
  href: string;
  linkLabel: string;
  external?: boolean;
  secondaryHref?: string;
  secondaryLinkLabel?: string;
};

type Props = {
  options: TransferOption[];
};

function TransferOptionCard({ option }: { option: TransferOption }) {
  const {
    icon: Icon,
    title,
    meta,
    body,
    href,
    linkLabel,
    external,
    secondaryHref,
    secondaryLinkLabel,
  } = option;

  return (
    <article className="group flex h-full flex-col gap-3 bg-leaf/5 p-6 transition-colors duration-300 hover:bg-surface-alt/90">
      <Icon
        className="h-8 w-8 shrink-0 text-leaf/70 transition-colors group-hover:text-leaf"
        strokeWidth={1.25}
        aria-hidden
      />
      <div>
        <p className="font-cta text-[11px] uppercase tracking-[0.2em] text-ink/80">
          {title}
        </p>
        {meta ? (
          <p className="mt-1 font-cta text-[10px] uppercase tracking-[0.22em] text-ink/45">
            {meta}
          </p>
        ) : null}
      </div>
      <p className="flex-1 font-body text-sm leading-relaxed text-ink/70">
        {body}
      </p>
      <div className="flex flex-col items-start gap-3 pt-1">
        <CTALink href={href} external={external} arrow>
          {linkLabel}
        </CTALink>
        {secondaryHref && secondaryLinkLabel ? (
          <CTALink href={secondaryHref} arrow>
            {secondaryLinkLabel}
          </CTALink>
        ) : null}
      </div>
    </article>
  );
}

export default function TransferOptions({ options }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {options.map((option, index) => (
        <FadeInBlock
          key={option.id}
          delay={0.05 + index * 0.05}
          className="h-full"
        >
          <TransferOptionCard option={option} />
        </FadeInBlock>
      ))}
    </div>
  );
}
