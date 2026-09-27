const fixture = window as typeof window & { json: AcmeJsonView; left: { leaf: number }; events: unknown[] };
import { AcmeChevronRightIcon } from "../../../generated/icons/classes/chevron-right-icon";
import { AcmeJsonView } from "../../../components/json-view/json-view";

customElements.define("acme-chevron-right-icon", AcmeChevronRightIcon);
customElements.define("acme-json-view", AcmeJsonView);
document.body.innerHTML = '<acme-json-view id="json" expanded-depth="1"></acme-json-view>';
fixture.json = document.querySelector<AcmeJsonView>("#json")!;
fixture.left = { leaf: 1 };
fixture.json.value = { alpha: fixture.left, beta: { leaf: 2 }, ready: true, missing: undefined };
fixture.events = [];
fixture.json.addEventListener("acme-expanded-change", (event) => fixture.events.push((event as CustomEvent<unknown>).detail));
