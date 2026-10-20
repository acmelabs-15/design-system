import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { WorkerDeliveryReact } from "./worker-react";
import { createWorkerSession, type WorkerSession } from "./worker-session";

class ReactWorkerTableExample extends HTMLElement {
  private root?: Root;
  private session?: WorkerSession;
  connectedCallback() {
    this.root ??= createRoot(this);
    this.session ??= createWorkerSession();
    this.root.render(
      createElement(WorkerDeliveryReact, {
        session: this.session,
        ready: () => {
          /* The application example does not retain the Table API outside its view. */
        },
      }),
    );
  }
  disconnectedCallback() {
    this.root?.unmount();
    this.session?.dispose();
    this.root = undefined;
    this.session = undefined;
  }
}
export function registerReactWorkerTableExample(): void {
  customElements.define("docs-table-worker-react", ReactWorkerTableExample);
}
