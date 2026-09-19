Decided 2026-09-19 by Peter.

# Superseded: Zag behaviour packages through a Lit adapter

**Superseded on 2026-09-19 by [native Lit behaviour ports using TanStack Store](zag-behaviour-ports.md).** Peter no longer wants a Zag adapter or Zag machine/state runtime. The five control capability choices remain. The text below preserves the previous decision and its research; it is not the current implementation instruction.

Use Zag as an actual dependency for the selected Pin Input, Number Input, Scroll Area and Steps controls. Peter confirmed this after clarifying that the proposal was package use, not copying Zag's code or treating it only as a reference. This does not authorize moving other components onto Zag.

The later Phase 1 foundation review explicitly adds [resizable panes using @zag-js/splitter](resizable-panes.md), making five selected controls. Its own decision records the required corrections, optional collapse and application-owned preference saving. This is a scoped addition, not blanket Zag adoption.

Our Lit components own their markup, styling and public interfaces. Our integration connects Zag's interaction rules to Lit updates, DOM properties/events, shadow-root targeting and cleanup. Preserve the existing [TanStack state rule](state-on-tanstack-store.md). Supplying only a controlled value does not establish that all other component state follows that rule; the adapter must resolve state ownership without independently writable copies.

Zag has no documented official Lit adapter. Its [adapter guide](https://zagjs.com/guides/framework-adapters) describes porting an official adapter and mapping its reactive primitives while preserving transition and effect ordering. That is a starting point, not a working integration here. The earlier description of this as a thin wrapper understated the responsibility. The detailed design remains for Phases 3–5.

Acceptance requires per-control tests in Chromium, Firefox and WebKit, including the relevant input, focus, form, resizing, accessibility and disconnect/reconnect cases. Do not report the adapter or its benefits as proven before those checks. No project dependency installation or source implementation starts before the approved Phase 5 migration plan.

Selected controls: [Pin Input](pin-input-behaviour.md), [Number Input](number-input-behaviour.md), [Scroll Area](scroll-area-behaviour.md), [Steps](steps-behaviour.md), and [resizable panes](resizable-panes.md). Evidence: [package investigation](../analysis/package-choices.md).
