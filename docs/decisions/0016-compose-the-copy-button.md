# One copy button, composed, not four

Code Block and Snippet compose one Copy Button to share clipboard behavior and feedback. This record preserves the 2026-09-10 decision, the defect that prompted it and the completed Brands removal; the old property spellings below describe that implementation.

Decided 2026-09-10 by Peter, who noticed that code-block builds its own button instead of using
the one we already have.

## The decision

`code-block`, `snippet` and `brands` compose `acme-copy-button`. They stop building an
`acme-button` inline and stop carrying their own clipboard logic.

## What was there

Four implementations of the same behavior. Each of the three carried, inline:

- the same template — an `acme-button`, `svg-only`, holding a two-icon stack of check and copy,
  plus a screen-reader status region
- the same clipboard write, the same one-second timer, the same `acme-copy` event

`acme-copy-button` implements all of it, and already carries every property the three need:
`variant`, `shape`, `size`, `label`, `copied`, `text-to-copy`, and the three colour overrides.

**Nothing composed it.** It was used by no element and no docs page.

## The evidence that composing is also parity

The reference composes. Its copy button carries `data-testid="copy/button"`, and that marker appears
on all three pages:

| Reference page | Copy buttons marked `copy/button` |
|---|---|
| code-block | 11 |
| snippet | 13 |
| brands | 57 |

One shared component throughout. Ours had diverged from that, so this is not only better
engineering — it is what we are porting.

## What raised it

A real styling defect on the code block. Its copy icon renders gray-1000 where the reference's
renders gray-900, and it is visible: the icon in a filename bar is darker than it should be.

The cause is the cascade across shadow trees. The reference puts two classes on that button — its
own tertiary colour, and `text-gray-900!` on top — and in React both sit in one cascade, so the
important wins. Ours cannot: the tertiary colour lives inside `acme-button`'s shadow root as
`!important`, code-block's rule sits outside it, and **an inner tree's important always beats an
outer tree's**, whatever the specificity. The same rule that governs slotted content; see the
[slotted cascade analysis](../research/19-slotted-cascade.md).

Composing changes which tree the icon lives in, so the defect is expected to dissolve rather than
need a cascade workaround. That expectation required per-element checks; it was not assumed.

## The narrower fix that was not taken

A plain descendant rule in code-block's own tree reaches the icon and works, verified in the
browser, with no `!important` and no custom property:

```css
.code-block .bar .actions acme-button svg { color: var(--ds-gray-900) }
```

It fixes the symptom on one page and leaves four implementations of one button. Peter chose the
composition.

## What would change this

An element that needs a copy button `acme-copy-button` cannot express. That is a reason to widen its
API, not to build a fourth one.



## Where this landed (2026-09-10)

`snippet` and `code-block` compose `acme-copy-button`. Neither builds a button, writes to the
clipboard, runs a timer or fires `acme-copy` of its own any more.

**The third element, `brands`, was composed and then deleted.** Peter removed it the same day: it
ports Vercel's own trademarks — their wordmarks, Next.js, Turbo, Turbopack, v0 — and this is the
design system; their trademarks are outside its scope. The element, its 20 trademark assets, its map, spec, census
and docs page are gone. `book-texture.avif` stays, because `acme-book` uses it.

Two findings from that work outlived the element and were recorded in the [port plan](../history/parity-port-plan.md):

- An element owns its own positioning context. Brands' copy button escaped its box entirely, to -96
  top and -278 right, because `.brands` was `position: static` and the reference resolves the same
  button against *their docs page's* `relative` wrapper. Page furniture we cannot rely on.
- An element whose copy text is computed from rendered DOM cannot bind `text-to-copy` in the
  template; it hands the text over at press time, because `copy()` reads the property at call time.
  No element needed that pattern at the time, but the constraint is real for the next one that does.
