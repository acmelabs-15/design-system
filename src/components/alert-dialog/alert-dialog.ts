import { property } from "lit/decorators.js";
import { boolish } from "../../base";
import { AcmeDialog } from "../dialog/dialog";
/** A modal prompt with explicit description and least-destructive initial focus. */
export class AcmeAlertDialog extends AcmeDialog {
  protected get alertDialog() {
    return true;
  }
  /** @default false */
  @property({ noAccessor: true, converter: boolish, useDefault: true, attribute: "close-on-outside" }) get closeOnOutside(): boolean {
    return super.closeOnOutside;
  }
  set closeOnOutside(value: boolean) {
    super.closeOnOutside = value;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-alert-dialog": AcmeAlertDialog;
  }
}
