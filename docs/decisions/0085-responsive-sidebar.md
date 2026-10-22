# Sidebar coordinates responsive panel modes

Provide one Sidebar supporting expanded, compact collapsed and small-screen Drawer presentations. Peter selected **Responsive Sidebar** over a layout-only container whose callers assemble those behaviours independently.

Decided 2026-09-19 by Peter.

Sidebar coordinates the panel; the application owns routing and the current page. Links, TOC, Tree View, forms and other contents retain their own behaviour. Use the shared Drawer for the mobile presentation and preserve meaningful child state and focus as presentation changes.

Exact widths, breakpoints, placement, triggers, collapse treatment, persistence and transition/focus rules belong to the later [navigation/disclosure contract](../../spec/SPEC-navigation-disclosure.md). No particular shadcn cookie, shortcut, resize behaviour or Material measurement is adopted.

Evidence: [joint review](../research/06-codebase-systematization.md#joint-content-selection-and-navigation-review), [selected scope](../verification/systematization/capability-checkpoint-2026-09-19.json). This 2026-09-19 choice did not yet approve implementation. The former Phase 5 gate is retired; the [release record](../releases/0.3.0.md) records later acceptance.
