import { AcmeDialogAction } from "../../shared/dialog-action";
/** Opens its Dialog with native button behavior.
 * @slot - Required action label.
 */
export class AcmeDialogTrigger extends AcmeDialogAction {
  constructor() {
    super("trigger");
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-dialog-trigger": AcmeDialogTrigger;
  }
}
