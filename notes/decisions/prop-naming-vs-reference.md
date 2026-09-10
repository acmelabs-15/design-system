# Settled: how literally does "API identical" apply to prop names?

Raised and settled 2026-09-10. **Decided by [parity-scope.md](parity-scope.md):** parity covers
style, behaviour and functionality, never implementation, and our API must be self-consistent and
idiomatic for Lit first, familiar to a reference user second.

**Outcome for this case: our naming stands.** `variant` for the visual look, `type` for the HTML
button type. No rename. This file is kept for the evidence it gathered, which is what made the
general rule necessary.

## What was found

The requirement is that every element matches the reference on "styles, states, functionality and
API". Reading the reference's own documentation prose surfaced a case where our API deliberately
differs, and it was never put to Peter.

From `tools/geist/corpus/md/button.md`, the reference team's own words:

> For form submits, use `typeName="submit"`. The HTML `type` attribute lives on `typeName`, not on
> `type`, which controls the visual variant.

So the reference's Button has:

| Purpose | Reference prop | Our prop |
|---|---|---|
| The visual look (secondary, error, warning) | `type` | `variant` |
| The HTML button type (submit, reset) | `typeName` | `type` |

Ours is the more conventional naming, and it is what a web-component consumer would expect, because
`type` on a custom element that renders a `<button>` reads as the HTML attribute. The reference's
own prose calls its arrangement out as a trap, which suggests they consider it unfortunate too.

## The reference is not self-consistent

Counting prop names across all 77 saved reference pages:

- `variant` appears **174 times**
- `type` appears **37 times**

Eight components use `type` for a visual look: button, fieldset, empty-state, menu, multi-select,
progress, snippet, tooltip. Most others use `variant`. Several use both for different things.

So there is no single reference convention to copy. Matching it literally means reproducing its
inconsistency, including a naming choice its own documentation warns readers about.

## Our code today is also mixed

Of those eight, our implementations carry a `type` property on button, fieldset, progress, snippet
and tooltip, and none on empty-state, menu or multi-select. Button is the only clear divergence,
because it is the only one where the reference splits the two meanings across two props.

## The options

1. **Match the reference exactly**, including `typeName`. Highest fidelity to the stated
   requirement. Costs us a prop name the reference itself documents as confusing, and it is a
   breaking change for anyone already using `variant`.
2. **Keep our naming and document the mapping.** Keeps the conventional API. Means "API identical"
   has an explicit, recorded exception, and a consumer porting reference markup must translate.
3. **Match the reference wherever it is consistent, keep ours where the reference contradicts
   itself.** Middle path, but needs a written rule for which is which, or it becomes arbitrary.

## How it was settled

Peter's answer reframed the question rather than picking an option: functional, style and behaviour
parity was never meant to imply implementation parity. The reference is React and ours is Lit, so
the right implementation is the best one for a Lit web component that reaches parity — not a
transcription of React's choices.

That makes option 1 correct here, for a better reason than "it is more conventional": where the
reference contradicts itself, we choose the name that is self-consistent and idiomatic. `variant`
is also the reference's own majority name, so familiarity is preserved too.

The general rule now lives in [parity-scope.md](parity-scope.md) and governs every future case.
