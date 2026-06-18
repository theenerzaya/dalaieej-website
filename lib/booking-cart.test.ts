import { describe, expect, it } from "vitest";
import {
  applyCartLineGuestDelta,
  cartGuestAssignmentsMatch,
  defaultGuestsForNewUnit,
  normalizeCartGuestAssignments,
  sumCartAdults,
  sumCartChildren,
  type BookingCartLine,
} from "./booking-cart";

function line(
  id: string,
  maxGuests: number,
  adults: number,
  children = 0
): BookingCartLine {
  return { id, maxGuests, adults, children };
}

function assignments(lines: BookingCartLine[]) {
  return lines.map((item) => [item.adults, item.children]);
}

function capacity(lines: BookingCartLine[]) {
  return lines.reduce((sum, item) => sum + item.maxGuests, 0);
}

describe("booking cart guest assignment", () => {
  it("does not invent guests when adding a cabin after the party is assigned", () => {
    expect(defaultGuestsForNewUnit(3, 0, 0)).toEqual({ adults: 0, children: 0 });
  });

  it("assigns a three-adult party to one selected cabin", () => {
    const normalized = normalizeCartGuestAssignments([line("a", 3, 2)], 3, 0);

    expect(assignments(normalized)).toEqual([[3, 0]]);
    expect(sumCartAdults(normalized)).toBe(3);
    expect(sumCartChildren(normalized)).toBe(0);
  });

  it("splits three adults across two same-rate cabins instead of over-assigning", () => {
    const normalized = normalizeCartGuestAssignments(
      [line("a", 3, 3), line("b", 3, 0)],
      3,
      0
    );

    expect(assignments(normalized)).toEqual([
      [2, 0],
      [1, 0],
    ]);
    expect(sumCartAdults(normalized)).toBe(3);
  });

  it("keeps two adults and one child within the party total across two cabins", () => {
    const normalized = normalizeCartGuestAssignments(
      [line("a", 3, 2, 1), line("b", 3, 0)],
      2,
      1
    );

    expect(assignments(normalized)).toEqual([
      [1, 1],
      [1, 0],
    ]);
    expect(sumCartAdults(normalized)).toBe(2);
    expect(sumCartChildren(normalized)).toBe(1);
  });

  it("supports five adults across two family cabins", () => {
    const normalized = normalizeCartGuestAssignments(
      [line("a", 5, 3), line("b", 5, 2)],
      5,
      0
    );

    expect(assignments(normalized)).toEqual([
      [3, 0],
      [2, 0],
    ]);
    expect(sumCartAdults(normalized)).toBe(5);
  });

  it("redistributes guests to the remaining cabin after removing a cabin", () => {
    const normalized = normalizeCartGuestAssignments([line("a", 3, 2)], 3, 0);

    expect(assignments(normalized)).toEqual([[3, 0]]);
  });

  it("drops extra cabin lines when there are not enough adults for each cabin", () => {
    const normalized = normalizeCartGuestAssignments(
      [line("a", 3, 1), line("b", 3, 1), line("c", 3, 1)],
      2,
      0
    );

    expect(normalized.map((item) => item.id)).toEqual(["a", "b"]);
    expect(assignments(normalized)).toEqual([
      [1, 0],
      [1, 0],
    ]);
  });

  it("prevents adult increments beyond the party total", () => {
    const cart = [line("a", 3, 2), line("b", 3, 1)];
    const next = applyCartLineGuestDelta(cart, "a", "adults", 1, 3, 0);

    expect(assignments(next)).toEqual([
      [2, 0],
      [1, 0],
    ]);
    expect(next).toBe(cart);
  });

  it("prevents child increments beyond the party total", () => {
    const cart = [line("a", 3, 1, 1), line("b", 3, 1, 0)];
    const next = applyCartLineGuestDelta(cart, "b", "children", 1, 2, 1);

    expect(assignments(next)).toEqual([
      [1, 1],
      [1, 0],
    ]);
    expect(next).toBe(cart);
  });

  it("allows moving one adult between cabins by decrementing then incrementing", () => {
    const cart = [line("a", 3, 2), line("b", 3, 1)];
    const afterDecrease = applyCartLineGuestDelta(cart, "a", "adults", -1, 3, 0);
    const afterIncrease = applyCartLineGuestDelta(afterDecrease, "b", "adults", 1, 3, 0);

    expect(assignments(afterIncrease)).toEqual([
      [1, 0],
      [2, 0],
    ]);
  });

  it("detects whether cart assignments changed", () => {
    const cart = [line("a", 3, 2), line("b", 3, 1)];

    expect(cartGuestAssignmentsMatch(cart, [line("a", 3, 2), line("b", 3, 1)])).toBe(true);
    expect(cartGuestAssignmentsMatch(cart, [line("a", 3, 1), line("b", 3, 2)])).toBe(false);
  });

  it("keeps assignments valid across many party sizes, cabin counts and capacities", () => {
    const capacitySets = [
      [2],
      [3],
      [5],
      [12],
      [2, 2],
      [3, 3],
      [5, 5],
      [2, 3, 5],
      [3, 3, 3],
      [2, 2, 2, 2],
      [3, 5, 12],
    ];

    for (const capacities of capacitySets) {
      for (let adults = 1; adults <= 8; adults += 1) {
        for (let children = 0; children <= 4; children += 1) {
          const raw = capacities.map((maxGuests, index) =>
            line(
              `room-${index}`,
              maxGuests,
              Math.min(maxGuests, adults),
              Math.min(Math.max(0, maxGuests - 1), children)
            )
          );
          const normalized = normalizeCartGuestAssignments(raw, adults, children);
          const assignedAdults = sumCartAdults(normalized);
          const assignedChildren = sumCartChildren(normalized);
          const selectedCapacity = capacity(raw.slice(0, adults));
          const assignableAdults = Math.min(adults, selectedCapacity);
          const assignableChildren =
            assignedAdults === adults
              ? Math.min(children, Math.max(0, selectedCapacity - adults))
              : 0;

          expect(normalized.length).toBeLessThanOrEqual(raw.length);
          expect(normalized.length).toBeLessThanOrEqual(adults);
          expect(assignedAdults).toBe(assignableAdults);
          expect(assignedChildren).toBe(assignableChildren);

          for (const item of normalized) {
            expect(item.adults).toBeGreaterThanOrEqual(1);
            expect(item.children).toBeGreaterThanOrEqual(0);
            expect(item.adults + item.children).toBeLessThanOrEqual(item.maxGuests);
          }
        }
      }
    }
  });

  it("keeps manual plus/minus changes valid across many carts", () => {
    for (let adults = 1; adults <= 8; adults += 1) {
      for (let children = 0; children <= 4; children += 1) {
        const normalized = normalizeCartGuestAssignments(
          [line("a", 3, adults, children), line("b", 5, adults, children)],
          adults,
          children
        );

        for (const item of normalized) {
          for (const field of ["adults", "children"] as const) {
            for (const delta of [-1, 1]) {
              const next = applyCartLineGuestDelta(
                normalized,
                item.id,
                field,
                delta,
                adults,
                children
              );

              expect(sumCartAdults(next)).toBeLessThanOrEqual(adults);
              expect(sumCartChildren(next)).toBeLessThanOrEqual(children);
              for (const lineItem of next) {
                expect(lineItem.adults).toBeGreaterThanOrEqual(1);
                expect(lineItem.children).toBeGreaterThanOrEqual(0);
                expect(lineItem.adults + lineItem.children).toBeLessThanOrEqual(
                  lineItem.maxGuests
                );
              }
            }
          }
        }
      }
    }
  });
});
