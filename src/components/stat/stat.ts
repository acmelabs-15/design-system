import { ContextProvider } from "@lit/context";
import { createAtom } from "@tanstack/lit-store";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { statSurfaceCss } from "../../generated/shared/stat-surface.styles";
import { atomState } from "../../shared/atom-state";
import { ComposedParticipants } from "../../shared/composed-participants";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { isStatBoundary, registerStatBoundary, type StatOwner, type StatPart, statContext, statPartFor } from "../../shared/stat-context";
/** A named measurement composed from native terms, values and supporting content.
 * @slot - Stat Label, Value, Description, Change and Footer parts.
 * @csspart root - Native description list.
 */
export class AcmeStat extends AcmeSemanticElement {
  static styles = [sharedCss, statSurfaceCss];
  @atomState() private scale: "small" | "medium" | "large" = "medium";
  /** @default "medium" */
  @property({ noAccessor: true, useDefault: true }) get size() {
    return this.scale;
  }
  set size(value: "small" | "medium" | "large") {
    if (!["small", "medium", "large"].includes(value)) {
      throw new TypeError("Invalid Stat size");
    }
    const previous = this.scale;
    this.scale = value;
    this.requestUpdate("size", previous);
  }
  @atomState() @property({ noAccessor: true, type: Boolean }) loading = false;
  private readonly state = createAtom(() => ({ loading: this.loading }));
  private readonly parts = createAtom<readonly StatPart[]>([]);
  private readonly owner: StatOwner = {
    state: this.state,
    register: (part) => {
      this.parts.set((parts) => [...parts, part]);
      return () => this.parts.set((parts) => parts.filter((item) => item !== part));
    },
  };
  private readonly provider = new ContextProvider(this, { context: statContext, initialValue: this.owner });
  private readonly participants = new ComposedParticipants(this, {
    owner: this.owner,
    parts: () => this.parts.get(),
    find: statPartFor,
    boundary: isStatBoundary,
    descend: () => true,
    slots: () => [...this.renderRoot.querySelectorAll("slot")],
  });
  constructor() {
    super();
    registerStatBoundary(this);
  }
  render() {
    return html`<dl part="root" data-kind="stat" data-size=${this.size} aria-busy=${String(this.loading)}><slot></slot></dl>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-stat": AcmeStat;
  }
}
