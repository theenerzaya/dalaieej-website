#!/usr/bin/env node

/**
 * Batch image optimizer using sharp.
 * Converts JPG/PNG originals to compressed WebP and keeps optimized fallbacks.
 *
 * Usage:  node scripts/optimize-images.mjs          (dry-run by default)
 *         node scripts/optimize-images.mjs --run     (actually optimize)
 *
 * What it does:
 *   1. Scans public/ for JPG and PNG files
 *   2. Resizes any image wider than MAX_WIDTH (default 2048px)
 *   3. Re-encodes JPGs at quality 80, PNGs with compression level 9
 *   4. Skips files that are already small (< 50 KB)
 *   5. Only overwrites if the new file is actually smaller
 */

import { readdir, stat, rename, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const MAX_WIDTH = 2048;
const SKIP_UNDER_KB = 50;
const JPG_QUALITY = 80;
const PNG_COMPRESSION = 9;
const DRY_RUN = !process.argv.includes("--run");

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function optimizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const info = await stat(filePath);
  const originalSize = info.size;

  if (originalSize < SKIP_UNDER_KB * 1024) {
    return { skipped: true, reason: "already small" };
  }

  const image = sharp(filePath);
  const metadata = await image.metadata();

  let pipeline = sharp(filePath);

  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: PNG_COMPRESSION, adaptiveFiltering: true });
  } else {
    pipeline = pipeline.jpeg({ quality: JPG_QUALITY, mozjpeg: true });
  }

  const tmpPath = filePath + ".optimized";
  await pipeline.toFile(tmpPath);

  const newInfo = await stat(tmpPath);
  const newSize = newInfo.size;
  const saved = originalSize - newSize;
  const pct = ((saved / originalSize) * 100).toFixed(1);

  if (newSize >= originalSize) {
    await unlink(tmpPath);
    return { skipped: true, reason: "already optimal" };
  }

  if (!DRY_RUN) {
    await unlink(filePath);
    await rename(tmpPath, filePath);
  } else {
    await unlink(tmpPath);
  }

  return {
    skipped: false,
    originalSize,
    newSize,
    saved,
    pct,
    resized: metadata.width > MAX_WIDTH,
  };
}

async function main() {
  console.log(DRY_RUN ? "\n🔍  DRY RUN (pass --run to apply)\n" : "\n🚀  OPTIMIZING (changes will be saved)\n");

  const files = await walk(PUBLIC_DIR);
  console.log(`Found ${files.length} images to check.\n`);

  let totalSaved = 0;
  let optimizedCount = 0;

  for (const file of files) {
    const rel = path.relative(PUBLIC_DIR, file);
    try {
      const result = await optimizeFile(file);
      if (result.skipped) {
        console.log(`  SKIP  ${rel}  (${result.reason})`);
      } else {
        console.log(
          `  ✅  ${rel}  ${humanSize(result.originalSize)} → ${humanSize(result.newSize)}  (-${result.pct}%)${result.resized ? "  [resized]" : ""}`
        );
        totalSaved += result.saved;
        optimizedCount++;
      }
    } catch (err) {
      console.log(`  ❌  ${rel}  ${err.message}`);
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`  ${optimizedCount} files optimized, ${humanSize(totalSaved)} saved total`);
  if (DRY_RUN && totalSaved > 0) {
    console.log(`  Run with --run to apply these changes.`);
  }
  console.log();
}

main();
