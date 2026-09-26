import { createAtom } from "@tanstack/lit-store";
import type { ReactiveController, ReactiveElement } from "lit";

export type ActionType = "button" | "submit" | "reset";
export type ActionSubmission = Readonly<{
  type: ActionType;
  disabled: boolean;
  link: boolean;
  name: string;
  value: string;
  formAction?: string;
  formMethod?: string;
  formEnctype?: string;
  formTarget?: string;
  formNoValidate: boolean;
}>;

/** Owns the native submitter in the author's form tree; the visible control owns focus. */
export class ActionSubmitter implements ReactiveController {
  readonly element: HTMLButtonElement;
  private readonly currentDisabled = createAtom(false);
  readonly disabled = createAtom(() => this.currentDisabled.get());
  private observer?: MutationObserver;
  private connected = false;
  private watched: Element[] = [];
  constructor(
    private host: ReactiveElement,
    private state: () => ActionSubmission,
    private changed: () => void,
  ) {
    this.element = host.ownerDocument.createElement("button");
    this.element.hidden = true;
    this.element.slot = "acme-form-submitter";
    this.element.tabIndex = -1;
    this.element.setAttribute("aria-hidden", "true");
    host.addController(this);
  }
  get form(): HTMLFormElement | null {
    this.sync();
    return this.element.form;
  }
  get fieldsetDisabled(): boolean {
    for (let parent = this.host.parentElement; parent; parent = parent.parentElement) {
      if (parent.localName !== "fieldset" || !(parent as HTMLFieldSetElement).disabled) {
        continue;
      }
      const legend = [...parent.children].find((child) => child.localName === "legend");
      if (!legend?.contains(this.host)) {
        return true;
      }
    }
    return false;
  }
  sync(): void {
    if (this.connected && this.element.parentNode !== this.host) {
      this.host.append(this.element);
    }
    const state = this.state(),
      element = this.element;
    element.type = state.link ? "button" : state.type;
    element.disabled = state.disabled;
    element.name = state.link ? "" : state.name;
    element.value = state.value;
    for (const [name, value] of [
      ["form", this.host.getAttribute("form")],
      ["formaction", state.formAction],
      ["formmethod", state.formMethod],
      ["formenctype", state.formEnctype],
      ["formtarget", state.formTarget],
    ] as const) {
      if (value === undefined || value === null) {
        element.removeAttribute(name);
      } else if (element.getAttribute(name) !== value) {
        element.setAttribute(name, value);
      }
    }
    element.formNoValidate = state.formNoValidate;
    const disabled = element.matches(":disabled");
    if (disabled !== this.currentDisabled.get()) {
      this.currentDisabled.set(disabled);
      this.changed();
    }
  }
  private refresh = () => {
    if (!this.connected) {
      return;
    }
    if (this.element.parentNode !== this.host) {
      this.host.append(this.element);
    }
    this.observe();
    this.sync();
    this.host.requestUpdate();
  };
  private observe(): void {
    const ancestors: Element[] = [];
    for (let parent = this.host.parentElement; parent; parent = parent.parentElement) {
      if (parent.localName === "fieldset") {
        ancestors.push(parent);
      }
    }
    if (this.observer && ancestors.length === this.watched.length && ancestors.every((element, index) => element === this.watched[index])) {
      return;
    }
    this.observer?.disconnect();
    this.watched = ancestors;
    this.observer = new MutationObserver(this.refresh);
    this.observer.observe(this.host, { childList: true });
    for (const fieldset of ancestors) {
      this.observer.observe(fieldset, { attributes: true, attributeFilter: ["disabled"], childList: true });
    }
  }
  hostConnected() {
    this.connected = true;
    this.refresh();
  }
  hostDisconnected() {
    this.connected = false;
    this.observer?.disconnect();
    this.observer = undefined;
    this.watched = [];
  }
  hostUpdated() {
    this.sync();
  }
  /** Runs from the internal form's native default action, after click cancellation. */
  activate(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.sync();
    const state = this.state(),
      form = this.element.form;
    if (!this.connected || !form || state.link || this.disabled.get()) {
      return;
    }
    const prototype = this.host.ownerDocument.defaultView!.HTMLFormElement.prototype;
    if (state.type === "submit") {
      prototype.requestSubmit.call(form, this.element);
    } else if (state.type === "reset") {
      prototype.reset.call(form);
    }
  }
}
