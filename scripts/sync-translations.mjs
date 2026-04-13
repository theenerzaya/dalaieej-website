#!/usr/bin/env node

/**
 * Translation sync script using Google Gemini.
 * Diffs en.json vs mn.json, translates missing keys, and merges them back.
 *
 * Usage:  node scripts/sync-translations.mjs          (dry-run)
 *         node scripts/sync-translations.mjs --run     (translate & write)
 *
 * Requires GEMINI_API_KEY in .env.local
 */

import { readFile, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { config } from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

config({ path: path.resolve(process.cwd(), ".env.local") });

const MESSAGES_DIR = path.resolve(process.cwd(), "messages");
const EN_PATH = path.join(MESSAGES_DIR, "en.json");
const MN_PATH = path.join(MESSAGES_DIR, "mn.json");
const DRY_RUN = !process.argv.includes("--run");

function flattenKeys(obj, prefix = "") {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value)) {
      result[fullKey] = value;
    } else if (typeof value === "object" && value !== null) {
      Object.assign(result, flattenKeys(value, fullKey));
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

function extractByDotKeys(obj, dotKey) {
  const parts = dotKey.split(".");
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return current;
}

function setByDotKey(obj, dotKey, value) {
  const parts = dotKey.split(".");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in current) || typeof current[parts[i]] !== "object") {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

function rebuildInOrder(source, target) {
  if (Array.isArray(source)) {
    return Array.isArray(target) ? target : source;
  }
  if (typeof source !== "object" || source === null) {
    return target !== undefined ? target : source;
  }
  const result = {};
  for (const key of Object.keys(source)) {
    if (key in (target || {})) {
      result[key] = rebuildInOrder(source[key], target[key]);
    } else if (target && key in target) {
      result[key] = target[key];
    }
  }
  if (target && typeof target === "object") {
    for (const key of Object.keys(target)) {
      if (!(key in result)) {
        result[key] = target[key];
      }
    }
  }
  return result;
}

async function translateWithGemini(missingFlat, existingMnJson) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("\n  GEMINI_API_KEY not found in .env.local");
    console.error("  Get a free key at: https://aistudio.google.com/apikey\n");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const missingObj = {};
  for (const [dotKey, value] of Object.entries(missingFlat)) {
    setByDotKey(missingObj, dotKey, value);
  }

  const prompt = `You are a professional English-to-Mongolian translator for a luxury lakeside resort website (Dalai Eej Resort on Lake Khuvsgul, Mongolia).

EXISTING MONGOLIAN TRANSLATIONS (for tone/style reference):
${JSON.stringify(existingMnJson, null, 2).slice(0, 4000)}

TRANSLATE THE FOLLOWING English JSON keys to Mongolian (Cyrillic script).

RULES:
- Output ONLY valid JSON — no markdown fences, no commentary
- Preserve the exact JSON structure and key names (do NOT translate keys)
- Preserve template variables like {count}, {name} exactly as-is
- Match the warm, refined, heritage-focused brand voice of the existing translations
- Use natural Mongolian — not word-for-word translation
- For arrays, translate each element maintaining the same array length

JSON TO TRANSLATE:
${JSON.stringify(missingObj, null, 2)}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  const jsonMatch = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");

  try {
    return JSON.parse(jsonMatch);
  } catch (e) {
    console.error("\n  Failed to parse Gemini response as JSON.");
    console.error("  Raw response:\n", text.slice(0, 500));
    process.exit(1);
  }
}

async function main() {
  console.log(DRY_RUN ? "\n  DRY RUN (pass --run to translate & write)\n" : "\n  TRANSLATING (changes will be saved)\n");

  const en = JSON.parse(await readFile(EN_PATH, "utf-8"));
  const mn = JSON.parse(await readFile(MN_PATH, "utf-8"));

  const enFlat = flattenKeys(en);
  const mnFlat = flattenKeys(mn);

  const missingFlat = {};
  let missingCount = 0;
  for (const [key, value] of Object.entries(enFlat)) {
    if (!(key in mnFlat)) {
      missingFlat[key] = value;
      missingCount++;
    }
  }

  const extraKeys = [];
  for (const key of Object.keys(mnFlat)) {
    if (!(key in enFlat)) {
      extraKeys.push(key);
    }
  }

  if (missingCount === 0 && extraKeys.length === 0) {
    console.log("  All keys are in sync. Nothing to do.\n");
    return;
  }

  if (missingCount > 0) {
    console.log(`  ${missingCount} key(s) in en.json missing from mn.json:\n`);
    for (const key of Object.keys(missingFlat)) {
      const val = typeof missingFlat[key] === "string"
        ? missingFlat[key].slice(0, 60) + (missingFlat[key].length > 60 ? "..." : "")
        : JSON.stringify(missingFlat[key]).slice(0, 60);
      console.log(`    + ${key}`);
      console.log(`      "${val}"`);
    }
  }

  if (extraKeys.length > 0) {
    console.log(`\n  ${extraKeys.length} key(s) in mn.json not in en.json (orphaned):\n`);
    for (const key of extraKeys) {
      console.log(`    - ${key}`);
    }
  }

  if (DRY_RUN) {
    if (missingCount > 0) {
      console.log(`\n  Run with --run to translate these ${missingCount} key(s) via Gemini.\n`);
    }
    return;
  }

  if (missingCount > 0) {
    console.log("\n  Calling Gemini API...");
    const translated = await translateWithGemini(missingFlat, mn);

    const translatedFlat = flattenKeys(translated);
    for (const [dotKey, value] of Object.entries(translatedFlat)) {
      setByDotKey(mn, dotKey, value);
    }

    console.log(`  Received ${Object.keys(translatedFlat).length} translation(s).\n`);

    for (const [key, value] of Object.entries(translatedFlat)) {
      const display = typeof value === "string"
        ? value.slice(0, 60) + (value.length > 60 ? "..." : "")
        : JSON.stringify(value).slice(0, 60);
      console.log(`    ${key}`);
      console.log(`      → "${display}"`);
    }

    const ordered = rebuildInOrder(en, mn);

    await copyFile(MN_PATH, MN_PATH + ".bak");
    console.log("\n  Backed up mn.json → mn.json.bak");

    await writeFile(MN_PATH, JSON.stringify(ordered, null, 2) + "\n", "utf-8");
    console.log("  Wrote updated mn.json");
  }

  console.log("\n  Done.\n");
}

main().catch((err) => {
  console.error("  Error:", err.message);
  process.exit(1);
});
