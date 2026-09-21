import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeFormattingElement, numberAttribute } from "../../shared/formatting-element";
import { atomState } from "../../shared/atom-state";
import { isPlainRecord } from "../../shared/plain-record";

function optionsSnapshot(value: Intl.NumberFormatOptions | undefined): Readonly<Intl.NumberFormatOptions> {
  if (value === undefined) return Object.freeze({});
  if (!isPlainRecord(value)) throw new TypeError("Number options must be a plain data record");
  const entries: [string, unknown][] = [];
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
    if (typeof key !== "string" || !descriptor.enumerable || !("value" in descriptor) || (descriptor.value !== undefined && !["string", "number", "boolean"].includes(typeof descriptor.value)))
      throw new TypeError("Number options require scalar data properties");
    entries.push([key, descriptor.value]);
  }
  return Object.freeze(Object.fromEntries(entries)) as Readonly<Intl.NumberFormatOptions>;
}

/** Formats a numeric value with native Intl options. Child text is not a data source.
 * @csspart root - The formatted text.
 */
export class AcmeFormatNumber extends AcmeFormattingElement {
  @atomState()
  @property({ type: Number, noAccessor: true, converter: numberAttribute })
  value?: number;
  @atomState() private configuration: Readonly<{ options: Readonly<Intl.NumberFormatOptions>; invalid: boolean }> = Object.freeze({ options: Object.freeze({}), invalid: false });
  private cached?: { locale: string | undefined; options: Readonly<Intl.NumberFormatOptions>; formatter: Intl.NumberFormat };
  /** Native number formatting options. @default {} */
  @property({ noAccessor: true })
  get options(): Readonly<Intl.NumberFormatOptions> {
    return this.configuration.options;
  }
  set options(value: Intl.NumberFormatOptions | undefined) {
    const options = optionsSnapshot(value),
      previous = this.options;
    this.configuration = Object.freeze({ options, invalid: false });
    this.requestUpdate("options", previous);
  }
  attributeChangedCallback(name: string, previous: string | null, value: string | null): void {
    if (name !== "options") {
      super.attributeChangedCallback(name, previous, value);
      return;
    }
    try {
      this.options = value === null ? undefined : JSON.parse(value);
    } catch {
      this.configuration = Object.freeze({ ...this.configuration, invalid: true });
    }
  }
  render() {
    let text = "";
    if (this.value === undefined) {
      this.clearDiagnostic();
      return html`<span part="root"></span>`;
    }
    try {
      if (typeof this.value !== "number" || !Number.isFinite(this.value)) throw new RangeError("Invalid numeric value");
      if (this.configuration.invalid) throw new TypeError("Invalid options");
      const locale = this.formatLocale,
        options = this.options;
      let cached = this.cached;
      if (!cached || cached.locale !== locale || cached.options !== options) cached = this.cached = { locale, options, formatter: new Intl.NumberFormat(locale, options) };
      text = cached.formatter.format(this.value);
      this.clearDiagnostic();
    } catch {
      this.diagnostic("invalid-number-format");
    }
    return html`<span part="root">${text}</span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-format-number": AcmeFormatNumber;
  }
}
