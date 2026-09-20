# Phase 1 extension: additional functionality

**Current handoff:** [the pass status and next step](README.md#where-we-are). This completed review preserves its research evidence and dated checkpoints. Later decision notes supersede earlier recommendations; implementation remains gated by the approved inventory and migration plan.


Research checkpoint closed 2026-09-19 after the extended walkthrough and coverage audit. At that capture, Phase 2 had begun; its [separate review](phase-2-review.md) now records closure. Follow the central handoff for the current phase. Implementation, interface design and acceptance checks remain in their scheduled later phases. The original nine-subject walkthrough remains available in [phase-1-review.md](phase-1-review.md); this register covers the extension.

## Source and authority

Peter supplied /Users/peterkloss/Documents/additional-design-system-functionality:behaviors.md and added requirements during the conversation. The [dated source snapshot](evidence/additional-functionality-2026-09-19.md) preserves the document at capture. Its proposals are research input; they are not blanket implementation approval. The snapshot's local screenshots remain on Peter's machine.

The source freeze and approval sequence remain: Phase 2 terminology/dispositions; Phase 3 architecture when Peter starts it; Phase 4 inventory/conventions/docs approval; Phase 5 migration approval; Phase 6 implementation. No source implementation is approved by this checkpoint.

## Accepted decisions and requirements

Each link records scope, evidence and conditions.

1. [Separate React integration package](../decisions/react-integration.md). Exact package names and renderer integration remain open.
2. [Consumer compatibility with the full TanStack Table capability set](../decisions/tanstack-table-compatibility.md). The design system does not integrate/run TanStack Table. Applications own processing, state and workers; the house Table provides structure, appearance and interaction/measurement access. Earlier house-adapter proposals misread the request.
3. [Native HTML forms plus optional TanStack Form](../decisions/native-and-managed-forms.md).
4. [No server-side rendering](../decisions/server-rendering.md). Excluded, not deferred. Server data processing remains possible.
5. [Material spring roles and both Standard/Expressive schemes](../decisions/material-motion-system.md), chosen by context; retain Lit Motion.
6. [Shape morphing follows demonstrated component needs](../decisions/shape-support.md). The later clarification supersedes the broad Material catalogue requirement. Use ordinary shape properties first and custom geometry only for a concrete need; no geometry package is selected. The earlier accidental option remains withdrawn.
7. [Wrap complete names in multi-line ComboBox options](../decisions/combobox-long-labels.md).
8. [Overlapping Toasts, newest messages visible, implemented with the house stack](../decisions/toast-behaviour.md). No Zag Toast dependency.
9. [Explicit activation for interactive rich help](../decisions/rich-help-activation.md).
10. [Full visual themes on pages and nested sections](../decisions/custom-themes.md).
11. [Darker blue with white text](../decisions/blue-accent.md), selected after the original blue example failed the measured normal-text contrast threshold. Exact per-control/state values and broader contrast verification remain open.
12. [Oxlint + Oxfmt with Ultracite, plus Stylelint](../decisions/lint-toolchain.md), for the later migration.
13. Keep Toast under the existing community-naming rule; the [survey](../analysis/floating-surface-shadows.md#phase-1-extension-toast-and-rich-help) supports it. This was a research conclusion, not a new explicit naming vote.
14. Always evaluate the actual Material Web Lit implementation alongside Material guidance. The [reference decision](../decisions/reference-systems.md) retains this requirement.


15. [Responsive layout and appearance with Material bands and font-relative thresholds](../decisions/responsive-system.md). Three distinct choices; exact interface remains open.
16. [Box as a planned primitive](../decisions/box-primitive.md).
17. [Versioned consumer skills](../decisions/consumer-skills.md).
18. [A version-matched documentation/API MCP server](../decisions/design-system-mcp.md), explicitly requested in the same reply as the skills selection.
19. [TanStack Intent as development tooling](../decisions/intent-tooling.md).
20. [AI authoring support only in this pass](../decisions/ai-authoring-scope.md); no live AI component control.
21. [A shared Lit/React inspector using TanStack Devtools](../decisions/design-system-devtools.md), explicitly confirmed after the Solid dependency was explained.
22. [Ripples off by default, with opt-in support](../decisions/optional-ripples.md). Configuration scope and applicable controls remain for the inventory; selection-state animations remain part of the separate motion decision.
23. [TanStack Virtual for both Lit and React virtualization](../decisions/tanstack-table-compatibility.md#framework-rendering-and-virtualization), explicitly confirmed. For Table, the application connects it to our exposed layout/measurement targets.
24. [Reusable results pagination](../decisions/results-pagination.md): numbered/compact controls and unknown totals; application-owned page state/loading and no TanStack Table dependency. The earlier page-size recipe boundary is [under review](../decisions/results-pagination.md#review-pending-after-the-chakra-ui-pro-example): evaluate optional page-position, page-size and navigation parts together before the inventory is approved. Jump-to-page detail remains separate.
25. [Resizable panes](../decisions/resizable-panes.md): user resizing by drag/keyboard, optional collapse with previous-size restoration, and application-owned preference saving remain selected. The original @zag-js/splitter runtime choice is superseded by the native port strategy below. Correct the known behaviour inconsistencies in the house port; exact interfaces remain open.
26. [Shared density](../decisions/density.md): spacing-only page/section settings, normal by default; menus/dialogs/Toasts retain normal inherited spacing; compact buttons/similar controls have a 24 × 24 CSS-pixel clickable-area floor with larger touch-friendly sizing available. Three separate answers; no universal 48px normal-mode target was selected.
27. [Both reading directions](../decisions/bidirectional-support.md) for pages and sections in Lit/React, including keyboard behaviour, appropriate icons and mixed-direction content. Applications supply translations.
28. [Shared moving selection indicators](../decisions/shared-selection-indicator.md) using Lit Motion for suitable single-selection groups. Each control keeps its appearance/selection rules; no additional Zag dependency.
29. [Native Lit behaviour ports using the full house stack](../decisions/zag-behaviour-ports.md) supersede the earlier five-control Zag runtime/adapter selection. Peter rejects a Zag adapter and its createMachine/state mechanism, requires the established TanStack Store and Lit Motion approaches plus all other applicable house rules, and explicitly permits new components, rebuilds or replacements. React wraps the same implementation. Selected capabilities remain.
30. [Independent Adobe number utilities](../decisions/number-utilities.md) for Number Input parsing/formatting, retaining the full house implementation. Version 3.6.8 was researched, not pinned for future release; installation remains gated by migration approval.

The earlier “Include experimental workers” selection is governed by Peter's later Table clarification: support consumer use of the plugin, with its experimental status visible. Worker creation, recovery and termination belong to the consuming application, not the design system.

Peter also requests removal of the named docs footer and continuously available Previous/Next navigation. These are requested outcomes; the docs layout is still subject to its scheduled review.

## Research register

“Reviewed” means the stated research/scope discussion has been covered, not that an implementation passes. “In progress” means additional research or a decision remains. “Pending” identifies checks that have not been done.

| Request | Research status | Record and remaining work |
|---|---|---|
| Remove docs footer | Reviewed | Located in docs-app.ts:121. Apply during docs migration. [Docs analysis](../analysis/documentation-site.md#phase-1-extension-documentation-navigation). |
| Keep docs Previous/Next visible | Reviewed; requested outcome | Current placement identified. Final layout and zoom/narrow-view/focus checks belong to the docs inventory and implementation. |
| ComboBox trailing overflow | Reviewed; behaviour selected | Chrome reproduced cause; transient wrap probe removed overflow. Other engines and final fix remain to test. |
| Shared moving selection indicator | Reviewed; shared scope selected | Material Web Tabs, Chakra/Ark and Radix indicators inspected. Use Lit Motion across suitable single-selection groups; exact form and participating controls remain for later design. |
| Shared enter/exit/page/state motion | Reviewed; direction selected | Parameter mapping and browser acceptance remain unverified. |
| Checkbox/Radio/Switch state animations | Source comparison reviewed; acceptance pending | Actual Material Web control/ripple sources and current house transitions compared. Ripples are optional, off by default. House parameter mapping and complete state/browser checks remain. [Motion analysis](../analysis/animation-package.md#control-state-and-ripple-source-review). |
| Shape changes and morphing | Reviewed; needs-driven scope clarified | No complete Material catalogue required. Ordinary geometry first; specific transitions and any custom geometry chosen from demonstrated inventory needs. Candidate probes retained as background, not adoption. |
| Material layout/scaffold/panes/grids/spacing/density/RTL/canonical examples | Research coverage reviewed | Pane/density/RTL choices selected. Feed/list-detail/supporting layouts mapped as recipe candidates; final dimensions/semantics and composition remain for the scheduled inventory. [Foundation analysis](../analysis/design-foundations.md). |
| Material customization/tokens/gestures/inputs/selection/states | Follow-up reviewed; acceptance/design pending | Web applicability, semantic state versus visual layers, native input behaviour and token/section inheritance mapped. Concrete cancellation/cleanup checks recorded. No blanket Material state palette or generic gesture engine adopted. |
| React support | Reviewed; package shape selected | Consumer React Table content retains React rendering; no React-to-Lit Table renderer bridge is selected. Content/events/references and package exports remain to design/test. |
| TanStack multi-framework repository survey | Reviewed | Bounded survey of 25 active non-fork repositories; adapters and release status distinguished. [Layout analysis](../analysis/repository-layout.md#phase-1-extension-framework-packages). |
| Complete TanStack Table compatibility | Queued research walkthrough complete; acceptance pending | Selection, grouping/totals and custom extensions now reviewed alongside rendering/layout/pagination. The 17-feature requirement checklist is saved; exact interfaces and combined browser tests remain later. No house Table engine/worker implementation. |
| Native and managed form support | Reviewed; direction selected | Detailed ownership and browser contract remain for design/verification. |
| Numbered/data pagination | Capability selected; optional-parts boundary reopened | Reusable numbered/compact results navigation and unknown totals. Application owns state/loading. Evaluate page-position/page-size/navigation as coordinated optional parts after the full Pro review; no replacement interface selected. Jump-to-page detail remains separate; document navigation is a distinct concept. |
| Toast stacking | Reviewed; direction selected | Reference behaviours and local gaps identified; final limit, timing, actions and API remain in the inventory. |
| Plain/rich tooltip distinction | Reviewed; activation selected | Later Phase 2 keeps Tooltip/Hover Card/Toggle Tip and removes Context Card; exact accessibility and Popover interfaces remain inventory work. |
| Blue default accent | Direction selected; broader verification pending | Original Custom button measured below 4.5:1 in both themes; Peter chose darker blue with white text. Exact state tokens, other controls, non-text contrast and gamut/browser checks remain. [Foundation analysis](../analysis/design-foundations.md#blue-accent-contrast-and-visual-choice). |
| Full custom themes | Reviewed; scope selected | Authoring format, token contract, inheritance and overlay propagation need design and tests. |
| Toast versus Snackbar naming | Reviewed | Keep Toast; bounded official-library survey, not market-share statistics. |
| Biome replacement | Reviewed; direction selected | Isolated native/type-aware/format/CSS probes completed; full rule mapping and migration verification pending. |
| AG Grid AI Toolkit analogue | Reviewed; excluded from this pass | Schema builder/module source inspected. Peter chose authoring support only, with no live AI component control. |
| AG Grid MCP analogue | Reviewed; selected | Published handlers/resources/fetch/project-state code inspected. Build a version-aware documentation/API/example MCP; detailed transport and interface design remain. |
| AG Grid skills analogue | Reviewed; selected | Both skill entrypoints and key Grid/upgrade references read. Ship versioned consumer skills; taxonomy and artifact evaluations remain to design. |
| TanStack Intent for those tools | Reviewed; selected | Guides/source and published 0.4.0 Bun probes covered validation, installed-version loading and allowlist rejection. Full release integration and semantic evaluations remain. |
| Lit/React TanStack Devtools | Reviewed; selected | Lit and React probe panels mounted, updated and cleaned up in Chrome; Bun production exclusion and font-asset adaptation tested. Actual inspector and all-engine verification remain. |
| TanStack Config conventions | Reviewed; recommendations only | Docs, root/PR workflow and publishing helper read. Package checks, explicit tasks, release intent and dependency checks proposed; no additional tooling adoption. |
| Chakra responsive system | Reviewed; scope/defaults selected | Layout and appearance; Material bands; font-relative thresholds. Existing Grid path and published Chakra boundary discrepancy inspected. Exact interface and browser coverage remain. |
| Box | Reviewed; selected | Add a general theme/responsive container primitive. Chakra/Radix source read; exact interface and host semantics remain for the inventory. |
| Resizable panes | Capability selected; native-port implementation review | Port behaviour using the house stack instead of running Zag. Optional collapse restores previous size; application owns saving. Correct orientation/keyboard/collapse inconsistencies and verify the native implementation in all three engines. |
| Density | Reviewed; three choices selected | Shared spacing-only density, normal inherited menu/dialog/Toast spacing, 24px compact clickable-area floor. Exact values/eligibility and browser target checks remain later. |
| Bidirectional support | Reviewed; selected | Whole-page and nested-section LTR/RTL support in Lit/React. Shared navigation gaps and partial Slider handling identified; complete keyboard/icon/content checks remain later. |
| Independent number parsing utility | Reviewed; selected | @internationalized/number; six isolated Bun cases passed. Native Number Input, form/IME and browser acceptance remain later. |

Agent and developer tools are tracked in [agent tooling](../analysis/agent-tooling.md) and [developer tooling](../analysis/developer-tooling.md). Only the explicitly linked decisions are selected; Config recommendations and detailed interfaces remain open.

## Resume here

**This capability walkthrough is closed.** Follow the central handoff for active questions. The five-control Zag adapter/runtime strategy is superseded by native Lit ports using the full house stack. Do not repeat settled capability questions, revive a Zag runtime or add a house TanStack Table engine.

The [Phase 2 disposition/terminology review](phase-2-review.md#phase-2-closure) is complete. Follow the [current handoff](README.md#where-we-are) and [inventory](inventory.md) for exact interfaces and composition rules. Card, Fieldset, Group/Toolbar ownership, focused Item, Tree View, Sidebar, TOC, formatters, settings recipes and Data List are selected. Check prior and upcoming dependencies without reopening settled capability choices.

The [five native-port mappings](../analysis/package-choices.md#five-native-behaviour-port-mappings) are recorded. @internationalized/number is selected. Shape morphing is needs-driven; the full Material catalogue is not a research gate. Do not repeat those choices or resume a generic shape-library selection without a concrete component need.

Exact component interfaces, inspector panels, MCP transport/hosting and release coordination continue in the inventory and migration reviews. Responsive selections now live in the [responsive decision](../decisions/responsive-system.md) and inventory; only their explicitly listed details remain open. Preserve separate pre-approval evidence gates and implementation acceptance checks.

## Phase 1 closure audit

The audit checks research coverage and decision status, not implementation readiness:

- The original nine investigations and their walkthrough are complete, with local evidence and source comparisons linked from phase-1-review.md.
- The extension register covers the supplied document and subsequent requests. Each entry has a recorded selection, a scoped recommendation or an explicit later-phase obligation. Layout recipes remain recommendations until the inventory approves them.
- Native Lit ports have behaviour/state/motion/style/form/lifecycle mappings. The independent parser choice is resolved. Full upstream-test adaptation and component verification follow the approved implementation plan.
- Motion/shape scope is resolved at the research level. Specific transitions, parameters and custom geometry are inventory work. No general shape library or wholesale Material palette is selected.
- Phase 2 owns glossary/context decisions, names and dispositions. Phase 3 starts when Peter says and owns shared architecture. Phase 4 owns full interfaces, conventions and docs layout, requiring approval.
- Phase 5 must resolve final package paths/versions, generated-file migration, publication compatibility and the ordered migration plan before implementation. Preserve existing publishing/provenance guarantees while the pure-Bun publication path remains unresolved.
- Phase 6 must prove behaviour, accessibility and visual requirements in the selected browsers and Bun tests. Existing synthetic probes and historical 608 tests are evidence with stated limits, not proof of the finished system.

No unresolved generic shape-package choice remains. New evidence can return a specific topic to research during later phases. This closure neither starts Phase 3 nor approves source implementation.

The TanStack Config practices are recommendations, not selected packages or automation. Preserve trusted publishing/provenance while the pure-Bun publication path is unresolved.

Use Peter's local ask-user-question skill and Codex reference. Questions need a short self-contained premise, comparison details in separate option rows, one question at a time and no agent deadline. Wait for actual answers. Return to Plan mode for the guided questions if that is the available untimed route; do not use the async countdown card.

Peter explicitly requested continuous progress between research subjects. Continue useful work without asking for routine “continue” messages. Pause for substantive decisions or necessary records checkpoints; keep Plan-mode writes and implementation approval boundaries intact.

## Evidence and capture limits

[Probe record](evidence/additional-probes-2026-09-19.json) preserves the ComboBox and Zag observations. [Tooling evidence](evidence/tooling-evaluation-2026-09-19.json) preserves versions, counts, diagnostics and limitations. Later evidence covers [responsive findings](evidence/responsive-review-2026-09-19.json), [Intent](evidence/intent-probe-2026-09-19.json), and [Devtools](evidence/devtools-probe-2026-09-19.json). The current capture verification is [here](evidence/extension-capture-verification.json).

The third capture adds [blue/control measurements](evidence/blue-control-review-2026-09-19.json), the two latest decisions, and the [partial Table source review](evidence/table-review-2026-09-19.json). No all-state palette, ripple API, future Table version pin or completed compatibility claim is implied.

The fourth capture corrects Table ownership throughout the active plan/decisions/analyses, records TanStack Virtual for both frameworks and the results-pagination selection, and extends the same Table evidence file. Published tarball integrity checks, source comparisons and upstream examples are distinct from runtime testing. No combined Table browser probe ran.

The fifth capture records the four pane decisions in one subject note, explicitly extends Zag adoption to Splitter, saves package/source comparisons and synthetic probe limits, and completes the queued Table research record. [Pane evidence](evidence/resizable-panes-2026-09-19.json). No pane implementation, upstream fix/report, project installation or browser acceptance followed from these selections.

The sixth capture records five answers in three notes (density, bidirectional support and shared indicator), layout recipe recommendations, input/state/token findings, the synthetic Interaction listener probe and the updated continuous-work preference. [Foundation evidence](evidence/foundation-followup-2026-09-19.json). Source findings and synthetic reproductions remain distinct from browser acceptance. The Radix segmented-control reference characterization was corrected from current source; the later [Segmented Control decision](../decisions/segmented-control.md) selects the house radio semantics; exact interfaces remain inventory work.

The subsequent strategy correction supersedes Zag runtime/adapter adoption for five controls, while retaining their capabilities. Official vanilla support was found and its Zag-store runtime inspected; it does not satisfy Peter's clarified constraints. [Strategy evidence](evidence/zag-strategy-review-2026-09-19.json). The prior measurements remain historical source evidence, not measurements of the new ports. No source/runtime change was performed.

The subsequent native-port mapping records each control's behaviour, state, motion/style/form responsibilities and verification needs. [Port-mapping evidence](evidence/native-port-mapping-2026-09-19.json) includes an isolated number-parser probe. Peter subsequently selected the independent parser; it is not yet installed in the project.

The closure capture records that selection and the needs-driven shape correction. [Geometry study](evidence/shape-geometry-review-2026-09-19.json) remains background evidence with no AndroidX runtime or browser fidelity claim. No source implementation, generator run or project dependency change occurred.

The earlier 608-unit-test result is historical. No unit suite or build was rerun for this records-only capture. The later lint probes report failures; they are not a clean lint certification. No commit, push, release or project dependency change is part of this checkpoint.
