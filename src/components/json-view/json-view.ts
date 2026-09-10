import { css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, glyphSized, sharedCss } from "../../base";
import { jsonViewCss } from "./json-view.styles";

type Entry = readonly [string, unknown];
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isBranch = (v: unknown): v is object => isObject(v) || Array.isArray(v);
const entriesOf = (v: object): Entry[] => (Array.isArray(v) ? v.map((x, i) => [String(i), x] as const) : Object.entries(v));
const hasEntries = (v: object) => (Array.isArray(v) ? v.length > 0 : Object.keys(v).length > 0);
/** The text a primitive renders: JSON for strings and numbers, `null` for null. */
const printed = (v: unknown) => (v === null ? "null" : typeof v === "string" ? JSON.stringify(v) : (JSON.stringify(v) ?? String(v)));
/** The accessible label of a node: the field and the value's kind or text; the root reads `JSON object` or `JSON array`. */
const labelOf = (field: string | undefined, v: unknown) => {
  if (isObject(v)) return field === undefined ? "JSON object" : `${field}: object`;
  if (Array.isArray(v)) return field === undefined ? "JSON array" : `${field}: array`;
  const text = v === null ? "null" : typeof v === "string" ? v : String(v);
  return field === undefined ? text : `${field}: ${text}`;
};
/** An open object with one primitive pair renders on one line when that line is at most 50 characters. */
const fitsOneLine = (field: string | undefined, [k, v]: Entry, last: boolean) => `${field === undefined ? "" : `${field}: `}{ ${k}: ${printed(v)} }${last ? "" : ","}`.length <= 50;
/** A node's path in the tree: the keys as a JSON pointer. */
const childPath = (path: string, key: string) => `${path}/${key.replace(/~/g, "~0").replace(/\//g, "~1")}`;
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Builds the `highlightPattern` from search terms: terms of at least two characters, escaped and
 * joined into one case-insensitive alternation; null when no term remains.
 */
export function makeJsonViewHighlightPattern(terms: string[]): RegExp | null {
  const kept = terms.filter((t) => t.length > 1);
  return kept.length ? new RegExp(`(${kept.map(escapeRe).join("|")})`, "gi") : null;
}

/**
 * JSON view: an object or array as a collapsible tree (role tree) in mono 13/20, flowing inline
 * with the text around it. Every node is a tree item with a roving tab index; an object or array
 * row has a toggle (chevron, key, bracket) over the block of its child rows, or an ellipsis when
 * collapsed; an open object with one short primitive pair stays on one line; a primitive row is
 * the key and the value, colored by kind (string, number, boolean, null). Arrow keys move through
 * the visible nodes and open or close them, Enter and Space toggle, Home and End jump, a typed
 * character jumps to the next node whose label starts with it. `highlight-pattern` marks matches in
 * keys and primitive values. Levels below `default-expand-depth` (3) start open.
 */
@customElement("acme-json-view")
export class AcmeJsonView extends AcmeElement {
  static styles = [
    sharedCss,
    jsonViewCss,
    css`
      :host {
        display: inline;
      }
    `,
  ];
  /** The object or array to render; JSON in the attribute. */
  @property({ type: Object }) data: unknown = {};
  /** Levels strictly below this depth start expanded: 1 opens the root only, 0 collapses it. */
  @property({ type: Number, attribute: "default-expand-depth" }) defaultExpandDepth = 3;
  /** A regular expression (or its source, in the attribute; case-insensitive) that marks matching keys and primitive values; null when nothing is searched. */
  @property({ attribute: "highlight-pattern" }) highlightPattern: RegExp | string | null = null;
  @query(".tree") private tree!: HTMLElement;
  /** The nodes the reader opened or closed, by path; every other node follows the default depth. */
  private toggled = new Map<string, boolean>();
  private pattern: RegExp | null = null;
  /** The toggle under the pointer. */
  private hovered: HTMLElement | null = null;

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has("highlightPattern")) {
      const p = this.highlightPattern;
      try {
        this.pattern = !p ? null : typeof p === "string" ? new RegExp(p, "gi") : p.global ? p : new RegExp(p.source, `${p.flags}g`);
      } catch {
        this.pattern = null;
      }
    }
  }

  private isOpen(path: string, level: number) {
    return this.toggled.get(path) ?? level < this.defaultExpandDepth;
  }
  private toggle(item: HTMLElement) {
    const path = item.dataset.path ?? "";
    this.toggled.set(path, !this.isOpen(path, Number(item.getAttribute("aria-level")) - 1));
    this.requestUpdate();
  }

  private items(): HTMLElement[] {
    return Array.from(this.tree?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? []);
  }
  /** Moves the roving tab index to one node and focuses it. */
  private focusItem(el: Element | null | undefined) {
    if (!(el instanceof HTMLElement)) return;
    for (const x of this.items()) x.tabIndex = x === el ? 0 : -1;
    el.focus();
  }
  private itemOf = (target: EventTarget | null) => ((target as Element | null)?.closest?.('[role="treeitem"]') ?? null) as HTMLElement | null;

  private onFocusin = (e: FocusEvent) => {
    const item = this.itemOf(e.target);
    if (!item || item !== e.target) return;
    for (const x of this.items()) x.tabIndex = x === item ? 0 : -1;
    let visible = false;
    try {
      visible = item.matches(":focus-visible");
    } catch {}
    if (visible) item.setAttribute("data-focus", "true");
  };
  private onFocusout = (e: FocusEvent) => {
    this.itemOf(e.target)?.removeAttribute("data-focus");
  };
  private onPointerover = (e: PointerEvent) => {
    const toggle = ((e.target as Element | null)?.closest?.(".toggle") ?? null) as HTMLElement | null;
    if (toggle === this.hovered) return;
    this.hovered?.removeAttribute("data-hover");
    this.hovered = toggle;
    if (toggle && e.pointerType !== "touch") toggle.setAttribute("data-hover", "true");
  };
  private onPointerout = (e: PointerEvent) => {
    if (!this.hovered || (e.relatedTarget instanceof Node && this.hovered.contains(e.relatedTarget))) return;
    this.hovered.removeAttribute("data-hover");
    this.hovered = null;
  };
  /** A click on a toggle opens or closes its node, unless the reader is selecting text across it. */
  private onToggleClick = (e: Event) => {
    const toggle = e.currentTarget as HTMLElement;
    if (!toggle.hasAttribute("data-toggle") || this.selectionTouches(toggle)) return;
    const item = this.itemOf(toggle);
    if (!item) return;
    this.focusItem(item);
    this.toggle(item);
  };
  /** A double click selects text; it does not toggle. */
  private onToggleDown = (e: MouseEvent) => {
    if (e.detail > 1) e.preventDefault();
  };
  private selectionTouches(el: Element) {
    const root = this.renderRoot as ShadowRoot & { getSelection?: () => Selection | null };
    const sel = root.getSelection?.() ?? (typeof window.getSelection === "function" ? window.getSelection() : null);
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return false;
    for (let i = 0; i < sel.rangeCount; i++) if (sel.getRangeAt(i).intersectsNode(el)) return true;
    return false;
  }
  private onKeydown = (e: KeyboardEvent) => {
    const item = this.itemOf(e.target);
    if (!item) return;
    const expandable = item.hasAttribute("aria-expanded");
    const expanded = item.getAttribute("aria-expanded") === "true";
    const all = this.items();
    const i = all.indexOf(item);
    switch (e.key) {
      case "Enter":
      case " ":
        if (!expandable) return;
        e.preventDefault();
        this.toggle(item);
        return;
      case "ArrowRight":
        if (expandable && !expanded) {
          e.preventDefault();
          this.toggle(item);
          return;
        }
        if (expanded) {
          e.preventDefault();
          this.focusItem(item.querySelector('[role="group"] [role="treeitem"]'));
        }
        return;
      case "ArrowLeft":
        if (expandable && expanded) {
          e.preventDefault();
          this.toggle(item);
          return;
        }
        e.preventDefault();
        this.focusItem(item.parentElement?.closest('[role="group"]')?.parentElement?.closest('[role="treeitem"]'));
        return;
      case "ArrowDown":
        e.preventDefault();
        this.focusItem(all[i + 1]);
        return;
      case "ArrowUp":
        e.preventDefault();
        this.focusItem(all[i - 1]);
        return;
      case "Home":
        e.preventDefault();
        this.focusItem(all[0]);
        return;
      case "End":
        e.preventDefault();
        this.focusItem(all[all.length - 1]);
        return;
      default: {
        if (e.key.length !== 1 || e.key === " " || e.altKey || e.ctrlKey || e.metaKey) return;
        const typed = e.key.toLocaleLowerCase();
        const next = [...all.slice(i + 1), ...all.slice(0, i + 1)].find((x) => (x.dataset.label ?? "").trim().toLocaleLowerCase().startsWith(typed));
        this.focusItem(next);
      }
    }
  };

  /** Marks the matches of the highlight pattern in a text. */
  private mark(text: string): unknown {
    const re = this.pattern;
    if (!re) return text;
    const out: unknown[] = [];
    let last = 0;
    for (const m of text.matchAll(re)) {
      if (!m[0] || m.index === undefined) continue;
      out.push(text.slice(last, m.index), html`<mark>${m[0]}</mark>`);
      last = m.index + m[0].length;
    }
    if (!out.length) return text;
    out.push(text.slice(last));
    return out;
  }
  private key(field: string | undefined) {
    return field === undefined ? nothing : html`<span class="key">${this.mark(field)}: </span>`;
  }
  private value(v: unknown) {
    const text = this.mark(printed(v));
    if (v === null) return html`<span class="nil">${text}</span>`;
    switch (typeof v) {
      case "number":
        return html`<span class="num">${text}</span>`;
      case "boolean":
        return html`<span class="bool">${text}</span>`;
      default:
        return html`<span class="str">${text}</span>`;
    }
  }
  /** One node: a tree item holding a primitive row, or a toggle line, the group of child rows and the closing bracket. */
  private node(field: string | undefined, v: unknown, level: number, last: boolean, pos: number, size: number, path: string, inline = false): TemplateResult {
    const label = labelOf(field, v);
    const top = level === 0;
    const tab = top ? 0 : -1;
    if (!isBranch(v))
      return html`<span class=${inline ? "pair" : top ? "top" : "item"} role="treeitem" aria-label=${label} aria-level=${level + 1} aria-posinset=${pos} aria-setsize=${size} data-label=${label} data-path=${path} tabindex=${tab}><span class=${inline ? "cell" : "row"}>${this.key(field)}${this.value(v)}${last ? nothing : ","}</span></span>`;
    const open = this.isOpen(path, level);
    const arr = Array.isArray(v);
    const entries = open ? entriesOf(v) : null;
    const empty = entries ? entries.length === 0 : !hasEntries(v);
    const [o, c] = arr ? ["[", "]"] : ["{", "}"];
    const single = entries && !arr && entries.length === 1 ? entries[0] : undefined;
    const pair = single && !isBranch(single[1]) ? single : undefined;
    const fits = !!pair && fitsOneLine(field, pair, last);
    const chevron = empty ? nothing : html`<span class="chev" aria-hidden="true">${glyphSized(open ? "chev-d" : "chev")}</span>`;
    const toggle = html`<span class=${empty ? "brace" : "toggle"} data-toggle=${empty ? nothing : "true"} @click=${this.onToggleClick} @mousedown=${this.onToggleDown}>${chevron}${this.key(field)}${o}${open ? nothing : html`<span class="dots">…</span>`}${open ? nothing : c}${open || last ? nothing : ","}</span>`;
    const closing = html`${c}${last ? nothing : ","}`;
    const line = pair
      ? html`<span class=${fits || top ? "line" : "line block"} data-inline=${fits ? "true" : nothing}>${toggle}${fits ? " " : nothing}<span class=${fits ? "flat" : "group"} role="group">${this.node(pair[0], pair[1], level + 1, true, 1, 1, childPath(path, pair[0]), fits)}</span>${fits ? " " : nothing}<span class=${fits || top ? "close" : "close block"}>${closing}</span></span>`
      : html`<span class="line">${toggle}</span>`;
    const group =
      entries && !pair
        ? html`<span class="group" role="group">${entries.map(([k, x], i) => this.node(k, x, level + 1, i === entries.length - 1, i + 1, entries.length, childPath(path, k)))}</span>`
        : nothing;
    const close = open && !pair ? html`<span class=${top ? "close" : "close block"}>${closing}</span>` : nothing;
    return html`<span class=${top ? "top" : "item"} role="treeitem" aria-expanded=${empty ? nothing : String(open)} aria-label=${label} aria-level=${level + 1} aria-posinset=${pos} aria-setsize=${size} data-label=${label} data-path=${path} tabindex=${tab}>${line}${group}${close}</span>`;
  }

  render() {
    return html`<span class="json" part="json"><span class="tree" role="tree" aria-label="JSON" @keydown=${this.onKeydown} @focusin=${this.onFocusin} @focusout=${this.onFocusout} @pointerover=${this.onPointerover} @pointerout=${this.onPointerout}>${this.node(undefined, this.data, 0, true, 1, 1, "")}</span></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-json-view": AcmeJsonView;
  }
}
