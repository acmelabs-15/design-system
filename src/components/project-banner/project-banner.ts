import { css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { projectBannerCss } from "./project-banner.styles";

export type ProjectBannerVariant = "gray" | "success" | "warning" | "error";

/** The focus ring color of the call to action, by variant. */
const FOCUS: Record<ProjectBannerVariant, string> = {
  gray: "var(--ds-blue-600)",
  success: "var(--ds-blue-600)",
  warning: "var(--ds-amber-700)",
  error: "var(--ds-red-700)",
};

/**
 * Project banner: a full-width, non-dismissible 40px aside naming a project-wide state, with the
 * one call to action that resolves it. The root carries the variant; inside, a column (a row from
 * 601px) holds the message (the icon wrapper and the label paragraph) and the call to action: a
 * link with `cta-href`, otherwise a button that dispatches `acme-action`. The action carries the
 * interaction states (data-hover, data-focus, data-active) and writes its focus ring, colored per
 * variant, as an inline style. Slots: default (the label), `icon`.
 */
@customElement("acme-project-banner")
export class AcmeProjectBanner extends AcmeElement {
  static styles = [
    sharedCss,
    projectBannerCss,
    css`
      /* A column, the root's usual context: three of the four reference examples stack it in one. */
      :host {
        display: flex;
        flex-direction: column;
      }
    `,
  ];
  /** Severity: `error` for critical or payment-blocking states, `warning` for an exceptional state, `success` for a positive mitigation, `gray` for routine notices. */
  @property() variant: ProjectBannerVariant = "gray";
  /** Title Case Verb + Noun of the resolver, rendered as a link with `cta-href` or as a button that dispatches `acme-action`. */
  @property({ attribute: "cta-label" }) ctaLabel = "";
  @property({ attribute: "cta-href" }) ctaHref = "";
  @query(".action") private action!: HTMLElement | null;
  private interaction = new Interaction(this);

  updated() {
    this.interaction.attach(this.action);
  }

  private press = () => this.dispatchEvent(new CustomEvent("acme-action", { bubbles: true, composed: true }));

  render() {
    const focus = FOCUS[this.variant] ?? FOCUS.gray;
    // The ring's two layers are the action's own, written at runtime: they override the rule's value, which names the color alone.
    const style = `--banner-focus-color:${focus};--acme-shadow:0 0 0 2px var(--ds-background-100), 0 0 0 4px var(--banner-focus-color) !important`;
    const action = !this.ctaLabel
      ? nothing
      : this.ctaHref
        ? html`<a class="action" href=${this.ctaHref} style=${style} part="action">${this.ctaLabel}</a>`
        : html`<button class="action" type="button" style=${style} part="action" @click=${this.press}>${this.ctaLabel}</button>`;
    return html`<aside class=${this.cls("project-banner", { [this.variant]: this.variant !== "gray" })} part="banner">
      <div class="inner">
        <div class="message">
          <div class="icon" aria-hidden="true"><slot name="icon"></slot></div>
          <p class="label"><slot></slot></p>
        </div>
        <div class="cta">${action}</div>
      </div>
    </aside>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-project-banner": AcmeProjectBanner;
  }
}
