# Retain Lit Motion for the systematization pass

Keep `@lit-labs/motion`, subject to browser verification of interruption, resizing, element removal and reduced motion. Peter accepted this recommendation after clarifying that every decision must seek the best long-term result for the library. Avoiding implementation work is not a reason to prefer a package.

Decided 2026-09-19 by Peter.

Lit Motion coordinates measurements with Lit updates, supports entry and exit, and already demonstrates the Book's custom 3D movement. Its measured delivery cost is competitive. Lasting correctness and maintenance responsibilities matter when comparing integrations; initial replacement effort does not decide the choice. The comparison does not prove a frame-rate or reliability advantage over complete alternative implementations, and the package's experimental support status remains a risk.

The decision required standardized cancellation, completion, disconnection and reduced-motion handling. The shared implementation was not yet designed. Acceptance requires the relevant checks in Chromium, Firefox and WebKit. New evidence of a more reliable alternative can reopen the package choice.

Evidence: [animation investigation](../research/02-animation-package.md), [Book decision](0065-motion-on-the-book.md), [browser coverage](0011-browser-verification.md), and [official Lit Motion documentation](https://github.com/lit/lit/tree/main/packages/labs/motion).

The later [Material motion decision](0059-material-motion-system.md) selects shared spring roles and both Standard/Expressive schemes while retaining this package choice. [Shape support](0094-shape-support.md) includes abstract geometry and morphing; no geometry port was selected by this decision.

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
