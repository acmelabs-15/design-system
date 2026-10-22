# Separate Group, Toolbar and selection responsibilities

Keep three responsibilities separate and compose them: **Group** supplies arrangement and shared presentation; **Toolbar** identifies related controls and owns coordinated keyboard movement; **selection controls** retain selected-value and form behaviour. Peter selected “Use this split (Recommended)” after the complete Material documentation comparison and the Chakra/Radix/Pro and web-accessibility review.

Decided 2026-09-19 by Peter.

Toolbar can contain richer controls, including inputs and selection groups, where their keyboard and focus contracts are deliberately coordinated. The decision does not give Toolbar unconditional ownership of every child key, selection value or form event. It does not turn every horizontal row into a Toolbar.

The Group review coordinated nested controls and shared behavior. Keep one effective focus owner for a given movement; preserve each control's selection and form meaning. Exact roles, key routing, disabled-item discovery, orientation/RTL, overflow, slots, properties and events belong to the later [navigation/disclosure](../../spec/SPEC-navigation-disclosure.md) and [selection](../../spec/SPEC-selection.md) contracts. This does not decide the retention or replacement of every existing component whose name ends in Group.

The selected state, motion, generated-style, icon and framework rules remain the implementation baseline. No Material spacing, density, target, shape or token value is adopted by this decision. New evidence may justify a separately reviewed change. The historical Phase 5 gate is retired.

Evidence: [full comparison](../research/06-codebase-systematization.md#full-material-review-and-selected-responsibilities), [source coverage](../verification/systematization/material-full-review-2026-09-19.json), and [required Group return point](../history/systematization/scope-review.md#toolbar-and-group-composition).

The later [Group presentation decision](0045-group-presentation.md) adds compatible shared appearance defaults and the selected ButtonGroup replacement. Selection families retain their own appropriate keyboard behaviour as well as values/forms; Toolbar coordinates nested owners rather than exclusively owning all keyboard interaction. The [shared active-indicator component](0097-shared-selection-indicator.md) owns Lit Motion internally, supports both orientations and serves single-selection presentation. The later contracts record that coordination.

## Phase 2 responsibility closure

The final review selects radio-based Segmented Control and a separate Toggle Button capability, and clarifies Stack/HStack/VStack for ordinary layout. This closes the remaining Phase 2 responsibility conflict: layout containers do not own values or keyboard selection; Toolbar coordinates effective focus, and nested controls retain value/form behaviour and the keys needed for their own function. One effective owner handles a key or gesture.

Context-specific radio-in-toolbar behavior, text-editing arrows, disabled-item discovery, RTL and overlay focus return were combined acceptance requirements in the Phase 4 design. The later contracts retain those requirements without competing focus/selection controllers. [Closure](../history/systematization/scope-review.md#phase-2-closure).
