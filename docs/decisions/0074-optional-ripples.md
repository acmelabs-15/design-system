# Keep ripples off by default and allow opt-in

Support ripple feedback as an option, with ripples off by default. This preserves the quieter default control treatment while allowing the Material-style press effect when wanted. The selection does not turn off the separately selected control-state animations.

Decided 2026-09-19 by Peter.

Material Web implements ripple feedback separately from the Checkbox, Radio and Switch state transitions. It is an implementation reference; this decision does not adopt Material Web as a package or settle the ripple interface. The later [actions contract](../../spec/SPEC-actions.md) defines the configuration level, applicable controls and public names.

When enabled, ripples must preserve contrast in combined hover/press states and respect reduced motion. Pointer cancellation, touch scrolling, keyboard activation, repeated presses, disabled state, forced colours and cleanup need verification.

Evidence: [control and ripple source review](../research/02-animation-package.md#control-state-and-ripple-source-review).
