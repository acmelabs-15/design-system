Decided 2026-09-19 by Peter.

# Separate Group, Toolbar and selection responsibilities

Keep three responsibilities separate and compose them: **Group** supplies arrangement and shared presentation; **Toolbar** identifies related controls and owns coordinated keyboard movement; **selection controls** retain selected-value and form behaviour. Peter selected “Use this split (Recommended)” after the complete Material documentation comparison and the Chakra/Radix/Pro and web-accessibility review.

Toolbar can contain richer controls, including inputs and selection groups, where their keyboard and focus contracts are deliberately coordinated. The decision does not give Toolbar unconditional ownership of every child key, selection value or form event. It does not turn every horizontal row into a Toolbar.

Resolve nested controls and shared behaviour alongside the Phase 2.4 Group review. Keep one effective focus owner for a given movement; preserve each control's selection and form meaning. Exact roles, key routing, disabled-item discovery, orientation/RTL, overflow, slots, properties and events remain for the inventory. This does not decide the retention or replacement of every existing component whose name ends in Group.

The house state, motion, generated-style, icon and framework rules remain the implementation baseline. No Material spacing, density, target, shape or token value is adopted by this decision. New evidence may justify a separately reviewed change. Source implementation still requires Phase 5 approval.

Evidence: [full comparison](../analysis/codebase-systematization.md#full-material-review-and-selected-responsibilities), [source coverage](../alignment/evidence/material-full-review-2026-09-19.json), and [required Group return point](../alignment/phase-2-review.md#toolbar-and-group-composition).
