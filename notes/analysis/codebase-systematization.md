# Codebase analysis for the systematization pass

Phase 1.1 investigation completed for review on 2026-09-19. The evidence combines a whole-source mechanical inventory, deeper reads of the shared implementation and affected families, and focused browser reproductions. It is not exhaustive interaction testing of all 150 elements. No element disposition or implementation change follows automatically from a row.

## Current baseline

An AST walk using the installed TypeScript compiler read every non-test, non-stylesheet TypeScript file under `src/`.

| Measure | Current reading | Method |
|---|---|---|
| Registered elements | 150 | Actual `@customElement(...)` decorators, excluding comments |
| Public property declarations | 780 in 138 files | Actual `@property(...)` declarations; inherited properties are counted at their declaration |
| TanStack-backed local fields | 129 in 52 files | Actual `@atomState(...)` decorators |
| Lit `@state` declarations | 0 | AST walk; the apparent text match is a comment |
| Non-test TypeScript files excluding `*.styles.ts` | 164 | Filesystem census |
| `*.styles.ts` files under `src/` | 166 | Filesystem census, including shared families |
| Floating UI positioning call sites | 6 across 6 elements | Source scan plus import/call-site inspection |

Do not repeat the earlier claim that 147 local fields still need moving off Lit state. The existing `src/shared/atom-state.ts` is an implemented TanStack adapter. Comments are not declarations; regex counts overstate its use by two occurrences.

Installed versions: Lit 3.3.3; Floating UI DOM 1.8.0; internationalized/date 3.12.4; lit-labs/motion 1.1.0; lit-labs/router 0.1.4; TanStack charts 0.16.2, highlight 0.0.10, lit-form 1.25.5, lit-hotkeys 0.11.0, lit-store 0.13.2, lit-virtual 3.14.0, markdown 0.0.13, and pacer 0.22.0. These readings come from installed package manifests, not just package.json ranges.

The existing minified bundle is 1,339,348 bytes (315,589 bytes under Bun gzip); the standalone bundle is 1,540,694 bytes (324,488 gzip). `tokens.css` is 267,541 bytes (26,565 gzip). These files were last written on 2026-09-10, so they are saved-artifact measurements, not a fresh build or browser performance result. The previously listed `package-lock.json` and `src/components/book.zip` are absent. The subsequent [build investigation](build-performance.md) and [repository-layout survey](repository-layout.md) complete that Phase 1 research; actual implementation acceptance remains gated.

## Findings

| Location | Category | Issue | Occurrences |
|---|---|---|---|
| `src/components/copy-button/copy-button.ts:55`, `:72`, `:107` | Reactive state | The derived store reads a plain Lit property (`copied`) alongside a TanStack atom (`done`). Changing `copied` after the first render leaves the derived value and rendered class stale in a focused reproduction. | 1 reproduced element; wider scope unverified |
| `docs-src/api.ts:33` | Documentation contract | The extractor reads declared class members only. Its tables omit properties available at runtime through inheritance or accessors. | 32 missing property entries across menu-button, multi-select, and search |
| `docs-src/api.ts:45` | Documentation contract | The extractor invents kebab-case for default attribute names; Lit lowercases the property name without inserting hyphens. Stat's `meterLabel` is documented as `meter-label`, but its runtime attribute is `meterlabel`. | 1 current mismatch |
| `scripts/split-css.ts:13`, `:189`, `:208` | Generated ownership | The splitter reads `src/geist.css`, appends `src/generated/theme.css`, and skips families owned by maps. It does not invoke the map generator. The generated-file tables obscure these distinct writers. | 1 pipeline with distinct inputs |
| `src/components/calendar/calendar.ts:31`, `:192`, `:265` | Mandated integration | Calendar performs date arithmetic with native Date and placement with hand-written viewport geometry. It imports neither internationalized/date nor Floating UI. | 1 element, 2 package responsibilities |
| `src/components/markdown/markdown.ts:18`; `src/shared/highlight.ts:15` | Duplicated configuration | Markdown creates its own highlighter and language set rather than using the shared one. The language sets differ. | 2 configurations |
| `src/components/fieldset/fieldset.ts:97` | Container semantics | The element renders a div, heading, content, status, and actions; its name does not establish native fieldset/legend semantics. Phase 2 must establish whether form grouping is a required capability. | 1 current element |
| `src/components/card/card.ts:9`; `src/components/panel/panel.ts:27`; `src/components/entity/entity.ts:75` | Container shape | Card is a styled default slot; Panel adds heading/sub/head/actions/footer; Entity is a row with li/button/div semantics and left/right/footer slots. Shared appearance does not make these identical interfaces. | 3 implementations inspected in full |

## Reproductions and limits

For the copy button, load `scripts/test-setup.ts`, import its source module, mount a bare element, and await `updateComplete`. Initial `copied`, derived value, and rendered `.copied` class are all false. Set `el.copied = true` and await again: the property becomes true, while the derived value and rendered class remain false. Returning the property to false leaves both false. Existing tests cover `copied` present at mount and the clipboard path; they do not cover this property transition (`copy-button.test.ts:32`). **Confirmed in isolated Chrome 153:** a real button click changes the property to true while the fixture's rendered-state output stays false.

For documentation, run `readApi()`, import the source elements in the same environment, finalize each registered Lit class, and compare its `elementProperties` map against the extracted entries. Exclude internal-state entries. This compares 809 effective property entries; the AST declaration count is a different measure because inherited properties appear on each runtime class. Of the missing entries, 21 belong to menu-button, 10 to search, and 1 to multi-select.

Lit documents the lowercase default and inherited property options at <https://lit.dev/docs/components/properties/#observed-attributes>. This confirms the docs extractor's mismatch independently of its own implementation. The source and current runtime disagree; no naming redesign is required to establish the defect.

## Shared work and divergence

The class/slot/event scan covers all 150 component source files. [Composition candidates](../alignment/evidence/composition-candidates.json) is the searchable evidence, not an approved element inventory. Sixty classes declare no named method except render; arrow fields, getters, inherited behaviour and template handlers mean this is a review filter, not proof that sixty elements can be deleted.

The strongest existing shared implementations are `AcmeElement`, Interaction, RovingTabindex, Places, the atomState/StoreEffect adapters, dialog reset, highlighting and form binding. [Lit controllers](https://lit.dev/docs/composition/controllers/) provide the lifecycle mechanism those helpers already use. Preserve that investment. A new abstraction should remove repeated responsibilities rather than add a second way to do them.

The main clusters for later design are:

- **Form controls:** repeated form-value, validity, disabled-state, reset, label and event logic. Real Chrome verifies that input reset restores its initial value and FormData. It also verifies that an empty required acme-input leaves the outer form valid while its inner native input is invalid. Input.updated (`input.ts:105`) forwards value but not validity. Inside a disabled fieldset, the host matches `:disabled` while the inner input remains enabled. These are distinct lifecycle responsibilities, not a missing date or animation package.
- **Placement and motion:** six independently owned Floating UI lifecycles, manual Calendar placement, and separate overlay exit timers. Keep anchor and focus-policy differences explicit when designing a controller. Do not use the unused Overlay base class as evidence that the responsibility is already shared.
- **Slot presence:** most relevant elements use Places, but Input still owns its four-place map and observer (`input.ts:71`, `:84`). Any unification must preserve attached-versus-inside precedence and late slot changes. The old notes overstate how complete this consolidation is.
- **Containers and recipes:** Card, Panel, Entity and Fieldset have different content and semantic responsibilities. Panel's heading/sub/head/actions/footer is a promising composition target; Entity's li/button/div choice is a real semantic distinction. Names are resolved in Phase 2 before changing code.
- **Docs and public metadata:** the current docs schema omits supported properties, methods and styling contracts. A generated manifest is a shared contract for consumers, docs and agents, not only an editor convenience.

Community/reference comparison: [Web Awesome's component page layout](https://github.com/shoelace-style/webawesome/blob/next/packages/webawesome/docs/_layouts/component.njk) exposes dependencies and full manifest-derived contracts; [Lion's package](https://github.com/ing-bank/lion/blob/master/packages/ui/package.json) separates class imports and registration; [Material Tabs](https://github.com/material-components/material-web/blob/main/docs/components/tabs.md) documents propagation and accessibility relationships. These support explicit contracts and composition without copying another library's internal framework choices.

## Generator and source ownership

`GeistMap` in `tools/geist/gen.ts:61` contains real composition concepts: children, parts, extends, context, slotted nodes and host mirrors. `writeStyles` at line 1823 follows extended mappings and emits the generated module. The systematization must update this metadata alongside the element interface; a rename in TypeScript alone would regenerate stale styles.

Hand-authored CSS still appears in element modules, including Select's tiny-size treatment and Book's motion overrides. The current source therefore does not fully meet the standing generator-ownership rule. Inventory these rules during the migration, distinguish host adaptation from source-system values, and give both a generator-owned input. Do not mechanically remove them: their behavioural reasons are recorded in decisions.

## Recommendations and verification bar

Prioritize the public contract and shared responsibilities: manifest accuracy, form lifecycle, state bridging, placement, motion and icon ownership. Design the primitive interfaces against the composing elements' needs, then replace complete arrangements. A broad rename before those decisions would preserve duplicated behaviour under tidier names.

All 608 existing tests pass. The focused browser failures explain why passing that suite is not the endpoint. Carry these fixtures into the later browser tier. Final element dispositions, architecture seams and all source changes remain for Phases 2–6; this review does not start them.

## Phase 1 extension: ComboBox overflow

[Decision: wrap complete names](../decisions/combobox-long-labels.md). Source: combobox-option.ts:135–146 uses a truncating label wrapper for plain text but inserts rich content directly into the flex row. The docs' twoLine helper (docs-src/pages/components/combobox.ts:12–13) supplies an unbroken name inside a padded flex column.

A real Chrome probe opened the “Inside a Sheet with multi-line options” example. The list was 288px wide; the option row was 276px wide with 8px horizontal padding, but its rich content was about 360.4px wide and the row scroll width was 368px. min-width:0 alone left text overflowing (row scroll width 360px). Adding overflow-wrap:anywhere reduced row scroll width to 276px and increased label height from 20 to 40px. Restoring the original style restored the overflow. All changes were transient DOM experiments; the browser page/server were closed.

[Material Web md-item](https://github.com/material-components/material-web/blob/main/labs/item/internal/_item.scss) gives text its own flex/overflow container. Chakra's ComboBox recipe assigns a flexible itemText region; Radix's styled Select uses fixed row sizing, while its Primitive allows custom item content. These sources support an explicit content contract, not a universal claim that every reference wraps arbitrary rich labels.

The final fix must go through the generator and handle icons, chosen indicators, long tokens, narrow widths, RTL and all required browser engines. The single Chrome probe is not implementation certification. [Measurements](../alignment/evidence/additional-probes-2026-09-19.json).

## Phase 1 extension: Table compatibility

[Peter requests consumer compatibility with all TanStack Table functionality](../decisions/tanstack-table-compatibility.md). The application owns TanStack Table, its data processing, state and workers. Our Table supplies presentation, structure and interaction/measurement access. No house TanStack Table integration or runtime dependency is selected. Earlier adapter proposals misread the request; this clarification supersedes them.

src/components/table/table.ts currently imports TanStack Virtual only. Its Column shape is key/label/numeric/width/render over record rows. Selection uses numeric row indices. The missing TanStack Table import is not a defect; restrictive rendering/layout contracts are the compatibility issue.

The investigated Table packages were version 9.2.4. The [feature guide](https://tanstack.com/table/latest/docs/guide/features) and actual framework renderers distinguish:
- Cell selection and spanning.
- Column faceting, filtering, grouping, ordering, pinning, resizing, sizing and visibility.
- Global filtering.
- Row aggregation, expansion, pagination, pinning, selection and sorting.

These 17 stock feature areas need a complete consumer compatibility/combination checklist. Features, row models and function registries are separate; importing stockFeatures does not automatically configure every row model. Application examples must cover client and manual server processing. Peter explicitly chose TanStack Virtual for both Lit and React virtualization. Experimental worker use is included in the consumer compatibility target, with its upstream status retained; worker management stays in the application.

The Lit renderer consumes Lit-compatible values; React FlexRender consumes React nodes/components. Consumers retain their own framework's rendering; a React-to-Lit cell bridge is not selected. Table's Store dependency versions differ from our current installed integration, which matters for example/test setup, not a mandate to add Table to the library. Do not mix v8 guide snippets with v9 APIs without checking published types/source.

No complete consumer compatibility test was implemented. [Pagination investigation](documentation-site.md#results-pagination-capability) records the selected reusable results controls separately from document links.

### Follow-up source inspection, still incomplete

The current table.ts was read in full. Specific constraints are now located: the limited column contract is at line 9; index-based selection at :67 and :123–136; fixed row-height virtualization at :70–95 and :147–157; cell fallback at :99–101; and non-keyed row rendering at :139–144 and :177. Row/select events at :105 and :125 bubble but omit composed. These facts need an explicit future contract; they are not newly approved interface decisions.

Published npm metadata for 9.2.4 reports table-core using @tanstack/store ^0.11.1; lit-table using table-core 9.2.4 and lit-store ^0.14.1, with Lit ^3.1.3 and @lit/context ^1.1.0 peers; react-table using table-core 9.2.4 and react-store ^0.11.1, with React >=18. **9.2.4 is the investigated baseline, not a user-selected future pin.** Reconcile dependency versions for consumer examples/checks. The packages were downloaded to a temporary directory and their SHA-512 integrity values matched registry metadata; none was installed into the project.

Read the main-branch feature tree and [stockFeatures.ts](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/stockFeatures.ts). They identify the 17 feature areas listed above. The feature aggregate does not itself select all row models or function registries.

Read the actual framework renderers and Lit lifecycle implementation:

- [Lit TableController](https://github.com/TanStack/table/blob/main/packages/lit-table/src/TableController.ts) creates a core table with Lit reactivity, stages options during render, exposes a render snapshot and selector-based updates, publishes external state after the host update, and unsubscribes/re-subscribes on disconnect/reconnect. The controlled-state lifecycle requires a browser probe; passing rows through a wrapper does not prove it works.
- [Lit flexRender](https://github.com/TanStack/table/blob/main/packages/lit-table/src/flexRender.ts) accepts Lit-compatible values and directly calls function renderers. Its FlexRender helper distinguishes cell/header/footer and aggregated cells; placeholders render no content.
- [React FlexRender](https://github.com/TanStack/table/blob/main/packages/react-table/src/FlexRender.tsx) renders components through React, including function/class and memo/forward-ref cases. Calling such components directly from Lit would not preserve their React execution contract. Consumer-rendered content needs explicit context, updates, identity and cleanup checks.
- The Lit experimental-worker entry only re-exports the core plugin. Later inspection read the published core createTableWorker and createWorkerRowModel implementations; their limitations are below.

The first reads used main. Follow-up reading of published 9.2.4 TableController.js, Lit flexRender.js and React FlexRender.js confirms the lifecycle/rendering behaviour described above. Published resizing, pinning, spanning and pagination declarations and pagination utilities were also read. This is a targeted source comparison, not a byte-for-byte audit of every file. Main-branch examples remain separately identified in the [saved evidence](../alignment/evidence/table-review-2026-09-19.json).

The renderer, layout, pagination, selection, grouping/totals and custom-extension findings have now been walked through with Peter. The queued Table research walkthrough is complete; the capability/acceptance checklist below carries the work into later design and verification. This is not a completed integration or exhaustive source audit. Do not turn consumer state/worker responsibilities into house implementation tasks. Phase 3 architecture has not started.

### Consumer rendering and cell structure

The [Lit basic example](https://github.com/TanStack/table/blob/main/examples/lit/basic-table-controller/src/main.ts) lets the application render keyed headers, rows, cells and footers using its TableController and FlexRender. [Chakra's TanStack example](https://github.com/chakra-ui/chakra-ui/blob/main/apps/compositions/src/examples/table-with-tanstack.tsx) uses native table descendants under its styled root; its sample still uses older v8 names, so it is structural evidence, not a v9 template. Chakra's table.tsx styles those descendants through its native option. [Radix Table](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/table.tsx) exposes native table sections/cells under a scrolling root. These are references for consumer control, not a selected house DOM design.

Our Table must permit grouped headers, custom cell/footer content, merged cells, omitted covered cells, expanded rows, pinning regions, interaction handlers, accessibility attributes and element references. A cell-content callback alone cannot express that full structure. React consumers keep React rendering; Lit consumers keep Lit rendering. Final native markup, custom-element parts, slots and style delivery remain for architecture/inventory review.

Published cell-spanning types require skipping a covered cell, not emitting a zero rowspan: HTML rowspan=0 spans to the end of the row group. Column spans do not cross pinning regions; row spans do not cross page, pinned-section, row-tree-position or grouped-row boundaries. The [Lit spanning example](https://github.com/TanStack/table/blob/main/examples/lit/cell-spanning/src/main.ts) composes spanning with filtering, sorting, visibility, pagination and cell selection. Its presence is not proof that every combination has passed with our component.

### Resizing, pinning and virtualization

Read the relevant Lit examples in full, plus the published 9.2.4 feature declarations:

- [Performant resizing](https://github.com/TanStack/table/blob/main/examples/lit/column-resizing-performant/src/main.ts) updates CSS width variables from the application's sizing subscription instead of rebuilding all body cells per drag tick. Consumers need width control over headings/cells/table, event targets for handles, and a way to update measured values. Published modes support during-drag and end-of-drag commits and an explicit RTL direction. Example declarations are not approval to bypass our generator for shipped styles.
- [Sticky pinning](https://github.com/TanStack/table/blob/main/examples/lit/column-pinning-sticky/src/main.ts) applies logical start/end offsets, widths, backgrounds and layering to header/body cells. [Split pinning](https://github.com/TanStack/table/blob/main/examples/lit/column-pinning-split/src/main.ts) renders separate start/centre/end tables. Published row pinning exposes top/centre/bottom groups and an application option controlling visibility after filtering/paging. Keep both arrangements under evaluation; no single house structure is chosen.
- [Virtual rows](https://github.com/TanStack/table/blob/main/examples/lit/virtualized-rows/src/main.ts) use the application's scrolling-element reference and row measurement calls. [Virtual columns](https://github.com/TanStack/table/blob/main/examples/lit/virtualized-columns/src/main.ts) adds horizontal measurement, omitted-column space and remeasurement after sizing changes. Both use TanStack Virtual. They establish the access needed, not a measured performance or accessibility pass; sample stress-test labels are not benchmark results.
- [Chakra sticky heading/column composition](https://github.com/chakra-ui/chakra-ui/blob/main/apps/compositions/src/examples/table-with-sticky-header-and-column.tsx) controls scrolling, backgrounds and overlapping layers. Its table recipe exposes a sticky offset. Material Web's complete main tree has data-table tokens and a testing/table fixture, but no production Table/Pagination implementation identified. Its inspected TestTable displays component-state examples; it is not a production data grid.

Local constraints: table.ts:70–95 and :147–157 assume a window virtualizer and fixed 40/30px row sizing. table.styles.ts places horizontal overflow on its private root, sets table width to 100%, forces cell nowrap, stripes by DOM position, and aligns the last column right. These defaults need review under consumer-controlled widths, hidden columns, pinned sections and virtual rows. The current component offers no documented access contract for the internal table, scrolling root or row measurement targets.

Acceptance cases must combine pinned-column resizing while scrolling; column visibility/order changes; variable-height and expanded rows; spanning boundaries; focus/selection preservation; and RTL. Check normal HTML-table and any alternative CSS layout semantics in Chromium, Firefox and WebKit. No new runtime prototype or combined browser test ran in this follow-up.

### Experimental workers remain consumer-owned

The [official worker guide](https://github.com/TanStack/table/blob/main/docs/guide/worker-row-models.md) calls the plugin a proof of concept outside its stable API, aimed at expensive browser-held datasets. Its rough 100k-row suggestion is upstream guidance, not a house performance threshold. Filtering/grouping/sorting can run in a worker; pagination and ordinary selection remain on the main thread. Offloaded stages must form a contiguous pipeline prefix. The guide limits source data to flat rows and processing functions to thread-portable definitions.

Published createTableWorker.js confirms that worker error handlers log an error, mark the bridge failed, terminate the worker and leave its last results without continued updates. createWorkerRowModel.js returns a pre-stage model until results exist and warns about missing upstream stages in development. terminate is explicit; later reads can restart work. No runtime failure-recovery test was performed, and the complete worker internals were not audited.

Peter's later clarification makes all of this the consuming application's responsibility. The house Table must allow consumers to update displayed rows and show their loading/error/recovery controls. It must not create or manage workers itself. Consumer examples/checks may exercise that route with an experimental label; they do not make upstream processing guarantees.

### Selection, grouping and custom extensions

The final three queued topics were reviewed in Plan mode after the fourth capture. Published 9.2.4 row-selection, row-aggregation, column-grouping, row-expanding, cell-selection, faceting, global-filtering and TableFeatures declarations were read, with targeted row-selection utility code. Main-branch Lit selection/grouped-aggregation examples, React custom-plugin and Chakra Table selection were also read. [Source checkpoint](../alignment/evidence/table-review-2026-09-19.json). No new Table browser probe ran.

**Selection:** the application supplies selected state by stable record identity. Current table.ts:67 and :123–141 uses numeric positions, so reordering/replacing the supplied rows can transfer a checkmark to a different record. This conclusion follows from the source; it was not newly reproduced in a browser. TanStack's selected-ID map and selected-row models serve different purposes: selected IDs can persist while a row is absent, but a row model can only return rows available in its input. Server-wide selection of unloaded records remains an application responsibility.

Support consumer choice between current-page and all-matching-available-row selection, single/multiple selection, per-row eligibility, parent/child selection and mixed checkbox states. TanStack's [selection example](https://github.com/TanStack/table/blob/main/examples/lit/row-selection/src/main.ts) connects native checkbox events; [Chakra's example](https://github.com/chakra-ui/chakra-ui/blob/main/apps/compositions/src/examples/table-with-selection.tsx) owns selection in the application and supplies row styling/checkbox handlers. Neither establishes a universal house select-all policy.

Published row_getToggleSelectedHandler reads event.target.checked and uses the range-event predicate; default range selection checks Shift on the event/nativeEvent. Our Checkbox's acme-change (checkbox.ts:64–67) carries only checked, so that event alone loses modifier information. Native/composed click access and correct checked-value timing still need a tested connection. Do not infer that all click information is inaccessible. Preserve selection and focus through sorting, filtering, paging and virtualization.

Cell selection is distinct from row selection. Its published contract supports included/excluded rectangular ranges, selected-edge styling, focused-cell/tabindex access and original mouse/modifier events. It exposes movement/extension methods; the consumer connects keyboard interaction. Covered/merged cells require appropriate range bounds. Clipboard serialization is explicitly application-owned. The house content/event/style contract must allow these capabilities without duplicating the selection engine.

**Grouping and totals:** support application-supplied nested group rows, expand/collapse controls, counts, ordinary values, computed cells, subtotal and footer content. Intentionally empty grouping placeholders must remain empty; table.ts:99–101 currently converts empty/null/undefined cell results to an em dash. Its fixed row and single-footer-row shapes also need review. The application chooses custom grouping values, grouping column visibility/order, summary functions and the rows they summarize.

The [Lit grouped-aggregation example](https://github.com/TanStack/table/blob/main/examples/lit/grouped-aggregation/src/main.ts) combines grouping with filtering/sorting/expansion/pagination and footer calculations. Published aggregation types support scalar or keyed multiple results, custom functions, chosen row sets/depth and externally supplied values. The Table displays them; it does not recalculate the application or server's results. Published paginateExpandedRows permits children to count toward pages or remain with their parent and exceed the nominal page size. Accommodate both without choosing application policy.

**Custom extensions:** the [React custom-plugin example](https://github.com/TanStack/table/blob/main/examples/react/custom-plugin/src/main.tsx) adds density state and methods, then renders the resulting spacing. Published TableFeatures permits custom feature registration, state/options/APIs, metadata, function registries and row-model factories. These stay in the application. The house contract provides custom content, supported styling/state indicators, original interactions and measurement access. Consumers retain their data types and framework rendering. A bespoke extension should not require a matching house plugin registration. No promise is made that every imaginable future UI can be supported without new component capability.

Faceting supplies unique values/counts or numeric limits for application filter controls; other filters can affect that information. Global filtering applies application-chosen matching across eligible columns. The Table must accommodate those controls and render the returned rows without taking over filtering or data fetching.

### Capability checklist for later acceptance

All 17 investigated stock feature areas are covered by these requirement groups; custom extensions, server data and workers add cross-cutting cases:

- Cell selection and cell spanning: correct range/edge/focus presentation, event access, omission of covered cells and span boundaries under changed rows/columns.
- Column faceting, column filtering and global filtering: application-owned controls/counts, custom filter values and externally changed results; no local refiltering of server data.
- Column grouping and row aggregation: nested group structure, empty placeholders, custom/multiple summaries, footer content and server-supplied results.
- Column ordering, pinning, resizing, sizing and visibility: headers/body/footer agree after changes; logical sides, measurement and widths work with scrolling/virtualization.
- Row expanding, pagination, pinning, selection and sorting: stable identity and focus, selectable/expanded/pinned combinations, both expanded-row paging policies, known/unknown totals and consumer-controlled reset behaviour.
- Custom extensions: an application-defined feature works in both Lit and React with filtering, sorting and pagination; data/types remain application-owned.
- Experimental workers: application-provided pending/error/recovery presentation and data updates work; the library does not manage workers or guarantee their processing behaviour.

This is the research checklist, not a runnable test suite or completed Phase 4 inventory. Exact interfaces, defaults, accessibility details and the final combination matrix are designed in the scheduled later phases. Require browser verification in Chromium, Firefox and WebKit before claiming compatibility. The later foundation follow-up is in design-foundations.md; do not restart the Table walkthrough.

## Interaction cancellation and cleanup

The 2026-09-19 foundation follow-up read Interaction in full and inspected the relevant Drawer, Slider and Button handlers. These findings belong to the later implementation/verification work; source code remains unchanged.

- **Temporary listener retention, reproduced synthetically:** Interaction.attach adds window pointerup/pointercancel handlers after pointerdown, but detach only runs the element-listener cleanup list. A Bun probe imported the actual Interaction class with synthetic EventTargets. After pointerdown there was one listener of each type; after hostDisconnected both remained; after a later pointerup both were removed. This proves the missed teardown path in that fixture, not a measured long-running browser leak. Put temporary listeners under lifecycle cleanup and verify disconnect, disabled-state changes and cancelled input in browsers.
- **Drawer cancellation can take the release path, source evidence:** drawer.ts binds pointercancel to onPointerUp and touchcancel to onTouchEnd. Both can reach end(), which can dismiss after sufficient displacement/velocity. Verify a cancelled gesture restores an appropriate resting state rather than being treated as a deliberate completed swipe. No new browser reproduction ran.
- **Slider cancellation can emit a commit, source evidence:** slider.ts:256–258 routes pointercancel to onPointerUp; :269–280 emits acme-commit when lastDrag exists. It also listens on window without an initiating-pointer-ID guard in the inspected move path. The final contract must distinguish live value changes, deliberate completion and cancellation, then test competing pointers, loss of capture, disable/disconnect and keyboard input. No global rollback rule is selected by this research.
- **Button state consistency needs verification:** button.ts:173–185 renders href mode as an anchor, with aria-disabled based on disabled only and no aria-busy. The native button path uses disabled || loading and aria-busy for loading. The class has no activation-cancelling click handler for the anchor, while Interaction suppresses visual states only. Inspect/test actual keyboard and pointer activation before claiming disabled/loading parity between modes. This is a source finding, not a browser-certified failure.

The reference comparison is in [foundation analysis](design-foundations.md#interaction-and-theme-follow-up). Correct causes in source/generator when the approved migration reaches them; do not add workarounds now. Preserve combined selected/focused/pressed feedback, native text selection/scrolling and each widget's focus/dismissal contract. [Probe and source evidence](../alignment/evidence/foundation-followup-2026-09-19.json).

## Phase 2 message family

Reviewed 2026-09-19. [Disposition review](../alignment/phase-2-review.md) and [evidence index](../alignment/evidence/message-family-review-2026-09-19.json) preserve decisions and limits. These are source/documentation findings, not new browser acceptance results.

### Scope and current code

Peter's [diagram](</Users/peterkloss/Documents/toast-vs-alert-vs-banner.png>) supports the existing distinction: Toast is a brief recent-action result in a corner overlay; Alert is inline within a section/form/block; Banner is a persistent page/app notice across the top. Error describes meaning, not a separate placement category. Individual-input validation is a separate association requirement. The diagram does not specify all ARIA semantics or prove community prevalence.

- `src/components/note/note.ts`, render: local inline message, optional label/icon/action and several meanings. Rename to Alert remains decided. Its current `role="note"` is an implementation fact, not approval for the final announcement contract.
- `src/components/banner/banner.ts`, render: a link-oriented promotional message. It changes into one button below its fixed 961px breakpoint. There is no general dismissal interface in this class. The selected Banner concept is broader; the inventory must resolve content, actions, dismissal and responsive treatment.
- `src/components/toast/toast.ts:69–105,145–206`: timed/retained messages with optional actions; hover stops a timer and leaving hover starts a full new timer. Action presence currently chooses `alertdialog` rather than `status`. These are existing mechanisms, not selected final timing/announcement rules. The previously selected house overlapping-Toast direction and its verification obligations stand.
- `src/components/error-card/error-card.ts`: error logging and optional retry inside a red surface. The already-decided deletion stands; its existence does not justify a separate message category.
- `src/components/project-banner/project-banner.ts`: project-wide notice with a link or action. The already-decided deletion stands; this scope belongs to Banner.

### Feedback comparison and decision

The current `src/components/feedback/feedback.ts:100–175` combines trigger and inline presentations, optional email/topics, fixed product topics and several form settings. Lines 238–257 build a payload including page URL and browser information; lines 279–303 validate and POST to the configured endpoint; lines 261–275 provide a success state and delayed close. This is a collecting form, not a notification sent to the user.

The saved [Geist Feedback description](../../tools/geist/corpus/md/feedback.md) provides opinion-plus-text examples. It is a local reference snapshot; no new live Geist parity check ran.

The initial proposal was recipe-only, based on the fixed-arrangement rule and composed-form examples from [Chakra Popover](https://chakra-ui.com/docs/components/popover#form) and [Radix Popover](https://www.radix-ui.com/themes/docs/components/popover). Peter asked whether both forms could be useful and requested broader research. The broader evidence supports several valid models:

- [Semrush FeedbackForm](https://developer.semrush.com/intergalactic/components/feedback-form/feedback-form-api) is a composed component with form items, buttons, notice and success parts. Its [FeedbackRating pattern](https://developer.semrush.com/intergalactic/patterns/feedback-rating/feedback-rating) builds on it, and the API also exposes a preconfigured rating form. Published `@semcore/feedback-form` 17.2.3, dated 2026-09-10, uses their shared controls and Final Form. This is a concrete example of a component and larger patterns; it does not select Final Form for us.
- [Cloudscape user feedback](https://cloudscape.design/patterns/general/collect-user-feedback/) supplies composed examples with a link, expandable section or embedded form. It covers loading, submitted and error states, focus and announcements. It separates sentiment submission from optional additional questions; that timing policy is reference evidence, not automatically adopted.
- Published [Atlassian feedback-collector](https://www.npmjs.com/package/@atlaskit/feedback-collector) 16.11.2, dated 2026-09-17, exposes FeedbackForm and FeedbackCollector. The inspected form types accept an application `onSubmit`; the collector adds service-specific submission and context. Its documentation URL returned an Oops page, so the package declarations and collector source were inspected instead. No service-specific collector or optimistic-success policy is proposed for the house library.
- [e-INFRA Feedback Form](https://design-system.e-infra.cz/docs/components/compounds/feedback-form) is a complete form with an asynchronous submit callback and success/error states. Its particular yes/no fields and automatic-close policy are not selected.
- [Material Web's introduction](https://material-web.dev/about/intro/) demonstrates native-form composition. The full [Lit Dialog source](https://github.com/material-components/material-web/blob/main/dialog/internal/dialog.ts) was inspected: content/action slots and method=dialog submission support provide a composition reference. This is not a complete ready-made Feedback implementation.

This bounded survey does not establish a community-wide winner. Peter selected [component plus examples](../decisions/feedback-component.md): rebuild Feedback from shared house controls, demonstrate inline and pop-up use, and leave sending data to the application. The consistent common form experience is worth an additional public interface. Exact fields, defaults, cancellation/reset, error recovery and submission-state ownership details still require inventory work and tests.

### Error and field validation

`src/components/error/error.ts:28–41` exposes label, size and an error object with message/action/link, always renders an atomic alert and opens its generated action link in a new tab. Input (`input.ts:149–169`), Textarea (`textarea.ts:73–94`), Select (`select.ts:171–188`) and Destructive Modal (`destructive-modal.ts:120–145`) consume it. Thus its current uses span input validation and operation failures.

Select explicitly connects its message with `aria-describedby`. The inspected Input and Textarea render paths do not make that explicit connection. This source finding does not establish a tested screen-reader outcome. The current Error host also uses `display: contents`; that implementation need not survive removal.

[Chakra Field](https://chakra-ui.com/docs/components/field) supplies ErrorText alongside labels and help text; [Chakra Alert](https://chakra-ui.com/docs/components/alert) supports section/feature messages with an error status. [Material Web Text Field](https://material-web.dev/components/text-field/#validation) supports native constraint validation and manually supplied error text. Its [Lit source](https://github.com/material-components/material-web/blob/main/textfield/internal/text-field.ts) connects inputs/textarea to a description at lines 588, 626 and 661, and routes errors through its field. These are distinct responsibilities even when they share visual primitives.

Peter selected [removing standalone Error](../decisions/message-context-and-errors.md). Keep field validation associated with the input; use the three message types by context. Small, plain treatments and recovery actions remain supported needs. Exact public properties, validation timing, focus and live-announcement policies are not settled by this disposition. Browser and assistive-technology verification must cover these associations later.

### Empty State and the composition rule

`src/components/empty-state/empty-state.ts:19–26,54–65` supplies title/description strings and slots, optional icon/actions, a border setting and a secondary treatment. Its title and description use divs. The generated styles fix horizontal padding at 70px, constrain text width to 340px and couple the secondary background to smaller title text. These are review inputs, not accepted final conventions. The [generator map](../../tools/geist/maps/empty-state.ts) is the input to revise during migration, not the generated stylesheet.

The saved [Geist reference](../../tools/geist/corpus/md/empty-state.md), [Chakra Empty State](https://chakra-ui.com/docs/components/empty-state) and [Ant Design Empty](https://ant.design/components/empty) offer named components. Material Web's inspected [all-component entry point](https://github.com/material-components/material-web/blob/main/all.ts) has no corresponding entry; this is a bounded catalogue observation, not a claim about every Material implementation.

Chakra's [actual component source](https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/components/empty-state/empty-state.ts) separates root/content/indicator divs, an h3 title and a paragraph description. Its [style recipe](https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/theme/recipes/empty-state.ts) supplies shared root width, centred content, indicator colour and size-dependent padding, gaps and typography. The component file contains no dedicated interaction state machine. The first guessed .tsx path returned 404; listing the directory located the .ts source, which was read completely.

The initial recipe-only proposal followed the earlier rule because the house component adds arrangement rather than a distinct interaction. Peter challenged that reasoning. After the Chakra source comparison and clarification of what “recipe” meant, he accepted [keeping Empty State with shared parts and examples](../decisions/empty-state-component.md). Predictable structure and appearance also have value for agents. [The composition record](../decisions/composition-over-count.md) now recognizes this accepted case and Feedback without automatically retaining other arrangements.

Empty State explains absent content; it is not a fourth notification level. Its exact slots, heading level mechanism, responsive sizes, visual treatments and dynamic announcements remain for the inventory. Chakra's names, React structure and exact style values are references, not chosen house APIs. In Chakra, “recipe” means style configuration; in our glossary it means a documented arrangement of components.

## Phase 2 container family

Source and reference survey on 2026-09-19, followed by the Card and Fieldset choices. Peter selected one flexible Card and favoured rebuilding Fieldset for form grouping. At this initial survey Entity/Item was unanswered; the later joint review below selects a focused Item family. The initial plan's description of all eight elements as equivalent bordered containers is too broad; the source establishes several purposes that need separate treatment.

### Current purposes

- `src/components/card/card.ts:6–12`: a visual surface with one content slot and raised/flat/feature variants; no header/body/footer interface.
- `src/components/panel/panel.ts:27–35`: a content surface with heading, subtitle, time annotation, header actions, body and footer. Chart/tight/danger/error/warning settings mix content-specific concerns and appearance.
- `src/components/link-card/link-card.ts:20–23`: one anchor containing heading, description and optional badge. This is a candidate for Card's navigation use, subject to a deliberate interaction/content contract.
- `src/components/entity/entity.ts`: a two-column row with optional footer, rendered as li/button/div. It provides descriptive content and end controls rather than the same structure as Card. Its left/right slot names also differ from the settled start/end vocabulary. Button mode can receive interactive slotted children; the later semantics review must examine nested controls instead of copying that arrangement blindly.
- `src/components/item/item.ts:22–26`: a row with leading content, title link, metadata, tags, amount, actions and chevron. It overlaps Entity's row purpose. Peter subsequently selected [one focused Item family](../decisions/item-content-family.md); exact interfaces and compositions remain inventory work.
- `src/components/tile/tile.ts:18–23`: a label, qualifier and value. Its purpose belongs in the forthcoming Stat comparison rather than automatic Card replacement.
- `src/components/setting-row/setting-row.ts:18–20`: heading/description paired with a control. Field-label association and whether this needs a named component remain to investigate.
- `src/components/fieldset/fieldset.ts`: a settings-card layout with manual slot assignment, title/subtitle/messages and footer/status/actions. The rendered root is a div, not a native fieldset; disabled inserts a Disabled Wall and keeps the footer active. This inspection does not establish group-disable semantics for slotted controls. Separate the desired form-grouping concept from the existing presentation before selecting its disposition.

All eight component source files were read completely. Related child families, browser semantics and consumer usage have not yet been exhaustively audited.

### Reference comparison

- [Chakra Card](https://chakra-ui.com/docs/components/card) groups one subject using root/header/body/footer, with title and description parts. It demonstrates forms and horizontal content. The [full component source](https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/components/card/card.tsx) supplies styled div parts and a title rendered as h3; it is a composed structure. This supports a flexible named Card, without selecting Chakra's exact React shape or style values.
- [Radix Card](https://www.radix-ui.com/themes/docs/components/card) is a general content/action surface. Layout primitives arrange its contents; asChild allows native link/button presentation and Inset provides edge-aligned media. These React mechanisms are reference evidence, not a selected Lit implementation.
- [Ant Design Card](https://ant.design/components/card) groups one subject and exposes title, body, extra content, cover, actions, metadata and tab configuration. Its much wider interface is a useful comparison, not a reason to move unrelated tab/data responsibilities into our Card.
- [Web Awesome Card](https://webawesome.com/docs/components/card) is a web component with optional media/header/footer and action slots. Its documented horizontal form currently excludes header/footer and has a separate actions slot. Its SSR-only with-* properties are outside our chosen scope. The slot model is useful evidence, but neither those restrictions nor all those names are adopted.
- The saved [Geist Entity](../../tools/geist/corpus/md/entity.md) reference describes up to two columns and demonstrates rows in a list with controls. The saved [Geist Fieldset](../../tools/geist/corpus/md/fieldset.md) reference describes a bordered settings card with optional footer actions. Both snapshots were read in full; no new live Geist parity result is claimed.
- Material Web has [Labs Card source](https://github.com/material-components/material-web/blob/main/labs/card/internal/card.ts). The full base implementation contains elevation, background, a content slot and outline; its directory includes elevated, filled and outlined forms. The [Labs README](https://github.com/material-components/material-web/blob/main/labs/README.md) explicitly marks these features experimental and not recommended for production. The stable all-component entry inspected earlier omits them; that must not be mistaken for absence of a Lit implementation. No Material Labs dependency is selected.

Across the four named general-purpose libraries above, Card is the name for a related-content surface. This bounded survey supports Card over Entity for that concept; it is not adoption-weighted market research. Entity's row purpose remains a separate disposition question.

### Selected direction and remaining decisions

Peter selected [one canonical Card](../decisions/canonical-card.md) for a related-content surface, replacing the overlapping Card/Panel/Link Card interfaces through shared primitives and useful content/action sections. Keep row, statistical-value and form-grouping questions separate; do not automatically turn every current element into a Card or delete it as a recipe.

The alternative was a basic Card plus specialized Panel/Link Card interfaces. One Card favours predictable names and shared behaviour; specialized components favour dedicated configuration at the cost of overlapping public interfaces. Exact parts, properties, navigation/activation semantics, nesting, heading rules and visual values remain for the later inventory.

The later Stat and comprehensive Group sections below now supply that follow-up; return to the deferred row question with the newly selected Field and List responsibilities. No source edits, package installation, browser acceptance or completed migration is implied by this survey.

### Fieldset form grouping and compatibility

The complete current Fieldset and Disabled Wall sources were read. `src/components/fieldset/fieldset.ts:87–115` renders a div-based settings card, optionally inserts `acme-disabled-wall`, and exposes content/footer slots. `src/components/disabled-wall/disabled-wall.ts` renders an aria-hidden visual overlay. A source search found form-associated house controls but no `formDisabledCallback` implementation under src. These findings do not establish a browser failure or that an overlay disables every input; they identify verification and implementation work.

[Chakra Fieldset documentation](https://chakra-ui.com/docs/components/fieldset) separates group label, content, help/error text and disabled behaviour from Card. Its [source](https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/components/fieldset/fieldset.ts), read fully, wraps Ark Fieldset/Legend and related parts. The documentation distinguishes group-invalid from the invalid state of each contained field. No Chakra or Ark runtime is adopted.

[W3C grouping guidance](https://www.w3.org/WAI/tutorials/forms/grouping/) describes meaningful grouping using fieldset/legend or an appropriately named ARIA group, including separate individual labels. [Material Web Radio documentation](https://material-web.dev/components/radio/) supplies a radio-specific labelled group pattern; that does not define all general form groups. The actual [Radio source](https://github.com/material-components/material-web/blob/main/radio/internal/radio.ts) and [form-associated behaviour](https://github.com/material-components/material-web/blob/main/labs/behaviors/form-associated.ts) were read completely. Radio uses the form-associated mixin, whose disabled callback assigns the disabled property. This is useful platform evidence, not proof that copying the assignment preserves every house control's independently configured disabled state. The initially guessed internal/controller path returned 404; the tree search located the actual labs/behaviors source.

Peter favoured [rebuilding Fieldset](../decisions/fieldset-form-group.md) rather than replacing it with native-markup examples alone. Compatibility was checked against native-and-managed-forms, state-on-tanstack-store, zag-behaviour-ports, reference-systems, composition-over-count, react-integration, box-primitive and PLAN section 1. The proposal fits those decisions at the capability level: native forms without required TanStack Form, optional managed integration, TanStack-owned component state, generated styling, applicable house motion and React wrapping the same Lit implementation. The new form-group purpose requires changing the old Fieldset code, not reversing those decisions.

Remaining design and verification include group labels, field associations across component boundaries, effective versus own disabled state, nested groups, changing children, error-state ownership, form values/reset/restoration and keyboard/assistive-technology behaviour. No rendered Fieldset prototype or new browser acceptance test ran.

### Entity and Item research, deferred

The Entity/Item sources and `entity-list/entity-list.ts`, `entity-content/entity-content.ts` and `items/items.ts` were read in full. Entity List renders a ul around a slot; Entity can render an inner li, button or div. Entity Content provides title/description, optional avatar and fill/width settings. Items instead renders a styled div with boxed/striped settings. Existing documentation includes a checkbox inside an Entity button row, an Item title link with separate actions, and Setting Row controls with explicit labels. These shapes require a semantics review; a source-level nesting concern is not a completed accessibility test.

- [shadcn Item](https://ui.shadcn.com/docs/components/item) describes a flexible content/media/title/description/actions arrangement, with a group and separators. Its documentation explicitly distinguishes Item from Field for form controls. The scraped page omitted many example code bodies; claims here use the prose/API that was returned, not unseen code.
- [MUI List](https://mui.com/material-ui/react-list/) distinguishes a list, list item, action inside the item, text/media and separate secondary controls. Its virtualization examples use react-window and suggest react-virtuoso. Those packages conflict with our selected TanStack Virtual direction if copied; adapt the example to TanStack Virtual instead. No change to our package decision is proposed.
- [Chakra List](https://chakra-ui.com/docs/components/list) supplies ordered/unordered lists with items and optional indicators. This is a narrower text-list presentation than the whole Entity/Item capability set.
- [Material Web List](https://material-web.dev/components/list/) supplies list/list-item concepts. The full [Lit List source](https://github.com/material-components/material-web/blob/main/list/internal/list.ts) activates interactive non-disabled items through a navigation controller. The full [Lit List Item source](https://github.com/material-components/material-web/blob/main/list/internal/listitem/list-item.ts) switches between text/button/link roots, provides start/end and text slots, and adds ripples to interactive rows. Link disabled handling differs from other types, and the source assigns listitem roles with an unresolved comment about announcing link/button roles. These details need independent review; they are not automatically accepted house behaviour.

The initial recommendation was one shared content-row component versus composed examples. That first question was interrupted without an answer, and Peter required forward dependency review. Subsequently he selected List and Field, requested the broader survey and joint review, and selected the focused Item family below. The earlier unanswered question is historical, not the current disposition.

The required [Group return point](../alignment/phase-2-review.md#entity-and-item) now addresses composition and companion mappings for the selected Item family, including semantic List, Field/Setting Row and selection controls. Resolve remaining dispositions before the Phase 2.5 register closes; coordinate names with Phase 2.6. Exact properties/slots and implementation remain later work. Bring prerequisite research forward instead of bypassing the gate.

Compatibility constraints remain: start/end naming; shared RTL and spacing-only density; optional default-off ripples; TanStack Virtual when virtualization applies; the house state/motion/style stack; shared selection and native-form responsibilities. Group's general purpose and [Data List replacing Description](../decisions/data-list.md) are selected; their exact interfaces remain inventory work. A reference's similarly named component does not override those boundaries. [Decision-review procedure](../alignment/phase-2-review.md#decision-compatibility-and-dependencies).

## Toolbar, App Bar and Search reference review

Research began 2026-09-19. Toolbar's return and the later [Group/Toolbar/selection responsibility split](../decisions/toolbar-group-responsibilities.md) are selected; exact keyboard and composition contracts remain open. Peter explicitly called for use in dialogs and other contexts beyond the current above-list placement, requested a joint Material Toolbar/App Bar/Search comparison, and then added Chakra UI Pro examples. The [initial evidence record](../alignment/evidence/toolbar-reference-review-2026-09-19.json) and [expanded Material record](../alignment/evidence/material-full-review-2026-09-19.json) distinguish the research stages and unresolved dependencies.

### Current code

`src/components/toolbar/toolbar.ts:20–21` is a div with default/end slots and a spacer, using page-head styling. Its docs example contains Search, Select, Export and Deploy. It has no own toolbar role or keyboard management. `src/shared/roving-tabindex.ts` handles arrow/Home/End movement but has no RTL option or embedded-text-control guard; binding it indiscriminately to the whole row would not establish correct input or nested-widget behaviour.

The current `appbar/appbar.ts` is a sticky branded header with section navigation, tools and a default theme switcher. `topbar/topbar.ts` supplies sticky start/center/end content; `page-head/page-head.ts` supplies heading, back link, metadata and actions. Their overlapping responsibilities must be reviewed together before claiming an App Bar disposition. `search/search.ts` extends the slated-for-removal Clearable Input and provides icon/loading/clear behavior around a search input. It is not a complete suggestions/results view. `clearable-input/clearable-input.ts` handles Escape clearing; `modal/modal.ts` handles dialog focus and dismissal. Expanded Search and Toolbar in Dialog therefore need coordinated focus, Escape, data and overlay contracts.

### What the references actually provide

- [Radix Primitives Toolbar](https://www.radix-ui.com/primitives/docs/components/toolbar) supplies one toolbar role and roving focus. The full [source](https://github.com/radix-ui/primitives/blob/main/packages/react/toolbar/src/toolbar.tsx) handles direction/orientation and wraps buttons/links/toggles; its nested ToggleGroup disables independent roving focus. No Radix runtime is selected for the house implementation.
- Radix Themes' complete non-truncated tree had no toolbar path, and its actual [component exports](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/index.tsx) have no Toolbar. The first guessed index.ts path was wrong; directory inspection located index.tsx.
- Chakra has an editor-specific [Toolbar composition](https://github.com/chakra-ui/chakra-ui/blob/main/apps/compositions/src/ui/rich-text-editor.tsx), read in full. It is an HStack with fixed/sticky/floating treatments, wrapping and separators; it does not itself add a toolbar role or roving navigation. The core component exports have no general Toolbar.
- [Chakra Action Bar](https://chakra-ui.com/docs/components/action-bar) provides actions for selected content, including a Dialog example. Its [actual source](https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/components/action-bar/action-bar.tsx), read in full, wraps Ark Popover and sets autoFocus false on its root, despite the inherited props table showing true. That mismatch matters to focus design; copying the table alone would be wrong.
- [PatternFly Toolbar](https://www.patternfly.org/components/toolbar) is a responsive data-control container with search/filters, groups, sticky/vertical layouts, wrapping and collapsible filter presentation. Purpose, examples and the initial API sections were read; the entire long API page was not reviewed. No PatternFly behaviour or interface is adopted.
- The [WAI Toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) recommends a named group with one tab stop and arrow navigation, and warns about controls that use those arrows for their own operation. That makes input/search and nested-selection behaviour a design dependency, not merely a layout setting.

### Material comparison

Full prose from each component's guidelines and accessibility page was read, retaining qualifications and platform-specific sections. [Toolbar guidelines](https://m3.material.io/components/toolbars/guidelines) describe task/page actions in docked or floating containers, overflow, orientation, responsive presentation and optional scroll behaviour. The mobile bottom-placement guidance has an explicit web/large-screen exception allowing other page positions and rounded docked toolbars. Do not apply a mobile-only placement rule to our dialogs/cards. [Toolbar accessibility](https://m3.material.io/components/toolbars/accessibility) describes Tab through controls and also lists arrows, differing from the Radix/APG roving pattern; the house keyboard contract is unresolved.

[App Bar guidelines](https://m3.material.io/components/app-bars/guidelines) distinguish page/navigation identity and a few key actions from a larger Toolbar action set. They cover search/small/medium-flexible/large-flexible forms and scroll presentation. [App Bar accessibility](https://m3.material.io/components/app-bars/accessibility) uses Tab between actions. The inspected experimental [Lit AppBarElement](https://github.com/material-components/material-web/blob/main/labs/gb/components/appbar/app-bar-element.ts) and [helper](https://github.com/material-components/material-web/blob/main/labs/gb/components/appbar/app-bar.ts) supply standard/search layouts, slots, sizing/subtitle state and optional scroll tracking. Main-branch Labs code is not proof of a stable published component.

[Search guidelines](https://m3.material.io/components/search/guidelines) distinguish entry points from a focused suggestions/results experience, including docked versus full-screen presentation. Search may show history, live results or results after submission; those are options, not one selected house policy. Android predictive-back behaviour is explicitly platform-specific. [Search accessibility](https://m3.material.io/components/search/accessibility) covers results announcements, labels and result navigation; it does not settle the house web combobox/list/dialog composition.

The complete Material Web tree search found Toolbar/Search tokens and an experimental App Bar implementation. Published @material/web 2.5.0 (2026-07-15) was checked separately: all.js and its 54-tag custom-elements manifest contain no Toolbar/App Bar/Search tag, and relevant archive paths are token sources. This bounded check distinguishes guidance, tokens, repository implementations and registered published components; it does not declare every implementation route impossible or select a dependency.

### Compatibility and forward dependencies

- Keep the house Lit/TanStack Store, generated-style, motion, icon and React-wrapper contracts. Material's local @state/style/directive code and React reference frameworks require adaptation.
- Material's default ripples and filled-icon preference do not override our default-off ripples or Rounded/unfilled icon default. Its 48dp targets are not a blanket replacement for the selected explicit compact-mode 24 CSS-pixel floor and spacing-only density policy.
- Floating Toolbar/Search shadows need a role assignment using the selected Radix scale. Material elevation numbers and Chakra shadows are not equivalent values.
- Material App Bar advice includes 3:1 text contrast. [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) distinguishes regular text at 4.5:1 from large text at 3:1; do not weaken our checks by copying an unqualified threshold.
- Bring Group and nested selection-control responsibility research forward before fixing Toolbar keyboard ownership. Coordinate Toolbar-in-Dialog focus entry/restoration, child menus, Escape and clipping with the overlay review. Supporting dialogs does not make every Save/Cancel pair an ARIA toolbar.
- Resolve Appbar/Topbar/PageHead scope in the non-canonical disposition review. Resolve simple Search versus expanded Search with Input clearing, ComboBox/Command Menu, list and overlay responsibilities before accepting new scope. Preserve consumer-owned data processing where already selected; no search backend has been adopted.
- Responsive window/container behaviour, overflow presentation and scroll/motion details remain later contracts. Deferring details must not bypass required Phase 2 dispositions.

The expanded review below led to the Toolbar responsibility decision. Appbar/Topbar are now consolidated as App Bar; expanded Search and exact interfaces remain inventory work. Source inspection is not browser acceptance.

## Complete Chakra UI Pro source review

Completed 2026-09-19: all 338 catalog blocks and 1,003 exposed source files, plus all 250 supplied Course Kit and Docs Kit files. Seven Free Blocks aliases match complete catalog source sets byte-for-byte. The [coverage record](../alignment/chakra-pro-review.md), [per-file ledger](../alignment/evidence/chakra-pro-review-ledger.json) and [collection audit](../alignment/evidence/chakra-pro-collection-audit.json) preserve the evidence. The private [capability synthesis](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/reviews/capability-synthesis.md) covers 15 families with 90 checked source references and explicit dependencies/return points.

Peter reaffirmed that these are additional sources. Consult them whenever Radix, Chakra UI, Material Design 3 guidance or Material Web's Lit implementation is considered in a relevant comparison. An example's presence does not select a component, feature, package or appearance. [Standing comparison rule](../decisions/reference-systems.md#standing-comparison-rule).

### Composition evidence to carry forward

- **Card:** Sharing 05 uses several body sections and separators; Card With Tabs places complete Card regions within separate panels. Blog, payment and product examples add media, independent actions and fields. This supports the selected flexible Card direction; exact regions, heading semantics and whole-card links remain inventory choices.
- **Rows and Group:** IntegrationListItem in Settings Integrations 08/09/11 accepts arbitrary action content and optional description, while its caller supplies divided groups or grids. Help-center rows use anchors; Event Log 02 uses Accordion; notification rows contain several actions. Compare a shared row presentation against complete compositions without assigning all rows one interaction model. The later joint review selects focused Item; its exact composition and companion mappings still return during Phase 2.4 Group.
- **Selection cards:** Sharing 01 puts rich RadioCard items in an attached vertical Group. Onboarding and pricing examples combine indicators, descriptions, media and labels. These give concrete compact-row and large-card cases for the selection families. Missing labels and nested secondary actions require explicit contracts; Entity must not become a second selection engine.
- **Pagination:** Event Log 03 supplies optional position text, page-size selection and navigation around shared state, with application-owned slicing. This strengthens the case to reconsider family parts, as Peter requested. It does not settle unknown totals, reset policy or jump-to-page. The separate documentation/kit pagers remain adjacent-document links.
- **Toolbar and Search:** Headers, dialog record navigation, search, sorting and nested selection controls demonstrate real mixed-content needs. The examples mostly compose ordinary controls; they do not settle Toolbar roving focus. Input arrows, nested groups, overlay Escape/focus and responsive overflow remain prerequisites. Placeholder search buttons and empty search dialogs are not full Search implementations.
- **Stat:** Real Stat label/value parts preserve term/definition relationships in cards and strips; many marketing metric displays use plain Text instead. Compare Stat, Tile and related helpers together. Keep direction separate from whether a change is good, and keep calculations with the consumer. A clickable passive Stat is not an accessible selection control.
- **Forms and overlays:** Property panels demonstrate coordinated number/slider/unit controls; repeatable invite rows expose identity/focus needs. Rich Dialogs combine custom headers, menus, selects, tabs and scrolling payloads. Associated labels, form participation, draft/committed values, portal context and one focus/state owner matter more than matching a screenshot.
- **Cross-family foundations:** Responsive copies sometimes hold independent uncontrolled values. Literal colours, physical left/right rules, display:contents and unbounded automatic motion require translation to the selected theme, direction, real-box, TanStack Store and Lit Motion rules. The review does not reopen those packages or conventions automatically.

### Evidence limits and next decisions

Full source coverage is not certification of every browser state. Default preview DOM was inspected; targeted follow-ups establish the recorded pagination change, hydrated notification overlays and contact-dialog state. The kits were not executed. Several examples have unwired actions, missing labels, stale fixture values or source/preview mismatches; those limitations are indexed beside useful capability evidence.

Use the synthesis as a decision checklist, not an implementation backlog. The Toolbar responsibility split and later Stat dispositions are selected. The comprehensive Group and later joint studies below select focused Item and general Tree View; Setting Row removal through Field/Item recipes is selected in the later checkpoint; exact compositions remain inventory work. Return to Toolbar composition and rows with Group/selection in Phase 2.4, and resolve the reopened Pagination parts question before its inventory approval. Exact interfaces remain Phase 4 work; source changes still require Phase 5 approval.

## Full Material review and selected responsibilities

The [coverage record](../alignment/evidence/material-full-review-2026-09-19.json) records 46 fully read documentation pages: 20 Layout pages, six Interaction pages, and Overview, Specs, Guidelines and Accessibility for Toolbar, App Bar, Search, Button Groups and Segmented Buttons. Every page's prose, sections, tables, alt text and captions were read. Specification token sets were expanded at their displayed default modes, and measurement diagrams were inspected separately. This does not claim every animation or theme/platform permutation was tested. Some token previews show graphics instead of numbers; those values were not invented.

### Three responsibilities, with Group as a direct dependency

Peter selected [separate Group, Toolbar and selection responsibilities](../decisions/toolbar-group-responsibilities.md). This follows the comparison rather than treating all similarly named groups as interchangeable.

- [Chakra Group](https://chakra-ui.com/docs/components/group) handles arrangement, wrapping, equal growth, attached edges and focused-child stacking. Its full implementation at commit `1ff9873754e9913fc3d849d23c0844a628f5f20d` adds child position markers but no automatic group role, selection state, form behaviour or keyboard navigation. ButtonGroup adds shared Button settings through a provider. React child cloning requires a separate Lit slotted-child contract.
- [APG Toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) supplies named control grouping with one Tab stop and arrow movement. Optional details include Home/End, wrapping and last-focus restoration. Editable controls that consume the same arrows need explicit exceptions; its example places one such control last. This is more specific than merely saying a Toolbar supports keyboard input.
- [APG Radio Group inside Toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/radio/#for-radio-group-contained-in-a-toolbar) keeps selection separate from focus: arrows move focus without changing the checked value; activation selects. Radix Toolbar's full source at commit `f7ecd5ab16f5e1e820eb5786a1419a98a2d594ae` disables nested ToggleGroup roving focus and lets its items join the outer Toolbar focus group. Two independent focus managers would compete.
- Material's [Toolbar guidelines](https://m3.material.io/components/toolbars/guidelines) explicitly permit buttons, text fields, images and custom controls in configurable content areas. Its [accessibility page](https://m3.material.io/components/toolbars/accessibility) assigns the web toolbar role, says interaction belongs to children, uses Tab in prose, and lists Tab or arrows in its key table. It does not supply a complete mixed-input web focus algorithm.
- Material [Button Groups](https://m3.material.io/components/button-groups/guidelines) add presentation coordination: standard groups can change adjacent widths/shapes; connected groups represent related toggle choices. Their accessibility guidance uses Tab for each button. Their expressive shape behaviour is a reference proposal, not an automatic responsibility of the house generic Group.

Local source supports keeping these jobs distinct. Button Group is a joined presentation wrapper (`button-group.ts:10–12`); Avatar Group owns member limits/counts/overlap (`avatar-group.ts:32–65`); Radio Group owns selected value, arrow selection and forms (`radio-group.ts:61–94`); Collapse Group owns disclosure state through TanStack Store (`collapse-group.ts:28–69`). Items and Setting Rows are layout wrappers. The current Toolbar remains layout-only (`toolbar.ts:20–21`). This is evidence for the upcoming family review, not approval to remove every specialised Group.

Pro's Sharing 01 demonstrates RadioCard owning selection while an attached Group arranges its children. Divider With Button Group joins independent buttons without Toolbar semantics. Page Header With Actions 02 places several interaction owners inside Tabs.List; that composition exposes a coordination problem rather than a pattern to copy uncritically.

### Layout, App Bar and Search

Material's scaffold distinguishes bars, rails and panes as layout regions. A rail region is not the Navigation Rail component; a layout bar spanning a pane does not automatically establish an App Bar component interface. Toolbar's web/large-screen exception permits placements beyond the bottom of a mobile window. Thus page, Card and Dialog use can remain in scope without copying mobile placement rules.

[App Bar](https://m3.material.io/components/app-bars/guidelines) combines page identity/navigation with one or two essential actions; larger action sets belong in Toolbar. Its current flexible variants differ from baseline medium/large variants. Search App Bar is an entry point; [Search](https://m3.material.io/components/search/guidelines) separately covers an input and suggestions/results presentation. Local versus global search, query ownership, announcements, focus return, clear/Back/Escape and responsive presentation remain separate contracts. The prose and some scroll captions disagree on direction; motion should not be selected from that ambiguity.

The source permits different trailing-action counts in Search Bar and Search App Bar. These are distinct contexts. It also discourages App Bar overflow in general while allowing it during resizing. Preserve qualifications rather than invent one universal rule.

### Actual Material Web Lit source

The complete non-truncated tree at commit `56a486b147b8b7e95e6e8035fa02aed7e0009a85` contains experimental App Bar and outlined segmented-button/set source. It contains Toolbar, Search and new Button Group tokens, but no named full implementation of those three families was found. The earlier published-package inspection was not rerun; main-branch Labs source and stable package exports remain separate evidence.

The six segmented TypeScript files, all eight internal SCSS files, demo files and supporting ARIA/Labs/export material were read. The [segment](https://github.com/material-components/material-web/blob/56a486b147b8b7e95e6e8035fa02aed7e0009a85/labs/segmentedbutton/internal/segmented-button.ts#L74) renders a native button with aria-pressed and a separate Tab stop when enabled. The [set](https://github.com/material-components/material-web/blob/56a486b147b8b7e95e6e8035fa02aed7e0009a85/labs/segmentedbuttonset/internal/segmented-button-set.ts#L99) uses role=group, not radiogroup. Neither implements arrow/roving navigation. This explains the actual implementation's Tab behaviour without treating the documentation's radio/checkbox terminology as its markup.

Single-selection interaction rejects deselection, but initial/external selections and mode changes are not normalised. There is no form-associated name/value/reset/validity or configurable selection-required contract. At [set lines 47–68](https://github.com/material-components/material-web/blob/56a486b147b8b7e95e6e8035fa02aed7e0009a85/labs/segmentedbuttonset/internal/segmented-button-set.ts#L47), the selection event fires before other selected children are cleared, so synchronous consumers can observe inconsistent aggregate state. This is a static source finding, not a runtime reproduction. It supports atomic house state updates before notification, not copying the Labs event implementation.

### Compatibility, differences and return points

The selected responsibility split preserves the house state/motion/style/framework baseline. Exact nested focus rules return in [Phase 2.4 Group](../alignment/phase-2-review.md#toolbar-and-group-composition), together with input arrows, radio/segmented behaviour, disabled-action discovery, RTL, attached focus visibility and overlay focus/Escape. Resolve responsibility conflicts before Phase 2 closes; exact public contracts remain Phase 4.

Appbar/Topbar now consolidate as App Bar, and Page Head is removed. Simple/expanded Search interfaces remain inventory work. Floating Toolbar/Search shadow roles, responsive overflow and pane placement must retain their own review points. Material's measurements and shapes are source values. Peter expressly permits evidence-led proposals to change house spacing, density or other rules, provided the proposal identifies earlier and upcoming impacts and is separately selected. No such numerical or visual change was approved here.

One concrete source discrepancy is preserved: the Button Group XS prose and diagram show a 4dp inner corner, while the current token viewer shows 8dp for the default inner corner and 4dp for pressed. Do not silently choose one as a house value. Disabled-focus and generic Escape guidance also require comparison with the relevant web widget contract.

## Stat family review

Completed at the capability/disposition level on 2026-09-19. Peter selected [one Stat family](../decisions/stat-family.md), removed standalone Trend, selected composed selectable Stats, and separately replaced Tile/Tiles with Card, Stat and shared layout. [Evidence](../alignment/evidence/stat-review-2026-09-19.json) preserves source pins and choice provenance.

### Source and reference findings

The complete Stat, Stat Delta/Description/Footer, Stat Strip/Strip Item, Tile/Tiles, Trend, Spark and Fold sources were read, with their relevant generated styles and documentation examples. Stat already has many optional places, but its advertised unit/meter slots do not match the render function. The built-in meter is a styled track without meter/progress semantics. Helpers render description-list elements in separate shadow roots; semantic relationships and descendant styles require browser verification. These are source findings, not a new accessibility pass.

Trend ties upward movement to success and downward movement to warning. The Churn example says “Lower is better” while using the downward treatment. Peter accepted independent direction and desirability, then explicitly placed this display in Stat rather than retaining a separate Trend component.

Stat Strip updates click selection but lacks initial/programmatic value synchronization, arrow navigation and panel associations. Strip Item uses tab roles and real-box-breaking display:contents. Its useful chart-switching pattern survives as composition. Radio Cards, Checkbox Cards and Tabs are candidates according to the intended action; Peter's suggestion did not select one universal control. Checkbox comparison must preserve all selected measures; the travelling indicator is single-selection only.

Tile is currently a small label/value surface. Settings Integrations 02–05 instead use Chakra Card for icon/title/description, actions, switches or publisher metadata. Those complete Card and caller files were revisited. Peter rejected bundling the Tile decision into Stat automatically, then separately selected removal after this comparison. Preserve compact and collapsed-summary uses; this does not retain Fold or the old presentation values by implication.

[Chakra Stat](https://chakra-ui.com/docs/components/stat), all ten referenced examples and its implementation/recipe support minimal label/value and optional units, help and change parts. Formatting, charts and progress compose separately. Its indicator recipe and closed example conflate direction/desirability and treat zero as downward; these are not house defaults. StatGroup supplies presentation defaults/layout, not selection. Radix Themes has no named Stat in the inspected complete catalogue/exports; its Data List supplies related term/value presentation with real boxes and grid/subgrid alignment. [Ant Statistic](https://ant.design/components/statistic), all eight examples and formatting source show a separate Card, optional loading skeleton and custom formatting. Omitted-value zero, decimal truncation and absent automatic busy/live announcements are reference limitations.

Material's complete catalogue/tree contains no named Stat/Metric/Tile in the inspected scope. All four [Card documentation tabs](https://m3.material.io/components/cards/overview), all three token sets and four measurement/state diagrams were reviewed, alongside Labs Card source/styles/demo/tests. Card owns a surface, not metric state or formatting. The complete Pro collection supplies seven real Stat imports and eight plain-text metric examples. Webhooks Detail 04 composes a richer Stat; Charts 02 attaches clicks to a passive Stat without supplying keyboard control semantics. Card/Stat/Chart remain separate purposes.

Exact helper parts, names, value formatting, missing values, loading, announcements, meter/progress and Spark/Chart disposition remain inventory work. No implementation or new dependency was introduced.

## Comprehensive Chakra Group review

### Phase 4 choices from the implementation

Peter selected alignment with the inspected Chakra behaviour for two open choices. The complete pinned Group source was re-read: wrap is independently forwarded to flexWrap, including when attached is true; joined corners follow ordered member markers, not measured wrapped rows. The single-line-only proposal is not selected. The complete pinned ButtonGroup source supplies fresh variantProps to its provider; Peter selected a fresh set of appearance defaults at each nested Group, rather than merging unspecified settings from outer Groups. Explicit child values still win, and this does not change theme inheritance.

Peter separately selected an independent outer-border setting, allowing attachment, framing or both. This supports both joined input add-ons and framed segmented controls. It does not approve exact border/padding/corner tokens or the full Group interface. The [six-choice record](../alignment/evidence/phase-4-checkpoint-2026-09-19.json) and [Group inventory](../alignment/inventory.md#g-01-group) preserve the selections and remaining dependencies. Existing complete Pro composition evidence remains applicable; no new corpus or runtime pass ran.

Peter explicitly required a deep review of Group and its use throughout Chakra before wrapper dispositions. [Coverage and source census](../alignment/evidence/group-review-2026-09-19.json) record the complete pinned archive: 3,849 files, 3,528 text/code files scanned, 145 lexical matches, and **63 direct Group/ButtonGroup import files**, including **all 54 matching composition examples**. All direct-use files were read. Fifty-eight generated Group-bearing entries were compared with TypeScript AST printing, excluding imports/directives while preserving string content; 54 match source bodies. All four differing entries were read separately. This is bounded to commit `1ff9873754e9913fc3d849d23c0844a628f5f20d`, not every historical version.

### Arrangement, family defaults and interaction

[Group's complete source](https://github.com/chakra-ui/chakra-ui/blob/1ff9873754e9913fc3d849d23c0844a628f5f20d/packages/react/src/components/group/group.tsx) supplies orientation, spacing, alignment, wrapping, growth, attachment and stacking. Attached edges remove adjoining radii and overlap borders. Group has no automatic semantic group name/role, selection state, forms or keyboard manager. Its local style definition differs from named family recipes.

[ButtonGroup](https://github.com/chakra-ui/chakra-ui/blob/1ff9873754e9913fc3d849d23c0844a628f5f20d/packages/react/src/components/button/button-group.tsx) adds Button recipe defaults, including size, variant, palette and custom recipe keys. Explicit child values override the nearest defaults; undefined preserves them. Disabled, loading and handlers are not automatically propagated to every Button. Nested family providers replace their nearest context rather than accumulate all ancestors' defaults.

AvatarGroup adds Avatar defaults and overlap; the Avatar recipe reacts to Group's markers with an outer ring. It does not calculate overflow. StatGroup has its own flex container and group role rather than using generic Group. InputGroup places elements/add-ons and adjusts input clearance; the package, composition source and published JSON differ. The package enables attachment for add-ons and skips exact InputElement children when assigning edge markers. These are real differences, not interchangeable snippets.

Every usage was classified: buttons, badges, swatches, mixed input/button groups, PIN chunks, Radio Cards, avatar/menu overflow, menus, overlay actions, pagination, Steps, scrolling, TreeView and custom documentation controls. All fifteen Steps examples use small/outline ButtonGroup even when Steps orientation or size changes; Steps owns progression and validation. Pagination supplies its own state and forwards Group markers through generated Items. Badge's separate props provider demonstrates that shared defaults and arrangement are distinct mechanisms.

The prior complete Pro corpus was searched; all nineteen matching Group/ButtonGroup/RadioCard/CheckboxCard source files across eighteen blocks and two matching kit files were revisited. Sharing 01 supplies RadioCard state while an attached vertical Group joins items. Property panels demonstrate passive swatches and mixed controls. No indexed Pro example directly combines Stat with a selection card; Pricing Upgrade's large numeric content is supporting evidence, not a tested Stat integration.

### Child contracts and verification limits

Group counts React elements, not rendered boxes. Direct strings/numbers/raw portals are filtered; fragments and custom components are opaque. Single eligible children remain unmarked. Skipped children still render and can receive generic growth styles. Hidden, null-rendering, reordered or wrapped children need deliberate edge handling. A custom component must forward position markers to the right box; one source child can render several boxes, so the intended marker contract matters.

Focus z-index 1 may remain below explicitly stacked siblings; focus-within is not automatically handled. Responsive orientation can pass through recipe machinery without matching literal attached compound variants. Multiple children under inherited asChild can lose siblings. These are source-derived cases requiring probes, not asserted browser failures. CSS group-state selectors requiring class=group are distinct from the Group component.

All 88 test/spec JS/TS files in the pinned tree were searched. Only three codemod tests match the specialised group names; those and relevant recipe/factory tests were read in full. No direct Group runtime tests for child/skip/attachment/focus/wrap/RTL behaviour were found in that census.

The live Group page was inspected separately: ordinary groups have no implicit group role or roving tabindex; attached examples show zero gap and joined corners; growing examples give equal widths. Measured 8px gaps and one-pixel overlap are Chakra reference values, not house selections. This is a limited rendered check, not an exhaustive keyboard, engine or assistive-technology pass; the deployed build was not proven identical to the pin.

### House decisions and remaining groups

Peter selected [general Group for compatible appearance defaults](../decisions/group-presentation.md) and removal of ButtonGroup. He then selected [retaining Avatar Group](../decisions/avatar-group.md) for member limits and remaining counts. Current Avatar tests were inspected, not rerun. Geist documents member limits; Chakra computes overflow in an example. Pro Help Center Collection 03 slices author data outside AvatarGroup and accesses the first author without handling an empty collection.

Group must support attached Radio/Checkbox Card presentation. Its requested outline and external input-add-on reuse are design directions, with exact treatment pending. The [shared indicator](../decisions/shared-selection-indicator.md) contains Lit Motion, supports horizontal and vertical orientations, and applies to suitable single-selection patterns only. Group receives selection information for presentation; selection families retain values, forms and appropriate keyboard behaviour. Toolbar must coordinate nested keyboard owners rather than intercept every key.

Radio Group and Collapse Group have actual state responsibilities. Tags, Filters, Items, Setting Rows and Bar Rows are mainly arrangement/presentation wrappers, but their final individual dispositions are not selected by the ButtonGroup decision. Input association, Field, List, Entity/Item and selection-card composition remain connected review subjects.

## Field and List composition review

Peter explicitly requested Chakra-like List and selected **Add Field** after the Chakra/Radix/Material/Pro comparison. [Field decision](../decisions/field-component.md), [List decision](../decisions/list-component.md) and [evidence](../alignment/evidence/field-list-review-2026-09-19.json) preserve the boundaries.

### List and rich rows

Chakra List's complete documentation, source/recipe and all five examples provide ordered/unordered roots, list items, plain/marker presentation, custom indicators, nesting and arbitrary child content. The source renders ul/li with a list role; it has no selection engine or automatic arrow navigation. The complete Pro lookup found fifteen blocks plus one Course Kit file using List; all sixteen files were re-read. Examples include permission/feature markers, rich content with InfoTip, lists inside Accordion/Timeline and Markdown mappings. Checkmark markers do not imply checkbox selection.

The four Material List tabs and actual Lit list/item/navigation source were read completely. Both token sets were expanded at Default/Light and all **35 static Specs figures** inspected. [Token and image record](../alignment/evidence/material-list-specs-2026-09-19.json). Graphical-only values were not invented; animation permutations were not tested. A text-only configuration's asset shows leading checkmarks despite its alt text; its actual loaded URL was verified.

Material Web separates layout-only md-item, text/button/link md-list-item and collection navigation in md-list. New Expressive guidance describes five interaction modes and more complex action traversal than the baseline Lit controller implements. It also recommends restrictions on secondary actions in selectable rows and web listbox/option semantics; those are reference policies, not selected house restrictions. The baseline controller manages row focus, not selected values, and can receive unhandled keys from nested controls. Some native action roots are assigned listitem roles despite an implementation TODO.

Pro integration rows expose reusable icon/title/description/action content; webhook rows add metadata footers, expansion and independent actions. Notification rows can contain multiple controls. These support evaluating one flexible content-row component without making every row a whole-surface button or a selection engine. At this point the row choice was still open. The subsequent joint review selects focused Item; the final Phase 2 closure resolves companion dispositions and removes Setting Row through Field/Item recipes. Exact interfaces and path migrations remain inventory/migration work.

### Field, form behaviour and presentation

Chakra Field's full docs/MDX, implementation, recipe, exports and all thirteen referenced examples were read. Ark 5.39.2 Field root/input/item/error/useField source was traced. It connects labels, help and errors, supplies state presentation and supports vertical/horizontal arrangements, required/optional indicators and an explicit target for a compound field. A plain arbitrary child does not automatically consume that connection. Field.Item scopes IDs; the amount/currency example still separately names Currency.

Radix's complete Form, Label and TextField documentation/source/CSS/props/helper/test coverage establishes a different split. [Form.Field](https://www.radix-ui.com/primitives/docs/components/form) requires Form.Root and supplies name/ID/server-invalid context; Control reads native validity and Message registers descriptions. TextField is an input plus visual shell/slots, not the label/help/error structure. The Form docs explicitly limit composition with other Radix form primitives. Its control assumes value/form/validity/setCustomValidity/focus APIs; repeated-name state, external form association and asynchronous validation need specific review. These APIs do not automatically expose a custom element's ElementInternals.

All four Material Text Field tabs, seventeen relevant TypeScript files and two SCSS files were read. Both Filled/Outlined token sets were expanded at Default/Light, and all **16 static Specs figures** inspected. [Evidence](../alignment/evidence/material-field-specs-2026-09-19.json). Material publicly exports reusable filled/outlined Field shells; TextField owns native input, value and validity, then supplies visual state. It mirrors descriptions into the input's shadow root. Visual error alone does not establish native invalidity. Guidelines recommend replacing help with an error, while Accessibility allows both with help first. That conflict leaves house message policy open. The report-validity helper patches form methods and documents a stale-error limitation; do not copy it without review.

The complete Pro index has Field/Fieldset in 42 distinct blocks and four kit files, with 49 matching source files. Existing complete reviews were consulted and 22 files re-read for this question. Horizontal Field already covers much of Setting Row's form layout. Property panels demonstrate multiple controls needing individual names. Unnamed wrapper controls, helper text without a label, and required badges without native required state are recorded counterexamples. No indexed ErrorText/RequiredIndicator use or managed-form integration was inferred from these examples.

The house has no Field component. Input currently owns embedded label/error rendering, and Label's click-to-focus does not prove accessible naming across shadow roots. The new Field must connect the intended control and messages without introducing a competing value or validation engine. Preserve native forms with optional TanStack Form and the separate Fieldset purpose. Specify control participation, target IDs, effective versus own disabled state, invalid-state ownership, help/error policy, reset/restoration, compound control names and React/Lit equivalence before implementation.

### Return points

The subsequent joint review below settles focused Item retention and general Tree View. The later accelerated checkpoint selects settings-row removal and Sidebar/TOC capabilities; the later Phase 2 closure also resolves companion and specialised-wrapper dispositions. Exact interfaces and path migrations remain open. Keep semantic List separate from Data List metadata and selection controls. During Phase 4, define Field/List interfaces, shared indicator/Group cooperation and old label/error migration; Phase 5 still gates every source change.

## Joint content, selection and navigation review

Peter reopened the Entity/Item question after the provisional composed-examples answer. He requested evidence about community practice, then found shadcn Item compelling and asked how Item, Card, Radio/Checkbox Cards, their grouped collections, List, Sidebar and TOC should work together. He added related components and generalising File Tree. The resulting selections are [focused Item](../decisions/item-content-family.md) and [general Tree View](../decisions/general-tree-view.md); Sidebar/TOC capability selections follow in the accelerated checkpoint below; exact contracts remain open. [Survey](../alignment/evidence/row-pattern-survey-2026-09-19.json), [joint evidence](../alignment/evidence/joint-composition-review-2026-09-19.json).

### Pattern survey and the changed Item choice

The purposeful ten-system comparison used official documentation and relevant source contracts. It establishes real patterns, not community-wide prevalence or a mandatory generic Row.

- **shadcn Item:** a standalone presentation family with media, text, actions, header/footer and optional ItemGroup. Both Base and Radix implementations count as one family, not independent evidence for those underlying libraries. Complete docs, both implementations, all 22 documentation examples and the Base showcase were read at `a87a63b2ca25143d26c8bd0903e4e9bc77b3f824`. Its docs direct form controls to Field. Some examples still require semantic/secondary-action corrections.
- **Geist Entity:** official documentation shows standalone rows and optional EntityList. The full page/Markdown and six example bodies were read; the underlying Vercel implementation was not obtained from the checked public package/repository addresses. The house port was not substituted as evidence of Vercel internals.
- **MUI ListItem:** a rich List family with arbitrary content, media/text helpers and secondary actions. Default ListContext and a configurable root allow standalone use; it cannot fairly be excluded merely because its name contains List. The inspected source and current package version are recorded in the survey.
- **Chakra and Radix Themes:** their inspected public catalogues and exports do not supply the same neutral rich-row family. Pro IntegrationListItem and WebhookItem are application-local compositions, not evidence of a Chakra core Item component. Radix Card demonstrates Flex/Avatar/Text composition; Data List is metadata.
- **Material, Carbon, Spectrum and Fluent:** rich list items occur with different collection contracts. Material also has the Labs md-item presentation helper. Carbon ContainedListItem separates main content/action from a sibling action area; StructuredList is tablelike. Spectrum ListView belongs to an interactive GridList collection. Fluent v9 supports arbitrary consumer layout and intentionally removed older layout-specific parts; its readiness documentation has a recorded inconsistency.
- **Ant Design:** released 6.6.4 deprecates List and recommends Listy. Its migration guidance moves Item/Meta/actions/extra into consumer rendering. Release/main comparisons verified the inspected deprecation material. This is a packaging direction, not a claim about adoption or an approved house dependency.

After the initial survey the assistant recommended recipes based on the selected primitives. Peter then requested the broader composition review and ultimately selected **Focused Item**. That latest choice supersedes both the provisional recipes-only answer and the interim recommendation. Repeated visual structure alone does not justify a public component; the selected value here is a focused, consistent content vocabulary with explicit interaction boundaries.

### Working responsibility map

Item supplies content structure. Card supplies a related-content surface. Group supplies arrangement and compatible appearance defaults. List supplies ordered/unordered collection structure. Field/Fieldset supply the already selected control/group associations. A List may contain Items, and a Card may contain one or several Items.

Radio/Checkbox Cards retain choice state, naming, forms and keyboard rules. Group may arrange or attach them. Item content parts may be reused where their markup fits, but a second interactive root must not compete with the selection target. Neither a whole-row anchor/button nor a label can be assumed safe around arbitrary independent controls. Keep main and secondary action targets deliberate.

Sidebar is being evaluated as a region with placement, visibility and responsive behaviour. Navigation links, disclosure sections, forms, TOC or a Tree View can be content of that region; the container does not make them all one control. TOC navigates to headings in the current document. Tree View supplies a coordinated hierarchy. These are candidate Sidebar/TOC boundaries, not approved new public interfaces.

Include adjacent families when defining combinations: Field/Fieldset, Link/Button, Menu/Toolbar, Accordion/Collapsible, Drawer/Dialog, Scroll Area, Listbox, Data List/Table, Tabs, breadcrumbs and the existing pane/layout work. Their inclusion in the comparison does not add every one as a new component or adopt a new behaviour engine.

### Sidebar evidence

Both full shadcn Sidebar docs, both core implementations and all 28 referenced examples were read at the same shadcn pin. The family uses dedicated native-list/link/button parts, not the neutral Item. SidebarProvider owns panel state; Sheet handles mobile overlay presentation; Collapsible and DropdownMenu retain their own interactions. Current styling alone does not provide route matching or aria-current. SidebarRail toggles on click rather than implementing drag resizing. Cookie restoration, shortcut guards, responsive state, RTL placement and nested landmarks need explicit house design.

The complete saved Pro index was searched again. Sixty-three unique complete files cover 111 file occurrences through 48 verified duplicates: ten navigation sidebar blocks, four layout-only matches, five related navbar blocks and fourteen kit files. Rich identity/content structures occur in links, menu triggers, disclosure buttons and passive profiles. These are not interchangeable interaction models. Separate desktop/mobile instances do not prove preserved state. Pro did not establish a primary navigation link plus secondary-action row; shadcn's project-navigation example supplies concrete evidence for separate sibling targets.

Current house Shell is a layout wrapper; Side Nav and Subnav style slotted anchors. The docs application owns route state and page navigation. These existing components and Appbar/Topbar/PageHead remain linked disposition subjects, not automatically replaced merely by proposing Sidebar.

### TOC and current location

All sixteen files across Pro toc-line, toc-minimal, toc-numbers and toc-mobile were read. The requested toc-line uses a sticky scrolling region, depth-indented text and a current-item border. It does not supply fragment hrefs or aria-current. The numbers example supplies href but prevents normal fragment navigation without updating history.

The shared observer replaces active IDs with only the entries in the latest observer callback. That batch is not a complete set of visible headings; a robust current-section policy must maintain the needed state. Missing heading IDs, empty data, changing content, scroll roots, scroll margins, hash/history, keyboard focus and reduced motion need explicit handling. These are static source findings; no new rendered TOC acceptance is claimed.

TOC current location differs from selected form values and keyboard focus. Its line treatment does not itself establish use of the shared travelling indicator. Evaluate that reuse only after deciding whether the TOC exposes one current heading and how its geometry changes. The single-target indicator remains excluded from multiple selection.

### Navigation and hierarchy references

The full APG Tree View, navigation-tree and disclosure-navigation guidance distinguish ordinary nested links from coordinated tree interaction. The Listbox guidance also explains why options are not a container for independently interactive links/buttons/checkboxes. Semantic lists with independent controls can remain ordinary lists; appearance alone does not require Tree, Menu, Listbox or an application Grid.

[Material Navigation Drawer](https://m3.material.io/components/navigation-drawer/overview) and [Navigation Rail](https://m3.material.io/components/navigation-rail/overview) were read through all four tabs each. The parent inspected all seven Drawer and sixteen Rail static Specs figures, one Drawer token set, six expressive Rail sets and the baseline Rail set. [Specification record](../alignment/evidence/material-navigation-specs-2026-09-19.json). Displayed default modes were used; graphical-only values and animation/theme permutations were not invented or claimed.

Material's Expressive guidance replaces its navigation drawer with expanded rail; that does not remove the house Drawer. Persistent navigation, dismissible panels and modal overlays have different focus/background responsibilities. Material measurements, typography and targets remain reference values. Its baseline/current guidance has contextual differences on breakpoints, label truncation and wrapping.

Actual Material Web `2.5.0` includes experimental Labs drawers but no inspected Rail component, although Rail tokens exist. Main all.ts omits the Labs drawers. Their dialog role, scrim and Escape handling do not establish focus containment, focus return or background inertness. The separate non-shipped catalogue component composes a sidebar, app bar, content and TOC. Source/package pins and limits are preserved in the joint record.

### General Tree View

Peter selected the general Tree View direction. The current File Tree, Folder, File and documentation were read fully: presentation, folder expansion, file links and active styling are present, but there is no shared tree focus/selection model or tree-wide keyboard contract.

Chakra exports a general tree collection and a file-path helper producing the same abstraction. Its renderers accept arbitrary node content; file types and icons are not intrinsic. MUI's composed-child and data-driven APIs demonstrate alternative authoring models within the same family, not a requirement to create two house components. The general hierarchy is the selected capability; exact data/slot interfaces remain later.

The review read Chakra implementation/exports/collections, Ark 5.39.2 tree wrappers/collections, Zag 1.43.3 tree types/connector and collection declarations, plus eleven complete MUI Tree View documentation sources. It did not audit every MUI demo/runtime implementation. No package adoption or browser acceptance is implied.

Keep expansion, focus, selection and checking distinct until the contract is chosen. Chakra's underlying model separates selected and checked values; MUI uses checkboxes to operate selection and makes propagation optional. Async loading, filtering, renaming, reordering, multiple selection, check propagation, virtualization and submitted form values are not automatically approved. Preserve the full house stack and TanStack Virtual when virtualization is selected.

### Required return points

1. Walk through Item with Card and Radio/Checkbox Cards, including independent secondary actions and valid content structure.
2. Sidebar and TOC capabilities were subsequently selected in the accelerated checkpoint below. Specify their remaining responsive, focus, heading and history contracts in the inventory without repeating those scope choices.
3. Define how List, Field, Group, disclosure and navigation parts compose; then resolve Setting Row and the remaining specialised groups.
4. Map Entity Content, Entity List, Items, Shell, Side Nav, Subnav and the file-specific family to the approved final inventory. Item retention and Tree View generalisation are settled; precise companion migrations are not.
5. Carry TOC/current-location indicator eligibility, responsive Drawer state/focus, Tree scope, native forms and virtualization into the relevant inventory entries before Phase 5 approval.

## Accelerated capability and disposition checkpoint

At this capture Peter requested faster progress. He later withdrew the deadline pressure; the [current handoff](../alignment/README.md#where-we-are) records the updated pacing and audit corrections. Reusing evidence and asking material choices remain useful, without lowering the research or approval bar. The [capture record](../alignment/evidence/capability-checkpoint-2026-09-19.json) separates direct inclusion requests, selected interfaces and unresolved details.

### Requested capabilities

Include Chakra-like Accordion, Show, FormatNumber, FormatByte and Hover Card, plus appropriate as support on primitives such as Box, Text and Heading. [Scope](../decisions/additional-component-capabilities.md). Accordion already belongs in the Collapse/Collapse Group naming review; its inclusion is no longer a question. Exact replacement mappings still require the inventory.

The complete current Chakra documentation pages for Accordion, Show, FormatNumber, FormatByte and Hover Card were read. Pinned Chakra Show, format exports and Accordion implementations, plus Ark 5.39.2 FormatNumber/FormatByte wrappers, were read in full. The existing complete Pro index contains eight Accordion, ten Show and twenty FormatNumber matches; none for FormatByte. This is an index lookup against the previously reviewed corpus, not a claim that every file was re-read or every new component has a completed browser audit.

Show's actual source selects children or fallback using truthiness. Its description about empty arrays must not be read as an empty-array test; the array itself is truthy. The docs' generic as/asChild table also exceeds the inspected ShowProps. A Lit Show needs an explicit mounting/fallback contract rather than assuming that hiding already-instantiated slotted children matches conditional rendering.

Both formatter wrappers accept a numeric value and produce text using formatting utilities. Peter selected [numeric value for both](../decisions/format-components.md), rather than child text. Keep input parsing/editing separate; do not adopt the referenced Ark/Zag dependency or replace the independent Number Input utility. FormatNumber's documented percentage example must use the actual Intl option percent, not the prose spelling percentage. Locale, rounding, absent/invalid values, byte units and exact options remain inventory work.

The as request concerns meaningful element semantics. A Lit custom-element host keeps its tag name; changing an inner element is not identical to replacing the React root. Establish supported elements, attributes/events, content models, focus/form semantics and real-box behaviour in Phase 4. Do not silently assume arbitrary React component substitution or asChild was requested.

Hover Card is included as a supplementary preview. Chakra's docs warn that its preview cannot carry essential information and does not provide keyboard/screen-reader activation. This does not reverse the house rule that interactive rich help opens explicitly. Use the earlier full overlay comparison; finish surviving Tooltip/Hover Card/Toggle Tip/Popover/Context Card mappings without copying reference accessibility limits as a house guarantee.

### Five selections

- [Responsive Sidebar](../decisions/responsive-sidebar.md): expanded, compact collapsed and mobile Drawer presentations. The panel coordinates responsiveness; routing and child behaviour remain outside it. Preserve state/focus when presentation changes. Widths, breakpoints, triggers and persistence are not selected.
- [TOC](../decisions/table-of-contents.md): both discovery from a specified content section and explicit curated entries, with real heading links and current-section tracking. The reply selected both capabilities, not precedence or defaults. Current location remains distinct from form selection and shared-indicator eligibility.
- [Setting Row/Setting Rows](../decisions/settings-row-composition.md): remove both. Their complete source and docs were rechecked: they supply placement, while examples mix inputs and actions. Horizontal Field owns input associations; Item with a Button handles actions. Shared layout and appropriate Fieldset/List semantics produce complete recipes.
- [Data List](../decisions/data-list.md): replace Description for metadata labels/values, following Chakra/Radix. Current Description renders dl/dt/dd; its docs distinguish metadata from input help. The complete Chakra Data List docs and earlier complete Radix implementation review support the concept. Five Pro index matches include billing, profiles and event details. Rich values may include badges, links and the new formatters. The separate KV source mixes label/value, subtext, due text and conversion display. Peter subsequently explicitly removed KV; its useful content mappings belong to inventory/migration, not a renewed retention question.
- [Formatter input](../decisions/format-components.md): numeric value is the one input source for FormatNumber and FormatByte in static HTML, Lit and React. Do not introduce child-content fallback or a second precedence rule.

Item/Card/selection responsibilities are settled enough for Phase 2: content structure, surface and control state have distinct owners. Their exact combined interfaces and accessibility cases remain inventory obligations, not reasons to repeat the same scope question. Continue remaining disclosure/overlay/layout naming conflicts and companion dispositions. No source, dependency or generator change was made.

## Disclosure, layout and smaller-component dispositions

Reviewed and selected 2026-09-19. This follows the accelerated capability checkpoint; it does not reopen its choices. [Decision sequence and revision evidence](../alignment/evidence/disposition-checkpoint-2026-09-19.json). Source is unchanged.

### Disclosure and explicit removals

The complete Collapse, Collapse Group, Fold and disclosure docs were read. `collapse.ts:20–116` combines title/trigger/content with measured expansion. `collapse-group.ts:26–73` coordinates one/multiple open items; its empty-selection/default-expanded treatment is not a standard to copy automatically. [Chakra Collapsible](https://chakra-ui.com/docs/components/collapsible), [Chakra Accordion](https://chakra-ui.com/docs/components/accordion), [Radix Collapsible](https://www.radix-ui.com/primitives/docs/components/collapsible) and [Radix Accordion](https://www.radix-ui.com/primitives/docs/components/accordion) distinguish independent disclosure from coordinated sections. The prior complete Pro corpus includes eight Accordion matches, including event logs, FAQ and Sidebar cases.

Peter selected [Accordion and Collapsible](../decisions/disclosure-components.md), sharing expansion/motion work and replacing Collapse/Collapse Group. Show stays conditional rendering. Fold supplies heading/count, closed/open slots and two expansion controls; it adds a compact-summary arrangement rather than a new disclosure model.

Peter then explicitly [removed fifteen named components](../decisions/component-removals.md). Their full inspected sources confirm dedicated wrappers: Filter/Filters, Task/Tasks, Bar Row/Bar Rows, Metric List/Metric; earlier Card/Stat decisions already cover Panel family, Link Card, Tile/Tiles and Stat Strip/Strip Item. Round Icon is `ricon`, Check Row is `check`, and Key Value is `kv`. Panel Head/Foot/Panels are associated migration cleanup. Shell is layout, not evidence that Side Nav, Topbar or Subnav are automatically removed.

Capabilities to trace in the inventory include compact Fold summaries, Filter add/remove/suggestion controls, Task completion/actions, Bar Row labelled values and bars, KV secondary/date/conversion text, Metric selection/grades, Page Head back link/actions and Check Row labels/disabled state. Candidate compositions are not final public interfaces. Existing Card, Stat, Field, Item, List, Data List, Group and selection ownership decisions remain intact.

### Scroll Area and Grid

`scroller.ts:53–63` exposes dimensions, axes, fades, buttons and a special mobile-grid option. Its full source shows native scrolling, overflow measurement and direct-child navigation. [Chakra Scroll Area](https://chakra-ui.com/docs/components/scroll-area) demonstrates edge shadows, programmatic controls and TanStack virtualization; [Radix Scroll Area](https://www.radix-ui.com/primitives/docs/components/scroll-area) retains native scrolling beneath custom bars. The Pro direct-import index returned zero ScrollArea matches; that is not proof of no scrolling compositions.

Peter selected [one Scroll Area replacing Scroller](../decisions/scroll-area-behaviour.md#replace-scroller). Preserve useful edge hints and button-driven scrolling through optional parts/composition. Content layout belongs with layout primitives; TanStack Virtual remains separate and uses the real scroll viewport. Inventory tests must cover wrapped/virtual children, both axes, RTL, reduced motion, focus reveal, resize and cleanup. The old direct-child index, physical-left offsets and fixed scroll lock are implementation details to reassess.

The complete Grid root, Cell, Cross, System, Page and docs were read. `grid.ts:134–145` mixes layout, guide decoration and responsive controls; Grid Cell clips guides, Cross draws intersections, System adds framing/lazy slots and Page adds prescribed spacing. [Geist Grid](https://vercel.com/geist/grid) explicitly targets cell-and-guide treatments. [Chakra Grid](https://chakra-ui.com/docs/components/grid), [Simple Grid](https://chakra-ui.com/docs/components/simple-grid) and [Radix Grid](https://www.radix-ui.com/themes/docs/components/grid) provide ordinary layout. Earlier complete Material layout guidance and Pro layout evidence remain additional references; neither supplies automatic house spacing values.

Peter rejected the recommendation to retain Decorative Grid and selected [layout grids only](../decisions/layout-grid.md). Remove decorative companions and replace the current Grid implementation. The previous responsive/Box decisions govern the new layout interfaces; no old breakpoint mapping is inherited silently.

### Loading and bounded measurements

`loading-dots.ts:39–46` renders blinking dots and a fixed loading label; `spinner.ts:45–54` renders an animated status. Both indicate unmeasured work. [Geist Loading Dots](https://vercel.com/geist/loading-dots) retains a separate inline appearance; [Chakra Spinner](https://chakra-ui.com/docs/components/spinner) and [Radix Spinner](https://www.radix-ui.com/themes/docs/components/spinner) cover loading with composed labels/buttons. Pro's Course Kit uses Spinner in its video player and toaster. Peter [removed Loading Dots entirely](../decisions/loading-indicators.md), including the proposed Spinner dots variant.

The full Gauge/Progress sources and Gauge docs were read. Gauge renders progressbar semantics, but its documented examples are quota usage/cache hit rate/uptime. [W3C Meter](https://www.w3.org/WAI/ARIA/apg/patterns/meter/) distinguishes bounded measurements from task progress. [Base UI Meter](https://base-ui.com/react/components/meter) and [React Aria Meter](https://react-spectrum.adobe.com/react-aria/Meter.html) use that name; [Geist Gauge](https://vercel.com/geist/gauge) keeps Gauge. Peter selected [Meter](../decisions/meter-component.md), preserving the circular measurement display and correcting the semantics.

[Chakra Progress Circle](https://chakra-ui.com/docs/components/progress-circle) and Material distinguish measured and indeterminate task progress. All four Material Progress tab texts were fetched/read, but token expansion and specification diagrams are incomplete. Finish those before visual recommendations, with the actual Material Web progress implementation. Do not present this checkpoint as a complete Progress implementation/visual review. The animation requirement for loading a measurement remains, without a fabricated measurement value. Stat helper composition, missing values versus zero, range/threshold/formatting rules and Progress shapes remain inventory work.

### Relative Time and Dots Menu

The complete Relative Time source and docs show a formatter coupled to Context Card. `relative-time.ts:114–140` uses English strings, treats epoch zero as missing and formats future values incorrectly; `relative-time.ts:190–211` mandates the UTC/local popup. [Web Awesome Relative Time](https://webawesome.com/docs/components/relative-time) and [GitHub relative-time-element](https://github.com/github/relative-time-element) demonstrate standalone localized time text. Web Awesome's introductory auto-update wording and its documented sync=false default differ; do not infer a default from the headline. GitHub's README also has inconsistent year-default examples, so verify behaviour before copying policies.

Peter selected [standalone Relative Time plus a Hover Card composition](../decisions/relative-time-component.md). This preserves useful timestamp capability while removing the mandatory popup. Exact time input, semantics, locale/update/future/invalid policies and accessibility are inventory obligations, not selected package APIs.

The complete Dots Menu source/docs show a Menu wrapper with a fixed icon/trigger/default placement and event forwarding (`dots-menu.ts:83–109`). [Chakra Menu](https://chakra-ui.com/docs/components/menu) and [Radix Themes Dropdown Menu](https://www.radix-ui.com/themes/docs/components/dropdown-menu) accept composed triggers; prior complete Pro row/member action menus provide relevant combinations. Peter selected [Menu plus Icon Button composition](../decisions/dots-menu-composition.md). Preserve meaningful names, horizontal/vertical icons, disabled states and keyboard behaviour. Opening Alert Dialog from a Menu remains an explicit combined acceptance case.

### Next work and closure boundaries

The disclosure, overlay, Scroll Area/Grid and smaller-component votes above are closed. [Overlay research](floating-surface-shadows.md#phase-2-overlay-dispositions) records Toggle Tip/Context Card and the later Alert Dialog revision. [Resizable evidence](design-foundations.md#shadcn-resizable-follow-up) adds Peter's concrete reference within the existing pane capability.

Continue the remaining Phase 2 Item/List/Group companion mappings, specialised groups, unresolved register entries and terminology clusters. Settle responsibility conflicts before Phase 2 closes. Exact interfaces and combined acceptance scenarios belong in Phase 4; complete path migration requires Phase 5 approval. Source/runtime behaviour and browser accessibility have not been verified by this records-only checkpoint.

## Flow Diagram capability and dependencies

Peter added a content-rich flow diagram using the [supplied visual reference](../alignment/evidence/flow-diagram-reference-2026-09-19.png), then selected an interactive viewer and ELK with house Lit rendering. [Decision](../decisions/flow-diagram.md), [package research](package-choices.md#flow-diagram-library-review), [probe evidence](../alignment/evidence/flow-diagram-review-2026-09-19.json).

This adds a distinct graph-layout/routing capability; it does not reopen decorative Grid removal or make a workflow execution engine. Nodes can compose house Card/Item/Field/Group and controls where their semantics fit, without requiring every node to be a Card or introducing a fixed task-node schema. Application data controls the supplied graph; editing is outside scope.

Carry the selected state, motion, icons, generated styling and React wrapper approach into the new component. Lazy geometry delivery depends on the selective-loading/worker contract. Resizable, Sidebar and Scroll Area can affect available size; coordinate node measurement, viewport preservation and layout after content/container changes. A graph viewport is not automatically another Scroll Area, Tree View or selection group.

The screenshot's dark background, blue strokes, small corners and content hierarchy are visual direction, not approved exact tokens or a dark-only theme. Its labels are example data. The Pro index returned no direct Diagram component match; do not interpret that as a full absence of related layouts.

Return fixed-position rerouting to package research if it becomes required: ELK relayout may move other nodes. Before inventory approval, resolve graph data/parts, scale, node/edge labels, focus/navigation/relationship alternatives and dynamic content. Browser responsiveness, rounded-corner clearance and house controls remain unverified. Existing Phase2 family mappings remain the next walkthrough item; this addition does not advance to Phase3 or approve source implementation.

## Phase 2 closure review

Closed 2026-09-19 after the remaining family and terminology walkthrough. [Answers and evidence](../alignment/evidence/phase-2-closure-2026-09-19.json), [terms and return points](../alignment/terms.md), [full file/AST census](../alignment/evidence/phase-2-terms-census-2026-09-19.json).

The complete Entity Content, Entity List, Items, Tags, Appbar, Topbar, Side Nav, Subnav, Chip, Logs, Switch and Switch Control sources were read. Relevant existing docs/styles and the prior complete Material/Pro reviews were reused. [Shadcn Base Item](https://ui.shadcn.com/docs/components/base/item) was reread. Peter selected Item parts plus List and appropriate layout/surface compositions, removing the three old companions. Tags also disappears while Tag remains. His later clarification explicitly favours Stack/HStack/VStack for ordinary layout; Group is for its specific attached/shared-presentation features.

Appbar and Topbar both supply sticky header presentation but different content arrangements. Peter selected one flexible App Bar. Side Nav/Subnav supply nav regions and link styling without route/selection ownership; Peter selected compositions, preserving real links/current-page state rather than converting them to Tabs. The docs application consumes Appbar, and Topbar/Side Nav share Shell's generated sheet; migration must cover those consumers/dependencies.

Logs fixes HTTP-specific fields and provides no streaming controller. Peter selected Table/Accordion event-log examples, informed by the complete Pro event-log review. Static history and live announcements remain distinct; role=log cannot be dropped or copied without reviewing the actual use.

Forms is a documentation guide with tags=[], not a registered component. The current exports are TanStackFormController and bindField in shared/form.ts; native forms and optional TanStack Form remain selected. Correct the register rather than treat the guide as deleted form capability.

Current Switch/Switch Control have radio and form behaviour. Peter selected the Radio Group approach for Segmented Control, with Group presentation and shared-indicator motion; the full earlier Chakra/Radix/Material comparison already establishes that their implementations differ. This does not adopt a reference engine or change Tabs' panel responsibility.

Current Chip is a native button with persistent aria-pressed. [Radix Toggle docs](https://www.radix-ui.com/primitives/docs/components/toggle) and its full implementation match this purpose. Chakra Toggle was verified in published 3.37.0 runtime/types plus its wrapper and four examples; the docs URL failed, so [published runtime](https://unpkg.com/@chakra-ui/react@3.37.0/dist/esm/components/toggle/toggle.js) and [Button composition](https://github.com/chakra-ui/chakra-ui/blob/1ff9873754e9913fc3d849d23c0844a628f5f20d/apps/compositions/src/ui/toggle.tsx) are the evidence. [Material FilterChip source](https://github.com/material-components/material-web/blob/56a486b147b8b7e95e6e8035fa02aed7e0009a85/chips/internal/filter-chip.ts) also uses pressed-button behaviour but supplies additional removal/action contracts. All four M3 Chips article bodies were read; dynamic tokens and 16 spec figures were not visually inspected. The complete Pro corpus has no direct Toggle/Chip imports or aria-pressed/onPressedChange source matches. Peter selected Toggle Button within Button family, not the broader Material Chip family.

The final source census enumerates 649 files and 150 component implementations. The six naming selections cover full-word size tiers, shape versus radius, meaning-specific value/interaction states, Heading/text roles, Open/Expanded/Visible, and shared acme- event meanings. The final AST recheck records 777 property declarations plus one accessor, 386 distinct names, 56 named slots / 128 occurrences, 31 literal acme- names / 74 sites and seven dynamic event sites. It corrects the earlier 80-site report; no source changed between checks. Generated/private values are not automatically public interfaces.

The [terminology record](../alignment/terms.md) classifies positioning, clearability, color/palette/intent, public/private CSS variables, family suffixes and abbreviations. Existing decisions settle those meanings; exact API shapes, supported values, event payloads, defaults and migration paths remain scheduled Phase 4/5 work. No additional component-purpose choice is hidden in those mechanical mappings.

Phase 2 closure does not certify browser behaviour or complete all visual implementation research. Retain the Material Progress and Chip coverage limits, shared Toolbar/nested-control acceptance cases, and Flow Diagram worker/layout constraints as explicit inventory preconditions. Phase 3 starts only when Peter says.

## Phase 3 initial directions and evidence audit

### Closeout of content and interaction candidates

Re-read the complete src/shared/places.ts and src/shared/interaction.ts during the architecture closeout. Keep both responsibilities in the existing modules. This is a technical recommendation within the agreed consistency pass, not a new component family or a new user decision.

Places owns knowledge of the host's content regions. Its current default query searches descendants, so a nested component's slot attribute can count as host content; its MutationObserver watches direct child-list changes only. The platform exposes actual slot assignment through [assignedElements](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/assignedElements) and [slotchange](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/slotchange_event). Slot assignment and changes within assigned content are different observations. Refine the existing module around declared slot ownership, retaining pre-render initialization and reconnect behaviour. Do not equate arbitrary descendant queries, assigned elements, text nodes, fallback content or visual visibility. Each consuming inventory entry specifies what counts as present.

Interaction owns transient presentation and the listeners that produce it. The earlier saved teardown probe already establishes a missing temporary-listener cleanup path. Put those listeners under the same lifecycle owner; handle replacement, disconnection and cancellation. Selection, form values and widget-specific commit/cancel outcomes stay with their controls. This consolidates the source-backed recommendation without another synthetic test round.

The selected theme architecture already requires nested inheritance and separate preference storage. Carry that responsibility into the inventory. CSS supplies inheritable appearance; runtime theme information is limited to consumers that actually need it. Exact scope authoring and notification interfaces remain Phase 4 work, with moved scopes, custom themes and originating-overlay scope as acceptance cases. The existing root-only mirror is not a candidate for the final nested-theme contract. No new theme runtime or dependency is selected.

Peter started Phase 3 and selected overlays first, composable controllers, native surfaces, store-backed public state properties, modal resources held through owned exit, a shared native-form module, and theme resolution separate from preference storage. The [Phase 3 review](../alignment/phase-3-review.md) records the accepted directions, source-based candidates and unresolved interfaces. [Answers and audit](../alignment/evidence/phase-3-checkpoint-2026-09-19.json).

The current problem evidence includes six separate Floating UI placement/autoUpdate pairs, five scroll-lock uses and 42 Interaction constructions across 34 files. The unused Overlay base has no subclasses. Existing output paths and style ownership are spread across the split script, generator and build-time reverse parsing. These observations justify investigations into shared modules; they do not prove a particular replacement design is best.

The style-production question was premature: Peter requested source/community-practice research instead of selecting CSS-first or Lit-style-first. He then reaffirmed evidence-first decisions and best implementation quality over speed, ease or convenience, and requested retrospective reevaluation. The [method update](systematic-approach.md#evidence-and-implementation-quality-reaffirmation) and [audit](../alignment/phase-3-review.md#evidence-audit) keep that correction explicit.

No current audit finding requires reversing the accepted directions. Comparative evidence is still incomplete for exact controller/base seams, state bridging, native-form mechanics and theme propagation. Preserve all-engine verification, compiler/CEM/React compatibility and nested lifecycle tests as gates. An implementation recommendation can change if those checks warrant it; do not silently overwrite Peter's earlier choice or treat selection as proof.

Subsequent style follow-up: Peter selected [compiled CSS feeding generated Lit modules](../decisions/style-production.md) after the completed source/artifact comparison. The earlier unselected/premature-recommendation account above is historical; tool choice and implementation acceptance remain open.
