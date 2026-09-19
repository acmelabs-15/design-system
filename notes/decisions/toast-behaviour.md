Decided 2026-09-19 by Peter.

# Use the house stack for overlapping Toasts

Use the overlapping presentation from Peter's shadcn Base UI reference. When the visible limit is reached, show new messages immediately and hide older messages beyond that limit. Peter chose this over queuing incoming messages.

Peter then selected implementation with the existing Lit, TanStack Store and shared motion stack, using Base UI as the interaction reference. Do not add Zag Toast or import a React Toast implementation. The house implementation owns its behaviour tests and maintenance. Preserve the selected Radix level-5 shadow and shared motion policy; the reference's animation timings are not automatically adopted.

Expansion, keyboard and touch access, swipe handling, timer pause/resume, hidden-item interaction, announcements and cleanup need explicit inventory entries and browser tests. Exact limits, durations, public methods and source-sharing boundaries remain open.

Keep the name Toast under the existing rule to prefer wider community usage. The requested naming survey found Toast across independent web and Lit libraries, while Snackbar was concentrated in Material-based systems. This is a bounded library survey, not a community-wide usage measurement or a separate user vote on naming.

Evidence: [Toast and tooltip research](../analysis/floating-surface-shadows.md#phase-1-extension-toast-and-rich-help) and [Zag probe](../alignment/evidence/additional-probes-2026-09-19.json).
