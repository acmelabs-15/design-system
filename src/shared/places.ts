// The places beside an element's content: `start` and `end`, plus the field's two add-ons. One
// controller answers "is this place occupied", so an element that renders a place only while it has
// content asks rather than keeping booleans of its own.
//
//   private places = new Places(this);
//   ...
//   ${this.places.has("start") ? html`<span class="start">${startSlot}</span>` : startSlot}
//
// A place is read three ways, because none alone is enough:
//
//   - at connect, so the first render is correct;
//   - again in `firstUpdated`, because a parser that connects an element before its children (happy-dom
//     does) sees nothing at connect;
//   - on `slotchange` and on a light-DOM mutation, so content that arrives later still lands.
//
// The reading is `querySelector('[slot="…"]')` on the light DOM rather than a slot's assignedNodes,
// so it works before the shadow tree exists and in a test environment where slotchange never fires.
import type { ReactiveController, ReactiveControllerHost } from "lit";

/** The two places every element has, and the field's add-ons outside them. */
export const PLACES = ["start-addon", "start", "end-addon", "end"] as const;
export type Place = (typeof PLACES)[number];

export class Places implements ReactiveController {
  private filled = new Set<Place>();
  private watch?: MutationObserver;
  private host: ReactiveControllerHost & Element;
  /** The places this element renders; the rest are never read. */
  private names: readonly Place[];
  /** `:scope >` limits the read to direct children, for an element whose content may itself carry places. */
  private scoped: boolean;

  constructor(host: ReactiveControllerHost & Element, options: { places?: readonly Place[]; scoped?: boolean } = {}) {
    this.host = host;
    this.names = options.places ?? PLACES;
    this.scoped = options.scoped ?? false;
    host.addController(this);
  }

  /** Whether a place holds content. */
  has(name: Place): boolean {
    return this.filled.has(name);
  }

  /** Reads the light DOM and re-renders the host when a place changes. Bind to `slotchange`. */
  read = () => {
    const before = this.filled;
    const now = new Set<Place>();
    for (const n of this.names) if (this.host.querySelector(`${this.scoped ? ":scope > " : ""}[slot="${n}"]`)) now.add(n);
    if (now.size === before.size && [...now].every((n) => before.has(n))) return;
    this.filled = now;
    this.host.requestUpdate();
  };

  hostConnected() {
    this.read();
    if (typeof MutationObserver !== "undefined") {
      this.watch = new MutationObserver(this.read);
      this.watch.observe(this.host, { childList: true });
    }
  }

  hostDisconnected() {
    this.watch?.disconnect();
    this.watch = undefined;
  }

  // A parser that connects the element before its children (happy-dom does) sees an empty light DOM
  // at connect, so the first update reads again. MutationObserver covers a real browser; this covers
  // an environment that has none, and costs one querySelector per place on the first render only.
  private first = true;
  hostUpdate() {
    if (!this.first) return;
    this.first = false;
    this.read();
  }
}
