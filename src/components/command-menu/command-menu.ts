import { ContextProvider } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { HotkeyController, type RegisterableHotkey } from "@tanstack/lit-hotkeys";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { ComposedParticipants } from "../../shared/composed-participants";
import { commandContext, commandPartFor, isCommandBoundary, registerCommandBoundary, type CommandOwner, type CommandPart } from "../../shared/command-context";
import { rankCommands, type CommandMenuFilter, type SearchableCommand } from "../../shared/command-ranking";
import { Places } from "../../shared/places";
import { optionalString } from "../../shared/attributes";
import { message, messageCatalogs } from "../../shared/messages";
import type { DialogReason } from "../../shared/dialog-context";
import type { AcmeDialog } from "../dialog/dialog";
import type { AcmeInput } from "../input/input";
import type { AcmeScrollArea } from "../scroll-area/scroll-area";
import { commandMenuStructureCss } from "../../generated/components/command-menu/command-menu-structure.styles";
export type { CommandMenuFilter } from "../../shared/command-ranking";
type Entry = SearchableCommand & { part: CommandPart; group?: CommandPart };
type Block = { part: CommandPart; members: readonly CommandPart[] };
/** Searchable application actions composed from Dialog, Input and Scroll Area.
 * @slot - Direct Command Item, Command Group and Command Separator children.
 * @slot empty - Empty result content.
 * @slot loading - Loading feedback.
 * @slot error - Application error content.
 * @slot footer - Application controls such as page navigation.
 * @csspart root - The composition wrapper.
 * @csspart dialog - The composed dialog surface.
 * @csspart input - The search field.
 * @csspart list - The result listbox.
 * @csspart empty - Empty result content.
 * @csspart loading - Loading feedback.
 * @fires {CustomEvent<{value:string}>} acme-input - A user edits the query.
 * @fires {CustomEvent<{action:"select",value:string}|{action:"load-more",query:string}|{action:"close",reason:DialogReason}>} acme-request - Application action or cancelable dismissal request.
 * @fires {CustomEvent<{open:boolean,reason:DialogReason}>} acme-open-change - A user changes visibility.
 */
export class AcmeCommandMenu extends AcmeElement {
  static shadowRootOptions = { ...AcmeElement.shadowRootOptions, slotAssignment: "manual" as const };
  static styles = [sharedCss, commandMenuStructureCss];
  @atomState() private opened = false;
  private reason: DialogReason = "programmatic";
  /** @default false */
  @property({ noAccessor: true, type: Boolean, reflect: true }) get open() {
    return this.opened;
  }
  set open(value: boolean) {
    const previous = this.opened;
    this.reason = "programmatic";
    this.opened = Boolean(value);
    if (this.dialog) this.dialog.open = this.opened;
    this.requestUpdate("open", previous);
  }
  @atomState() private queryText = "";
  /** Programmatic query changes remain silent. @default "" */
  @property({ noAccessor: true, useDefault: true }) get query(): string {
    return this.queryText;
  }
  set query(value: string) {
    if (typeof value !== "string") throw new TypeError("Command query must be a string");
    const previous = this.queryText;
    if (value === previous) return;
    this.queryText = value;
    this.highlighted?.set({});
    this.lastRequest = "";
    this.requestUpdate("query", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) loading = false;
  @atomState() @property({ noAccessor: true, useDefault: true }) placeholder = "";
  @atomState() @property({ noAccessor: true, useDefault: true }) heading = "";
  @atomState() @property({ noAccessor: true, useDefault: true }) description = "";
  @atomState() private ranking?: CommandMenuFilter;
  /** Per-item score; zero excludes an item. Keywords include its visible label. */
  @property({ noAccessor: true, attribute: false }) get filter(): CommandMenuFilter | undefined {
    return this.ranking;
  }
  set filter(value: CommandMenuFilter | undefined) {
    if (value !== undefined && typeof value !== "function") throw new TypeError("Command filter must be a function");
    const previous = this.ranking;
    this.ranking = value;
    this.requestUpdate("filter", previous);
  }
  @atomState() private shortcut?: string;
  /** Optional application shortcut; omission registers nothing. */
  @property({ noAccessor: true, converter: optionalString }) get hotkey(): string | undefined {
    return this.shortcut;
  }
  set hotkey(value: string | undefined) {
    if (value !== undefined && (typeof value !== "string" || !value.trim())) throw new TypeError("Hotkey must be a nonempty shortcut");
    const previous = this.shortcut;
    if (value === previous) return;
    this.shortcut = value;
    this.configureHotkey();
    this.requestUpdate("hotkey", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean, attribute: "has-more" }) hasMore = false;
  @atomState() private threshold = 0;
  /** Positive distance in pixels that enables application load-more requests. @default 0 */
  @property({ noAccessor: true, type: Number, useDefault: true, attribute: "load-more-threshold" }) get loadMoreThreshold(): number {
    return this.threshold;
  }
  set loadMoreThreshold(value: number) {
    if (!Number.isFinite(value) || value < 0) throw new RangeError("Load-more threshold must be nonnegative");
    const previous = this.threshold;
    this.threshold = value;
    this.requestUpdate("loadMoreThreshold", previous);
  }
  private readonly places = new Places(this, { places: ["error", "footer"] });
  private readonly parts = createAtom<readonly CommandPart[]>([]);
  private readonly revision = createAtom(0);
  private readonly highlighted = createAtom<{ part?: CommandPart }>({});
  private readonly entries = createAtom<readonly Entry[]>(() => {
    this.revision.get();
    const parts = this.parts.get(),
      groups = parts.filter((part) => part.kind === "group" && part.host.parentNode === this && !part.host.hidden);
    const groupSet = new Set(groups.map((part) => part.host));
    return parts
      .filter((part) => part.kind === "item" && !part.host.hidden && (part.host.parentNode === this || groupSet.has(part.host.parentNode as any)))
      .sort((a, b) => (a.host.compareDocumentPosition(b.host) & Node.DOCUMENT_POSITION_PRECEDING ? 1 : -1))
      .map((part) => ({ part, group: groups.find((group) => group.host === part.host.parentNode), value: part.value(), label: part.label(), keywords: part.keywords(), disabled: part.disabled() }));
  });
  private readonly ranked = createAtom(() => Object.freeze(rankCommands(this.entries.get(), this.query, this.filter)));
  private readonly visible = createAtom(() => this.ranked.get().map((entry) => entry.part));
  private readonly state = createAtom(() => ({ open: this.open, active: this.highlighted.get().part, visible: this.visible.get() }));
  private readonly owner: CommandOwner = {
    state: this.state,
    register: (part) => {
      this.parts.set((parts) => [...parts, part]);
      return () => this.parts.set((parts) => parts.filter((p) => p !== part));
    },
    highlight: (part) => this.highlight(part),
    canSelect: (part) => this.enabled().includes(part),
    select: (part) => this.select(part),
  };
  private readonly provider = new ContextProvider(this, { context: commandContext, initialValue: this.owner });
  private readonly updates = new StoreSelector(this, () => this.state);
  private readonly rankingUpdates = new StoreSelector(this, () => this.ranked);
  private readonly localeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private readonly messageUpdates = new StoreSelector(this, () => messageCatalogs);
  private readonly participants = new ComposedParticipants(this, {
    owner: this.owner,
    parts: () => this.parts.get(),
    find: commandPartFor,
    boundary: isCommandBoundary,
    descend: (part) => part.kind === "group",
    slots: () => [...this.renderRoot.querySelectorAll("slot")],
    changed: () => this.revision.set((value) => value + 1),
  });
  private mutation?: MutationObserver;
  private resize?: ResizeObserver;
  private viewport?: HTMLElement;
  private viewportBinding?: Promise<void>;
  private keys?: HotkeyController;
  private lastRequest = "";
  private diagnostic = "";
  private composing = false;
  private measureFrame = 0;
  constructor() {
    super();
    registerCommandBoundary(this);
  }
  private get dialog() {
    return this.renderRoot?.querySelector<AcmeDialog>("acme-dialog") ?? undefined;
  }
  private get input() {
    return this.renderRoot?.querySelector<AcmeInput>("acme-input") ?? undefined;
  }
  private get list() {
    return this.renderRoot?.querySelector<HTMLElement>("[part=list]") ?? undefined;
  }
  private get area() {
    return this.renderRoot?.querySelector<AcmeScrollArea>("acme-scroll-area") ?? undefined;
  }
  private text(key: string, fallback: string) {
    return message(this.themeContext.scope.effective.get().locale, "command." + key, fallback);
  }
  private enabled() {
    const entries = this.entries.get(),
      counts = new Map<string, number>();
    for (const entry of entries) counts.set(entry.value, (counts.get(entry.value) ?? 0) + 1);
    return this.ranked
      .get()
      .filter((entry) => entry.value.trim() && entry.label.trim() && !entry.disabled && counts.get(entry.value) === 1 && !entry.part.host.inert)
      .map((entry) => entry.part);
  }
  private blocks(): Block[] {
    const ranked = this.ranked.get(),
      visible = new Set(ranked.map((entry) => entry.part));
    if (!this.query && !this.filter) {
      const blocks = [...this.children]
        .map((child) => commandPartFor(child))
        .filter((part): part is CommandPart => !!part && !part.host.hidden)
        .flatMap((part) => {
          if (part.kind === "item") return visible.has(part) ? [{ part, members: [] }] : [];
          if (part.kind === "separator") return [{ part, members: [] }];
          const members = [...part.host.children]
            .map((child) => commandPartFor(child))
            .filter((member): member is CommandPart => !!member && (visible.has(member) || member.kind === "separator") && !member.host.hidden);
          return members.some((member) => member.kind === "item") ? [{ part, members }] : [];
        });
      return blocks.filter((block, index) => block.part.kind !== "separator" || (index > 0 && index < blocks.length - 1 && blocks[index - 1].part.kind !== "separator"));
    }
    const blocks: Block[] = [];
    const seen = new Set<CommandPart>();
    for (const entry of ranked) {
      const part = entry.group ?? entry.part;
      if (seen.has(part)) continue;
      seen.add(part);
      blocks.push({ part, members: entry.group ? ranked.filter((item) => item.group === entry.group).map((item) => item.part) : [] });
    }
    return blocks;
  }
  private highlight(part: CommandPart, scroll = false) {
    if (!this.enabled().includes(part)) return;
    if (this.highlighted.get().part !== part) this.highlighted.set({ part });
    if (scroll) part.host.scrollIntoView({ block: "nearest" });
  }
  private select(part: CommandPart) {
    if (!this.open || !this.enabled().includes(part)) return;
    const event = new CustomEvent("acme-request", { detail: Object.freeze({ action: "select", value: part.value() }), bubbles: true, composed: true, cancelable: true });
    if (this.dispatchEvent(event)) this.userOpen(false, "selection");
  }
  private userOpen(open: boolean, reason: DialogReason) {
    if (open === this.open) return;
    const previous = this.opened;
    this.reason = reason;
    this.opened = open;
    if (this.dialog) this.dialog.open = open;
    this.requestUpdate("open", previous);
    this.dispatchEvent(new CustomEvent("acme-open-change", { detail: Object.freeze({ open, reason }), bubbles: true, composed: true }));
  }
  show() {
    this.open = true;
  }
  hide() {
    this.open = false;
  }
  focus(options?: FocusOptions) {
    this.input?.focus(options);
  }
  private edit = (event: CustomEvent<{ value: string }>) => {
    event.stopPropagation();
    if (event.detail.value === this.query) return;
    this.query = event.detail.value;
    this.dispatchEvent(new CustomEvent("acme-input", { detail: Object.freeze({ value: this.query }), bubbles: true, composed: true }));
  };
  private keydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing || this.composing) return;
    const items = this.enabled(),
      index = items.indexOf(this.highlighted.get().part!);
    let target: number | undefined;
    if (event.key === "ArrowDown") target = Math.min(index + 1, items.length - 1);
    else if (event.key === "ArrowUp") target = Math.max(index - 1, 0);
    else if (event.key === "Home" && (event.ctrlKey || event.metaKey)) target = 0;
    else if (event.key === "End" && (event.ctrlKey || event.metaKey)) target = items.length - 1;
    else if (event.key === "Enter") {
      event.preventDefault();
      const active = this.highlighted.get().part;
      if (active) this.select(active);
      return;
    }
    if (target !== undefined) {
      event.preventDefault();
      event.stopPropagation();
      if (items[target]) this.highlight(items[target], true);
    }
  };
  private dialogRequest = (event: CustomEvent) => {
    if (event.target !== this.dialog || event.detail?.action !== "close") return;
    event.stopPropagation();
    const forwarded = new CustomEvent("acme-request", { detail: event.detail, bubbles: true, composed: true, cancelable: true });
    if (!this.dispatchEvent(forwarded)) event.preventDefault();
  };
  private dialogChanged = (event: CustomEvent<{ open: boolean; reason: DialogReason }>) => {
    if (event.target !== this.dialog) return;
    event.stopPropagation();
    this.userOpen(event.detail.open, event.detail.reason);
  };
  private dialogAfter = (event: CustomEvent) => {
    if (event.target !== this.dialog) return;
    event.stopPropagation();
    if (event.type === "acme-after-open") {
      this.focus();
      this.measure();
    }
    this.dispatchEvent(new CustomEvent(event.type, { detail: Object.freeze({ reason: this.reason }), bubbles: true, composed: true }));
  };
  private measure = () => {
    if (this.measureFrame) return;
    this.measureFrame = this.ownerDocument.defaultView!.requestAnimationFrame(() => {
      this.measureFrame = 0;
      const height = Math.max(48, this.renderRoot?.querySelector<HTMLElement>("[part=results]")?.scrollHeight ?? 0);
      if (this.style.getPropertyValue("--_command-list-height") !== height + "px") this.style.setProperty("--_command-list-height", height + "px");
      this.more();
    });
  };
  private more = () => {
    if (!this.open || !this.hasMore || this.loading || this.loadMoreThreshold <= 0 || !this.viewport) return;
    const near = this.viewport.scrollHeight - this.viewport.clientHeight - this.viewport.scrollTop <= this.loadMoreThreshold;
    if (!near) {
      this.lastRequest = "";
      return;
    }
    const key = JSON.stringify([this.query, this.entries.get().map((entry) => entry.value)]);
    if (key === this.lastRequest) return;
    this.lastRequest = key;
    this.dispatchEvent(new CustomEvent("acme-request", { detail: Object.freeze({ action: "load-more", query: this.query }), bubbles: true, composed: true }));
  };
  private configureHotkey() {
    if (this.keys) {
      this.keys.hostDisconnected();
      this.removeController(this.keys);
      this.keys = undefined;
    }
    if (this.shortcut && this.isConnected) {
      this.keys = new HotkeyController(
        this,
        this.shortcut as RegisterableHotkey,
        (event) => {
          if (event.isComposing || this.hidden || this.inert || !this.getClientRects().length) return;
          this.userOpen(!this.open, "trigger");
        },
        { target: this.ownerDocument, preventDefault: true, stopPropagation: true, requireReset: true, conflictBehavior: "warn" },
      );
      this.addController(this.keys);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.configureHotkey();
    this.mutation = new MutationObserver(() => {
      this.revision.set((value) => value + 1);
      this.requestUpdate();
    });
    this.mutation.observe(this, { subtree: true, childList: true, attributes: true, attributeFilter: ["hidden", "inert", "slot", "style", "class"] });
    this.requestUpdate();
  }
  disconnectedCallback() {
    this.open = false;
    this.mutation?.disconnect();
    this.mutation = undefined;
    this.resize?.disconnect();
    this.resize = undefined;
    this.viewport?.removeEventListener("scroll", this.more);
    this.viewport = undefined;
    if (this.measureFrame) this.ownerDocument.defaultView?.cancelAnimationFrame(this.measureFrame);
    this.measureFrame = 0;
    if (this.keys) {
      this.keys.hostDisconnected();
      this.removeController(this.keys);
      this.keys = undefined;
    }
    this.highlighted.set({});
    super.disconnectedCallback();
  }
  adoptedCallback() {
    super.adoptedCallback();
    this.configureHotkey();
  }
  protected updated() {
    if (!this.isConnected) return;
    const blocks = this.blocks();
    for (const part of this.parts.get()) if (part.kind === "group") part.project?.(blocks.find((block) => block.part === part)?.members ?? []);
    for (const slot of this.renderRoot.querySelectorAll("slot")) {
      const block = slot.getAttribute("data-block");
      const nodes =
        block !== null ? [blocks[Number(block)]?.part.host].filter((node): node is NonNullable<typeof node> => !!node) : [...this.children].filter((child) => child.getAttribute("slot") === slot.name);
      const previous = slot.assignedNodes();
      if (nodes.length !== previous.length || nodes.some((node, i) => node !== previous[i])) slot.assign(...nodes);
    }
    const enabled = this.enabled();
    if (!enabled.includes(this.highlighted.get().part!) && (this.highlighted.get().part !== undefined || enabled[0] !== undefined)) this.highlighted.set(enabled[0] ? { part: enabled[0] } : {});
    if (this.input) {
      this.input.ariaControlsElements = this.list ? [this.list] : null;
      this.input.ariaActiveDescendantElement = this.open ? (this.highlighted.get().part?.host ?? null) : null;
    }
    if (this.dialog) this.dialog.initialFocus = this.input;
    const area = this.area,
      child = this.renderRoot.querySelector("acme-scroll-viewport") as HTMLElement & { updateComplete: Promise<unknown> };
    if (!this.viewport && !this.viewportBinding && area && child)
      this.viewportBinding = Promise.all([area.updateComplete, child.updateComplete]).then(() => {
        this.viewportBinding = undefined;
        if (!this.isConnected || this.area !== area) return;
        this.viewport = area.getViewport();
        this.viewport.addEventListener("scroll", this.more);
        this.measure();
      });
    const results = this.renderRoot.querySelector<HTMLElement>("[part=results]");
    if (!this.resize && results) {
      this.resize = new ResizeObserver(this.measure);
      this.resize.observe(results);
    }
    this.measure();
    const invalid =
      this.entries.get().some((entry) => entry.part.host.hasUpdated && (!entry.value.trim() || !entry.label.trim())) ||
      new Set(this.entries.get().map((entry) => entry.value)).size !== this.entries.get().length;
    const message = invalid ? "command-items-require-unique-values-and-labels" : "";
    if (message && message !== this.diagnostic) console.warn(this.localName, { code: message });
    this.diagnostic = message;
  }
  render() {
    const blocks = this.blocks();
    return html`<div part="root"><acme-dialog exportparts="surface:dialog" .open=${this.open} .ariaLabel=${this.heading || this.text("heading", "Commands")} @acme-request=${this.dialogRequest} @acme-open-change=${this.dialogChanged} @acme-after-open=${this.dialogAfter} @acme-after-close=${this.dialogAfter}>${this.heading ? html`<h2 slot="heading">${this.heading}</h2>` : nothing}${this.description ? html`<p slot="description">${this.description}</p>` : nothing}<div slot="header" class="search"><acme-input type="search" part="input" .value=${this.query} .placeholder=${this.placeholder} role="combobox" aria-autocomplete="list" .ariaExpanded=${String(this.open)} .ariaLabel=${this.text("search", "Search commands")} @acme-input=${this.edit} @acme-change=${(event: Event) => event.stopPropagation()} @keydown=${this.keydown} @compositionstart=${() => (this.composing = true)} @compositionend=${() => {
      this.composing = false;
    }}></acme-input></div><acme-scroll-area><acme-scroll-viewport .ariaLabel=${this.text("results", "Commands")}><div part="results"><div class="sr" role="status" aria-live="polite">${this.loading ? this.text("loading", "Loading…") : this.text(this.ranked.get().length === 1 ? "countOne" : "count", this.ranked.get().length === 1 ? "{count} command" : "{count} commands").replace("{count}", new Intl.NumberFormat(this.themeContext.scope.effective.get().locale).format(this.ranked.get().length))}</div>${this.loading ? html`<div part="loading"><slot name="loading">${this.text("loading", "Loading…")}</slot></div>` : nothing}<slot name="error"></slot>${!this.ranked.get().length && !this.loading && !this.places.has("error") ? html`<div part="empty"><slot name="empty">${this.text("empty", "No results found.")}</slot></div>` : nothing}<div part="list" role="listbox" aria-label=${this.text("results", "Commands")} aria-busy=${String(this.loading)}>${repeat(
      blocks,
      (block) => block.part.host,
      (_block, index) => html`<slot data-block=${index}></slot>`,
    )}</div></div></acme-scroll-viewport></acme-scroll-area><div slot="footer"><slot name="footer"></slot></div></acme-dialog></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-command-menu": AcmeCommandMenu;
  }
}
