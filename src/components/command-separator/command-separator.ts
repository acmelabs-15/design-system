import { html } from "lit";
import { AcmeElement, sharedCss } from "../../base";
import { CommandBinding } from "../../shared/command-context";
import { commandSeparatorCss } from "../../generated/components/command-separator/command-separator.styles";
/** A decorative boundary between command blocks. @csspart separator - The rule. */
export class AcmeCommandSeparator extends AcmeElement {
  static styles = [sharedCss, commandSeparatorCss];
  private readonly binding = new CommandBinding(this, { kind: "separator", value: () => "", label: () => "", keywords: () => [], disabled: () => false });
  render() {
    return html`<div part="separator" role="separator"></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-command-separator": AcmeCommandSeparator;
  }
}
