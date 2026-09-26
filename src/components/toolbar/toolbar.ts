import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { Places } from "../../shared/places";
import { ToolbarFocus } from "../../shared/toolbar-focus";
import { toolbarStructureCss } from "../../generated/components/toolbar/toolbar-structure.styles";
/** A named collection of related actions with one coordinated tab entry.
 * @slot - Related controls.
 * @slot start - Leading controls.
 * @slot end - Trailing controls, including a text editor when needed.
 * @csspart root - The named toolbar.
 * @csspart content - The enabled or inert control region.
 * @csspart start - Leading region.
 * @csspart end - Trailing region.
 */
export class AcmeToolbar extends AcmeSemanticElement {
  static styles = [sharedCss, toolbarStructureCss];
  private readonly places = new Places(this, { places: ["start", "end"] });
  @atomState() private axis: "horizontal" | "vertical" = "horizontal";
  /** @default "horizontal" */
  @property({ noAccessor: true, useDefault: true }) get orientation(): "horizontal" | "vertical" {
    return this.axis;
  }
  set orientation(value: "horizontal" | "vertical") {
    if (!["horizontal", "vertical"].includes(value)) {
      throw new TypeError("Invalid Toolbar orientation");
    }
    const previous = this.axis;
    this.axis = value;
    this.requestUpdate("orientation", previous);
  }
  @atomState() @property({ noAccessor: true, converter: { fromAttribute: (value) => (value === null ? true : value !== "false") } }) loop = true;
  @atomState() @property({ noAccessor: true, type: Boolean }) disabled = false;
  private readonly navigation = new ToolbarFocus(this, {
    root: () => this.semanticTarget,
    content: () => this.renderRoot?.querySelector<HTMLElement>("[part=content]") ?? undefined,
    disabled: () => this.disabled,
    orientation: () => this.orientation,
    loop: () => this.loop,
  });
  protected get semanticDefaults() {
    return { role: "toolbar" };
  }
  protected willUpdate() {
    this.navigation.prepare();
  }
  focus(options?: FocusOptions) {
    this.navigation.focus(options);
  }
  render() {
    return html`<div part="root" tabindex="-1" aria-orientation=${this.orientation} aria-disabled=${String(this.disabled)}><div part="content" data-orientation=${this.orientation} ?inert=${this.disabled}><span part="start" ?hidden=${!this.places.has("start")}><slot name="start"></slot></span><slot></slot><span part="end" ?hidden=${!this.places.has("end")}><slot name="end"></slot></span></div></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-toolbar": AcmeToolbar;
  }
}
