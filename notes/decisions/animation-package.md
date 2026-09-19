Decided 2026-09-19 by Peter.

# Retain Lit Motion for the systematization pass

Keep `@lit-labs/motion`, subject to browser verification of interruption, resizing, element removal and reduced motion. Peter accepted this recommendation after clarifying that every decision must seek the best long-term result for the library. Avoiding implementation work is not a reason to prefer a package.

Lit Motion coordinates measurements with Lit updates, supports entry and exit, and already demonstrates the Book's custom 3D movement. Its measured delivery cost is competitive. Lasting correctness and maintenance responsibilities matter when comparing integrations; initial replacement effort does not decide the choice. The comparison does not prove a frame-rate or reliability advantage over complete alternative implementations, and the package's experimental support status remains a risk.

The migration should standardize cancellation, completion, disconnection and reduced-motion handling. The shared implementation is still to be designed in Phases 3–5. Acceptance requires the relevant checks in Chromium, Firefox and WebKit. New evidence of a more reliable alternative can reopen the package choice; no source changes start before Phase 5 approval.

Evidence: [animation investigation](../analysis/animation-package.md), [Book decision](motion-on-the-book.md), [browser coverage](browser-verification.md), and [official Lit Motion documentation](https://github.com/lit/lit/tree/main/packages/labs/motion).

The later [Material motion decision](material-motion-system.md) selects shared spring roles and both Standard/Expressive schemes while retaining this package choice. [Shape support](shape-support.md) includes abstract geometry and morphing; no geometry port has been selected.
