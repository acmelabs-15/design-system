Decided 2026-09-19 by Peter.

# Compose overlay controllers around native surfaces

Peter selected overlays as the first Phase 3 candidate, composable Lit controllers rather than one inherited overlay base, and native surfaces rather than a fully custom modal/stacking implementation. He then accepted the architecture direction described below.

Separate overlay lifetime/presence, anchored placement and nested coordination. Components retain their own markup and family-specific dismissal/focus policies. Use native modal dialogs for blocking surfaces and browser top-layer capabilities where appropriate for non-modal popups. Floating UI remains the placement owner, Lit Motion remains the motion owner, and TanStack Store holds component state.

Keep modal isolation and scroll locking until the owned exit finishes. Reduced-motion completion is immediate; reopening cancels the pending exit; removal cleans up immediately. Unrelated descendant animations cannot hold the session open. Reject obsolete asynchronous placement results and complete/clean up once. Theme context follows the opener's relevant section, subject to the scoped-theme contract.

Acceptance must cover close/reopen interruption, nesting, focus return, changing anchor/content dimensions, reduced motion, removal and reconnect in Chromium, Firefox and WebKit. Exact native popover modes, coordinator/parent relationships, per-family focus/dismissal policies, controller interfaces and event details remain to be specified.

## Evidence audit qualification

The direction is accepted; implementation superiority is not proven. Source confirms six placement/autoUpdate pairs, repeated platform/motion/resource logic and an unused shared Overlay base. Lit officially supports controller composition. These establish a real problem and a supported approach, not a complete comparison against an equally capable inherited implementation.

Before closing Phase 3 interfaces, compare viable approaches at the same nested focus, modality, interruption and theme contract. Native platforms and owned-exit handling still require actual all-engine probes; current Sheet defects are evidence of problems, not proof that a new controller fixes them. Preserve the selected direction unless evidence warrants a proposed revision.

[Review and acceptance record](../alignment/phase-3-review.md), [evidence](../alignment/evidence/phase-3-checkpoint-2026-09-19.json), [quality requirement](evidence-and-implementation-quality.md).
