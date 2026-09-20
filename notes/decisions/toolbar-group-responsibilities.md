Decided 2026-09-19 by Peter.

# Separate Group, Toolbar and selection responsibilities

Keep three responsibilities separate and compose them: **Group** supplies arrangement and shared presentation; **Toolbar** identifies related controls and owns coordinated keyboard movement; **selection controls** retain selected-value and form behaviour. Peter selected “Use this split (Recommended)” after the complete Material documentation comparison and the Chakra/Radix/Pro and web-accessibility review.

Toolbar can contain richer controls, including inputs and selection groups, where their keyboard and focus contracts are deliberately coordinated. The decision does not give Toolbar unconditional ownership of every child key, selection value or form event. It does not turn every horizontal row into a Toolbar.

Resolve nested controls and shared behaviour alongside the Phase 2.4 Group review. Keep one effective focus owner for a given movement; preserve each control's selection and form meaning. Exact roles, key routing, disabled-item discovery, orientation/RTL, overflow, slots, properties and events remain for the inventory. This does not decide the retention or replacement of every existing component whose name ends in Group.

The house state, motion, generated-style, icon and framework rules remain the implementation baseline. No Material spacing, density, target, shape or token value is adopted by this decision. New evidence may justify a separately reviewed change. Source implementation still requires Phase 5 approval.

Evidence: [full comparison](../analysis/codebase-systematization.md#full-material-review-and-selected-responsibilities), [source coverage](../alignment/evidence/material-full-review-2026-09-19.json), and [required Group return point](../alignment/phase-2-review.md#toolbar-and-group-composition).

The later [Group presentation decision](group-presentation.md) adds compatible shared appearance defaults and the selected ButtonGroup replacement. Selection families retain their own appropriate keyboard behaviour as well as values/forms; Toolbar coordinates nested owners rather than exclusively owning all keyboard interaction. The [shared active-indicator component](shared-selection-indicator.md) owns Lit Motion internally, supports both orientations and serves single-selection presentation. Exact coordination remains for the inventory.

## Phase 2 responsibility closure

The final review selects radio-based Segmented Control and a separate Toggle Button capability, and clarifies Stack/HStack/VStack for ordinary layout. This closes the remaining Phase 2 responsibility conflict: layout containers do not own values or keyboard selection; Toolbar coordinates effective focus, and nested controls retain value/form behaviour and the keys needed for their own function. One effective owner handles a key or gesture.

Context-specific radio-in-toolbar behaviour, text-editing arrows, disabled-item discovery, RTL and overlay focus return remain explicit combined acceptance contracts in Phase 4. They must be designed together before approval, without introducing competing focus/selection controllers. [Closure](../alignment/phase-2-review.md#phase-2-closure).
