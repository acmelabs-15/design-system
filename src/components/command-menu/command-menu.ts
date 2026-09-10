import { HotkeyController, type RegisterableHotkey } from "@tanstack/lit-hotkeys";
import { preventBodyScroll } from "@zag-js/remove-scroll";
import { css, html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { AcmeElement, boolish, sharedCss } from "../../base";
import { commandScore } from "../../shared/command-score";
import { Interaction } from "../../shared/interaction";
import "../breadcrumb/breadcrumb";
import "../breadcrumbs/breadcrumbs";
import type { AcmeCommandDivider } from "../command-divider/command-divider";
import type { AcmeCommandGroup } from "../command-group/command-group";
import type { AcmeCommandItem, CommandItemSelectDetail } from "../command-item/command-item";
import { commandMenuCss } from "./command-menu.styles";
import { commandMenuInputCss } from "./command-menu-input.styles";
import { commandMenuListCss } from "./command-menu-list.styles";
import { commandMenuOverlayCss } from "./command-menu-overlay.styles";

/** A page of the menu: its crumb's label and the placeholder its searchbox shows. */
export type CommandMenuPage = { label: string; placeholder?: string };
/** Scores a row's value against the query: above 0 keeps the row, higher sorts it first. */
export type CommandMenuFilter = (value: string, search: string) => number;

/** The dialog's pulse on a page change lasts this long (the length of its transform transition). */
const PULSE_MS = 100;
/** An emptied query waits this long before Backspace may leave the page. */
const READY_MS = 500;
/** The light-DOM attributes whose change re-reads the rows. */
const WATCHED = ["value", "disabled", "page", "always-render", "slot"];

/**
 * A set of actions launched as a full-screen overlay: the native dialog opens in the top layer
 * (focus stays inside it, the page behind is inert and stops scrolling), the backdrop fades in and
 * the 640px box scales in 15% from the top; on close both animate out and the menu leaves. The box
 * holds the input block (the searchbox with `placeholder`, the Esc chip) over the list of the
 * slotted `acme-command-group`, `acme-command-item` and `acme-command-divider` children. Typing
 * scores every row's value against the query (`filter`, the vendored command score by default;
 * `should-filter="false"` leaves the rows as they are): a row that scores 0 hides, the rest sort
 * by score, a group with no match hides, dividers hide, and the empty message shows the query
 * when nothing matches. The arrows move the highlight (`value`, the highlighted row's value) while
 * focus stays in the searchbox (Alt jumps a group, Meta to an end; Ctrl+N/P/J/K work too), Home
 * and End jump, Enter selects the highlighted row, the pointer highlights the row under it, a click
 * selects it. `pages` is the page stack (`{ label, placeholder }` each): the crumbs above the
 * searchbox show it, the last page's placeholder replaces the searchbox's, rows keep to their
 * `page` (a row without one belongs to the root page), Backspace on an empty searchbox goes up a
 * page, a crumb goes back to its page; `addPage()` and `setPages()` move through the stack. Escape,
 * the Esc chip and a press on the backdrop close the menu; `hotkey` (`Mod+K` by default; `"false"`
 * turns it off) toggles it from anywhere on the page. `loading` shows a shimmering bar under the
 * input block; `infinite-scrolling-threshold` with `infiniteScrollingCb` loads more rows as the list
 * nears its end. `label` names the dialog; `description` is its screen-reader description. Fires
 * `acme-open`, `acme-close` (once the menu has left), `acme-input` (the query), `acme-highlight`
 * (the highlighted value), `acme-pages` (the page stack, from `addPage()`, `setPages()`, Backspace
 * or a crumb); a row's `acme-select` bubbles through, and the menu closes on it unless the row keeps
 * it open or the event is canceled.
 */
@customElement("acme-command-menu")
export class AcmeCommandMenu extends AcmeElement {
  static styles = [
    sharedCss,
    css`
      /* The dialog element's own box (a canvas fill, a text color, a fit-content size with a size cap,
         insets to every edge, a scrolling overflow, selectable text) gives way to a plain block's, so the
         derived rules after this lay the dialog out as they would any fixed box. A closed dialog keeps the
         platform's own absence: it is not laid out, whatever the rules say about the box. */
      dialog:not([open]) {
        display: none;
      }
      dialog {
        width: auto;
        height: auto;
        inset: auto;
        overflow: visible;
        background: transparent;
        color: inherit;
        max-width: none;
        max-height: none;
        user-select: auto;
      }
    `,
    commandMenuCss,
    commandMenuOverlayCss,
    commandMenuInputCss,
    commandMenuListCss,
  ];
  /** Open state; `show()` and `close()` set it. */
  @property({ type: Boolean, reflect: true }) open = false;
  /** The dialog's accessible name. */
  @property() label = "";
  /** The searchbox's placeholder while no page sets its own. */
  @property() placeholder = "";
  /** The dialog's screen-reader description. */
  @property() description = "Use the command menu to navigate the site.";
  /** The page stack; the last page is the active one. */
  @property({ type: Array }) pages: CommandMenuPage[] = [];
  /** A shimmering bar under the input block while rows load. */
  @property({ type: Boolean, reflect: true }) loading = false;
  /** The query narrows and sorts the rows; `"false"` leaves them as they are. */
  @property({ converter: boolish, attribute: "should-filter" }) shouldFilter = true;
  /** Scores a row's value against the query. */
  @property({ attribute: false }) filter: CommandMenuFilter = commandScore;
  /** The highlighted row's value. */
  @property() value = "";
  /** The key combo that toggles the menu from anywhere on the page; `"false"` turns it off. */
  @property() hotkey = "Mod+K";
  /** Within this many px of the list's end, `infiniteScrollingCb` runs. */
  @property({ type: Number, attribute: "infinite-scrolling-threshold" }) infiniteScrollingThreshold = 0;
  /** Loads more rows as the list nears its end; a truthy result scrolls the list to its end. */
  @property({ attribute: false }) infiniteScrollingCb?: () => boolean | Promise<boolean>;
  /** The query. */
  @state() private search = "";
  /** The dialog is open (the exit keeps it open until the menu has left). */
  @state() private mounted = false;
  /** Rows matching the query (or every row on the page). */
  @state() private count = 0;
  @query("dialog") private dialog!: HTMLDialogElement;
  @query(".input") private input?: HTMLInputElement;
  @query(".list") private list?: HTMLElement;
  @query(".esc") private escButton?: HTMLElement;
  private escState = new Interaction(this);
  private keys?: HotkeyController;
  private unlock?: () => void;
  /** Backspace on an empty searchbox may leave the page: set on a page change, and a beat after the query empties. */
  private ready = true;
  private readyTimer?: ReturnType<typeof setTimeout>;
  private pulseTimer?: ReturnType<typeof setTimeout>;
  private watch?: MutationObserver;
  /** Stands for the exit under way: an open during it leaves that exit unfinished. */
  private exitToken = 0;
  /** The rows changed since the last update. */
  private rowsChanged = true;
  /** The query changed since the last update: the highlight goes to the first row. */
  private searchChanged = false;
  /** The row the keys highlighted: scrolled into view after the update. */
  private pendingScroll?: AcmeCommandItem;
  /** The groups in the order they were first seen: the order they return to when the query empties. */
  private groupOrder: AcmeCommandGroup[] = [];

  /** The active page: the last of the stack. */
  get activePage(): CommandMenuPage | undefined {
    return this.pages[this.pages.length - 1];
  }

  /** Every row, in document order. */
  get items(): AcmeCommandItem[] {
    return Array.from(this.querySelectorAll<AcmeCommandItem>("acme-command-item"));
  }

  get groups(): AcmeCommandGroup[] {
    return Array.from(this.querySelectorAll<AcmeCommandGroup>("acme-command-group"));
  }

  get dividers(): AcmeCommandDivider[] {
    return Array.from(this.querySelectorAll<AcmeCommandDivider>("acme-command-divider"));
  }

  /** The highlighted row. */
  get selectedItem(): AcmeCommandItem | undefined {
    return this.items.find((i) => i.selected);
  }

  /** The query. */
  get inputValue() {
    return this.search;
  }

  show() {
    this.open = true;
  }

  close() {
    this.open = false;
  }

  /** Sets the query, as typing would. */
  setInputValue(text: string) {
    this.takeInput(text);
  }

  /** Replaces the page stack: `acme-pages`. */
  setPages(pages: CommandMenuPage[]) {
    this.pages = pages;
    this.dispatchEvent(new CustomEvent<{ pages: CommandMenuPage[] }>("acme-pages", { detail: { pages }, bubbles: true, composed: true }));
  }

  /** Pushes a page onto the stack. */
  addPage(page: CommandMenuPage) {
    this.setPages([...this.pages, page]);
  }

  connectedCallback() {
    super.connectedCallback();
    if (typeof MutationObserver !== "undefined") {
      this.watch = new MutationObserver(this.readChildren);
      this.watch.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: WATCHED });
    }
    this.addEventListener("acme-select", this.onSelect);
    this.addEventListener("pointermove", this.onPointerMove);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.watch?.disconnect();
    this.removeEventListener("acme-select", this.onSelect);
    this.removeEventListener("pointermove", this.onPointerMove);
    clearTimeout(this.readyTimer);
    clearTimeout(this.pulseTimer);
    this.unlock?.();
    this.unlock = undefined;
  }

  private readChildren = () => {
    this.rowsChanged = true;
    this.requestUpdate();
  };

  /** Whether a row, group or divider belongs to the active page: its `page` (an ancestor's counts), or none on the root page. */
  private onPage(el: Element) {
    const page = (el.closest("[page]") as HTMLElement | null)?.getAttribute("page") ?? "";
    return page ? page === this.activePage?.label : this.pages.length <= 1;
  }

  /**
   * Applies the query to the rows: a score per row (0 hides it), the groups and dividers shown
   * or hidden, the rows and groups ordered by score, the highlight on a row that is shown.
   */
  private apply() {
    const items = this.items;
    const groups = this.groups;
    for (const g of groups) if (!this.groupOrder.includes(g)) this.groupOrder.push(g);
    this.groupOrder = this.groupOrder.filter((g) => groups.includes(g));
    const q = this.search;
    const filtering = !!q && this.shouldFilter;
    const scores = new Map<AcmeCommandItem, number>();
    for (const it of items) {
      const score = !this.onPage(it) ? 0 : filtering ? this.filter(it.searchValue, q) : 1;
      scores.set(it, score);
      it.hidden = score <= 0;
    }
    this.count = items.filter((i) => scores.get(i)! > 0).length;
    for (const g of groups) g.hidden = !this.onPage(g) || (filtering && !g.items.some((i) => scores.get(i)! > 0));
    for (const d of this.dividers) d.hidden = !this.onPage(d) || (!!q && !d.alwaysRender);
    this.sort(scores, filtering);
    const shown = this.items.filter((i) => scores.get(i)! > 0 && !i.disabled);
    if (this.searchChanged || !shown.some((i) => i.searchValue === this.value)) this.value = shown[0]?.searchValue ?? "";
    this.searchChanged = false;
    for (const it of items) it.selected = scores.get(it)! > 0 && it.searchValue === this.value;
  }

  /**
   * Orders the rows by score: a row moves to the end of its group (or of the list) in descending
   * order, then a matched group moves to the end of the list in descending order of its best row;
   * with no query, the groups return to the order they were first seen in, after the loose rows.
   */
  private sort(scores: Map<AcmeCommandItem, number>, filtering: boolean) {
    if (!this.shouldFilter) return;
    const moves: [Element, Element][] = [];
    if (!this.search) for (const g of this.groupOrder) if (g.parentElement) moves.push([g.parentElement, g]);
    if (filtering) {
      const rows = this.items.filter((i) => !i.disabled && scores.get(i)! > 0).sort((a, b) => scores.get(b)! - scores.get(a)!);
      for (const it of rows) {
        const container: Element = (it.closest("acme-command-group") as Element | null) ?? (this as Element);
        let top: Element = it;
        while (top.parentElement && top.parentElement !== container) top = top.parentElement;
        if (top.parentElement === container) moves.push([container, top]);
      }
      const best = this.groups
        .filter((g) => !g.hidden)
        .map((g) => [g, Math.max(0, ...g.items.map((i) => scores.get(i) ?? 0))] as const)
        .sort((a, b) => b[1] - a[1]);
      for (const [g] of best) if (g.parentElement) moves.push([g.parentElement, g]);
    }
    // A parent whose moved children already sit at its end in that order is left alone, so a settled list mutates nothing (and re-reads nothing).
    const byParent = new Map<Element, Element[]>();
    for (const [parent, el] of moves) (byParent.get(parent) ?? byParent.set(parent, []).get(parent)!).push(el);
    for (const [parent, els] of byParent) {
      const wanted = [...new Set(els)];
      const tail = Array.from(parent.children).slice(-wanted.length);
      if (tail.length === wanted.length && tail.every((c, i) => c === wanted[i])) continue;
      for (const el of wanted) parent.appendChild(el);
    }
    this.watch?.takeRecords();
  }

  private takeInput(text: string) {
    clearTimeout(this.readyTimer);
    if (this.ready || text !== "") this.ready = false;
    else
      this.readyTimer = setTimeout(() => {
        this.ready = true;
      }, READY_MS);
    this.search = text;
    this.searchChanged = true;
    this.dispatchEvent(new CustomEvent<{ value: string }>("acme-input", { detail: { value: text }, bubbles: true, composed: true }));
  }

  private onInput = (e: Event) => {
    this.takeInput((e.target as HTMLInputElement).value);
  };

  /** Backspace on an empty searchbox goes up a page, once the emptied query has settled. */
  private onInputKey = (e: KeyboardEvent) => {
    if (e.key === "Backspace" && this.search === "" && this.pages.length > 1 && this.ready) this.setPages(this.pages.slice(0, -1));
  };

  private highlight(item: AcmeCommandItem, scroll: boolean) {
    this.value = item.searchValue;
    if (scroll) this.pendingScroll = item;
  }

  /** The keys: the arrows move the highlight (Alt by group, Meta to an end), Home and End jump, Enter selects. */
  private onKey = (e: KeyboardEvent) => {
    const shown = () => this.items.filter((i) => !i.hidden && !i.disabled);
    const at = () => shown().findIndex((i) => i.selected);
    const to = (i: number) => {
      const row = shown()[i];
      if (row) this.highlight(row, true);
    };
    const step = (dir: 1 | -1) => to(at() + dir);
    const byGroup = (dir: 1 | -1) => {
      const current = shown()[at()];
      let g: Element | null = current?.closest("acme-command-group") ?? null;
      let target: AcmeCommandItem | undefined;
      while (g && !target) {
        g = dir > 0 ? g.nextElementSibling : g.previousElementSibling;
        while (g && g.localName !== "acme-command-group") g = dir > 0 ? g.nextElementSibling : g.previousElementSibling;
        target = g ? (g as AcmeCommandGroup).items.find((i) => !i.hidden && !i.disabled) : undefined;
      }
      if (target) this.highlight(target, true);
      else step(dir);
    };
    const down = () => {
      e.preventDefault();
      if (e.metaKey) to(shown().length - 1);
      else if (e.altKey) byGroup(1);
      else step(1);
    };
    const up = () => {
      e.preventDefault();
      if (e.metaKey) to(0);
      else if (e.altKey) byGroup(-1);
      else step(-1);
    };
    switch (e.key) {
      case "n":
      case "j":
        if (e.ctrlKey) down();
        break;
      case "ArrowDown":
        down();
        break;
      case "p":
      case "k":
        if (e.ctrlKey) up();
        break;
      case "ArrowUp":
        up();
        break;
      case "Home":
        e.preventDefault();
        to(0);
        break;
      case "End":
        e.preventDefault();
        to(shown().length - 1);
        break;
      case "Enter":
        if (e.isComposing) return;
        e.preventDefault();
        this.selectedItem?.select();
    }
  };

  /** The row under the pointer takes the highlight (no scroll). */
  private onPointerMove = (e: Event) => {
    const row = e.composedPath().find((n) => (n as Element).localName === "acme-command-item") as AcmeCommandItem | undefined;
    if (row && !row.disabled && !row.hidden && !row.selected) this.highlight(row, false);
  };

  /** A row was selected: the menu closes, unless the row keeps it open or a listener canceled the event (read once every listener has run). */
  private onSelect = (e: Event) => {
    const detail = (e as CustomEvent<CommandItemSelectDetail>).detail;
    if (!detail?.closeOnCallback) return;
    queueMicrotask(() => {
      if (!e.defaultPrevented) this.close();
    });
  };

  private onCancel = (e: Event) => {
    e.preventDefault();
    this.close();
  };

  /** The dialog closed on its own (a second Escape the platform no longer lets us cancel): the menu leaves at once. */
  private onNativeClose = () => {
    if (this.open) this.open = false;
    else if (this.mounted) this.unmount();
  };

  /** A primary press on the backdrop closes the menu (a secondary or Ctrl press does not). */
  private onPointerDown = (e: PointerEvent) => {
    if (e.target !== this.dialog) return;
    const r = this.dialog.getBoundingClientRect();
    const inside = r.width > 0 && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (inside || e.button !== 0 || e.ctrlKey) return;
    this.close();
  };

  /** Near the list's end, more rows load. */
  private onScroll = async () => {
    const list = this.list;
    const cb = this.infiniteScrollingCb;
    if (!list || !cb || !this.infiniteScrollingThreshold) return;
    if (list.scrollHeight - (list.scrollTop + list.clientHeight) < this.infiniteScrollingThreshold && (await cb())) list.scrollTop = list.scrollHeight;
  };

  private onHotkey = () => {
    if (this.open) this.close();
    else this.show();
  };

  private toPage(i: number) {
    if (i !== this.pages.length - 1) this.setPages(this.pages.slice(0, i + 1));
  }

  /** The exit: the closed frame animates, then the menu leaves; an open during it keeps the dialog. */
  private exit() {
    const token = ++this.exitToken;
    const dialog = this.dialog;
    void dialog.offsetWidth;
    const anims = typeof dialog.getAnimations === "function" ? dialog.getAnimations({ subtree: true }).filter((a) => (a.effect as KeyframeEffect | null)?.target === dialog) : [];
    const done = () => {
      if (token === this.exitToken) this.unmount();
    };
    if (anims.length) Promise.all(anims.map((a) => a.finished.catch(() => {}))).then(done);
    else done();
  }

  /** The menu leaves: the dialog closes (focus returns to the element that had it), the page scrolls again. */
  private unmount() {
    this.mounted = false;
    if (this.dialog?.open) this.dialog.close();
    this.unlock?.();
    this.unlock = undefined;
    this.dispatchEvent(new CustomEvent("acme-close", { bubbles: true, composed: true }));
  }

  willUpdate(ch: Map<string, unknown>) {
    if (ch.has("open") && this.open) {
      this.exitToken++;
      this.mounted = true;
    }
    if (ch.has("pages") && this.hasUpdated) {
      clearTimeout(this.readyTimer);
      this.search = "";
      this.searchChanged = true;
      this.ready = true;
    }
    if (this.rowsChanged || this.searchChanged || ch.has("pages") || ch.has("value") || ch.has("shouldFilter") || ch.has("filter") || ch.has("open")) {
      this.rowsChanged = false;
      this.apply();
    }
  }

  updated(ch: Map<string, unknown>) {
    this.escState.attach(this.escButton);
    if (ch.has("hotkey")) {
      if (this.keys) {
        this.keys.hostDisconnected();
        this.removeController(this.keys);
        this.keys = undefined;
      }
      const combo = this.hotkey && this.hotkey !== "false" ? this.hotkey : "";
      if (combo) {
        this.keys = new HotkeyController(this, combo as RegisterableHotkey, this.onHotkey, { conflictBehavior: "allow" });
        this.addController(this.keys);
      }
    }
    if (ch.has("value") && ch.get("value") !== undefined) this.dispatchEvent(new CustomEvent<{ value: string }>("acme-highlight", { detail: { value: this.value }, bubbles: true, composed: true }));
    if (ch.has("pages") && ch.get("pages") !== undefined) {
      // The page change: the dialog pulses, the searchbox takes focus, the list returns to its top.
      const dialog = this.dialog;
      dialog.style.transform = "scale(0.99)";
      clearTimeout(this.pulseTimer);
      this.pulseTimer = setTimeout(() => {
        dialog.style.transform = "";
      }, PULSE_MS);
      if (this.open) this.input?.focus();
    }
    if ((ch.has("pages") || ch.has("search")) && this.list) this.list.scrollTop = 0;
    if (this.pendingScroll) {
      const row = this.pendingScroll;
      this.pendingScroll = undefined;
      const group = row.closest("acme-command-group");
      if (group && group.items[0] === row) group.scrollIntoView?.({ block: "nearest" });
      row.scrollIntoView?.({ block: "nearest" });
    }
    if (!ch.has("open")) return;
    if (this.open) {
      if (!this.dialog.open) this.dialog.showModal();
      this.unlock ??= preventBodyScroll();
      this.input?.focus();
      this.dispatchEvent(new CustomEvent("acme-open", { bubbles: true, composed: true }));
    } else if (this.mounted) this.exit();
  }

  render() {
    const page = this.activePage;
    const q = this.search;
    const state = this.mounted ? (this.open ? "open" : "closed") : nothing;
    return html`<dialog
      class="dialog"
      data-state=${state}
      aria-label=${this.label || nothing}
      aria-labelledby="title"
      aria-describedby="desc"
      @cancel=${this.onCancel}
      @close=${this.onNativeClose}
      @keydown=${this.onKey}
      @pointerdown=${this.onPointerDown}
      part="dialog"
    >
      <h2 class="title" id="title">Command Menu</h2>
      <p class="desc" id="desc">${this.description}</p>
      <div class="root" part="root">
        <label class="label" for="input" id="label" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0">${this.label}</label>
        <div class="head" part="head">
          ${
            this.pages.length
              ? html`<div class="crumbs" part="crumbs">
                  <acme-breadcrumbs type="menu">${this.pages.map((p, i) => html`<acme-breadcrumb menu @click=${() => this.toPage(i)}>${p.label}</acme-breadcrumb>`)}</acme-breadcrumbs>
                </div>`
              : nothing
          }
          <div class="field" part="field">
            <input
              class="input"
              id="input"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-controls="list"
              aria-expanded="true"
              aria-labelledby="label"
              autocomplete="off"
              autocorrect="off"
              spellcheck="false"
              placeholder=${page?.placeholder || this.placeholder || nothing}
              .value=${q}
              @input=${this.onInput}
              @keydown=${this.onInputKey}
              part="input"
            />
            <button class="esc" type="button" @click=${() => this.close()} part="esc">Esc</button>
          </div>
          ${this.loading ? html`<div class="loading" part="loading"></div>` : nothing}
        </div>
        <div class="list" role="listbox" aria-label="Suggestions" aria-labelledby="input" id="list" @scroll=${this.onScroll} part="list">
          <div class="sizer">
            ${this.count === 0 ? html`<div class="empty" role="presentation" part="empty"><p class="empty-text">No results found for <span class="query">"${q}"</span>.</p></div>` : nothing}
            <slot @slotchange=${this.readChildren}></slot>
          </div>
        </div>
      </div>
    </dialog>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-command-menu": AcmeCommandMenu;
  }
}
