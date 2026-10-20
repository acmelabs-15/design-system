import { AcmeToolbar } from "../toolbar";

customElements.define("acme-toolbar", AcmeToolbar);
import { AcmeButton } from "../../button/button";

customElements.define("acme-button", AcmeButton);
import { AcmeToggleButton } from "../../toggle-button/toggle-button";

customElements.define("acme-toggle-button", AcmeToggleButton);
import { AcmeGroup } from "../../group/group";

customElements.define("acme-group", AcmeGroup);
import { AcmeRadio } from "../../radio/radio";

customElements.define("acme-radio", AcmeRadio);
import { AcmeRadioGroup } from "../../radio-group/radio-group";

customElements.define("acme-radio-group", AcmeRadioGroup);
import { AcmeMenu } from "../../menu/menu";

customElements.define("acme-menu", AcmeMenu);
import { AcmeMenuTrigger } from "../../menu-trigger/menu-trigger";

customElements.define("acme-menu-trigger", AcmeMenuTrigger);
import { AcmeMenuContent } from "../../menu-content/menu-content";

customElements.define("acme-menu-content", AcmeMenuContent);
import { AcmeMenuItem } from "../../menu-item/menu-item";

customElements.define("acme-menu-item", AcmeMenuItem);
import { AcmeSpinner } from "../../spinner/spinner";

customElements.define("acme-spinner", AcmeSpinner);
import { AcmeSegmentedControl } from "../../segmented-control/segmented-control";

customElements.define("acme-segmented-control", AcmeSegmentedControl);
import { AcmeSegmentedControlItem } from "../../segmented-control-item/segmented-control-item";

customElements.define("acme-segmented-control-item", AcmeSegmentedControlItem);
import { AcmeSelectionIndicator } from "../../../internal/selection-indicator/selection-indicator";

customElements.define("acme-selection-indicator", AcmeSelectionIndicator);
import { AcmeCheckIcon } from "../../../generated/icons/classes/check-icon";

customElements.define("acme-check-icon", AcmeCheckIcon);
import { AcmeChevronRightIcon } from "../../../generated/icons/classes/chevron-right-icon";

customElements.define("acme-chevron-right-icon", AcmeChevronRightIcon);
document.body.innerHTML = `<button id="before">Before</button><acme-toolbar id="toolbar" aria-label="Formatting"><acme-group attached><acme-button id="first" variant="secondary">Save</acme-button><acme-toggle-button id="toggle">Bold</acme-toggle-button><acme-button disabled>Unavailable</acme-button></acme-group><acme-radio-group name="align" value="left" aria-label="Alignment"><acme-radio value="left">Left</acme-radio><acme-radio value="right">Right</acme-radio></acme-radio-group><acme-menu><acme-menu-trigger slot="trigger">Actions</acme-menu-trigger><acme-menu-content><acme-menu-item value="copy">Copy</acme-menu-item><acme-menu-item value="paste">Paste</acme-menu-item></acme-menu-content></acme-menu><input slot="end" id="editor" aria-label="Search" value="abc"></acme-toolbar><button id="after">After</button>`;
import { AcmeAppBar } from "../../app-bar/app-bar";
import { AcmeAppBarStart } from "../../app-bar-start/app-bar-start";
import { AcmeAppBarEnd } from "../../app-bar-end/app-bar-end";
import { AcmeAppBarContent } from "../../app-bar-content/app-bar-content";
import { AcmeBreadcrumbs } from "../../breadcrumbs/breadcrumbs";
import { AcmeBreadcrumb } from "../../breadcrumb/breadcrumb";

customElements.define("acme-app-bar", AcmeAppBar);
customElements.define("acme-app-bar-start", AcmeAppBarStart);
customElements.define("acme-app-bar-content", AcmeAppBarContent);
customElements.define("acme-app-bar-end", AcmeAppBarEnd);
customElements.define("acme-breadcrumbs", AcmeBreadcrumbs);
customElements.define("acme-breadcrumb", AcmeBreadcrumb);
document.body.insertAdjacentHTML(
  "beforeend",
  '<acme-app-bar id="bar"><acme-app-bar-start><strong>ACME</strong></acme-app-bar-start><acme-app-bar-content>Workspace</acme-app-bar-content><acme-app-bar-end><button id="bar-save">Save project</button></acme-app-bar-end></acme-app-bar><dialog id="dialog" open><acme-app-bar id="dialog-bar">Dialog heading</acme-app-bar></dialog><acme-breadcrumbs id="crumbs"><acme-breadcrumb href="#home">Home</acme-breadcrumb><acme-breadcrumb href="#private" disabled>Private</acme-breadcrumb><acme-breadcrumb current>Current page</acme-breadcrumb></acme-breadcrumbs>',
);
