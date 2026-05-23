#!/usr/bin/env node
/**
 * Parses public/Official_Access_Road_Dalai_Eej_Resort_GPS_Trace.kml → app/data/accessRoadTrace.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const kmlPath = join(
  root,
  "public/routes/official-access-road-dalai-eej.kml"
);
const outPath = join(root, "app/data/accessRoadTrace.json");

const kml = readFileSync(kmlPath, "utf8");

function parseLineString(xml) {
  const match = xml.match(/<LineString>[\s\S]*?<coordinates>\s*([\s\S]*?)\s*<\/coordinates>/);
  if (!match) throw new Error("No LineString coordinates found");
  return match[1]
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((triple) => {
      const [lng, lat] = triple.split(",").map(Number);
      return { lat, lng };
    });
}

function parsePointPlacemark(xml, name) {
  const re = new RegExp(
    `<Placemark[\\s\\S]*?<name>${name.replace(/[()]/g, "\\$&")}</name>[\\s\\S]*?<coordinates>\\s*([^<]+?)\\s*</coordinates>`,
    "i"
  );
  const m = xml.match(re);
  if (!m) return null;
  const [lng, lat] = m[1].trim().split(",").map(Number);
  return { lat, lng, name };
}

const path = parseLineString(kml);
const waypoints = [
  parsePointPlacemark(kml, "Main Road Turnoff (Access Start)"),
  parsePointPlacemark(kml, "Resort Main Gate (Access End)"),
  parsePointPlacemark(kml, "Resort Parking (End)"),
].filter(Boolean);

const lats = path.map((p) => p.lat);
const lngs = path.map((p) => p.lng);
const bounds = {
  north: Math.max(...lats),
  south: Math.min(...lats),
  east: Math.max(...lngs),
  west: Math.min(...lngs),
};

const data = {
  name: "Official Access Road — Dalai Eej Resort",
  kmlPath: "/routes/official-access-road-dalai-eej.kml",
  path,
  waypoints,
  bounds,
};

writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Wrote ${path.length} points and ${waypoints.length} waypoints → ${outPath}`);
