import { AcmeButton } from "../button/button";
/** An application-owned Alert Dialog action. Activation does not infer success or close the dialog. */
export class AcmeAlertDialogAction extends AcmeButton {}
declare global {
  interface HTMLElementTagNameMap {
    "acme-alert-dialog-action": AcmeAlertDialogAction;
  }
}
