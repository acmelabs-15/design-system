import { readFileSync } from "node:fs";
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "forms",
  title: "Forms",
  tags: [],
  lede: "Use native forms directly, or connect canonical control values to TanStack Form with bindField.",
  examples: [
    {
      h: "Managed form in React",
      p: "TanStack Form owns nested profile fields and an editable contact array. React binds typed values and events to the same controls. Native validity, managed errors and application disabled state remain distinct.",
      html: "<docs-form-react></docs-form-react>",
      language: "tsx",
      registerFunction: "registerReactManagedFormExample",
      entryPath: "examples/forms/react-entry.ts",
      sourcePath: "examples/forms/react.tsx",
      code: readFileSync(new URL("../../../examples/forms/react.tsx", import.meta.url), "utf8"),
    },
    {
      h: "Managed form",
      p: "The application renders label and error content in Field. bindField keeps value or checked and invalid presentation in sync with the typed field state.",
      html: "<docs-form-demo></docs-form-demo>",
      language: "typescript",
      registerFunction: "registerManagedFormExample",
      sourcePath: "examples/forms/lit.ts",
      code: readFileSync(new URL("../../../examples/forms/lit.ts", import.meta.url), "utf8"),
    },
    {
      h: "Native form",
      p: "The control owns native submission and validity. No managed form library is required.",
      html: '<form><acme-field required><span slot="label">Email</span><acme-input type="email" name="email" required></acme-input></acme-field><acme-button type="submit">Save</acme-button><acme-button type="reset" variant="secondary">Reset</acme-button><output></output></form>',
      script: "root.querySelector('form').addEventListener('submit',event=>{event.preventDefault();root.querySelector('output').textContent='Saved: '+new FormData(event.target).get('email');});",
    },
  ],
  practices: {
    Behavior: [
      "bindField updates value for text, arrays and selected values; boolean fields update checked.",
      "Live edits and commits share the same field state. An unchanged commit does not repeat handleChange.",
      "Leaving the control calls handleBlur. Store updates and managed reset update the native control. Disconnection releases the binding subscription.",
      "Keep name on the control when native FormData is needed. Nested and array field names remain application-owned paths.",
      "Keep each Lit field directive's name stable for its lifetime. Array fields use their index path as the rendering key. React fields can update their name while the application retains a stable row key.",
      "Field error text, disabled/loading state, submission and server responses stay with the application. invalid is presentation and does not replace native validity.",
    ],
  },
};
