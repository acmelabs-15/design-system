import { AcmeDialogAction } from "../../shared/dialog-action";
/** Requests closure of its Drawer.
 * @slot - Action label; defaults to localized Close.
 */
export class AcmeDrawerClose extends AcmeDialogAction {
  constructor() {
    super("close");
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-drawer-close": AcmeDrawerClose;
  }
}
