Decided 2026-09-19 by Peter.

# Keep ripples off by default and allow opt-in

Support ripple feedback as an option, with ripples off by default. This preserves the quieter default control treatment while allowing the Material-style press effect when wanted. The selection does not turn off the separately selected control-state animations.

Material Web implements ripple feedback separately from the Checkbox, Radio and Switch state transitions. It is an implementation reference; this decision does not adopt Material Web as a package or settle the house ripple interface. The configuration level, applicable controls and public names remain for the inventory.

When enabled, ripples must preserve contrast in combined hover/press states and respect reduced motion. Pointer cancellation, touch scrolling, keyboard activation, repeated presses, disabled state, forced colours and cleanup need verification.

Evidence: [control and ripple source review](../analysis/animation-package.md#control-state-and-ripple-source-review).
