import { describe, expect, it } from "vitest";
import { CABIN_CLOUDBEDS_FACTS } from "./cabinCloudbedsSnapshot";

describe("cabin Cloudbeds snapshot room sizes", () => {
  it("keeps Notion-derived room sizes attached to the matching room types", () => {
    expect(CABIN_CLOUDBEDS_FACTS["superior-cabin"].roomSizeLabel?.en).toBe("50 m\u00b2");
    expect(CABIN_CLOUDBEDS_FACTS["triple-traditional-cabin"].roomSizeLabel?.en).toBe("25-30 m\u00b2");
    expect(CABIN_CLOUDBEDS_FACTS["lakeside-cabin"].roomSizeLabel?.en).toBe("40 m\u00b2");
    expect(CABIN_CLOUDBEDS_FACTS["triple-electric-cabin"].roomSizeLabel?.en).toBe("20 m\u00b2");
    expect(CABIN_CLOUDBEDS_FACTS["quad-electric-cabin"].roomSizeLabel?.en).toBe("25 m\u00b2");
    expect(CABIN_CLOUDBEDS_FACTS["grand-peninsula-suite"].roomSizeLabel?.en).toBe("35 m\u00b2");
  });

  it("does not invent room sizes where Notion has no square meter value", () => {
    expect(CABIN_CLOUDBEDS_FACTS["signature-cabin"].roomSizeLabel).toBeUndefined();
    expect(CABIN_CLOUDBEDS_FACTS.camping.roomSizeLabel).toBeUndefined();
  });
});

describe("cabin Cloudbeds snapshot layouts", () => {
  it("keeps the corrected bed layouts for cabins 7 and 12", () => {
    expect(CABIN_CLOUDBEDS_FACTS["superior-cabin"].bedLabel.en).toBe(
      "2 double beds + 1 single bed",
    );
    expect(CABIN_CLOUDBEDS_FACTS["triple-electric-cabin"].bedLabel.en).toBe(
      "1 double + 1 single bed",
    );
    expect(CABIN_CLOUDBEDS_FACTS["triple-electric-cabin"].maxGuests).toBe(3);
    expect(CABIN_CLOUDBEDS_FACTS["triple-electric-cabin"].guestLabel.en).toBe(
      "Up to 3 guests",
    );
  });
});

describe("cabin Cloudbeds snapshot equipment", () => {
  it("keeps Notion-derived room equipment attached to the matching room types", () => {
    expect(CABIN_CLOUDBEDS_FACTS["superior-cabin"].equipmentLabels.map((x) => x.en)).toEqual([
      "Lake view",
      "TV",
      "Toilet inside",
    ]);
    expect(CABIN_CLOUDBEDS_FACTS["triple-electric-cabin"].equipmentLabels.map((x) => x.en)).toEqual([
      "Electric heater",
      "Toilet inside",
    ]);
    expect(CABIN_CLOUDBEDS_FACTS["triple-traditional-cabin"].equipmentLabels.map((x) => x.en)).toContain(
      "Select units with TV",
    );
  });

  it("does not expose Notion-only closed inventory as public equipment", () => {
    for (const fact of Object.values(CABIN_CLOUDBEDS_FACTS)) {
      expect(fact.equipmentLabels.map((x) => x.en)).not.toContain("Closed");
      expect(fact.equipmentLabels.map((x) => x.mn)).not.toContain("Closed");
    }
  });
});

describe("cabin Cloudbeds snapshot copy", () => {
  it("keeps customer-facing descriptions plain and editorial", () => {
    const rawProviderPattern = /<[^>]+>|&nbsp;|\|/;
    for (const fact of Object.values(CABIN_CLOUDBEDS_FACTS)) {
      expect(fact.shortDescription.en).not.toMatch(rawProviderPattern);
      expect(fact.shortDescription.mn).not.toMatch(rawProviderPattern);
      expect(fact.description.en).not.toMatch(rawProviderPattern);
      expect(fact.description.mn).not.toMatch(rawProviderPattern);
    }
  });
});
