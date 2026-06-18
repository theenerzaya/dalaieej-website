import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_MNT_TO_EUR_RATE, getMntToEurRate, mntToEurCents } from "./payment-amounts";

describe("payment amount conversion", () => {
  afterEach(() => {
    delete process.env.STRIPE_MNT_TO_EUR_RATE;
    delete process.env.MNT_TO_EUR_RATE;
  });

  it("uses the default MNT to EUR rate when none is configured", () => {
    expect(getMntToEurRate()).toBe(DEFAULT_MNT_TO_EUR_RATE);
  });

  it("allows the Stripe conversion rate to be configured", () => {
    process.env.STRIPE_MNT_TO_EUR_RATE = "4000";
    expect(getMntToEurRate()).toBe(4000);
    expect(mntToEurCents(4000)).toBe(100);
  });

  it("converts MNT to EUR cents using the selected rate", () => {
    expect(mntToEurCents(3700, 3700)).toBe(100);
    expect(mntToEurCents(1850, 3700)).toBe(50);
  });
});
