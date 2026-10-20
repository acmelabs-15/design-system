import { nativeFieldControlFor } from "../../shared/native-field-control";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { FieldRegistry, type FieldDescription } from "../../shared/field-association";
import { fieldControlChange, fieldControlFor, type RegisteredFieldControl } from "../../shared/field-control";
import { message, messageCatalogs } from "../../shared/messages";
import { StoreSelector } from "../../shared/store-connection";
import { fieldStructureCss } from "../../generated/components/field/field-structure.styles";

const fields = new WeakSet<Element>();
let nextFieldId = 0;
function parent(node: Node): Node | null {
  return (node.nodeType === 1 ? (node as Element).assignedSlot : null) ?? node.parentNode ?? (node.nodeType === 11 && "host" in node ? (node as ShadowRoot).host : null);
}
/** Connects one logical control with its label, help and supplied error presentation.
 * @slot - One control, optionally wrapped for layout.
 * @slot label - The visible label.
 * @slot help - Supporting text.
 * @slot error - Error text shown when invalid.
 * @csspart root - The field layout.
 * @csspart label - The label hit surface.
 * @csspart control - The control region.
 * @csspart help - The supporting text.
 * @csspart error - The error presentation.
 */
export class AcmeField extends AcmeElement {
  static styles = [sharedCss, fieldStructureCss];
  @atomState() private direction: "vertical" | "horizontal" = "vertical";
  /** @default "vertical" */
  @property({ noAccessor: true, converter: optionalString }) get orientation() {
    return this.direction;
  }
  set orientation(value: "vertical" | "horizontal" | undefined) {
    const next = value ?? "vertical";
    if (!["vertical", "horizontal"].includes(next)) {
      throw new TypeError("Invalid field orientation");
    }
    this.direction = next;
    this.requestUpdate("orientation");
  }
  @atomState() private requiredFlag = false;
  /** @default false */
  @property({ noAccessor: true, type: Boolean }) get required() {
    return this.requiredFlag;
  }
  set required(value: boolean) {
    if (value && this.optional) {
      throw new TypeError("Field cannot be both required and optional");
    }
    this.requiredFlag = Boolean(value);
    this.publish();
    this.requestUpdate("required");
  }
  @atomState() private optionalFlag = false;
  /** @default false */
  @property({ noAccessor: true, type: Boolean }) get optional() {
    return this.optionalFlag;
  }
  set optional(value: boolean) {
    if (value && this.required) {
      throw new TypeError("Field cannot be both required and optional");
    }
    this.optionalFlag = Boolean(value);
    this.requestUpdate("optional");
  }
  @atomState() private invalidFlag = false;
  /** @default false */
  @property({ noAccessor: true, type: Boolean }) get invalid() {
    return this.invalidFlag;
  }
  set invalid(value: boolean) {
    this.invalidFlag = Boolean(value);
    this.publish();
    this.requestUpdate("invalid");
  }
  @atomState() private disabledFlag = false;
  /** @default false */
  @property({ noAccessor: true, type: Boolean }) get disabled() {
    return this.disabledFlag;
  }
  set disabled(value: boolean) {
    this.disabledFlag = Boolean(value);
    this.publish();
    this.requestUpdate("disabled");
  }
  private readonly fieldIdPrefix = `acme-field-content-${++nextFieldId}`;
  private readonly registry = new FieldRegistry((message) => console.warn(this.localName, { code: "ambiguous-field", message }));
  private readonly registrations = new Map<RegisteredFieldControl, () => void>();
  private observer?: MutationObserver;
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private readonly themeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private nodes(name: string): Node[] {
    const slot = [...(this.renderRoot?.querySelectorAll("slot") ?? [])].find((slot) => slot.name === name);
    return slot ? slot.assignedNodes({ flatten: true }) : [...this.childNodes].filter((node) => (node.nodeType === 1 ? ((node as Element).getAttribute("slot") ?? "") === name : name === ""));
  }
  private publish() {
    if (!this.registry) {
      return;
    }
    const label = this.nodes("label"),
      help = this.nodes("help"),
      error = this.nodes("error"),
      text = (nodes: Node[]) =>
        nodes
          .map((node) => node.textContent ?? "")
          .join(" ")
          .trim(),
      elements = (nodes: Node[]) => nodes.filter((node): node is Element => node.nodeType === 1);
    for (const [name, nodes] of [
      ["label", label],
      ["help", help],
      ["error", error],
    ] as const) {
      for (const [index, node] of elements(nodes).entries()) {
        if (!node.id) {
          node.id = `${this.fieldIdPrefix}-${name}-${index}`;
        }
      }
    }
    const description: FieldDescription = {
      label: text(label),
      help: text(help),
      error: text(error),
      labelElements: elements(label),
      helpElements: elements(help),
      errorElements: elements(error),
      required: this.required,
      disabled: this.disabled,
      invalid: this.invalid,
    };
    this.registry.set(description);
  }
  private belongs(control: RegisteredFieldControl) {
    let slot = "";
    for (let node: Node | null = control.host; node; node = parent(node)) {
      if (node === this) {
        return slot === "";
      }
      if (node !== control.host && node.nodeType === 1 && (fields.has(node as Element) || fieldControlFor(node as Element))) {
        return false;
      }
      if (node.nodeType === 1) {
        const element = node as Element;
        if (element.localName === "slot" && element.getRootNode() === this.renderRoot) {
          slot = (element as HTMLSlotElement).name;
        } else if (element.parentNode === this) {
          slot = element.getAttribute("slot") ?? "";
        }
      }
    }
    return false;
  }
  private scan = () => {
    if (!this.isConnected) {
      return;
    }
    const found = new Set<RegisteredFieldControl>();
    const visit = (node: Node) => {
      if (node.nodeType !== 1) {
        return;
      }
      const element = node as Element;
      if (fields.has(element)) {
        return;
      }
      const control = fieldControlFor(element) ?? nativeFieldControlFor(element);
      if (control) {
        if (control.eligible() && this.belongs(control)) {
          found.add(control);
        }
        return;
      }
      for (const child of element.localName === "slot" ? (element as HTMLSlotElement).assignedNodes({ flatten: true }) : [...element.childNodes]) {
        visit(child);
      }
    };
    for (const node of this.nodes("")) {
      visit(node);
    }
    for (const control of this.registrations.keys()) {
      if (!control.eligible() || !this.belongs(control)) {
        this.registrations.get(control)!();
        this.registrations.delete(control);
      }
    }
    for (const control of found) {
      if (!this.registry.has(control)) {
        this.registrations.set(control, this.registry.register(control));
      }
    }
    this.publish();
    for (const control of this.registrations.keys()) {
      control.refresh?.();
    }
  };
  private changed = (event: Event) => {
    const control = fieldControlFor(event.composedPath()[0] as Element);
    if (!control) {
      return;
    }
    if (this.belongs(control)) {
      event.stopPropagation();
      if (control.eligible() && !this.registry.has(control)) {
        this.registrations.set(control, this.registry.register(control));
      }
      this.scan();
    }
  };
  private activate = (event: MouseEvent) => {
    const interactive = event.composedPath().some((node) => node instanceof Element && node.matches("a[href],button,input,select,textarea,summary,[contenteditable=true]"));
    if (interactive) {
      return;
    }
    queueMicrotask(() => {
      if (!event.defaultPrevented && this.isConnected) {
        this.registry.activate();
      }
    });
  };
  constructor() {
    super();
    fields.add(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener(fieldControlChange, this.changed);
    this.addEventListener("slotchange", this.scan);
    this.observer = new MutationObserver(this.scan);
    this.observer.observe(this, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["slot", "aria-label", "id", "type"] });
    this.scan();
  }
  disconnectedCallback() {
    this.removeEventListener(fieldControlChange, this.changed);
    this.removeEventListener("slotchange", this.scan);
    this.observer?.disconnect();
    this.observer = undefined;
    for (const release of this.registrations.values()) {
      release();
    }
    this.registrations.clear();
    this.registry.clear();
    super.disconnectedCallback();
  }
  protected updated() {
    this.scan();
  }
  render() {
    const hasLabel = this.nodes("label").length > 0,
      hasHelp = this.nodes("help").length > 0,
      hasError = this.nodes("error").length > 0;
    return html`<div class="field" part="root" data-orientation=${this.orientation} ?data-disabled=${this.disabled} ?data-invalid=${this.invalid}><label part="label" ?hidden=${!hasLabel} @click=${this.activate}><slot name="label" @slotchange=${this.scan}></slot><span class="required" aria-hidden="true" ?hidden=${!this.required}>*</span><span class="optional" aria-hidden="true" ?hidden=${!this.optional}>${message(this.themeContext.scope.effective.get().locale, "field.optional", "(optional)")}</span></label><div part="control"><slot @slotchange=${this.scan}></slot></div><div part="help" ?hidden=${!hasHelp}><slot name="help" @slotchange=${this.scan}></slot></div><div part="error" ?hidden=${!this.invalid || !hasError}><slot name="error" @slotchange=${this.scan}></slot></div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-field": AcmeField;
  }
}
