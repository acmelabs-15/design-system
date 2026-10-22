# Use the selected stack for overlapping Toasts

Use the overlapping presentation from Peter's shadcn Base UI reference. When the visible limit is reached, show new messages immediately and hide older messages beyond that limit. Peter chose this over queuing incoming messages.

Decided 2026-09-19 by Peter.

Peter then selected implementation with the existing Lit, TanStack Store and shared motion stack, using Base UI as the interaction reference. Do not add Zag Toast or import a React Toast implementation. The Toast implementation owns its behavior tests and maintenance. Preserve the selected Radix level-5 shadow and shared motion policy; the reference's animation timings are not automatically adopted.

Expansion, keyboard and touch access, swipe handling, timer pause/resume, hidden-item interaction, announcements and cleanup require explicit contracts and browser tests. Exact limits, durations, public methods and source-sharing boundaries were initially open; the later [messages/statistics contract](../../spec/SPEC-messages-statistics.md) records them.

Keep the name Toast under the existing rule to prefer wider community usage. The requested naming survey found Toast across independent web and Lit libraries, while Snackbar was concentrated in Material-based systems. This is a bounded library survey, not a community-wide usage measurement or a separate user vote on naming.

Evidence: [Toast and tooltip research](../research/11-floating-surface-shadows.md#phase-1-extension-toast-and-rich-help) and [Zag probe](../verification/systematization/additional-probes-2026-09-19.json).
