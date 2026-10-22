# Selected package roles

Read this guide before selecting, changing or removing a dependency. Use the package selected for the capability. Adapt its vanilla interface to Lit when needed.

## Runtime and application responsibilities

Versions and dependency placement belong to the [core manifest](../../packages/core/package.json), [workspace manifest](../../package.json), package manifests and lockfile. This table records responsibilities, not a second version inventory.

| Capability | Selected owner |
|---|---|
| Components and context | Lit and `@lit/context` |
| Canonical state | TanStack Store through `@tanstack/lit-store`; shared render/effect adapters follow [component guidance](components.md#interfaces-and-state) |
| Motion | `@lit-labs/motion`, with the approved motion and reduced-motion contracts |
| Placement | `@floating-ui/dom` |
| Overlay modality and presentation | Native dialog and Popover API; `focus-trap` supplies Tab containment and `tabbable` supplies tab-stop support |
| Scroll lock | `@zag-js/remove-scroll` in its isolated selected role |
| Dates | Exact patched `@internationalized/date` through the private shared runtime |
| Numbers | Published `@internationalized/number` utility within the complete Number Input implementation |
| ComboBox ranking | Published `match-sorter` |
| Command Menu ranking | Existing vendored command-score implementation; the ComboBox selection does not replace it |
| Hotkeys | `@tanstack/lit-hotkeys` |
| Rate limiting and debouncing | `@tanstack/pacer` |
| Syntax highlighting | `@tanstack/highlight` |
| Markdown | `@tanstack/markdown` |
| Charts | `@tanstack/charts`; `d3-scale` supplies the directly used UTC scale |
| Managed forms | `@tanstack/lit-form` and application `@tanstack/react-form` examples; applications own their form state and native form integration |
| Table processing | Application-owned `@tanstack/table-core` with Lit/React Table adapters and optional experimental workers; the design-system Table does not run it |
| Virtualization | `@tanstack/lit-virtual` and `@tanstack/react-virtual` in applications/examples |
| Flow layout and routing | ELK, with its delivered worker and Lit viewer |
| Interaction and roving focus | Authored Interaction and RovingTabindex controllers |
| React integration | `@lit/react` and the authored bridge wrap the same Lit behavior; React and ReactDOM remain peers |

Native Lit behavior ports use the selected state, motion, style and utility stack. Zag can supply source evidence; its component machine, interpreter and state runtime are not adopted. The selected scroll-lock utility keeps its separate role.

Application React examples can use React Store. They do not replace the wrapped component's canonical Lit state. Application page state and data loading remain separate from navigation and presentation. Query/DB is deferred scope. The [server-rendering decision](../decisions/0092-server-rendering.md) retains the browser-only product scope.

## Authoring and delivery tools

| Capability | Selected owner |
|---|---|
| Runtime and tests | Bun; see [verification](../agents/verification.md) for the enforced runtime policy |
| Documentation routing | `@lit-labs/router`; supporting platform compatibility dependencies stay manifest-owned |
| Template compilation and declarations | `@lit-labs/compiler` and TypeScript |
| Public API metadata | Custom Elements Manifest analyzer with the repository's semantic normalization |
| CSS compilation | Lightning CSS through the shared style pipeline |
| Lint, formatting and CSS checks | Oxlint, Oxfmt, Ultracite, Stylelint and PostCSS Lit |
| Editor template checks | The configured Lit/TypeScript plugins |
| Real-browser and unit fixtures | Playwright and Happy DOM, with different verification scope |
| Archive reporting | Pinned npm tooling invoked by Bun; this does not select Node as the project runtime |
| Locale and artwork data | Pinned CLDR sources and Material Symbols SVG sources, with their licenses |
| Consumer-skill validation/discovery | `@tanstack/intent` development tooling |
| Documentation/API MCP | `@modelcontextprotocol/sdk` and `zod` in the optional Bun server |
| Inspector | `@tanstack/devtools-ui` and `solid-js` in the optional devtools package |

Intent does not replace artifact-quality evaluations or implement the MCP server. Its [decision](../decisions/0048-intent-tooling.md) records the probe limits. Reference systems do not authorize importing their runtime packages. TanStack Config practices are recommendations, not adoption of another package or automation system.

## Changes to the stack

A selected package is not removed merely because an import scan is empty. Check its approved role and actual consumers. Preserve the existing declaration and dependency patches through the owning build and package checks.

For a genuine complex capability gap, use brain:source-driven-development to research maintained options and current official evidence. Compare suitable packages before implementing the capability from scratch. The current user-choice workflow owns any unresolved selection; this guide adds no separate interview or approval procedure.

Delivery paths and production dependency boundaries belong to the [repository map](../agents/repository.md). Package changes need the applicable consumer and release checks from [verification guidance](../agents/verification.md).
