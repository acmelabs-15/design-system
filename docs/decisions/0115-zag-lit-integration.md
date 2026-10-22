# Superseded: Zag behaviour packages through a Lit adapter

The original decision used Zag packages through a Lit adapter for five selected controls. Peter superseded that runtime strategy on 2026-09-19 with [native Lit behavior ports using TanStack Store](0114-zag-behaviour-ports.md). The five control capabilities remain selected; the adapter and Zag machine/state runtime do not.

Decided 2026-09-19 by Peter; superseded the same day.

## Original decision and scope

Peter originally confirmed actual Zag dependency use for Pin Input, Number Input, Scroll Area and Steps. He distinguished package use from copying Zag code or using it only as a reference. That choice did not authorize moving other components onto Zag.

The later Phase 1 foundation review added [resizable panes using @zag-js/splitter](0084-resizable-panes.md), making five controls. Its decision recorded required corrections, optional collapse and application-owned preference saving. This was a scoped addition, not blanket Zag adoption.

The proposed Lit components owned markup, styling and public interfaces. The adapter would connect Zag interaction rules to Lit updates, DOM properties/events, shadow-root targeting and cleanup. It was required to preserve the [TanStack state rule](0101-state-on-tanstack-store.md), without independently writable copies. A controlled value alone did not establish ownership of all other component state.

## Research and limits

The 2026-09-19 investigation found no documented official Lit adapter. The [adapter guide](https://zagjs.com/guides/framework-adapters) described porting an official adapter and mapping reactive primitives while preserving transition and effect ordering. It was a starting point, not a working integration. The earlier “thin wrapper” description understated the work. Detailed design was left to the then-planned Phases 3–5.

Acceptance would have required each control's relevant input, focus, form, resizing, accessibility and disconnect/reconnect cases in Chromium, Firefox and WebKit. Neither the adapter nor its benefits had been proved. Dependency installation and implementation awaited the Phase 5 migration approval. The later native-port choice supersedes this entire runtime plan; those phase gates are historical.

Selected capabilities: [Pin Input](0078-pin-input-behaviour.md), [Number Input](0071-number-input-behaviour.md), [Scroll Area](0089-scroll-area-behaviour.md), [Steps](0103-steps-behaviour.md), and [resizable panes](0084-resizable-panes.md). Evidence: [package investigation](../research/16-package-choices.md).
