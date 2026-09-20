# Phase 3 architecture review

Started 2026-09-19 at Peter's request. **Architecture responsibility review complete; Phase 4 inventory review is active.** This closes the phase at the responsibility level described in the pass plan. It does not approve draft interfaces, certify implementations or authorize source changes. The closure and explicit return points below govern the earlier investigation notes.

## Decision bar

[Evidence and implementation quality](../decisions/evidence-and-implementation-quality.md) govern every recommendation. Existing AGENTS.md already requires “Best, not fastest” and “Investigate first.” Peter reaffirmed these requirements after the style-production recommendation was presented too early. Pace does not lower the quality or evidence bar.

Facts, probe results, design reasoning and unresolved questions remain distinct. Compare equivalent capabilities and verification conditions before describing an option as best. Convenience, fewer files, less code or a bounded documentation survey do not establish superiority or community preference.

## Current selections

- **CONFIRMED — overlays first.** Start with the shared overlay responsibilities.
- **CONFIRMED — [composable controllers and native surfaces](../decisions/overlay-architecture.md).** Components retain their markup and family policies. Placement, presence and coordination have distinct responsibilities.
- **CONFIRMED — [store-backed public state properties](../decisions/public-state-bridge.md).** One canonical per-instance TanStack value; Lit handles attributes/reflection/rendering. The implementation mechanism still needs comparative and browser checks.
- **CONFIRMED — modal resources remain until owned exit completion.** Reopen interrupts exit; reduced motion completes immediately; removal cleans up immediately; unrelated child animations do not determine completion.
- **CONFIRMED — [shared native-form mechanics](../decisions/native-form-architecture.md).** Controls retain conversion/rules; Field retains associations; optional TanStack Form binds the same contract.
- **CONFIRMED — [theme resolution separate from persistence](../decisions/theme-resolution-architecture.md).** Share nested effective-theme resolution while applications or a separate optional helper own saving.
- **CONFIRMED — [compiled CSS to generated Lit modules](../decisions/style-production.md).** Peter selected the direction after the completed bounded comparison. Document-style, registration and metadata outputs have explicit paths; build-tool choice and implementation verification remain open. The earlier premature recommendation remains a recorded process correction.
- **TECHNICAL RECOMMENDATION — refine existing Places and Interaction.** Keep slot-content observation and transient interaction cleanup in their existing modules. No new component family, gesture engine or state owner is proposed. Exact interfaces follow the consuming inventory entries.

[Question answers, probe outcomes and audit](evidence/phase-3-checkpoint-2026-09-19.json).

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

Before finalizing interfaces, compare viable implementations at the same lifecycle, focus, modality, theme and accessibility requirements. Include real DOM/shadow-root interactions and all three engines. Do not treat native top-layer support as proof that focus, outside dismissal or nested scroll locks are already correct.

### Owned exit completion

Existing Modal/Drawer/Sheet/Command Menu use different completion mechanisms. Sheet's descendant-animation wait can include unrelated or infinite animations. This supports the ownership requirement, not the correctness of an unbuilt replacement.

Verify reopen/cancel during exit, zero/reduced motion, infinite child Spinner, removal, nested locks, opener removal and exactly-once completion. Exact family dismissal and focus policies remain inventory obligations.

### Public state bridge

The [existing-helper check](evidence/existing-state-integration-2026-09-19.json) supersedes relying only on the synthetic patterns. The unchanged helper passes eleven existing tests and ten of twelve targeted public cases; initial default reflection and external shared-atom reflection/named notification fail. A focused scratch refinement now passes 24 targeted cases in happy-dom and Chromium, the eleven existing tests and a strict helper type check. A declaration-only control passes 19/24, isolating the remaining shared-value notification/default work. Final authoring composition, subscription cost, other browsers and toolchain integration remain unchecked. [Refinement analysis](../analysis/lit-practice-review.md#focused-state-helper-refinement).

Peter reaffirmed TanStack Store as the sole state owner. The [expanded equivalent-case probe](evidence/state-bridge-comparison-2026-09-19.json) supports immediate canonical-store access and exposes the missing named-notification path for raw store writes. [Mechanism follow-up](../analysis/lit-practice-review.md#phase-3-state-and-form-mechanism-follow-up).

The existing Copy Button defect was confirmed in the prior [Lit practice review](../analysis/lit-practice-review.md#phase-1-extension-react-and-forms). The new six-case probe uses Bun/happy-dom and a single Boolean custom accessor with Lit reflection/useDefault plus TanStack derived state. It passes initial state, default-attribute absence, synchronous derivation, property/reflection rendering, attribute removal and reconnect.

That is feasibility evidence. It does not select a universal decorator, prove an alternative update bridge inferior, or test converters, inheritance, pre-definition properties, equality/batching, compiler output, CEM metadata, React wrappers or actual browsers. Run an equivalent-case comparison before closing the shared mechanism. Preserve the selected direction while investigating; propose any warranted change to Peter.

### Native form module

Local source and earlier browser failures justify common native-form ownership. They do not yet select its internal controller/mixin/base mechanism. Compare actual Lit implementations and test native FormData/submission, external form ownership, disabled fieldsets, reset/restoration, validity/reporting focus, submitters and managed-form synchronization for text, checkbox, radio-group and compound controls. The shared module must not erase control-specific semantics or Field's separate association responsibility.

The [new fifteen-case Chromium text-control probe](evidence/native-form-mechanism-2026-09-19.json) passes all cases with synchronous native synchronization and nine with render-cycle synchronization. Six failures establish why native submission/validity must be independent of rendering. A controller plus thin native callback bridge is feasible. This does not certify other control families or select final packaging; restoration was explicitly invoked, and remaining Field/focus/managed-form and cross-engine checks stay open.

### Scoped themes

The root store persists preferences, and base.ts mirrors root darkness to all hosts. Neither proves nested effective-theme resolution. The separation from persistence is Peter's selected ownership choice; the runtime/CSS split remains open.

Compare inherited CSS with minimal scope metadata and imperative propagation through the same nested/moved/custom-theme/overlay fixtures. Include system preference and changes while an overlay is open. Group appearance defaults and density exceptions are separate contracts.

### Style production

Peter first clarified that he was leaning toward compiled CSS converted into generated Lit modules. After the completed comparison, he explicitly selected that direction. [Decision](../decisions/style-production.md).

The [completed bounded comparison](../analysis/repository-layout.md#completed-bounded-style-pipeline-comparison) and [artifact/probe evidence](evidence/style-pipeline-comparison-2026-09-19.json) now support compiled CSS converted to Lit modules, with separate scope-aware document/registration outputs. Peter has now selected this architecture. Full house builds and browser/source-map/registration acceptance remain open.

The initial recommendation did not compare enough actual pipelines. The follow-up now traces versioned Material Web, both Spectrum generations and Web Awesome sources and representative published artifacts. Further research is required only where the documented house implementation checks expose a gap.

Check authored/generated inputs, intermediate CSS, Lit CSSResult or stylesheet outputs, global/recipe assets, property registration, source maps, escaping, minification, CEM ordering and selective delivery. Distinguish authored Lit CSS from generated Lit wrappers. Do not claim community consensus from a few systems or adopt a source-authoring model that violates the existing generator rule.

### Earlier recommendations

The [composition decision](../decisions/composition-over-count.md), [Item](../decisions/item-content-family.md) and [Group](../decisions/group-presentation.md) records already reject smaller counts alone as success. The [Lit Motion decision](../decisions/animation-package.md) explicitly says avoiding work is not a reason to prefer a package and preserves unverified reliability risks. The [Flow Diagram decision](../decisions/flow-diagram.md) selected the heavier ELK engine for routing fit, with probe and integration limits.

No new finding in this bounded audit requires reversing those selections. Their existing verification gates remain mandatory; this check does not recertify every earlier recommendation. If new evidence changes one, record the discrepancy and bring a concrete revision to Peter.

## Resume here

### Work pacing and verification timing

Peter initially asked to move the work forward after more than eight hours. He subsequently said the deadline had passed, removed the urgency and requested an audit of recent rushed decisions. The [audit](evidence/pace-review-2026-09-19.json) found an approval-gate timing error, a responsive font-basis omission and stale records. The correction is to preserve the approved gates and distinguish evidence from implementation acceptance. The [inventory draft](inventory.md) carries the accepted responsibilities and remaining interface work.

Keep pre-approval evidence checks separate from full implementation verification. In particular, the [style-production decision](../decisions/style-production.md) requires representative house-pipeline and three-engine rendered checks **before Phase 5 implementation approval**. The earlier pacing paragraph incorrectly allowed this evidence gate to move into Phase 6; that timing change is withdrawn. Architecture-changing uncertainty still needs resolution before selecting the affected interface. Full compiler/CEM/React integration and component regression checks also remain mandatory when implementations land. A pending source-backed evidence gate is not permission to implement the replacement early.

Keep accepted directions confirmed; mark unselected interfaces as draft. Complete the remaining architecture recommendations and the component inventory, asking only about unresolved user-owned trade-offs. The inventory and migration approval gates remain intact.

## Phase 3 closure

Peter directed us to finish this phase and move the work forward. The accepted responsibility split is unchanged: composed overlays; canonical TanStack state with Lit property integration; shared native form mechanics; nested effective themes separate from saving; and compiled CSS feeding generated outputs. Existing Places and Interaction carry their narrower content/cleanup responsibilities. The [inventory](inventory.md) contains these architecture notes and their acceptance requirements, as the Phase 3 plan requires.

The final problem statement remains predictable interfaces across retained elements, with shared modules owning repeated behaviour. No new component scope, theme runtime, compiler or store engine is selected by this closeout. The inspected evidence supports the responsibility split; it does not turn proposed signatures into accepted interfaces.

The remaining work has explicit owners and return points:

1. **Phase 4, agent drafts and Peter approves:** Group participation/defaults; theme scope authoring and runtime consumers; overlay family focus/dismissal and coordination; form serialization/validity per family; public property/event/slot contracts. An unresolved capability choice blocks the affected inventory entry, not unrelated drafting.
2. **Phase 5, agent proposes and Peter approves:** exact shared helper packaging, native callback bridge, compiler/output layout and changed-file batches. Before implementation approval, complete the style decision's representative house-style, escaping, scope, registration, determinism, invalid-input, selective-import and source-map checks, including rendered outcomes in all three engines. Resolve any other mechanism uncertainty that could invalidate an approved interface before accepting the affected migration batch. Bring any required interface revision back to Peter.
3. **Phase 6, implementing agent verifies:** full compiler/CEM/React output, complete control-family cases, all three browser engines, lifecycle cleanup, theme propagation, focus and accessibility. These implementation checks supplement rather than replace pre-approval evidence. Carry both kinds of check into the migration plan; none is waived by this phase closure.
4. **Cross-phase dependency:** assigned content, attached appearance, selection indicators, native forms and Toolbar focus are reviewed together in the relevant Group/selection/input/Toolbar entries. The existing Material Progress/Chip evidence limitations remain their recorded visual-review gates.

Next: continue layout and typography with the shared responsive convention. Group wrapping, nested defaults and independent framing are now selected, as are responsive objects/arrays, Material names, both query modes and their native font bases. The full inventory entries remain unapproved. The bounded audit supports keeping responsibility-level Phase 3 closure while restoring the altered approval gate; it does not certify the implementations.

The evidence/quality requirement is pinned in the mandatory startup handoff. It is not stored only in conversation.
