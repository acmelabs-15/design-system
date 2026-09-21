import { themeSwitcherStructureCss } from "../../generated/components/theme-switcher/theme-switcher-structure.styles";
import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { atomState } from "../../shared/atom-state";
import type { ThemeAppearance } from "../../shared/theme-scope";
import { live } from "lit/directives/live.js";
import { themeSwitcherCss } from "../../generated/components/theme-switcher/theme-switcher.styles";
import { themeSwitcherOptionCss } from "../../generated/components/theme-switcher/theme-switcher-option.styles";

const OPTIONS = [
  { key: "system", theme: "auto" },
  { key: "light", theme: "light" },
  { key: "dark", theme: "dark" },
] as const;
let seq = 0;

/** Requests an application-owned appearance preference. */
export class AcmeThemeSwitcher extends AcmeElement {
  static styles = [sharedCss, themeSwitcherCss, themeSwitcherOptionCss, themeSwitcherStructureCss];
  @atomState()
  @property({ noAccessor: true, useDefault: true })
  value: ThemeAppearance = "auto";
  @atomState()
  @property({ noAccessor: true, useDefault: true })
  size: "small" | "medium" | "large" = "small";
  @atomState()
  @property({ type: Boolean, noAccessor: true, reflect: true })
  disabled = false;
  private uid = `theme-switch-${++seq}`;
  private interactions = OPTIONS.map(() => new Interaction(this, { disabled: () => this.disabled }));

  updated() {
    const options = this.renderRoot.querySelectorAll<HTMLElement>(".option");
    for (const [k, i] of this.interactions.entries()) i.attach(options[k]);
  }
  private choose(value: ThemeAppearance) {
    if (this.disabled || value === this.value) return;
    this.dispatchEvent(new CustomEvent("acme-request", { detail: { action: "appearance" as const, value }, bubbles: true, composed: true, cancelable: true }));
    this.requestUpdate();
  }
  render() {
    const current = this.value;
    const small = this.size === "small" ? "" : nothing;
    return html`<fieldset class="switcher" data-small=${small} data-size=${this.size} part="root">
      <legend class="legend">Select a display theme:</legend>
      ${OPTIONS.map(({ key, theme }) => {
        const id = `${this.uid}-${key}`;
        const checked = current === theme;
        return html`<span class="option" data-checked=${checked ? "" : nothing} data-disabled=${this.disabled ? "" : nothing}
          ><input
            type="radio"
            name=${this.uid}
            part="control"
            id=${id}
            value=${key}
            aria-label=${key}
            .checked=${live(checked)}
            ?disabled=${this.disabled}
            @change=${() => this.choose(theme)}
          /><label class="control" for=${id} data-small=${small}
            ><span class="sr">${key}</span
            ><span class="icon"
              >${key === "system" ? html`<acme-desktop-windows-icon size=${this.size === "small" ? "12px" : "16px"}></acme-desktop-windows-icon>` : key === "light" ? html`<acme-light-mode-icon size=${this.size === "small" ? "12px" : "16px"}></acme-light-mode-icon>` : html`<acme-dark-mode-icon size=${this.size === "small" ? "12px" : "16px"}></acme-dark-mode-icon>`}</span
            ></label
          ></span
        >`;
      })}
    </fieldset>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-theme-switcher": AcmeThemeSwitcher;
  }
}
