import localFont from "next/font/local";
import { Cormorant_Garamond, Montserrat, Playfair_Display } from "next/font/google";

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

/** CTA / UI / label font — Montserrat. `--font-cta` token, `font-cta` utility. */
export const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-cta",
  display: "swap",
});

/** MN editorial headlines (H1/H2/H3) — Cormorant Garamond Italic. */
export const cormorantGaramondItalic = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  style: ["italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond-italic",
  display: "swap",
});

/** EN editorial headlines (H1/H2/H3) — Playfair Display Italic. */
export const playfairDisplayItalic = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  style: ["italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair-display-italic",
  display: "swap",
});
