import { createAtom } from "@tanstack/lit-store";
import type { ReactiveController } from "lit";
import { AcmeElement } from "../base";

const attributes = ["role", "aria-label", "aria-labelledby", "aria-describedby"] as const;
type Attribute = (typeof attributes)[number];
type ReferenceAttribute = "aria-labelledby" | "aria-describedby";
type Reference = Readonly<{ text: string | null; elements?: readonly Element[] }>;
type State = Readonly<Record<Attribute, Reference>>;
const empty: State = Object.freeze(Object.fromEntries(attributes.map((name) => [name, Object.freeze({ text: null })])) as Record<Attribute, Reference>);
const isAttribute = (name: string): name is Attribute => (attributes as readonly string[]).includes(name);

/** Canonical accessible inputs delegated to the component's native semantic root. */
class SemanticAttributes implements ReactiveController {
  private readonly state = createAtom<State>(empty);
  private readonly removing = new Set<string>();
  private target?: HTMLElement;
  private observer?: MutationObserver;
  private watchedRoot?: Node;
  private connected = false;
  constructor(private host: AcmeSemanticElement) {
    host.addController(this);
  }
  get(name: Attribute): string | null {
    return this.state.get()[name].text;
  }
  set(name: Attribute, value: string | null): void {
    const text = value === null ? null : String(value);
    const current = this.state.get()[name];
    if (current.text === text && !current.elements) return;
    this.state.set((previous) => Object.freeze({ ...previous, [name]: Object.freeze({ text }) }));
    this.observe();
    this.paint();
    this.host.requestUpdate();
  }
  getElements(name: ReferenceAttribute): Element[] | null {
    const reference = this.state.get()[name];
    if (reference.text === null && !reference.elements) return null;
    return Object.freeze([...this.resolve(reference)]) as unknown as Element[];
  }
  setElements(name: ReferenceAttribute, elements: readonly Element[] | null): void {
    if (elements !== null)
      for (const element of elements) {
        if (!element || element.nodeType !== 1 || !Element.prototype.matches.call(element, "*")) throw new TypeError("Accessible element references require Elements");
      }
    const reference: Reference = elements === null ? Object.freeze({ text: null }) : Object.freeze({ text: "", elements: Object.freeze([...elements]) });
    this.state.set((previous) => Object.freeze({ ...previous, [name]: reference }));
    this.observe();
    this.paint();
    this.host.requestUpdate();
  }
  attributeChanged(name: string, value: string | null): boolean {
    if (!isAttribute(name)) return false;
    if (this.removing.has(name)) return true;
    this.set(name, value);
    if (value !== null) {
      this.removing.add(name);
      try {
        Element.prototype.removeAttribute.call(this.host, name);
      } finally {
        this.removing.delete(name);
      }
    }
    return true;
  }
  private resolve(reference: Reference): readonly Element[] {
    if (reference.elements) {
      const scopes = new Set<Node>();
      let scope: Node | undefined = this.host.getRootNode();
      while (scope) {
        scopes.add(scope);
        scope = "host" in scope ? (scope as ShadowRoot).host.getRootNode() : undefined;
      }
      return reference.elements.filter((element) => scopes.has(element.getRootNode()));
    }
    const root = this.host.getRootNode();
    if (!("getElementById" in root)) return [];
    const ids = [...new Set((reference.text ?? "").split(/\s+/).filter(Boolean))];
    return ids.map((id) => (root as Document | ShadowRoot).getElementById(id)).filter((element): element is NonNullable<typeof element> => !!element);
  }
  private paint = (): void => {
    if (!this.target) return;
    const state = this.state.get();
    for (const name of ["role", "aria-label"] as const) {
      const value = state[name].text;
      if (value === null) this.target.removeAttribute(name);
      else this.target.setAttribute(name, value);
    }
    for (const [name, property] of [
      ["aria-labelledby", "ariaLabelledByElements"],
      ["aria-describedby", "ariaDescribedByElements"],
    ] as const) {
      const reference = state[name];
      this.target[property] = reference.text === null && !reference.elements ? null : [...this.resolve(reference)];
    }
  };
  private observe(): void {
    if (!this.connected) return;
    const state = this.state.get();
    const needed = (["aria-labelledby", "aria-describedby"] as const).some((name) => !!state[name].text?.trim() && !state[name].elements);
    const root = this.host.getRootNode();
    if (needed && this.watchedRoot === root) return;
    this.observer?.disconnect();
    this.observer = undefined;
    this.watchedRoot = undefined;
    if (!needed) return;
    this.observer = new MutationObserver(this.paint);
    this.observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["id"] });
    this.watchedRoot = root;
  }
  hostConnected(): void {
    this.connected = true;
    this.observe();
    this.host.requestUpdate();
  }
  hostUpdated(): void {
    const target = this.host.renderRoot.querySelector('[part~="root"]') as HTMLElement | null;
    if (this.target !== target) this.target = target ?? undefined;
    this.paint();
  }
  hostDisconnected(): void {
    this.connected = false;
    this.observer?.disconnect();
    this.observer = undefined;
    this.watchedRoot = undefined;
  }
  adopted(): void {
    if (this.host.isConnected) this.observe();
    this.paint();
  }
}

/**
 * Structural components keep native meaning on one inner root and preserve author-owned children.
 * @attr {string} aria-labelledby - IDs in the author's tree scope that label the native root.
 * @attr {string} aria-describedby - IDs in the author's tree scope that describe the native root.
 */
export abstract class AcmeSemanticElement extends AcmeElement {
  static properties = {
    role: { attribute: "role", noAccessor: true },
    ariaLabel: { attribute: "aria-label", noAccessor: true },
    ariaLabelledByElements: { attribute: false, noAccessor: true },
    ariaDescribedByElements: { attribute: false, noAccessor: true },
  };
  static get observedAttributes(): string[] {
    return [...new Set([...super.observedAttributes, ...attributes])];
  }
  private readonly semantic = new SemanticAttributes(this);
  get role(): string | null {
    return this.semantic.get("role");
  }
  set role(value: string | null) {
    this.semantic.set("role", value);
  }
  get ariaLabel(): string | null {
    return this.semantic.get("aria-label");
  }
  set ariaLabel(value: string | null) {
    this.semantic.set("aria-label", value);
  }
  get ariaLabelledByElements(): Element[] | null {
    return this.semantic.getElements("aria-labelledby");
  }
  set ariaLabelledByElements(value: Element[] | null) {
    this.semantic.setElements("aria-labelledby", value);
  }
  get ariaDescribedByElements(): Element[] | null {
    return this.semantic.getElements("aria-describedby");
  }
  set ariaDescribedByElements(value: Element[] | null) {
    this.semantic.setElements("aria-describedby", value);
  }
  attributeChangedCallback(name: string, previous: string | null, value: string | null): void {
    if (!this.semantic.attributeChanged(name, value)) super.attributeChangedCallback(name, previous, value);
  }
  getAttribute(name: string): string | null {
    const key = name.toLowerCase();
    return this.semantic && isAttribute(key) ? this.semantic.get(key) : super.getAttribute(name);
  }
  hasAttribute(name: string): boolean {
    const key = name.toLowerCase();
    return this.semantic && isAttribute(key) ? this.semantic.get(key) !== null : super.hasAttribute(name);
  }
  removeAttribute(name: string): void {
    const key = name.toLowerCase();
    if (this.semantic && isAttribute(key)) this.semantic.set(key, null);
    super.removeAttribute(name);
  }
  toggleAttribute(name: string, force?: boolean): boolean {
    const key = name.toLowerCase();
    if (!isAttribute(key)) return super.toggleAttribute(name, force);
    const present = force ?? !this.hasAttribute(key);
    if (present) {
      if (!this.hasAttribute(key)) this.setAttribute(key, "");
    } else this.removeAttribute(key);
    return present;
  }
  adoptedCallback(): void {
    super.adoptedCallback();
    this.semantic.adopted();
  }
}
