import { AcmeOverlayTheme } from "../../../internal/overlay-theme/overlay-theme";

customElements.define("acme-overlay-theme", AcmeOverlayTheme);
import { AcmeDialog } from "../../dialog/dialog";

customElements.define("acme-dialog", AcmeDialog);
import { AcmeCloseIcon } from "../../../generated/icons/classes/close-icon";

customElements.define("acme-close-icon", AcmeCloseIcon);
import { AcmeSpinner } from "../../spinner/spinner";

customElements.define("acme-spinner", AcmeSpinner);
import { AcmeIconButton } from "../../icon-button/icon-button";

customElements.define("acme-icon-button", AcmeIconButton);
import { AcmeInput } from "../../input/input";

customElements.define("acme-input", AcmeInput);
import { AcmeScrollCorner } from "../../scroll-corner/scroll-corner";

customElements.define("acme-scroll-corner", AcmeScrollCorner);
import { AcmeScrollThumb } from "../../scroll-thumb/scroll-thumb";

customElements.define("acme-scroll-thumb", AcmeScrollThumb);
import { AcmeScrollbar } from "../../scrollbar/scrollbar";

customElements.define("acme-scrollbar", AcmeScrollbar);
import { AcmeScrollArea } from "../../scroll-area/scroll-area";

customElements.define("acme-scroll-area", AcmeScrollArea);
import { AcmeScrollViewport } from "../../scroll-viewport/scroll-viewport";

customElements.define("acme-scroll-viewport", AcmeScrollViewport);
import { AcmeCommandMenu } from "../command-menu";

customElements.define("acme-command-menu", AcmeCommandMenu);
import { AcmeCommandGroup } from "../../command-group/command-group";

customElements.define("acme-command-group", AcmeCommandGroup);
import { AcmeCommandItem } from "../../command-item/command-item";

customElements.define("acme-command-item", AcmeCommandItem);
import { AcmeCommandSeparator } from "../../command-separator/command-separator";

customElements.define("acme-command-separator", AcmeCommandSeparator);
import { AcmeButton } from "../../button/button";

customElements.define("acme-button", AcmeButton);
document.body.innerHTML = `<button id="opener">Open commands</button><acme-command-menu id="commands" heading="Project commands" placeholder="Search actions"><acme-command-group id="projects" heading="Projects"><acme-command-item value="create">Create project</acme-command-item><acme-command-item id="open-project" value="open">Open project</acme-command-item><acme-command-item value="disabled" disabled>Unavailable project</acme-command-item></acme-command-group><acme-command-separator></acme-command-separator><acme-command-item value="settings">Open settings</acme-command-item><p slot="empty">No matching actions</p></acme-command-menu><button id="after">After</button>`;
document.querySelector<HTMLButtonElement>("#opener")!.addEventListener("click", () => document.querySelector<AcmeCommandMenu>("#commands")!.show());
document.querySelector<AcmeCommandItem>("#open-project")!.keywords = ["workspace"];
import { html, render } from "lit";
import { repeat } from "lit/directives/repeat.js";

(window as typeof window & { renderCommands(values: string[]): void }).renderCommands = (values: string[]) => {
  document.querySelector("#commands")?.remove();
  let container = document.querySelector<HTMLDivElement>("#lit-consumer");
  if (!container) {
    container = document.createElement("div");
    container.id = "lit-consumer";
    document.body.append(container);
  }
  render(
    html`<acme-command-menu id="lit-menu" heading="Lit commands"><acme-command-group heading="Actions">${repeat(
      values,
      (value) => value,
      (value) => html`<acme-command-item .value=${value} .label=${value}></acme-command-item>`,
    )}</acme-command-group></acme-command-menu>`,
    container,
  );
};
