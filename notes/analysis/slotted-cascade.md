# Styling slotted content: what the cascade actually allows

Analysis, 2026-09-10. **No decision was taken.** The work that raised it went a different way, and
the question it leaves open is recorded at the end.

## What raised it

The input page reported four differences, all on one icon. The reference's read gray-1000 and ours
gray-700.

Both sides carried the same rule: a wrapper paints its last child gray-700. The icon carries its own
`style="color:currentColor"`. On the reference that inline style wins, so the icon stays gray-1000 —
removing the inline style there drops it to gray-700, the same as ours. Ours won the other way,
because the generator marks such a rule `!important`.

## The mechanism, measured

A shadow-tree rule that styles slotted content loses to the page, and **not because of specificity**.
[CSS Cascade 5 §6.1](https://www.w3.org/TR/css-cascade-5/#cascade-sort) sorts by Origin, then
**Context**, then Element-Attached Styles, then Layers, then Specificity. Context sits above all
three of the others:

> "When comparing two declarations that are sourced from different encapsulation contexts, then for
> normal rules the declaration from the outer context wins, and for important rules the declaration
> from the inner context wins."

Measured in a clean document, for a node slotted into a shadow tree:

| Contest | Winner |
|---|---|
| shadow normal vs a page rule at **zero specificity** (`:where(a)`) | **page** |
| shadow normal vs a page rule in a **cascade layer** | **page** |
| shadow **important** vs page normal | shadow |
| shadow important vs page **important** | shadow |
| shadow important vs an author's **inline style** | shadow |
| shadow **normal** vs an author's inline style | inline |
| shadow normal, **no page rule for that property** | shadow |

Two consequences follow, and both were assumptions worth killing:

- **Cascade layers cannot help.** The reference does use them — `base, properties, components, theme,
  utilities` — but that orders its sheet against itself, not across a shadow boundary. I offered
  layering as a fix and Peter chose it; testing it showed it does nothing here.
- **Weakening our own reset with `:where()` cannot help either.** A zero-specificity page rule still
  wins.

`!important` is the only lever, and it is blunt: it also beats the consumer's inline style, which the
reference's plain class does not.

This is a known open CSSWG issue, [#6466](https://github.com/w3c/csswg-drafts/issues/6466), retitled
by Emilio Cobos Álvarez to say so precisely: "the problem with slotted is not the specificity but the
cascade order rules."

## What ten production systems do

Read from source, not from documentation:

| System | `::slotted` rules | with `!important` |
|---|---|---|
| Lion | 33 | 0 |
| Elix | 23 | 0 |
| Fluent UI | 364 | 0 |
| Vaadin | 386 | 26 |
| Spectrum | 347 | 7 |
| Shoelace | 42 | 6 (3 likely inert — invalid selectors) |
| UI5 | 163 | 1 |
| PatternFly | 77 | 16 |
| Nord | 343 | 70 |
| Red Hat | 264 | 89 |

**The split tracks one architectural choice, not taste.** Systems that render the real `<a>` or
`<button>` inside their own shadow root and slot only the text need almost none. Systems that put the
real element in the light DOM need it heavily.

Three fixes exist in production. Only the third is what we do:

1. **Move the element into the shadow tree** — the problem disappears. Most common.
2. **Put the rule in the outer tree** — Red Hat ships mandatory `-lightdom.css` files; Vaadin has a
   `SlotStylesMixin` that injects a `<style>` into the slotted node's own root. This fixes the cause.
3. **`!important`.**

Two refinements to the third, both verified in source:

- **Spectrum's guard**: `slot { font: … }` for the real values, then
  `::slotted(:not([class])) { font: inherit !important }`. One declaration instead of one per
  property, and any class the consumer adds opts them out. Verified in a clean document: a bare link
  takes the component's colour; a classed one takes the consumer's, and so does their inline style.
- **Nord's and Vaadin's rule**: the forced value is always `var(--public-token, …)`, so consumers keep
  an override channel even under `!important`.

## Why no decision was taken

The case that raised it dissolved. The input's affix API was replaced (see
`input-affix-api.md`), and with two named places there is no switched-off cell for a positional rule
to land on. The input page reaches parity with the `!important` untouched.

## What is still open

64 generated rules across 15 elements carry `!important` on slotted content. Measured against our own
page element rules — which set properties on `button`, `input`, `select`, `textarea`, `a`, `h1`–`h4`
and `p`, and nothing else — **11 of the 64 genuinely need it**. The other 53 never meet a page rule,
so their `!important` buys nothing and only costs a consumer their inline style.

Those 11 rules are five distinct contests, all on `note` and `folder`: a link's colour and its
underline, and a button's colour. Re-measured after the input's affix change, which did not move any
of these numbers.

The command that produces them, so the count can be checked rather than trusted: scan every
`*.styles.ts` for a `::slotted` rule carrying `!important`, take the tags inside `::slotted()` and the
properties marked important, and keep the rule where our page sheet sets that property on that tag.

Whether to narrow it, and whether to adopt Spectrum's guard, is undecided.
