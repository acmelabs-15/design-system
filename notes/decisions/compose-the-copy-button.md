# One copy button, composed, not four

Decided 2026-09-10 by Peter, who noticed that code-block builds its own button instead of using
the one we already have.

## The decision

`code-block`, `snippet` and `brands` compose `acme-copy-button`. They stop building an
`acme-button` inline and stop carrying their own clipboard logic.

## What was there

Four implementations of the same thing. Each of the three carried, inline:

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
outer tree's**, whatever the specificity. The same rule that governs slotted content; see
`../analysis/slotted-cascade.md`.

Composing changes which tree the icon lives in, so the defect is expected to dissolve rather than
need a cascade workaround. That is checked per element rather than assumed.

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


## All three are done (2026-09-10)

`snippet`, `code-block` and `brands` all compose `acme-copy-button`. None of them builds a button,
writes to the clipboard, runs a timer or fires `acme-copy` of its own any more.

`brands` was the last and the only one that needed a different handoff. The other two bind
`text-to-copy` in the template, because their text comes from properties. Brands computes its text
from the **rendered** frame — `markup()` reads `this.frame` — which does not exist during the render
that would bind the property, so a bound value is empty on first paint. The text is handed over when
the press starts instead, on `pointerdown` and on `keydown`, and `copy()` reads `textToCopy` at call
time. Both paths have a test, proven by breaking the handoff.

### One thing composing did not cause, and one it could not fix

**Found while composing, pre-existing:** the copy button escaped its box entirely, landing at -96 top
and -278 right on our docs page, because `.brands` was `position: static` and the absolute button
resolved against whatever ancestor happened to be positioned. Measured identically on the commit
before this one, so composing exposed it rather than caused it. The reference resolves the same
button against *their docs page's* wrapper, which is `position: relative` — page furniture we cannot
rely on, so `.brands` is now the positioning context. The button sits 16px from the box's top and
right, matching the reference's inset.

**Left alone:** `acme-brands` cannot expose the `copy()` method the other two have, because `copy` is
already its public boolean attribute (the one that shows the button, used throughout its docs page).
One word, two meanings. Renaming a documented attribute is a decision of its own, so it is not made
here.
