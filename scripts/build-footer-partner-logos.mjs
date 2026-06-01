#!/usr/bin/env node

/**
 * Builds light-toned footer partner logos from public/images/footer/partners/source.
 * Output: public/images/footer/partners/*-light.webp (64px max height @2x)
 *
 * Usage: node scripts/build-footer-partner-logos.mjs
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCE_DIR = path.join(
  ROOT,
  "public",
  "images",
  "footer",
  "partners",
  "source"
);
const OUT_DIR = path.join(ROOT, "public", "images", "footer", "partners");

/** Display ~32px; export at 2x */
const MAX_HEIGHT = 64;

/** Soft off-white on bg-ink */
const FOOTER_WHITE = 248;

const INPUTS = [
  { input: "bradt.png", output: "bradt-light.webp", mode: "alpha" },
  {
    input: "ha-travel.png",
    output: "ha-travel-light.webp",
    mode: "darkOnLight",
  },
  {
    input: "telegraph.webp",
    output: "telegraph-light.webp",
    mode: "darkOnLight",
    maxHeight: 77, // 1.2 × 64
    trimThreshold: 40,
    flattenWhite: true,
    lumCutoff: 0.88,
    alphaFloor: 28,
  },
];

/**
 * @param {Buffer} data
 * @param {number} offset
 */
function luminance(data, offset) {
  const r = data[offset];
  const g = data[offset + 1];
  const b = data[offset + 2];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * @param {Buffer} out
 * @param {number} alphaFloor
 */
function applyAlphaFloor(out, alphaFloor) {
  if (!alphaFloor) return;
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] > 0 && out[i + 3] < alphaFloor) {
      out[i + 3] = 0;
    }
  }
}

/**
 * White knock-out using existing alpha (dark/colored marks on transparency).
 * @param {Buffer} data
 * @param {number} width
 * @param {number} height
 * @param {{ alphaFloor?: number }} opts
 */
function pixelsToWhiteFromAlpha(data, width, height, opts = {}) {
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    const a = data[o + 3] / 255;
    if (a < 0.02) continue;

    const lum = luminance(data, o);
    const ink = a * (1 - lum * 0.35);
    const alpha = Math.round(Math.min(255, ink * 255));

    out[o] = FOOTER_WHITE;
    out[o + 1] = FOOTER_WHITE;
    out[o + 2] = FOOTER_WHITE;
    out[o + 3] = alpha;
  }

  applyAlphaFloor(out, opts.alphaFloor);
  return out;
}

/**
 * Dark / coloured logo on white or light background → uniform white silhouette.
 * @param {Buffer} data
 * @param {number} width
 * @param {number} height
 * @param {{ lumCutoff?: number; alphaFloor?: number }} opts
 */
function pixelsToWhiteFromDarkOnLight(data, width, height, opts = {}) {
  const lumCutoff = opts.lumCutoff ?? 1;
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    const a = data[o + 3] / 255;
    if (a < 0.02) continue;

    const lum = luminance(data, o);
    if (lum >= lumCutoff) continue;

    let ink = (1 - lum) * a;
    ink = Math.min(1, ink * 1.08 + 0.02);

    const alpha = Math.round(ink * 255);
    if (alpha < 8) continue;

    out[o] = FOOTER_WHITE;
    out[o + 1] = FOOTER_WHITE;
    out[o + 2] = FOOTER_WHITE;
    out[o + 3] = alpha;
  }

  applyAlphaFloor(out, opts.alphaFloor);
  return out;
}

/**
 * @param {typeof INPUTS[number]} item
 */
async function processOne(item) {
  const { input, output, mode } = item;
  const inputPath = path.join(SOURCE_DIR, input);
  const outputPath = path.join(OUT_DIR, output);

  const maxHeight = item.maxHeight ?? MAX_HEIGHT;
  const trimThreshold = item.trimThreshold ?? 20;

  let pipeline = sharp(inputPath);
  if (item.flattenWhite) {
    pipeline = pipeline.flatten({ background: "#ffffff" });
  }

  const { data, info } = await pipeline
    .trim({ threshold: trimThreshold })
    .resize({
      height: maxHeight,
      fit: "inside",
      withoutEnlargement: false,
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const pixelOpts = {
    lumCutoff: item.lumCutoff,
    alphaFloor: item.alphaFloor,
  };

  const pixels =
    mode === "darkOnLight"
      ? pixelsToWhiteFromDarkOnLight(data, width, height, pixelOpts)
      : pixelsToWhiteFromAlpha(data, width, height, pixelOpts);

  await sharp(pixels, { raw: { width, height, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(outputPath);

  const meta = await sharp(outputPath).metadata();
  console.log(`  ${output} (${mode}) → ${meta.width}×${meta.height}`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log("Building footer partner logos…\n");

  for (const item of INPUTS) {
    await processOne(item);
  }

  console.log("\nDone:", OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
