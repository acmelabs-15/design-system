# Systematization architecture responsibility review

Status: Completed historical responsibility review, 2026-09-19.

## Scope and interpretation

The record preserves composed overlays, canonical state, shared native forms, scoped themes and CSS-production decisions. It also preserves premature-recommendation and approval-timing corrections, failed controls and bounded comparisons. Later inventory, migration and implementation evidence resolves former phase gates. Responsibility selection did not itself approve signatures or certify runtime behavior.

The dated findings below retain their source versions, measurements, corrections and verification limits. Old phase gates, source freezes, local-skill routing and task-specific permission grants describe the completed pass. They do not govern new work. The [current handoff](../../STATUS.md) owns the next action.


Started 2026-09-19 at Peter's request. The architecture review closed at the responsibility level, after which Phase 4 was active. That closure approved neither draft interfaces nor runtime behavior and did not authorize source changes. The dated return points below describe the original investigation.

## Decision bar

[Evidence and implementation quality](../../decisions/0034-evidence-and-implementation-quality.md) govern every recommendation. Existing AGENTS.md already requires “Best, not fastest” and “Investigate first.” Peter reaffirmed these requirements after the style-production recommendation was presented too early. Pace does not lower the quality or evidence bar.

Facts, probe results, design reasoning and unresolved questions remain distinct. Compare equivalent capabilities and verification conditions before describing an option as best. Convenience, fewer files, less code or a bounded documentation survey do not establish superiority or community preference.

## Selections at architecture closure

- **CONFIRMED — overlays first.** Shared overlay responsibilities were the first review subject.
- **CONFIRMED — [composable controllers and native surfaces](../../decisions/0075-overlay-architecture.md).** Components retain their markup and family policies. Placement, presence and coordination have distinct responsibilities.
- **CONFIRMED — [store-backed public state properties](../../decisions/0080-public-state-bridge.md).** One canonical per-instance TanStack value; Lit handles attributes/reflection/rendering. The implementation mechanism still needs comparative and browser checks.
- **CONFIRMED — modal resources remain until owned exit completion.** Reopen interrupts exit; reduced motion completes immediately; removal cleans up immediately; unrelated child animations do not determine completion.
- **CONFIRMED — [shared native-form mechanics](../../decisions/0068-native-form-architecture.md).** Controls retain conversion/rules; Field retains associations; optional TanStack Form binds the same contract.
- **CONFIRMED — [theme resolution separate from persistence](../../decisions/0109-theme-resolution-architecture.md).** Share nested effective-theme resolution while applications or a separate optional helper own saving.
- **CONFIRMED — [compiled CSS to generated Lit modules](../../decisions/0104-style-production.md).** Peter selected the direction after the completed bounded comparison. Document-style, registration and metadata outputs have explicit paths; build-tool choice and implementation verification remained open at this architecture checkpoint. The linked decision records the later compiler selection and its evidence. The earlier premature recommendation remains a recorded process correction.
- **TECHNICAL RECOMMENDATION — refine existing Places and Interaction.** Keep slot-content observation and transient interaction cleanup in their existing modules. No new component family, gesture engine or state owner is proposed. Exact interfaces follow the consuming inventory entries.

[Question answers, probe outcomes and audit](../../verification/systematization/phase-3-checkpoint-2026-09-19.json).

## Candidate map

The review began with source-backed candidates rather than proposed signatures. The architecture skill's HTML report could not be written in Plan mode, so the candidate comparison was presented inline. No completed HTML artifact is claimed.

- **Overlay lifetime and placement — strong problem evidence.** Repeated setup, async geometry, focus, locking and exit management become coordinated shared modules with explicit family policy. Placement is not the same responsibility as modal lifetime.
- **Native forms — strong problem evidence.** Per-control submission/reset/validity differences become a common form lifecycle with control-specific rules.
- **Public inputs/store integration — strong problem evidence.** Plain Lit properties read by derived stores can become stale; the selected bridge must preserve one value owner.
- **Scoped themes — strong problem evidence.** Root preference and global host mirroring cannot represent all selected section themes.
- **Content/interaction tracking — concrete smaller candidates.** Deepen existing Places/Interaction responsibilities where source and tests justify it; do not create another competing abstraction.
- **Generated-style production — selected after comparison.** Compiled CSS feeds Lit modules and the other explicit outputs. Exact compiler and tooling remain migration planning work.

## Evidence audit

Peter asked that these requirements be applied retrospectively to suggestions already made. The audit covers the six current accepted Phase 3 directions and a targeted earlier-record check. It is not a claim that every historical decision or reference was retested.

### Controller composition and native surfaces

Current source has six computePosition/autoUpdate pairs, five scroll-lock calls and 42 Interaction constructions in 34 files. The unused shared Overlay class has no subclasses. Repeated responsibility and lifecycle gaps are real; counts are of current pre-migration code, not the final retained consumer set.

[Lit controller documentation](https://lit.dev/docs/composition/controllers/) supports composition. [Native modal dialog](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) supplies platform isolation, while Popover provides top-layer capabilities. These facts do not establish a complete nested-overlay contract.

The proposed interface gate required comparison of viable implementations against the same lifecycle, focus, modality, theme and accessibility requirements, using real DOM/shadow-root interactions in all three engines. This was a requirement before interface finalization, not a report that the comparison had run. Native top-layer support alone did not establish focus, outside dismissal or nested scroll-lock correctness.

### Owned exit completion

Existing Modal/Drawer/Sheet/Command Menu use different completion mechanisms. Sheet's descendant-animation wait can include unrelated or infinite animations. This supports the ownership requirement, not the correctness of an unbuilt replacement.

The required cases were reopen/cancel during exit, zero/reduced motion, infinite child Spinner, removal, nested locks, opener removal and exactly-once completion. Family dismissal and focus policies remained inventory obligations at this checkpoint.

### Public state bridge

The [existing-helper check](../../verification/systematization/existing-state-integration-2026-09-19.json) supersedes relying only on the synthetic patterns. The unchanged helper passes eleven existing tests and ten of twelve targeted public cases; initial default reflection and external shared-atom reflection/named notification fail. A focused scratch refinement now passes 24 targeted cases in happy-dom and Chromium, the eleven existing tests and a strict helper type check. A declaration-only control passes 19/24, isolating the remaining shared-value notification/default work. Final authoring composition, subscription cost, other browsers and toolchain integration remained unchecked by that scratch refinement. [Refinement analysis](../../research/15-lit-practice-review.md#focused-state-helper-refinement).

Peter reaffirmed TanStack Store as the sole state owner. The [expanded equivalent-case probe](../../verification/systematization/state-bridge-comparison-2026-09-19.json) supports immediate canonical-store access and exposes the missing named-notification path for raw store writes. [Mechanism follow-up](../../research/15-lit-practice-review.md#phase-3-state-and-form-mechanism-follow-up).

The existing Copy Button defect was confirmed in the prior [Lit practice review](../../research/15-lit-practice-review.md#phase-1-extension-react-and-forms). The new six-case probe uses Bun/happy-dom and a single Boolean custom accessor with Lit reflection/useDefault plus TanStack derived state. It passes initial state, default-attribute absence, synchronous derivation, property/reflection rendering, attribute removal and reconnect.

That is feasibility evidence. It does not select a universal decorator, prove an alternative update bridge inferior, or test converters, inheritance, pre-definition properties, equality/batching, compiler output, CEM metadata, React wrappers or actual browsers. The research left an equivalent-case comparison before shared-mechanism closure; it preserved the selected direction while allowing an evidence-backed revision for Peter.

### Native form module

Local source and earlier browser failures justify common native-form ownership. They did not select its internal controller/mixin/base mechanism at that checkpoint. The required comparison was to cover actual Lit implementations, native FormData/submission, external forms, disabled fieldsets, reset/restoration, validity/reporting focus, submitters and managed-form synchronization for text, checkbox, radio-group and compound controls. The shared module must not erase control-specific semantics or Field's separate association responsibility.

The [new fifteen-case Chromium text-control probe](../../verification/systematization/native-form-mechanism-2026-09-19.json) passes all cases with synchronous native synchronization and nine with render-cycle synchronization. Six failures establish why native submission/validity must be independent of rendering. A controller plus thin native callback bridge is feasible. This does not certify other control families or select final packaging; restoration was explicitly invoked, and Field/focus/managed-form and cross-engine checks remained outside that probe.

### Scoped themes

The root store persists preferences, and base.ts mirrors root darkness to all hosts. Neither proves nested effective-theme resolution. The separation from persistence is Peter's selected ownership choice; the runtime/CSS split remained open at the architecture checkpoint. The [later theme resolution](../../decisions/0109-theme-resolution-architecture.md#context-transport-selected-2026-09-21) records its selected transport.

The planned comparison required identical nested/moved/custom-theme/overlay fixtures for inherited CSS with minimal metadata and imperative propagation. Its required cases included system preference and changes while an overlay was open; this sentence does not report a completed comparison. Group appearance defaults and density exceptions are separate contracts.

### Style production

Peter first clarified that he was leaning toward compiled CSS converted into generated Lit modules. After the completed comparison, he explicitly selected that direction. [Decision](../../decisions/0104-style-production.md).

The [completed bounded comparison](../../research/18-repository-layout.md#completed-bounded-style-pipeline-comparison) and [artifact/probe evidence](../../verification/systematization/style-pipeline-comparison-2026-09-19.json) now support compiled CSS converted to Lit modules, with separate scope-aware document/registration outputs. Peter has now selected this architecture. Full builds and browser/source-map/registration acceptance remained open at that bounded comparison. The [later M02 evidence](../../verification/systematization/m02-css-pipeline-2026-09-20.json) records its completed pipeline scope; it does not turn this earlier requirement into a passing result.

The initial recommendation did not compare enough actual pipelines. The follow-up now traces versioned Material Web, both Spectrum generations and Web Awesome sources and representative published artifacts. Further research is required only where the documented implementation checks expose a gap.

The required checks were to cover authored/generated inputs, intermediate CSS, Lit CSSResult or stylesheet outputs, global/recipe assets, registration, maps, escaping, minification, CEM ordering and selective delivery. Their comparison had to distinguish authored Lit CSS from generated wrappers. These requirements did not establish community consensus or replace generator ownership.

### Earlier recommendations

The [composition decision](../../decisions/0018-composition-over-count.md), [Item](../../decisions/0050-item-content-family.md) and [Group](../../decisions/0045-group-presentation.md) records already reject smaller counts alone as success. The [Lit Motion decision](../../decisions/0004-animation-package.md) explicitly says avoiding work is not a reason to prefer a package and preserves unverified reliability risks. The [Flow Diagram decision](../../decisions/0040-flow-diagram.md) selected the heavier ELK engine for routing fit, with probe and integration limits.

No new finding in this bounded audit requires reversing those selections. Their existing verification gates remain mandatory; this check does not recertify every earlier recommendation. A changed recommendation required new evidence and a concrete revision for Peter.

## Historical continuation and timing correction

### Work pacing and verification timing

Peter initially asked to move the work forward after more than eight hours. He subsequently said the deadline had passed, removed the urgency and requested an audit of recent rushed decisions. The [audit](../../verification/systematization/pace-review-2026-09-19.json) found an approval-gate timing error, a responsive font-basis omission and stale records. The correction is to preserve the approved gates and distinguish evidence from implementation acceptance. The [inventory draft](../../../spec/SPEC-design-system.md) carries the accepted responsibilities and remaining interface work.

The correction separated pre-approval evidence from full implementation verification. The [style-production decision](../../decisions/0104-style-production.md) required representative pipeline and three-engine rendered checks before the original Phase 5 approval. An earlier pacing paragraph had incorrectly moved that gate into Phase 6; that change was withdrawn. Interface-invalidating uncertainty still preceded selection, while full compiler/CEM/React integration and component regressions remained implementation checks. The pending evidence gate did not authorize early implementation.

Accepted directions remained confirmed and unselected interfaces remained draft. The remaining architecture/inventory work asked only unresolved user-owned trade-offs under the original approval gates.

## Phase 3 closure

Peter directed us to finish this phase and move the work forward. The accepted responsibility split is unchanged: composed overlays; canonical TanStack state with Lit property integration; shared native form mechanics; nested effective themes separate from saving; and compiled CSS feeding generated outputs. Existing Places and Interaction carry their narrower content/cleanup responsibilities. The [inventory](../../../spec/SPEC-design-system.md) contains these architecture notes and their acceptance requirements, as the Phase 3 plan requires.

The final problem statement remains predictable interfaces across retained elements, with shared modules owning repeated behaviour. No new component scope, theme runtime, compiler or store engine is selected by this closeout. The inspected evidence supports the responsibility split; it does not turn proposed signatures into accepted interfaces.

The original remaining work had explicit owners and return points; these describe the completed pass:

1. **Historical Phase 4 ownership, agent drafting and Peter approval:** Group participation/defaults; theme scope authoring and runtime consumers; overlay family focus/dismissal and coordination; form serialization/validity per family; public property/event/slot contracts. An unresolved capability choice blocked its affected entry, not unrelated drafting.
2. **Historical Phase 5 ownership, agent proposal and Peter approval:** exact helper packaging, native callback bridge, compiler/output layout and changed-file batches. The original pre-approval checks covered representative component styles, escaping, scope, registration, determinism, invalid inputs, selective imports, maps and rendered outcomes in all three engines. Other interface-invalidating uncertainty preceded its affected batch; required interface revisions returned to Peter.
3. **Historical Phase 6 verification:** full compiler/CEM/React output, complete control-family cases, all three engines, cleanup, theme propagation, focus and accessibility. These supplemented pre-approval evidence. Both kinds of checks entered the migration plan; phase closure waived neither.
4. **Historical cross-phase dependency:** assigned content, attached appearance, selection indicators, native forms and Toolbar focus were reviewed together in the relevant Group/selection/input/Toolbar entries. The existing Material Progress/Chip evidence limitations remain their recorded visual-review gates.

Layout and typography with the shared responsive convention were next at that checkpoint. Group wrapping, nested defaults, independent framing, responsive objects/arrays, Material names, both query modes and native font bases were selected; full entries were then unapproved. The bounded audit retained responsibility-level closure while restoring the altered approval gate. It did not certify implementation.

The original pass recorded the evidence/quality requirement in its then-mandatory startup handoff, rather than only in conversation. Current startup ownership is separate.

## Open follow-ups

- [Actual-platform verification remains unperformed](../../../.scratch/maintenance/issues/002-actual-platform-verification.md).

## Source provenance

Converted 2026-10-21 from notes/alignment/phase-3-review.md. That path identifies the historical source record. Inline source references and saved evidence retain their stated scope; this conversion does not rerun the original checks.
