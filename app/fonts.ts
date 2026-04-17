import localFont from "next/font/local";
import { Cormorant_Garamond, Playfair_Display } from "next/font/google";

/** Site body copy — local Araboto; `--font-body` on `<body>` and `font-body` in Tailwind. */
export const araboto = localFont({
  src: [
    { path: "../public/fonts/Araboto Thin 400.ttf", weight: "100", style: "normal" },
    { path: "../public/fonts/Araboto Light 400.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/Araboto Normal 400.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Araboto Medium 400.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/Araboto Bold 400.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

/** Italic — Mongolian hero; use `.className` so Next injects the correct @font-face. */
export const cormorantGaramondItalic = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  style: ["italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond-italic",
  display: "swap",
});

/** Italic cuts — use `.className` on headings so Next injects the correct @font-face. */
export const playfairDisplayItalic = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  style: ["italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair-display-italic",
  display: "swap",
});

/** Mongolian display copy — Playfair Display Italic at one shared scale site-wide. */
export const mnPlayfairDisplayClassName = `${playfairDisplayItalic.className} italic font-normal text-2xl md:text-3xl lg:text-4xl leading-relaxed`;
