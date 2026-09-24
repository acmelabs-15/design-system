import { createAtom } from "@tanstack/lit-store";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { inspectJson, visibleJsonNodes, jsonNodeOpen, jsonHighlight, type JsonNode } from "../../shared/json-view-model";
import { deepActiveElement } from "../../shared/composed-tree";
import { Typeahead } from "../../shared/typeahead";
import { StoreSelector } from "../../shared/store-connection";
import { jsonViewSurfaceCss } from "../../generated/components/json-view/json-view-surface.styles";
type Row = {
  item: HTMLDivElement;
  row: HTMLSpanElement;
  toggle: HTMLSpanElement;
  key: HTMLSpanElement;
  value: HTMLSpanElement;
  group: HTMLDivElement;
  closing: HTMLSpanElement;
  text?: string;
  keyText?: string;
  pattern?: RegExp;
};
/** A read-only, keyboard-accessible inspection of JSON-shaped values.
 * @csspart root - Named tree.
 * @csspart item - A value and its owned child group.
 * @csspart key - Property name.
 * @csspart value - Typed value text.
 * @csspart toggle - Disclosure affordance.
 * @fires {CustomEvent<{expanded:readonly string[]}>} acme-expanded-change - User expansion changes, using JSON Pointer paths.
 */
export class AcmeJsonView extends AcmeSemanticElement {
  static styles = [sharedCss, jsonViewSurfaceCss];
  @atomState() private source = { value: undefined as unknown, model: inspectJson(undefined) };
  @property({ noAccessor: true, converter: { fromAttribute: (value: string | null) => (value === null ? undefined : JSON.parse(value)) } }) get value(): unknown {
    return this.source.value;
  }
  set value(value: unknown) {
    const previous = this.source,
      model = inspectJson(value),
      kept = new Map<string, boolean>();
    for (const [path, open] of this.overrides) if (Object.is(previous.model.byPath.get(path)?.identity, model.byPath.get(path)?.identity) && model.byPath.has(path)) kept.set(path, open);
    this.source = { value, model };
    this.overrides = kept;
    this.requestUpdate("value", previous.value);
  }
  @atomState() private depth = 3;
  /** @default 3 */
  @property({ noAccessor: true, type: Number, attribute: "expanded-depth", useDefault: true }) get expandedDepth() {
    return this.depth;
  }
  set expandedDepth(value: number) {
    if (!Number.isInteger(value) || value < 0) throw new RangeError("Expanded depth must be a nonnegative integer");
    const previous = this.depth;
    this.depth = value;
    this.requestUpdate("expandedDepth", previous);
  }
  @atomState() private search: Readonly<{ value?: string | RegExp; pattern?: RegExp }> = {};
  @property({ noAccessor: true, converter: optionalString }) get highlight(): string | RegExp | undefined {
    return this.search.value;
  }
  set highlight(value: string | RegExp | undefined) {
    const previous = this.search.value;
    this.search = Object.freeze({ value, pattern: jsonHighlight(value) });
    this.requestUpdate("highlight", previous);
  }
  /** This component is a viewer. @default true */
  @property({ noAccessor: true, attribute: "read-only", converter: { fromAttribute: (value: string | null) => value === null || value !== "false" }, useDefault: true }) get readOnly(): boolean {
    return true;
  }
  set readOnly(value: boolean) {
    if (value !== true) throw new TypeError("JSON View is read-only");
  }
  @atomState() private overrides: ReadonlyMap<string, boolean> = new Map();
  @atomState() private focusPath = "";
  private readonly visible = createAtom(() => visibleJsonNodes(this.source.model, this.overrides, this.expandedDepth));
  private readonly changes = new StoreSelector(this, () => this.visible);
  private readonly rows = new Map<string, Row>();
  private previousModel = this.source.model;
  private readonly typeahead = new Typeahead<JsonNode>(this, {
    items: () => this.visible.get(),
    current: () => this.visible.get().find((node) => node.path === this.focusPath),
    text: (node) => node.key ?? node.text,
    move: (node) => this.focusNode(node.path),
    locale: () => this.themeContext.scope.effective.get().locale,
  });
  protected get semanticDefaults() {
    return { role: "tree", label: "JSON" };
  }
  /** Opens every current branch without changing supplied data. */
  expandAll() {
    this.overrides = new Map(this.source.model.nodes.filter((node) => node.children.length).map((node) => [node.path, true]));
  }
  /** Closes every current branch without changing supplied data. */
  collapseAll() {
    this.overrides = new Map(this.source.model.nodes.filter((node) => node.children.length).map((node) => [node.path, false]));
  }
  private open(node: JsonNode) {
    return jsonNodeOpen(node, this.overrides, this.expandedDepth);
  }
  private toggle(path: string) {
    const node = this.source.model.byPath.get(path);
    if (!node?.children.length) return;
    this.overrides = new Map([...this.overrides, [path, !this.open(node)]]);
    const expanded = Object.freeze(this.source.model.nodes.filter((node) => this.open(node)).map((node) => node.path));
    this.dispatchEvent(new CustomEvent("acme-expanded-change", { detail: Object.freeze({ expanded }), bubbles: true, composed: true }));
  }
  private focusNode(path: string) {
    this.focusPath = path;
    void this.updateComplete.then(() => {
      const item = this.rows.get(path)?.item;
      item?.focus({ preventScroll: true });
      item?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  }
  focus(options?: FocusOptions) {
    this.rows.get(this.focusPath)?.item.focus(options);
  }
  private onClick = (event: MouseEvent) => {
    const target = (event.target as Element).closest<HTMLElement>(".row[data-branch]");
    if (!target) return;
    const item = target.closest<HTMLElement>("[data-path]");
    if (!item) return;
    const selection = (this.renderRoot as ShadowRoot & { getSelection?(): Selection | null }).getSelection?.() ?? this.ownerDocument.defaultView!.getSelection();
    if (selection && !selection.isCollapsed) for (let index = 0; index < selection.rangeCount; index++) if (selection.getRangeAt(index).intersectsNode(target)) return;
    this.focusNode(item.dataset.path!);
    this.toggle(item.dataset.path!);
  };
  private key = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
    const path = (event.target as HTMLElement).dataset.path;
    if (path === undefined) return;
    const node = this.source.model.byPath.get(path);
    if (!node) return;
    const visible = this.visible.get(),
      index = visible.indexOf(node),
      rtl = this.ownerDocument.defaultView!.getComputedStyle(this).direction === "rtl";
    let target: JsonNode | undefined;
    if (event.key === "ArrowDown") target = visible[index + 1];
    else if (event.key === "ArrowUp") target = visible[index - 1];
    else if (event.key === "Home") target = visible[0];
    else if (event.key === "End") target = visible.at(-1);
    else if (event.key === (rtl ? "ArrowLeft" : "ArrowRight")) {
      if (node.children.length) {
        if (!this.open(node)) this.toggle(path);
        else target = this.source.model.byPath.get(node.children[0]);
      }
    } else if (event.key === (rtl ? "ArrowRight" : "ArrowLeft")) {
      if (this.open(node)) this.toggle(path);
      else if (node.parent !== undefined) target = this.source.model.byPath.get(node.parent);
    } else if (event.key === "Enter" || (event.key === " " && !this.typeahead.active)) this.toggle(path);
    else {
      this.typeahead.handleKey(event);
      return;
    }
    event.preventDefault();
    this.typeahead.clear();
    if (target) this.focusNode(target.path);
  };
  private mark(element: HTMLElement, text: string, pattern: RegExp | undefined) {
    const document = this.ownerDocument,
      fragment = document.createDocumentFragment();
    let previous = 0;
    if (pattern)
      for (const match of text.matchAll(pattern)) {
        if (!match[0] || match.index === undefined) continue;
        fragment.append(document.createTextNode(text.slice(previous, match.index)));
        const mark = document.createElement("mark");
        mark.textContent = match[0];
        fragment.append(mark);
        previous = match.index + match[0].length;
      }
    fragment.append(document.createTextNode(text.slice(previous)));
    element.replaceChildren(fragment);
  }
  private makeRow(): Row {
    const document = this.ownerDocument,
      item = document.createElement("div"),
      row = document.createElement("span"),
      toggle = document.createElement("span"),
      key = document.createElement("span"),
      value = document.createElement("span"),
      group = document.createElement("div"),
      closing = document.createElement("span");
    item.setAttribute("role", "treeitem");
    item.setAttribute("part", "item");
    row.className = "row";
    toggle.setAttribute("part", "toggle");
    const icon = document.createElement("acme-chevron-right-icon");
    icon.setAttribute("size", "16px");
    icon.setAttribute("aria-hidden", "true");
    toggle.append(icon);
    key.setAttribute("part", "key");
    value.setAttribute("part", "value");
    group.setAttribute("role", "group");
    group.className = "group";
    closing.className = "closing";
    closing.setAttribute("aria-hidden", "true");
    row.append(toggle, key, value);
    item.append(row, group, closing);
    return { item, row, toggle, key, value, group, closing };
  }
  protected updated() {
    const root = this.renderRoot.querySelector<HTMLElement>("[part=root]")!;
    root.dataset.direction = this.ownerDocument.defaultView!.getComputedStyle(this).direction;
    const visible = this.visible.get(),
      paths = new Set(visible.map((node) => node.path));
    const active = deepActiveElement(this.ownerDocument);
    const held = active?.getRootNode() === this.renderRoot && (active as HTMLElement).dataset.path !== undefined;
    let recover: string | undefined;
    if (held && !paths.has((active as HTMLElement).dataset.path!)) {
      recover = (active as HTMLElement).dataset.path;
      while (recover !== undefined && !paths.has(recover)) recover = this.previousModel.byPath.get(recover)?.parent;
      recover ??= "";
      this.focusPath = recover;
    }
    if (!paths.has(this.focusPath)) this.focusPath = visible[0]?.path ?? "";
    for (const [path, row] of this.rows)
      if (!paths.has(path)) {
        row.item.remove();
        this.rows.delete(path);
      }
    const children = new Map<HTMLElement, HTMLElement[]>();
    children.set(root, []);
    for (const node of visible) {
      let record = this.rows.get(node.path);
      if (!record) {
        record = this.makeRow();
        this.rows.set(node.path, record);
      }
      const { item, row, toggle, key, value, group, closing } = record,
        open = this.open(node),
        branch = !!node.children.length;
      item.dataset.path = node.path;
      item.setAttribute("aria-label", node.label);
      item.setAttribute("aria-level", String(node.level));
      item.setAttribute("aria-posinset", String(node.position));
      item.setAttribute("aria-setsize", String(node.size));
      if (branch) item.setAttribute("aria-expanded", String(open));
      else item.removeAttribute("aria-expanded");
      item.tabIndex = node.path === this.focusPath ? 0 : -1;
      item.dataset.kind = node.kind;
      toggle.hidden = !branch;
      group.hidden = !open;
      row.toggleAttribute("data-branch", branch);
      const suffix = node.position < node.size ? "," : "";
      const pair = node.kind === "array" ? ["[", "]"] : ["{", "}"];
      const display = node.kind === "array" || node.kind === "object" ? (branch ? (open ? pair[0] : pair[0] + "…" + pair[1] + suffix) : pair.join("") + suffix) : node.text + suffix;
      const name = node.key === undefined ? "" : node.key + ": ";
      if (record.text !== display || record.pattern !== this.search.pattern) {
        this.mark(value, display, this.search.pattern);
        record.text = display;
      }
      if (record.keyText !== name || record.pattern !== this.search.pattern) {
        this.mark(key, name, this.search.pattern);
        record.keyText = name;
      }
      record.pattern = this.search.pattern;
      closing.textContent = open ? pair[1] + suffix : "";
      closing.hidden = !open;
      const only = node.children.length === 1 ? this.source.model.byPath.get(node.children[0]) : undefined;
      item.toggleAttribute("data-inline", !!(open && only && !only.children.length && name.length + only.label.length < 50));
      const parent = node.parent === undefined ? root : this.rows.get(node.parent)!.group;
      const siblings = children.get(parent) ?? [];
      siblings.push(item);
      children.set(parent, siblings);
      if (!children.has(group)) children.set(group, []);
    }
    for (const [parent, wanted] of children) {
      let cursor = parent.firstElementChild;
      for (const child of wanted) {
        if (child !== cursor) parent.insertBefore(child, cursor);
        else cursor = cursor.nextElementSibling;
      }
      while (cursor) {
        const next = cursor.nextElementSibling;
        cursor.remove();
        cursor = next;
      }
    }
    this.previousModel = this.source.model;
    if (recover !== undefined) this.rows.get(recover)?.item.focus({ preventScroll: true });
  }
  render() {
    return html`<div part="root" role="tree" @keydown=${this.key} @click=${this.onClick} @focusin=${(event: FocusEvent) => {
      const path = (event.target as HTMLElement).dataset.path;
      if (path !== undefined) this.focusPath = path;
    }}></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-json-view": AcmeJsonView;
  }
}
