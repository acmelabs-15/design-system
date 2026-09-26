import { createAtom } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveControllerHost } from "lit";

type Options<Item> = { items(): readonly Item[]; current(): Item | undefined; text(item: Item): string; move(item: Item): void; locale?(): string | undefined; now?(): number; delay?: number };
/** Prefix navigation with repeated-letter cycling and an elapsed-time buffer. */
export class Typeahead<Item> implements ReactiveController {
  private readonly input = createAtom({ text: "", at: -Infinity });
  private readonly now: () => number;
  constructor(
    host: ReactiveControllerHost,
    private options: Options<Item>,
  ) {
    host.addController(this);
    this.now = options.now ?? (() => performance.now());
  }
  get active(): boolean {
    return this.input.get().text !== "" && this.now() - this.input.get().at < (this.options.delay ?? 1000);
  }
  clear(): void {
    this.input.set({ text: "", at: -Infinity });
  }
  handleKey(event: KeyboardEvent): boolean {
    if (event.defaultPrevented || event.isComposing || event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1 || (event.key === " " && !this.active)) {
      return false;
    }
    const previous = this.active ? this.input.get().text : "",
      text = previous + event.key;
    this.input.set({ text, at: this.now() });
    event.preventDefault();
    const characters = Array.from(text.toLocaleLowerCase(this.options.locale?.())),
      cycling = characters.every((character) => character === characters[0]);
    const query = cycling ? characters[0]! : text;
    const items = this.options.items();
    if (!items.length) {
      return true;
    }
    const current = items.indexOf(this.options.current() as Item),
      start = current < 0 ? 0 : cycling ? (current + 1) % items.length : current;
    const collator = new Intl.Collator(this.options.locale?.(), { usage: "search", sensitivity: "base" });
    for (let offset = 0; offset < items.length; offset++) {
      const item = items[(start + offset) % items.length]!;
      const label = this.options.text(item).trim().replace(/\s+/g, " ");
      if (collator.compare(label.slice(0, query.length), query) === 0) {
        event.preventDefault();
        this.options.move(item);
        return true;
      }
    }
    return true;
  }
  hostDisconnected(): void {
    this.clear();
  }
}
