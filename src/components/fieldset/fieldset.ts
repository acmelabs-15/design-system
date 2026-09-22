import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { NativeContentRoot } from "../../shared/native-content-root";
import { RootStyles } from "../../shared/root-styles";
import { fieldsetStructureCss } from "../../generated/components/fieldset/fieldset-structure.styles";
import { fieldsetLightCss } from "../../generated/components/fieldset/fieldset-light.styles";
/** A native form group with a real fieldset ancestor for its controls.
 * @acmeNativeRoot fieldset
 * @slot - Form controls and their layout.
 * @slot legend - One native legend, optionally containing rich content or controls.
 * @slot help - Group help text.
 * @slot error - Group error text, shown when invalid.
 * @csspart root - The group wrapper.
 */
export class AcmeFieldset extends AcmeSemanticElement {
  static styles = [sharedCss, fieldsetStructureCss];
  @atomState() private unavailable = false;
  /** @default false */
  @property({ noAccessor: true, type: Boolean, reflect: true }) get disabled() {
    return this.unavailable;
  }
  set disabled(value: boolean) {
    const previous = this.unavailable;
    this.unavailable = Boolean(value);
    if (this.content) this.content.root.disabled = this.unavailable;
    this.requestUpdate("disabled", previous);
  }
  @atomState() private invalidGroup = false;
  /** @default false */
  @property({ noAccessor: true, type: Boolean, reflect: true }) get invalid() {
    return this.invalidGroup;
  }
  set invalid(value: boolean) {
    const previous = this.invalidGroup;
    this.invalidGroup = Boolean(value);
    if (this.content) this.syncRoot(this.content.root);
    this.requestUpdate("invalid", previous);
  }
  private readonly lightStyles = new RootStyles(this, [fieldsetLightCss]);
  private readonly content = new NativeContentRoot(
    this,
    () => this.ownerDocument.createElement("fieldset"),
    (root) => this.syncRoot(root),
  );
  private observed?: HTMLFieldSetElement;
  private observer?: MutationObserver;
  private warned = false;
  private syncRoot(root: HTMLFieldSetElement) {
    if (root.disabled !== this.disabled) root.disabled = this.disabled;
    if (root.getAttribute("aria-invalid") !== String(this.invalid)) root.setAttribute("aria-invalid", String(this.invalid));
    if (this.observed !== root || !this.observer) {
      this.observer?.disconnect();
      this.observed = root;
      this.observer = new MutationObserver(() => this.requestUpdate());
      this.observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["slot"] });
      this.requestUpdate();
    }
  }
  private direct(slot: string) {
    return [...this.content.root.children].filter((element) => element.getAttribute("slot") === slot);
  }
  protected get semanticTarget() {
    return this.content?.root;
  }
  protected get semanticDefaults() {
    return { describedByElements: [...this.direct("help"), ...(this.invalid ? this.direct("error") : [])] };
  }
  protected updated() {
    const legends = this.direct("legend");
    if (legends.some((element) => element.localName !== "legend") && !this.warned) {
      this.warned = true;
      console.warn(this.localName, { code: "fieldset-legend-requires-native-legend" });
    }
  }
  disconnectedCallback() {
    this.observer?.disconnect();
    this.observer = undefined;
    super.disconnectedCallback();
  }
  render() {
    return html`<div part="root"><slot></slot></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-fieldset": AcmeFieldset;
  }
}
