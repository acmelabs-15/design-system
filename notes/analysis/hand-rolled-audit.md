# Audit: what we hand-rolled that a package could own

The 2026-09-19 recheck supersedes older counts and the claim below that Zag supplies a Lit adapter. The current decision is [native Lit behaviour ports using the full house stack](../decisions/zag-behaviour-ports.md) for Pin Input, Number Input, Scroll Area, Steps and resizable panes; the earlier actual-Zag runtime/adapter choice is superseded. Zag remains a source reference. [Published match-sorter](../decisions/match-sorter.md) is also selected. These are migration decisions; source code is unchanged.

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

## Systematization recheck, 2026-09-19

| Location | Category | Issue | Occurrences |
|---|---|---|---|
| `src/components/calendar/calendar.ts:31`, `:149`, `:265` | Date arithmetic | Uses native Date throughout instead of the mandated internationalized/date package. The selected timezone is included in the event, while the inspected arithmetic uses local Date fields. Cross-timezone behaviour still needs browser verification. | 1 element |
| `src/components/calendar/calendar.ts:192` | Placement | Positions the popover with manual viewport clamping and resize/scroll listeners instead of Floating UI. | 1 element |
| combobox, feedback, menu, multi-select, split-button, tooltip | Placement lifecycle | Each has one `computePosition` call site and its own `autoUpdate` setup/cleanup. The old statement that each calls it twice is inaccurate for this checkout. | 6 elements, 6 call sites |
| `src/shared/overlay.ts:8` | Unused abstraction | The abstract Overlay class writes body overflow directly. No element extends it; imports only use its `reduced` helper. Do not count its implementation as the active overlay behaviour. | 1 class |
| `src/components/markdown/markdown.ts:18`; `src/shared/highlight.ts:15` | Highlighting | Two highlighters use different language lists. TanStack Highlight is already integrated; the question is shared configuration and loading. | 2 configurations |

Official sources read:

- [Internationalized Date](https://react-aria.adobe.com/internationalized/date/): immutable date types, explicit timezone conversion, and calendar arithmetic are capabilities of the already-mandated package. Calendar is an integration gap, not a reason to choose another date package.
- [Floating UI autoUpdate](https://floating-ui.com/docs/autoUpdate): positioning updates must follow the floating surface's mounted/open lifetime and clean up when it closes. A shared Lit controller is a candidate shape; differences in anchor choice, middleware, size, and focus policy need auditing before consolidating it.

The complete per-package review below extends these initial findings.

## Phase 1.3: mandated-package responsibility audit

Checked 2026-09-19 against imports, the actual shared adapters, affected component bodies and the isolated build. **Recommendation: finish integrations and share their lifecycle glue; retain the selected stack.** A package's presence is not proof that each relevant element uses it.

| Required owner | Current use | Gap or retained responsibility | Proposed integration shape |
|---|---|---|---|
| TanStack Store | 129 atomState fields in 52 source files, derived stores, theme/toast state | Copy-button's plain public property does not invalidate a derived store; docs app still has four Lit state fields | Per-instance state plus one deliberate bridge from public inputs; StoreEffect for side effects, no second writable state copy |
| TanStack Virtual | Table's virtualized rows | Long option lists need requirements and measured thresholds before a second integration | Shared list adapter only where long-list behaviour requires it; keep table's working path |
| TanStack Pacer | Scroller's Debouncer | Tooltip's resize timer and menu's typed-buffer reset are candidates for debounce ownership; dismissal/exit one-shot delays are different | Lifecycle-aware debouncer wrapper; cancel on disconnect |
| TanStack Highlight | Shared code highlighter and a second Markdown highlighter | Different language lists and duplicate configuration | One configuration/provider, with optional language bundles; Markdown uses the documented adapter |
| TanStack Markdown | Markdown renderHtml with Highlight adapter | Canonical Markdown rebuild is already decided; preserve that engine | A Lit renderer with explicit trusted-HTML policy and composition, not a parser rewrite |
| TanStack Form | Shared bind directive and docs form demo | Native custom-element validity/disabled behaviour differs across controls; field contracts need consistency | Keep Form controller + bind directive; add consistent native form-control lifecycle below it |
| TanStack Charts | Chart wraps defineChart/mountChart/update/destroy | Current invented chart interface is not canonical; heavy root import is measurable | Canonical Chart wrapper with explicit lifecycle and separate entry; standalone Trend is removed and change display belongs to the selected Stat family |
| TanStack Hotkeys | Command menu shortcut integration | Audit actual global shortcuts; arrow navigation within widgets is an accessibility pattern, not automatically a global hotkey | Keep hotkey controller for shortcuts, RovingTabindex/widget rules for directional navigation |
| Floating UI DOM | Six elements each own computePosition + autoUpdate | Calendar hand-rolls positioning; setup/cleanup repeated across overlays | Shared placement controller with explicit anchor, middleware, width and cleanup options |
| Native dialog/Popover API | Modal, drawer, command menu and other overlays use platform surfaces | Behaviour policy still duplicated; old Overlay base is unused | Shared open/close lifecycle, with modal and non-modal policies kept distinct |
| Zag remove-scroll | Five importing elements | Scroll-lock lifetime needs to follow actual modal ownership and nesting | Shared modal lifecycle controller; do not replace it with body.style.overflow |
| internationalized/date | Relative Time uses it | Calendar still uses Date arithmetic, local date fields and manual timezone payload handling | Date conversion/arithmetic helpers shared by calendar/date controls; state stays in the element's store |
| Lit Motion | Book | Collapse height and overlay entry/exit still hand-managed | Shared motion policy/directive integration, as proposed in animation-package.md |
| Lit Router | Docs app Router and fragment routes | HTML is route-loaded; component JavaScript is not | Preserve Router; add route dependency metadata and cleanup-aware examples |
| Lit Compiler | Build transpiles 128 template-bearing modules | Compiled output fails the Lit SSR control test | Keep client compilation; a separate server-compatible entry only if SSR is approved |
| Vendored command-score | Command menu ranking | No new gap established | Retain the selected scorer and its provenance; do not silently swap in combobox filtering |
| Interaction and RovingTabindex | Shared native-event/keyboard helpers | Reconnect, focus and disabled semantics still need browser coverage | Preserve their small interfaces; consolidate callers only after inventory requirements are known |

Package/function evidence is directly present in `src/shared/{state,atom-state,form,highlight,interaction,roving-tabindex}.ts`, `src/components/{table,scroller,markdown,chart,command-menu,calendar,relative-time,book}/*`, and `docs-src/app/docs-app.ts`. Version-pinned manifests are recorded in the source baseline. The old Overlay class is not a consumer of the production modal path; imports from its module use the reduced-motion helper.

External checks: [Lit controller lifecycle](https://lit.dev/docs/composition/controllers/), [Floating UI open-only autoUpdate](https://floating-ui.com/docs/autoUpdate), [Internationalized Date responsibilities](https://react-aria.adobe.com/internationalized/date/), [Lit Motion entry/exit and layout hooks](https://github.com/lit/lit/tree/main/packages/labs/motion), and [CEM inheritance metadata](https://custom-elements-manifest.open-wc.org/analyzer/getting-started/). These inform adapter shape; the project's selected packages remain authoritative.

Each integration must enter the Phase 4 inventory and Phase 5 batch plan with browser acceptance cases where layout, form association, focus or motion is involved. This investigation does not authorize swapping packages or fixing the source before those approvals.
