# Inventory review history

This record preserves the systematization inventory's review stages and bounded evidence. The [design-system contract](../../../spec/SPEC-design-system.md) owns the accepted requirements. The completed migration and release records supply later implementation evidence.

## Approval and review sequence

The inventory was prepared on 2026-09-20. Peter approved every proposal through “I approve all proposals” that day, including shared conventions and the documentation layout. That selected the stated recommendations and closed the five-question register. Design approval alone did not approve an unwritten migration plan or prove runtime behavior. The former Phase 5 implementation gate applied to that stage and is retired.

The [remaining-work queue](../../../tasks/done/systematization/review-queue.md) grouped the then-current source and additions into thirteen review areas. The approval scope contained 91 numbered component/family/adapter entries, seven documentation units, 150 original source tags and thirty extension records. These are scope counts, not current element counts. The [approval evidence](../../decisions/0049-inventory-approval.md) preserves the pre-update hashes; it does not freeze future approved documentation changes.

The original review order began with Group and ordinary layout, then typography, Icon/Icon Button, selection controls, inputs, Card/Item/Toolbar/Stat/Field/List and the remaining families. Complete family proposals followed the [consolidated queue](../../../tasks/done/systematization/review-queue.md#phase-4-proposal-groups) and the [Phase 4 entry fields](pass-history.md#42-every-element). Shared-rule/helper details accompanied their consuming components. Ordinary implementation and test work remained agent-owned; only material unresolved author-facing choices went to Peter. The later migration approval replaced this completed review sequence.

## Shared architecture evidence and former open details

The accepted shared architecture carried five responsibilities into the inventory. Its requirements remain in the current contract; the original evidence limits were:

- Overlay lifetime, placement and coordination had an accepted controller/native-surface direction. Controller interfaces, coordination relationships and each family's native surface mode were still unspecified.
- A public-state scratch refinement passed 24 checks in happy-dom and Chromium, eleven existing regression tests and a strict helper type check. It established feasibility, not a universal decorator. Existing atomState, StoreSelector and StoreEffect required evaluation before replacement. Final helper composition and authoring-rule enforcement, including decorator order, remained open.
- Immediate native synchronization passed fifteen targeted Chromium text-control cases; render-cycle synchronization failed six. A controller with a small native callback bridge was feasible, but its final packaging, per-control mappings and validation/event contracts remained open.
- Effective-theme resolution had to preserve CSS inheritance instead of repeating global root-to-host mirroring. Scope authoring, minimum runtime metadata and JavaScript value propagation remained open.
- Compiled CSS feeding generated Lit modules was selected. Compiler/tool choice and final source/output layout were still open. A representative pipeline had to cover escaping, scope conversion, registration defaults/inheritance/conflicts, deterministic output, invalid input, selective imports and useful maps in three engines before dependent production edits. Full pipeline/component/build-order acceptance remained a separate later boundary.

Sources: [state candidate](../../verification/systematization/existing-state-integration-2026-09-19.json), [native-form comparison](../../verification/systematization/native-form-mechanism-2026-09-19.json), [style comparison](../../verification/systematization/style-pipeline-comparison-2026-09-19.json), [theme foundation research](../../research/07-design-foundations.md). The later [style-production decision](../../decisions/0104-style-production.md), [state bridge](../../decisions/0080-public-state-bridge.md), [theme transport](../../decisions/0109-theme-resolution-architecture.md) and [M06 shared-lifecycle evidence](../../verification/systematization/m06-shared-lifetimes-2026-09-21.json) record the resolutions and their limits. A direct restoration-callback call still does not prove actual browser-history or autofill behavior.

## Content and interaction architecture recommendations

These began as engineering proposals, not extra individual Peter votes. The Places default descendant query could count a nested child's slot, while its observer watched child lists but not slot-attribute changes. The proposed refinement tracked content actually assigned to the host's declared slots while retaining first-render and reconnect behavior.

The Interaction refinement assigned temporary pointer listeners and cancellation/teardown to their shared lifecycle owner. Visual interaction state remained separate from selection, form values and control-specific commit rules. Existing source and the [cancellation probe](../../research/06-codebase-systematization.md#interaction-cancellation-and-cleanup) supported that refinement; they did not justify a new global gesture engine. M06 later implemented the shared lifetimes. This history creates no new gesture-engine task.

## Core layout proposal and bounded probes

The original six entries covered Box, Flex, Stack/HStack/VStack, Grid, Simple Grid and Group. The decorative Grid and ButtonGroup were replacement sources, not automatically preserved behavior. Text/Heading and Inset/Separator/Scroll Area/Resizable had their own family owners. All six complete entries were subsequently included in the whole-set approval; early words such as “candidate,” “proposed” and “before approval” describe drafting stages.

The design preserved a 77-property shared interface, real hosts and native roots, and a required geometry outcome rather than a proven wrapper algorithm. E02/E04 originally had to establish sizing, inline flow, semantic references, scoped registries and adoption. A failed geometry case could not be hidden by display: contents.

The source comparison retained deliberate adaptations: full CSS names instead of shorthand aliases, explicit numeric token semantics, a scalar-first HTML decoder, native half-open query ranges, separate query and property order, and an explicit zero minimum in Simple Grid. Source inspection did not certify rendering.

The original input/order evidence remains bounded:

- [Declaration-order comparison](../../verification/systematization/declaration-order-probe-2026-09-20.json).
- [React and CSS-default integration](../../verification/systematization/style-input-integration-review-2026-09-20.json).
- [Compiler and manifest checks](../../verification/systematization/style-package-verification-2026-09-20.json).
- [Helper lifecycle and original WebKit failure](../../verification/systematization/lit-style-helper-review-2026-09-20.json).
- [Ownership and batching](../../verification/systematization/lit-style-ownership-review-2026-09-20.json).

Those probes did not certify the complete production implementation or replace the representative style-pipeline prerequisite. The early HTML/Lit/React examples illustrated intended usage without frozen imports or a claim of released API. The later helper decision selects the same authoring capability and names explicit clearing; complete runnable documentation examples retain their own acceptance.

## Review choices and approval gates

The original review points were:

| Review point | Then-recorded choice or open detail | Later resolution |
| --- | --- | --- |
| Shared surface across layouts | Shared focused styling and Box's nine tags/default were selected; exact property table and root-part details were still labelled proposed | Whole-set approval includes the complete table, semantics and geometry requirements |
| Group appearance propagation | Size and variant defaults were proposed, with exact child subsets awaiting R04–R06 | Approved action, selection and input contracts own those subsets; unsupported values do not become arbitrary forwarding |
| Styling input failures | Peter selected Chakra behavior for comparable CSS; malformed HTML JSON/responsive structure had no direct source equivalent | Foundations defines the source-backed converter adaptation; previous-valid-value retention remains withdrawn |
| Narrow automatic grids | Inspected Chakra source honors the authored minimum without an automatic clamp | Source-derived resolution, not another individual preference vote |

Remaining names/defaults formed one complete contract, not a queue of separate votes. The [standing reference decision](../../decisions/0082-reference-systems.md#follow-the-established-reference-without-another-preference-question) distinguished source-derived resolutions from user votes. The original engineering dependencies covered real-host geometry/semantics, responsive ordering/parser cases, converter behavior, helper cleanup/scoped registries, wrapped-line separators and Group visual/focus compatibility. R01 supplied theme/token/density settings; R04–R06 supplied participating child values. The representative generated-style/package checks remained separate. These completed gates do not restart the old review. [Original proposal research](../../research/07-design-foundations.md#core-layout-contract-proposal).

## Explicit later resolutions

- On 2026-09-21 Peter selected [styleInputs({}) clearing](../../decisions/0052-layout-spacing-properties.md#explicit-clearing-for-the-style-helper). Expression removal or disconnection does not clear canonical styles. This replaces the earlier automatic-removal cleanup after the [three-engine lifecycle reproduction](../../verification/systematization/m05-style-helper-lifecycle-2026-09-20.json).
- Simple Grid minimum mode follows canonical authored minimum-input presence before responsive mapping. Zero is explicit. Skipped branches and invalid current JavaScript CSS do not revive columns; undefined/removal restores count mode. Invalid scalar HTML follows the agreed converter. [Recorded implementation resolution](../../decisions/0051-layout-grid.md#implementation-completed--2026-09-21).
- Group uses the actual radius token --r, replacing the draft's nonexistent --acme-radius. M07 completed its membership/presentation protocol; M09–M11 still owned real action/card/input integration at that checkpoint. [Group resolution](../../decisions/0045-group-presentation.md#foundation-implementation--2026-09-21).
- Selection member size resolves explicit member, nearest Group, owning collection where supported, then component default. Collection fallback does not give Checkbox Group a variant. [Dated implementation resolution](../../decisions/0035-execution-delegation.md#logical-collection-appearance-defaults--2026-09-21).

The [completed migration](../../../tasks/done/systematization/plan.md) and [0.3.2 release record](../../releases/0.3.2.md) preserve subsequent acceptance. Subgrid across retained host/root boxes is still not promised without separate feasibility evidence. Actual-platform accessibility cannot be inferred from a native tag, local mechanism check or automated engine alone. A disagreement between current code and an approved requirement requires a visible issue, not a weaker contract.
