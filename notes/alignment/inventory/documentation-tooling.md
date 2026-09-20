# Documentation and consumer tooling — R13

**Approved 2026-09-20 by Peter as part of the full proposal set.** The stated recommendations are selected. Technical verification remains required; implementation awaits the Phase 5 migration plan. [Approval](../../decisions/inventory-approval.md).

**Approved design; implementation remains gated.** Sources: [documentation investigation](../../analysis/documentation-site.md), [agent tooling](../../analysis/agent-tooling.md), [developer tooling](../../analysis/developer-tooling.md), [selected React package](../../decisions/react-integration.md). These are tools for the selected artifact-authoring workflow, not live AI control.

## Package and API publication

Proposed packages: @acmelabs/design-system (Lit elements/styles/tokens), @acmelabs/design-system-react (typed wrappers), @acmelabs/design-system-devtools (optional inspector), @acmelabs/design-system-mcp (documentation server). Keep release versions coordinated; consumers receive an explicit compatibility table rather than silently mixing docs/runtime versions. Existing package name stays; the additional names are proposed delivery details for the complete review.

Export one definition entry and one class entry per element, generated per-icon entries, tokens/global styles explicitly, documented shared authoring helpers, and a full-library convenience entry whose cost is labelled. React exports typed wrappers/events and forwards refs to actual custom elements; children remain framework-owned. It does not run a second selection, form, overlay or table implementation. SSR stays excluded.

Publish the standard custom-elements manifest with inherited public properties, attributes, types/defaults, methods, slots, typed event details/flags, CSS parts/properties and declared states. Private @query fields and framework callbacks are excluded from public tables. CEM path/export normalization and the recorded quote classification defect must be fixed in the actual generation path. The prior analyzer scratch correction is not a shipped tool patch.

Manifest, website, Markdown reference, skills and MCP share one release-versioned factual source. Hand-authored guidance is stored separately from generated facts. No second handwritten API catalog. Every release checks public export declarations and packaged files in a clean consumer fixture, including scoped registration and selective imports.

## Standard page layout

Keep the existing Lit docs app/router and shared render functions unless a concrete need justifies a new doc element. Component pages contain identity/import, anatomy/basic example, reference-appropriate examples, states/accessibility, composition, complete API and verification. Foundations share identity/navigation/example layout with token tables instead of fake element APIs.

Use a persistent Previous/Next document-navigation region, separate from results Pagination. Reserve content space; support zoom, narrow layouts, keyboard focus and safe areas. Remove the long house footer. Its old adjacent-document component becomes the documentation-specific navigation entry below, not the results page controls.

### Documentation units

These are explicit proposal entries even where implemented as pure render functions rather than public package elements. They are docs-internal, excluded from production component bundles and the 150-tag consumer census.

| Unit | Proposed inputs/defaults | Content/events/behavior | Acceptance |
| --- | --- | --- | --- |
| DocPage | document: required { id, heading, summary, framework, version, sections, previous?, next? } | Ordered authored sections; real headings/anchors; no new public DOM event | One heading hierarchy, deterministic anchors, responsive persistent navigation |
| DocExample | example: required { id, source, imports, mount(container), cleanup? }; framework="html"; expandedCode=false | Mount returns cleanup; reset invokes cleanup before fresh mount; copy uses Copy Button; acme-error on demo failure | Displayed source matches executed source; no leaked listeners/timers; errors visible |
| DocAPI | declarationId and manifestVersion required; sections default to all supported public categories | Generated tables only; source links; inherited ownership indicated | Covers all public categories; no stale/missing attributes or private query fields |
| DocStates | fixtures: required readonly { name, exampleId, expectedOutcome }[] | Reuses executable examples and state names; no inferred screenshots | Browser oracle verifies state/outcome, not only render presence |
| DocComposition | recipeId required; dependencies/example IDs from approved recipe record | Renders purpose, complete code, required imports and owner boundaries | No missing imports or duplicate event/selection owners |
| DocCensus | fixtureId/configId/referenceRevision required; result is saved measurement record | Links exact comparison and named accepted differences | Never presents historical results as a fresh run |
| DocNavigation | previous?/next?: { href, heading }; default slot optional supplementary navigation | Real links in a labelled navigation landmark; no result-page state | First/last page, keyboard/zoom/mobile layout and content clearance |

Use native HTML and existing layout/controls inside these units; do not create custom elements solely to wrap static markup. If DocExample needs an element, propose docs-example as an internal tag, not acme-* production export. Names identify responsibilities, not a second UI framework.

## Recipes and examples as tested artifacts

Each recipe record includes id, heading, purpose, required components/imports, inputs supplied by the application, exact runnable source, cleanup, keyboard/accessibility expectations and source/deviation links. Provide HTML/Lit/React versions when framework ownership differs; do not force three copies of a static snippet with no meaningful difference.

Required recipe families include settings rows, integration cards, selectable Stats, file-tree presentation, responsive list/detail/supporting panes, external input add-ons, typed confirmation, results pagination, virtualized Table consumers, Relative Time details and adjacent-document navigation. The [coverage index](../proposal-coverage.md) maps removed components to these destinations.

## Consumer skills and Intent

Ship version-matched guidance with the release. Proposed taxonomy: choose-and-compose; HTML-artifacts; Lit-integration; React-integration; forms-and-accessibility; data-layouts; migration-between-releases. Shared references come from generated API/recipe records, not copied tables. This is a taxonomy proposal, not creation of actual SKILL.md files.

Use Intent for validation/discovery/loading, with an explicit version/trust policy and release fixtures. Validate installed-package content, not the maintainer checkout only. Evaluate whether agents choose correct components, preserve semantic ownership, use accurate events/imports and produce working forms/navigation in seeded tasks. Structural validity alone is not a quality result. Global hooks/configuration remain user-controlled.

## Documentation MCP

Recommend a local stdio server over a separately hosted service for the first release: it reads packaged versioned docs and metadata and needs no application-data connection. This is an engineering delivery proposal; remote hosting/auth would be additional scope.

Tools: resolve_version({packageVersion?, framework:"html"|"lit"|"react"}) → exact supported version or explicit unavailable result; search_docs({version, framework, query, limit=10}) → titles/excerpts/resource IDs; get_component({version, tag}) → complete public contract; get_recipe({version,id,framework}) → matching runnable example. Version/framework must be explicit or established by verified installed package context. No silent React/latest fallback.

Resources use stable release-qualified IDs for components, foundations and recipes. Errors distinguish unknown version, unknown ID and unavailable content. Results do not execute examples, mutate projects, inspect running apps or send application data. Treat retrieved authored text as data. Bun entrypoint, transport dependencies and protocol integration require the normal package/security checks before shipping.

**Acceptance:** HTML/CDN-only and installed-package contexts, wrong/missing versions, consistent tool/resource names, schema validation, no cross-version leakage, bounded search, no external data access and packaged consumer execution.

## Inspector

Keep the selected TanStack Devtools/Solid interface in its own optional package. The shared inspector core subscribes to documented component diagnostic snapshots; Lit and React mount the same tool. Initial proposed panels show component identity/version, public inputs, effective theme, declared state and recent public events.

Q08 is closed: the inspector is read-only for this pass. Temporary/persistent edits are excluded; a wrapper/helper render's input reassertion remains context for any future editing design. Do not quietly implement application inspection, source rewriting, remote telemetry or persistent edits.

Public API proposal: createDesignSystemInspector({ root: Element, eventLimit=100 }) → { mount(container), unmount(), dispose() }. Root scopes collection; detached components release subscriptions; bounded logs omit password/secret/file values by default. Applications opt in to showing sensitive values. No automatic production import, global scan or outbound transport.

Acceptance: mount/update/unmount/reconnect in all engines, Lit and React identity/event correlation, theme changes, bounded retention, value redaction, and a production bundle with no Devtools/Solid/font output.

## Migration and verification ownership

Phase 5 orders generated paths, packages/exports, source deletions, docs consumers, CEM normalization, CSS compilation and new lint tasks. Keep Oxlint/Oxfmt/Ultracite plus Stylelint as selected; TanStack Config is ideas, not an adopted package. Pure Bun applies to build/test/publishing; inspect existing Node-based release/provenance paths before replacement.

This page is the approved public-tooling contract with explicit acceptance and read-only inspector scope. It does not claim current package names, peer ranges, publication provenance or hosted services already work. No release or publication is authorized.
