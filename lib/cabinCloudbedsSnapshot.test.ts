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
