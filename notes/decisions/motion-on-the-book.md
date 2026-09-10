# The book's hover runs on `@lit-labs/motion`

Decided 2026-09-10 by Peter, who asked for the package to drive the animation and, when I argued it
did not fit, pointed at the demos that show it does.

## What I got wrong, and what the demos settled

I said `animate()` would overwrite the book's `rotateY`. **That is wrong.** `hero.html` shows
`onFrames` replacing the generated keyframes outright, so any transform — 3D included — can be
written there. The directive's own transform is only the default.

I also said the hover could not drive it, because our `Interaction` controller sets `data-hover`
with `setAttribute` and never asks for an update. That half is right and is the real constraint:
`animate()` runs in `hostUpdate` (measure) and `hostUpdated` (play), so **only a Lit render starts
it**. `simple-scaling.html` shows the answer — its click sets a reactive property, and the class
change is a consequence of the render rather than the trigger. Peter's sketch is the same shape:
`@pointerenter` and `@pointerleave` setting reactive state.

## The shape

The cover carries its own `hovered` state **beside** `data-hover`, not instead of it:

- `Interaction` still sets `data-hover` on the root. The 88 generated rules across 34 elements keep
  working, and so does the census, which sets that same attribute to measure a hover state.
- The `.wrap` carries `@pointerenter` / `@pointerleave` and the `animate` directive. The state
  change renders, so the directive fires.
- `onFrames` supplies the two frames, read from the CSS custom properties the reference sets:
  `rotateY(var(--hover-rotate)) scale(var(--hover-scale)) translateX(var(--hover-translate-x))`.

**The CSS rule still holds both states.** The directive animates *between* them and only times the
motion, which is why the census still reads the correct 3D matrix under `data-hover` and parity
holds. That is the load-bearing part of the design: replacing the CSS with script would have broken
the harness that proves the animation is right.

The generated `transition: transform 0.25s ease-out` is turned off in the element's own sheet.
Measured before doing it: both a `CSSTransition` and the directive's `Animation` were running on
`transform` at once.

## The snap Peter found, and its cause

> "when the mouse moves over it and then out very quickly, there's a bit of a snap"

Real, reproduced, and mine. Sampled frame by frame, a leave at 80ms read
`0.145 → 0.177 → 0.207 → 0.236 → 0.262` — the cover kept rotating *further into* the hover before
coming back.

Two faults, found in order:

1. **The reversal started from the wrong place.** My first frame was hard-coded to the full hover, so
   a cover caught at 40% jumped to 100%. Fixed by capturing the live matrix — but it has to be
   captured in the pointer handler, **before** the state flips, because by the time frames are built
   the new state already computes. A first attempt read it inside `onFrames` and froze the cover at
   the full hover for six frames.
2. **The animation in progress was never cancelled.** The directive cancels only when it commits
   styles, never when a new animation starts on the same box, so the old one kept advancing against
   the new one. `turn()` now cancels every animation on the wrap.

After both: `0.175 → 0.156 → 0.138 → 0.120 → 0.104 → 0.089`, monotonically down from exactly where
the pointer left. Verified on a one-frame flick (never leaves rest), on rapid alternation, and with
nothing left running afterwards.

## Verified

- **book and book.dark: 0 hard**, re-measured with the directive in place, not against the old
  saved run.
- 606 tests, two of them new. The cancel test is proven by removing the cancel and watching it fail.
- The bundle grows 14KB, which is the package's cost and its first use in the project.

## What this does not settle

`animate()` still fits the two patterns PLAN.md 5.6 names — a box whose size changes (collapse), and
things entering and leaving. The book is a third shape: a transform on an attribute-driven state,
which needed the reactive-state bridge above. Any element that follows needs the same bridge, or it
needs its state to be reactive already.

The package carries a Lit Labs warning: breaking changes or discontinued support. One element
depends on it today.
