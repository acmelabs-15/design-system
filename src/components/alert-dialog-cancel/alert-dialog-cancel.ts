import { AcmeDialogAction } from "../../shared/dialog-action";
/** Cancels its Alert Dialog through the shared dismissal path.
 * @slot - Action label; defaults to localized Cancel.
 */
export class AcmeAlertDialogCancel extends AcmeDialogAction {
  constructor() {
    super("cancel");
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-alert-dialog-cancel": AcmeAlertDialogCancel;
  }
}
