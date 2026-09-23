import { ContextProvider } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { AcmeElement, sharedCss } from "../../base";
import { treeViewCss } from "../../generated/components/tree-view/tree-view.styles";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { composedContains, deepActiveElement } from "../../shared/composed-tree";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { StoreSelector } from "../../shared/store-connection";
import { type TreeOwner, type TreePart, treeContext, treePartFor } from "../../shared/tree-context";
import { copyTreeNodes, type TreeEntry, type TreeNode, treeEntries, treeKeys, visibleTreeEntries } from "../../shared/tree-model";
import { Typeahead } from "../../shared/typeahead";

export type { TreeNode } from "../../shared/tree-model";
/** Named hierarchical navigation with separate focus, expansion and single selection.
 * @slot - Optional Tree Item content keyed to IDs in items.
 * @csspart root - Named tree.
 * @csspart item - Hierarchy node.
 * @csspart content - Focusable node row.
 * @csspart indicator - Decorative expansion indicator.
 * @csspart children - Child group.
 * @fires {CustomEvent<{value:string}>} acme-change - User selection changes.
 * @fires {CustomEvent<{expanded:readonly string[]}>} acme-expanded-change - User expansion changes.
 * @fires {CustomEvent<{action:"activate",value:string}>} acme-request - Cancelable default activation.
 */
export class AcmeTreeView extends AcmeSemanticElement {
  static shadowRootOptions = { ...AcmeElement.shadowRootOptions, slotAssignment: "manual" as const };
  static styles = [sharedCss, treeViewCss];
  @atomState() private nodes: readonly TreeNode[] = Object.freeze([]);
  /** Sole source of hierarchy, IDs, accessible labels and links. @default [] */
  @property({ noAccessor: true, attribute: false }) get items(): readonly TreeNode[] {
    return this.nodes;
  }
  set items(value: readonly TreeNode[]) {
    const previous = this.nodes;
    this.nodes = copyTreeNodes(value);
    this.requestUpdate("items", previous);
  }
  @atomState() private openKeys: readonly string[] = Object.freeze([]);
  /** Expanded node IDs. @default [] */
  @property({ noAccessor: true, attribute: false }) get expanded(): readonly string[] {
    return this.openKeys;
  }
  set expanded(value: readonly string[]) {
    const previous = this.openKeys;
    this.openKeys = treeKeys(value);
    this.requestUpdate("expanded", previous);
  }
  @atomState() private selected?: string;
  @property({ noAccessor: true, converter: optionalString }) get value(): string | undefined {
    return this.selected;
  }
  set value(value: string | undefined) {
    if (value !== undefined && (typeof value !== "string" || !value.trim())) throw new TypeError("Tree value requires a nonempty identifier");
    const previous = this.selected;
    this.selected = value;
    this.requestUpdate("value", previous);
  }
  @atomState() private selectionMode: "none" | "single" = "single";
  /** @default "single" */
  @property({ noAccessor: true, useDefault: true }) get selection(): "none" | "single" {
    return this.selectionMode;
  }
  set selection(value: "none" | "single") {
    if (value !== "none" && value !== "single") throw new TypeError("Invalid Tree selection");
    const previous = this.selectionMode;
    this.selectionMode = value;
    this.requestUpdate("selection", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) disabled = false;
  @atomState() private focused?: string;
  private readonly parts = createAtom<readonly TreePart[]>([]);
  private readonly revision = createAtom(0);
  private readonly entries = createAtom(() => treeEntries(this.items));
  private readonly content = createAtom(() => {
    this.revision.get();
    const result = new Map<string, TreePart>();
    const duplicates = new Set<string>();
    for (const part of this.parts.get()) {
      const key = part.value();
      part.disabled();
      if (part.host.parentNode !== this || !key) continue;
      if (result.has(key)) duplicates.add(key);
      result.set(key, part);
    }
    for (const key of duplicates) result.delete(key);
    return result;
  });
  private readonly state = createAtom(() => ({ entries: this.entries.get(), expanded: this.expanded, value: this.value, selection: this.selection, disabled: this.disabled }));
  private readonly owner: TreeOwner = {
    state: this.state,
    register: (part) => {
      this.parts.set((parts) => [...parts, part]);
      return () => this.parts.set((parts) => parts.filter((item) => item !== part));
    },
  };
  private readonly provider = new ContextProvider(this, { context: treeContext, initialValue: this.owner });
  private readonly updates = new StoreSelector(this, () => this.state);
  private readonly contentUpdates = new StoreSelector(this, () => this.content);
  private readonly typeahead = new Typeahead<TreeEntry>(this, {
    items: () => this.enabled(),
    current: () => this.enabled().find((entry) => entry.node.id === this.focused),
    text: (entry) => entry.node.label,
    move: (entry) => this.focus(entry.node.id),
    locale: () => this.themeContext.scope.effective.get().locale,
  });
  private observer?: MutationObserver;
  private previous: readonly TreeEntry[] = [];
  private recover?: string;
  private recoverRoot = false;
  private warning = "";
  private visible() {
    return visibleTreeEntries(this.entries.get(), this.expanded);
  }
  private unavailable(entry: TreeEntry) {
    return this.disabled || !!entry.node.disabled || !!this.content.get().get(entry.node.id)?.disabled();
  }
  private enabled() {
    return this.visible().filter((entry) => !this.unavailable(entry));
  }
  private entryId() {
    const enabled = this.enabled();
    return enabled.some((entry) => entry.node.id === this.focused) ? this.focused : enabled.some((entry) => entry.node.id === this.value) ? this.value : enabled[0]?.node.id;
  }
  private row(value: string) {
    return [...this.renderRoot.querySelectorAll<HTMLElement>("[data-tree-row]")].find((row) => row.dataset.treeRow === value);
  }
  focus(value?: string | FocusOptions) {
    const key = typeof value === "string" ? value : this.entryId();
    if (!key || !this.enabled().some((entry) => entry.node.id === key)) return;
    const row = this.row(key);
    if (!row) return;
    this.focused = key;
    row.focus(typeof value === "object" ? value : { preventScroll: true });
    row.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  expand(value: string) {
    const entry = this.entries.get().find((entry) => entry.node.id === value);
    if (entry?.node.children?.length && !this.expanded.includes(value)) this.expanded = [...this.expanded, value];
  }
  collapse(value: string) {
    if (this.expanded.includes(value)) this.expanded = this.expanded.filter((key) => key !== value);
  }
  private userExpand(value: string, open: boolean) {
    const previous = this.expanded;
    open ? this.expand(value) : this.collapse(value);
    if (previous !== this.expanded) this.dispatchEvent(new CustomEvent("acme-expanded-change", { detail: Object.freeze({ expanded: this.expanded }), bubbles: true, composed: true }));
  }
  private activate(entry: TreeEntry, event: MouseEvent) {
    if (event.defaultPrevented) return;
    if (this.unavailable(entry)) {
      event.preventDefault();
      return;
    }
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const request = new CustomEvent("acme-request", { detail: Object.freeze({ action: "activate", value: entry.node.id }), bubbles: true, composed: true, cancelable: true });
    if (!this.dispatchEvent(request)) {
      event.preventDefault();
      return;
    }
    this.focus(entry.node.id);
    if (this.selection === "single" && this.value !== entry.node.id) {
      this.value = entry.node.id;
      this.dispatchEvent(new CustomEvent("acme-change", { detail: Object.freeze({ value: this.value }), bubbles: true, composed: true }));
    }
    if (entry.node.children?.length) this.userExpand(entry.node.id, !this.expanded.includes(entry.node.id));
  }
  private keydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing || this.disabled || event.metaKey || event.ctrlKey || event.altKey) return;
    const row = event.composedPath().find((node) => (node as HTMLElement).dataset?.treeRow !== undefined) as HTMLElement | undefined;
    if (!row || row.getRootNode() !== this.renderRoot) return;
    const entry = this.entries.get().find((item) => item.node.id === row.dataset.treeRow);
    if (!entry) return;
    const enabled = this.enabled(),
      index = enabled.findIndex((item) => item.node.id === entry.node.id);
    const rtl = this.ownerDocument.defaultView!.getComputedStyle(this).direction === "rtl";
    let target: TreeEntry | undefined;
    if (event.key === "ArrowDown") target = enabled[index + 1];
    else if (event.key === "ArrowUp") target = enabled[index - 1];
    else if (event.key === "Home") target = enabled[0];
    else if (event.key === "End") target = enabled.at(-1);
    else if (event.key === (rtl ? "ArrowLeft" : "ArrowRight")) {
      if (!this.unavailable(entry) && entry.node.children?.length) {
        if (!this.expanded.includes(entry.node.id)) this.userExpand(entry.node.id, true);
        else target = enabled.find((item) => item.parent === entry.node.id);
      }
    } else if (event.key === (rtl ? "ArrowRight" : "ArrowLeft")) {
      if (!this.unavailable(entry) && entry.node.children?.length && this.expanded.includes(entry.node.id)) this.userExpand(entry.node.id, false);
      else {
        let parent = entry.parent;
        while (parent) {
          target = enabled.find((item) => item.node.id === parent);
          if (target) break;
          parent = this.entries.get().find((item) => item.node.id === parent)?.parent;
        }
      }
    } else if (event.key === "Enter" || (event.key === " " && !this.typeahead.active)) {
      event.preventDefault();
      if (!this.unavailable(entry)) row.click();
      return;
    } else {
      this.typeahead.handleKey(event);
      return;
    }
    event.preventDefault();
    this.typeahead.clear();
    if (target) this.focus(target.node.id);
  };
  private scan = () => {
    for (const child of this.children) {
      const part = treePartFor(child);
      if (part && part.currentOwner() !== this.owner) part.reconnect();
    }
    for (const part of this.parts.get()) if (part.host.parentNode !== this) part.reconnect();
    this.revision.set((value) => value + 1);
  };
  connectedCallback() {
    super.connectedCallback();
    this.observer = new MutationObserver(this.scan);
    this.observer.observe(this, { childList: true, attributes: true, subtree: true, attributeFilter: ["value", "disabled"] });
    this.scan();
  }
  disconnectedCallback() {
    this.observer?.disconnect();
    this.observer = undefined;
    super.disconnectedCallback();
  }
  protected willUpdate() {
    const active = deepActiveElement(this.ownerDocument);
    const held = active && composedContains(this, active);
    if (held) {
      const id = (active as HTMLElement).dataset?.treeRow;
      const enabled = this.enabled();
      if (id && !enabled.some((entry) => entry.node.id === id)) {
        let parent = this.previous.find((entry) => entry.node.id === id)?.parent;
        while (parent && !enabled.some((entry) => entry.node.id === parent)) parent = this.previous.find((entry) => entry.node.id === parent)?.parent;
        this.recover = parent ?? enabled[0]?.node.id;
        this.recoverRoot = !this.recover;
        this.focused = this.recover;
      }
    }
    this.previous = this.entries.get();
  }
  protected updated() {
    const content = this.content.get();
    for (const slot of this.renderRoot.querySelectorAll<HTMLSlotElement>("slot[data-node]")) {
      const part = content.get(slot.dataset.node!);
      const nodes = part ? [part.host] : [];
      const previous = slot.assignedNodes();
      if (nodes.length !== previous.length || nodes.some((node, index) => node !== previous[index])) slot.assign(...nodes);
    }
    for (const row of this.renderRoot.querySelectorAll<HTMLElement>("[data-tree-row]")) {
      const part = content.get(row.dataset.treeRow!);
      const descriptions = part ? [...part.host.children].filter((child) => child.getAttribute("slot") === "description") : [];
      row.ariaDescribedByElements = descriptions.length ? descriptions : null;
      if (row.parentElement?.getAttribute("role") === "treeitem") row.parentElement.ariaDescribedByElements = descriptions.length ? descriptions : null;
    }
    const known = new Set(this.entries.get().map((entry) => entry.node.id));
    const invalid = this.parts
      .get()
      .filter((part) => part.host.parentNode === this && (!known.has(part.value()) || !content.has(part.value())))
      .map((part) => part.value());
    const warning = invalid.join("|");
    if (warning && warning !== this.warning) console.warn(this.localName, { code: "tree-content-unknown-or-duplicate", values: invalid });
    this.warning = warning;
    if (this.recover) {
      const key = this.recover;
      this.recover = undefined;
      this.focus(key);
    } else if (this.recoverRoot) {
      this.recoverRoot = false;
      this.renderRoot.querySelector<HTMLElement>("[part=root]")?.focus({ preventScroll: true });
    }
  }
  private contentFor(entry: TreeEntry) {
    const key = entry.node.id;
    return html`<span part="indicator" aria-hidden="true">${entry.node.children?.length ? html`<acme-chevron-right-icon size="16px"></acme-chevron-right-icon>` : nothing}</span><slot data-node=${key}>${entry.node.label}</slot>`;
  }
  private renderRow(entry: TreeEntry, branch: boolean) {
    const disabled = this.unavailable(entry),
      selected = this.selection === "single" && this.value === entry.node.id;
    return entry.node.href
      ? html`<a part=${branch ? "content" : "item content"} role=${branch ? "button" : "treeitem"} href=${entry.node.href && !disabled ? entry.node.href : nothing} data-tree-row=${entry.node.id} data-selected=${String(selected)} data-expanded=${String(this.expanded.includes(entry.node.id))} aria-label=${entry.node.label} aria-disabled=${disabled ? "true" : nothing} aria-selected=${!branch && this.selection === "single" && !disabled ? String(selected) : nothing} aria-level=${branch ? nothing : entry.level} aria-posinset=${branch ? nothing : entry.position} aria-setsize=${branch ? nothing : entry.size} tabindex=${!disabled && entry.node.id === this.entryId() ? 0 : -1} @focus=${() => {
          this.focused = entry.node.id;
        }} @click=${(event: MouseEvent) => this.activate(entry, event)}>${this.contentFor(entry)}</a>`
      : html`<div part=${branch ? "content" : "item content"} role=${branch ? "button" : "treeitem"} href=${entry.node.href && !disabled ? entry.node.href : nothing} data-tree-row=${entry.node.id} data-selected=${String(selected)} data-expanded=${String(this.expanded.includes(entry.node.id))} aria-label=${entry.node.label} aria-disabled=${disabled ? "true" : nothing} aria-selected=${!branch && this.selection === "single" && !disabled ? String(selected) : nothing} aria-level=${branch ? nothing : entry.level} aria-posinset=${branch ? nothing : entry.position} aria-setsize=${branch ? nothing : entry.size} tabindex=${!disabled && entry.node.id === this.entryId() ? 0 : -1} @focus=${() => {
          this.focused = entry.node.id;
        }} @click=${(event: MouseEvent) => this.activate(entry, event)}>${this.contentFor(entry)}</div>`;
  }
  private renderNodes(nodes: readonly TreeNode[]): TemplateResult {
    return html`${repeat(
      nodes,
      (node) => node.id,
      (node) => {
        const entry = this.entries.get().find((item) => item.node.id === node.id)!;
        if (!node.children?.length) return this.renderRow(entry, false);
        const open = this.expanded.includes(node.id),
          disabled = this.unavailable(entry);
        return html`<div part="item" role="treeitem" aria-label=${node.label} aria-expanded=${String(open)} aria-selected=${this.selection === "single" && !disabled ? String(this.value === node.id) : nothing} aria-disabled=${disabled ? "true" : nothing} aria-level=${entry.level} aria-posinset=${entry.position} aria-setsize=${entry.size}>${this.renderRow(entry, true)}<div part="children" role="group" ?hidden=${!open} ?inert=${!open}>${this.renderNodes(node.children)}</div></div>`;
      },
    )}`;
  }
  render() {
    return html`<div part="root" role="tree" tabindex=${this.enabled().length ? -1 : 0} aria-disabled=${this.disabled ? "true" : nothing} @keydown=${this.keydown} @focusout=${(event: FocusEvent) => {
      if (event.relatedTarget && !composedContains(this, event.relatedTarget as Node)) this.focused = undefined;
    }}>${this.renderNodes(this.items)}</div>`;
  }
  protected get semanticDefaults() {
    return { role: "tree" };
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-tree-view": AcmeTreeView;
  }
}
