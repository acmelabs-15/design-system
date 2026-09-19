Decided 2026-09-19 by Peter.

# Use Material motion roles with both motion schemes

Use Material 3's spring-based motion system for shared control animations. Support both Standard and Expressive schemes, choosing between them according to Material guidance and the purpose of the interaction. Peter rejected selecting one global scheme as the universal default.

Standard suits recurring, utilitarian interactions; Expressive suits prominent or hero interactions. Spatial motion and visual effects have different spring roles. The legacy easing and duration guidance still applies to documented transition patterns; do not assume every Material motion page describes the newer physics system.

Retain the selected Lit Motion package. Mapping Material's spring parameters and completion behaviour to Lit Motion still requires verification, including interrupted transitions, reversal, resize, exit, reduced motion and cleanup. Material Web's inspected tab/motion implementation uses timed animations; it does not prove that the new spring system is already implemented in Lit.

Evidence: [animation analysis](../analysis/animation-package.md#phase-1-extension-material-motion-and-shapes).
