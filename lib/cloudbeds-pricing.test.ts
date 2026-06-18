import { describe, expect, it } from "vitest";
import {
  extraChargeForGuestCount,
  flattenExtraChargeMap,
  stayTotalForRoom,
} from "./cloudbeds-pricing";

describe("cloudbeds pricing helpers", () => {
  it("flattens Cloudbeds extra-charge maps with formatted money values", () => {
    expect(flattenExtraChargeMap([{ 2: "52,000" }, { 3: "104,000.00" }])).toEqual({
      2: 52000,
      3: 104000,
    });
  });

  it("uses the closest lower occupancy extra when an exact count is absent", () => {
    expect(extraChargeForGuestCount({ 2: 52000, 4: 120000 }, 3)).toBe(52000);
  });

  it("quotes room stay totals with adult and child occupancy extras", () => {
    expect(
      stayTotalForRoom(
        {
          roomRate: "1,000,000",
          adultsExtraCharge: { 2: "50,000" },
          childrenExtraCharge: { 1: "20,000" },
        },
        2,
        1
      )
    ).toBe(1070000);
  });
});
