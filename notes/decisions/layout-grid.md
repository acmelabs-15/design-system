Decided 2026-09-19 by Peter.

# Keep layout Grid and Simple Grid only

Provide Grid and Simple Grid for ordinary content layout. Remove the current decorative Grid implementation and its Grid Cell, Grid Cross, Grid System and Grid Page interfaces. Dedicated guide lines, crosses and guide-clipping features are not retained as a separate family.

Peter selected “Keep layout grids only” over the recommendation to retain a separately named Decorative Grid. The simpler scope removes a specialised visual family while keeping responsive layout. Chakra and Radix use Grid for content layout; Geist's current Grid combines layout with a specialised guide-line treatment.

The new layout Grid replaces the old same-named implementation outright. Do not preserve the old breakpoint rules, helper exports or decorative child contracts as compatibility interfaces. Exact layout parts, responsive properties and Simple Grid behaviour remain inventory work under the selected house responsive and spacing rules.

Evidence: [grid review](../analysis/codebase-systematization.md#disclosure-layout-and-smaller-component-dispositions), [selection record](../alignment/evidence/disposition-checkpoint-2026-09-19.json).
