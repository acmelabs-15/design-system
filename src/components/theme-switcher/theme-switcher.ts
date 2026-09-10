import { css, html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { Interaction } from "../../shared/interaction";
import { StoreSelector, type Theme, themeStore } from "../../shared/state";
import { themeSwitcherCss } from "./theme-switcher.styles";
import { themeSwitcherOptionCss } from "./theme-switcher-option.styles";

/** The three options in order: the theme key each one sets, and its icon at the two sizes (16px glyphs, drawn smaller in a small control). */
const OPTIONS: { key: "system" | "light" | "dark"; theme: Theme; icon: string; smallIcon: string }[] = [
  {
    key: "system",
    theme: "auto",
    icon: "M1 3.25C1 1.45 2.46 0 4.25 0h7.5C13.55 0 15 1.46 15 3.25V16H1V3.25M4.25 1.5c-.97 0-1.75.78-1.75 1.75V14.5h11V3.25c0-.97-.78-1.75-1.75-1.75zM4 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6H4zm5 9h3v-1.5H9z",
    smallIcon:
      "M2.5 5.25C2.5 3.45 3.96 2 5.75 2h4.5c1.8 0 3.25 1.46 3.25 3.25V14h-11V5.25M5.75 3.5C4.78 3.5 4 4.28 4 5.25v7.25h8V5.25c0-.97-.78-1.75-1.75-1.75zM5 5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V9H5zm3.5 6H11V10H8.5z",
  },
  {
    key: "light",
    theme: "light",
    icon: "M8.75.75V0h-1.5v2h1.5V.75M3.26 4.32l-.53-.53-.35-.35-.53-.53L2.9 1.85l.53.53.35.35.53.53zm8.42-1.06.53-.53.35-.35.53-.53 1.06 1.06-.53.53-.35.35-.53.53zM8 11.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5m0 1.5a4.75 4.75 0 1 0 0-9.5 4.75 4.75 0 0 0 0 9.5m6-5.5h2v1.5h-2zm-13.25 0H0v1.5h2v-1.5H.75m1.62 5.32-.53.53 1.06 1.06.53-.53.35-.35.53-.53-1.06-1.06-.53.53zm10.2 1.06.53.53 1.06-1.06-.53-.53-.35-.35-.53-.53-1.06 1.06.53.53zM8.75 14v2h-1.5v-2z",
    smallIcon:
      "M8.75 2v-.75h-1.5V3h1.5V2M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 1.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.75 1.5v1.75h-1.5V13zM13 7.25h1.75v1.5H13zm-11 0h-.75v1.5H3v-1.5H2m9-3.32.54-.53.17-.17.53-.53 1.06 1.06-.53.53-.17.17-.53.53zm-7.77 7.78-.53.53 1.06 1.06.53-.53.17-.17.53-.53L3.93 11l-.53.53zM3.93 5l-.53-.53-.17-.17-.53-.53L3.76 2.7l.53.53.17.17.53.53zm7.78 7.78.53.53 1.06-1.06-.53-.53-.17-.17-.53-.53L11 12.07l.53.53z",
  },
  {
    key: "dark",
    theme: "dark",
    icon: "M1.5 8a6 6 0 0 1 3.62-5.51 7 7 0 0 0 7.08 9.25A5.99 5.99 0 0 1 1.5 8M6.42.58a7.5 7.5 0 1 0 7.96 10.41l-.92-1.01a5.5 5.5 0 0 1-6.3-8.25zm6.83.42v1.75H15v1.5h-1.75V6h-1.5V4.25H10v-1.5h1.75V1z",
    smallIcon:
      "m6.3 3.3.7.25A4.25 4.25 0 0 0 12.45 9l.96.96-.08.2A5.75 5.75 0 1 1 6.04 2.6zM5.25 4.76a4.24 4.24 0 1 0 6 5.99H11a5.75 5.75 0 0 1-5.75-6M12.5 3.5h1.25V5H12.5v1.25H11V5H9.75V3.5H11V2.25h1.5zM7 3.55l-.7-.25-.26-.7z",
  },
];
let seq = 0;

/**
 * Theme switcher: three radios (system, light, dark) in a 32px pill, each a hidden radio under a
 * round label with an icon; `small` is the 24px pill with its own glyphs. The checked radio follows
 * the shared theme store, and choosing one writes the store, which sets `data-theme` on the root
 * element. Each option span keeps its radio's states as attributes (data-checked, data-disabled,
 * data-focus) beside the interaction states. `disabled` greys every option and blocks the change.
 */
@customElement("acme-theme-switcher")
export class AcmeThemeSwitcher extends AcmeElement {
  static styles = [
    sharedCss,
    themeSwitcherCss,
    themeSwitcherOptionCss,
    css`
      :host {
        display: inline-flex;
      }
    `,
  ];
  /** The 24px pill. */
  @property({ type: Boolean }) small = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  private uid = `theme-switch-${++seq}`;
  private interactions = OPTIONS.map(() => new Interaction(this, { disabled: () => this.disabled }));

  constructor() {
    super();
    // Re-renders whenever the shared theme changes, from this element or any other.
    new StoreSelector(this, () => themeStore);
  }
  updated() {
    const options = this.renderRoot.querySelectorAll<HTMLElement>(".option");
    for (const [k, i] of this.interactions.entries()) i.attach(options[k]);
  }
  private choose(theme: Theme) {
    if (this.disabled) return;
    themeStore.setState(() => theme);
    this.dispatchEvent(new CustomEvent("acme-change", { detail: { theme }, bubbles: true, composed: true }));
  }
  render() {
    const current = themeStore.state;
    const small = this.small ? "" : nothing;
    return html`<fieldset class="switcher" data-small=${small} part="switcher">
      <legend class="legend">Select a display theme:</legend>
      ${OPTIONS.map(({ key, theme, icon, smallIcon }) => {
        const id = `${this.uid}-${key}`;
        const checked = current === theme;
        return html`<span class="option" data-checked=${checked ? "" : nothing} data-disabled=${this.disabled ? "" : nothing}
          ><input
            type="radio"
            id=${id}
            value=${key}
            aria-label=${key}
            .checked=${checked}
            ?disabled=${this.disabled}
            @change=${() => this.choose(theme)}
          /><label class="control" for=${id} data-small=${small}
            ><span class="sr">${key}</span
            ><span class="icon"
              ><svg viewBox="0 0 16 16" height="16" width="16" style="color:currentColor" aria-hidden="true">
                ${svg`<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d=${this.small ? smallIcon : icon}></path>`}
              </svg></span
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
