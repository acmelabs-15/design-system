# Systematization pass

Entry point for the current work. AGENTS.md says how to work in this repo; this file owns the work and its current status. Keep the Where we are section current in every turn that moves anything.

## Where we are

**Execution:** Phase 6 is active. Peter delegates the remaining choices and requests completion without more questions. Use supported recommendations and preserve the quality bar. [Execution delegation](../decisions/execution-delegation.md).

**Language:** use component names directly. Every component belongs to this design system; there is no separate category or version. [Decision](../decisions/component-language.md).

**Completed:** M01–M14 are complete at their assigned boundaries. [Calendar acceptance](evidence/m13-calendar-2026-09-23.json) closes M13 with the strict build, site, 900 tests and all-engine native/compiled/documentation/overlay checks. Final React-wrapper, actual platform and whole-library gates remain M22/M26.

**Current work:** M15 is active. [Accordion/Collapsible and Show/Show More/Load More acceptance](evidence/m15-disclosure-2026-09-23.json) passes build/site, 926 tests, 23 source/compiled checks per engine, five documentation flows per engine and four M14 focus-style regressions per engine. Collapse/Collapse Group are removed. Continue Steps/Timeline, then Toolbar/App Bar/Breadcrumbs. Bring the public Dialog/Alert Dialog slice forward from M17 before Command Menu; do not create a duplicate dialog engine. Steps/Timeline official docs, pinned upstream Steps source and relevant Pro examples are read; implementation is next.

**Next batches:** continue M15–M26 under execution delegation. No more phase-choice questions or Plan toggles. M22/M26 retain actual platform, generated React and final release gates.

**Working copies and workers:** parallel workers stopped at an account usage limit. Their work is saved in /tmp/acme-m13-slider-worktree and /tmp/acme-m13-calendar-worktree, both based on 924ad0bd9. Slider and the date-runtime correction are already integrated and committed; main Calendar now contains the later fixes. Continue locally. Do not overwrite main files with older worktree copies.

**Browser verification:** Playwright 1.63.0 and complete Firefox/WebKit binaries now live in /Users/peterkloss/Library/Caches/acme-design-system/browser-checks. Use its node_modules/playwright/index.mjs and browsers/ path. The earlier acme-style-engines-fHTyxk package lost files; do not reuse it.

**Local preview:** port 4180 now runs bun scripts/dev.ts --no-build --no-watch (exec session 53597). A second watch process was found and stopped after it triggered concurrent builds. Use explicit generation/builds; restore normal watch mode after migration completion. Keep heavy package builds sequential.

**Local commits:** 2ec047be1 (Calendar/M13), 6e431cf16 (native lists/Disabled Wall), c84f73cee (Card/Inset/Item), 39bdc98c0 (Scroll Area), 335546ad0 (style whitespace). fbed13a4f closes Resizable/M14. No push, publication or Pages change occurred.

**Remaining cross-batch checks:** actual OS IME/voice/autofill/history/Safari and assistive-technology interaction; generated React wrappers; scoped-registry/adoption and native-content cases; the specific saved single-bundle import-initialization reproduction; complete appearance/removal/package acceptance. Preserve their existing M22/M26 owners and source-linked limits.

The dated checkpoints below retain their recorded results. The current execution block above owns the resumption point.

- **Phase:** Phase 6 implementation is active. M00 is closed: the representative prerequisites pass and Peter selected Lightning CSS 1.33.0 as a build-only dependency. Peter approved the complete Phase 4 design through “I approve all proposals,” then approved the migration plan through “approved.” [Inventory approval and snapshot](../decisions/inventory-approval.md); [migration approval](../decisions/migration-approval.md). Implement the approved migration in verified slices; final component and release acceptance remains required.
- **Visible progress:** the [complete proposal set](inventory.md#complete-proposal-set) now covers all thirteen groups: 91 numbered component/family/adapter entries across the core inventory and family files, shared conventions, and seven documentation units plus consumer tooling. The [coverage map](proposal-coverage.md) routes all 150 original tags and all thirty extension records. These are approved design entries; they are not implemented or runtime-certified.
- **Latest decisions:** all six layout entries share the [focused styling scope](../decisions/layout-spacing-properties.md#shared-styling-across-layout-components) and [Box's nine native tags, div default](../decisions/additional-component-capabilities.md#shared-structural-tags-for-layout-components). Layout arrangement is preserved when the native tag changes. The complete inventory, including these entries, is now approved.
- **Chakra/Lit input correction:** keep Chakra's current-input CSS behavior; the previous-value retention proposal is withdrawn. The complete-set proposal now applies installed Lit 2.1.2's malformed-JSON-to-null behavior to the house absent-style contract, with scalar CSS recognized first. Five Bun converter outputs support this adaptation; browser/structured-validation integration remains an engineering gate. It is not a claim that Chakra parses HTML JSON or a new user vote.
- **M00 evidence:** [completed investigations and reproducible fixtures](evidence/m00-completion-2026-09-20.json) cover CSS/maps, state/metadata, native semantics/registries, motion/Group, packed consumers and a Bun-hosted publication mechanism. All representative candidate assertions pass; known baseline failures and limits remain explicit. [Earlier form/registry controls](evidence/m00-prerequisites-2026-09-20.json) remain complementary. These are prerequisite mechanisms, not finished component certification.
- **M01/M02 implemented:** generated styles are under src/generated; authored site code is under site and builds to _site. All 128 former static library CSS blocks now use the compiler. The pipeline writes canonical CSS/maps/Lit modules, checks fingerprints and registration conflicts, and emits only document CSS/maps into dist/styles. [Implementation, review and verification](evidence/m02-css-pipeline-2026-09-20.json): 624 passing tests, a successful corpus-free build, and zero differences/errors in 114 browser comparisons.
- **M03 manifest implemented:** the standard analyzer supplies the built package, website and Markdown metadata. All 150 classes and 809 reactive properties agree with runtime attributes; inferred public types/defaults and real event names are checked. The independent review approved the corrected slice. [Evidence](evidence/m03-manifest-2026-09-20.json).
- **M03 complete:** class-only entries, 149 generated definitions, the full entry, shared CDN chunks, accurate manifests, production packing and three private workspace skeletons are implemented. The runtime reconnect guarantee now ships in the existing TanStack helpers instead of a consumer patch. All three engines pass class-purity, selective imports and fresh packed-consumer rendering/reconnection. The full suite passes 660 tests; independent reviews approve the slices. [Complete evidence and reproductions](evidence/m03-delivery-2026-09-20.json).
- **M04 complete:** 41 approved old tags are removed, including Text Copy in M03; 109 source components remain. Retained examples, shared styles, dashboard recipes and reflection checks are migrated. The final suite passes 592 tests and composition checks pass in Chromium/Firefox/WebKit. [Removal ledger and return points](evidence/m04-removals-2026-09-20.json) assigns the eleven coupled old implementations to their replacement batches. The original coverage census stays at 150.
- **M05 complete:** canonical public state, authored/effective appearance, ordered inputs, HTML conversion, breakpoints, explicit-clear helper, generated responsive delivery, 413-key theme catalog, named themes and nested scope transport are implemented. [Theme acceptance](evidence/m05-theme-integration-2026-09-21.json), [responsive acceptance](evidence/m05-responsive-renderer-2026-09-21.json), [114-page comparison](evidence/m05-theme-comparisons-2026-09-21.json). Component families adopt these mechanisms in their assigned batches; this does not mark them complete.
- **M09 glyph replacement verified:** [Shared helpers and generic sprite are removed](evidence/m09-glyph-replacement-2026-09-21.json). All 896 tests pass; each engine passes eleven renderer, ten compiled-composition and three documentation-app checks. [Icon Tile and Spinner](evidence/m09-spinner-tile-2026-09-21.json) are implemented: eighteen native checks per engine, build/site and the full 896-test suite pass. The action families are complete in the [action acceptance](evidence/m09-actions-2026-09-21.json). Identity entries are now complete in the later acceptance record. [The earlier submitter candidate](evidence/m09-submitter-candidate-2026-09-21.json) passes thirteen checks per engine, but final action/ARIA/Group integration and its listed limits remain. Independent identity-family work can proceed while that integration is completed. The checkbox indicator and final Tooltip focus behavior remain assigned to M10/M17; brand/content art and visualization geometry retain their own owners.
- **M09 icon checkpoints:** the pinned complete Material Symbols baseline (4,135 symbols, 24,810 SVGs) and shared renderer are implemented. [Catalog/base evidence](evidence/m09-icon-foundation-2026-09-21.json) records seven unit tests, a passing build and ten native checks per engine. [Per-icon/family delivery and complete docs catalog](evidence/m09-icon-delivery-2026-09-21.json) pass final package/CDN acceptance: ten CDN and five fresh packed-consumer checks per engine, public types, and all 893 tests. The standard manifest includes all 4,254 elements. Bounded analyzer partitions preserve all metadata checks and reduce the measured analysis to 8.43 seconds. Full SVG geometry checks pass in all engines, including native-source clipping comparisons for 31 overflow drawings. Internal glyph replacement, Spinner and actions are now complete in the later linked checkpoints. Identity entries are now complete in the later acceptance record.
- **M08 complete:** [Typography/time/truncation evidence](evidence/m08-typography-2026-09-21.json) and [FormatNumber/FormatByte evidence](evidence/m08-formatters-2026-09-21.json) cover all eleven entries. Native semantics, responsive clipping, heading targets, localized key labels, inline highlighting, exact time boundaries and full-value truncation/copy are implemented. The RTL grid defect found in acceptance is fixed. Strict public types and fresh packed split-ESM consumers pass. A single-bundle Bun import-initialization reproduction remains assigned to M22/M26; no false upstream attribution or component workaround is made.
- **M07 foundation complete:** [Separator implementation](evidence/m07-separator-2026-09-21.json) passes ten unit/manifest tests and nine native checks per engine, including intrinsic stretch and forced colors. Default-true property HTML authoring is clarified under delegated execution. [Box and structural semantics](evidence/m07-box-2026-09-21.json) also pass sixteen unit/manifest tests, sixteen geometry/lifecycle checks per engine and a fresh packed consumer. Native reference forwarding passes ten checks per engine, with six additional Chromium accessibility-tree checks. [Flex and shared arrangement](evidence/m07-flex-2026-09-21.json) pass eleven native comparisons per engine and the full 857-test suite. [Stack/HStack/VStack](evidence/m07-stack-2026-09-21.json) pass 32 native checks per engine, fresh packed-consumer checks and the full 865-test suite. [Grid/Simple Grid](evidence/m07-grid-2026-09-21.json) pass 26 native checks per engine, fresh package/type checks and the full 854-test suite. The decorative Grid family is removed outright. [Group layout/protocol](evidence/m07-group-2026-09-21.json) closes the foundation boundary with 28 native checks per engine and the final 858-test suite. Actual member integration remains M09–M11 work; continue with M08.
- **M06 complete:** shared native form controller/callback bridge; one-control Field registration and same-root naming mirrors; assigned-slot content tracking; interaction cancellation/reconnection; separate native overlay presence, nested coordination and Floating UI placement. [Evidence and reproductions](evidence/m06-shared-lifetimes-2026-09-21.json), [implementation analysis](../analysis/lit-practice-review.md#m06-shared-lifecycle-implementation--2026-09-21). M10–M17 own family adoption, event policy and actual user autofill/history acceptance. Cross-document label activation fails in Firefox for a plain native input too; same-document Field activation passes.
- **M05 helper choice resolved, 2026-09-21:** Peter chose [explicit clearing with styleInputs({})](../decisions/layout-spacing-properties.md#explicit-clearing-for-the-style-helper). Expression removal and temporary disconnection preserve canonical styling state. The [directive/controller bridge](evidence/m05-explicit-style-helper-2026-09-21.json) is implemented and reviewed. It passes the compiled 17-case matrix in each engine, and [current CSS processing](evidence/m05-current-css-inputs-2026-09-21.json) passes 22 native checks per engine. Root export, generated renderer and family integration remain; no private Lit hooks or automatic timeout cleanup.
- **Remaining cross-batch gates:** the Firefox scoped-registry polyfill cannot define an unknown element after document adoption; WebKit does not match nested-slot containers like Chromium/Firefox. Both have independent native controls in the evidence, and remain explicit E02/M22/M26 acceptance/compatibility records. M08 also records the Bun single-bundle static-class/dynamic-definition initialization reproduction; split ESM passes. Layout families must preserve host/root display agreement; M10 replaces the retained Theme Switcher option rendering with shared composition/localization.
- **Publishing boundary:** the existing release snapshot in docs stays until M25 switches Pages; port 4180 serves the verified local build with --no-build --no-watch during coordinated generation. [Compiler selection](../decisions/style-production.md#compiler-selected-2026-09-20). Inventory and migration approval remain recorded; the [five-question register](proposal-questions.md) stays closed. No push, package publication or Pages settings change has occurred.
- **Reference answers:** [inspect and follow the established reference](../decisions/reference-systems.md#follow-the-established-reference-without-another-preference-question) rather than ask Peter again. This retires the planned Simple Grid overflow question and corrects its draft mode selection to Chakra's component-level branch. House conflicts or actual source gaps remain explicit; a plausible alternative alone does not create a new vote.
- **Workflow correction approved:** Peter asked for phase-level progress and approved [complete component proposals, agent-owned engineering details and consequential questions in context](../decisions/agent-skills-workflow.md#complete-component-proposals-and-visible-progress). Use the queue's completion criteria and [engineering work list](remaining-work.md#engineering-work-owned-by-the-agent). Report proposals ready, entries approved, groups remaining and real blockers; probe/link counts are supporting verification.
- **Existing decisions stand:** all saved choices below and in notes/decisions remain authoritative. In particular, the style helper, declaration order, omitted-input undefined, supplied-setting ownership and next-render reassertion are selected. Their remaining engineering/public-contract details are prepared with the consuming components rather than reopened one at a time.
- **Approval gates:** inventory, [conventions](../conventions.md), documentation design and the concrete Phase 5 migration plan are approved. An actual technical failure can require a supported design or package revision; approval does not certify untested behavior.
- **Style evidence gate:** the representative house CSS pipeline and required Chromium/Firefox/WebKit outcomes must pass before dependent implementation. The migration approval preserves this technical gate; full implementation regression work remains Phase 6.
- **Quality and reference rules:** use [evidence and implementation quality](../decisions/evidence-and-implementation-quality.md), all applicable house-stack rules, and the [standing reference/complete-Material-review method](../decisions/reference-systems.md). Compare accepted and upcoming decisions; keep an explicit owner and return point for dependencies.
- **Decision handling:** [Continue under Peter's delegation](../decisions/execution-delegation.md). Resolve choices with evidence, record them and implement; do not open further question dialogs.
- **Records:** [full-set coverage](evidence/full-proposal-coverage-2026-09-20.json), [source/check ledger](evidence/full-proposal-review-2026-09-20.json), [current implementation snapshot](evidence/current-public-interfaces-2026-09-20.json) and the [preceding choices](evidence/layout-contract-selections-2026-09-20.json) distinguish source facts, selected scope and unapproved proposals. The compiler package choice is settled by Peter's “A”. The separate M05 lifecycle revision above is now selected as explicit clearing; the original five-question approval register remains closed. [Whole-set approval](evidence/inventory-approval-2026-09-20.json) supersedes earlier unapproved statuses without altering their historical evidence. The design/evidence checkpoint and first implementation slice are committed locally on codex/systematization-migration. See Git history for the commits; no push was performed.

## Proposal files

[Approved inventory](inventory.md#complete-proposal-set) · [Approved conventions](../conventions.md) · [Closed decision register](proposal-questions.md) · [Approved migration plan](migration-plan.md) · [Coverage](proposal-coverage.md)

| Group | Proposal |
| --- | --- |
| R01 | [Shared rules and themes](inventory/foundations.md) |
| R02 | [Layout and attached groups](inventory/layout.md) |
| R03 | [Text and formatting](inventory/typography.md) |
| R04 | [Actions, icons and identity](inventory/actions.md) |
| R05 | [Selection and tabs](inventory/selection.md) |
| R06 | [Inputs and forms](inventory/inputs-forms.md) |
| R07 | [Surfaces and content composition](inventory/surfaces.md) |
| R08 | [Navigation and disclosure](inventory/navigation-disclosure.md) |
| R09 | [Messages, progress and statistics](inventory/messages-statistics.md) |
| R10 | [Overlays and help](inventory/overlays-help.md) |
| R11 | [Tables, charts and diagrams](inventory/data-displays.md) |
| R12 | [Rich content and media](inventory/rich-content.md) |
| R13 | [Documentation and public tooling](inventory/documentation-tooling.md) |

The six [core layout entries](inventory.md#core-layout-proposal-for-review) remain in the main inventory. Family files own the other contracts; historical research and capability decisions do not act as competing specifications.

## Decision and evidence index

These links preserve accepted scope, research and bounded verification. Use the current handoff above and the remaining-work queue for the next action.

- **Decision bar — evidence and implementation quality:** [Peter's reaffirmed rule](../decisions/evidence-and-implementation-quality.md) applies before every recommendation. Establish facts, compare viable alternatives and state verification limits. Do not use speed, ease, convenience or smaller counts as a substitute for implementation quality. Reevaluate earlier suggestions when evidence is inadequate. [Current audit](phase-3-review.md#evidence-audit).

- **Deadline pressure removed:** Peter says the deadline has passed and there is no need to rush. Take the time needed for supported decisions and review recent rushed work. The [bounded audit](evidence/pace-review-2026-09-19.json) found and corrected a moved style evidence gate, a container-font omission and stale responsive records. Keep the six capability choices; use native CSS font bases as newly selected. [Stage distinction](phase-3-review.md#work-pacing-and-verification-timing).
- **Style evidence gate preserved:** the [original gate](../decisions/style-production.md) required representative house-pipeline evidence before implementation approval. Peter has now approved the plan with that technical prerequisite retained before dependent source edits. Full implementation regression checks remain Phase 6; approval does not certify mechanisms.

- **Complete replacements reaffirmed:** no other consumers exist. An approved replacement removes the old interface and implementation, with no compatibility support. Code, JSDoc, README and consumer docs describe the current design only; replacement history belongs in notes and Git. This overrides generic skill advice about compatibility. [Clarification](../decisions/agent-skills-workflow.md#complete-replacements-and-current-documentation).

- **Record synchronization:** Peter requires all affected notes to stay current. The [cross-note check](evidence/notes-consistency-review-2026-09-19.json) corrected stale phase handoffs and superseded scope/decision statements, while retaining labelled history and real open questions. Completed reviews now link here for the active phase. Follow the [capture method](../analysis/systematic-approach.md#keeping-the-record-synchronized) whenever a decision changes.

- **Flow Diagram added:** [interactive viewer with ELK and a house Lit renderer](../decisions/flow-diagram.md), including automatic layout/routing, pan/zoom and controls inside nodes. No flow editing/execution. Load geometry separately. [Research and probe limits](evidence/flow-diagram-review-2026-09-19.json), [saved reference](evidence/flow-diagram-reference-2026-09-19.png). ELK relayout may move other nodes; fixed-position rerouting requires a return to research before inventory approval. This addition is saved and joins the architecture/inventory work after Phase 2 closure.
- **Original capabilities and other selections stand:** manifest analyzer, Chromium/Firefox/WebKit verification, Lit Motion, per-icon Material Symbols, the selected Pin Input/Number Input/Scroll Area/Steps behaviours, match-sorter, committed generated styles under src/generated, workflow-built docs, selective imports and the shadow mapping. The original Zag runtime strategy is superseded as below. [Original walkthrough](phase-1-review.md).
- **New living analysis:** [design foundations](../analysis/design-foundations.md), [agent tooling](../analysis/agent-tooling.md), and [developer tooling](../analysis/developer-tooling.md). Existing subject analyses now contain the integration, framework-package, motion/shape, ComboBox/Table, docs-navigation and overlay findings.
- **Latest selections:** shared spacing-only density for pages/sections, normal by default; menus/dialogs/Toasts keep normal inherited spacing; explicitly selected compact controls have a 24 × 24 CSS-pixel clickable-area floor with larger touch-friendly sizing available. Support LTR/RTL for pages/sections in Lit/React. Share moving indicators across suitable single-selection groups using Lit Motion. Exact interfaces and eligibility remain later.
- **Latest implementation correction:** [port Zag behaviour into native Lit using the full house stack](../decisions/zag-behaviour-ports.md). No custom Zag adapter, createMachine/interpreter, vanilla runtime or Zag state store for the five controls. Use the established TanStack Store approach, Lit Motion, generated styles and all applicable house conventions. New components, rebuilds and replacements are allowed; React wraps the same Lit implementation. Existing capabilities stand. The separate remove-scroll utility is unchanged.
- **Table scope stands:** the consuming application runs TanStack Table and owns its state, processing and experimental workers. The design system does not run it. TanStack Virtual is required for both Lit and React virtualization. Results pagination remains reusable, with application-owned state/loading.
- **Latest closure decisions:** [@internationalized/number is selected](../decisions/number-utilities.md) as an independent utility. [Shape morphing follows demonstrated component needs](../decisions/shape-support.md); the entire Material catalogue is not required and no geometry package is selected. The generic library study is background evidence only.
- **Existing state integration first:** atomState already supplies TanStack-backed accessors and named Lit notifications; StoreSelector/StoreEffect and the reconnect patch already exist. Evaluate these helpers and their regression tests before proposing a replacement. Peter permits refactoring, rewriting or renaming them when evidence supports a better implementation; do not disregard them or preserve them automatically. The simplified comparative probe did not test atomState. [Baseline correction and clarification](../decisions/public-state-bridge.md#existing-house-helpers-are-the-baseline).
- **Canonical state reaffirmed:** TanStack Store owns state; properties read/write it and Lit handles presentation/attribute notifications. The [expanded probe](evidence/state-bridge-comparison-2026-09-19.json) distinguishes synchronous ownership from update-cycle copying and identifies notification work still needed.
- **Existing helper refinement verified in scratch:** [saved baseline, candidate and checks](evidence/existing-state-integration-2026-09-19.json) preserve the original two reproduced gaps. The focused refinement passes 24 targeted cases in happy-dom and Chromium, plus all eleven existing regression tests and a strict helper type check. TanStack remains the sole state owner. This establishes a feasible extension of the existing helper; decorator ordering, subscription cost, CEM/compiler/React and Firefox/WebKit remain acceptance gates. Source is unchanged. Continue native-form evaluation against this state contract.
- **Native form timing verified in scratch:** [fifteen-case Chromium comparison](evidence/native-form-mechanism-2026-09-19.json) passes all cases with immediate native synchronization; waiting for Lit rendering fails six. Native submission and validity must track canonical state independently of rendering. A controller with a thin native callback bridge is feasible; final packaging, other control families, Field/managed-form integration and other engines remain open. [Analysis and limits](../analysis/lit-practice-review.md#native-form-timing-and-callback-probe).
- **Latest Phase 4 choices:** [six answers saved](evidence/phase-4-checkpoint-2026-09-19.json). Group wrapping follows Chakra, nested Groups start fresh with appearance defaults, and the outer border is independent of attachment. Responsive settings support plain values, named objects and arrays; names/order are compact, medium, expanded, large and extraLarge; window and explicit container widths are supported, with window as default. The agreed rem thresholds stand. These choices do not approve the entire inventory row.
- **Responsive font basis clarified:** [native CSS rules selected](../decisions/responsive-system.md#native-font-basis-for-each-query-mode). Window-query rem uses the initial/browser-default font size; container-query rem uses the computed root font size. At 16px browser default and 20px authored root, 37.5rem means 600px and 750px respectively. Document and test the difference; no normalization layer is selected. This is specification/test-source evidence, not a new runtime pass.
- **Latest layout/typography choices:** [six more answers saved](evidence/layout-typography-review-2026-09-19.json). Allow application-wide adjustment of the four ordered font-relative thresholds while preserving Material names/order/defaults; support responsive range targeting. Box uses focused shared styling properties, with ordinary CSS for uncommon rules. Primitives use defined native as tag sets; Text defaults to p and Heading to h2, with visual size independent of heading level. These are partial entry decisions, not approval of entire rows or a new styling engine.
- **Latest property/Stack choices:** [six answers saved](evidence/layout-contract-review-2026-09-19.json). Between-threshold ranges follow Chakra's meaning with exact native CSS bounds. Spacing accepts numbered theme keys and explicit CSS values. Shared layout properties use full CSS names, logical directions, camelCase properties and kebab-case attributes. Stack/HStack/VStack default to token 2; HStack/VStack retain their named directions, and general Stack supports responsive direction. [Spacing/naming decision](../decisions/layout-spacing-properties.md), [Stack decision](../decisions/stack-layout.md).
- **Latest container/Stack/Grid choices:** [six answers saved](evidence/query-stack-grid-review-2026-09-19.json). Container mode supports nearest or named ancestors; custom breakpoint widths are configured at startup. General Stack stretches and HStack/VStack centre, with alignItems overrides. Automatic Stack separators are included, off by default. Simple Grid supports column counts and minimum child widths; minimum width takes priority when both valid settings are supplied. Full entry interfaces and runtime verification remain open.
- **Latest responsive/spacing choices:** [three answers and source checks saved](evidence/responsive-spacing-review-2026-09-20.json). Use one HTML attribute with plain or JSON values and corresponding Lit/React property values. Follow Chakra's query-ordering model for overlapping ranges, independent of object key order. Use rem for the house spacing scale at a 16px conversion reference; token 2 becomes 0.5rem. The bracketed-CSS parser hazard is reproduced in isolation and must be avoided in the shared converter. Skipped-position/reflection details remain labelled drafts; no source or browser verification is implied.
- **Latest scale/separator choices:** [three answers, full spacing values and Chromium measurements saved](evidence/spacing-stack-review-2026-09-20.json). Use Chakra's 34 positive spacing steps plus zero. Automatic Stack separators apply gap on each side and follow visible rows/columns without outer-edge dividers. Group's member-order corner rules remain unchanged. The [standalone reproduction](evidence/stack-separator-wrap-probe-2026-09-20.html) verifies the reference layout's wrapping defect, not the selected correction. Complete child/slot ownership, cross-axis spacing, RTL/reverse handling and all three browser engines remain acceptance work.
- **Latest primitive choices:** [three selections and native-browser evidence saved](evidence/primitive-interfaces-review-2026-09-20.json). Use standard naming attributes with shared forwarding, support inline Box with as="span", and use p/span/div for Text with p as default. The [standalone probe](evidence/primitive-semantics-probe-2026-09-20.html) establishes host placement, inner heading semantics and label-reference scope in Chromium only. Precise forwarding/styling targets and lifecycle checks remain open; coordinate Heading/TOC discovery and Field references before approval.
- **Latest Box choices:** [four selections and candidate property groups saved](evidence/box-contract-review-2026-09-20.json). Box supports nine native tags with div default, responsive parent-placement properties, tag-based default display, and theme tokens or CSS visual values. The [candidate property table](inventory.md#candidate-property-table) remains unapproved; close its exact types/defaults, token mapping, precedence and host/native styling targets before full row approval. No new browser check or source change is claimed.
- **Latest shared-value choices:** [four selections and bounded CSS-order evidence saved](evidence/shared-style-values-review-2026-09-20.json). Support signed spacing where valid, numeric dimension steps plus CSS, independent size/spacing categories with matching defaults, and Chakra declaration order for overlapping properties within a condition. The [Chromium reproduction](evidence/padding-order-probe-2026-09-20.html) verifies two native CSS outcomes, not a complete house framework contract. Lit's pre-upgrade replay follows property metadata; defining authored order across input paths is the priority follow-up.
- **Latest getter choice:** [omitted CSS styling inputs read undefined](../decisions/layout-spacing-properties.md#omitted-styling-inputs-and-visual-defaults); CSS supplies their visual defaults. Explicit inputs remain readable as supplied. Semantic state defaults remain separate. Peter selected this after the actual Material Web Lit/Chakra/Radix/Pro comparison; it is a house API choice, not universal community consensus. [Answer and complete integration evidence](evidence/style-input-integration-review-2026-09-20.json), [reference analysis](../analysis/design-foundations.md#omitted-styling-inputs-and-reference-defaults).
- **Declaration-order feasibility:** the [initial fixture](evidence/declaration-order-probe-2026-09-20.json) and [integration follow-up](evidence/style-input-integration-review-2026-09-20.json) preserve expected baseline failures and bounded candidate passes. The original capture candidate passes 15/15 checks per engine; complete React order synchronization passes 21/21 normally and in Strict Mode per engine, versus 15/21 for the plain wrapper. CSS defaults pass 14/14 cases per engine. Field/accessor annotations link manifest fields/attributes in the isolated analyzer. These are two-property checks in Chromium, Firefox and WebKit, not a full shared module or actual Safari certification. The subsequent package/compiler checks below narrow the path and compilation gaps; final package exports, all property kinds and responsive combinations remain open. Probe servers/tabs are stopped; only a dedicated temporary browser-test cache remains.
- **Package/compiler follow-up:** [read-only real-source analysis and compiled fixture results](evidence/style-package-verification-2026-09-20.json) are saved. Analyzer 0.11.0 reads 330 source modules; three external exports are misclassified by quote handling, and 318 other reference strings need consistent source/output paths. A temporary source correction plus TypeScript-resolved publication mapping produces 1,072 consistent local references. The two-field fixture passes strict declaration/consumer checks and all fifteen capture cases after Lit compilation in each required engine. This does not certify the full source API, final package layout or generated-CSS pipeline. @internal helper visibility in emitted types remains to resolve. All owned test processes are stopped; production files/dependencies are unchanged.
- **Lit style helper selected:** Peter chose [a Lit helper for overlapping styles](../decisions/layout-spacing-properties.md#lit-helper-for-ordered-styling-inputs), keeping declaration order, individual component properties, static HTML attributes and canonical TanStack state. [Decision and lifecycle evidence](evidence/lit-style-helper-review-2026-09-20.json) preserve the original failure and 21 passing checks per engine, before/after Lit compilation, with explicit global-registry selection at node creation. The exported name/types and full lifecycle/responsive contract remain open; the later ownership selections below apply. Do not re-ask helper inclusion.
- **Helper ownership selected:** [two answers and 19 passing assertions per engine](evidence/lit-style-ownership-review-2026-09-20.json) are saved. The helper manages only supplied settings, clears removed managed keys and leaves unrelated settings intact. Each helper/template render restores its currently supplied values; outside property writes still work immediately until that later render. TanStack batch prevents the tested subscriber from seeing intermediate values. Removing the helper expression itself remains separate from removing keys. [Decision](../decisions/layout-spacing-properties.md#settings-managed-by-the-lit-helper), [inspector dependency](../decisions/design-system-devtools.md#controlled-styling-input-dependency); inspector editing is excluded by the whole-set approval.
- **Shared registry follow-up:** a reduced native test reproduces WebKit 26.6 leaving late-defined importNode-created elements without the intended registry. Lit's public creationScope with explicit registry selection resolves the tested global case; Chromium/Firefox also pass. This is a shared definition/rendering dependency, not a style-only workaround or actual Safari certification. Scoped registries, adopted documents and the final house rendering mechanism remain to verify. [Analysis](../analysis/lit-practice-review.md#lit-helper-lifecycle-and-registry-boundary), [dependency register](phase-2-review.md#lit-style-authoring-and-declaration-order). All owned probe servers/browser processes are stopped.
- **Latest disposition checkpoint:** [choice record](evidence/disposition-checkpoint-2026-09-19.json) and [living analysis](../analysis/codebase-systematization.md#disclosure-layout-and-smaller-component-dispositions). Accordion and Collapsible replace Collapse/Collapse Group; Context Card is removed and Toggle Tip is included; Scroll Area replaces Scroller; retain ordinary Grid/Simple Grid and remove the decorative grid family. Remove Loading Dots entirely; Gauge becomes Meter; Relative Time becomes standalone text with a Hover Card composition; Dots Menu becomes a Menu/Icon Button composition. [Explicit removal list](../decisions/component-removals.md) includes its dedicated family cleanup.
- **Dialog revision:** provide [Dialog plus Alert Dialog](../decisions/dialog-components.md), informed by the specific shadcn Base version. This supersedes the intervening Dialog-only vote. Remove Destructive Modal; typed confirmation remains a tested composition. [Material Dialog review](evidence/material-dialog-review-2026-09-19.json) records four tabs, two expanded token sets and six diagrams; runtime behaviour remains untested.
- **Final terminology evidence:** [649-file census](evidence/phase-2-terms-census-2026-09-19.json) and [13 choices plus layout clarification](evidence/phase-2-closure-2026-09-19.json). Use Stack/HStack/VStack for ordinary layout; Group is for its specific shared presentation. Forms is a guide, not a component.
- **Research still to finish:** Material Progress tab text is read, but interactive token sets and specification diagrams, plus the actual Lit progress implementation comparison, must be completed before visual recommendations/inventory approval. Do not reopen the Loading Dots/Meter choices for that coverage task.
- **Resizable follow-up:** [shadcn Base Resizable](https://ui.shadcn.com/docs/components/base/resizable) is an added composition reference for the already-selected [resizable panes](../decisions/resizable-panes.md). Review suitable Sidebar, split-layout and Scroll Area combinations; it does not select a separate React runtime.
- **Accelerated checkpoint:** [numeric-value formatters](../decisions/format-components.md), [responsive Sidebar](../decisions/responsive-sidebar.md), [discovered and explicit TOC entries](../decisions/table-of-contents.md), [Field/Item replacing settings rows](../decisions/settings-row-composition.md), and [Data List replacing Description](../decisions/data-list.md) are selected. [Choice and source record](evidence/capability-checkpoint-2026-09-19.json).
- **Direct additions:** [Accordion, Show, Hover Card and appropriate as support](../decisions/additional-component-capabilities.md) are included, alongside FormatNumber/FormatByte. Inclusion is not an open vote. Exact mounting, semantic rendering, formatting options, overlay contracts and migration mappings remain later work. [Targeted analysis](../analysis/codebase-systematization.md#accelerated-capability-and-disposition-checkpoint).
- **Latest Item decision:** [keep one focused Item family](../decisions/item-content-family.md) for media, title, description, supporting information and actions. It replaces overlapping Entity/Item purposes. This supersedes the provisional composed-examples answer after the ten-system survey and joint review. It does not make Item the interaction owner of every selection control, navigation link, form or tree node.
- **Latest Tree decision:** [generalise File Tree to Tree View](../decisions/general-tree-view.md), with file-tree presentation as one composition. Expansion/hierarchy/keyboard behaviour belong to Tree View; advanced features and exact data/slot contracts remain separate choices.
- **Joint review evidence:** [ten-system row survey](evidence/row-pattern-survey-2026-09-19.json), [content/selection/navigation comparison](evidence/joint-composition-review-2026-09-19.json), and [complete Material navigation Specs](evidence/material-navigation-specs-2026-09-19.json). The [living analysis](../analysis/codebase-systematization.md#joint-content-selection-and-navigation-review) covers shadcn Item/Sidebar, Pro Sidebar/TOC and kits, Material Drawer/Rail plus actual Lit source, APG distinctions and generic Tree references. New research is not blanket scope approval.
- **Latest Stat decisions:** [one Stat family](../decisions/stat-family.md), with change display inside it; remove standalone Trend. Replace Stat Strip/Strip Item with composed selectable-Stat examples. Separately remove Tile/Tiles, using Card for related-content surfaces, Stat for measurements and shared layout. Preserve compact/collapsed summaries. Radio Cards/Checkbox Cards are candidate selection compositions, not a final universal control choice.
- **Latest Group decisions:** [general Group supplies compatible appearance defaults](../decisions/group-presentation.md), with individual overrides, and replaces ButtonGroup. [Avatar Group remains](../decisions/avatar-group.md) for member limits/counts. Attached Radio/Checkbox Card presentation and an independent outer-border capability are selected. Evaluate exact border/corner/focus treatment and reuse for input add-ons; full interfaces remain open.
- **New List and Field:** [List](../decisions/list-component.md) supplies Chakra-like semantic ordered/unordered/nested lists with markers and rich content. [Field](../decisions/field-component.md) connects labels, help and errors to controls, with required/optional and horizontal/vertical presentation. Fieldset, native form behaviour and optional TanStack Form retain their selected responsibilities.
- **Indicator clarification:** [one shared active-indicator component](../decisions/shared-selection-indicator.md) contains Lit Motion and must support **horizontal and vertical** movement/resizing. It serves suitable single-selection patterns; Checkbox/multiple selection is excluded. Peter requests an additional outlined/inset-highlight Tabs variant and evaluation of Radio + Group + the shared indicator for Segmented Control. The approved Tabs variants are primary/inset with primary default; generated values and visual behavior still require their assigned verification.
- **Latest saved research:** [Stat](evidence/stat-review-2026-09-19.json); [complete Chakra Group usage census](evidence/group-review-2026-09-19.json), including all 63 direct-use files and 54 component examples; [Field/List](evidence/field-list-review-2026-09-19.json); [Material List Specs](evidence/material-list-specs-2026-09-19.json), both token sets and all 35 static figures; [Material Text Field Specs](evidence/material-field-specs-2026-09-19.json), both token sets and all 16 static figures. Living analysis is in [codebase systematization](../analysis/codebase-systematization.md#stat-family-review) and [animation](../analysis/animation-package.md). These records preserve proposals, selected choices, limits and required return points.
- **Saved visual references:** [Group outline](evidence/group-outline-reference-2026-09-19.png), [additional Tabs variant](evidence/tabs-variant-reference-2026-09-19.png) and [Segmented Control](evidence/segmented-control-reference-2026-09-19.png). These user-supplied images are copied into the record so temporary clipboard paths are not required to resume.
- **Complete Pro evidence:** all 338 blocks, 1,003 block files, both kits' 250 files, and seven Free Blocks aliases are covered. The [review](chakra-pro-review.md), [per-file ledger](evidence/chakra-pro-review-ledger.json), [collection audit](evidence/chakra-pro-collection-audit.json) and [capability synthesis](/Users/peterkloss/Documents/ACMElabs/design-system-references/chakra-ui-pro/2026-09-19/reviews/capability-synthesis.md) preserve findings and limits. Use the collection in each relevant comparison.
- **Decision dependencies:** check every recommendation against accepted decisions and upcoming choices that could change it. Surface conflicts and decide whether existing/new/both need revision. Record each deferral's question, reason, dependency, return point and closure gate in the [review register](phase-2-review.md#decision-compatibility-and-dependencies), with a link from its owning review section. Deferral is not consent or completion.
- **Standing reference rule:** whenever considering Radix, Chakra UI, Material Design 3 guidance or Material Web's Lit implementation, also search the complete Chakra UI Pro block and kit collection for relevant evidence. It is an additional source, not a list of features to implement. Existing source roles and Peter's approvals still determine the result. [Recorded rule and collection access](../decisions/reference-systems.md#standing-comparison-rule).
- **Latest responsibility selection:** Group owns arrangement/shared presentation; Toolbar identifies related controls and owns coordinated keyboard movement; selection controls retain selected values and forms. These responsibilities compose. [Decision](../decisions/toolbar-group-responsibilities.md). Nested inputs, radio/segmented controls, disabled-action discovery, RTL, overflow and overlay focus return remain named Group/inventory dependencies.
- **Full Material review rule:** always read Overview, Specs and Guidelines in full, plus available Accessibility; include relevant other components and foundation documentation. Expand specification content and distinguish incomplete extraction, source text, diagrams and implementation. [Standing method](../decisions/reference-systems.md#complete-material-documentation-review). The [46-page review](evidence/material-full-review-2026-09-19.json) covers 20 Layout pages, six Interaction pages and all four tabs for five components, plus actual experimental Lit source and Chakra/Radix/APG comparisons. [Analysis](../analysis/codebase-systematization.md#full-material-review-and-selected-responsibilities).
- **House-versus-reference clarification:** label Material values and units separately. Evidence from a component review may justify a proposed change to house spacing, density or other rules; identify earlier/upcoming impacts and take the concrete revision to Peter. Existing decisions remain the baseline until changed. No numerical or visual replacement was selected in this review. [Recorded clarification](../decisions/reference-systems.md#reference-evidence-and-house-changes).
- **Composition qualification:** [Feedback](../decisions/feedback-component.md) and [Empty State](../decisions/empty-state-component.md) are accepted composed components with examples. Their consistent interface, structure and common experience justify retention. The [composition rule](../decisions/composition-over-count.md) now records that qualification; it does not retain all fixed arrangements automatically. [Error removal](../decisions/message-context-and-errors.md) preserves notification contexts and attached field validation.
- **Pre-implementation baseline and version history:** the source freeze ended when M00 closed. Its 870 saved fingerprints remain the historical baseline; the active slice records explain authorized changes. Publication settings remain unchanged. [Capture verification](evidence/extension-capture-verification.json) checks 870 protected fingerprints and local links. Peter authorized committing this records checkpoint and delegated the push decision. Git history, working-tree status and branch/upstream refs determine what is committed or pushed; dated capture records describe their capture time. The licensed reference source stays in its private local collection. The later migration approval authorizes implementation after its technical gates; it does not authorize release.
- **Evidence:** [ComboBox/Zag](evidence/additional-probes-2026-09-19.json), [lint tooling](evidence/tooling-evaluation-2026-09-19.json), [responsive review](evidence/responsive-review-2026-09-19.json), [Intent probe](evidence/intent-probe-2026-09-19.json), and [Devtools probe](evidence/devtools-probe-2026-09-19.json). Synthetic prototypes are not the finished integrations. The earlier 608-unit-test result is historical, not rerun here; the lint probes are not clean certification.
- **Latest evidence:** [blue/control review](evidence/blue-control-review-2026-09-19.json) preserves the browser measurements and comparison; [Table review](evidence/table-review-2026-09-19.json) now includes integrity-checked published artifacts, rendering/layout/pagination references and the consumer-owned correction. These follow-up Table findings are source inspection, not a new browser pass. This capture changes records only.
- **Pane evidence:** [package/source comparison and synthetic probes](evidence/resizable-panes-2026-09-19.json). The probes establish specific connector/sizing outputs, not a real Lit adapter or browser pass. No upstream patch/report was sent.
- **Zag support correction:** official @zag-js/vanilla 1.44.0 is published, but uses @zag-js/store. Lit support remains an unpublished, open draft PR. The vanilla discovery does not override Peter's no-Zag-runtime and TanStack-state decisions. [Review](../analysis/package-choices.md#native-lit-port-strategy).
- **Native-port evidence:** [source mappings and number-parser probe](evidence/native-port-mapping-2026-09-19.json). No port was implemented. The selected independent parser passed six API cases in Bun; no browser/form/IME integration is claimed and it is not installed in the project.
- **Shape background:** [geometry probes](evidence/shape-geometry-review-2026-09-19.json) exposed source/endpoint differences but do not establish AndroidX fidelity. Current component needs can start with ordinary properties and transforms; custom geometry requires a demonstrated inventory need.
- **Foundation follow-up:** [sources, selections and Interaction probe](evidence/foundation-followup-2026-09-19.json). Temporary window listeners remaining after Interaction disconnect were reproduced with synthetic EventTargets in Bun. Drawer/Slider cancellation and Button loading/disabled differences are source findings pending browser checks. Feed/list-detail/supporting-pane layouts remain recipe candidates, not approved new elements.
- **Communication:** use Peter's [local question skill](/Users/peterkloss/Dev/ACMElabs/ask-user-question/skills/ask-user-question/SKILL.md) and Codex reference. Each question and wait-what repair must contain its context, evidence, recommendation and needed consequences inside the dialog; commentary outside is not enough. Length follows the decision, not an arbitrary shortness rule. The [renderer investigation](../analysis/question-dialog-countdown.md#renderer-investigation-and-continued-use-2026-09-20) verifies plain-text rendering and failed newline/HTML/Markdown experiments; use the supported question plus separate option blocks without claiming rich formatting works. Peter declined building a replacement tool and explicitly chose to keep this one. No agent deadline; use the permitted blocking Plan-mode route, not the async countdown card. No app, settings or skill changes were made.

Phase 3 directions and method:

- [Compiled CSS to generated Lit style modules](../decisions/style-production.md).

- [Evidence and implementation quality](../decisions/evidence-and-implementation-quality.md).
- [Overlay controllers and native surfaces](../decisions/overlay-architecture.md).
- [Store-backed public state](../decisions/public-state-bridge.md).
- [Shared native form mechanics](../decisions/native-form-architecture.md).
- [Theme resolution separate from persistence](../decisions/theme-resolution-architecture.md).

Latest Phase 2 decision notes:

- [segmented control](../decisions/segmented-control.md).
- [app bar](../decisions/app-bar.md).
- [navigation compositions](../decisions/navigation-compositions.md).
- [logs composition](../decisions/logs-composition.md).
- [toggle button](../decisions/toggle-button.md).
- [named size vocabulary](../decisions/named-size-vocabulary.md).
- [shape vocabulary](../decisions/shape-vocabulary.md).
- [state vocabulary](../decisions/state-vocabulary.md).
- [text role vocabulary](../decisions/text-role-vocabulary.md).
- [open expanded vocabulary](../decisions/open-expanded-vocabulary.md).
- [event vocabulary](../decisions/event-vocabulary.md).

- [Flow Diagram with ELK and house Lit rendering](../decisions/flow-diagram.md).

- [Accordion and Collapsible](../decisions/disclosure-components.md).
- [Tooltip, Hover Card and Toggle Tip](../decisions/overlay-help-components.md).
- [Explicit component removals](../decisions/component-removals.md).
- [Layout Grid and Simple Grid only](../decisions/layout-grid.md).
- [Spinner and Progress without Loading Dots](../decisions/loading-indicators.md).
- [Dialog plus Alert Dialog](../decisions/dialog-components.md).
- [Meter replaces Gauge](../decisions/meter-component.md).
- [Standalone Relative Time](../decisions/relative-time-component.md).
- [Menu composition replaces Dots Menu](../decisions/dots-menu-composition.md).

Accepted extension decision notes:

- [Separate Group, Toolbar and selection responsibilities](../decisions/toolbar-group-responsibilities.md).
- [Publish React support as a separate package](../decisions/react-integration.md).
- [Support consumer use of TanStack Table, with TanStack Virtual for Lit and React](../decisions/tanstack-table-compatibility.md).
- [Provide reusable results pagination](../decisions/results-pagination.md).
- [Provide resizable panes, with optional collapse and application-owned saving](../decisions/resizable-panes.md).
- [Port behaviour into new or rebuilt Lit components using the full house stack](../decisions/zag-behaviour-ports.md).
- [Use independent Adobe number utilities](../decisions/number-utilities.md).
- [Share density settings across pages and sections](../decisions/density.md).
- [Support both reading directions](../decisions/bidirectional-support.md).
- [Share moving selection-indicator behaviour](../decisions/shared-selection-indicator.md).
- [Keep native forms and make TanStack Form optional](../decisions/native-and-managed-forms.md).
- [Exclude server-side rendering](../decisions/server-rendering.md).
- [Use Material motion roles with both motion schemes](../decisions/material-motion-system.md).
- [Make shape morphing specific to demonstrated component needs](../decisions/shape-support.md).
- [Wrap complete names in multi-line ComboBox options](../decisions/combobox-long-labels.md).
- [Use the house stack for overlapping Toasts](../decisions/toast-behaviour.md).
- [Open interactive rich help by explicit activation](../decisions/rich-help-activation.md).
- [Support full visual themes on pages and sections](../decisions/custom-themes.md).
- [Make blue the default accent for relevant controls](../decisions/blue-accent.md).
- [Keep ripples off by default and allow opt-in](../decisions/optional-ripples.md).
- [Replace Biome with Oxlint and Oxfmt using Ultracite](../decisions/lint-toolchain.md).

- [Share responsive values across layout and appearance](../decisions/responsive-system.md).
- [Add Box to the planned primitives](../decisions/box-primitive.md).
- [Ship versioned consumer skills](../decisions/consumer-skills.md).
- [Provide a design-system documentation MCP server](../decisions/design-system-mcp.md).
- [Use TanStack Intent for consumer-skill tooling](../decisions/intent-tooling.md).
- [Keep AI support focused on artifact authoring in this pass](../decisions/ai-authoring-scope.md).
- [Build a shared inspector using TanStack Devtools](../decisions/design-system-devtools.md).

Keep Toast under the existing community-naming rule. The survey supports it; it was not a separate naming vote. Always compare the actual Material Web Lit implementation where relevant, under the [reference-system decision](../decisions/reference-systems.md).

## Why this library exists, and what this pass is for

`@acmelabs/design-system` is the design system, as Lit web components with the `acme-` prefix. It exists so AI-generated artifacts stop guessing at a design language: it is version-tracked, standardized, and renders in the static HTML pages Claude uses for artifacts, which is why it is Lit and not React. The first passes ported vercel.com/geist one-to-one in style, behaviour and functionality. `PLAN.md` records that work, and the fixes it lists are settled.

**Parity was the floor. This pass is about the system.** The goal is no longer to match Geist; it is to standardize and systematize what we have: one name for one concept, one shape for one kind of interface, and fewer elements, built from a small set of primitives flexible enough that the rest of the library composes them. Where today we have several elements that each draw a bordered box with a head and a body, the end state is one container that the others compose, or a documented recipe of primitives that replaces an element entirely. Removals, renames and replacements are part of that, not separate from it.

"I" throughout this file is Peter.

## Skills

The procedures this pass follows are repo skills in `.agents/skills/`, listed in `AGENTS.md`. Codex shows them in the skill selector; any agent can read them as files.

- **domain-modeling** owns the glossary (`CONTEXT.md`) and decision records. Follow it in Phase 2 and whenever a term is challenged.
- **codebase-design** is the architecture vocabulary for Phases 3 and 4.
- **improve-codebase-architecture** finds shallow modules and deepening candidates. I say when to run it (Phase 3).
- **grill-me** is the one-question-at-a-time decision walk inside Phase 3 and per inventory entry in Phase 4. Questions go through `ask-user-question`.

For this walkthrough Peter explicitly selected the local [ask-user-question skill](/Users/peterkloss/Dev/ACMElabs/ask-user-question/skills/ask-user-question/SKILL.md), with its [Codex contract](/Users/peterkloss/Dev/ACMElabs/ask-user-question/skills/ask-user-question/references/codex.md). Use that copy in preference to the plugin cache. This records a task preference; no plugin or global skill was changed.

Addy Osmani's **Agent Skills** also supports the remaining pass. Use its relevant specification, research, planning, implementation, test, and review skills as each stage begins. Preserve the project-specific rules and output paths; [systematic-approach.md](../analysis/systematic-approach.md#agent-skills-for-the-systematization-pass) records the mapping and the defaults our rules override. Load skills as needed rather than preloading the pack's meta-router into project instructions.

## Rules specific to this pass

The general rules are in `AGENTS.md` and `PLAN.md` §1. These apply to this pass:

- **Questions use the question tool, with multiple-choice answers and no answer deadline.** Peter, 2026-09-10: follow `ask-user-question`, and wait until he answers or explicitly closes the question. Never treat elapsed time as an answer, a skip, or permission to proceed. Do not substitute a chat-only question. Do not claim to have disabled an app countdown without verifying it.
- **Source code changes start when the migration plan (Phase 5) is approved.** Until then the outputs are `CONTEXT.md`, decision notes, and documents under `notes/alignment/` and `notes/analysis/`.
- **Every change is a replacement.** The new name, shape or element is the only one left in the code. There are no compatibility aliases, deprecated exports, fallbacks or legacy modes. Code, JSDoc, README and consumer docs describe only the current design. What it replaced, and why, belongs in notes and Git history.
- **Best, not fastest.** Where the best path and the quick path differ, both are named and the best one is taken. Peter reaffirmed on 2026-09-19 that implementation effort must not decide the outcome. Compare long-term fit, correctness, capability, performance and maintenance; recommend replacement when it produces the better library.
- **Compare relevant implementations before asking.** Include Material Web's Lit implementation in future comparisons, as Peter requested on 2026-09-19. Explain how Chakra, Radix and other relevant references handle the question; distinguish authored inputs, generated output, design tokens and actual shipped behaviour. Existing appearance and package decisions still govern unless new evidence leads Peter to change them.
- **Always include the additional Pro reference source in relevant comparisons.** Whenever Radix, Chakra UI, Material Design 3 guidance or Material Web's Lit implementation is considered, referenced or evaluated, also search the [complete Chakra UI Pro block and kit collection](chakra-pro-review.md) for relevant evidence. Consult both capabilities and composition patterns, and record which examples matter or that none apply. Examples inform the comparison; their presence does not approve a feature, component, visual treatment or dependency. [Standing decision](../decisions/reference-systems.md#standing-comparison-rule). Preserve the existing roles of all sources and distinguish source code, observed behaviour and placeholders.
- **Check decisions in both directions.** Compare a recommendation with accepted decisions and with upcoming choices that might change it. Name conflicts and whether the existing decision, new proposal or both need revision; material changes go to Peter. Record unresolved dependencies and an explicit return point for deferred questions, linked from the [deferred register](phase-2-review.md#deferred-decisions) and the review section that must revisit them. Bring needed research forward rather than close a phase with its required decisions unresolved.
- **The mandated package stack stands, with explicit Phase 1 changes.** Peter retained [Lit Motion](../decisions/animation-package.md), selected [native behaviour ports using the house stack](../decisions/zag-behaviour-ports.md) instead of Zag runtime/adapter adoption, and selected [published match-sorter](../decisions/match-sorter.md). The [extension register](additional-functionality-review.md) records the other selected additions and verification conditions. Unselected research requests do not authorize substitutions or early implementation.
- **A deleted element is deleted whole:** element, map, sketches, spec, census config, docs page.
- **A rename that touches a class name or a prop the styles key on** is a change to `tools/geist/maps/<name>.ts`, followed by regeneration.
- If a name is odd because of an external constraint (the HTML attribute `type`, a platform API, a published entry point), record the constraint instead of flagging the name.
- If a finding is a judgment call, show the options with the evidence for each rather than picking one silently.

## Phase 0: Record the decisions this pass rests on

Write these as decision notes before doing anything else. They are decided; record them well and link them from `PLAN.md`.

Recorded 2026-09-19:

- [Goal and success criterion](../decisions/systematization-goal.md).
- [Composition over count](../decisions/composition-over-count.md).
- [Elements added beyond Geist](../decisions/non-canonical-elements.md).
- [Reference systems](../decisions/reference-systems.md).
- [Floating-surface shadows](../decisions/floating-surface-shadows.md); Phase 1 review selected the role mapping and the plain-tooltip/Toast treatments. [Research](../analysis/floating-surface-shadows.md).
- [Material tab indicator](../decisions/material-tab-indicator.md).
- [Shared icon library](../decisions/shared-icon-library.md); Phase 1 review later selected [per-icon elements](../decisions/icon-element-shape.md) and [Material Symbols SVGs](../decisions/material-symbols-icons.md).

1. **Goal, restated.** Supersedes the "exact parity" clause of `notes/decisions/parity-scope.md`. Geist stays the baseline for every element Geist has. Named deviations are allowed; each records its source (Radix, Chakra, Material) and the value or behaviour taken. The census either accepts a deviation per element in the `ACCEPTED` table in `diff.ts`, or drops that element from the sweep; say which, per element. Elements Geist does not have are verified against their source system's published values. The rest of parity-scope.md stands: self-consistent first, idiomatic for Lit second, familiar to a reference user third.
2. **Composition over count.** An element earns its place by doing something the primitives composed together cannot. An element that is only a fixed arrangement of primitives becomes a recipe (a pattern page, and where it is page-level, a `dashboard.css` recipe), not an element. Every element in the inventory states what it composes and what composes it.
3. **Non-canonical elements.** The 26 elements the earlier passes invented beyond Geist (list in Phase 2.5) require individual dispositions and are not automatically parity-tested. No rename or deepening effort goes into an undecided implementation. Each is deleted, or rebuilt as canonical with its own decision note. Known to come back: Toolbar, Chart (TanStack charts), Markdown (TanStack markdown and highlight). The later [Stat decision](../decisions/stat-family.md) retains Stat and removes standalone Trend; its change display belongs to Stat.
4. **Reference systems.** Geist for the baseline. Radix Themes and Chakra UI for what Geist lacks and for naming when Geist's name is not the community's. Material 3 for the tab indicator and selected plain-tooltip guidance; Material Symbols for icon artwork. Peter additionally requested Material Web as an ongoing Lit implementation reference. When references disagree on a name, the more widely used name wins, and the note shows the survey that decided it.
5. **Floating surfaces** use the selected Radix role tiers: hover cards 4; menus, popovers and Toast 5; dialogs and modal drawers 6. Plain Tooltip has no shadow. The decision note maps these roles to current surfaces; final identities remain for the inventory.
6. **Tabs** take Material 3 primary tabs' indicator anatomy, states and behaviour, including the horizontal slide on change. Phase 1.5 review retained Lit Motion.
7. **Icons move into an icon library.** No element carries its own inline glyph boilerplate. Phase 1.6 review selected one element per icon using Material Symbols SVGs, defaulting to Rounded and unfilled. Detailed interfaces and delivery remain open.

## Phase 1: Your own analysis

After the opening questions. Each item produces a document in `notes/analysis/`, linked from `notes/alignment/README.md`. Read-only against `src/`.

1. **Codebase analysis.** A deep read of `src/`, `docs-src/`, `tools/geist/` and `scripts/`. What the elements share, where they diverge, what is hand-rolled, what is duplicated, which elements are fixed arrangements of others. This is your view, not a check of mine; I expect it to find things I have not.
2. **Lit practice.** Research current best practice for web components built with Lit: reactive controllers, directives, `ElementInternals` and form association, `CustomStateSet`, scoped registries, SSR readiness, the custom-elements manifest, testing. Extend `lit-practice-review.md` rather than replacing it. Say where we are behind and what it costs.
3. **Mandated-package integration audit.** For each package in PLAN.md §1, what functionality in `src/` it should own and does not. `hand-rolled-audit.md` starts this; finish it, per package, with the elements affected and the shape of the integration (a shared controller, a directive, a wrapper).
4. **Library gaps.** Where the pass will need something no mandated package covers (pin input, number input, scroll area, timeline, and whatever else the inventory reveals), research what the community rates highly, then apply the second filter from PLAN.md §1: is the well-liked option already being displaced by something smaller, faster and more current? Report what you compared and why. I decide.
5. **Animation package.** Read `notes/decisions/motion-on-the-book.md` first; it records demos that answered an earlier objection, and the research must not relitigate that. Then survey the field: is there a newer, smaller, faster, more robust animation library, ideally Lit-native, gaining adoption over `@lit-labs/motion`? Compare on size, performance, API fit with Lit, enter/exit and size-change handling, maintenance, adoption trend. Recommend; I decide.
6. **Icon library.** Two shapes to lay out: one `<acme-icon name="…">` element backed by a registry, or one element per icon (`<acme-arrow-up-icon>`). Compare tree-shaking under our two builds (unbundled and the CDN bundle artifacts use), naming, authoring cost, and how the `start`/`end` slot examples read. Also which icon set: Geist's own, Lucide, or another, with the licence. Recommend; I decide.

7. **Repository layout.** An earlier agent repeatedly had its work overwritten because it did not know where the build writes. The cause is on disk: generated files are committed in places that read as source. `tokens.css` and `dashboard.css` are written to the repo root by `scripts/split-css.ts` and `scripts/build.ts`; the whole `docs/` directory is written by `docs-src/build.ts` (and `docs/` is also where the community keeps hand-written docs); every `*.styles.ts` in `src/components/` is generated and sits beside the hand-written element; `package-lock.json` sits beside `bun.lock` in a Bun-only project; `src/components/book.zip` is a stray. Research how well-regarded Lit and web-component libraries organize a repository (Shoelace / Web Awesome, Spectrum Web Components, Material Web, Lion, Vaadin, Nord at least): where source, generated output, built packages, the docs site and tooling live; how generated files are marked; what `package.json` `files` and `exports` look like. Propose a layout for this repo that an agent arriving cold would read correctly, and that preserves the generator pipeline (`tools/geist/`) and the standing build rules. Include a `## Generated files` section for README and `notes/alignment/README.md` listing every generated path and the script that writes it, whatever layout we choose.
8. **Build and performance.** Research how a Lit component library should be built and delivered for performance, and measure where we stand: bundle size and chunking (the single bundle is 1.33 MB minified; PLAN.md 5.7 already queues splitting charts, forms, markdown and highlighting into separate entries); per-element entry points and tree-shaking (`package.json` sets `"sideEffects": true` for the whole package, which disables tree-shaking for every consumer); `tokens.css` at 260 KB and what the elements actually read; CSS delivery inside shadow roots (constructable stylesheets, `adoptedStyleSheets`, one shared sheet vs. per-element); the Lit template compiler we already use; lazy element definition; SSR readiness; what the CDN path used by artifacts loads on first paint. Report measured numbers, the community's practice, and a prioritized set of changes with the expected gain for each. I decide.

9. **Documentation site.** Audit `docs-src/`: the page structure, the fragments, and what each page hand-builds that a shared doc component could own (example blocks, prop and event tables, the states sections, census pages). Research how well-regarded Lit libraries document their components (Shoelace / Web Awesome, Spectrum Web Components, Material Web, Lion at least): page layout, generation from the custom-elements manifest, live examples beside their code, API tables, composition examples. Report what one standardized page looks like for this library and which doc components would produce it.

Stop and walk me through the findings before Phase 2.

## Phase 2: Domain model and dispositions (domain-modeling skill)

### 2.1 Seed `CONTEXT.md`

Completed seed on 2026-09-19. Peter selected two linked contexts: [component library](../../CONTEXT.md) and [generation/comparison tools](../../tools/geist/CONTEXT.md), connected by the [context map](../../CONTEXT-MAP.md). Shared terms are defined once. Entries cover `variant`, `type`, `start`/`end`, add-ons, the message family and PLAN section 2's tooling vocabulary, with `_Avoid_` lists. Extend these glossaries as later terms are settled; keep implementation details in the analysis and inventory.

### 2.2 The message family

Three concepts, three names:

| Term | Scope | Placement | Lifecycle |
|---|---|---|---|
| **Toast** | result of a recent action | corner overlay | auto-dismisses |
| **Alert** | a section, form or block | inline, inside the section | while the section is relevant |
| **Banner** | the page or the app | top of the page, full width | until dismissed or resolved |

Today's `note` is the Alert. Write all three into `CONTEXT.md`, then audit every element that shows a message (`note`, `banner`, `toast`, `feedback`, `error`, `error-card`, `empty-state`, `project-banner`) against them. Anything that is one of the three by another name is renamed or folded in. Anything that is none of them is a real fourth concept, argued for, or goes.

Disposition review completed 2026-09-19; [full record](phase-2-review.md#message-family-dispositions). Note becomes Alert; Toast and Banner retain their distinct contexts; Feedback stays as a composed form plus examples; standalone Error is removed; Error Card and Project Banner retain their prior delete decisions; Empty State stays as a composed component plus examples. Feedback collects input and Empty State explains absent content, so neither adds a fourth notification level. Exact interfaces and behaviour contracts remain for later phases.

### 2.3 The container family

Review `card`, `entity`, `fieldset`, `panel`, `link-card`, `tile`, `item` and `setting-row`. The source survey corrects the premise that all eight are equivalent bordered containers: Entity/Item are rows, Tile is a labelled value, and the current Fieldset is a settings-card presentation. [Evidence](../analysis/codebase-systematization.md#phase-2-container-family). The comparison covers Radix, Chakra, Geist, Material Web, Ant Design and Web Awesome. Peter selected [one flexible Card](../decisions/canonical-card.md), [Fieldset form grouping](../decisions/fieldset-form-group.md), and the [Group/Toolbar/selection split](../decisions/toolbar-group-responsibilities.md). [Stat dispositions](../decisions/stat-family.md) are now selected. The Group review has been brought forward: general Group replaces ButtonGroup, Avatar Group remains for member counts, and Field and List are added. The later joint review selects focused Item and general Tree View. Responsive Sidebar, both TOC modes, settings recipes and Data List are subsequently selected. The final closure resolves the remaining naming/companion mappings; exact Item/Card/selection and Toolbar contracts remain inventory dependencies.

### 2.4 Name collisions between the new-element list and Geist

Resolve each before anything is built, because the new name and the old name cannot both exist:

| New (Chakra/Radix) | Existing (Geist) | Question |
|---|---|---|
| Grid, Simple Grid | `grid`, `grid-cell`, `grid-cross`, `grid-page`, `grid-system` | Settled: ordinary layout only; remove the decorative family and replace Grid. [Decision](../decisions/layout-grid.md). |
| Scroll Area | `scroller` | Settled: one Scroll Area replaces Scroller; preserve useful optional fades/controls through the family and compositions. [Decision](../decisions/scroll-area-behaviour.md#replace-scroller). |
| Accordion, Collapsible | `collapse`, `collapse-group` | Settled: coordinated Accordion and independent Collapsible share expansion/motion; remove old interfaces. [Decision](../decisions/disclosure-components.md). |
| Data List | `description` | Settled: Data List replaces Description for metadata labels/values. |
| Tooltip, Hover Card, Toggle Tip | `tooltip`, `context-card` | Settled: short Tooltip help, supplementary Hover Card preview and explicitly activated Toggle Tip; remove Context Card. [Decision](../decisions/overlay-help-components.md). |
| Group | `button-group`, `avatar-group`, `collapse-group`, `radio-group`, `tags`, `tiles`, `items`, `filters`, `bar-rows`, `setting-rows` | Which are a general Group and which are a real element with its own rules. |

**Completed return point:** the focused Item/Group review and companion dispositions are closed in the Phase 2 closure record. Item parts, semantic List and suitable Stack/Group/Card compositions replace the old companions; Setting Row is removed. Exact public interfaces remain Phase 4 work.

The completed row review includes Peter's Checkbox Card/Radio Card integration question and the full Pro collection. Content, surfaces, semantic lists, layout, forms and selection have distinct selected owners. Detailed safe combined markup and interfaces remain inventory obligations.

The [Toolbar/Group/selection split](phase-2-review.md#toolbar-and-group-composition) is selected and its Phase 2 responsibility review is closed. Generic arrangement does not decide selection/form ownership. Specify contextual keys, text editing, disabled discovery, RTL and popup focus before approving the Phase 4 interfaces; exact interaction contracts remain explicit obligations.

### 2.5 Disposition register

Decided items are decided. *Investigate* items need a survey of what the community calls the thing and how it is shaped, and a recommendation with evidence. Confirm every row with me before it goes into the inventory.

| Element | Disposition |
|---|---|
| choicebox, choicebox-item | Delete. Replaced by Checkbox, Checkbox Group, Checkbox Cards, Radio, Radio Group, Radio Cards, composed with Group. |
| error-card | Delete. |
| phone | Delete. |
| project-banner | Delete. |
| text-copy (Text With Copy Button) | Delete. |
| sheet | Delete. Drawer covers it. |
| clearable-input | Delete. Becomes a `clearable` boolean on Input (and Search Input, if it survives as its own element). |
| modal | Rename to Dialog. |
| note | Rename to Alert (2.2). |
| status-dot | Rename to Status. |
| toggle | Rename to Switch. |
| switch, switch-control | Replace with radio-based Segmented Control using shared Radio Group, Group presentation and the shared indicator. [Decision](../decisions/segmented-control.md). |
| kbd (Keyboard Input) | Already `kbd` on disk; fix the docs title. |
| loading-dots | Remove entirely, including the proposed dots variant; use Spinner and Progress. [Decision](../decisions/loading-indicators.md). |
| destructive-modal | Remove. Provide Dialog plus Alert Dialog; typed confirmation is a tested composition. The later Alert Dialog addition supersedes the earlier Dialog-only vote. [Decision](../decisions/dialog-components.md). |
| gauge | Replace with Meter for bounded measurements; preserve the circular display and animated loading requirement without inventing values. Task Progress stays distinct. [Decision](../decisions/meter-component.md). |
| description | Replace with Data List for metadata labels/values. [Decision](../decisions/data-list.md). |
| context-card | Remove; use Hover Card for supplementary previews and Toggle Tip for explicitly activated help. [Decision](../decisions/overlay-help-components.md). |
| error | Delete standalone element. Use messages by context and retain attached field validation. [Decision](../decisions/message-context-and-errors.md). |
| feedback | Rebuild from shared controls, with inline/pop-up examples. Applications send data. [Decision](../decisions/feedback-component.md). |
| empty-state | Keep, built from shared parts with examples; consistent absent-content structure justifies it. [Decision](../decisions/empty-state-component.md). |
| relative-time (Relative Time Card) | Rebuild Relative Time as standalone localized updating text; detailed UTC/local popup is a Hover Card composition. [Decision](../decisions/relative-time-component.md). |
| card, panel, link-card | One rebuilt Card covers these uses; remove separate Panel and Link Card interfaces. [Decision](../decisions/canonical-card.md). |
| fieldset | Rebuild for distinct form-group meaning and behaviour. [Decision](../decisions/fieldset-form-group.md). |
| entity, item | One focused Item family replaces overlapping content-row purposes. [Decision](../decisions/item-content-family.md). |
| entity-content, entity-list, items | Remove; Item content parts plus List and appropriate Stack/Group/Card compositions cover the uses. [Decision](../decisions/item-content-family.md). |
| file-tree, folder, file | General Tree View with a file-tree composition. [Decision](../decisions/general-tree-view.md). Exact migration remains for inventory/Phase 5. |
| setting-row, setting-rows | Remove; use horizontal Field for input settings, Item/Button for actions and complete layout recipes. [Decision](../decisions/settings-row-composition.md). |
| tile, tiles | Remove. Use Card, Stat and shared layout; preserve compact/collapsed measurement summaries. [Decision](../decisions/stat-family.md). |
| toolbar | Rebuild as canonical, flexible enough to be composed by the container and others. |
| stat and related display parts | One flexible Stat family; exact helper parts/interfaces remain inventory work. [Decision](../decisions/stat-family.md). |
| stat-strip, strip-item | Remove; provide composed selectable-Stat examples using appropriate selection controls. |
| button-group | Remove; general Group supplies arrangement and compatible appearance defaults. [Decision](../decisions/group-presentation.md). |
| avatar-group | Keep in Avatar family for member limits/remaining counts; compose Group for presentation. [Decision](../decisions/avatar-group.md). |
| field | Add shared label/control/help/error structure; control value/native validity and Fieldset remain distinct. [Decision](../decisions/field-component.md). |
| list | Add Chakra-like semantic ordered/unordered/nested lists and markers, without selection ownership. [Decision](../decisions/list-component.md). |
| chart | Rebuild as canonical on TanStack charts. |
| trend | Remove standalone component; change display belongs to Stat. [Decision](../decisions/stat-family.md). |
| markdown | Rebuild as canonical on TanStack markdown and TanStack highlight. |
| combobox | Keep and standardize. When Select is rebuilt non-native, the two share one list, option and filtering shape. |
| dots-menu | Remove; provide Menu plus Icon Button compositions. [Decision](../decisions/dots-menu-composition.md). |
| code, code-block, context-menu, copy-button, drawer | Reviewed; keep, subject to Phase 4 conventions. |
| fold, filter, filters, ricon, shell, task, tasks, bar-row, bar-rows, kv, metric-list, metric, page-head, check | Explicitly remove with dedicated companions. Existing Tile/Trend/Card/Stat Strip removals are reaffirmed. [Decision](../decisions/component-removals.md). |
| appbar, topbar | Consolidate into one flexible App Bar. [Decision](../decisions/app-bar.md). |
| side-nav, subnav | Remove; provide navigation compositions with real links/current-page indication. [Decision](../decisions/navigation-compositions.md). |
| tags | Remove wrapper; retain Tag and use ordinary Stack layout or Group-specific presentation as needed. [Decision](../decisions/group-presentation.md#ordinary-layout-and-tags). |
| chip | Replace with Toggle Button capability in Button family. [Decision](../decisions/toggle-button.md). |
| logs | Remove fixed-schema component; provide Table/Accordion event-log examples. [Decision](../decisions/logs-composition.md). |
| forms guide | Classification correction: not a registered component. Retain documentation and selected native/optional TanStack Form support. |
| Everything else | Keep and standardize. |

### 2.6 Harvest and resolve

With the register agreed, inventory the terms in use across `src/components/`, `src/shared/`, `docs-src/`, and `tools/geist/maps/`: tag names, property names, slot names, event names, CSS custom properties, module and file names. Cluster where one concept has several names or one name covers several concepts. Start with size, shape and state (PLAN.md 5.7), then the container-and-item pairs (`-group`, `-list`, `-strip`, plural; `-item`, `-row`, `-option`, singular), then abbreviations (`ricon`, `kv`, `spark`, `fold`, `atom-state.ts`, `info-ic.styles.ts`, `usage-sum.styles.ts`). Record in `notes/alignment/terms.md`. Walk clusters with me one at a time, largest first; write each resolved term into `CONTEXT.md` as it lands. Offer a decision note only for choices that meet the bar: hard to reverse, surprising without context, a real trade-off.

Completed 2026-09-19: the register and semantic clusters are resolved in [terms.md](terms.md), with [census and choices](evidence/phase-2-closure-2026-09-19.json). Exact component contracts and migration paths have explicit Phase 4/5 return points. Peter starts Phase 3 separately.

## Phase 3: Architecture review (improve-codebase-architecture skill, when I say)

When I start it, this is the direction:

> Consistency across the elements that survive Phase 2, and `src/shared/`. Favor candidates where several elements solve one problem through different shapes, so deepening them also removes an inconsistency. Known starting points: the six elements that each call `computePosition` twice (hand-rolled-audit.md); the composition pattern set by compose-the-copy-button.md and compose-the-language-switcher.md; the `*.styles.ts` families in `src/shared/`; the overlay elements, which will share Radix shadows and one enter/exit mechanism; and the mandated-package integrations from Phase 1.3. Name modules with `CONTEXT.md` terms.

During the grilling loop, record each accepted deepening as an inventory note, plus a decision note if it meets the bar. Don't implement.

## Phase 4: The inventory. Nothing is built before this is approved.

`notes/alignment/inventory.md`: the final list of elements in the design system, and the conventions they share. This is the gate. It is done when I have approved every row.

### 4.1 Primitives first

Identify the lower-level elements that the rest compose: at least Group, Icon, Icon Button, the container from 2.3, Toolbar, Stat, the message family, and the overlay base. For each, list everything it must be able to do so that every element that composes it can, with the evidence (which composing element needs which capability). The test is that the composed elements can be expressed as arrangements of primitives with no behaviour of their own beyond what the arrangement gives them; where they can't, the missing capability goes into the primitive, or the composed element is a real element and the inventory says why.

Apply the accepted [composition qualification](../decisions/composition-over-count.md#qualification-accepted-on-2026-09-19): Feedback and Empty State also earn their place through a consistent named structure/common experience. Do not repeat their retention questions merely because their parts can be composed. Other retention decisions remain subject to review.

### 4.2 Every element

For each element that will exist, one entry: tag name; what it composes and what composes it; properties with types and defaults; slots; events with detail payloads; states; behaviours (keyboard, focus, dismissal, motion); the source of each value and behaviour (Geist, Radix, Chakra, Material, ours); and whether it is a Geist element (census) or not (verified against its source). Elements that become recipes get a recipe entry instead.

Flow Diagram is also selected; include its layout-engine delivery and node-content dependencies in the inventory.

New elements go in too, so their interfaces are designed against the same conventions as the survivors, in this order because each tier composes the one before: Group (Chakra's, with `attached`); layout (Flex, Stack, Grid and Simple Grid, Scroll Area, under the names 2.4 settled); typography (Text, Heading, Link, Code, Quote, Kbd, Strong; all take `truncate` and `lineClamp`; Text and Heading also take `as`, `size`, `weight`; evaluate Chakra's and Radix's shapes per prop); Icon and Icon Button; the selection family (Checkbox, Checkbox Group, Checkbox Cards, Radio, Radio Group, Radio Cards, Segmented Control); the input family (Input with `clearable`, Number Input, Password Input, Pin Input, non-native Select); the container tier (container, Toolbar, Stat, Field, List, Appbar, Data List); the rest (Accordion, Collapsible, Tooltip, Hover Card, Toggle Tip, Dialog and Alert Dialog per the selected dispositions, Timeline, Steps, Inset, Chart, Markdown).

Composition rules: internal start/end content uses the `start`/`end` slots. Use Stack/HStack/VStack or other ordinary layout for siblings that only need arrangement; use Group when attachment or compatible shared appearance is needed, as Peter later clarified. Icon tags below illustrate the selected per-icon shape; the final icon-name mapping remains for the inventory. The Radio Card fragment shows presentation only: its selection/form owner must also be supplied by the eventual selection-family contract.

```html
<acme-input><acme-arrow-up-icon slot="start"></acme-arrow-up-icon></acme-input>

<acme-group attached>
  <acme-button>Some menu</acme-button>
  <acme-icon-button><acme-arrow-down-icon></acme-arrow-down-icon></acme-icon-button>
</acme-group>

<acme-group attached>
  <acme-radio-card value="a" title="Option A">Description of A</acme-radio-card>
  <acme-radio-card value="b" title="Option B">Description of B</acme-radio-card>
</acme-group>
```

Additional selected capabilities to include in the dependency-ordered inventory: responsive Sidebar, TOC with discovered or explicit entries, Accordion, Show, Hover Card, FormatNumber and FormatByte with numeric value, and appropriate as support. Their direct inclusion requests and five recent selections are in the [capability checkpoint](evidence/capability-checkpoint-2026-09-19.json). Exact interfaces and behaviour remain Phase 4 work.

### 4.3 Conventions

Alongside the entries, because they are decided together. Start from README's Conventions section and PLAN.md §1's standing build rules, then cover: naming (casing, prefixes and suffixes, pluralization, verb choice, abbreviations, file and directory names, CSS custom properties, slots, events); interface shape (boolean prop naming, enumerated prop typing, event detail payloads, controlled vs. uncontrolled, what composes vs. what wraps, how `start`/`end` are declared, how Group-composable elements declare themselves); exports (`src/index.ts` against `package.json` exports, what `src/shared/` exposes). For each convention: a one-line rule, a before/after from this codebase, and the share of the code that already follows it. Prefer codifying the dominant existing pattern over inventing one. Approved conventions go to `notes/conventions.md`; README's Conventions section becomes a short version that links to it.

### 4.4 Documentation layout and doc components

One layout for every element page and every foundations page, and the set of doc components that build it: a live example with its code, API tables generated from the custom-elements manifest (properties, slots, events, CSS custom properties), a states section, a composition section that shows what the element composes and what composes it, and a census page where the element is Geist's. Each doc component gets an inventory entry in the 4.2 shape. The standing rule that docs pages show exactly the reference page's sections now applies only to the example content of Geist elements; the layout around it is ours, and non-Geist elements follow the same layout with their own examples.

Stop for my approval of the inventory, the conventions, and the documentation layout.

## Phase 5: Migration plan for existing code

Combine the approved repository-layout and build changes from Phase 1.7 and 1.8, the Phase 2 deletions and renames, Phase 3 deepenings, Phase 1.3 package integrations, and Phase 4 convention fixes into one ordered plan in `notes/alignment/migration-plan.md`:

**Pre-approval evidence gate:** complete the [style-production decision's](../decisions/style-production.md) representative house-style pipeline, escaping, scope, registration defaults/inheritance/conflicts, determinism, invalid-input, selective-import and source-map checks, including rendered outcomes in Chromium, Firefox and WebKit, before implementation approval. These bounded checks are distinct from the complete implementation regression checks in Phase 6. The post-deadline audit restores this gate; phase progression does not waive it.

- Small batches, each reviewable on its own, each with a files-touched estimate and whether it touches maps and needs regeneration.
- Layout and build changes first, so every later batch lands in the final structure. Then deletions. Don't rename anything a later batch deletes.
- After every batch: `bun run split && bun run build && bun run docs && bun test` pass, and the affected pages' census reads zero hard differences, or their deviations are in the `ACCEPTED` table.
- Record each replaced interface (tag, property, event, slot, package export) and its removal checks in the migration notes and Git history. Consumer documentation describes the resulting interface only; no compatibility guide or old-interface commentary is required.

Stop for my approval before implementing.

## Phase 6: Build

Run the migration plan, then build the new elements in the Phase 4.2 order, each to its inventory entry and the conventions. Build the doc components and move every page onto the 4.4 layout as part of the same order, so no element is documented twice. An element whose inventory entry turns out to be wrong during the build stops the build and updates the entry first.

## Generated files

The [current path and writer map](../../AGENTS.md#where-things-are-and-what-is-generated) is maintained with the build. Generated styles, definitions, manifests, browser entries, website output and staged packages each have an explicit source. The tracked docs tree remains only as the current published snapshot until M25 switches Pages.

## Output

- This file is the entry point for this pass; keep `## Where we are` and the document list current.
- [Phase 1 review and execution checkpoint](phase-1-review.md), with durable evidence under `notes/alignment/evidence/`.
- Working findings in `notes/alignment/`, as tables: Location | Category | Issue | Occurrences.
- Link `notes/alignment/` from `PLAN.md` as a new section, and mark PLAN.md 5.7's "sweep for other concepts" item as superseded by it.
- Keep prose short.

M10 reference completion: [Material Tabs full-document review](evidence/m10-tabs-material-review-2026-09-21.json) records all four articles, both token sets and 28 static figures. [Tabs implementation and acceptance](evidence/m10-tabs-2026-09-21.json) are now complete at the native/Lit boundary.

M11 prerequisite: [native Fieldset boundary](evidence/m11-fieldset-boundary-2026-09-21.json) records the shadow-slot failure and passing native ancestor control in all three engines. The linked M11 Fieldset implementation above resolves this prerequisite with a real native light-DOM fieldset.

M13 Menu implementation records: [full reference review](evidence/m13-menu-reference-review-2026-09-22.json), [generated shadow sources and native comparison](evidence/m13-shadow-sources-2026-09-22.json), [Menu composition resolution](../decisions/execution-delegation.md#menu-composition-and-completion--2026-09-22). [Menu/Context Menu and Split Button acceptance](evidence/m13-menu-2026-09-22.json) includes the final package/site and compiled checks.

M13 selection acceptance: [completed implementation and verification](evidence/m13-selection-2026-09-22.json), [source/reference review and design probes](evidence/m13-selection-preparation-2026-09-22.json), and [living analysis](../analysis/lit-practice-review.md#m13-selection-implementation-in-progress). Code Block and Feedback use Option children. [Number/Pin slot ownership](evidence/m13-number-pin-slot-2026-09-22.json) is also corrected and verified. Slider and Calendar are active in the isolated worktrees listed above. Continue without questions.

Slider review checkpoint: fresh review reproduced three findings in all three engines: coincident thumbs cannot separate by dragging left; focus transfer during dragging does not cancel; setCustomValidity does not mark the native thumb aria-invalid. The author has the reproductions. Resolve and recheck before integration. The reviewer then hit a usage limit; its review was incomplete. Full-package builds are coordinated one at a time because concurrent builds slowed verification.

Latest local commits: `968b3c436` fixes compound slot ownership; `88cded0e3` completes the selection controls. No push occurred. The component-language correction removes the separate documentation category, origin-based badge coloring and generated labels. The rebuilt site and 99 documentation tests pass.

**Slider integration in progress:** the isolated implementation is now copied into the main working tree. Three independent review findings are corrected in native probes: coincident-thumb drag direction, focus-transfer cancellation and custom-validity announcement. Additional corrections clear the native edit baseline and synchronize late accessible label references; Chromium native accessibility output confirms the resolved name. The main stylesheet producers are being regenerated. The source native matrix passes 44 checks per engine, but final integrated build/site/suite/compiled acceptance is still pending. Calendar remains partial work in `/tmp/acme-m13-calendar-worktree`.

Slider acceptance now supersedes the integration-in-progress checkpoint above. All recorded review findings are resolved and verified. The remaining M13 work is Calendar and its corrected date-runtime delivery. Continue from the partial isolated implementation in `/tmp/acme-m13-calendar-worktree`; parallel workers are unavailable, so finish and verify locally.

**Calendar prerequisite in main working tree:** the exact date-package patch and private runtime writer are integrated. RelativeTime now uses the corrected facade. Twelve focused parser/RelativeTime/delivery tests pass (114 assertions); a complete package/CDN/fresh-consumer gate is still pending. Calendar component work remains isolated and incomplete. Local Slider commit: `e5ca68753`.

[Date-runtime correction and delivery](evidence/m13-date-runtime-2026-09-22.json) are complete: strict build/site, all 892 tests, all four browser distribution forms in three engines, and fresh npm/Bun consumer checks pass. Calendar UI is still isolated and incomplete. The three previously unreadable Material measurement figures were inspected at full resolution; the reference record now reflects that closure.
