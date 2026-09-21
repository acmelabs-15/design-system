import { createAtom } from "@tanstack/lit-store";
import { property } from "lit/decorators.js";
import { AcmeElement, sharedCss } from "../base";
import { formattingCss } from "../generated/shared/formatting.styles";
import { atomState } from "./atom-state";
import { optionalString } from "./attributes";
import { StoreSelector } from "./store-connection";

export const numberAttribute = { fromAttribute: (value: string | null): number | undefined => (value === null || value.trim() === "" ? undefined : Number(value)) };
/** Locale-aware text presentation without interaction, form state or periodic work. */
export abstract class AcmeFormattingElement extends AcmeElement {
  static styles = [sharedCss, formattingCss];
  @atomState()
  @property({ noAccessor: true, converter: optionalString })
  locale?: string;
  private readonly inheritedLocale = createAtom(() => this.themeContext.scope.effective.get().locale);
  private readonly localeUpdates = new StoreSelector(this, () => this.inheritedLocale);
  private lastDiagnostic?: string;
  protected get formatLocale(): string | undefined {
    return this.locale ?? this.inheritedLocale.get();
  }
  protected diagnostic(code: string): void {
    if (this.lastDiagnostic !== code) console.warn(this.localName, { code });
    this.lastDiagnostic = code;
  }
  protected clearDiagnostic(): void {
    this.lastDiagnostic = undefined;
  }
}
