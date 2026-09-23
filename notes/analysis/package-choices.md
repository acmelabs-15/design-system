# Package choices: what we use, what we should, what to avoid

For the systematization pass, the current direction is [native Lit behaviour ports using the full house stack](../decisions/zag-behaviour-ports.md) for five controls, with Zag as a source reference and no Zag runtime or adapter. This supersedes the earlier actual-package selection retained in the historical investigation below. Published match-sorter and the independent number utility are selected; the linked decision notes identify other accepted additions. Installation and implementation remain gated by the migration plan.

Researched 2026-09-10 against the npm registry and browser compatibility data. Every claim that changes
what we do was checked against this repository first. Linked from `PLAN.md`.

Peter's rule: for anything complex, use a well-regarded package rather than hand-rolling, and research
what the community holds in high regard — including whether a popular older package has been superseded
by something smaller and more modern. This file is the standing record of those judgements.

## Confirmed correct, keep

| Choice | Evidence |
|---|---|
| `@floating-ui/dom` for overlay placement | Still the standard. CSS anchor positioning now exists in all three engines, but the Safari and Firefox floors are very recent, so it is not a replacement yet. |
| `@internationalized/date` for dates | Keep. The native `Temporal` API has reached the final standards stage and ships in Chrome, Firefox and Edge, but **Safari has not shipped it**, and the polyfill is about a megabyte. Revisit when Safari ships. |
| `@tanstack/lit-virtual` for virtualization | Keep, and **do not** ship the Lit labs virtualizer alongside it. That package has had no functional work in fourteen months and 86 open issues; TanStack shipped days ago. |
| TanStack Store for state | Peter's rule, and correct: it is signal-based underneath, so it is a store built on signals rather than a heavier layer over them. It holds an element's own state too, per instance, as TanStack Form does — see [../decisions/state-on-tanstack-store.md](../decisions/state-on-tanstack-store.md), which records the evidence and replaces a narrowing I wrote without asking. |
| `@zag-js/remove-scroll` for scroll lock | Keep. |
| Vendored command-score | Keep. The npm package is **archived and last published in 2016**; the upstream library vendors it too, and ours is parity-driven. |

## Changed as a result

- **Removed `@lit-labs/virtualizer`.** It was a dependency that nothing imported, and the research
  confirms it is stagnant. TanStack is our virtualization.
- **Removed `@lit-labs/signals`** earlier the same session, for the same reason: a dependency with one
  unused import.

## Corrections to what we assumed

**There is no Zag adapter for Lit.** Verified: the package returns "not found" on the registry, the
framework directory in their repository lists preact, react, solid, svelte, vanilla and vue with no Lit,
and the community pull request adding Lit examples has been open and unmerged since July 2025.

That materially changes the open question in the hand-rolled audit. Adopting Zag means using their
vanilla package plus a reactive controller we write and maintain, and every machine used inside a shadow
root needs its root node passed explicitly or positioning breaks silently.

The case for it is stronger than expected in one respect: their popper package depends on the same
floating-ui we already use, and their date utilities take `@internationalized/date` as a peer dependency,
so it composes with our choices rather than competing with them.

**The recommendation is per-machine, not all-or-nothing.** We own all rendering and styling, so pixel
parity is unaffected either way. The genuine risk is behaviour: their state machines encode their
interaction decisions, and our target is a specific reference implementation. So adopt a machine only
where the reference's behaviour is conventional, and keep ours where the reference diverges. That
decision belongs to each element's port, on evidence, not to a blanket policy.

## Worth adopting

| Need | Choice | Why |
|---|---|---|
| Fuzzy filtering for the combobox | Compare `uFuzzy` and `fuzzysort` against our real option lists before choosing | Ours is 117 hand-written lines. Do not reach for `match-sorter`, which pulls a Babel runtime, or Fuse, which is the heaviest and slowest of the set. Measure on our data. |
| Focus trap | Buy it rather than build it | Neither leading option handles `delegatesFocus`, so read the shadow-DOM handling before choosing. |
| Roving tabindex | **Keep ours.** | No package does this well, and it needs knowledge of our slot assignment that only we have. A 72-line controller beats a dependency here. |
| Schema validation | **Ship none.** | TanStack Form consumes the standard schema interface natively, so accepting that interface generically costs zero bytes. Shipping a validator would force every consumer to bundle a second one. |
| Drag, sort, resize | Framework-agnostic options exist; check status before use | The best-known sorting library is stagnant with hundreds of open issues and mutates the DOM in ways that fight Lit. |

## Delete on sight

Polyfills the platform has absorbed: element internals, inert, focus-visible, CSS anchor positioning,
and duration formatting. None is needed at our support floor.

## A real gap worth naming

**Plural message formatting.** Lit's localisation package cannot express a plural rule, an open issue
since 2021. Across 151 elements that is 151 chances to be wrong in a language with plural categories.
The original investigation recorded no native message-format support. That is historical platform evidence, not a freshly verified browser-support claim. No message-format engine is selected; revisit only if an inventory requirement needs it.

## Unverified

- No sizes measured under our own build. Measure before choosing between fuzzy matchers.
- No match-quality testing on our real option data.
- `@tanstack/lit-form` is by far the least-travelled path in our stack, with a major version in alpha.
  Worth watching rather than acting on.

## Phase 1.4: library gaps, checked 2026-09-19

**Later strategy correction:** the Zag runtime/adapter selections in this historical evaluation are superseded by [native Lit ports with TanStack Store](../decisions/zag-behaviour-ports.md). Keep the selected capabilities and source evidence; do not implement the earlier adapter plan.

**Review outcome:** use the selected packages for the agreed interactive controls; retain platform behaviour and composition where they satisfy the requirement. The table distinguishes decisions from remaining proposals. Benchmark dependencies were installed only under `/tmp/acme-phase1-20260919/bench`; no project dependency or implementation changed.

| Need | Candidates investigated | Recommendation and cost |
|---|---|---|
| Pin input | Native single input with one-time-code autocomplete; Zag Pin Input; input-otp | **[Decided: Zag Pin Input](../decisions/pin-input-behaviour.md).** Separate character fields, focus movement, paste, masking and code autofill; the Lit/TanStack integration remains to verify. input-otp 1.5.0 requires React and React DOM. |
| Number input | Native number input; internationalized/number; Zag Number Input | **[Decided: Zag Number Input](../decisions/number-input-behaviour.md).** Formatted numbers, decimal-safe stepping, limits and press-and-hold controls. Zag already uses internationalized/number; adapter, locale and form behaviour remain to verify. |
| Scroll area | Native browser scrollbars; Zag Scroll Area; OverlayScrollbars | **[Decided: custom bars over native scrolling, using Zag](../decisions/scroll-area-behaviour.md).** Matches the capability of Chakra and Radix Scroll Area. Dragging, keyboard access, visibility, resizing and cleanup remain to verify. |
| Timeline | Semantic list/time content; Chakra Timeline | Compose the agreed primitives and generated connector styles. Chakra's [documented anatomy](https://chakra-ui.com/docs/components/timeline) is item/content/indicator/separator composition; no separate behaviour package is justified by this requirement. |
| Steps | Progress-only composition; interactive Steps with Zag or house logic | **[Decided: interactive Steps using Zag](../decisions/steps-behaviour.md).** Step selection, Previous/Next controls and matching content, following Chakra. Navigation defaults and the form-validation boundary still need an inventory contract. |
| Focus containment | Native dialog and Popover API; separate focus-trap packages | Preserve the native dialog path. Audit the non-modal overlays against their own keyboard contract before adding another focus owner. |
| Fuzzy filtering | Current vendored helper; match-sorter; fuzzysort; uFuzzy; Fuse | **[Decided: published match-sorter](../decisions/match-sorter.md)** for the existing ranked-filter contract, subject to broader compatibility tests. Faster candidates produced different answers on the example probe. |

### Portability and state ownership

The [current Zag installation guide](https://zagjs.com/overview/installation) documents React, Vue, Svelte and Solid adapters, not Lit. The registry survey did not establish a published `@zag-js/lit` package. Peter explicitly accepted actual package use after questioning whether Zag was only a reference. The [integration decision](../decisions/zag-lit-integration.md) preserves Lit rendering and TanStack-owned component state; the integration is not proven here.

The [official framework-adapter guide](https://zagjs.com/guides/framework-adapters), read during the walkthrough, gives a concrete porting route. Port an official adapter and map reactive state, controlled values, refs, computed values, effects and mount/unmount handling. Preserve Zag's transition helpers and effect ordering. Also normalize properties/events and apply/remove DOM bindings. This is more than the thin wrapper described in the initial investigation.

Source inspection of the scratch-installed 1.44.0 machines confirms that their context is supplied through `bindable`; `createMachine` in core returns the configuration after preparing state indices. Pin Input also owns focus/count state, and Number Input owns additional state such as disabled-fieldset tracking. Controlling only `value` therefore does not settle the TanStack rule for every state field. Mapping the adapter to TanStack is a supported design direction, not a tested implementation. Shadow-root targeting, form association and reconnect cleanup remain required integration work. Do not create two independently writable copies of one control state.

Measured minified ESM exports, gzip: Zag Pin 5,779 bytes; Number 11,015; Scroll Area 7,620; internationalized/number 2,869; OverlayScrollbars 14,585. These include the exported machine/connect surface or primary entry, not our future adapter, templates or CSS. Shared dependencies mean costs are not additive. [Measurements](../alignment/evidence/package-bundles.json).

### Is an older popular option being displaced?

The [registry survey](../alignment/evidence/package-survey.json) records release dates, versions and two weekly download samples. Zag's three candidates have current 1.44.0 releases; OverlayScrollbars 2.16.0 also has a 2026 release. Both show greater downloads than the sampled 2025 week. The evidence supports active alternatives, not a claim that one has made the other obsolete. input-otp's large adoption belongs to a React-specific contract. Package popularity does not remove the Lit integration cost.

The scope is bounded to the controls Peter selected; it is not permission to move every component onto Zag. Their interfaces still need the relevant browser acceptance cases for IME, paste, mobile keyboards, disabled state, forms, scrolling and reconnects. Zag Steps was investigated after the initial benchmark and has no recorded local size measurement. All project installation and implementation waits for Phase 5 approval.

### Scroll Area: reference practice and selected package

The current Scroller (`src/components/scroller/scroller.ts`) uses browser scrolling, reads overflow edges, and provides fades plus optional previous/next buttons. Its generated stylesheet hides browser scrollbars. That is not evidence that the future Scroll Area should omit visible controls. Peter subsequently selected [Scroll Area replacing Scroller](../decisions/scroll-area-behaviour.md#replace-scroller); exact capabilities and interfaces remain inventory work.

[Chakra Scroll Area](https://chakra-ui.com/docs/components/scroll-area) provides styled bars and handles, hover/always visibility options, sizes and both axes. Its [implementation](https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/components/scroll-area/scroll-area.tsx) wraps Ark; [Ark directly imports Zag Scroll Area](https://github.com/chakra-ui/ark/blob/main/packages/react/src/components/scroll-area/use-scroll-area.ts). Zag's inspected `getViewportProps` uses `overflow: auto`; browser scrolling remains underneath its custom controls.

[Radix Scroll Area](https://www.radix-ui.com/primitives/docs/components/scroll-area) also uses custom controls with native content and keyboard scrolling. [Radix Themes](https://www.radix-ui.com/themes/docs/components/scroll-area) adds handle size/radius and axis options. Radix's [React implementation](https://github.com/radix-ui/primitives/blob/main/packages/react/scroll-area/src/scroll-area.tsx) and [manifest](https://github.com/radix-ui/primitives/blob/main/packages/react/scroll-area/package.json) use its own logic, neither Zag nor OverlayScrollbars; React/React DOM requirements prevent direct use as our Lit component.

The first recommendation favoured device conventions through browser bars. The review corrected its weighting: our named Scroll Area is intended to provide the custom-control capability in the reference systems. Peter chose custom bars with native content scrolling, then selected Zag after the package comparison. Radix still advises ordinary native scrolling where CSS customization suffices; that advice does not describe the full capability of its custom Scroll Area.

[OverlayScrollbars](https://github.com/KingSora/OverlayScrollbars) remains a credible alternative: a standalone engine with custom bars, native scrolling and documented existing-viewport configuration. It creates/manages scrollbar elements and requires lifecycle/style integration. Zag lets our Lit templates own those elements and uses Chakra's underlying rules, fitting the planned common adapter. Neither was tested in this repository's shadow-root arrangement; the selection is conditional on acceptance tests, not a proven superiority claim.

### Steps: interactive scope and reference implementation

Peter chose interactive Steps over a progress-only composition, then selected Zag Steps. [Chakra's documented component](https://chakra-ui.com/docs/components/steps) includes step triggers, matching content, Previous/Next controls, completion and navigation validation. [Chakra wraps Ark Steps](https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/components/steps/steps.tsx); [Ark directly imports `@zag-js/steps`](https://github.com/chakra-ui/ark/blob/main/packages/react/src/components/steps/use-steps.ts).

The inspected [Zag machine](https://github.com/chakra-ui/zag/blob/main/packages/machines/steps/src/steps.machine.ts) owns the current step, change/completion notifications, bounded Previous/Next actions and checks before forward navigation. The exact interface and form-validation boundary are still to specify. This is a navigation component, not approval of a separate form engine or a complete workflow system. Our existing Tabs selects panels, but does not itself supply the Steps completion and validation contract.

### Fuzzy filtering on our own example data

The current helper is a vendored match-sorter algorithm with an MIT notice (`src/shared/match-sorter.ts:1`), not an unrelated invented scorer. Extracting visible option labels from `docs-src/pages/components/combobox.ts` yields 33 unique labels. Across nine queries, current match-sorter 8.3.0 returns the same ordered results as the helper on all nine; fuzzysort and uFuzzy match one each; Fuse matches none.

| Implementation | Mean microseconds/query | Queries matching current result | Minified gzip bytes |
|---|---:|---:|---:|
| Existing helper | 20.50 | 9/9 | Not measured separately |
| match-sorter 8.3.0 | 16.79 | 9/9 | 3,515 |
| fuzzysort 4.0.2 | 2.55 | 1/9 | 8,517 |
| uFuzzy 1.0.19 | 5.33 | 1/9 | 4,291 |
| Fuse 7.5.0 | 57.18 | 0/9 | 9,794 |

Method: Bun 1.4.0, 50 warmup cycles, then 1,000 repetitions of all nine queries; default candidate settings. [Raw results and queries](../alignment/evidence/filter-comparison.json). This is a small local compatibility/performance probe, not an exhaustive ranking proof or a large-list benchmark. Current match-sorter still declares Babel runtime and remove-accents dependencies; the measured bundle accounts for retained code rather than treating a dependency name as the cost. The earlier blanket recommendation to avoid it is superseded by these measurements.

Peter selected the published package after this comparison. [Chakra's ComboBox example](https://chakra-ui.com/docs/components/combobox#custom-objects) uses an `Intl.Collator`-based contains filter; it is not evidence that our ranked contract should change. The [decision](../decisions/match-sorter.md) requires wider compatibility checks before replacing the local implementation. Keep the Command Menu scorer separate.

## Phase 1 extension: additional package decisions

The extension adds [a separate React integration package](../decisions/react-integration.md), [consumer compatibility with TanStack Table](../decisions/tanstack-table-compatibility.md) and [optional TanStack Form integration over native forms](../decisions/native-and-managed-forms.md). TanStack Table is not a selected design-system runtime dependency: the consuming application sets it up and owns its state, processing and workers. TanStack Virtual is explicitly chosen for both Lit and React virtualization. [Results pagination](../decisions/results-pagination.md) is reusable UI with application-owned page state and loading. No dependencies changed during research.

[Toast remains on the house stack](../decisions/toast-behaviour.md), following Base UI interactions. The later explicit addition of [Zag Splitter](../decisions/resizable-panes.md) does not extend Zag approval to Toast or other controls. The [published Zag probe](../alignment/evidence/additional-probes-2026-09-19.json) and [overlay comparison](floating-surface-shadows.md#phase-1-extension-toast-and-rich-help) record why Toast was a separate decision.

The [Oxlint/Oxfmt/Ultracite/Stylelint direction](../decisions/lint-toolchain.md) is selected development tooling. [Intent](../decisions/intent-tooling.md) and [TanStack Devtools](../decisions/design-system-devtools.md) are now selected, along with [consumer skills](../decisions/consumer-skills.md) and a [documentation/API MCP](../decisions/design-system-mcp.md). [Live AI control is outside this pass](../decisions/ai-authoring-scope.md). Config practices remain recommendations in [developer tooling](developer-tooling.md#tanstack-config); no blanket approval of additional dependencies follows.

## Resizable pane package comparison

**Current strategy:** the comparison below records why Zag was selected originally. Peter subsequently chose [native Lit/TanStack behaviour ports](../decisions/zag-behaviour-ports.md), rejecting the Zag runtime and adapter. Its source remains a reference, including the defects identified below.

Peter selected [@zag-js/splitter](../decisions/resizable-panes.md), subject to the corrections and integration checks below. Investigated versions on 2026-09-19: Zag Splitter 1.44.0, react-resizable-panels 4.12.4, Window Splitter web-component/state 1.2.1, Web Awesome 3.13.0 and Spectrum split-view 1.12.2. Versions are research snapshots, not future pins. [Evidence](../alignment/evidence/resizable-panes-2026-09-19.json).

- **Zag:** framework-neutral interaction machinery for multiple panes, constraints, controlled sizes, collapse and keyboard handling. Chakra's source delegates to Ark, whose hook delegates to Zag. Read Zag connect/types/machine and resize-by-delta, plus Chakra/Ark source. Markup/style ownership and reuse of the already planned integration are the reasons for selection. No comparative FPS, bundle-size or reliability advantage was measured. @ark-ui/react 5.39.2 declares splitter 1.43.3, while the directly probed Zag release is 1.44.0; do not conflate them.
- **Window Splitter:** shared state/interface packages and Lit/React implementations. The complete web-component entry and state manifest were read. Its own machinery manages layout and optional persistence; the Lit implementation owns context, registration, observers and inline layout. Adapting those responsibilities to our state/style/lifecycle rules would be a separate integration. The main state manifest was 1.2.0 while npm reported 1.2.1; main-source observations are not proof about every published file. The core package declares big.js, not a React runtime.
- **Web Awesome Split Panel:** a Lit-native two-pane implementation with nested composition, pointer/keyboard controls, snapping and a primary fixed-size option. Read split-panel.ts in full. Its own base class, localization, state, style and lifecycle are part of the adoption cost. The full package manifest has other dependencies; that is not a measured selective Split Panel bundle. Larger layouts require nesting. It was an offered alternative, not selected.
- **Spectrum SplitView:** another Lit implementation for two sibling panes with constraints, collapse and keyboard controls. Read 1st-gen/packages/split-view/src/SplitView.ts in full. It carries Spectrum base/shared/style responsibilities. It is a reference, not a selected package or proof of the complete house contract.
- **react-resizable-panels:** read its official README and registry metadata. It supports multiple panels, constraints, collapse, several CSS units, layout-change callbacks and keyboard separators, but its public package requires React/ReactDOM. It does not directly supply our shared Lit implementation. No separate React-only resizing engine was chosen.

Material Web 2.5.0 was checked as the required Lit reference; the main tree has no identified resizable-pane implementation. Radix's Separator alone has no resizing behaviour. Package recency and capability were inspected; no claim that a newer package is displacing an older one is established by this bounded survey.

### Published Zag checks and unresolved defects

Downloaded the 1.44.0 tarball and verified its SHA-512 against registry metadata. Installed it with Bun and scripts disabled only in a temporary probe directory (seven packages), not the project. Direct connector probes used a synthetic service and identity property normalizer; they do not test a real framework adapter or browser.

For side-by-side/horizontal layout, getResizeTriggerProps reports role separator with aria-orientation horizontal; for vertical layout it reports vertical. Separator orientation should describe the divider, which is perpendicular to the arrangement of panes. Correct this at its source and verify the resulting house markup before release. No upstream report/patch was sent and no local project fix was made.

keyboardResizeBy is documented as pixels, but connect forwards the number as delta and the machine passes it to percentage-based resizeByDelta. A direct call to the published sizing helper with [50,50], delta 5 and 10–90 limits returned [55,45]; at a 500px group that is 25px, not 5px. Resolve the documentation/interface mismatch before choosing the house unit. No step default is selected here.

The collapse/reopen paths differ as detailed in [foundation analysis](design-foundations.md#collapse-and-saving). The selected previous-size behaviour needs consistent keyboard/pointer handling. Zag also returns layout styles and can inject cursor styles: the house integration must reconcile these with generator ownership rather than bypass the pipeline. Only controlling size does not settle all machine/context state under the TanStack rule. No Lit adapter or full browser acceptance was proven.

## Native Lit port strategy

Peter reopened the earlier Zag integration decision and explicitly rejected both a custom Zag-to-Lit adapter and Zag's machine/state-management mechanism. [Current decision](../decisions/zag-behaviour-ports.md): port the needed behaviour for the five selected controls into house Lit components with the established TanStack Store integration. React wraps those same components. Capabilities remain selected; the implementation strategy changes.

Fresh official evidence changes the support picture: the [adapter guide](https://zagjs.com/guides/framework-adapters) now links a [vanilla implementation](https://github.com/chakra-ui/zag/tree/main/packages/frameworks/vanilla). npm reports @zag-js/vanilla 1.44.0 published 2026-09-13T19:19:32.791Z, with core/store/types/utils dependencies at 1.44.0. npm returned 404 for @zag-js/lit; [PR 2698](https://github.com/chakra-ui/zag/pull/2698) is open, draft and unmerged (checked 2026-09-19). No claim that vanilla support is absent should survive this check.

Read vanilla index.ts, bindable.ts, spread-props.ts and machine.ts in full. VanillaMachine constructs machine context/state, subscribes through @zag-js/store, runs actions/effects/watchers and exposes start/stop/updateProps/subscribe/service. bindable stores values using Zag proxy state. spreadProps handles DOM attributes/properties/styles/listeners. This avoids writing a new machine interpreter, but it still carries the Zag state runtime rejected by Peter. It is a researched alternative, not an adopted route.

The inspected published @zag-js/core 1.44.0 createMachine prepares state indexes and returns the machine configuration. The full execution/state mechanism comes from the adapter/runtime around that definition. Peter's objection concerns carrying that mechanism into the house system, not whether a configuration factory alone stores values. Replacing createMachine while reproducing the same interpreter would miss his intent.

The direct-port route preserves one Lit/TanStack implementation and @lit/react consumption. Its cost is ownership of the control behaviour: state changes, effects, focus, cancellation, form association, constraints, restoration and cleanup all need explicit house code/tests. Track the upstream source version and license notices, select relevant behavioural tests, and verify in all three engines. The newly found vanilla option does not override the state constraint. No runtime package, adapter or source port was installed/built during this reconsideration.

The subsequent mappings below cover each control's required behaviour and reusable algorithms, and the independent number utility is now selected. Follow the current pass handoff for the next subject. Preserve the no-implementation gate and do not reopen selected user-facing features merely because their implementation source changes.

Peter's further clarifications allow new Lit components, rebuilds and replacements; the port need not fit an existing class. It must also use the whole house stack: Lit Motion, generated styling and all applicable mandated packages/conventions, as well as TanStack Store. Porting means preserving the selected behaviour while adapting its implementation to that stack. Future analysis must map state, effects, motion, styling, forms, focus and cleanup together, not replace the store alone.

## Five native behaviour-port mappings

Research mapping, 2026-09-19. This is not the approved Phase 4 interface or Phase 5 migration plan. No source implementation changed. [Evidence](../alignment/evidence/native-port-mapping-2026-09-19.json).

### Shared house responsibilities

- State and derived values use the established per-instance @tanstack/lit-store approach. StoreSelector handles rendering and StoreEffect handles effects; lifecycle cleanup remains explicit and must preserve the installed reconnect fix. Do not replace Zag's machine with another generic interpreter.
- Lit owns native DOM controls, templates, focus targets and event bindings. React wraps the same components. New classes and shared controllers are allowed; existing Input/Scroller interfaces do not constrain the final design.
- The generator owns shipped style declarations, state treatments, density, RTL, icons and theme roles. Lit Motion and the selected motion roles own visual transitions. Real-time drag/scroll geometry follows input directly; do not add animation lag or replace native scrolling with a new animation engine.
- Pin Input and Number Input need the selected native form contract, plus optional managed-form binding. Current form.ts already binds value/checked/errors and blur, but it does not prove all multi-field focus, validity, reset or disabled-fieldset semantics. Repair shared form gaps during the approved implementation.
- Each port carries source provenance, applicable license notices and adapted behaviour tests. Source defaults and convenience features are evidence for the inventory, not automatic expansion of the agreed scope. No generic Zag runtime or property-spreading adapter is required.

### Pin Input

Read pin-input.machine.ts, pin-input.utils.ts and pin-input.connect.ts. Map the character sequence, focused index, field count and derived completion into TanStack state and ordinary functions. Port paste distribution, replacement, deletion, focus movement and validation; bind native beforeinput/input/composition/paste/keyboard events directly in Lit. Preserve the full code for native form submission and the selected masking/autofill capabilities. Label each field and test mixed input methods and RTL.

The upstream helper accepts ASCII numeric/alphabetic classes by default; locale/numeral and pattern policy must be explicit in the inventory. Its completion can invoke blur/submit options; those defaults were not selected merely by reading the source. The house must not dispatch completion twice when synchronizing controlled values or restoring a form. Focus changes need the correct Lit update ordering, not copied raf/microtask calls without a reason.

Read the full [Pin Input end-to-end test file](https://github.com/chakra-ui/zag/blob/main/e2e/pin-input.e2e.ts): typing, deletion/no-hole shifting, pasted/truncated content, mid-sequence edits, focus clamping, same-key advancement, Tab re-entry, controlled values, validation, RTL and optional completion behaviour. The file supplies candidate scenarios; no upstream suite was run, and auto-submit remains an inventory choice.

### Number Input

Read number-input.machine.ts and number-input.utils.ts. Keep editable text distinct from parsed numeric value so empty and partial input survive typing. Derive formatted value and limit/step availability. Port stepping, clamping/commit behaviour, caret restoration and press-and-hold cleanup into native Lit/TanStack code. Shared form semantics cover reset, fieldset-disabled state, validity and serialization. Lit Motion handles visual state transitions; repeat timers and pointer input are lifecycle-managed behaviour, not animation.

The source also includes optional wheel input and pointer-lock scrubbing. Those are not automatically selected capabilities. Its 300ms repeat delay and 50ms interval are research values, not house defaults. Decimal stepping and formatting precision require their own tests; a parser package does not solve arithmetic precision by itself.

Read the full [Number Input end-to-end test file](https://github.com/chakra-ui/zag/blob/main/e2e/number-input.e2e.ts): empty input, limits, keys/modifiers, stepping, formatted currency, caret preservation, invalid characters, selection replacement, deletion and zero normalization. It contains skipped scrubbing and increment-longpress tests. Test presence is not evidence those behaviours pass. The native port needs active tests for the selected press-and-hold capability.

### Scroll Area

Read scroll-area.machine.ts in full and the existing Scroller. The browser remains the source of scroll position. TanStack state represents geometry, overflow sides, track/thumb visibility and interaction state. Port thumb sizing, track-click/drag translation, RTL offsets, corner layout and visibility logic as ordinary functions/controllers. Observe viewport/content changes and clean up listeners, timers and observers.

Current Scroller already exposes its container and uses TanStack Pacer for deferred edge reads, but has its own physical-left/right assumptions, button locks and decorative fades. Reuse a proven capability only after testing; do not force Scroll Area into that class. Keep native wheel/touch scrolling and chaining at boundaries. Custom tracks and hover/fade treatments use generated styles and the shared motion policy; TanStack Virtual remains separate for consumers who render only visible content.

The source has a 20px thumb-size minimum and 1000ms visibility timeout, which are not approved house values. A queued timeout inside its ResizeObserver callback is not cancelled by observer disconnect alone. Tiny tracks, zero travel, RTL wheel boundaries, late content, hidden-to-visible layout and cancellation need focused tests. No Scroll Area-specific test file was found by the bounded repository-tree name search; this is not a claim that no shared tests cover it.

### Steps

Read steps.machine.ts and steps.connect.ts. Current step, completion and navigation availability can be expressed as TanStack values plus ordinary next/previous/set/reset functions. Lit renders the chosen controls and corresponding content. The source's linear mode, skippable/validity callbacks and completed sentinel are inputs for the inventory; they do not settle asynchronous validation or the form boundary.

Its connector supplies tab/tablist/tabpanel roles and hidden content. The house must verify that role/keyboard/focus behaviour together instead of copying ARIA labels without the matching interaction. Programmatic target changes and count changes need bounds checks; source validation only at initial entry is not a complete contract. Motion handles appropriate indicator/content transitions while accessible state remains synchronous. No dedicated Steps test file was found in the bounded name search; house acceptance coverage remains required.

### Resizable panes

Use the already inspected Splitter constraint and size-distribution algorithms as source material. Represent pane sizes, collapse state, previous-open sizes and interaction state with TanStack Store. Implement native pointer/keyboard geometry and resize observation through house lifecycle code. Keep application-owned saving and the selected previous-size restoration.

The port must fix separator orientation, resolve keyboard-step units and unify collapse/restore across input paths. Generate layout/target styles; use Lit Motion for appropriate collapse/restore transitions, while an active drag follows input directly. Test nested layouts, impossible/changed limits, hidden content focus, RTL, restored preferences and disconnect. The repository-tree search locates splitter.e2e.ts and splitter.utils.test.ts; their complete detailed review/adaptation still belongs to port preparation, not a claim of completed port verification.

### Independent number parser recommendation

**Selected by Peter after the probe:** [@internationalized/number](../decisions/number-utilities.md) for Number Input parsing/formatting utilities. Zag's number utility already uses its NumberParser, and the package is independent of Zag and React. The root package.json and bun.lock do not yet list it; source installation waits for migration approval. npm reports 3.6.8, Apache-2.0, depending on @swc/helpers; this is a research version, not an approved pin.

Read the full [Adobe NumberParser reference](https://react-aria.adobe.com/internationalized/number/NumberParser). It parses locale-specific decimals, percentages, currencies and units, detects numbering systems and validates incomplete numeric input. Locale and expected format must be known; it is not an unrestricted natural-language number parser. Parsing and partial-input validation are distinct. The documentation has differing examples/prose around partial unit strings, so test the selected acceptance rules rather than infer them.

An isolated Bun probe of 3.6.8, installed only in a temporary directory with scripts disabled, passed German 1.234,5 → 1234.5; Arabic ١٢٫٥ → 12.5; 12% → 0.12; accounting ($25.50) → -25.5; and accepted '-' and '.' as partial input while complete parse returned NaN. These six cases establish parser API behaviour only, not a Lit control, form, IME or browser pass. [Probe evidence](../alignment/evidence/native-port-mapping-2026-09-19.json).

The alternative was a house parser built around Intl formatting data, with its locale/partial-input behaviour maintained here. Peter selected the independent package because that responsibility is already its purpose and it introduces no competing UI/state framework. Do not repeat that question or reopen the rejected Zag runtime to obtain the parser transitively.

## Flow Diagram library review

Researched 2026-09-19 after Peter supplied a flow-diagram screenshot. [Final decision](../decisions/flow-diagram.md): an interactive viewer using ELK plus a house Lit renderer. [Structured evidence, versions, measurements, source pins and probe options](../alignment/evidence/flow-diagram-review-2026-09-19.json). This extends the current pass; the earlier Phase 1 closure remains a historical checkpoint.

### Requirements and evaluation method

The screenshot contains unequal content-rich nodes, controls, directional arrows, rounded orthogonal bends, labels and a return loop. Peter selected automatic layout/routing, pan/zoom and usable controls inside nodes, not a flow editor. No existing flow/diagram component or package was found in the targeted source-path/package scan. Reference styling must adapt to the house stack.

Separate node layout, obstacle routing, curve/arrow drawing and viewport interaction. A smoothstep or Bézier helper alone does not know about intervening nodes. Assess source and published versions independently. Three parallel research tracks examined layout engines, X6/JointJS and Lit-native packages, while the main review examined Google Graph Renderer, xyflow documentation and a small pan/zoom utility. Search-result counts are not unique-source or complete-repository counts.

### Selected engine: ELK

[ELK](https://github.com/kieler/elkjs) is a layout engine, not a renderer. [Layered layout](https://eclipse.dev/elk/reference/algorithms/org-eclipse-elk-layered.html) accepts node sizes, ports, labels and compound structure; it returns node positions and edge sections. Orthogonal routing, cardinal ports, feedback edges and spacing options directly address this viewer. The caller must measure the real Lit content and labels.

Published elkjs 0.12.0 was investigated. Its complete browser bundle measures 1,609,707 raw bytes / 467,676 gzip bytes. Separate API plus minified worker files total 465,667 gzip bytes. These are in-memory gzip-level-9 measurements of published files, not final house bundle/CDN transfer or browser startup results. Lazy separate delivery avoids charging unrelated components; workers address scheduling, not download size. Metadata reports EPL-2.0 OR GPL-3.0-or-later with secondary-license conditions in the notice; preserve applicable package notices during normal dependency review.

ELK's automatic layout can change other node positions after a resize. Model-order/semi-interactive options do not guarantee unchanged coordinates. Its browser package is not a general router for fixed arbitrary node positions; the separate Java Libavoid integration is not supplied by elkjs. [Maintainer discussion](https://github.com/kieler/elkjs/issues/210). A fixed-position requirement would reopen the engine comparison before inventory approval.

### Geometry probe

The published bundle ran entirely in memory under Bun 1.4.0. Six varied-size nodes form a forward chain, plus a labelled Specs-to-Interview return edge. Fixed cardinal midpoint ports connect forward East-to-West and return North-to-North. This models the screenshot's topology, not its exact coordinates. Layered/RIGHT/ORTHOGONAL layout uses feedbackEdges=true, node spacing 40, edge-node spacing 14 and between-layer spacing 60. These are probe settings, not selected house defaults.

All six edges have sections; nodes, routes and labels have finite coordinates. No node overlaps, diagonal segments or segments crossing unrelated node interiors were found. Repeating after Specs height 140 becomes 280 passes the same checks, but moves other nodes vertically by about 69px. A follow-up checks explicit internal node labels. A generated 100-node/109-edge graph with ten return loops passes the basic geometry checks.

Single observed layout times are about 158 ms for the first six-node case, 44 ms for the resized case and 682 ms for 100 nodes. They are not stable benchmarks or browser-worker timing. The in-memory harness masked Bun's global self to avoid bundled fake-worker runtime misclassification. No library or repository code was patched. Rounded path/stroke/arrow geometry, all edge-label collisions, nested graphs, dense crossings, DOM measurement and screen-reader behaviour were not tested.

### Alternatives: layout and routing

- [Dagre 3.1.1](https://github.com/dagrejs/dagre) has a much smaller ESM artifact,48,559 raw/16,959 gzip bytes including Graphlib. Current source includes dynamic layout history and per-cluster directions; old claims that it is abandoned or has no dynamic support are stale. Its route points do not supply the requested obstacle-aware orthogonal routing/port contract.
- [Libavoid](https://www.adaptagrams.org/documentation/libavoid.html) supports obstacle routing while shapes move/resize and exposes connection pins. [libavoid-js 0.5.0-beta.5](https://github.com/Aksem/libavoid-js) adds 198,677 gzip bytes for JS+WASM; with Dagre,215,636 gzip bytes. It remains a fallback for fixed-position rerouting. The inspected wrapper has no exposed edge-label placement API, needs worker/WASM cleanup integration, and its exports.types points to missing dist/libavoid.d.ts while declarations live in dist/index.d.ts. Metadata is LGPL-2.1-or-later.
- [D2's current JavaScript package](https://unpkg.com/@d2lang/d2@0.1.34/README.md) is @d2lang/d2, not the older @terrastruct namespace. Its compiler can return coordinates/routes without rendering SVG, but input remains D2 markup and its browser compiler/WASM bundle is 11,514,165 raw/8,789,791 gzip bytes. Current releases include open-source TALA; older pages calling TALA proprietary or Dagre unmaintained are stale. The extra translation and payload do not fit measured house nodes as directly as ELK.

### Alternatives: complete renderers

[X6](https://github.com/antvis/X6) 3.1.8 and [JointJS Core](https://github.com/clientIO/joint) 4.3.3 are actively published, framework-neutral candidates. X6's HTML shape can accept an HTMLElement; JointJS can host HTML in a custom view. Both use SVG foreignObject, requiring house-control/focus/transform/animation browser checks. Both separate routers from connectors; basic orthogonal routing is not obstacle routing. Their Manhattan routers may fall back to orthogonal routes that ignore obstacles. Neither reviewed default guarantees exact return lanes or collision-free label placement.

X6 offers built-in pan/zoom and interaction guards. Its HTML update empties/reinserts content unless an effect filter limits updates, creating a Lit focus/state risk. JointJS Core supplies scale/translate and pan/pinch events; its ready-made PaperScroller belongs to commercial Plus. Its official DirectedGraph addon uses Dagre 1.1.4 and handles only the first edge label in its label option. Both still need node measurement and layout integration. X6's complete minified published runtime measured 168,758 gzip bytes; JointJS145,531, excluding layout. These are not selective viewer builds. Peter selected ELK with the house renderer over X6 plus ELK.

[React Flow's own layout guide](https://reactflow.dev/learn/layouting/layouting) separates rendering from external layout/routing. Its React renderer would introduce another framework path. The [xyflow system README](https://github.com/xyflow/xyflow/blob/main/packages/system/README.md) calls the vanilla utilities a shared layer for React/Svelte Flow and explicitly says they are not intended for unrelated libraries; no dedicated public API docs are provided.

[Google Graph Renderer](https://github.com/google/graph-renderer) 1.1.0 is Lit-native and accepts custom node/label templates. Its published core is 16,152 gzip bytes, excluding Lit/RxJS peers. Its optional /elk path service is 3,300 gzip bytes, but only turns supplied edge sections into paths; it does not run ELK layout. Inspected node code expects supplied dimensions; targeted root/node inspection found no complete keyboard/relationship accessibility implementation. Root disconnect removes listeners initialized in firstUpdated, a reconnection risk requiring runtime reproduction. Disabled node dragging can let pointer events reach viewport panning. Its own RxJS state/CSS animation and ^0.9.0 ELK peer range need review against the house stack/current engine. Production use is the project's claim, not an independently verified speed/robustness result.

### Smaller Lit candidates and auxiliary helpers

- [Gliba/lit-flow](https://github.com/Gliba/lit-flow) publishes 0.4.12 while inspected source identifies 0.4.19. It supports Lit content, size observation and open-shadow handle discovery, but uses endpoint-only xyflow routes. Viewer flags are inconsistently enforced, HTML label positioning uses a Bézier midpoint even for other path types, and its test script is a failing placeholder. Published full bundle 50,803 gzip bytes; CSS additional.
- [ghchinoy/litflow](https://github.com/ghchinoy/litflow) 0.5.2 includes layout options but keeps Dagre node positions and discards its edge geometry. Delete/Backspace and keyboard movement can still edit graphs with dragging disabled. Its event.target-only typing guard misses retargeted shadow controls. It owns a signals store and its resize path does not prove automatic relayout. Entry 53,525 gzip bytes with runtime imports still external.
- [Node Flow Elements](https://github.com/JulianCataldo/node-flow-elements), now @node-flow-elements/core 0.1.0, has useful slots, composedPath handling and size observation. Its links are cubic Béziers and disconnect on double-click by default; complete viewer-only obstacle routing was not established. It uses signals and @lit-labs/motion, which is the same motion package family as ours; that alone does not establish compatible state/animation ownership.
- [lit-isoflow](https://github.com/eviltik/lit-isoflow) 1.1.0 has a read-only viewer mode but models isometric icons/tiles. Its reviewed A* caller supplies a walkable grid without node obstacles, so the algorithm name is not evidence of obstacle avoidance.
- [Panzoom](https://github.com/timmywil/panzoom) 4.6.2 is an optional viewport candidate: published minified file 10,125 raw / 3,857 gzip bytes, no runtime dependencies declared. Exclusion controls, pointer/pinch handling and transform hooks are useful, but house shadow-control isolation, motion and cleanup still need checks. Neither Panzoom nor Google's curve utility is selected by the ELK decision.

### Required return points

Before approving Flow Diagram's inventory: define measured content/labels, stable identifiers, layout ordering and acceptable movement, async stale-result handling, worker delivery, viewport controls and accessible node/relationship reading. Include real buttons/inputs/switches, text selection, popups and inner scrolling so diagram gestures never consume control interaction. Check custom themes, density, RTL, reduced motion, focus retention and reconnect in Chromium/Firefox/WebKit. Specify graph scale from intended use; the100-node probe is not a supported limit. Nested groups, export and fixed-position overrides remain unselected; editing/execution are outside the selected viewer scope. Package references do not authorize source changes before Phase 5.

## M12 port preparation — 2026-09-22

Re-read the complete published @zag-js/number-input 1.44.0 utility (34 lines), machine (444 lines) and connector (289 lines) from the retained isolated research installation. This pins the behavior source independently of a moving main branch. The port uses native text editing, Adobe parsing, derived numeric state, modifier stepping, Home/End, optional focused wheel stepping, and lifecycle-owned repeat timers. The source repeats after 300ms at 50ms intervals. Its scrubber remains outside the approved inventory.

The source beforeinput handler reconstructs input only from event.data and the selected range; the house implementation must distinguish composition, deletion and paste rather than assume every beforeinput is ordinary text insertion. The source reports a range-underflow reason for NaN through its generic invalid callback; the approved house contract instead requires an invalid partial value to remain distinct from a numeric range error. Number Input implementation and acceptance are still pending after M11 closes.

The full published Pin Input utility (19 lines), machine (310 lines) and connector (238 lines) were also re-read. Preserve its no-hole deletion, bounded focus movement, same-character advancement, mid-sequence paste and native one-time-code authoring. The house contract distinguishes whole-code replacement from a shorter paste at the current position. Completion must be a user transition, not an effect of programmatic restoration or reconnect.

The complete upstream number arithmetic helper was reviewed. An isolated process confirms normal 0.1 + 0.2 produces 0.3, but incrementing zero by Number.MIN_VALUE does not return within a one-second bound and is terminated. The source's decimal-count loop has no finite bound once its multiplier overflows. The house port must use bounded decimal arithmetic and test exponent-form steps; it must not copy that loop. Scratch reproduction: /tmp/acme-m12-number/upstream-decimal.ts. No Zag runtime dependency is added to the project.

M12 implementation has started. @internationalized/number 3.6.8 is now an exact project dependency. The new bounded decimal helper passes three tests, including repeated 0.1 increments, exponent-form steps and Number.MIN_VALUE. The initial Number Input source candidate passes ten native checks in each engine for spinbutton semantics, decimal steps, partial/empty values, bounds, reset, German parsing and percent steps. This is an incomplete candidate: press-and-hold, optional action parts, full keyboard/commit policy, format changes, complete property validation, docs and final acceptance remain.

The Number Input end-to-end test file was read fully from Zag revision 53327acb58fedbd12b1a5702f7c51baf4aa3c6b0; it still skips scrubbing and increment long-press. The current Pin Input test file and the MIT license were retrieved at the same revision. Pin test reading remains pending. The source-test revision is recorded separately from the pinned 1.44.0 implementation package. The license is retained under assets/licenses/zag-behavior.txt.

The shared text base now supplies overridable native input/commit/validation methods for the numeric family. Single-line affix discovery reuses the existing Places controller, including forwarded-slot tracking, rather than retaining a second content observer. Existing text-control unit checks pass after this refinement; the complete M11 native regression remains the integration check.

The installed Adobe parser misreads nonstandard notation: with value -1234.5, compact '-1.2K' parses as -1.2; scientific and engineering formatting also return incorrect numbers. Adobe's own [NumberField documentation](https://react-spectrum.adobe.com/v3/NumberField.html#number-formatting) explicitly supports standard notation only. Under delegated execution, narrow Number Input formatOptions to standard notation and reject other notations before changing state. Decimal, percent, currency/accounting and unit formats remain supported. Display-only Format Number retains its full Intl formatting surface. This corrects the inventory's overly broad editable-format type; it does not add a second parser.

Default formatting also preserves small representable values: if ordinary formatting loses the number and no rounding limit was supplied, native Intl significant-digit formatting preserves the amount in the same locale. Number.MIN_VALUE round-trips through Adobe parsing in English, German and Arabic. Explicit caller rounding limits retain their native meaning. Browser control tests cover this in addition to the arithmetic test.

Both upstream test files have now been read in full. Number Input's current candidate passes 29 source checks per engine after context/action integration, including custom-part ownership transfer and inherited locale changes. The hold sequence exposed a caller error: raw createAtom.set(undefined) retains the prior value in the installed store; set(() => undefined) clears it. Press release and commit history now use the explicit updater form. Two lifecycle tests cover repeated presses and synchronous removal. The installed Lit ContextProvider takes initialValue; corrected use makes optional action parts share the root's state. No new state runtime is added.

Number Input's source acceptance now passes 43 checks in each engine. These include required/disabled native forms, custom and late-upgraded action parts, ownership transfer, locale changes, tiny English/German/Arabic values, pointer holds/cancellation, wheel opt-in, cancellation of Enter, and rejection of invalid programmatic text. Review also caught binary drift in the derived modifier steps (0.14 × 10 became 1.4000000000000001); decimal scaling now shares the bounded arithmetic representation, and the regression test passes. Zoom-modified wheel events are left to the platform. Final compiled/site/full-suite acceptance is running; Pin Input remains unimplemented.

Number Input formatting whitespace is meaningful HTML slot content even when it is visually empty. A native browser regression showed that newline-only content hid the default actions. The root and action parts now use the shared Places controller to distinguish real custom content from whitespace and render their defaults outside an inactive slot. This also removes inactive default action instances when custom parts are supplied. The first live-doc navigation was started during site generation and timed out; subsequent navigation found the expected named native button in Chromium's Accessibility tree. Verification now sequences site generation before live navigation.

Pin Input implementation now passes 32 source checks in each engine plus four actual TanStack Form integration checks. One root owns the immutable string array, native joined value, validation and completion policy. Indexed fields use Lit context for ownership and the existing semantic/Group/style mechanisms. Full-code paste replaces all positions; shorter paste preserves the left prefix and replaces the remainder. Custom fields require a complete unique set of zero-based indices. Supplied naming overrides positional labels.

Composition buffers live in TanStack state. Capturing the native final value before clearing that buffer prevents a synchronous projection from erasing Firefox's committed composition text. Completion and auto-submit occur on user completion transitions; programmatic writes, reset and restoration stay silent. Readonly fields retain navigation and cancel deletion keys, including WebKit's observed Backspace history navigation. OTP changes the autocomplete hint while the selected character policy controls keyboard mode, so alphanumeric OTP remains typeable.

The native clipboard probe shows Firefox ignores the supplied ClipboardEventInit DataTransfer but exposes its own writable event.clipboardData. Fixtures populate that actual object in every engine. The same probe shows Firefox retains the one-time-code attribute while its password input autocomplete getter returns an empty string. Attribute authoring is verified; this is not evidence of actual SMS/OS autofill. Final compiled/package/site acceptance is pending. Reproductions: /tmp/acme-m12-pin.


## Calendar parser prerequisite — 2026-09-22

[Calendar source/reference investigation](../alignment/evidence/m13-calendar-reference-review-2026-09-22.json) reproduces defects in installed/latest @internationalized/date 3.12.4: negative fractional offsets (-03:30 and -00:30) produce the wrong instant, and three date-time parsers accept day zero. parseDate is a passing day-zero rejection control. Checked upstream main 8ae29fa17598c840955c6ed0e91b3524d8f13e5a has byte-identical string.ts, so no fixed stable upgrade is established. RelativeTime already calls the affected absolute parser.

Repair the upstream parser with an exact-version patch and regression fixtures. A repo-local Bun patch alone is insufficient: split ESM currently preserves bare date-package imports and production staging removes patchedDependencies. The selected delivery direction is one private generated dependency bundle used by all house runtime date imports, with the upstream types and Apache license/provenance retained. Packed npm/Bun consumers, selective CDN and every bundle must reproduce the fixed behavior without consumer patch configuration. Implementation is isolated and not yet accepted.

The exact 3.12.4 patch and private runtime writer are now in the main working tree. Twelve focused tests pass, including RelativeTime and an independently imported bundled runtime. The writer verifies negative fractional offsets/day-zero rejection and emits dependency licenses and patch provenance. Full packed-consumer and browser distribution verification remains pending; no Calendar UI acceptance is claimed.

[Date-runtime delivery acceptance](../alignment/evidence/m13-date-runtime-2026-09-22.json) now passes. Split ESM, selective CDN, normal/minified/standalone bundles use the corrected private runtime. Fresh npm/Bun consumers need no patches; their independently installed upstream parser remains unpatched while the public RelativeTime component produces the corrected instant. The full suite passes 892 tests. Calendar UI still requires its separate implementation gates.


## Modal focus follow-up — 2026-09-22

The native-only audit found a concrete gap with Calendar’s slotted footer. A Tab sequence reaches document body in Chromium/WebKit; Firefox stays at the footer rather than traversing the whole dialog. A focus-trap 8.2.2 prototype passes all three engines. Its complete installed README was read, including Shadow DOM, per-document stack, lifecycle, Safari and mobile limits. Initial/return focus, dismissal and inert isolation are disabled in the helper so existing native/controller responsibilities remain authoritative. Source: https://github.com/focus-trap/focus-trap . Prototype: /tmp/acme-m13-calendar/focus-prototype.log; native baseline: /tmp/acme-m13-calendar/tab.log. Final integrated verification is pending.
