# Documentation and consumer tooling — R13

**Status: approved contract.** Peter approved the complete proposal set on 2026-09-20. The stated recommendations are selected; explicitly recorded later resolutions are incorporated below. [Approval](../docs/decisions/0049-inventory-approval.md). Verification evidence retains its original date and scope.

**Current consumer-tooling contract.** Sources: [documentation investigation](../docs/research/09-documentation-site.md), [agent tooling](../docs/research/01-agent-tooling.md), [developer tooling](../docs/research/08-developer-tooling.md), [selected React package](../docs/decisions/0081-react-integration.md). These are tools for the selected artifact-authoring workflow, not live AI control.

## Package and API publication

Five coordinated packages serve consumers: @acmelabs/design-system (Lit modules/types/styles/tokens), @acmelabs/design-system-browser (browser module graph, bundles, styles and notices), @acmelabs/design-system-react (typed wrappers), @acmelabs/design-system-devtools (optional inspector), and @acmelabs/design-system-mcp (documentation server). An explicit compatibility table prevents silent docs/runtime version mixing.

The 2026-09-20 proposal listed four packages. The [2026-10-20 browser-distribution decision](../docs/decisions/0010-browser-distribution-package.md) adds the fifth after npm rejected the combined core 0.3.0 archive at 185,977 files. Core and browser share one source/build/runtime; core excludes browser-only output and browser has an explicit delivery allowlist. Every archive must fit the 60,000-entry project budget. The [guard](../scripts/package-contents.ts) validates gzip and uses the pinned npm installation's strict tar parser with npm-equivalent entry counting. This is a project threshold, not npm's exact limit. The old 0.3.0 tag, archives and published companions remain immutable; 0.3.1 recovery and later release state belong to release records.

Export one definition entry and one class entry per element, generated per-icon entries, tokens/global styles explicitly, documented shared authoring helpers, and a full-library convenience entry whose cost is labelled. React exports typed wrappers/events and forwards refs to actual custom elements; children remain framework-owned. It does not run a second selection, form, overlay or table implementation. SSR stays excluded.

Publish the standard custom-elements manifest with inherited public properties, attributes, types/defaults, methods, slots, typed event details/flags, CSS parts/properties and declared states. Private @query fields and framework callbacks are excluded from public tables. CEM path/export normalization and the recorded quote classification defect must be fixed in the actual generation path. The original scratch correction did not establish production integration. Current generation must preserve the actual corrected classification and publication mapping; [M03 metadata evidence](../docs/verification/systematization/m03-manifest-2026-09-20.json) and later acceptance record the implemented scope.

Manifest, website, Markdown reference, skills and MCP share one release-versioned factual source. Hand-authored guidance is stored separately from generated facts. No second handwritten API catalog. Every release checks public export declarations and packaged files in a clean consumer fixture, including scoped registration and selective imports.

## Standard page layout

Keep the existing Lit docs app/router and shared render functions unless a concrete need justifies a new doc element. Component pages contain identity/import, anatomy/basic example, reference-appropriate examples, states/accessibility, composition, complete API and verification. Foundations share identity/navigation/example layout with token tables instead of fake element APIs.

Use a persistent Previous/Next document-navigation region, separate from results Pagination. Reserve content space; support zoom, narrow layouts, keyboard focus and safe areas. The long footer is replaced by that document-navigation region. Its old adjacent-document component becomes the documentation-specific navigation entry below, not the results page controls.

### Documentation units

These are explicit approved units even where implemented as pure render functions rather than public package elements. They are docs-internal, excluded from production component bundles and the 150-tag consumer census.

| Unit | Inputs/defaults | Content/events/behavior | Acceptance |
| --- | --- | --- | --- |
| DocPage | document: required { id, heading, summary, framework, version, sections, previous?, next? } | Ordered authored sections; real headings/anchors; no new public DOM event | One heading hierarchy, deterministic anchors, responsive persistent navigation |
| DocExample | example: required { id, source, imports, mount(container), cleanup? }; framework="html"; expandedCode=false | Mount returns cleanup; reset invokes cleanup before fresh mount; copy uses Copy Button; acme-error on demo failure | Displayed source matches executed source; no leaked listeners/timers; errors visible |
| DocAPI | declarationId and manifestVersion required; sections default to all supported public categories | Generated tables only; source links; inherited ownership indicated | Covers all public categories; no stale/missing attributes or private query fields |
| DocStates | fixtures: required readonly { name, exampleId, expectedOutcome }[] | Reuses executable examples and state names; no inferred screenshots | Browser oracle verifies state/outcome, not only render presence |
| DocComposition | recipeId required; dependencies/example IDs from approved recipe record | Renders purpose, complete code, required imports and owner boundaries | No missing imports or duplicate event/selection owners |
| DocCensus | fixtureId/configId/referenceRevision required; result is saved measurement record | Links exact comparison and named accepted differences | Never presents historical results as a fresh run |
| DocNavigation | previous?/next?: { href, heading }; default slot optional supplementary navigation | Real links in a labelled navigation landmark; no result-page state | First/last page, keyboard/zoom/mobile layout and content clearance |

Use native HTML and existing layout/controls inside these units; do not create custom elements solely to wrap static markup. If DocExample needs an element, docs-example is the selected internal tag scope; it is not an acme-* production export. Names identify responsibilities, not a second UI framework.

## Recipes and examples as tested artifacts

Each recipe record includes id, heading, purpose, required components/imports, inputs supplied by the application, exact runnable source, cleanup, keyboard/accessibility expectations and source/deviation links. Provide HTML/Lit/React versions when framework ownership differs; do not force three copies of a static snippet with no meaningful difference.

Required recipe families include settings rows, integration cards, selectable Stats, file-tree presentation, responsive list/detail/supporting panes, external input add-ons, typed confirmation, results pagination, virtualized Table consumers, Relative Time details and adjacent-document navigation. The [coverage index](component-coverage.md) maps removed components to these destinations.

## Consumer skills and Intent

Ship version-matched guidance with the release. Selected taxonomy: choose-and-compose; HTML-artifacts; Lit-integration; React-integration; forms-and-accessibility; data-layouts; migration-between-releases. Shared references come from generated API/recipe records, not copied tables. The original taxonomy approval did not itself create skill files. Published consumer skills are distinct from the maintainer skills removed by the workflow migration.

Use Intent for validation/discovery/loading, with an explicit version/trust policy and release fixtures. Validate installed-package content, not the maintainer checkout only. Evaluate whether agents choose correct components, preserve semantic ownership, use accurate events/imports and produce working forms/navigation in seeded tasks. Structural validity alone is not a quality result. Global hooks/configuration remain user-controlled.

## Documentation MCP

The first-release delivery is a local stdio server rather than a separately hosted service: it reads packaged versioned docs and metadata and needs no application-data connection. This is the selected delivery scope; remote hosting/auth remains additional scope.

Tools: resolve_version({packageVersion?, framework:"html"|"lit"|"react"}) → exact supported version or explicit unavailable result; search_docs({version, framework, query, limit=10}) → titles/excerpts/resource IDs; get_component({version, tag}) → complete public contract; get_recipe({version,id,framework}) → matching runnable example. Version/framework must be explicit or established by verified installed package context. No silent React/latest fallback.

Resources use stable release-qualified IDs for components, foundations and recipes. Errors distinguish unknown version, unknown ID and unavailable content. Results do not execute examples, mutate projects, inspect running apps or send application data. Treat retrieved authored text as data. Bun entrypoint, transport dependencies and protocol integration require the normal package/security checks before shipping.

**Acceptance:** HTML/CDN-only and installed-package contexts, wrong/missing versions, consistent tool/resource names, schema validation, no cross-version leakage, bounded search, no external data access and packaged consumer execution.

## Inspector

The optional inspector uses the selected TanStack Devtools UI components and Solid in its own package. The [2026-09-26 package refinement](../docs/decisions/0026-design-system-devtools.md#scoped-tanstack-devtools-ui--2026-09-26) selects @tanstack/devtools-ui instead of the shell that always mounted whole-page inspection and exposed SEO/Marketplace destinations. Lit and React share one observer/UI; no global settings writes or second behavior/state implementation is added. The shared inspector core subscribes to documented component diagnostic snapshots; Lit and React mount the same tool. Panels show component identity/version, public inputs, effective theme, declared state and recent public events.

Q08 is closed: the inspector is read-only for this pass. Temporary/persistent edits are excluded; a wrapper/helper render's input reassertion remains context for any future editing design. Do not quietly implement application inspection, source rewriting, remote telemetry or persistent edits.

Public API: createDesignSystemInspector({ root: Element, eventLimit=100 }) → { mount(container), unmount(), dispose() }. Root scopes collection; detached components release subscriptions; bounded logs omit password/secret/file values by default. Applications opt in to showing sensitive values. No automatic production import, global scan or outbound transport.

Acceptance: mount/update/unmount/reconnect in all engines, Lit and React identity/event correlation, theme changes, bounded retention, value redaction, and a production bundle with no Devtools/Solid/font output.

## Migration and verification ownership

The completed migration ordered generated paths, packages/exports, source deletions, docs consumers, CEM normalization, CSS compilation and lint integration. Keep Oxlint/Oxfmt/Ultracite plus Stylelint as selected; TanStack Config is ideas, not an adopted package. Pure Bun applies to build/test/publishing. The original migration required inspecting then-existing Node-based release/provenance paths before replacement; current source ownership and verification guidance own operational commands.

This specification defines tooling scope and acceptance. Manifests own exact versions/peer ranges; release records own publication provenance. Hosted services remain outside scope. The original approval granted design scope, not publication; this specification creates no new release authorization.

## Package declaration and delivery constraints

Individual component-class and icon-record declarations remain available. Six closed artwork export patterns resolve through their symbol records; exact definition and registration exports share the corresponding empty or registration-function interfaces and import real public component/icon type indexes. Definition-only consumers retain native tag inference. Declaration-only aggregation imports follow those indexes; declaration maps do not point to absent package source. This trades more TypeScript declaration loading for selective runtime loading, keeps invalid runtime entry names invalid in types, and avoids an 8 MB export map. The 2026-10-20 projections of about 55,400 core and 54,900 browser files were estimates; actual archive counts and clean consumer checks remain required. [Distribution decision](../docs/decisions/0010-browser-distribution-package.md).
