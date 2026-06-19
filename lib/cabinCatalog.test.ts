import { describe, expect, it } from "vitest";
import { existsSync } from "fs";
import path from "path";
import {
  CABIN_CATALOG,
  getCanonicalCabinHrefFromRouteSlug,
  getCabinCatalogEntry,
  getCabinDisplayName,
  getCabinDetailHref,
  getCabinGallery,
  getCanonicalCabinPathForPathname,
  formatCabinStartingPrice,
  formatLowestCabinPriceFrom,
  getLowestCabinPriceFrom,
  resolveCabinSlugFromRouteSlug,
  resolveCabinSlugFromCloudbeds,
  type CabinSlug,
} from "./cabinCatalog";

describe("cabin catalog Cloudbeds mapping", () => {
  const cases: Array<[string, CabinSlug]> = [
    ["198039847624896", "superior-cabin"],
    ["EST", "triple-traditional-cabin"],
    ["196467430240449", "triple-traditional-cabin"],
    ["SCW", "lakeside-cabin"],
    ["198020352975040", "lakeside-cabin"],
    ["198036698427584", "triple-electric-cabin"],
    ["LDG", "signature-cabin"],
    ["197943412437120", "signature-cabin"],
    ["198046100787328", "quad-electric-cabin"],
    ["ESH", "grand-peninsula-suite"],
    ["198038298677377", "grand-peninsula-suite"],
    ["C", "camping"],
    ["198042256253056", "camping"],
  ];

  it.each(cases)("resolves Cloudbeds room type id %s", (roomTypeID, slug) => {
    expect(resolveCabinSlugFromCloudbeds(roomTypeID, "")).toBe(slug);
  });

  it("normalizes Cloudbeds per-room suffixes", () => {
    expect(resolveCabinSlugFromCloudbeds("198020352975040-1", "")).toBe("lakeside-cabin");
  });

  it("falls back to aliases when an id is unknown", () => {
    expect(resolveCabinSlugFromCloudbeds("unknown", "Ерөнхийлөгчийн Хаус")).toBe(
      "superior-cabin"
    );
    expect(resolveCabinSlugFromCloudbeds("unknown", "Grand Peninsula Suite")).toBe(
      "grand-peninsula-suite"
    );
  });

  it("prefers Cloudbeds display names over local fallback names", () => {
    expect(getCabinDisplayName("lakeside-cabin", "en", "Cloudbeds Lakeside Name")).toBe(
      "Cloudbeds Lakeside Name"
    );
  });

  it("keeps local galleries attached to the resolved slug", () => {
    expect(getCabinGallery("quad-electric-cabin")[0]).toBe(
      "/images/rooms/quad-electric-cabin/00.webp"
    );
  });

  it("only references public image assets that exist", () => {
    for (const cabin of CABIN_CATALOG) {
      for (const src of [cabin.cardImage, ...cabin.gallery]) {
        if (!src.startsWith("/")) continue;
        expect(existsSync(path.join(process.cwd(), "public", src))).toBe(true);
      }
    }
  });

  it("uses cleaned canonical room URLs", () => {
    expect(getCabinDetailHref("superior-cabin")).toBe("/superior-cabin");
    expect(getCabinDetailHref("signature-cabin")).toBe("/simple-stay");
    expect(getCabinDetailHref("grand-peninsula-suite")).toBe("/family-house-wood-fired");
    expect(getCabinDetailHref("camping")).toBe("/traveler-camp");
  });

  it("resolves legacy and canonical route slugs to the same cabin", () => {
    expect(resolveCabinSlugFromRouteSlug("superior-cabin")).toBe("superior-cabin");
    expect(resolveCabinSlugFromRouteSlug("ikh-urguu")).toBe("superior-cabin");
    expect(getCanonicalCabinHrefFromRouteSlug("ikh-urguu")).toBe("/superior-cabin");
    expect(getCanonicalCabinPathForPathname("/en/ikh-urguu")).toBe("/en/superior-cabin");
    expect(getCanonicalCabinPathForPathname("/en/superior-cabin")).toBeNull();
    expect(resolveCabinSlugFromRouteSlug("simple-stay")).toBe("signature-cabin");
    expect(resolveCabinSlugFromRouteSlug("signature-cabin")).toBe("signature-cabin");
    expect(getCanonicalCabinHrefFromRouteSlug("signature-cabin")).toBe("/simple-stay");
  });

  it("uses MNT starting prices instead of stale dollar display values", () => {
    expect(getLowestCabinPriceFrom()).toEqual({ amount: 250000, currency: "MNT" });
    expect(formatLowestCabinPriceFrom("en")).toBe("From MNT 250,000/night");
    expect(formatLowestCabinPriceFrom("mn")).toBe("1 шөнө 250,000 төг-өөс");
  });

  it("keeps room-type fallback starting prices aligned with the room inventory", () => {
    expect(getCabinCatalogEntry("superior-cabin")?.priceFrom).toEqual({ amount: 980000, currency: "MNT" });
    expect(getCabinCatalogEntry("triple-traditional-cabin")?.priceFrom).toEqual({ amount: 690000, currency: "MNT" });
    expect(getCabinCatalogEntry("lakeside-cabin")?.priceFrom).toEqual({ amount: 550000, currency: "MNT" });
    expect(getCabinCatalogEntry("triple-electric-cabin")?.priceFrom).toEqual({ amount: 690000, currency: "MNT" });
    expect(getCabinCatalogEntry("signature-cabin")?.priceFrom).toEqual({ amount: 250000, currency: "MNT" });
    expect(getCabinCatalogEntry("quad-electric-cabin")?.priceFrom).toEqual({ amount: 850000, currency: "MNT" });
    expect(getCabinCatalogEntry("grand-peninsula-suite")?.priceFrom).toEqual({ amount: 850000, currency: "MNT" });
    expect(getCabinCatalogEntry("camping")?.priceFrom).toBeNull();
  });

  it("formats individual MNT starting prices by locale", () => {
    expect(formatCabinStartingPrice({ amount: 980000, currency: "MNT" }, "en")).toBe(
      "MNT 980,000"
    );
    expect(formatCabinStartingPrice({ amount: 980000, currency: "MNT" }, "mn")).toBe(
      "980,000 төг"
    );
  });
});
