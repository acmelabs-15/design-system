export type StackRectangle = Readonly<{ x: number; y: number; width: number; height: number }>;
export type StackMemberRectangle = StackRectangle & Readonly<{ order: number; index: number }>;
type Options = Readonly<{
  vertical: boolean;
  reverse: boolean;
  rtl: boolean;
  wrap: boolean;
  thickness: number;
  crossStart: number;
  crossSize: number;
}>;

/** Finds same-line neighbors from native layout without moving or cloning their elements. */
export function stackSeparatorRectangles(members: readonly StackMemberRectangle[], options: Options): readonly StackRectangle[] {
  if (options.thickness <= 0) return Object.freeze([]);
  const main = (rect: StackRectangle) => (options.vertical ? rect.y : rect.x);
  const mainSize = (rect: StackRectangle) => (options.vertical ? rect.height : rect.width);
  const cross = (rect: StackRectangle) => (options.vertical ? rect.x : rect.y);
  const crossSize = (rect: StackRectangle) => (options.vertical ? rect.width : rect.height);
  const backwards = options.vertical ? options.reverse : options.reverse !== options.rtl;
  const leading = (rect: StackRectangle) => (backwards ? -(main(rect) + mainSize(rect)) : main(rect));
  const ordered = [...members].sort((a, b) => a.order - b.order || a.index - b.index);
  const lines: StackMemberRectangle[][] = [];
  let previous: StackMemberRectangle | undefined;
  for (const member of ordered) {
    const separateCross = previous && (cross(member) >= cross(previous) + crossSize(previous) || cross(previous) >= cross(member) + crossSize(member));
    const reset = previous && (leading(member) < leading(previous) - 0.1 || (Math.abs(leading(member) - leading(previous)) < 0.1 && separateCross && cross(member) !== cross(previous)));
    if (!previous || (options.wrap && reset)) lines.push([]);
    lines.at(-1)!.push(member);
    previous = member;
  }
  const separators: StackRectangle[] = [];
  for (const line of lines) {
    line.sort((a, b) => main(a) - main(b) || mainSize(a) - mainSize(b));
    const start = options.wrap ? Math.min(...line.map(cross)) : options.crossStart;
    const end = options.wrap ? Math.max(...line.map((member) => cross(member) + crossSize(member))) : start + options.crossSize;
    for (let index = 1; index < line.length; index++) {
      const before = line[index - 1],
        after = line[index];
      const gapStart = main(before) + mainSize(before),
        gapEnd = main(after);
      if (gapEnd < gapStart) continue;
      const position = (gapStart + gapEnd - options.thickness) / 2;
      separators.push(
        Object.freeze(
          options.vertical
            ? { x: start, y: position, width: Math.max(0, end - start), height: options.thickness }
            : { x: position, y: start, width: options.thickness, height: Math.max(0, end - start) },
        ),
      );
    }
  }
  return Object.freeze(separators);
}
