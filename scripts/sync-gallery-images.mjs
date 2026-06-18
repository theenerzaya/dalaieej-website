#!/usr/bin/env node

/**
 * Regenerates app/data/galleryImages.ts from curated gallery files on disk:
 *   - Every .webp under public/images/gallery
 *   - Every .jpg / .jpeg under public/images/gallery strictly under 900 KiB
 *     (900 * 1024 bytes), except DBR_* shots: any .jpg / .jpeg / .webp
 *   - For the same DBR stem (e.g. DBR_7366.jpg vs DBR_7366.webp), keeps .webp only
 *   - Byte-identical files are deduped (first path by sort order is kept)
 *
 * Usage: node scripts/sync-gallery-images.mjs
 */

import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_ROOT = path.resolve(__dirname, "..", "public", "images");
const OUT_FILE = path.resolve(__dirname, "..", "app", "data", "galleryImages.ts");

const MAX_JPG_BYTES = 900 * 1024;
const DISPLAY_CATEGORY_ORDER = ["adventures", "resort", "rooms", "dining", "wellness", "lake"];
const SHUFFLE_SEED = "dalaieej-gallery-2026-06-18";

/**
 * Resort photography under public/images/gallery/ named DBR_… (.webp / .jpg / .jpeg).
 * @param {string} relPosix
 */
function isDbrGalleryShot(relPosix) {
  if (!relPosix.startsWith("gallery/")) return false;
  const stem = path.basename(relPosix, path.extname(relPosix));
  return /^DBR_/i.test(stem);
}

/**
 * @param {string} relPosix
 */
function dbrGalleryStemKey(relPosix) {
  const stem = path.basename(relPosix, path.extname(relPosix));
  const dir = path.dirname(relPosix).replace(/\\/g, "/");
  return `${dir}/${stem}`;
}

/**
 * Same DBR frame in jpg + webp → one tile (prefer webp).
 * @param {{ rel: string; size: number }[]} picked
 */
function preferWebpForDbrDuplicates(picked) {
  /** @type {Map<string, (typeof picked)[0]>} */
  const winners = new Map();
  for (const item of picked) {
    if (!isDbrGalleryShot(item.rel)) continue;
    const key = dbrGalleryStemKey(item.rel);
    const prev = winners.get(key);
    winners.set(key, prev ? betterDbrVariant(prev, item) : item);
  }

  /** @type {typeof picked} */
  const out = [];
  for (const item of picked) {
    if (!isDbrGalleryShot(item.rel)) {
      out.push(item);
      continue;
    }
    const w = winners.get(dbrGalleryStemKey(item.rel));
    if (w && w.rel === item.rel) out.push(item);
  }
  return out;
}

/**
 * @param {{ rel: string; size: number }} a
 * @param {{ rel: string; size: number }} b
 */
function betterDbrVariant(a, b) {
  const rank = (ext) => (ext === ".webp" ? 0 : ext === ".jpeg" ? 1 : 2);
  const ra = rank(path.extname(a.rel).toLowerCase());
  const rb = rank(path.extname(b.rel).toLowerCase());
  if (ra !== rb) return ra < rb ? a : b;
  return a.rel <= b.rel ? a : b;
}

/** @typedef {'resort' | 'rooms' | 'dining' | 'wellness' | 'adventures' | 'lake'} Category */

/**
 * @param {string} relPosix path relative to public/images, forward slashes
 * @returns {Category}
 */
function inferCategory(relPosix) {
  const p = relPosix.toLowerCase();

  if (p.startsWith("gallery/")) {
    const rest = p.slice("gallery/".length);
    if (!rest.includes("/")) {
      return "resort";
    }
    const seg = rest.split("/")[0];
    if (seg === "spa-and-wellness") return "wellness";
    if (seg === "the-lake" || seg === "lake") return "lake";
    if (seg === "the-resort" || seg === "resort") return "resort";
    if (seg === "wine-and-dine" || seg === "dining") return "dining";
    if (seg === "accommodations" || seg === "rooms" || seg === "cabins") return "rooms";
    if (seg === "restaurant") return "dining";
    if (seg === "adventures") return "adventures";
    if (seg === "wellness") return "wellness";
    return "resort";
  }

  return "resort";
}

/**
 * @param {string} relPosix
 * @returns {'portrait' | 'landscape' | 'square'}
 */
function inferRatio(relPosix) {
  let h = 0;
  for (let i = 0; i < relPosix.length; i++) h = (h * 31 + relPosix.charCodeAt(i)) | 0;
  const r = Math.abs(h) % 3;
  if (r === 0) return "landscape";
  if (r === 1) return "portrait";
  return "square";
}

/**
 * @param {string} relPosix
 */
function altFromRel(relPosix) {
  const noExt = relPosix.replace(/\.[^.]+$/, "");
  return noExt
    .split("/")
    .map((part) => part.replace(/-/g, " "))
    .join(" — ");
}

/**
 * @param {string} relPosix
 */
function toPublicSrc(relPosix) {
  const segments = relPosix.split("/");
  return "/images/" + segments.map(encodeURIComponent).join("/");
}

/**
 * Deterministic shuffle rank. Keeps the gallery lively without changing order
 * every build or depending on OS-specific random/locale behavior.
 * @param {string} value
 */
function seededRank(value) {
  let h = 2166136261;
  const input = `${SHUFFLE_SEED}:${value}`;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * @param {{ rel: string; size: number }} a
 * @param {{ rel: string; size: number }} b
 */
function galleryDisplayOrder(a, b) {
  const ca = inferCategory(a.rel);
  const cb = inferCategory(b.rel);
  const ia = DISPLAY_CATEGORY_ORDER.indexOf(ca);
  const ib = DISPLAY_CATEGORY_ORDER.indexOf(cb);
  if (ia !== ib) return ia - ib;

  const ra = seededRank(a.rel);
  const rb = seededRank(b.rel);
  if (ra !== rb) return ra - rb;
  return a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0;
}

/**
 * @param {string} dir
 * @param {string} baseRel
 * @returns {Promise<string[]>}
 */
async function walk(dir, baseRel = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  /** @type {string[]} */
  const rels = [];
  for (const ent of entries) {
    const rel = baseRel ? `${baseRel}/${ent.name}` : ent.name;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      rels.push(...(await walk(full, rel)));
    } else {
      rels.push(rel.replace(/\\/g, "/"));
    }
  }
  return rels;
}

/**
 * @param {string} fullPath absolute file path
 * @returns {Promise<string>} hex sha256
 */
function sha256File(fullPath) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const rs = createReadStream(fullPath);
    rs.on("error", reject);
    rs.on("data", (chunk) => hash.update(chunk));
    rs.on("end", () => resolve(hash.digest("hex")));
  });
}

/**
 * Drops files whose bytes match an earlier entry (list must be pre-sorted by rel).
 * @param {{ rel: string; size: number }[]} sorted
 */
async function dedupeByContent(sorted) {
  const seen = new Set();
  /** @type {typeof sorted} */
  const out = [];
  let skipped = 0;
  for (const item of sorted) {
    const full = path.join(IMAGES_ROOT, ...item.rel.split("/"));
    const digest = await sha256File(full);
    if (seen.has(digest)) {
      skipped += 1;
      console.warn(`duplicate bytes (skipped): ${item.rel}`);
      continue;
    }
    seen.add(digest);
    out.push(item);
  }
  if (skipped) console.warn(`Removed ${skipped} byte-identical duplicate(s).`);
  return out;
}

async function main() {
  const allRels = await walk(IMAGES_ROOT);
  /** @type {{ rel: string; size: number }[]} */
  const picked = [];

  for (const rel of allRels) {
    if (!rel.startsWith("gallery/")) continue;

    const ext = path.extname(rel).toLowerCase();
    const full = path.join(IMAGES_ROOT, ...rel.split("/"));
    const st = await stat(full);

    if (ext === ".webp") {
      picked.push({ rel, size: st.size });
      continue;
    }
    if (ext === ".jpg" || ext === ".jpeg") {
      if (isDbrGalleryShot(rel) || st.size < MAX_JPG_BYTES) {
        picked.push({ rel, size: st.size });
      }
    }
  }

  // Keep generation stable across OS/ICU differences used by localeCompare.
  picked.sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));
  const dbrDeduped = preferWebpForDbrDuplicates(picked);
  const unique = await dedupeByContent(dbrDeduped);
  const displayOrdered = [...unique].sort(galleryDisplayOrder);

  const lines = displayOrdered.map(({ rel }) => {
    const src = toPublicSrc(rel);
    const category = inferCategory(rel);
    const alt = altFromRel(rel);
    const ratio = inferRatio(rel);
    return `  { src: ${JSON.stringify(src)}, category: ${JSON.stringify(category)}, alt: ${JSON.stringify(alt)}, ratio: ${JSON.stringify(ratio)} },`;
  });

  const header = `/**
 * Curated raster images under public/images/gallery: every .webp; .jpg/.jpeg
 * under 900 KiB (except DBR_* — any size, jpg or webp). Byte-identical files omitted.
 * Regenerate: npm run sync-gallery-images
 */
export type GalleryImageSource = {
  src: string;
  category: "resort" | "rooms" | "dining" | "wellness" | "adventures" | "lake";
  alt: string;
  ratio: "portrait" | "landscape" | "square";
};

export const GALLERY_IMAGES: GalleryImageSource[] = [
`;

  const footer = `
];
`;

  await writeFile(OUT_FILE, header + "\n" + lines.join("\n") + footer, "utf8");
  console.log(
    `Wrote ${displayOrdered.length} images to ${path.relative(process.cwd(), OUT_FILE)}` +
      (unique.length < dbrDeduped.length
        ? ` (${dbrDeduped.length - unique.length} byte-duplicates removed)`
        : "")
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
