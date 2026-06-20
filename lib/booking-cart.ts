export type BookingCartLine = {
  id: string;
  maxGuests: number;
  maxAdults?: number;
  adults: number;
  children: number;
};

export const MAX_BOOKING_ADULTS = 20;
export const MAX_BOOKING_CHILDREN = 10;
export const MAX_BOOKING_GUESTS = 20;
export const MAX_BOOKING_ROOMS = 10;

export function sumCartAdults<T extends Pick<BookingCartLine, "adults">>(lines: T[]): number {
  return lines.reduce((sum, item) => sum + item.adults, 0);
}

export function sumCartChildren<T extends Pick<BookingCartLine, "children">>(lines: T[]): number {
  return lines.reduce((sum, item) => sum + item.children, 0);
}

/** Sensible defaults when adding another cabin (prefer 2 adults when party allows). */
export function defaultGuestsForNewUnit(
  maxGuests: number,
  remainingAdults: number,
  remainingChildren: number
): { adults: number; children: number } {
  if (remainingAdults <= 0 && remainingChildren <= 0) {
    return { adults: 0, children: 0 };
  }
  const adults = Math.min(maxGuests, Math.max(0, Math.min(2, remainingAdults)));
  const children = Math.min(remainingChildren, Math.max(0, maxGuests - adults));
  return { adults, children };
}

export function normalizeCartGuestAssignments<T extends BookingCartLine>(
  lines: T[],
  totalAdults: number,
  totalChildren: number
): T[] {
  const adultTotal = Math.max(1, totalAdults);
  const childTotal = Math.max(0, totalChildren);
  const kept = lines.slice(0, adultTotal);

  let remainingAdults = adultTotal - kept.length;
  let remainingChildren = childTotal;
  const normalized = kept.map((item) => ({
    ...item,
    adults: 1,
    children: 0,
  }));

  const distributeAdults = (respectExisting: boolean) => {
    for (let index = 0; index < normalized.length && remainingAdults > 0; index += 1) {
      const item = normalized[index];
      const original = kept[index];
      const wanted = respectExisting
        ? Math.max(0, original.adults - item.adults)
        : remainingAdults;
      const availableCapacity = Math.max(0, item.maxGuests - item.adults - item.children);
      const lineMaxAdults = item.maxAdults ?? item.maxGuests;
      const availableAdultCapacity = Math.max(0, lineMaxAdults - item.adults);
      const add = Math.min(wanted, availableCapacity, availableAdultCapacity, remainingAdults);
      if (add <= 0) continue;
      item.adults += add;
      remainingAdults -= add;
    }
  };

  const distributeChildren = (respectExisting: boolean) => {
    for (let index = 0; index < normalized.length && remainingChildren > 0; index += 1) {
      const item = normalized[index];
      const original = kept[index];
      const wanted = respectExisting
        ? Math.max(0, original.children - item.children)
        : remainingChildren;
      const availableCapacity = Math.max(0, item.maxGuests - item.adults - item.children);
      const add = Math.min(wanted, availableCapacity, remainingChildren);
      if (add <= 0) continue;
      item.children += add;
      remainingChildren -= add;
    }
  };

  distributeAdults(true);
  distributeAdults(false);
  distributeChildren(true);
  distributeChildren(false);

  return normalized;
}

export function cartGuestAssignmentsMatch<T extends BookingCartLine>(a: T[], b: T[]): boolean {
  return (
    a.length === b.length &&
    a.every((item, index) => {
      const other = b[index];
      return (
        other &&
        item.id === other.id &&
        item.adults === other.adults &&
        item.children === other.children
      );
    })
  );
}

export function applyCartLineGuestDelta<T extends BookingCartLine>(
  lines: T[],
  lineId: string,
  field: "adults" | "children",
  delta: number,
  maxAdults = MAX_BOOKING_ADULTS,
  maxChildren = MAX_BOOKING_CHILDREN,
  maxGuests = MAX_BOOKING_GUESTS
): T[] {
  const line = lines.find((item) => item.id === lineId);
  if (!line) return lines;

  let adults = line.adults;
  let children = line.children;
  const otherLines = lines.filter((item) => item.id !== lineId);
  const otherAdults = sumCartAdults(otherLines);
  const otherChildren = sumCartChildren(otherLines);
  const maxAdultsForLine = Math.max(0, maxAdults - otherAdults);
  const maxChildrenForLine = Math.max(0, maxChildren - otherChildren);
  const otherGuests = otherAdults + otherChildren;

  if (field === "adults") {
    const maxGuestsForAdults = Math.max(0, maxGuests - otherGuests - children);
    const lineMaxAdults = line.maxAdults ?? line.maxGuests;
    adults = Math.max(
      1,
      Math.min(
        line.maxGuests - children,
        lineMaxAdults,
        maxAdultsForLine,
        maxGuestsForAdults,
        adults + delta
      )
    );
  } else {
    const maxGuestsForChildren = Math.max(0, maxGuests - otherGuests - adults);
    children = Math.max(
      0,
      Math.min(
        line.maxGuests - adults,
        maxChildrenForLine,
        maxGuestsForChildren,
        children + delta
      )
    );
  }

  if (adults === line.adults && children === line.children) return lines;

  const updated = { ...line, adults, children };
  return lines.map((item) => (item.id === lineId ? updated : item));
}
