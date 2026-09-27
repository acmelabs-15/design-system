import { AcmeDialogAction } from "../../shared/dialog-action";
/** Requests closure of its Dialog.
 * @slot - Action label; defaults to localized Close.
 */
export class AcmeDialogClose extends AcmeDialogAction {
  constructor() {
    super("close");
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-dialog-close": AcmeDialogClose;
  }
}
