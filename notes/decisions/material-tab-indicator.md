Decided 2026-09-10 by Peter; recorded 2026-09-19 from the systematization plan.

# Tabs use the Material 3 primary-tab indicator

Take the indicator's anatomy, states, and behaviour from Material 3 primary tabs, including the horizontal slide when the selected tab changes. This reference applies to the indicator; it does not adopt Material for the rest of the library.

Peter selected [retaining `@lit-labs/motion`](animation-package.md) after Phase 1.5 research on 2026-09-19. The existing [book motion decision](motion-on-the-book.md) remains evidence for its capabilities, including interruption handling; its demonstrated capabilities are not reopened without new evidence.

The tab inventory entry must state the exact indicator values and behaviour, their source, and the verification method before implementation.

The later [shared-indicator decision](shared-selection-indicator.md) extends reusable moving-indicator behaviour to other suitable single-selection groups. It retains this tab-specific appearance/behaviour contract and does not adopt another animation package.
