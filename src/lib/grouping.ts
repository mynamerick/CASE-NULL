/**
 * Day separators inside a list used to be computed by mutating a `lastDay`
 * variable while mapping. That reads fine and works, but it mutates during
 * render, which breaks under the React compiler and concurrent re-entry.
 *
 * This does the same job as a pure pass.
 */
export interface Grouped<T> {
  item: T;
  /** Group key for this row. */
  group: string;
  /** True when this row is the first of its group and should show a heading. */
  startsGroup: boolean;
}

export function withGroupBreaks<T>(
  items: readonly T[],
  keyOf: (item: T) => string,
): Grouped<T>[] {
  let previous: string | null = null;
  return items.map((item) => {
    const group = keyOf(item);
    const startsGroup = group !== previous;
    previous = group;
    return { item, group, startsGroup };
  });
}
