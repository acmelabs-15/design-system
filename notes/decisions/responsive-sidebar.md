Decided 2026-09-19 by Peter.

# Sidebar coordinates responsive panel modes

Provide one Sidebar supporting expanded, compact collapsed and small-screen Drawer presentations. Peter selected **Responsive Sidebar** over a layout-only container whose callers assemble those behaviours independently.

Sidebar coordinates the panel; the application owns routing and the current page. Links, TOC, Tree View, forms and other contents retain their own behaviour. Use the shared Drawer for the mobile presentation and preserve meaningful child state and focus as presentation changes.

Exact widths, breakpoints, placement, triggers, collapse treatment, persistence and transition/focus rules remain inventory work. No particular shadcn cookie, shortcut, resize behaviour or Material measurement is adopted.

Evidence: [joint review](../analysis/codebase-systematization.md#joint-content-selection-and-navigation-review), [selected scope](../alignment/evidence/capability-checkpoint-2026-09-19.json). No source implementation is approved before Phase 5.
