import { AcmeTheme } from "../../theme/theme";

customElements.define("acme-theme", AcmeTheme);
import { AcmeButton } from "../../button/button";

customElements.define("acme-button", AcmeButton);
import { AcmeSpinner } from "../../spinner/spinner";

customElements.define("acme-spinner", AcmeSpinner);
import { AcmeDialog } from "../dialog";

customElements.define("acme-dialog", AcmeDialog);
import { AcmeDialogTrigger } from "../../dialog-trigger/dialog-trigger";

customElements.define("acme-dialog-trigger", AcmeDialogTrigger);
import { AcmeDialogClose } from "../../dialog-close/dialog-close";

customElements.define("acme-dialog-close", AcmeDialogClose);
import { AcmeAlertDialog } from "../../alert-dialog/alert-dialog";

customElements.define("acme-alert-dialog", AcmeAlertDialog);
import { AcmeAlertDialogTrigger } from "../../alert-dialog-trigger/alert-dialog-trigger";

customElements.define("acme-alert-dialog-trigger", AcmeAlertDialogTrigger);
import { AcmeAlertDialogAction } from "../../alert-dialog-action/alert-dialog-action";

customElements.define("acme-alert-dialog-action", AcmeAlertDialogAction);
import { AcmeAlertDialogCancel } from "../../alert-dialog-cancel/alert-dialog-cancel";

customElements.define("acme-alert-dialog-cancel", AcmeAlertDialogCancel);
import { AcmeMenu } from "../../menu/menu";

customElements.define("acme-menu", AcmeMenu);
import { AcmeMenuTrigger } from "../../menu-trigger/menu-trigger";

customElements.define("acme-menu-trigger", AcmeMenuTrigger);
import { AcmeMenuContent } from "../../menu-content/menu-content";

customElements.define("acme-menu-content", AcmeMenuContent);
import { AcmeMenuItem } from "../../menu-item/menu-item";

customElements.define("acme-menu-item", AcmeMenuItem);
import { AcmeAppBar } from "../../app-bar/app-bar";

customElements.define("acme-app-bar", AcmeAppBar);
import { AcmeCheckIcon } from "../../../generated/icons/classes/check-icon";

customElements.define("acme-check-icon", AcmeCheckIcon);
import { AcmeChevronRightIcon } from "../../../generated/icons/classes/chevron-right-icon";

customElements.define("acme-chevron-right-icon", AcmeChevronRightIcon);
document.body.innerHTML = `<button id="outside">Outside</button><h1 id="fallback" tabindex="-1">Projects</h1><acme-dialog id="dialog"><acme-dialog-trigger id="opener" slot="trigger">Edit profile</acme-dialog-trigger><h2 slot="heading">Profile settings</h2><p slot="description">Update your details.</p><label>Name <input id="name" value="Ada"></label><acme-app-bar>Profile header</acme-app-bar><acme-menu id="menu"><acme-menu-trigger slot="trigger">Options</acme-menu-trigger><acme-menu-content><acme-menu-item value="first">First action</acme-menu-item><acme-menu-item value="second">Second action</acme-menu-item></acme-menu-content></acme-menu><acme-dialog-close slot="footer">Close profile</acme-dialog-close></acme-dialog><acme-alert-dialog id="alert"><acme-alert-dialog-trigger slot="trigger">Delete</acme-alert-dialog-trigger><h2 slot="heading">Delete project?</h2><p slot="description">This cannot be undone.</p><acme-alert-dialog-action id="danger" slot="footer">Delete project</acme-alert-dialog-action><acme-alert-dialog-cancel id="cancel" slot="footer">Cancel</acme-alert-dialog-cancel></acme-alert-dialog><acme-menu id="launcher"><acme-menu-trigger slot="trigger">Launch menu</acme-menu-trigger><acme-menu-content><acme-menu-item value="launch">Open profile</acme-menu-item></acme-menu-content></acme-menu>`;
document.querySelector<AcmeMenu>("#launcher")!.addEventListener("acme-request", (e) => {
  if ((e as CustomEvent<{ action: string }>).detail.action === "select") {
    document.querySelector<AcmeDialog>("#dialog")!.show();
  }
});
(window as typeof window & { focusedDanger: number }).focusedDanger = 0;
document.querySelector<AcmeAlertDialogAction>("#danger")!.addEventListener("focusin", () => (window as typeof window & { focusedDanger: number }).focusedDanger++);
import { registerTheme } from "../../../shared/theme-registry";

(window as typeof window & { registerTheme: typeof registerTheme }).registerTheme = registerTheme;
import { AcmeDrawer } from "../../drawer/drawer";
import { AcmeDrawerTrigger } from "../../drawer-trigger/drawer-trigger";
import { AcmeDrawerClose } from "../../drawer-close/drawer-close";

customElements.define("acme-drawer", AcmeDrawer);
customElements.define("acme-drawer-trigger", AcmeDrawerTrigger);
customElements.define("acme-drawer-close", AcmeDrawerClose);
document.body.insertAdjacentHTML(
  "beforeend",
  '<acme-drawer id="drawer"><acme-drawer-trigger slot="trigger">Open drawer</acme-drawer-trigger><h2 slot="heading">Drawer details</h2><input id="drawer-input" value="Retained"><acme-drawer-close slot="footer">Close drawer</acme-drawer-close></acme-drawer>',
);

import { AcmeOverlayTheme } from "../../../internal/overlay-theme/overlay-theme";

customElements.define("acme-overlay-theme", AcmeOverlayTheme);
