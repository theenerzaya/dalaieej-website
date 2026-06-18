import { describe, expect, it } from "vitest";
import { parseBoundedInteger, parseDateOnly, validateStayDates } from "./booking-guards";

describe("booking guards", () => {
  it("accepts exact YYYY-MM-DD calendar dates", () => {
    const date = parseDateOnly("2026-07-01");
    expect(date?.toISOString()).toBe("2026-07-01T00:00:00.000Z");
  });

  it("rejects impossible or loosely formatted dates", () => {
    expect(parseDateOnly("2026-02-30")).toBeNull();
    expect(parseDateOnly("2026-7-1")).toBeNull();
    expect(parseDateOnly("not-a-date")).toBeNull();
  });

  it("requires checkout to be after check-in", () => {
    expect(validateStayDates("2026-07-01", "2026-07-01")).toEqual({
      ok: false,
      error: "Checkout must be after check-in",
    });
  });

  it("calculates stay nights in UTC date space", () => {
    expect(validateStayDates("2026-07-01", "2026-07-05")).toEqual({
      ok: true,
      nights: 4,
    });
  });

  it("caps unusually long stays", () => {
    expect(validateStayDates("2026-07-01", "2026-09-15", { maxNights: 30 })).toEqual({
      ok: false,
      error: "Stays longer than 30 nights require direct assistance",
    });
  });

  it("parses only whole bounded integers", () => {
    expect(parseBoundedInteger("2", { min: 1, max: 20, label: "adults" })).toBe(2);
    expect(parseBoundedInteger("2.5", { min: 1, max: 20, label: "adults" })).toBeNull();
    expect(parseBoundedInteger("2abc", { min: 1, max: 20, label: "adults" })).toBeNull();
    expect(parseBoundedInteger("0", { min: 1, max: 20, label: "adults" })).toBeNull();
  });
});
