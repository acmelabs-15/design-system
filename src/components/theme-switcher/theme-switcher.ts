import { SignalWatcher, signal } from "@lit-labs/signals";
import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, glyph, sharedCss } from "../../base.js";
import { themeSwitcherCss } from "./theme-switcher.styles.js";

/** Shared theme state: "auto" | "light" | "dark"; applies data-theme on the root and persists to localStorage. */
export const theme = signal<"auto" | "light" | "dark">("auto");

const applyTheme = (v: "auto" | "light" | "dark") => {
  const root = document.documentElement;
  if (v === "auto") root.removeAttribute("data-theme");
  else root.dataset.theme = v;
  try {
    localStorage.setItem("theme-pref", v);
  } catch {}
};

/** Geist Theme Switcher: System, Light, Dark in a pill. One per app. */
@customElement("acme-theme-switcher")
export class AcmeThemeSwitcher extends SignalWatcher(AcmeElement) {
  static styles = [sharedCss, themeSwitcherCss, css`:host{display:inline-flex}`];
  @property({ type: Boolean }) small = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  private set(v: "auto" | "light" | "dark") {
    theme.set(v);
    applyTheme(v);
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { theme: v }, bubbles: true, composed: true }));
  }
  render() {
    const cur = theme.get();
    const b = (v: "auto" | "light" | "dark", label: string, icon: string) =>
      html`<button role="radio" aria-checked=${cur === v} aria-pressed=${cur === v} aria-label=${label} @click=${() => this.set(v)}>${glyph(icon)}</button>`;
    return html`<div class=${this.cls("theme-switch", { sm: this.small })} role="radiogroup" aria-label="Select a display theme" aria-disabled=${this.disabled ? "true" : nothing} part="switch">${b("auto", "System", "monitor")}${b("light", "Light", "sun")}${b("dark", "Dark", "moon")}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-theme-switcher": AcmeThemeSwitcher;
  }
}
try {
  const saved = localStorage.getItem("theme-pref") as "auto" | "light" | "dark" | null;
  if (saved) {
    theme.set(saved);
    applyTheme(saved);
  }
} catch {}
