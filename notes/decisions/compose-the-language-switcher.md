# The code block's language switcher composes our own elements

Decided 2026-09-10 by Peter, who asked why the switcher is not our select and the language tabs
are not our switch.

## The decision

`acme-code-block` composes `acme-select` for the `switcher` property and `acme-switch` (of
`acme-switch-control`) for the `tabs` property. It stops building either one inline.

## What was there

Two hand-built controls inside the code block:

- **The switcher**: a `.switcher` wrapper, a visible `.face` div holding the current label and a
  chevron glyph, and a bare `<select>` at `opacity: 0` layered over it. Plus an `Interaction`
  controller and a `@query` to drive the face's hover and focus states, and a whole generated
  stylesheet, `code-block-switcher.styles.ts`, from a map of its own.
- **The tabs**: an `acme-tabs` of `acme-tab`.

## Why this is not the same question as parity

The reference builds the switcher by hand too. I checked the spec rather than assume:
`data-geist-select` is zero across all nine examples of the code-block page, and their switcher is
the same wrapper, face and transparent native select. Their own Select component appears nowhere
on the page.

So our markup already matched theirs. Peter's point is a different one, and it is the same one he
made about the copy button: **our own system should have one answer to "how do you pick from a
list", not three.** Parity governs style, behaviour and functionality. It does not require us to
copy the reference's decision to skip its own component.

The tabs are the clearer case. A language switcher picks one of several mutually exclusive views.
That is what `acme-switch` is for — a segmented selector with radio semantics — and `acme-tabs` is
for panels.

## What it costs

`acme-select` and `acme-switch` render their own internals, so the census will report differences
against the reference's native select and its tab strip. That is the accepted cost of the decision,
not a defect to chase.

## The defect this introduced, and its fix

Composing changed the event contract, and the first version fired twice. The old markup used the
native `change` event, which does not collide. `acme-select` and `acme-switch` both fire
`acme-change` of their own, which bubbles and is composed, so a listener on the code block saw
every language change twice — once from the composed element, once from the block's own re-dispatch.

Caught by a unit test reporting `["lua", "lua"]`. The block now stops the composed element's event
before dispatching its own. Verified in the browser: one event per change, from both controls.

## What was removed, not deprecated

- `src/components/code-block/code-block-switcher.styles.ts`
- `tools/geist/maps/code-block-switcher.ts`
- the `.switcher` wrapper, the `.face` div, the native `<select>`, the `current` lookup, the
  `switcherEl` query and the `switcherInteraction` controller
