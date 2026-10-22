# Compose overlay controllers around native surfaces

Compose Lit overlay controllers around native surfaces. Shared presence, placement and nested coordination address repeated platform, motion and resource logic while each component owns its markup and policies. Peter selected this direction over an inherited overlay base and a fully custom modal/stacking implementation.

Decided 2026-09-19 by Peter.

Separate overlay lifetime/presence, anchored placement and nested coordination. Components retain their own markup and family-specific dismissal/focus policies. Use native modal dialogs for blocking surfaces and browser top-layer capabilities where appropriate for non-modal popups. Floating UI remains the placement owner, Lit Motion remains the motion owner, and TanStack Store holds component state.

Keep modal isolation and scroll locking until the owned exit finishes. Reduced-motion completion is immediate; reopening cancels the pending exit; removal cleans up immediately. Unrelated descendant animations cannot hold the session open. Reject obsolete asynchronous placement results and complete/clean up once. Theme context follows the opener's relevant section, subject to the scoped-theme contract.

Acceptance must cover close/reopen interruption, nesting, focus return, changing anchor/content dimensions, reduced motion, removal and reconnect in Chromium, Firefox and WebKit. At the 2026-09-19 decision, exact native popover modes, coordinator/parent relationships, per-family focus/dismissal policies, controller interfaces and events remained unspecified. Later [shared-lifecycle evidence](../verification/systematization/m06-shared-lifetimes-2026-09-21.json) and the [overlay/help contract](../../spec/SPEC-overlays-help.md) record the implementation and family details.

## Evidence audit qualification

Peter selected overlays as the first Phase 3 candidate. The direction was accepted; implementation superiority was not proven. The 2026-09-19 source review confirmed six placement/autoUpdate pairs, repeated platform/motion/resource logic and an unused shared Overlay base. Lit officially supports controller composition. These establish a real problem and a supported approach, not a complete comparison against an equally capable inherited implementation.

The original interface review required viable approaches to be compared against the same nested-focus, modality, interruption and theme contract. Native platforms and owned-exit handling required all-engine probes. The then-current Sheet defects were evidence of problems, not proof that a controller fixed them. The completed Phase 3 gate is retired; the selected architecture and these evidence limits remain.

[Review and acceptance record](../history/systematization/architecture-review.md), [evidence](../verification/systematization/phase-3-checkpoint-2026-09-19.json), [quality requirement](0034-evidence-and-implementation-quality.md).
