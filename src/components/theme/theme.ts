import { type CSSResult, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../../base";
import { themeCss } from "../../generated/shared/theme.styles";
import { themeStructureCss } from "../../generated/shared/theme-structure.styles";
import { themeAppearanceProperties } from "../../generated/theme-properties";
import { StoreSelector } from "../../shared/store-connection";
import { getTheme } from "../../shared/theme-registry";
import type { ThemeAppearance, ThemeDensity } from "../../shared/theme-scope";
import { applyStaticStyles } from "../../shared/static-styles";
import { densityTokenDefinitions, themeOverrideSelector } from "../../shared/theme-tokens";
import { StoreEffect } from "../../shared/state";
import { optionalString } from "../../shared/attributes";

const appearanceProperties = new Set<string>(themeAppearanceProperties);
const densityProperties = new Set<string>(densityTokenDefinitions.map((token) => token.cssProperty));

/** A visual theme and formatting scope for its slotted page or section content. */
export class AcmeTheme extends AcmeElement {
  static styles = [sharedCss, themeCss, themeStructureCss];
  private overrides?: CSSResult;
  private overrideText = "";
  protected get scopedStyles() {
    return this.overrides ? [...super.scopedStyles, this.overrides] : super.scopedStyles;
  }

  constructor() {
    super();
    this.themeContext.provide();
    new StoreSelector(this, () => this.themeContext.scope.effective);
    new StoreSelector(this, () => this.themeContext.scope.authored);
    new StoreSelector(this, () => this.themeContext.parentSource);
    new StoreEffect(
      this,
      () => this.themeContext.scope.effective,
      () => this.syncStyles(),
    );
    new StoreEffect(
      this,
      () => this.themeContext.scope.authored,
      () => this.syncStyles(),
    );
    new StoreEffect(
      this,
      () => this.themeContext.parentSource,
      () => this.syncStyles(),
    );
  }

  /** Registered name; omission inherits the enclosing scope or selects the house theme. */
  @property({ noAccessor: true, converter: optionalString })
  get theme(): string | undefined {
    return this.themeContext.scope.effective.get().theme;
  }
  set theme(value: string | undefined) {
    if (value !== undefined) getTheme(value);
    this.themeContext.scope.setAuthored({ theme: value });
  }

  /**
   * Appearance preference. Omission inherits; explicit auto uses the local system preference.
   * @default "auto"
   */
  @property({ noAccessor: true, converter: optionalString })
  get appearance(): ThemeAppearance {
    return this.themeContext.scope.effective.get().appearance;
  }
  set appearance(value: ThemeAppearance | undefined) {
    this.themeContext.scope.setAuthored({ appearance: value });
  }

  /**
   * Density setting. Omission inherits; explicit normal resets compact spacing roles.
   * @default "normal"
   */
  @property({ noAccessor: true, converter: optionalString })
  get density(): ThemeDensity {
    return this.themeContext.scope.effective.get().density;
  }
  set density(value: ThemeDensity | undefined) {
    this.themeContext.scope.setAuthored({ density: value });
  }

  /** Formatting locale inherited by descendants. Native lang and dir remain independent. */
  @property({ noAccessor: true, converter: optionalString })
  get locale(): string | undefined {
    return this.themeContext.scope.effective.get().locale;
  }
  set locale(value: string | undefined) {
    this.themeContext.scope.setAuthored({ locale: value });
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.syncStyles();
  }
  protected updated(): void {
    this.syncStyles();
  }
  private syncStyles(): void {
    if (!this.renderRoot) return;
    const authored = this.themeContext.scope.authored.get();
    const effective = this.themeContext.scope.effective.get();
    const root = this.themeContext.parentSource.get() === undefined;
    this.toggleAttribute("data-acme-theme-reset", root || authored.theme !== undefined);
    this.toggleAttribute("data-acme-appearance-boundary", root || authored.theme !== undefined || authored.appearance !== undefined);
    this.setAttribute("data-acme-appearance", effective.resolvedAppearance);
    this.setAttribute("data-acme-density", effective.density);
    this.toggleAttribute("data-acme-density-boundary", root || authored.density !== undefined);
    const definition = getTheme(effective.theme);
    // Only a defining boundary writes named overrides. Omitted nested scopes inherit local CSS.
    const registered = definition?.properties ?? {};
    const properties =
      root || authored.theme !== undefined
        ? registered
        : Object.fromEntries(
            Object.entries(registered).filter(([name]) => (authored.appearance !== undefined && appearanceProperties.has(name)) || (authored.density !== undefined && densityProperties.has(name))),
          );
    const buffer = this.ownerDocument.createElement("span").style;
    for (const [name, value] of Object.entries(properties)) buffer.setProperty(name, value);
    const text = buffer.cssText;
    if (text !== this.overrideText) {
      this.overrideText = text;
      this.overrides = text ? unsafeCSS(themeOverrideSelector + "{" + text + "}") : undefined;
      applyStaticStyles(this.renderRoot as ShadowRoot, this.scopedStyles);
    }
  }

  render() {
    return html`<div part="root"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "acme-theme": AcmeTheme;
  }
}
