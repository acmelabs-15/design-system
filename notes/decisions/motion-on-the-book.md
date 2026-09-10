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


## The gesture is one store, and the frames derive from it (2026-09-10)

Peter, on reading the first version: the store "excels where it keeps track of a state, and then the
way that state changes is by using a derived function, which is what a lot of these values are."

He is right, and my first answer was too narrow. I said the book had no derived values because
`coverFrames` was a plain function rather than a derived store — which is true of the code as
written and misses that it *should* have been one. `hovered` and the captured matrix are not two
fields: they are one gesture, written together in one handler and read together to decide the
frames.

So it is now the shape `acme-destructive-modal` already uses — a store of related fields plus a
derived store computed from it:

```ts
private gesture = createStore({ hovered: false, from: undefined as string | undefined });
private coverFrames = createStore(() => {
  const { hovered, from } = this.gesture.get();
  return [{ transform: from ?? (hovered ? rest : lifted) }, { transform: hovered ? lifted : rest }];
});
private gestureSelector = new StoreSelector(this, () => this.gesture, (g) => g.hovered);
```

Two things this buys beyond tidiness:

- **The reasoning moved.** Which frames to use is now a value the element derives, not a decision
  taken inside the directive's callback. `onFrames` reads it and nothing else.
- **The selector takes a slice.** `TanStackStoreSelector`'s third argument is a selector function
  (the shape Peter's Lit example shows), so the element re-renders on `hovered` alone. The captured
  matrix changes on every turn too, but it is read by the frames rather than rendered, and
  subscribing to the whole store would ask for an update the markup does not need.

The write stays a single `setState`, which keeps the capture-then-flip ordering that fixed the snap:
the matrix and the direction land together, so there is no window where one is new and the other
old.

**Verified after the change:** book and book.dark still 0 hard, re-measured; the quick in-and-out
still reads `0.175 → 0.156 → 0.138 → 0.120 → 0.104 → 0.088`, monotonically down with no overshoot;
606 tests pass. The frames test is proven by breaking the derivation and watching it fail.


## The final shape, from Peter (2026-09-10)

Peter rewrote the element. Three things his version does that mine did not:

**The transition is an action on the store.** `createStore(value, actions)` is a documented overload
I had not used. The gesture's one transition lives with the state it changes:

```ts
private gesture = createStore(AT_REST, ({ setState }) => ({
  turn: (hovered, from) => setState((g) => (g.hovered === hovered ? g : { hovered, from })),
}));
```

That also buys a **no-op guard**: a repeat of the current direction returns the *same object*, which
the store's compare drops, so nothing downstream moves — no recapture of the caught matrix, no dirty
frames, no update. Verified in the browser: a repeated `pointerleave` leaves `gesture.get()`
identical by reference; a real turn does not. Mine recaptured on every repeat.

**An `AnimateController` holds the options, and `cancel()` is its own.** The controller registers the
directive, so `motion.cancel()` cancels what it started rather than sweeping `wrap.getAnimations()`
for anything that happens to be running.

**A `StoreEffect` runs the cancel.** New in `src/shared/state.ts`: a reactive controller for a store
change whose consequence is *not* a render. `StoreSelector` re-renders; this is its counterpart, and
the subscription follows the host's life, so no element keeps a `Subscription` field and a
`disconnectedCallback` to tear one down. Three places already hand-roll that — collapse-group,
toaster, and the theme — and can move onto it later.

The effect runs inside `setState`, before Lit's update, and `from` was measured before the write, so
the box is caught mid-flight and then released.

### One correction to his version

`TanStackStoreSelector` exposes **no `.value`** — only `hostUpdate` and `hostDisconnected`.
`TanStackStoreAtom` is the one with a value. So the guard reads `this.gesture.get().hovered`
directly, and the selector is held for its subscription alone.

**Verified:** book and book.dark 0 hard, re-measured. The quick in-and-out reads
`0.175 → 0.155 → 0.137 → 0.120 → 0.104 → 0.088`, monotonically down. 607 tests, three of them for
this element's state, each proven by removing the behaviour it covers.


## The hitch on hover-in, and where the pointer bindings belong (2026-09-10)

Peter, testing in Chrome rather than the preview pane: "whenever I open in Chrome, there's a jerk at
the start."

**Real, and mine.** `Interaction` sets `data-hover` on the root the instant a pointer arrives, and
the generated rule puts the FULL hover transform on that attribute. With the CSS transition off, the
cover snapped straight to the far state and the directive then animated something already finished.

Worse, `caught()` read the box *after* the attribute had applied, so the matrix it captured was the
hover state, not the rest state — the first keyframe and the last were the same.

**Why I did not see it.** My tests dispatched `pointerenter` on `.wrap`, where `Interaction` has no
listener, so `data-hover` was never set. I was testing a path a real mouse never takes. The preview
pane looked right for the same reason.

### The fix, from Peter

The pointer bindings move to the **root**, beside `Interaction`'s. Lit registers a template listener
during the first render; `Interaction.attach` runs in `updated`, after. On the same element the
earlier registration fires first, so `caught()` reads the box before the attribute flips it.

The `transition: none` stays, and its comment is now accurate: two animations racing for the first
frame is the hitch, and with the transition off the rules only HOLD the two states — which is what
the census reads — while the directive travels between them.

Measured on the real path, dispatching on the root so both handlers run:

| Gesture | Frames |
|---|---|
| Hover in | `0 → 0.077 → 0.143 → 0.177 → 0.236 → 0.262 → 0.308 → 0.327`, settling on the reference matrix |
| Leave | `0.324 → 0.286 → 0.216 → 0.185 → 0.125 → 0.100 → 0.055`, back to rest |
| Quick in-out at 0.176 | reverses with no overshoot, nothing left running |

The three motion tests now dispatch on the root too, and a fourth covers the ordering: it fails when
`caught()` returns the far state, which is the defect itself. 608 tests; book and book.dark 0 hard,
re-measured.

**The lesson worth keeping:** a synthetic event on the element you are animating is not the gesture.
Dispatch where the real pointer lands, or the handler you are not testing is the one that breaks it.
