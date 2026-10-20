import { AcmeEmptyState } from "../empty-state";
import { AcmeEmptyStateContent } from "../../empty-state-content/empty-state-content";
import { AcmeEmptyStateIndicator } from "../../empty-state-indicator/empty-state-indicator";
import { AcmeStatus } from "../../status/status";

for (const [name, ctor] of Object.entries({
  "acme-empty-state": AcmeEmptyState,
  "acme-empty-state-content": AcmeEmptyStateContent,
  "acme-empty-state-indicator": AcmeEmptyStateIndicator,
  "acme-status": AcmeStatus,
})) {
  customElements.define(name, ctor);
}
document.body.innerHTML = `<style>body{font-family:system-ui;margin:20px}acme-status{margin:12px}</style><acme-empty-state id="empty" variant="outline"><acme-empty-state-indicator slot="indicator"><span role="img" aria-label="Search">⌕</span></acme-empty-state-indicator><h2 slot="heading">No matching items</h2><p slot="description">Change the search terms to find an item.</p><button slot="actions">Clear search</button></acme-empty-state><acme-empty-state id="composed"><acme-empty-state-content><h3>Your collection is empty</h3><p>Create the first item.</p></acme-empty-state-content><button slot="actions">Create item</button></acme-empty-state><acme-status id="status" value="READY" label="Ready to use" variant="success"></acme-status>`;
