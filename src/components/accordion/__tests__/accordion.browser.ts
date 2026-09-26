import { AcmeAccordion } from "../accordion";
import { AcmeAccordionItem } from "../../accordion-item/accordion-item";
import { AcmeAccordionTrigger } from "../../accordion-trigger/accordion-trigger";
import { AcmeAccordionContent } from "../../accordion-content/accordion-content";
import { AcmeCollapsible } from "../../collapsible/collapsible";
import { AcmeCollapsibleTrigger } from "../../collapsible-trigger/collapsible-trigger";
import { AcmeCollapsibleContent } from "../../collapsible-content/collapsible-content";
import { AcmeExpandMoreIcon } from "../../../generated/icons/classes/expand-more-icon";

customElements.define("acme-accordion", AcmeAccordion);
customElements.define("acme-accordion-item", AcmeAccordionItem);
customElements.define("acme-accordion-trigger", AcmeAccordionTrigger);
customElements.define("acme-accordion-content", AcmeAccordionContent);
customElements.define("acme-collapsible", AcmeCollapsible);
customElements.define("acme-collapsible-trigger", AcmeCollapsibleTrigger);
customElements.define("acme-collapsible-content", AcmeCollapsibleContent);
customElements.define("acme-expand-more-icon", AcmeExpandMoreIcon);
class LifecycleChild extends HTMLElement {
  connectedCallback() {
    (window as any).connected = ((window as any).connected ?? 0) + 1;
  }
  disconnectedCallback() {
    (window as any).disconnected = ((window as any).disconnected ?? 0) + 1;
  }
}
customElements.define("lifecycle-child", LifecycleChild);
document.body.innerHTML =
  '<acme-accordion id="accordion"><acme-accordion-item value="alpha"><h3><acme-accordion-trigger>Alpha</acme-accordion-trigger></h3><acme-accordion-content><input id="alpha-input" value="Retained"><p>Alpha content</p></acme-accordion-content></acme-accordion-item><acme-accordion-item value="beta"><h3><acme-accordion-trigger>Beta</acme-accordion-trigger></h3><acme-accordion-content>Beta content</acme-accordion-content></acme-accordion-item></acme-accordion><acme-collapsible id="single" lazy-mount unmount-on-exit><acme-collapsible-trigger>More details</acme-collapsible-trigger><acme-collapsible-content><template><lifecycle-child>Mounted details</lifecycle-child><input id="managed-input" value="Initial"></template></acme-collapsible-content></acme-collapsible><button id="after">After</button>';
import { html } from "lit";
import { AcmeShow } from "../../show/show";
import { AcmeShowMore } from "../../show-more/show-more";
import { AcmeLoadMore } from "../../load-more/load-more";
import { AcmeSpinner } from "../../spinner/spinner";
import { AcmeTabs } from "../../tabs/tabs";
import { AcmeTab } from "../../tab/tab";
import { AcmeTabPanel } from "../../tab-panel/tab-panel";

customElements.define("acme-show", AcmeShow);
customElements.define("acme-show-more", AcmeShowMore);
customElements.define("acme-load-more", AcmeLoadMore);
customElements.define("acme-spinner", AcmeSpinner);
customElements.define("acme-tabs", AcmeTabs);
customElements.define("acme-tab", AcmeTab);
customElements.define("acme-tab-panel", AcmeTabPanel);
document.body.insertAdjacentHTML(
  "beforeend",
  '<acme-show id="show"><template><input id="show-input" value="Initial"></template><template slot="fallback"><button id="fallback-button">Fallback</button></template></acme-show><acme-show-more></acme-show-more><form id="load-form"><acme-load-more></acme-load-more></form><acme-tabs id="tabs" lazy-mount unmount-on-exit><acme-tab value="first">First tab</acme-tab><acme-tab value="second">Second tab</acme-tab><acme-tab-panel slot="panels" value="first"><template><input id="first-panel-input" value="First"></template></acme-tab-panel><acme-tab-panel slot="panels" value="second"><template><input id="second-panel-input" value="Second"></template></acme-tab-panel></acme-tabs>',
);
(window as any).setupRenderContent = () => {
  const content = document.querySelector("#single acme-collapsible-content")!;
  content.replaceChildren();
  (content as any).renderContent = () => html`<input id="rendered-input" value="Rendered">`;
};

import { AcmeGroup } from "../../group/group";
import { AcmeSelectionIndicator } from "../../../internal/selection-indicator/selection-indicator";

customElements.define("acme-group", AcmeGroup);
customElements.define("acme-selection-indicator", AcmeSelectionIndicator);
