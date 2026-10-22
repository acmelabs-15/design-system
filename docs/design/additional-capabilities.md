# Additional capability requirements and research

Status: Completed design/research record; later inventory and systematization implementation supersede pending checkpoints.

## Scope and interpretation

This record preserves the supplied requirements, thirty selections and their research limits. The full proposal set was later approved and implemented. Earlier open interfaces are historical checkpoints; they are not a new decision queue.

The dated findings below retain their source versions, measurements, corrections and verification limits. Old phase gates, source freezes, local-skill routing and task-specific permission grants describe the completed pass. They do not govern new work. The [current handoff](../STATUS.md) owns the next action.


This completed review preserves the research evidence and dated checkpoints. Later decisions, approved contracts and implementation evidence resolve the earlier pending states.


Research checkpoint closed 2026-09-19 after the extended walkthrough and coverage audit. At that capture, Phase 2 had begun; its [separate review](../history/systematization/scope-review.md) now records closure. At that checkpoint, interface design, implementation and acceptance remained in scheduled later phases. Those phases are now complete at their recorded scope. The original nine-subject walkthrough remains available in [phase-1-review.md](../history/systematization/research-review.md); this register covers the extension.

## Source and authority

Peter supplied /Users/peterkloss/Documents/additional-design-system-functionality:behaviors.md and added requirements during the conversation. The [dated source snapshot](additional-functionality-original-2026-09-19.md) preserves the document at capture. Its proposals are research input; they are not blanket implementation approval. The snapshot's local screenshots remain on Peter's machine.

The original sequence placed terminology/dispositions in Phase 2, user-started architecture in Phase 3, inventory/conventions/docs approval in Phase 4, migration approval in Phase 5 and implementation in Phase 6. A source freeze applied then. This checkpoint itself did not approve implementation; the sequence and freeze are historical.

## Accepted decisions and requirements

Each link records scope, evidence and conditions. The open details in this list describe the 2026-09-19 research checkpoint; later resolutions are identified beside the affected entries.

1. [Separate React integration package](../decisions/0081-react-integration.md). Exact package names and renderer integration were open at this checkpoint. The [tooling contract](../../spec/SPEC-documentation-tooling.md#package-and-api-publication) and [M22 acceptance](../verification/systematization/m22-react-2026-09-23.json) record their later scope.
2. [Consumer compatibility with the full TanStack Table capability set](../decisions/0107-tanstack-table-compatibility.md). The design system does not integrate/run TanStack Table. Applications own processing, state and workers; the Table provides structure, appearance and interaction/measurement access. Earlier house-adapter proposals misread the request.
3. [Native HTML forms plus optional TanStack Form](../decisions/0067-native-and-managed-forms.md).
4. [No server-side rendering](../decisions/0092-server-rendering.md). Excluded, not deferred. Server data processing remains possible.
5. [Material spring roles and both Standard/Expressive schemes](../decisions/0059-material-motion-system.md), chosen by context; retain Lit Motion.
6. [Shape morphing follows demonstrated component needs](../decisions/0094-shape-support.md). The later clarification supersedes the broad Material catalogue requirement. Use ordinary shape properties first and custom geometry only for a concrete need; no geometry package is selected. The earlier accidental option remains withdrawn.
7. [Wrap complete names in multi-line ComboBox options](../decisions/0013-combobox-long-labels.md).
8. [Overlapping Toasts, newest messages visible, implemented with the stack](../decisions/0110-toast-behaviour.md). No Zag Toast dependency.
9. [Explicit activation for interactive rich help](../decisions/0088-rich-help-activation.md).
10. [Full visual themes on pages and nested sections](../decisions/0022-custom-themes.md).
11. [Darker blue with white text](../decisions/0008-blue-accent.md), selected after the original blue example failed the measured normal-text contrast threshold. Exact per-control/state values and broader contrast verification remained open in this research; the later [foundation record](../research/07-design-foundations.md) preserves implementation checks and named contrast corrections.
12. [Oxlint + Oxfmt with Ultracite, plus Stylelint](../decisions/0053-lint-toolchain.md), for the later migration.
13. Keep Toast under the existing community-naming rule; the [survey](../research/11-floating-surface-shadows.md#phase-1-extension-toast-and-rich-help) supports it. This was a research conclusion, not a new explicit naming vote.
14. Always evaluate the actual Material Web Lit implementation alongside Material guidance. The [reference decision](../decisions/0082-reference-systems.md) retains this requirement.


15. [Responsive layout and appearance with Material bands and font-relative thresholds](../decisions/0086-responsive-system.md). Three distinct choices; their exact interface remained open here and is later defined by the [responsive contract](../../spec/SPEC-design-system.md#c-resp-shared-responsive-convention).
16. [Box as a planned primitive](../decisions/0009-box-primitive.md).
17. [Versioned consumer skills](../decisions/0019-consumer-skills.md).
18. [A version-matched documentation/API MCP server](../decisions/0027-design-system-mcp.md), explicitly requested in the same reply as the skills selection.
19. [TanStack Intent as development tooling](../decisions/0048-intent-tooling.md).
20. [AI authoring support only in this pass](../decisions/0003-ai-authoring-scope.md); no live AI component control.
21. [A shared Lit/React inspector using TanStack Devtools](../decisions/0026-design-system-devtools.md), explicitly confirmed after the Solid dependency was explained.
22. [Ripples off by default, with opt-in support](../decisions/0074-optional-ripples.md). Configuration scope and applicable controls were then inventory work. The [foundations contract](../../spec/SPEC-foundations.md#motion-shapes-and-indicators) records the selected per-control opt-in; selection-state animation remains a separate motion decision.
23. [TanStack Virtual for both Lit and React virtualization](../decisions/0107-tanstack-table-compatibility.md#framework-rendering-and-virtualization), explicitly confirmed. For Table, the application connects it to our exposed layout/measurement targets.
24. [Reusable results pagination](../decisions/0087-results-pagination.md): numbered/compact controls and unknown totals; application-owned page state/loading and no TanStack Table dependency. At this checkpoint the earlier recipe boundary was [under review](../decisions/0087-results-pagination.md#review-pending-after-the-chakra-ui-pro-example), with coordinated page-position, page-size and navigation parts requiring evaluation before inventory approval. The [later coordinated-parts approval](../decisions/0087-results-pagination.md#approved-coordinated-parts) resolves that boundary. Jump-to-page remains a separate composition.
25. [Resizable panes](../decisions/0084-resizable-panes.md): user resizing by drag/keyboard, optional collapse with previous-size restoration, and application-owned preference saving remain selected. The original @zag-js/splitter runtime choice is superseded by the native port strategy below. The native-port requirement included correcting the known behavior inconsistencies; exact interfaces were open at this checkpoint. The later [Resizable contract](../../spec/SPEC-layout.md#l-09-resizable-panes) and [acceptance record](../verification/systematization/m14-resizable-2026-09-23.json) own the resolution and tested scope.
26. [Shared density](../decisions/0025-density.md): spacing-only page/section settings, normal by default; menus/dialogs/Toasts retain normal inherited spacing; compact buttons/similar controls have a 24 × 24 CSS-pixel clickable-area floor with larger touch-friendly sizing available. Three separate answers; no universal 48px normal-mode target was selected.
27. [Both reading directions](../decisions/0007-bidirectional-support.md) for pages and sections in Lit/React, including keyboard behaviour, appropriate icons and mixed-direction content. Applications supply translations.
28. [Shared moving selection indicators](../decisions/0097-shared-selection-indicator.md) using Lit Motion for suitable single-selection groups. Each control keeps its appearance/selection rules; no additional Zag dependency.
29. [Native Lit behaviour ports using the full stack](../decisions/0114-zag-behaviour-ports.md) supersede the earlier five-control Zag runtime/adapter selection. Peter rejects a Zag adapter and its createMachine/state mechanism, requires the established TanStack Store and Lit Motion approaches plus all other applicable rules, and explicitly permits new components, rebuilds or replacements. React wraps the same implementation. Selected capabilities remain.
30. [Independent Adobe number utilities](../decisions/0072-number-utilities.md) for Number Input parsing/formatting, retaining the full implementation. Version 3.6.8 was the research version, not a future-release pin. Installation awaited migration approval at that checkpoint. The later [M12 preparation and acceptance](../research/16-package-choices.md#m12-port-preparation--2026-09-22) records the exact installed utility and Number Input checks.

The earlier “Include experimental workers” selection is governed by Peter's later Table clarification: support consumer use of the plugin, with its experimental status visible. Worker creation, recovery and termination belong to the consuming application, not the design system.

Peter requested removal of the named docs footer and continuously available Previous/Next navigation. Layout review remained pending at that checkpoint; the later [documentation contract](../../spec/SPEC-documentation-tooling.md#standard-page-layout) and [M23 acceptance](../verification/systematization/m23-documentation-2026-09-26.json) record the outcome and verification scope.

## Research register

This register preserves statuses at the research checkpoint. “Reviewed” meant the research/scope discussion was covered, not that implementation passed. “In progress” and “Pending” identified remaining work at that date. Later contracts and evidence own their resolutions.

| Request | Research status | Record and remaining work |
|---|---|---|
| Remove docs footer | Reviewed | Located in docs-app.ts:121; removal was assigned to the documentation migration. [Docs analysis](../research/09-documentation-site.md#phase-1-extension-documentation-navigation). |
| Keep docs Previous/Next visible | Reviewed; requested outcome | Current placement identified. Final layout and zoom/narrow-view/focus checks belong to the docs inventory and implementation. |
| ComboBox trailing overflow | Reviewed; behaviour selected | Chrome reproduced cause; transient wrap probe removed overflow. Other engines and final fix remained to test at that checkpoint. |
| Shared moving selection indicator | Reviewed; shared scope selected | Material Web Tabs, Chakra/Ark and Radix indicators inspected. Lit Motion was selected across suitable single-selection groups; exact form and participating controls remained for later design. |
| Shared enter/exit/page/state motion | Reviewed; direction selected | Parameter mapping and browser acceptance remained unverified by this research. |
| Checkbox/Radio/Switch state animations | Source comparison reviewed; acceptance pending | Actual Material Web control/ripple sources and current transitions compared. Ripples are optional, off by default. Parameter mapping and complete state/browser checks remained. [Motion analysis](../research/02-animation-package.md#control-state-and-ripple-source-review). |
| Shape changes and morphing | Reviewed; needs-driven scope clarified | No complete Material catalogue required. Ordinary geometry first; specific transitions and any custom geometry chosen from demonstrated inventory needs. Candidate probes retained as background, not adoption. |
| Material layout/scaffold/panes/grids/spacing/density/RTL/canonical examples | Research coverage reviewed | Pane/density/RTL choices selected. Feed/list-detail/supporting layouts mapped as recipe candidates; final dimensions/semantics and composition remained for the scheduled inventory. [Foundation analysis](../research/07-design-foundations.md). |
| Material customization/tokens/gestures/inputs/selection/states | Follow-up reviewed; acceptance/design pending | Web applicability, semantic state versus visual layers, native input behaviour and token/section inheritance mapped. Concrete cancellation/cleanup checks recorded. No blanket Material state palette or generic gesture engine adopted. |
| React support | Reviewed; package shape selected | Consumer React Table content retains React rendering; no React-to-Lit Table renderer bridge is selected. Content/events/references and package exports remained to design/test. |
| TanStack multi-framework repository survey | Reviewed | Bounded survey of 25 active non-fork repositories; adapters and release status distinguished. [Layout analysis](../research/18-repository-layout.md#phase-1-extension-framework-packages). |
| Complete TanStack Table compatibility | Queued research walkthrough complete; acceptance pending | Selection, grouping/totals and custom extensions now reviewed alongside rendering/layout/pagination. The 17-feature requirement checklist is saved; exact interfaces and combined browser tests remained later work. No Table engine/worker implementation. |
| Native and managed form support | Reviewed; direction selected | Detailed ownership and browser contract remained for design/verification. |
| Numbered/data pagination | Capability selected; optional-parts boundary reopened | Reusable numbered/compact results navigation and unknown totals. Application owns state/loading. At that checkpoint, coordinated page-position/page-size/navigation parts awaited the full Pro review and no replacement interface was selected. The later coordinated-parts approval linked above resolves this. Jump-to-page detail remains separate; document navigation is a distinct concept. |
| Toast stacking | Reviewed; direction selected | Reference behaviours and local gaps identified; final limit, timing, actions and API remained in the inventory. |
| Plain/rich tooltip distinction | Reviewed; activation selected | Later Phase 2 keeps Tooltip/Hover Card/Toggle Tip and removes Context Card; exact accessibility and Popover interfaces remained inventory work. |
| Blue default accent | Direction selected; broader verification pending | Original Custom button measured below 4.5:1 in both themes; Peter chose darker blue with white text. Exact state tokens, other controls, non-text contrast and gamut/browser checks remained. [Foundation analysis](../research/07-design-foundations.md#blue-accent-contrast-and-visual-choice). |
| Full custom themes | Reviewed; scope selected | Authoring format, token contract, inheritance and overlay propagation need design and tests. |
| Toast versus Snackbar naming | Reviewed | Keep Toast; bounded official-library survey, not market-share statistics. |
| Biome replacement | Reviewed; direction selected | Isolated native/type-aware/format/CSS probes completed; full rule mapping and migration verification pending. |
| AG Grid AI Toolkit analogue | Reviewed; excluded from this pass | Schema builder/module source inspected. Peter chose authoring support only, with no live AI component control. |
| AG Grid MCP analogue | Reviewed; selected | Published handlers/resources/fetch/project-state code inspected. Version-aware documentation/API/example assistance was selected; detailed transport and interfaces remained open at that checkpoint. |
| AG Grid skills analogue | Reviewed; selected | Both skill entrypoints and key Grid/upgrade references read. Versioned consumer skills were selected; taxonomy and artifact evaluations remained to design at that checkpoint. |
| TanStack Intent for those tools | Reviewed; selected | Guides/source and published 0.4.0 Bun probes covered validation, installed-version loading and allowlist rejection. Full release integration and semantic evaluations remained. |
| Lit/React TanStack Devtools | Reviewed; selected | Lit and React probe panels mounted, updated and cleaned up in Chrome; Bun production exclusion and font-asset adaptation tested. Actual inspector and all-engine verification remained. |
| TanStack Config conventions | Reviewed; recommendations only | Docs, root/PR workflow and publishing helper read. Package checks, explicit tasks, release intent and dependency checks proposed; no additional tooling adoption. |
| Chakra responsive system | Reviewed; scope/defaults selected | Layout and appearance; Material bands; font-relative thresholds. Existing Grid path and published Chakra boundary discrepancy inspected. Exact interface and browser coverage remained. |
| Box | Reviewed; selected | The selected capability was a general theme/responsive container primitive. Chakra/Radix source read; exact interface and host semantics remained for the inventory. |
| Resizable panes | Capability selected; native-port implementation review | The selected strategy required a native behavior port using the stack instead of running Zag. Optional collapse restores previous size; application owns saving. The port required correction of orientation/keyboard/collapse inconsistencies and native implementation checks in all three engines. |
| Density | Reviewed; three choices selected | Shared spacing-only density, normal inherited menu/dialog/Toast spacing, 24px compact clickable-area floor. Exact values/eligibility and browser target checks remained later. |
| Bidirectional support | Reviewed; selected | Whole-page and nested-section LTR/RTL support in Lit/React. Shared navigation gaps and partial Slider handling identified; complete keyboard/icon/content checks remained later. |
| Independent number parsing utility | Reviewed; selected | @internationalized/number; six isolated Bun cases passed. Native Number Input, form/IME and browser acceptance remained later. |

Agent and developer tools are tracked in [agent tooling](../research/01-agent-tooling.md) and [developer tooling](../research/08-developer-tooling.md). Only the explicitly linked decisions were selected at the research checkpoint. Config practices remained recommendations, while later [tooling approval and contracts](../../spec/SPEC-documentation-tooling.md) resolved the detailed interfaces.

## Historical continuation

The capability walkthrough closed with the five-control Zag adapter/runtime strategy superseded by native Lit ports using the full selected stack. Selected capabilities remained; no TanStack Table engine was added.

The [Phase 2 review](../history/systematization/scope-review.md#phase-2-closure) closed Card, Fieldset, Group/Toolbar ownership, focused Item, Tree View, Sidebar, TOC, formatters, settings recipes and Data List purposes. The inventory subsequently defined their interfaces and composition.

The [five native-port mappings](../research/16-package-choices.md#five-native-behaviour-port-mappings) and independent number utility were selected. Shape morphing remained needs-driven; a full Material catalogue was not a research gate.

Inspector panels, MCP transport/hosting, release coordination and the explicitly listed [responsive details](../decisions/0086-responsive-system.md) then remained for inventory and migration review. The later [whole-set approval](../decisions/0049-inventory-approval.md) and implementation supersede those pending states. Pre-approval feasibility and implementation acceptance remain distinct evidence.

## Phase 1 closure audit

The audit checks research coverage and decision status, not implementation readiness:

- The original nine investigations and their walkthrough are complete, with local evidence and source comparisons linked from phase-1-review.md.
- The extension register covers the supplied document and subsequent requests. Each entry has a recorded selection, a scoped recommendation or an explicit later-phase obligation. Layout recipes remain recommendations until the inventory approves them.
- Native Lit ports have behaviour/state/motion/style/form/lifecycle mappings. The independent parser choice is resolved. Full upstream-test adaptation and component verification follow the approved implementation plan.
- Motion/shape scope is resolved at the research level. Specific transitions, parameters and custom geometry are inventory work. No general shape library or wholesale Material palette is selected.
- The original Phase 2 owned glossary/context, names and dispositions; user-started Phase 3 owned architecture; Phase 4 owned approved interfaces, conventions and documentation layout.
- The original Phase 5 owned final package paths/versions, generated-file migration, publication compatibility and the ordered plan. The pure-Bun publication mechanism remained unresolved then; later release evidence resolves it without removing trusted publishing/provenance.
- Phase 6 owned behavior, accessibility and visual verification in the selected browsers and Bun tests. The synthetic probes and historical 608 tests did not prove the finished system.

No unresolved generic shape-package choice remains. New evidence can return a specific topic to research during later phases. This closure neither starts Phase 3 nor approves source implementation.

The TanStack Config practices are recommendations, not selected packages or automation. The research required preserving trusted publishing/provenance while the pure-Bun path remained unresolved. Later release records contain its resolution.

The walkthrough then used Peter's selected local question skill and Codex reference, with self-contained context, separate option details, one question at a time and no agent deadline. Actual answers remained required. The Plan-mode route reflected that host's countdown investigation. These local-skill/mode instructions are retired; the current workflow owns question routing.

Peter requested continuous progress between research subjects, without routine continue prompts. Substantive choices and necessary capture checkpoints still paused the old walkthrough; its Plan-mode write and implementation boundaries applied then.

## Evidence and capture limits

[Probe record](../verification/systematization/additional-probes-2026-09-19.json) preserves the ComboBox and Zag observations. [Tooling evidence](../verification/systematization/tooling-evaluation-2026-09-19.json) preserves versions, counts, diagnostics and limitations. Later evidence covers [responsive findings](../verification/systematization/responsive-review-2026-09-19.json), [Intent](../verification/systematization/intent-probe-2026-09-19.json), and [Devtools](../verification/systematization/devtools-probe-2026-09-19.json). The current capture verification is [here](../verification/systematization/extension-capture-verification.json).

The third capture adds [blue/control measurements](../verification/systematization/blue-control-review-2026-09-19.json), the two latest decisions, and the [partial Table source review](../verification/systematization/table-review-2026-09-19.json). No all-state palette, ripple API, future Table version pin or completed compatibility claim is implied.

The fourth capture corrects Table ownership throughout the active plan/decisions/analyses, records TanStack Virtual for both frameworks and the results-pagination selection, and extends the same Table evidence file. Published tarball integrity checks, source comparisons and upstream examples are distinct from runtime testing. No combined Table browser probe ran.

The fifth capture records the four pane decisions in one subject note, explicitly extends Zag adoption to Splitter, saves package/source comparisons and synthetic probe limits, and completes the queued Table research record. [Pane evidence](../verification/systematization/resizable-panes-2026-09-19.json). No pane implementation, upstream fix/report, project installation or browser acceptance followed from these selections.

The sixth capture records five answers in three notes (density, bidirectional support and shared indicator), layout recipe recommendations, input/state/token findings, the synthetic Interaction listener probe and the updated continuous-work preference. [Foundation evidence](../verification/systematization/foundation-followup-2026-09-19.json). Source findings and synthetic reproductions remain distinct from browser acceptance. The Radix segmented-control reference characterization was corrected from current source; the later [Segmented Control decision](../decisions/0090-segmented-control.md) selects the radio semantics; exact interfaces remain inventory work.

The subsequent strategy correction supersedes Zag runtime/adapter adoption for five controls, while retaining their capabilities. Official vanilla support was found and its Zag-store runtime inspected; it does not satisfy Peter's clarified constraints. [Strategy evidence](../verification/systematization/zag-strategy-review-2026-09-19.json). The prior measurements remain historical source evidence, not measurements of the new ports. No source/runtime change was performed.

The subsequent native-port mapping records each control's behaviour, state, motion/style/form responsibilities and verification needs. [Port-mapping evidence](../verification/systematization/native-port-mapping-2026-09-19.json) includes an isolated number-parser probe. Peter subsequently selected the independent parser; it was not installed at that capture. The later M12 record linked above documents installation and control acceptance separately from this six-case parser probe.

The closure capture records that selection and the needs-driven shape correction. [Geometry study](../verification/systematization/shape-geometry-review-2026-09-19.json) remains background evidence with no AndroidX runtime or browser fidelity claim. No source implementation, generator run or project dependency change occurred.

The earlier 608-unit-test result is historical. No unit suite or build was rerun for this records-only capture. The later lint probes report failures; they are not a clean lint certification. No commit, push, release or project dependency change is part of this checkpoint.

## Open follow-ups

- [Actual-platform verification remains unperformed](../../.scratch/maintenance/issues/002-actual-platform-verification.md).

## Source provenance

Converted 2026-10-21 from notes/alignment/additional-functionality-review.md. That path identifies the historical source record. Inline source references and saved evidence retain their stated scope; this conversion does not rerun the original checks.
