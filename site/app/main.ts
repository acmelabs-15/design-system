import { registerReactVirtualTableExample } from "../../examples/recipes/virtual-react-entry";
import { registerTableExamples } from "../../examples/table/docs-entry";
import { registerManagedFormExample } from "../../examples/forms/lit";
import { registerReactManagedFormExample } from "../../examples/forms/react-entry";
// Entry for the docs app bundle: the design system (compiled), the router app, and the
// "Show code" toggle. Bundled by site/build.ts into _site/app.js.
import "../../dist/all";
import { AcmeDocsApp, DocsSwatch, DocsTokens } from "./docs-app";

export function startDocs(): void {
  registerReactVirtualTableExample();
  registerTableExamples();
  registerManagedFormExample();
  registerReactManagedFormExample();
  customElements.define("docs-tokens", DocsTokens);
  customElements.define("docs-swatch", DocsSwatch);
  customElements.define("acme-docs-app", AcmeDocsApp);
}
