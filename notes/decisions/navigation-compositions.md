Decided 2026-09-19 by Peter.

# Replace Side Nav and Subnav with navigation compositions

Remove Side Nav and Subnav. Peter selected “Navigation compositions” over a dedicated Navigation family. Provide complete examples within Sidebar and in horizontal page/App Bar regions using real links, current-page indication, optional icons/section labels and suitable wrapping or overflow.

These current components style slotted links inside nav regions; they do not own routing, selection values or arrow-key control. Applications retain routes; Sidebar retains its selected responsive panel modes. Navigation between destinations must not silently become Tabs or Toolbar.

Use Stack/HStack/VStack for ordinary layout, List where list structure is appropriate, and Group only when its specific presentation features are needed. Exact markup, landmark labels, link styling, focus and narrow-layout behaviour belong in the inventory and examples.

Evidence: [closure review](../analysis/codebase-systematization.md#phase-2-closure-review), [answers](../alignment/evidence/phase-2-closure-2026-09-19.json).
