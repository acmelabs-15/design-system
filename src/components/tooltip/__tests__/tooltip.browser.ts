import { AcmeTooltip } from "../tooltip";
import { AcmeHoverCard } from "../../hover-card/hover-card";
import { AcmeOverlayTheme } from "../../../internal/overlay-theme/overlay-theme";
import { AcmeButton } from "../../button/button";
import { AcmeSpinner } from "../../spinner/spinner";

customElements.define("acme-overlay-theme", AcmeOverlayTheme);
customElements.define("acme-button", AcmeButton);
customElements.define("acme-spinner", AcmeSpinner);
customElements.define("acme-tooltip", AcmeTooltip);
customElements.define("acme-hover-card", AcmeHoverCard);
document.body.innerHTML = `<style>body{padding:80px;font-family:system-ui}.row{display:flex;gap:24px}</style><span id="existing" hidden>Existing description</span><div class="row"><acme-tooltip id="tip" content="Save your changes"><button aria-describedby="existing">Save</button></acme-tooltip><acme-tooltip id="custom" content="Publish your work"><acme-button>Publish</acme-button></acme-tooltip><acme-hover-card id="preview" open-delay="0" close-delay="100"><a href="#profile">Ada</a><section slot="content"><h2>Ada Lovelace</h2><p>Computing pioneer</p></section></acme-hover-card></div><button id="after">After</button>`;

import { AcmeToggleTip } from "../../toggle-tip/toggle-tip";

customElements.define("acme-toggle-tip", AcmeToggleTip);
document.body.insertAdjacentHTML(
  "beforeend",
  `<acme-toggle-tip id="toggle"><span slot="trigger">Help with billing</span><p>Billing details</p><a href="#billing" id="billing-link">Billing guide</a><label>Reference <input id="reference" value="Kept"></label></acme-toggle-tip>`,
);
import { AcmeDialog } from "../../dialog/dialog";

customElements.define("acme-dialog", AcmeDialog);
document.body.insertAdjacentHTML(
  "beforeend",
  '<acme-dialog id="dialog" aria-label="Project dialog"><acme-toggle-tip id="nested"><span slot="trigger">Nested help</span><a href="#nested">Nested details</a></acme-toggle-tip></acme-dialog>',
);
import { AcmeTheme } from "../../theme/theme";

customElements.define("acme-theme", AcmeTheme);
