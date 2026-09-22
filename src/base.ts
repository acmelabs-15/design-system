// Shared base for every acme-* element: the shadow-root reset, screen-reader helpers,
// and class-list helpers.
import { type CSSResultGroup, type CSSResultOrNative, LitElement } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { baseCss } from "./generated/shared/base.styles";
import { applyStaticStyles } from "./shared/static-styles";
import { registerStyleProperties } from "./shared/style-properties";
import { ThemeContextController } from "./shared/theme-context";
import { StoreEffect } from "./shared/state";

/** Rules every shadow root needs: the reset the global sheet gives the page, plus .ic and .sr. The host takes the reset too: an element of ours slotted into another (a grid cell) then reads as a reset page element. */
export const sharedCss = baseCss;

/**
 * Where the package's asset files (logos, textures) load from. The default is the published
 * package on the CDN; a page that serves the `assets/` directory itself sets its own base before
 * the elements render.
 */
export let assetsBase = "https://cdn.jsdelivr.net/npm/@acmelabs/design-system/assets/";
export const setAssetsBase = (url: string) => {
  assetsBase = url.endsWith("/") ? url : `${url}/`;
};

/** Converter for a boolean that defaults to true: `loop="false"` turns it off (the React convention `loop={false}`); a bare or any other attribute value keeps it on. */
export const boolish = {
  fromAttribute: (v: string | null) => v === null || v !== "false",
  toAttribute: (v: boolean) => String(v),
};

export class AcmeElement extends LitElement {
  static styles: CSSResultGroup = sharedCss;
  protected readonly themeContext = new ThemeContextController(this);
  private readonly themeAppearance = new StoreEffect(
    this,
    () => this.themeContext.scope.effective,
    (scope) => this.toggleAttribute("data-dark", scope.resolvedAppearance === "dark"),
  );
  protected get scopedStyles(): readonly CSSResultOrNative[] {
    return (this.constructor as typeof AcmeElement).elementStyles;
  }
  protected refreshScopedStyles(): void {
    if (this.renderRoot?.nodeType === 11 && "host" in this.renderRoot) applyStaticStyles(this.renderRoot as ShadowRoot, this.scopedStyles);
  }
  protected createRenderRoot(): HTMLElement | DocumentFragment {
    const componentClass = this.constructor as typeof AcmeElement;
    const root = this.shadowRoot ?? this.attachShadow(componentClass.shadowRootOptions);
    const boundary = applyStaticStyles(root, this.scopedStyles);
    this.renderOptions.renderBefore ??= boundary;
    return root;
  }
  connectedCallback() {
    this.setAttribute("data-acme-element", "");
    this.registerStyles();
    super.connectedCallback();
    this.toggleAttribute("data-dark", this.themeContext.scope.effective.get().resolvedAppearance === "dark");
  }
  adoptedCallback() {
    this.registerStyles();
    this.themeContext.adopted();
    if (this.renderRoot?.nodeType === 11 && "host" in this.renderRoot) applyStaticStyles(this.renderRoot as ShadowRoot, this.scopedStyles);
  }
  private registerStyles() {
    const view = this.ownerDocument.defaultView as (Window & { CSS?: typeof CSS }) | null;
    registerStyleProperties((this.constructor as typeof AcmeElement).styles, view?.CSS);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  /** Reflects a boolean/enum attribute into a class list on the inner element. */
  protected cls(base: string, extra: Record<string, boolean | undefined | null | string> = {}) {
    const map: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(extra)) if (v) map[k] = true;
    return classMap({ [base]: true, ...map });
  }
}
