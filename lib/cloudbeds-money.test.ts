import { describe, expect, it } from "vitest";
import { parseCloudbedsMoney } from "./cloudbeds-money";

describe("parseCloudbedsMoney", () => {
  it("keeps Cloudbeds prices with thousands separators intact", () => {
    expect(parseCloudbedsMoney("52,000")).toBe(52000);
    expect(parseCloudbedsMoney("1,052,000.00")).toBe(1052000);
  });

  it("parses plain numbers and decimal strings", () => {
    expect(parseCloudbedsMoney(52000)).toBe(52000);
    expect(parseCloudbedsMoney("52000.50")).toBe(52000.5);
  });

  it("supports decimal comma values", () => {
    expect(parseCloudbedsMoney("52,50")).toBe(52.5);
  });
});
