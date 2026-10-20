import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeTypographyElement } from "../../shared/typography-element";
import { atomState } from "../../shared/atom-state";
import { keyLabel } from "../../shared/key-labels";
import { messageCatalogs } from "../../shared/messages";
import { StoreSelector } from "../../shared/store-connection";
import { kbdStructureCss } from "../../generated/components/kbd/kbd-structure.styles";

/** A native key cap. Named keys are presentation, never shortcut registration.
 * @slot - Content used only when keys is absent.
 * @csspart root - The native kbd element.
 */
export class AcmeKbd extends AcmeTypographyElement {
  static styles = [...AcmeTypographyElement.styles, kbdStructureCss];
  @atomState() @property({ noAccessor: true, reflect: true, useDefault: true }) size: "small" | "medium" = "medium";
  @atomState() private authoredKeys: readonly string[] | undefined;
  @property({ noAccessor: true })
  get keys(): readonly string[] | undefined {
    return this.authoredKeys;
  }
  set keys(value: readonly string[] | undefined) {
    let owned: readonly string[] | undefined;
    if (value !== undefined) {
      if (!Array.isArray(value)) {
        throw new TypeError("keys must be an array of named key strings");
      }
      const keys: string[] = [];
      for (let index = 0; index < value.length; index++) {
        const descriptor = Object.getOwnPropertyDescriptor(value, index);
        if (!descriptor || !("value" in descriptor) || typeof descriptor.value !== "string" || !descriptor.value) {
          throw new TypeError("keys require nonempty string data entries");
        }
        keys.push(descriptor.value);
      }
      owned = Object.freeze(keys);
    }
    const previous = this.authoredKeys;
    this.authoredKeys = owned;
    this.requestUpdate("keys", previous);
  }
  private readonly messages = new StoreSelector(this, () => messageCatalogs);
  private readonly localeChanges = new StoreSelector(this, () => this.themeContext.scope.effective);
  attributeChangedCallback(name: string, previous: string | null, value: string | null): void {
    if (name === "keys") {
      try {
        this.keys = value === null ? undefined : JSON.parse(value);
      } catch {
        this.keys = Object.freeze([]);
        console.warn(this.localName, { code: "invalid-key-list" });
      }
    } else {
      super.attributeChangedCallback(name, previous, value);
    }
  }
  render() {
    const locale = this.themeContext.scope.effective.get().locale;
    return html`<kbd part="root">${this.keys === undefined ? html`<slot></slot>` : html`<span class="sr">${this.keys.map((key) => keyLabel(key, locale, true)).join(" + ")}</span>${this.keys.map((key) => html`<span aria-hidden="true">${keyLabel(key, locale)}</span>`)}`}</kbd>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-kbd": AcmeKbd;
  }
}
