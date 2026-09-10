// Roving tabindex over a row or column of items: one item is tabbable (tabindex 0), the rest -1,
// and the arrow keys move focus between them. The host names the items and the current one, and
// calls `handleKey` from the container's keydown; `tabindex(i)` gives each item its value.
import type { ReactiveController, ReactiveControllerHost } from "lit";

export type RovingOptions = {
  /** The items, in order. */
  items: () => HTMLElement[];
  /** Index of the current (tabbable) item. */
  current: () => number;
  /** Called with the item the keys moved focus to. */
  onMove: (item: HTMLElement, index: number) => void;
  /** Which arrow keys move (default horizontal). */
  orientation?: "horizontal" | "vertical" | "both";
  /** Wrap around at the ends (default false); a function is read at each key. */
  wrap?: boolean | (() => boolean);
  /** Step over disabled items (default false: a disabled neighbour stops the move). */
  skipDisabled?: boolean;
  /** Home and End jump to the first and last item (default false). */
  homeEnd?: boolean;
  /** Whether an item is disabled (default: its `disabled` property). */
  disabled?: (item: HTMLElement) => boolean;
};

export class RovingTabindex implements ReactiveController {
  constructor(
    host: ReactiveControllerHost,
    private options: RovingOptions,
  ) {
    host.addController(this);
  }
  hostConnected() {}
  /** The tabindex of the item at `index`. */
  tabindex(index: number): 0 | -1 {
    return index === this.options.current() ? 0 : -1;
  }
  private isOff(item: HTMLElement) {
    return this.options.disabled?.(item) ?? !!(item as HTMLButtonElement).disabled;
  }
  /** Handles a keydown on the container; returns true when it moved focus (the event is then consumed). */
  handleKey(e: KeyboardEvent): boolean {
    const o = this.options;
    const orientation = o.orientation ?? "horizontal";
    const horizontal = orientation !== "vertical";
    const vertical = orientation !== "horizontal";
    const prev = (horizontal && e.key === "ArrowLeft") || (vertical && e.key === "ArrowUp");
    const next = (horizontal && e.key === "ArrowRight") || (vertical && e.key === "ArrowDown");
    const home = o.homeEnd && e.key === "Home";
    const end = o.homeEnd && e.key === "End";
    if (!prev && !next && !home && !end) return false;
    const items = o.items();
    if (!items.length) return false;
    let j: number;
    if (home || end) {
      const dir = home ? 1 : -1;
      j = home ? 0 : items.length - 1;
      while (j >= 0 && j < items.length && this.isOff(items[j])) j += dir;
    } else {
      const dir = next ? 1 : -1;
      j = o.current() + dir;
      const wraps = typeof o.wrap === "function" ? o.wrap() : !!o.wrap;
      const wrap = (k: number) => (wraps ? (k + items.length) % items.length : k);
      j = wrap(j);
      if (o.skipDisabled) for (let n = 0; n < items.length && j >= 0 && j < items.length && this.isOff(items[j]); n++) j = wrap(j + dir);
    }
    if (j < 0 || j >= items.length || this.isOff(items[j])) return false;
    e.preventDefault();
    items[j].focus({ preventScroll: true });
    o.onMove(items[j], j);
    return true;
  }
}
