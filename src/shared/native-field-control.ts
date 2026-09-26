import type { FieldDescription } from "./field-association";
import { FieldAssociation } from "./field-association";
import type { RegisteredFieldControl } from "./field-control";

type NativeControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
/** Adds owned Field references to a native control while retaining its own attributes. */
export class NativeFieldControl implements RegisteredFieldControl {
  readonly association = new FieldAssociation();
  private description?: FieldDescription;
  private ownDisabled: boolean;
  private disabledContext = false;
  private invalidContext = false;
  private originalInvalid: string | null = null;
  private disabledWrites: { old: string | null; value: string | null }[] = [];
  private observer?: MutationObserver;
  private readonly references = new Map<string, { ids: Set<string>; elements: readonly Element[] }>();
  constructor(readonly host: NativeControl) {
    this.ownDisabled = host.disabled;
  }
  eligible() {
    return this.host.localName !== "input" || !["hidden", "button", "submit", "reset", "image"].includes((this.host as HTMLInputElement).type);
  }
  refresh() {
    this.consume(this.observer?.takeRecords() ?? []);
    if (this.description) {
      this.association.attach(this.host);
    }
    this.paint();
  }
  activate() {
    if (this.host.disabled) {
      return;
    }
    this.host.focus();
    if (this.host.localName === "input" && ["checkbox", "radio"].includes((this.host as HTMLInputElement).type)) {
      this.host.click();
    }
  }
  private consume(records: MutationRecord[]) {
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      if (record.attributeName !== "disabled") {
        continue;
      }
      const next = records.slice(i + 1).find((next) => next.attributeName === "disabled");
      const value = next ? next.oldValue : this.host.getAttribute("disabled");
      const own = this.disabledWrites[0];
      if (own && own.old === record.oldValue && own.value === value) {
        this.disabledWrites.shift();
      } else {
        this.ownDisabled = value !== null;
      }
    }
  }
  associate(description: FieldDescription | undefined) {
    this.consume(this.observer?.takeRecords() ?? []);
    this.description = description;
    this.association.update(description);
    if (description) {
      this.association.attach(this.host);
      if (!this.observer) {
        this.ownDisabled = this.host.disabled;
        this.observer = new MutationObserver((records) => {
          this.consume(records);
          this.paint();
        });
        this.observer.observe(this.host, { attributes: true, attributeOldValue: true, attributeFilter: ["disabled", "aria-label", "aria-labelledby", "aria-describedby"] });
      }
    }
    this.paint();
    if (!description) {
      this.observer?.disconnect();
      this.observer = undefined;
      this.disabledWrites = [];
      this.association.detach();
    }
  }
  private reference(attribute: "aria-labelledby" | "aria-describedby", elements: readonly Element[]) {
    const property = attribute === "aria-labelledby" ? "ariaLabelledByElements" : "ariaDescribedByElements",
      previous = this.references.get(attribute) ?? { ids: new Set<string>(), elements: [] },
      text = this.host.getAttribute(attribute),
      current = this.host[property] ?? [];
    if (text === "" && current.length) {
      const external = current.filter((element) => !previous.elements.includes(element)),
        desired = attribute === "aria-labelledby" && external.length ? external : [...new Set([...external, ...elements])];
      if (desired.length !== current.length || desired.some((element, index) => element !== current[index])) {
        this.host[property] = desired.length ? desired : null;
      }
      this.references.set(attribute, { ids: new Set(), elements });
      return;
    }
    const external = (text ?? "").split(/\s+/).filter((id) => id && !previous.ids.has(id));
    const owned =
      attribute === "aria-labelledby" && (external.length || this.host.hasAttribute("aria-label") || Array.from(this.host.labels ?? []).some((label) => label.control === this.host)) ? [] : elements;
    const ids = new Set(owned.map((element) => element.id).filter(Boolean)),
      desired = [...new Set([...external, ...ids])].join(" ");
    if (desired !== text) {
      if (desired) {
        this.host.setAttribute(attribute, desired);
      } else if (text !== null) {
        this.host.removeAttribute(attribute);
      }
    }
    this.references.set(attribute, { ids, elements: owned });
  }
  private paint() {
    const invalid = !!this.description?.invalid;
    if (invalid && !this.invalidContext) {
      this.originalInvalid = this.host.getAttribute("aria-invalid");
      this.host.setAttribute("aria-invalid", "true");
    } else if (!invalid && this.invalidContext && this.host.getAttribute("aria-invalid") === "true") {
      if (this.originalInvalid === null) {
        this.host.removeAttribute("aria-invalid");
      } else {
        this.host.setAttribute("aria-invalid", this.originalInvalid);
      }
    }
    this.invalidContext = invalid;
    const defaults = this.association.defaults;
    this.reference("aria-labelledby", this.description ? (defaults.labelledByElements ?? []) : []);
    this.reference("aria-describedby", this.description ? (defaults.describedByElements ?? []) : []);
    const disabled = !!this.description?.disabled;
    if (!this.disabledContext && !disabled) {
      this.ownDisabled = this.host.disabled;
    }
    const desired = this.ownDisabled || disabled;
    if (this.host.disabled !== desired) {
      this.disabledWrites.push({ old: this.host.getAttribute("disabled"), value: desired ? "" : null });
      this.host.disabled = desired;
    }
    this.disabledContext = disabled;
  }
}

const nativeControls = new WeakMap<NativeControl, NativeFieldControl>();
export function nativeFieldControlFor(element: Element): NativeFieldControl | undefined {
  if (element.namespaceURI !== "http://www.w3.org/1999/xhtml" || !["input", "select", "textarea"].includes(element.localName)) {
    return;
  }
  if (element.localName === "input" && ["hidden", "button", "submit", "reset", "image"].includes((element as HTMLInputElement).type)) {
    return;
  }
  const native = element as NativeControl;
  let control = nativeControls.get(native);
  if (!control) {
    control = new NativeFieldControl(native);
    nativeControls.set(native, control);
  }
  return control;
}
