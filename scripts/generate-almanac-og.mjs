#!/usr/bin/env node

/**
 * Builds 1200×630 Open Graph JPEGs for Almanac hub and article pages.
 *
 * Usage:  node scripts/generate-almanac-og.mjs
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const OUT_DIR = path.join(PUBLIC_DIR, "images/og/almanac");
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/** slug → source path under public/ (hero or brand image) */
const SOURCES = [
  { slug: "hub", source: "/images/og-heritage.jpg" },
  { slug: "murun", source: "/images/almanac/murun/hero-wes-anderson-terminal.webp" },
  {
    slug: "borders-and-industry",
    source: "/images/almanac/borders-and-industry/hero-sukhbaatar.jpeg",
  },
  { slug: "forest-and-steppe", source: "/images/almanac/forest-and-steppe/hero-deer-stones.jpg" },
  { slug: "khovsgol-and-baikal", source: "/images/gallery/the-resort/DBR_9425.webp" },
];

async function generateOne({ slug, source }) {
  const inputPath = path.join(PUBLIC_DIR, source.replace(/^\//, ""));
  const outputPath = path.join(OUT_DIR, `${slug}.jpg`);

  await sharp(inputPath)
    .resize(OG_WIDTH, OG_HEIGHT, {
      fit: "cover",
      position: "centre",
    })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(outputPath);

  console.log(`✓ ${slug}.jpg ← ${source}`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  for (const entry of SOURCES) {
    await generateOne(entry);
  }
  console.log(`\nDone. Images written to public/images/og/almanac/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
