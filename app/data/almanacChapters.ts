export type AlmanacChapter = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  /** Defaults to cover. Use contain to avoid cropping wide images on the index. */
  imageFit?: "cover" | "contain";
  imageCaption?: string;
  href?: string;
  ctaLabel?: string;
};

export const ALMANAC_CHAPTERS: AlmanacChapter[] = [
  {
    id: "chapter-i",
    eyebrow: "Chapter I",
    title: "The Journey: Ulaanbaatar to Khövsgöl",
    description:
      "A comprehensive, logistical guide to navigating the steppe. From securing domestic flights to the cinematic overnight journey on the Trans-Siberian railway, this is how we get to the northern province.",
    imageSrc:
      "/images/getting-here/david-bowie-trans-siberian-railway-1973.jpg",
    imageAlt:
      "Archival photograph of a sleeper cabin on the Trans-Siberian Railway.",
    imageFit: "contain",
    imageCaption:
      "David Bowie on the Trans-Siberian Railway, 1973. Photograph by Geoff MacCormack.",
    href: "/getting-here",
    ctaLabel: "Read Chapter I",
  },
  {
    id: "chapter-ii",
    eyebrow: "Chapter II",
    title: "The Northern Gateway: Mörön & Beyond",
    description:
      "Before the pavement ends, there is Mörön. Discover the mid-century, cinematic charm of the provincial capital, the legend of the north’s first aviator, and why the locals refer to the water solely as Dalai Eej (Mother Ocean).",
    imageSrc: "/murun-accidentally-wes-anderson.webp",
    imageAlt:
      "Murun Airport terminal, noted for its mid-century aesthetic by Accidentally Wes Anderson.",
    imageFit: "contain",
    imageCaption:
      "Mörön Airport (est. 1956). Photographed by @kjphotos1022, as cataloged by the Accidentally Wes Anderson archive.",
    href: "/almanac/murun",
    ctaLabel: "Read Chapter II",
  },
  {
    id: "chapter-iii",
    eyebrow: "Chapter III",
    title: "The Making of the North: Borders & Industry",
    description:
      "The administrative map of the north was not drawn by accident. Explore the geopolitical history of Khatgal—from its origins as a 1700s military border post to the site of Mongolia's first massive, Soviet-engineered wool factory.",
    imageSrc: "/sukhbaatar.jpeg",
    imageAlt: "Historical photograph of the Sukhbaatar.",
    imageCaption:
      "The Sukhbaatar. Sourced via the Bidnii Saikhan Khövgsöl digital archive.",
    href: "/almanac/borders-and-industry",
    ctaLabel: "Read Chapter III",
  },
  {
    id: "chapter-iv",
    eyebrow: "Chapter IV",
    title: "The Forest and the Steppe: An Ancient Divide",
    description:
      "Lake Khövsgöl sits exactly on one of Asia's most enduring ecological borders. Understand the historical tension between the nomadic pastoralists of the Buddhist steppe and the hunter-gatherers of the Shamanic taiga.",
    imageSrc: "/images/gallery/adventures/DBR_4167.webp",
    imageAlt: "Landscape at the edge of the steppe and Siberian taiga.",
    href: "/almanac/forest-and-steppe",
    ctaLabel: "Read Chapter IV",
  },
  {
    id: "chapter-v",
    eyebrow: "Chapter V",
    title: "Two Lakes, One Empire: Khövsgöl and Baikal",
    description:
      "Today, an international border separates Khövsgöl from Russia's Lake Baikal. Discover how an 18th-century treaty severed the geological sister lakes, leaving Baikal to the heavy industrialization and penal colonies of the Soviet taiga, while Khövsgöl remained a pristine sanctuary of the old north.",
    imageSrc: "/images/gallery/the-resort/DBR_9425.webp",
    imageAlt: "Lake Khövsgöl and the northern shoreline at Dalai Eej.",
    href: "/almanac/khovsgol-and-baikal",
    ctaLabel: "Read Chapter V",
  },
];
