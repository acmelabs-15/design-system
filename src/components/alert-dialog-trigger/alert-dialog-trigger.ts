import { AcmeDialogTrigger } from "../dialog-trigger/dialog-trigger";
/** Opens its Alert Dialog.
 * @slot - Required action label.
 */
export class AcmeAlertDialogTrigger extends AcmeDialogTrigger {}
declare global {
  interface HTMLElementTagNameMap {
    "acme-alert-dialog-trigger": AcmeAlertDialogTrigger;
  }
}
