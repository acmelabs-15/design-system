Decided 2026-09-19 by Peter.

# Use one flexible Card for related-content surfaces

Rebuild Card to cover the plain, sectioned and linked content currently split across Card, Panel and Link Card. Remove the separate Panel and Link Card interfaces during the approved migration, with examples for their uses. Peter selected “One flexible Card” to give consumers one consistent structure instead of overlapping container interfaces.

Card supplies the defined presentation for related content. Box remains the general container, and Flex/Stack/Grid remain layout primitives. Entity/Item rows, statistical values and form grouping are distinct subjects; this decision does not fold them into Card. Chakra, Radix, Ant Design and Web Awesome support the Card name and composition approach. Material Web's experimental Lit Card is comparison evidence, not an adopted dependency.

Use the house stack and shared primitives. Exact sections, slots, properties, heading semantics, link/action behaviour, nested controls, responsive behaviour and visual treatments remain for architecture/inventory review. Those later decisions must be checked against this scope; they are not implicitly approved by the retention decision. No compatibility aliases or source implementation are authorized before Phase 5 approval.

Evidence: [container analysis](../analysis/codebase-systematization.md#phase-2-container-family), [Box decision](box-primitive.md), and [Phase 2 review](../alignment/phase-2-review.md#container-decisions).
