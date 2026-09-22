import { property } from "lit/decorators.js";
import { AcmeActionElement } from "./action-element";
import { atomState } from "./atom-state";
import { optionalString } from "./attributes";
import type { ActionSubmission, ActionType } from "./action-submitter";
type State = Readonly<{
  type: ActionType;
  href: string;
  target: string;
  rel: string;
  name: string;
  value: string;
  formAction?: string;
  formMethod?: string;
  formEnctype?: string;
  formTarget?: string;
  formNoValidate: boolean;
}>;
const initial: State = Object.freeze({ type: "button", href: "", target: "", rel: "", name: "", value: "", formNoValidate: false });

/** Native form and navigation inputs.
 * @attr {string} form - ID of the associated form in the author's tree.
 */
export abstract class AcmeFormActionElement extends AcmeActionElement {
  @atomState() private action: State = initial;
  private setAction<Key extends keyof State>(key: Key, value: State[Key]) {
    const previous = this.action[key];
    if (Object.is(previous, value)) return;
    this.action = Object.freeze({ ...this.action, [key]: value });
    this.nativeAction.sync();
    this.synchronizeControl();
    this.requestUpdate(key, previous);
  }
  /** @default "button" */
  @property({ noAccessor: true }) get type(): ActionType {
    return this.action.type;
  }
  set type(value: ActionType) {
    this.setAction("type", ["button", "submit", "reset"].includes(value) ? value : "button");
  }
  /** @default "" */
  @property({ noAccessor: true }) get href() {
    return this.action.href;
  }
  set href(value: string) {
    this.setAction("href", value ?? "");
  }
  /** @default "" */
  @property({ noAccessor: true }) get target() {
    return this.action.target;
  }
  set target(value: string) {
    this.setAction("target", value ?? "");
  }
  /** @default "" */
  @property({ noAccessor: true }) get rel() {
    return this.action.rel;
  }
  set rel(value: string) {
    this.setAction("rel", value ?? "");
  }
  /** @default "" */
  @property({ noAccessor: true }) get name() {
    return this.action.name;
  }
  set name(value: string) {
    this.setAction("name", value ?? "");
  }
  /** @default "" */
  @property({ noAccessor: true }) get value() {
    return this.action.value;
  }
  set value(value: string) {
    this.setAction("value", value ?? "");
  }
  @property({ noAccessor: true, attribute: "formaction", converter: optionalString }) get formAction() {
    return this.action.formAction;
  }
  set formAction(value: string | undefined) {
    this.setAction("formAction", value);
  }
  @property({ noAccessor: true, attribute: "formmethod", converter: optionalString }) get formMethod() {
    return this.action.formMethod;
  }
  set formMethod(value: string | undefined) {
    this.setAction("formMethod", value);
  }
  @property({ noAccessor: true, attribute: "formenctype", converter: optionalString }) get formEnctype() {
    return this.action.formEnctype;
  }
  set formEnctype(value: string | undefined) {
    this.setAction("formEnctype", value);
  }
  @property({ noAccessor: true, attribute: "formtarget", converter: optionalString }) get formTarget() {
    return this.action.formTarget;
  }
  set formTarget(value: string | undefined) {
    this.setAction("formTarget", value);
  }
  /** @default false */
  @property({ noAccessor: true, type: Boolean, attribute: "formnovalidate" }) get formNoValidate() {
    return this.action.formNoValidate;
  }
  set formNoValidate(value: boolean) {
    this.setAction("formNoValidate", Boolean(value));
  }
  get form(): HTMLFormElement | null {
    return this.nativeAction.form;
  }
  protected get submission(): ActionSubmission {
    return { ...this.action, disabled: this.disabled || this.loading, link: !!this.href };
  }
  protected get link() {
    return this.href ? { href: this.href, target: this.target, rel: this.rel } : undefined;
  }
}
