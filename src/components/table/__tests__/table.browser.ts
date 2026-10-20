const fixture = window as typeof window & { table: AcmeTable; nativeTable: HTMLTableElement; row: HTMLTableRowElement; events: string[] };
import { AcmeTable } from "../table";

customElements.define("acme-table", AcmeTable);
import { AcmeTheme } from "../../theme/theme";

customElements.define("acme-theme", AcmeTheme);
document.body.innerHTML =
  '<acme-table id="table" aria-label="Delivery results"><table><caption>Deliveries</caption><thead><tr><th scope="col">Endpoint</th><th scope="col">Status</th></tr></thead><tbody><tr id="row"><th scope="row">Order created</th><td><button id="action">Retry delivery</button></td></tr></tbody></table></acme-table>';
Object.assign(fixture, {
  table: document.querySelector<AcmeTable>("#table")!,
  nativeTable: document.querySelector<HTMLTableElement>("#table > table")!,
  row: document.querySelector<HTMLTableRowElement>("#row")!,
  events: [],
});
document.querySelector<HTMLButtonElement>("#action")!.addEventListener("click", () => fixture.events.push("retry"));
import { LitElement, html } from "lit";
import { Places } from "../../../shared/places";

class PlacesFallback extends LitElement {
  places = new Places(this, { places: [""] });
  render() {
    return html`<slot><span>Default content</span></slot>`;
  }
}
customElements.define("places-fallback-check", PlacesFallback);
