import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { atomState } from "../../shared/atom-state";
import { optionalString } from "../../shared/attributes";
import { NativeContentRoot } from "../../shared/native-content-root";
import { RootStyles } from "../../shared/root-styles";
import { labelStructureCss } from "../../generated/components/label/label-structure.styles";
import { labelLightCss } from "../../generated/components/label/label-light.styles";
/** A real native label in the author's tree scope.
 * @acmeNativeRoot label
 * @slot - Label content, optionally containing an implicit labelled control.
 * @csspart root - The label wrapper.
 */
export class AcmeLabel extends AcmeElement {
  static styles = [sharedCss, labelStructureCss];
  @atomState() private controlId: string | undefined;
  @property({ noAccessor: true, converter: optionalString }) get for() {
    return this.controlId;
  }
  set for(value: string | undefined) {
    if (value !== undefined && typeof value !== "string") {
      throw new TypeError("Label for must be a string or undefined");
    }
    const previous = this.controlId;
    this.controlId = value;
    if (this.content) {
      this.syncRoot(this.content.root);
    }
    this.requestUpdate("for", previous);
  }
  private readonly lightStyles = new RootStyles(this, [labelLightCss]);
  private readonly content = new NativeContentRoot(
    this,
    () => this.ownerDocument.createElement("label"),
    (root) => this.syncRoot(root),
  );
  private listened?: HTMLLabelElement;
  private syncRoot(root: HTMLLabelElement) {
    if (this.listened !== root) {
      this.listened?.removeEventListener("click", this.focusActivatedControl);
      this.listened = root;
      root.addEventListener("click", this.focusActivatedControl);
    }
    if (this.for === undefined) {
      if (root.hasAttribute("for")) {
        root.removeAttribute("for");
      }
    } else if (root.htmlFor !== this.for) {
      root.htmlFor = this.for;
    }
  }
  private pendingActivation?: () => void;
  private focusActivatedControl = (event: MouseEvent) => {
    const label = event.currentTarget as HTMLLabelElement,
      control = label.control;
    if (!control || !control.localName.includes("-") || event.composedPath().includes(control)) {
      return;
    }
    this.pendingActivation?.();
    const view = this.ownerDocument.defaultView!;
    const cleanup = () => {
      view.clearTimeout(timer);
      control.removeEventListener("click", activated, true);
      if (this.pendingActivation === cleanup) {
        this.pendingActivation = undefined;
      }
    };
    const activated = (activation: Event) => {
      if (activation.composedPath()[0] !== control) {
        return;
      }
      if (this.isConnected && label === this.content.root && label.control === control) {
        control.focus({ preventScroll: true });
      }
      cleanup();
    };
    control.addEventListener("click", activated, { capture: true });
    const timer = view.setTimeout(cleanup, 0);
    this.pendingActivation = cleanup;
  };
  constructor() {
    super();
    this.addEventListener("click", (event) => {
      if (event.composedPath()[0] === this) {
        this.click();
      }
    });
  }
  disconnectedCallback() {
    this.pendingActivation?.();
    super.disconnectedCallback();
  }
  click() {
    this.content.root.click();
  }
  render() {
    return html`<span part="root"><slot></slot></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-label": AcmeLabel;
  }
}
