export type Pane = Readonly<{ value: string; minSize?: number; maxSize?: number; defaultSize?: number; collapsible?: boolean; collapsedSize?: number }>;
export type Layout = Readonly<{ sizes: Readonly<Record<string, number>>; collapsed: readonly string[]; previousSizes: Readonly<Record<string, number>> }>;
const EPS = 1e-8;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const own = (record: Readonly<Record<string, number>> | undefined, key: string) => (record && Object.hasOwn(record, key) ? record[key] : undefined);
function percentage(value: number, name: string) {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError(name + " must be a percentage between 0 and 100");
  }
  return value;
}
export function validatePanes(panes: readonly Pane[]): void {
  const keys = new Set<string>();
  for (const pane of panes) {
    if (typeof pane.value !== "string" || !pane.value.trim() || keys.has(pane.value)) {
      throw new TypeError("Pane values must be nonempty and unique");
    }
    keys.add(pane.value);
    const min = percentage(pane.minSize ?? 0, "minSize"),
      max = percentage(pane.maxSize ?? 100, "maxSize"),
      closed = percentage(pane.collapsedSize ?? 0, "collapsedSize");
    if (min > max || closed > min) {
      throw new RangeError("Pane limits are inconsistent");
    }
    if (pane.defaultSize !== undefined) {
      percentage(pane.defaultSize, "defaultSize");
    }
  }
}
function bounds(pane: Pane, collapsed: ReadonlySet<string>): readonly [number, number] {
  return collapsed.has(pane.value) ? [pane.collapsedSize ?? 0, pane.collapsedSize ?? 0] : [pane.minSize ?? 0, pane.maxSize ?? 100];
}
function snapshot(panes: readonly Pane[], sizes: readonly number[], collapsed: ReadonlySet<string>, previous: Readonly<Record<string, number>> = {}): Layout {
  return Object.freeze({
    sizes: Object.freeze(Object.fromEntries(panes.map((p, i) => [p.value, sizes[i]]))),
    collapsed: Object.freeze(panes.filter((p) => collapsed.has(p.value)).map((p) => p.value)),
    previousSizes: Object.freeze(Object.fromEntries(panes.filter((p) => own(previous, p.value) !== undefined).map((p) => [p.value, percentage(previous[p.value], "previous size")]))),
  });
}
/** Projects desired shares into the feasible bounds while preserving a total of 100. */
export function resolveLayout(panes: readonly Pane[], supplied?: readonly number[], previous?: Layout): Layout {
  validatePanes(panes);
  if (!panes.length) {
    return snapshot([], [], new Set());
  }
  if (supplied) {
    if (supplied.length !== panes.length) {
      throw new RangeError("sizes must contain one percentage per pane");
    }
    supplied.forEach((v) => percentage(v, "size"));
    if (supplied.every((v) => v === 0)) {
      throw new RangeError("sizes must have a positive total");
    }
  }
  const collapsed = new Set((previous?.collapsed ?? []).filter((key) => panes.some((p) => p.value === key && p.collapsible)));
  const ranges = panes.map((p) => bounds(p, collapsed));
  const minimum = ranges.reduce((sum, r) => sum + r[0], 0),
    maximum = ranges.reduce((sum, r) => sum + r[1], 0);
  if (minimum > 100 + EPS || maximum < 100 - EPS) {
    throw new RangeError("Pane constraints cannot fill the layout");
  }
  const desired = panes.map((p, i) => supplied?.[i] ?? own(previous?.sizes, p.value) ?? p.defaultSize ?? 100 / panes.length);
  desired.forEach((v) => percentage(v, "size"));
  const history = { ...previous?.previousSizes };
  for (const [index, pane] of panes.entries()) {
    if (collapsed.has(pane.value) && own(history, pane.value) === undefined && desired[index] > (pane.collapsedSize ?? 0)) {
      history[pane.value] = desired[index];
    }
  }
  if (Math.abs(desired.reduce((a, b) => a + b, 0) - 100) < EPS && desired.every((value, i) => value >= ranges[i][0] && value <= ranges[i][1])) {
    return snapshot(panes, desired, collapsed, history);
  }
  const fixed = ranges.map((r) => Math.abs(r[1] - r[0]) < EPS),
    fixedTotal = ranges.reduce((sum, r, i) => sum + (fixed[i] ? r[0] : 0), 0),
    weight = desired.reduce((sum, v, i) => sum + (fixed[i] ? 0 : v), 0),
    count = fixed.filter((v) => !v).length;
  const targets = desired.map((v, i) => (fixed[i] ? ranges[i][0] : weight ? (v / weight) * (100 - fixedTotal) : (100 - fixedTotal) / count));
  let low = -100,
    high = 100;
  for (let pass = 0; pass < 64; pass++) {
    const shift = (low + high) / 2,
      total = targets.reduce((sum, v, i) => sum + clamp(v + shift, ranges[i][0], ranges[i][1]), 0);
    if (total < 100) {
      low = shift;
    } else {
      high = shift;
    }
  }
  const shares = targets.map((v, i) => clamp(Number(clamp(v + (low + high) / 2, ranges[i][0], ranges[i][1]).toFixed(10)), ranges[i][0], ranges[i][1]));
  let remaining = 100 - shares.reduce((a, b) => a + b, 0);
  for (let i = 0; i < shares.length && Math.abs(remaining) > Number.EPSILON; i++) {
    const next = clamp(shares[i] + remaining, ranges[i][0], ranges[i][1]);
    remaining -= next - shares[i];
    shares[i] = next;
  }
  return snapshot(panes, shares, collapsed, history);
}
export function handleRange(panes: readonly Pane[], layout: Layout, pivot: number, includeCollapse = true): Readonly<{ min: number; max: number; now: number }> {
  const a = panes[pivot],
    b = panes[pivot + 1];
  if (!a || !b) {
    throw new RangeError("A resize handle needs two adjacent panes");
  }
  const closed = new Set(includeCollapse ? [] : layout.collapsed),
    [aMin, aMax] = includeCollapse && a.collapsible ? [a.collapsedSize ?? 0, a.maxSize ?? 100] : bounds(a, closed),
    [bMin, bMax] = includeCollapse && b.collapsible ? [b.collapsedSize ?? 0, b.maxSize ?? 100] : bounds(b, closed),
    total = layout.sizes[a.value] + layout.sizes[b.value];
  return { min: Math.max(aMin, total - bMax), max: Math.min(aMax, total - bMin), now: layout.sizes[a.value] };
}
export function togglePane(panes: readonly Pane[], layout: Layout, value: string, collapsed: boolean, pivot?: number, baseline: Layout = layout): Layout {
  const index = panes.findIndex((p) => p.value === value),
    pane = panes[index];
  if (!pane) {
    throw new TypeError("Unknown pane value");
  }
  if (collapsed && !pane.collapsible) {
    throw new TypeError("Pane is not collapsible");
  }
  if (layout.collapsed.includes(value) === collapsed) {
    return layout;
  }
  const pair = pivot ?? (index === panes.length - 1 ? index - 1 : index),
    before = panes[pair],
    after = panes[pair + 1];
  if (!before || !after || (index !== pair && index !== pair + 1)) {
    throw new RangeError("Collapse requires an adjacent pane");
  }
  const other = index === pair ? after : before,
    closed = new Set(layout.collapsed);
  if (collapsed) {
    closed.add(value);
  } else {
    closed.delete(value);
  }
  const total = layout.sizes[value] + layout.sizes[other.value],
    [min, max] = bounds(pane, closed),
    [otherMin, otherMax] = bounds(other, closed),
    low = Math.max(min, total - otherMax),
    high = Math.min(max, total - otherMin);
  if (low > high + EPS) {
    throw new RangeError("Adjacent pane constraints prevent collapse or expansion");
  }
  const desired = collapsed ? (pane.collapsedSize ?? 0) : (own(layout.previousSizes, value) ?? pane.defaultSize ?? 100 / panes.length),
    next = clamp(desired, low, high);
  if (collapsed && Math.abs(next - desired) > EPS) {
    throw new RangeError("Adjacent pane cannot absorb the collapsed size");
  }
  const sizes = panes.map((p) => (p.value === value ? next : p.value === other.value ? total - next : layout.sizes[p.value]));
  const saved = { ...layout.previousSizes };
  if (collapsed) {
    saved[value] = baseline.collapsed.includes(value) ? layout.sizes[value] : baseline.sizes[value];
  }
  return snapshot(panes, sizes, closed, saved);
}
/** Each handle changes only its adjacent pair; independent collapsed panes stay fixed. */
export function resizePair(panes: readonly Pane[], layout: Layout, pivot: number, delta: number, baseline: Layout = layout): Layout {
  if (!Number.isFinite(delta)) {
    throw new TypeError("Resize delta must be finite");
  }
  if (Math.abs(delta) < EPS) {
    return layout;
  }
  const a = panes[pivot],
    b = panes[pivot + 1];
  if (!a || !b) {
    throw new RangeError("A resize handle needs two adjacent panes");
  }
  const growing = delta > 0 ? a : b;
  if (layout.collapsed.includes(growing.value)) {
    const expanded = togglePane(panes, layout, growing.value, false, pivot, baseline);
    const restored = expanded.sizes[growing.value] - layout.sizes[growing.value];
    if (Math.abs(delta) <= restored) {
      return expanded;
    }
    return resizePair(panes, expanded, pivot, Math.sign(delta) * (Math.abs(delta) - restored), baseline);
  }
  const shrinking = delta < 0 ? a : b,
    unsafe = layout.sizes[shrinking.value] - Math.abs(delta),
    threshold = ((shrinking.minSize ?? 0) + (shrinking.collapsedSize ?? 0)) / 2;
  if (shrinking.collapsible && !layout.collapsed.includes(shrinking.value) && unsafe < threshold - EPS) {
    try {
      return togglePane(panes, layout, shrinking.value, true, pivot, baseline);
    } catch (error) {
      if (!(error instanceof RangeError)) {
        throw error;
      }
    }
  }
  const range = handleRange(panes, layout, pivot, false),
    next = clamp(range.now + delta, range.min, range.max);
  if (Math.abs(next - range.now) < EPS) {
    return layout;
  }
  const total = layout.sizes[a.value] + layout.sizes[b.value],
    sizes = panes.map((p) => (p === a ? next : p === b ? total - next : layout.sizes[p.value]));
  return snapshot(panes, sizes, new Set(layout.collapsed), layout.previousSizes);
}
