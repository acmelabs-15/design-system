# Use Material motion roles with both motion schemes

Use Material 3's spring-based motion system for shared control animations. Support both Standard and Expressive schemes, choosing between them according to Material guidance and the purpose of the interaction. Peter rejected selecting one global scheme as the universal default.

Decided 2026-09-19 by Peter.

Standard suits recurring, utilitarian interactions; Expressive suits prominent or hero interactions. Spatial motion and visual effects have different spring roles. The legacy easing and duration guidance still applies to documented transition patterns; do not assume every Material motion page describes the newer physics system.

Retain the selected Lit Motion package. On 2026-09-19, mapping Material's spring parameters and completion behavior to Lit Motion remained unverified. The required cases included interrupted transitions, reversal, resize, exit, reduced motion and cleanup. Later details belong to the [shared-indicator decision](0097-shared-selection-indicator.md) and [selection contract](../../spec/SPEC-selection.md). Material Web's inspected tab/motion implementation uses timed animations; it does not prove that the new spring system is already implemented in Lit.

Evidence: [animation analysis](../research/02-animation-package.md#phase-1-extension-material-motion-and-shapes).
