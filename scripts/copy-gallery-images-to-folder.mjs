#!/usr/bin/env node

/**
 * Copies every image listed in app/data/galleryImages.ts into public/images/gallery/,
 * using subfolders that mirror the source (cabins/, map/, restaurant/, …).
 * Files already under images/gallery/ stay in the same relative place (no gallery/gallery/).
 * Does not create an "all/" folder.
 *
 * Usage: node scripts/copy-gallery-images-to-folder.mjs
 */

import { readFile, mkdir, copyFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IMAGES_ROOT = path.join(ROOT, "public", "images");
const GALLERY_ROOT = path.join(IMAGES_ROOT, "gallery");
const MANIFEST = path.join(ROOT, "app", "data", "galleryImages.ts");

/** @param {string} srcUrl e.g. /images/foo/bar.webp */
function manifestSrcToRelPosix(srcUrl) {
  const trimmed = srcUrl.replace(/^\/images\//, "");
  return trimmed
    .split("/")
    .map((seg) => decodeURIComponent(seg))
    .join("/");
}

/**
 * Destination path under public/images/gallery/
 * @param {string} relFromImages posix, e.g. cabins/a.webp or gallery/DBR_1.webp
 */
function destUnderGallery(relFromImages) {
  const rest = relFromImages.startsWith("gallery/")
    ? relFromImages.slice("gallery/".length)
    : relFromImages;
  return path.join(GALLERY_ROOT, ...rest.split("/"));
}

function sourcePath(relFromImages) {
  return path.join(IMAGES_ROOT, ...relFromImages.split("/"));
}

async function parseManifestSrcs() {
  const text = await readFile(MANIFEST, "utf8");
  /** @type {string[]} */
  const out = [];
  const re = /src:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    out.push(m[1]);
  }
  return [...new Set(out)];
}

async function main() {
  const srcs = await parseManifestSrcs();
  let copied = 0;
  let skipped = 0;

  for (const srcUrl of srcs) {
    const rel = manifestSrcToRelPosix(srcUrl);
    const from = sourcePath(rel);
    const to = destUnderGallery(rel);

    try {
      await stat(from);
    } catch {
      console.warn(`missing source: ${rel}`);
      continue;
    }

    if (path.resolve(from) === path.resolve(to)) {
      skipped += 1;
      continue;
    }

    await mkdir(path.dirname(to), { recursive: true });
    await copyFile(from, to);
    copied += 1;
  }

  console.log(`Copied ${copied} file(s) under public/images/gallery/. Skipped ${skipped} already in place.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
