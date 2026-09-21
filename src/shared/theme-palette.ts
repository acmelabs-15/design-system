import type { ReadonlyAtom } from "@tanstack/lit-store";
import { type CSSResult, type ReactiveController, type ReactiveControllerHost, unsafeCSS } from "lit";
import { themeLocalPalettes } from "../generated/theme-properties";
import { getTheme, type RegisteredTheme } from "./theme-registry";
import type { EffectiveThemeScope } from "./theme-scope";

type Palette = keyof typeof themeLocalPalettes;
const defaults = new Map<string, CSSResult>();
const themed = new WeakMap<RegisteredTheme, Map<string, CSSResult>>();

/** Delivers named overrides through a surface's deliberate local palette reset. */
export class ThemePaletteController implements ReactiveController {
  private currentStyles: readonly CSSResult[] = [];
  get styles(): readonly CSSResult[] {
    return this.currentStyles;
  }
  private subscription?: { unsubscribe(): void };
  constructor(
    private host: HTMLElement & ReactiveControllerHost,
    private palette: Palette,
    private source: ReadonlyAtom<EffectiveThemeScope>,
    private changed: () => void,
  ) {
    host.addController(this);
  }
  private update = (): void => {
    const scope = this.source.get();
    const definition = getTheme(scope.theme);
    const metadata = themeLocalPalettes[this.palette];
    let cache = definition ? themed.get(definition) : defaults;
    if (!cache) {
      cache = new Map();
      themed.set(definition!, cache);
    }
    const key = this.palette + ":" + scope.resolvedAppearance;
    let style = cache.get(key);
    if (!style) {
      const declarations = this.host.ownerDocument.createElement("span").style;
      for (const property of metadata.properties) {
        const value = definition?.properties[property];
        if (value !== undefined) declarations.setProperty(property, value);
      }
      style = unsafeCSS(metadata[scope.resolvedAppearance] + metadata.selector + "{" + declarations.cssText + "}");
      cache.set(key, style);
    }
    if (this.currentStyles[0] === style) return;
    this.currentStyles = Object.freeze([style]);
    this.changed();
  };
  hostConnected(): void {
    this.update();
    this.subscription = this.source.subscribe(this.update);
  }
  hostDisconnected(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }
}
