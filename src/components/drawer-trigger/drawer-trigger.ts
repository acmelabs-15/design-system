import { AcmeDialogAction } from "../../shared/dialog-action";
/** Opens its Drawer with native button behavior.
 * @slot - Required action label.
 */
export class AcmeDrawerTrigger extends AcmeDialogAction {
  constructor() {
    super("trigger");
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-drawer-trigger": AcmeDrawerTrigger;
  }
}
