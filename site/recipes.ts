import { readFileSync } from "node:fs";
import path from "node:path";
import type { Doc, Example } from "./site";
import { exampleFiles } from "./example-files";
import { doc as alertDialog } from "./pages/components/alert-dialog";
import { doc as input } from "./pages/components/input";
import { doc as pagination } from "./pages/components/pagination";
import { doc as stat } from "./pages/components/stat";
import { doc as table } from "./pages/components/table";
import { doc as tree } from "./pages/components/tree-view";

export type RecipeExample = Readonly<{
  pageId: string;
  exampleId: string;
  framework: "html" | "lit" | "react";
  sourceFile: string;
  example: Example;
  components: readonly string[];
  imports: readonly string[];
}>;
export type RecipeRecord = Readonly<{
  id: string;
  heading: string;
  purpose: string;
  applicationInputs: readonly string[];
  ownership: readonly string[];
  cleanup: string;
  accessibility: readonly string[];
  references: readonly string[];
  deviations: readonly string[];
  examples: readonly RecipeExample[];
}>;
export type DocStateRecord = Readonly<{
  name: string;
  exampleId: string;
  expectedOutcome: string;
  verification: "browser-verified";
  evidence: string;
}>;
export type DocCensusRecord = Readonly<{
  fixtureId: string;
  configId: string;
  referenceRevision: string;
  recordedOn: string;
  status: "historical";
  referenceSourceRevision: "not-recorded";
  resultFiles: readonly string[];
  acceptedDifferences: readonly string[];
  limitations: string;
}>;

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const root = path.resolve(import.meta.dir, "..");
const scanner = new Bun.Transpiler({ loader: "tsx" });
function example(
  pageId: string,
  value: Example,
  sourceFile = "site/recipes.ts",
  framework: RecipeExample["framework"] = "html",
): RecipeExample {
  const components = [
    ...new Set([...value.html.matchAll(/<(acme-[a-z0-9-]+)/g)].map((match) => match[1])),
  ].sort();
  const imports = new Set([
    "@acmelabs/design-system/styles/tokens.css",
    ...components.map((tag) => `@acmelabs/design-system/define/${tag.slice(5)}`),
  ]);
  const files = exampleFiles(
    [
      ...(value.sourcePath ? [value.sourcePath] : []),
      ...(value.entryPath ? [value.entryPath] : []),
      ...(value.sourceFiles ?? []),
    ],
    root,
  );
  for (const file of files)
    for (const entry of scanner.scanImports(readFileSync(path.join(root, file), "utf8")))
      if (!entry.path.startsWith(".")) imports.add(entry.path);
  const complete = files.length ? { ...value, sourceFiles: files } : value;
  return {
    pageId,
    exampleId: `${pageId}-${slug(value.h)}`,
    framework,
    sourceFile,
    example: complete,
    components,
    imports: [...imports].sort(),
  };
}
function existing(doc: Doc, heading: string, framework: RecipeExample["framework"] = "html") {
  const value = doc.examples.find((value) => value.h === heading);
  if (!value) throw new Error(`Recipe refers to a missing example: ${doc.id}/${heading}`);
  return example(doc.id, value, `site/pages/components/${doc.id}.ts`, framework);
}
const htmlCleanup =
  "Remove the mounted example. Component disconnection releases component-owned listeners, observers and timers. The example adds no global resources.";
const recipe = (record: RecipeRecord) => record;

export const recipes: readonly RecipeRecord[] = [
  recipe({
    id: "settings-rows",
    heading: "Settings rows",
    purpose:
      "Combine descriptive content and independent settings without adding a second form owner.",
    applicationInputs: ["Setting labels, help text, initial values and persistence policy."],
    ownership: [
      "Field owns each control association. Item supplies descriptive content. The native form owns submission. Stack arranges rows.",
    ],
    cleanup:
      "The mount function returns cleanup for its submit listener. Remove the form after calling cleanup.",
    accessibility: [
      "Each switch has its own Field label and help. Space changes a focused switch; Tab reaches Save. Submitting reports the selected settings in the live output.",
    ],
    references: [
      "notes/alignment/inventory/surfaces.md#required-recipes-and-migration-mapping",
      "https://chakra-ui.com/docs/components/field",
      "https://ui.shadcn.com/docs/components/item",
    ],
    deviations: ["Native form and Field retain semantics across Lit component boundaries."],
    examples: [
      example("settings-rows", {
        h: "Account settings",
        html: '<form><acme-card variant="outline"><acme-card-body><acme-stack gap="6"><acme-item><acme-item-content><acme-item-heading>Notifications</acme-item-heading><acme-item-description>Choose which updates you receive.</acme-item-description></acme-item-content></acme-item><acme-field orientation="horizontal"><span slot="label">Email updates</span><acme-switch name="email" value="enabled" checked></acme-switch><span slot="help">Receive product news by email.</span></acme-field><acme-field orientation="horizontal"><span slot="label">Security alerts</span><acme-switch name="security" value="enabled" checked></acme-switch><span slot="help">Receive account security notices.</span></acme-field></acme-stack></acme-card-body><acme-card-footer><acme-button type="submit">Save settings</acme-button><output aria-live="polite"></output></acme-card-footer></acme-card></form>',
        script:
          'const form=root.querySelector("form");const save=event=>{event.preventDefault();const data=new FormData(form);root.querySelector("output").textContent="Saved locally: "+["email","security"].map(name=>name+" "+(data.has(name)?"on":"off")).join(", ");};form.addEventListener("submit",save);return ()=>form.removeEventListener("submit",save);',
      }),
    ],
  }),
  recipe({
    id: "integration-cards",
    heading: "Integration cards",
    purpose: "Show an integration destination and a separate action on one content surface.",
    applicationInputs: ["Integration name, destination, description, status and action handler."],
    ownership: [
      "Card owns the surface; the native anchor owns navigation; Button owns the independent action.",
    ],
    cleanup:
      "Call the returned cleanup to remove the action listener, then remove the mounted content.",
    accessibility: [
      "Tab reaches the integration link and Manage separately. Activating Manage does not activate the link. The result is announced in a live output.",
    ],
    references: [
      "notes/decisions/canonical-card.md",
      "notes/alignment/inventory/surfaces.md#c-01-card",
    ],
    deviations: ["The link covers its heading rather than enclosing independent controls."],
    examples: [
      example("integration-cards", {
        h: "Connected integration",
        html: '<acme-card as="article" variant="outline"><acme-card-header><acme-heading as="h3"><a href="#integration-details">Delivery integration</a></acme-heading><acme-badge>Connected</acme-badge></acme-card-header><acme-card-body><acme-text>Send delivery events to your application.</acme-text></acme-card-body><acme-card-footer><acme-button variant="secondary">Manage integration</acme-button><output aria-live="polite"></output></acme-card-footer></acme-card><p id="integration-details">This demonstration has no network connection. Your application supplies the integration details and actions.</p>',
        script:
          'const button=root.querySelector("acme-button");const manage=()=>{root.querySelector("output").textContent="Manage requested.";};button.addEventListener("click",manage);return ()=>button.removeEventListener("click",manage);',
      }),
    ],
  }),
  recipe({
    id: "selectable-stats",
    heading: "Selectable statistics",
    purpose: "Select one measurement while keeping statistics as descriptive content.",
    applicationInputs: ["Stable metric IDs, labels, measured values and selection response."],
    ownership: [
      "Radio Group owns one selected value and keyboard behavior; Radio Card owns selection presentation; Group owns attachment; Stat owns measurement content.",
    ],
    cleanup: htmlCleanup,
    accessibility: [
      "Arrow keys change the radio selection. The selected metric appears in output. Stat does not add a second selection event.",
    ],
    references: [
      "notes/alignment/inventory/messages-statistics.md#m-07-stat",
      "https://chakra-ui.com/docs/components/stat",
    ],
    deviations: ["Selection belongs to Radio Cards; Stat has no selected property."],
    examples: [existing(stat, "Selectable statistics")],
  }),
  recipe({
    id: "file-tree",
    heading: "File tree presentation",
    purpose: "Present file content with the general Tree View hierarchy.",
    applicationInputs: [
      "Unique node IDs, hierarchy, labels, expanded IDs and optional content keyed by value.",
    ],
    ownership: [
      "Tree View owns hierarchy keys, focus, expansion and single selection. Tree Item supplies optional visible content.",
    ],
    cleanup: htmlCleanup,
    accessibility: [
      "Arrow keys move through enabled nodes and expand or collapse branches. File icons are decorative; labels remain the accessible names.",
    ],
    references: [
      "notes/decisions/general-tree-view.md",
      "notes/alignment/inventory/navigation-disclosure.md#n-06-tree-view",
    ],
    deviations: [
      "File content is a recipe of the general Tree View. No separate file tree selection model.",
    ],
    examples: [existing(tree, "File tree recipe")],
  }),
  recipe({
    id: "responsive-panes",
    heading: "Responsive list, detail and supporting panes",
    purpose:
      "Arrange related content at narrow and wide viewport sizes without changing reading order.",
    applicationInputs: ["List destinations, selected content and supporting information."],
    ownership: [
      "Grid owns placement. Native navigation links own destinations. Sections retain their own headings and content.",
    ],
    cleanup: htmlCleanup,
    accessibility: [
      "Narrow layouts stack list, detail and support in DOM order. Links reach visible detail headings. Reflow must preserve focus and avoid horizontal page scrolling.",
    ],
    references: [
      "notes/alignment/inventory/layout.md",
      "https://m3.material.io/foundations/layout/canonical-examples/list-detail",
      "https://m3.material.io/foundations/layout/canonical-examples/supporting-pane",
    ],
    deviations: [
      "Uses this system's responsive bands and spacing tokens. Material layout patterns do not supply its spacing scale.",
    ],
    examples: [
      example("responsive-panes", {
        h: "List and detail",
        html: '<acme-grid grid-template-columns=\'{"compact":"minmax(0,1fr)","expanded":"14rem minmax(0,1fr)"}\' gap="6"><nav aria-label="Project records"><acme-list><ul><li><a href="#pane-project">Project overview</a></li><li><a href="#pane-activity">Recent activity</a></li></ul></acme-list></nav><section aria-labelledby="pane-project"><acme-heading as="h3" id="pane-project">Project overview</acme-heading><p>Review the project and its recent changes.</p><acme-heading as="h4" id="pane-activity">Recent activity</acme-heading><p>The application supplies this content.</p></section></acme-grid>',
      }),
      example("responsive-panes", {
        h: "Supporting pane",
        html: '<acme-grid grid-template-columns=\'{"compact":"minmax(0,1fr)","expanded":"minmax(0,2fr) minmax(0,1fr)"}\' gap="6"><section aria-labelledby="support-main"><acme-heading as="h3" id="support-main">Delivery details</acme-heading><p>Delivery 102 completed successfully.</p></section><aside aria-labelledby="support-context"><acme-heading as="h3" id="support-context">Related information</acme-heading><acme-data-list><dl><dt>Attempts</dt><dd>1</dd><dt>Endpoint</dt><dd>/events</dd></dl></acme-data-list></aside></acme-grid>',
      }),
    ],
  }),
  recipe({
    id: "input-addons",
    heading: "External input add-ons",
    purpose:
      "Join a text input to labels or independent actions while preserving control behavior.",
    applicationInputs: ["Input name, value, accessible label and add-on action."],
    ownership: [
      "Input owns text editing and form value. Its add-on slots retain independent controls. Group only joins compatible controls visually.",
    ],
    cleanup: htmlCleanup,
    accessibility: [
      "Tab reaches the input and add-on action separately. The input keeps a complete accessible name without relying on decoration.",
    ],
    references: ["notes/alignment/inventory/inputs-forms.md#f-01-input-and-search"],
    deviations: [
      "Add-on slots and explicit Group participants share attachment presentation without sharing form state.",
    ],
    examples: [existing(input, "Add-ons and inside content"), existing(input, "Attached actions")],
  }),
  recipe({
    id: "typed-confirmation",
    heading: "Typed confirmation",
    purpose: "Require exact confirmation text before an application action can proceed.",
    applicationInputs: [
      "Required text, action description, application operation and success/failure policy.",
    ],
    ownership: [
      "Alert Dialog owns modality and focus. Input owns editing. The application enables the action and closes only after success.",
    ],
    cleanup: htmlCleanup,
    accessibility: [
      "Cancel receives initial focus. Delete stays disabled until the exact text DELETE is entered. Closing returns focus and clears the confirmation for a fresh attempt.",
    ],
    references: [
      "notes/alignment/inventory/overlays-help.md#o-02-alert-dialog",
      "https://ui.shadcn.com/docs/components/base/alert-dialog",
    ],
    deviations: ["The sample records a local result and makes no destructive network request."],
    examples: [
      existing(alertDialog, "Typed confirmation"),
      existing(alertDialog, "Failure and retry"),
    ],
  }),
  recipe({
    id: "results-pagination",
    heading: "Results pagination",
    purpose: "Coordinate result pages, position and page-size controls.",
    applicationInputs: [
      "Result count or hasNextPage, current page, page size and request handling.",
    ],
    ownership: [
      "Pagination exposes requests; the application owns accepted state and fetching. This is separate from adjacent-document links.",
    ],
    cleanup: htmlCleanup,
    accessibility: [
      "Tab reaches ordinary page actions and page-size selection. A selected page exposes aria-current. Changing page size in this example returns to page one.",
    ],
    references: ["notes/alignment/inventory/data-displays.md#d-02-results-pagination"],
    deviations: ["The component does not fetch, slice results or assume a successful request."],
    examples: [
      existing(pagination, "Position and page size"),
      existing(pagination, "Unknown total"),
    ],
  }),
  recipe({
    id: "virtualized-table",
    heading: "Virtualized Table consumers",
    purpose:
      "Render application-owned TanStack Table data through TanStack Virtual and the native Table surface.",
    applicationInputs: [
      "Rows, stable row IDs, column definitions, selection, virtualizer options and measurement callbacks.",
    ],
    ownership: [
      "The application owns Table and Virtual instances. Table supplies a stable native viewport and preserves author-owned table nodes.",
    ],
    cleanup:
      "Lit controllers release subscriptions on disconnection. React effects release observers on unmount; the application must unmount its React root before removing the host.",
    accessibility: [
      "Preserve captions, headers, row/column indices and totals. Keyboard grid behavior stays in the consumer. Focus must follow the logical cell when virtual windows change.",
    ],
    references: [
      "notes/alignment/inventory/data-displays.md#d-01-table",
      "notes/alignment/evidence/m22-react-2026-09-23.json",
      "https://tanstack.com/virtual/latest",
    ],
    deviations: ["No TanStack Table engine is installed in the design-system Table component."],
    examples: [
      existing(table, "TanStack Virtual", "lit"),
      example(
        "virtualized-table",
        {
          h: "React virtualized Table",
          html: '<docs-table-virtual-react style="display:block"></docs-table-virtual-react>',
          code: readFileSync(
            new URL("../examples/table/virtual-react.ts", import.meta.url),
            "utf8",
          ),
          language: "typescript",
          sourcePath: "examples/table/virtual-react.ts",
          entryPath: "examples/recipes/virtual-react-entry.ts",
          registerFunction: "registerReactVirtualTableExample",
          sourceFiles: [
            "examples/recipes/virtual-react-entry.ts",
            "examples/table/definitions.ts",
            "examples/table/data.ts",
            "examples/table/review-feature.ts",
            "examples/table/grid-interaction.ts",
            "examples/table/virtual-layout.ts",
          ],
        },
        "examples/table/virtual-react.ts",
        "react",
      ),
    ],
  }),
  recipe({
    id: "relative-time-details",
    heading: "Relative Time details",
    purpose: "Add supplementary UTC and local-time details to standalone relative text.",
    applicationInputs: ["An explicit instant, locale and destination for complete details."],
    ownership: [
      "Relative Time owns elapsed text and its refresh timer. Hover Card owns supplementary preview behavior; the anchor retains navigation.",
    ],
    cleanup: htmlCleanup,
    accessibility: [
      "Focus or hover opens the preview. Escape closes it. The destination repeats essential date details for touch and keyboard users without requiring a popup.",
    ],
    references: [
      "notes/decisions/relative-time-component.md",
      "notes/alignment/inventory/overlays-help.md#o-05-hover-card",
    ],
    deviations: [
      "The preview is noninteractive. Time details remain available in visible content.",
    ],
    examples: [
      example("relative-time-details", {
        h: "UTC and local time",
        html: '<acme-hover-card><a href="#time-record"><acme-relative-time date="2026-09-23T12:00:00Z"></acme-relative-time></a><acme-data-list slot="content"><dl><dt>UTC</dt><dd data-utc></dd><dt>Local time</dt><dd data-local></dd></dl></acme-data-list></acme-hover-card><p id="time-record">Recorded at <time datetime="2026-09-23T12:00:00Z">23 September 2026, 12:00 UTC</time>. <span data-visible-local></span></p>',
        script:
          'const date=new Date("2026-09-23T12:00:00Z");root.querySelector("[data-utc]").textContent=date.toISOString();const local=new Intl.DateTimeFormat(undefined,{dateStyle:"full",timeStyle:"long"}).format(date);root.querySelector("[data-local]").textContent=local;root.querySelector("[data-visible-local]").textContent="Local time: "+local;',
      }),
    ],
  }),
  recipe({
    id: "document-navigation",
    heading: "Adjacent-document navigation",
    purpose: "Navigate between related documents with real links and no results-page state.",
    applicationInputs: ["Previous and next titles and hrefs; either destination may be absent."],
    ownership: [
      "The labelled native navigation landmark and its anchors own navigation. Stack owns arrangement.",
    ],
    cleanup: htmlCleanup,
    accessibility: [
      "Tab reaches only available destinations. Visible Previous/Next labels describe direction. First and last documents omit the unavailable link.",
    ],
    references: ["notes/alignment/inventory/documentation-tooling.md#documentation-units"],
    deviations: [
      "The documentation shell may persist this region and reserve clearance. The content recipe itself uses ordinary flow layout.",
    ],
    examples: [
      example("document-navigation", {
        h: "Previous and next documents",
        html: '<nav aria-label="Adjacent documents"><acme-stack flex-direction=\'{"compact":"column","expanded":"row"}\' justify-content="space-between" gap="4"><a href="/components/input"><span>Previous: </span>Input</a><a href="/components/field"><span>Next: </span>Field</a></acme-stack></nav>',
      }),
    ],
  }),
  recipe({
    id: "measurement-cards",
    heading: "Measurement cards",
    purpose: "Arrange subjects and measurements with ordinary layout.",
    applicationInputs: ["Subject titles, measured values and responsive column choices."],
    ownership: [
      "Card groups subject content; Stat gives measurements their meaning; Grid controls placement.",
    ],
    cleanup: htmlCleanup,
    accessibility: [
      "Headings identify each subject. Stat retains term and value relationships; visual columns preserve reading order.",
    ],
    references: ["notes/alignment/inventory/surfaces.md#required-recipes-and-migration-mapping"],
    deviations: ["A fixed arrangement is composed instead of adding a metric-list or tile API."],
    examples: [
      example("measurement-cards", {
        h: "Project measurements",
        html: '<acme-simple-grid columns=\'{"compact":1,"expanded":2}\' gap="4"><acme-card><acme-card-header><acme-heading as="h3">Production</acme-heading></acme-card-header><acme-card-body><acme-stat><acme-stat-label>Requests</acme-stat-label><acme-stat-value>1200</acme-stat-value></acme-stat></acme-card-body></acme-card><acme-card><acme-card-header><acme-heading as="h3">Preview</acme-heading></acme-card-header><acme-card-body><acme-stat><acme-stat-label>Requests</acme-stat-label><acme-stat-value>42</acme-stat-value></acme-stat></acme-card-body></acme-card></acme-simple-grid>',
      }),
    ],
  }),
  recipe({
    id: "measurement-rows",
    heading: "Progress and measurement rows",
    purpose: "Show completion or bounded measurements inside descriptive list content.",
    applicationInputs: ["Labels, current values, totals and completion meaning."],
    ownership: [
      "List owns list semantics; Item arranges description; Progress owns completion semantics and Meter owns a bounded measurement.",
    ],
    cleanup: htmlCleanup,
    accessibility: [
      "Each measurement has a label and readable value. Progress means work completion, while Meter means a measured range.",
    ],
    references: ["notes/alignment/inventory/surfaces.md#required-recipes-and-migration-mapping"],
    deviations: ["No interactive row or selection owner is added."],
    examples: [
      example("measurement-rows", {
        h: "Delivery and capacity",
        html: '<acme-list marker="none"><ul><li><acme-item><acme-item-content><acme-item-heading>Import completion</acme-item-heading><acme-progress label="Import completion" value="60"></acme-progress><acme-item-description>60 percent complete</acme-item-description></acme-item-content></acme-item></li><li><acme-item><acme-item-content><acme-item-heading>Storage capacity</acme-item-heading><acme-meter label="Storage used" value="72" max="100"></acme-meter><acme-item-description>72 of 100 GB used</acme-item-description></acme-item-content></acme-item></li></ul></acme-list>',
      }),
    ],
  }),
  recipe({
    id: "task-rows",
    heading: "Application task rows",
    purpose: "Display a command and an application-owned action result.",
    applicationInputs: ["Command text, task label and the application's action handler."],
    ownership: [
      "Item and List arrange content. Snippet owns copying. The application owns actions and status; no command is executed by this recipe.",
    ],
    cleanup: "Call the returned cleanup to remove the action listener before removing the example.",
    accessibility: [
      "Copy and Record completion remain separate keyboard actions. The live output announces completion.",
    ],
    references: ["notes/alignment/inventory/surfaces.md#required-recipes-and-migration-mapping"],
    deviations: ["The example records a local status only; it is not a task runner."],
    examples: [
      example("task-rows", {
        h: "Command and result",
        html: '<acme-list marker="none"><ul><li><acme-item orientation="vertical"><acme-item-content><acme-item-heading>Install dependencies</acme-item-heading><acme-snippet text="bun install"></acme-snippet></acme-item-content><acme-item-actions><acme-button>Record completion</acme-button><output aria-live="polite"></output></acme-item-actions></acme-item></li></ul></acme-list>',
        script:
          'const button=root.querySelector("acme-button");const record=()=>{root.querySelector("output").textContent="Completion recorded locally.";};button.addEventListener("click",record);return ()=>button.removeEventListener("click",record);',
      }),
    ],
  }),
  recipe({
    id: "checkbox-rows",
    heading: "Checkbox rows",
    purpose: "Combine a checkbox with a label and supporting description.",
    applicationInputs: ["Field label, help, submitted name and checked state."],
    ownership: [
      "Field owns label and description associations. Checkbox owns checked state and native form value.",
    ],
    cleanup: htmlCleanup,
    accessibility: [
      "Space toggles the focused Checkbox. Field supplies its accessible name and description.",
    ],
    references: ["notes/alignment/inventory/surfaces.md#required-recipes-and-migration-mapping"],
    deviations: ["There is no second row selection state or click handler."],
    examples: [
      example("checkbox-rows", {
        h: "Notification choice",
        html: '<acme-field><span slot="label">Product announcements</span><acme-checkbox name="announcements"></acme-checkbox><span slot="help">Receive a message when new features are available.</span></acme-field>',
      }),
    ],
  }),
];

export function recipeDocs(): Doc[] {
  return recipes.map((record) => ({
    id: record.id,
    title: record.heading,
    lede: record.purpose,
    examples: record.examples.map((value) => value.example),
    practices: {
      "Application inputs": [...record.applicationInputs],
      Ownership: [...record.ownership],
      Cleanup: [record.cleanup],
      "Keyboard and accessibility": [...record.accessibility],
      "Reference adaptations": [...record.deviations],
    },
  }));
}

export const docStates: readonly DocStateRecord[] = [
  {
    name: "settings-submitted",
    exampleId: "settings-rows-account-settings",
    expectedOutcome:
      "Toggle Email updates off and submit. Output reads Saved locally: email off, security on.",
    verification: "browser-verified",
    evidence: "notes/alignment/evidence/m23-docs/recipes-results-2026-09-26.json",
  },
  {
    name: "integration-action",
    exampleId: "integration-cards-connected-integration",
    expectedOutcome:
      "Activate Manage integration. Output reads Manage requested and the URL fragment does not change.",
    verification: "browser-verified",
    evidence: "notes/alignment/evidence/m23-docs/recipes-results-2026-09-26.json",
  },
  {
    name: "metric-selected",
    exampleId: "stat-selectable-statistics",
    expectedOutcome:
      "Select Errors using the keyboard. Radio Group value is errors and output names the selected metric.",
    verification: "browser-verified",
    evidence: "notes/alignment/evidence/m23-docs/recipes-results-2026-09-26.json",
  },
  {
    name: "file-branch-collapsed",
    exampleId: "tree-view-file-tree-recipe",
    expectedOutcome:
      "Focus src and collapse it with the backward arrow. index.ts is hidden and inert while package.json remains reachable.",
    verification: "browser-verified",
    evidence: "notes/alignment/evidence/m23-docs/recipes-results-2026-09-26.json",
  },
  {
    name: "confirmation-enabled",
    exampleId: "alert-dialog-typed-confirmation",
    expectedOutcome:
      "Enter DELETE. Delete project enables; activating it records confirmation, closes the dialog and returns focus to its trigger.",
    verification: "browser-verified",
    evidence: "notes/alignment/evidence/m23-docs/recipes-results-2026-09-26.json",
  },
  {
    name: "confirmation-retry",
    exampleId: "alert-dialog-failure-and-retry",
    expectedOutcome:
      "First Save keeps the dialog open and exposes the failure. Second Save closes it.",
    verification: "browser-verified",
    evidence: "notes/alignment/evidence/m23-docs/recipes-results-2026-09-26.json",
  },
  {
    name: "page-size-changed",
    exampleId: "pagination-position-and-page-size",
    expectedOutcome:
      "Choose 25 from the page-size control. pageSize becomes 25, page becomes 1 and position text reflects the new page count.",
    verification: "browser-verified",
    evidence: "notes/alignment/evidence/m23-docs/recipes-results-2026-09-26.json",
  },
  {
    name: "time-details",
    exampleId: "relative-time-details-utc-and-local-time",
    expectedOutcome:
      "UTC text equals 2026-09-23T12:00:00.000Z. Local text in the preview equals the visible local-time text. Escape closes an opened preview.",
    verification: "browser-verified",
    evidence: "notes/alignment/evidence/m23-docs/recipes-results-2026-09-26.json",
  },
  {
    name: "responsive-list-detail",
    exampleId: "responsive-panes-list-and-detail",
    expectedOutcome:
      "At compact width the navigation and detail stack in DOM order. At expanded width they occupy two tracks. Links reach the named detail headings without horizontal page overflow.",
    verification: "browser-verified",
    evidence: "notes/alignment/evidence/m23-docs/recipes-results-2026-09-26.json",
  },
  {
    name: "responsive-support",
    exampleId: "responsive-panes-supporting-pane",
    expectedOutcome:
      "At compact width the supporting aside follows main content; at expanded width it sits beside it. Both headings and definitions remain readable.",
    verification: "browser-verified",
    evidence: "notes/alignment/evidence/m23-docs/recipes-results-2026-09-26.json",
  },
  {
    name: "task-recorded",
    exampleId: "task-rows-command-and-result",
    expectedOutcome:
      "Activate Record completion. The output says Completion recorded locally. No shell command or network request executes.",
    verification: "browser-verified",
    evidence: "notes/alignment/evidence/m23-docs/recipes-results-2026-09-26.json",
  },
  {
    name: "virtual-cells",
    exampleId: "table-tanstack-virtual",
    expectedOutcome:
      "Scroll vertically and horizontally. The rendered cells follow the virtual window and preserve row/column labels and the logical active cell.",
    verification: "browser-verified",
    evidence: "notes/alignment/evidence/m23-docs/recipes-results-2026-09-26.json",
  },
  {
    name: "react-virtual-cells",
    exampleId: "virtualized-table-react-virtualized-table",
    expectedOutcome:
      "The React virtual consumer renders native table cells, updates the window on scrolling and releases its root and virtualizer subscriptions on removal.",
    verification: "browser-verified",
    evidence: "notes/alignment/evidence/m23-docs/recipes-results-2026-09-26.json",
  },
];

export const docCensus: readonly DocCensusRecord[] = [
  {
    fixtureId: "book",
    configId: "tools/geist/census/book.config.json",
    referenceRevision: "5ae1f7a27d90d87e7e77dad20964541146444564",
    recordedOn: "2026-09-10",
    status: "historical",
    referenceSourceRevision: "not-recorded",
    resultFiles: [
      "tools/geist/census/book.geist.json",
      "tools/geist/census/book.ours.json",
      "tools/geist/census/book.dark.geist.json",
      "tools/geist/census/book.dark.ours.json",
    ],
    acceptedDifferences: ["notes/analysis/book-census-config.md"],
    limitations:
      "The revision identifies the saved repository measurement files, not an upstream source release. This is the dated parity-port record, not a measurement of the current implementation. The record documents icon element defaults and the hidden reference image twin. Current component acceptance is separate.",
  },
];
