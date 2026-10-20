Decided 2026-09-19 by Peter.

# Use Group for shared arrangement and appearance defaults

Group coordinates arrangement and shared presentation. Peter selected **Shared defaults**, then **Use Group** rather than retaining ButtonGroup for button-specific defaults. Remove the separate ButtonGroup interface during the approved migration. Applicable appearance settings can be supplied once; explicit child settings override them. Define which settings each participating child accepts rather than forwarding arbitrary properties.

The comparison matters: Chakra's generic Group joins and positions children, while ButtonGroup adds shared Button recipe defaults. Our broader Group is a deliberate house direction, not a claim that Chakra Group already supplies all family defaults. A smaller interface count alone is not the rationale; one predictable authoring pattern and shared implementation are.

Peter requests attached presentation for Radio Cards and Checkbox Cards. Suitable single-selection patterns can reuse the [shared active-indicator component](shared-selection-indicator.md), with Lit Motion inside that component. Checkbox and other multiple-selection patterns do not use a single travelling indicator. Controls retain selected values, form participation and their appropriate keyboard behaviour; Toolbar coordinates nested controls when applicable.

## Visual directions to evaluate in the inventory

Peter's [saved screenshot](../alignment/evidence/group-outline-reference-2026-09-19.png) requests an optional rounded outline around the group, separate from an inset selected-item highlight. In the Phase 4 review, Peter selected the outer border and attachment as independent settings: use either or both. Resolve child borders, dividers, corners, spacing and focus visibility for each combination. Exact values, final property names and defaults remain inventory work.

External input add-ons are another attached-group use. Peter explicitly identified the opportunity to share Group's visual rules. Evaluate internal reuse so inputs and attached controls have consistent borders and alignment. Preserve the established distinction between outside add-ons and inside start/end content. This does not choose a new consumer wrapper requirement or transfer text entry, validity or form ownership into Group.

## Remaining contract

Specify compatible children, themes, explicit overrides, dynamic/hidden/reordered children, real wrapper boxes, RTL, responsive orientation, different child heights, attached focus visibility and reduced motion. Wrapping and nested defaults follow the selections below. Chakra's React child cloning and context are evidence, not the Lit implementation. Existing density, state, motion and generated-style decisions remain the baseline.

Other specialised groups are reviewed individually. This decision does not remove selection/disclosure behaviour, member-count logic or semantic lists merely because their names contain Group.

Evidence: [complete Group comparison](../analysis/codebase-systematization.md#comprehensive-chakra-group-review), [coverage and choices](../alignment/evidence/group-review-2026-09-19.json). Exact interfaces remain Phase 4 work; source implementation waits for Phase 5.

## Ordinary layout and Tags

Peter clarified that Stack, HStack and VStack should be used where Group-specific features are unnecessary. Use those primitives for ordinary spacing/alignment; use Group for attached edges, compatible shared appearance defaults and other Group-specific presentation. This qualifies the earlier Item/Tag/navigation composition votes: they do not require Group around every collection.

Peter selected “Use Group” to remove the Tags wrapper while retaining Tag. With the later layout clarification, the replacement example uses suitable Stack layout unless it needs Group's features. The current Tags only supplies wrapping/spacing; it has no selection or count owner. List remains responsible for list semantics, and Card for a surrounding surface. [Closure choices](../alignment/evidence/phase-2-closure-2026-09-19.json).

The [Stack-family decision](stack-layout.md) now selects gap token 2 and fixed directions for HStack/VStack, with general Stack handling responsive direction. This does not select Group's own unattached gap or change attached edge rules.

## Phase 4 wrapping and nested defaults

Peter answered “Align with what chakra does” for attached wrapping. Re-read the complete pinned Group source: wrap is forwarded to flexWrap independently of attached, while first/between/last markers follow member order. Permit wrapping with attachment; do not add per-wrapped-row corner calculation or the proposed single-line restriction. This is alignment with the inspected implementation, not a claim that it automatically supplies a complete rounded frame for every wrapped row.

Peter again chose Chakra's behaviour for nested appearance defaults. Each nested Group supplies a fresh set of compatible defaults. Unspecified settings use the component defaults, rather than merge the outer Group's defaults. Explicit child settings still override them. CSS theme inheritance is a separate contract and remains unchanged.

The later [Stack separator choice](stack-layout.md#separator-spacing-and-wrapped-lines) makes automatic Stack dividers follow visible rows/columns. It does not revise this Group decision: attached corners still follow member order, without per-wrapped-row correction. Review the two presentation contracts separately when composing them.

Sources: [Group implementation](https://github.com/chakra-ui/chakra-ui/blob/1ff9873754e9913fc3d849d23c0844a628f5f20d/packages/react/src/components/group/group.tsx), [ButtonGroup provider](https://github.com/chakra-ui/chakra-ui/blob/1ff9873754e9913fc3d849d23c0844a628f5f20d/packages/react/src/components/button/button-group.tsx), [choice record](../alignment/evidence/phase-4-checkpoint-2026-09-19.json). These choices do not approve the entire Group inventory entry or source implementation.

## Foundation implementation — 2026-09-21

The complete inventory and migration were approved on 2026-09-20. Group's layout, explicit membership and shared presentation protocol are now implemented under Peter's execution delegation. [Foundation evidence and acceptance boundary](../alignment/evidence/m07-group-2026-09-21.json).

M09–M11 still own real action/card/input participation and their paint/focus checks. The native-control protocol fixture does not certify those unmodified families. The shared indicator remains owned by the later single-selection family; this Group foundation introduces no selected value or keyboard manager. ButtonGroup is removed outright. The actual house radius token is --r, so it supplies the outline default rather than the proposal's nonexistent --acme-radius token.
