"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export type GettingHereTocItem = {
  id: string;
  label: string;
};

type Props = {
  items: GettingHereTocItem[];
  title?: string;
};

export default function GettingHereToc({ items, title }: Props) {
  const locale = useLocale();
  const displayTitle = title ?? (locale === "mn" ? "Энэ хуудсанд" : "On this page");
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el != null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  return (
    <nav aria-label={displayTitle} className="getting-here-toc">
      <p className="font-cta text-[11px] sm:text-xs font-medium uppercase tracking-[0.3em] text-ink/45 mb-5">
        {displayTitle}
      </p>
      <ol className="space-y-3">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(item.id);
                }}
                className={[
                  "block font-body text-sm leading-snug transition-colors",
                  isActive ? "text-leaf font-medium" : "text-ink/60 hover:text-ink",
                ].join(" ")}
                aria-current={isActive ? "location" : undefined}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
