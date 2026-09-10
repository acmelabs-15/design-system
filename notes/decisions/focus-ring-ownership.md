# Every element draws its own focus ring

Decided 2026-09-10 by Peter, on the evidence below.

## The decision

Our shipped `tokens.css` carried a page-wide rule:

```css
:focus-visible {
  outline: none;
  box-shadow: var(--ring);
  border-radius: var(--r-sm);
}
```

That rule is gone. An element draws its focus ring in its own styles, or it draws none
and keeps the browser's.

## Why

The reference has no page-wide focus rule of any kind. Two probes on its own page say so:

| Probe on the reference page | Result |
|---|---|
| A plain `<button>`, focused | `outline-style: auto` — the browser's ring |
| A plain `<div tabindex=0>`, focused | `outline-style: auto`, `box-shadow: none` |
| Every selector in every sheet, matched against a page-wide focus shape | None |

Every ring the reference draws is written into the element that draws it. 35 of our
elements already did the same.

`tokens.css` is a published entry point, so the rule reached consumers. Any focusable
thing on their page took our ring and a 6px radius, including the elements the reference
leaves bare. That is a behaviour we shipped and the reference does not have.

## What it also fixed

The census sets a state attribute on a focused root and on every descendant, which is how
a composed child's own state rules fire. A rule with no element part takes every one of
those descendants, so the page-wide ring landed on each icon and span inside a focused
element and the diff reported a ring the element never draws.

Rewriting that rule correctly does not help: the rule genuinely matched, because the
attribute genuinely sat on the icon. The rule itself was the difference.

## The cost, and how it was paid

Dropping the rule risks an element that relied on it and writes no ring of its own. Every
element was checked; the sweep is recorded in the commit alongside this note.

## What would change this

Evidence that the reference does carry a page-wide focus rule after all — a sheet the
mirror snapshot does not hold, or a rule that only appears under an interaction the probes
did not reach.

## The sweep

`tools/geist/rings.js` reads what every keyboard-reachable box shows at rest and under focus, on
either side, and names any box that shows the same thing both times. It drives the state the way the
census does — the `data-focus` attribute, against sheets the census has rewritten — because a script
`focus()` does not make `:focus-visible` match, and the reference's rings key off an attribute that
react-aria sets on real keyboard focus. Reading it any other way reports the reference itself as
having no rings at all.

955 boxes across 98 of our pages were read after the rule was dropped. Every box that shows nothing
on focus was checked against the same box on the reference. Three patterns account for all of them,
and the reference reads the same way in each:

| Pattern | Ours | Reference |
|---|---|---|
| A visually hidden control, ring drawn on a sibling (checkbox, radio, toggle, switch, theme switcher) | silent input | silent `input.sr-only peer`, ring on the peer |
| A field whose ring is drawn on its wrapper (input, select, textarea) | silent control | silent `input`, ring on `[data-geist-input-wrapper]` |
| A row that draws no ring at all (file tree's folder button and file link, json view's row) | silent | silent |

11 of our elements have no reference page at all — chip, fold, item, link-card, page-head, task,
metric, stat-strip, filter, appbar, chart. They are ours rather than the reference's, so the
reference sets no standard for them, and they are left as they are.

No element lost a ring it had. The elements that draw one all key it off `data-focus`, which they set
themselves, and that path never depended on the page-wide rule.
