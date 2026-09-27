import { html } from "lit";
import { property } from "lit/decorators.js";
import { sharedCss } from "../../base";
import { AcmeSemanticElement } from "../../shared/semantic-element";
import { atomState } from "../../shared/atom-state";
import { StoreSelector } from "../../shared/store-connection";
import { message, messageCatalogs } from "../../shared/messages";
import { optionalString } from "../../shared/attributes";
import type { ThemeAppearance } from "../../shared/theme-scope";
import { themeSwitcherStructureCss } from "../../generated/components/theme-switcher/theme-switcher-structure.styles";
/** Requests an application-owned appearance preference.
 * @csspart root - The appearance selector.
 * @csspart control - An individual appearance choice.
 * @fires {CustomEvent<{action:'appearance';value:ThemeAppearance}>} acme-request - Requests that the application apply the chosen appearance.
 */
export class AcmeThemeSwitcher extends AcmeSemanticElement {
  static styles = [sharedCss, themeSwitcherStructureCss];
  @atomState() private preference: ThemeAppearance = "auto";
  /** @default "auto" */
  @property({ noAccessor: true, converter: optionalString }) get value(): ThemeAppearance {
    return this.preference;
  }
  set value(value: ThemeAppearance | undefined) {
    const next = value ?? "auto";
    if (!["auto", "light", "dark"].includes(next)) {
      throw new TypeError("Invalid appearance preference");
    }
    const old = this.preference;
    this.preference = next;
    this.requestUpdate("value", old);
  }
  @atomState() private controlSize: "small" | "medium" | "large" = "small";
  /** @default "small" */
  @property({ noAccessor: true, converter: optionalString }) get size(): "small" | "medium" | "large" {
    return this.controlSize;
  }
  set size(value: "small" | "medium" | "large" | undefined) {
    const next = value ?? "small";
    if (!["small", "medium", "large"].includes(next)) {
      throw new TypeError("Invalid appearance control size");
    }
    const old = this.controlSize;
    this.controlSize = next;
    this.requestUpdate("size", old);
  }
  @atomState() @property({ type: Boolean, noAccessor: true }) disabled = false;
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private readonly themeUpdates = new StoreSelector(this, () => this.themeContext.scope.effective);
  private text(key: string, fallback: string) {
    return message(this.themeContext.scope.effective.get().locale, "themeSwitcher." + key, fallback);
  }
  protected get semanticDefaults() {
    return { label: this.text("label", "Appearance") };
  }
  private request = (event: CustomEvent<{ value: string }>) => {
    event.stopPropagation();
    const value = event.detail.value as ThemeAppearance;
    if (!this.disabled && value !== this.value && ["auto", "light", "dark"].includes(value)) {
      this.dispatchEvent(new CustomEvent("acme-request", { detail: { action: "appearance" as const, value }, bubbles: true, composed: true, cancelable: true }));
    }
    const selector = event.currentTarget as HTMLElement & { value: ThemeAppearance };
    selector.value = this.value;
  };
  render() {
    return html`<acme-segmented-control part="root" .value=${this.value} .disabled=${this.disabled} .size=${this.size} @acme-change=${this.request}><acme-segmented-control-item exportparts="item:control" value="auto" aria-label=${this.text("auto", "System")}><acme-desktop-windows-icon></acme-desktop-windows-icon></acme-segmented-control-item><acme-segmented-control-item exportparts="item:control" value="light" aria-label=${this.text("light", "Light")}><acme-light-mode-icon></acme-light-mode-icon></acme-segmented-control-item><acme-segmented-control-item exportparts="item:control" value="dark" aria-label=${this.text("dark", "Dark")}><acme-dark-mode-icon></acme-dark-mode-icon></acme-segmented-control-item></acme-segmented-control>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-theme-switcher": AcmeThemeSwitcher;
  }
}
