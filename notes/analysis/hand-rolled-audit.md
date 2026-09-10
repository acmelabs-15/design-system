# Audit: what we hand-rolled that a package could own

Started 2026-09-10. Linked from `PLAN.md`. Living document: add a row when you notice one.

Peter's standing instruction: for anything on the complex side, use a well-regarded package rather
than a hand-rolled implementation, and research what the community holds in high regard before
choosing — including checking whether a popular older package has been superseded by something
smaller and more modern.

This file records what we currently hand-roll, so the choice is deliberate rather than accidental.
**A row here is not automatically a defect.** Sometimes a 70-line controller genuinely beats a 40 KB
dependency, and where that is the judgement, the row says so with the reason.

## Found so far

| What | Where | Lines | Assessment |
|---|---|---|---|
| Fuzzy match and rank for the combobox filter | `src/shared/match-sorter.ts` | 117 | **Research a package.** This reimplements a known algorithm. The reference uses `match-sorter` here. Candidates to compare on size and speed: `match-sorter`, `uFuzzy`, `fuzzysort`, `fuse.js`. Decide on evidence, not familiarity. |
| Command-palette scoring | `src/shared/command-score.ts` | 112 | **Keep, with a note.** This is deliberately vendored from `cmdk`, which is what the reference uses, so it is parity-driven rather than invented. Revisit only if `cmdk` ships a framework-agnostic scorer. |
| Interaction states (hover, focus, active) | `src/shared/interaction.ts` | 79 | **Probably keep.** Small, specific to our data-attribute contract, and no dependency does exactly this. Confirm against Zag or Ariakit primitives before settling. |
| Roving tabindex | `src/shared/roving-tabindex.ts` | 72 | **Probably keep.** Same reasoning. Compare against `tabbable` and Zag's focus primitives first. |
| ~~Shared state~~ | `src/shared/state.ts` | 166 | **Already correct — my earlier row was wrong, and Peter caught it.** It uses TanStack Store (`createStore`, `TanStackStoreSelector`), the chosen tool, which is signal-based underneath. What *was* wrong: `appbar` still wrapped itself in `@lit-labs/signals`' `SignalWatcher` while using no signals at all, a leftover from before the decision. Removed with the dependency: 24 KB off the minified bundle. |
| Height animation | `src/components/collapse/collapse.ts` | — | **Convert to `@lit-labs/motion`.** It measures the body with `getBoundingClientRect` and drives an inline pixel height, which is exactly what the `animate` directive does properly. |
| Enter and exit animation | modal, drawer, sheet, toast, tooltip, context-card, command-menu, feedback | — | **Convert to `@lit-labs/motion`.** Each hand-rolls a transition plus `getAnimations()` bookkeeping to hold the exit open. |
| Key handling | 20 elements add their own `keydown` listeners | — | **Judge case by case.** TanStack hotkeys is the chosen tool, but a single key on a single control is not a hotkeys case. Convert where a real shortcut or a key map is involved. |
| Raw timers | 20 elements use `setTimeout` directly | — | **Judge case by case.** TanStack pacer owns debounce, throttle, queue and batch. A one-shot delay is not a pacer case. |

## Two open architectural questions

Both are large enough that they need Peter, and both are being researched rather than guessed:

1. **How much of Zag.js should we adopt?** We already use one Zag package for scroll lock. Zag ships
   framework-agnostic state machines for menus, combobox, dialog, tabs and slider, with a Lit adapter.
   That is exactly the surface we are building. Against it: our target is parity with a specific
   reference implementation, and adopting someone else's state machine could pull behaviour away from
   the reference rather than toward it. This needs a real argument on both sides before any adoption.
2. **Does native `Temporal` change the date story?** We use `@internationalized/date`. If `Temporal`
   is broadly available, the calculus changes.

## How to use this file

When you touch an element and notice it hand-rolling something substantial, add a row. State what it
does, how many lines, and your assessment with a reason. Then research before converting: the point
is the best implementation, not the fewest dependencies or the most.
