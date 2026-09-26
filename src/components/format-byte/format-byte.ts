import { html } from "lit";
import { property } from "lit/decorators.js";
import { AcmeFormattingElement } from "../../shared/formatting-element";
import { numberAttribute } from "../../shared/attributes";
import { atomState } from "../../shared/atom-state";
import { formatByte, type ByteUnit, type ByteUnitDisplay, type ByteUnitSystem } from "../../shared/number-format";

/** Formats a numeric bit/byte amount using decimal or binary scaling.
 * @csspart root - The formatted text.
 */
export class AcmeFormatByte extends AcmeFormattingElement {
  @atomState()
  @property({ type: Number, noAccessor: true, converter: numberAttribute })
  value?: number;
  @atomState()
  @property({ noAccessor: true, useDefault: true })
  unit: ByteUnit = "byte";
  @atomState()
  @property({ attribute: "unit-display", noAccessor: true, useDefault: true })
  unitDisplay: ByteUnitDisplay = "short";
  @atomState()
  @property({ attribute: "unit-system", noAccessor: true, useDefault: true })
  unitSystem: ByteUnitSystem = "decimal";
  render() {
    let text = "";
    if (this.value === undefined) {
      this.clearDiagnostic();
    } else {
      try {
        text = formatByte(this.value, this.formatLocale, { unit: this.unit, unitDisplay: this.unitDisplay, unitSystem: this.unitSystem });
        this.clearDiagnostic();
      } catch {
        this.diagnostic("invalid-byte-format");
      }
    }
    return html`<span part="root">${text}</span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-format-byte": AcmeFormatByte;
  }
}
