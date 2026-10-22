# Use one flexible Card for related-content surfaces

Rebuild Card to cover the plain, sectioned and linked content currently split across Card, Panel and Link Card. Remove the separate Panel and Link Card interfaces during the approved migration, with examples for their uses. Peter selected “One flexible Card” to give consumers one consistent structure instead of overlapping container interfaces.

Decided 2026-09-19 by Peter.

Card supplies the defined presentation for related content. Box remains the general container, and Flex/Stack/Grid remain layout primitives. Entity/Item rows, statistical values and form grouping are distinct subjects; this decision does not fold them into Card. Chakra, Radix, Ant Design and Web Awesome support the Card name and composition approach. Material Web's experimental Lit Card is comparison evidence, not an adopted dependency.

Use the selected stack and shared primitives. Exact sections, slots, properties, heading semantics, link/action behaviour, nested controls, responsive behaviour and visual treatments were left for architecture/inventory review. The retention decision did not implicitly approve those details. The completed replacement does not retain compatibility aliases.

Evidence: [container analysis](../research/06-codebase-systematization.md#phase-2-container-family), [Box decision](0009-box-primitive.md), and [Phase 2 review](../history/systematization/scope-review.md#container-decisions).

In the later [Stat/Tile review](0100-stat-family.md), Peter separately selected removal of Tile/Tiles: integration-style related-content surfaces use Card, measurements use Stat, and shared layout arranges them. That later selection does not turn every Stat into a Card or change the then-open row/Field responsibilities.

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
