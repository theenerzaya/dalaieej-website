import { Cormorant_Garamond, Playfair_Display } from "next/font/google";

/** Italic — Mongolian hero; use `.className` so Next injects the correct @font-face. */
export const cormorantGaramondItalic = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  style: ["italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond-italic",
  display: "swap",
});

/** Italic cuts only — use `.className` on headings so Next injects the correct @font-face. */
export const playfairDisplayItalic = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  style: ["italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair-display-italic",
  display: "swap",
});
