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


## What the Chrome traces showed (2026-09-10)

Peter recorded two traces in Chrome. The second one caught the hover — 30 `pointerenter` events —
and it names a cause the first could not.

### The first trace measured page load, not the hover

Zero mentions of the animation, four pointer dispatches, none producing one. Its headline was a
422ms LCP render delay, and splitting the script time by origin shows why that is not ours to fix:

| Source | Main-thread script time |
|---|---|
| Browser extensions | **171 ms** |
| Ours (`localhost:4180`) | **32 ms** |
| Unattributed | 28 ms |

1Password, React DevTools and two colour pickers cost five times our own code. Rendering itself is
cheap: layout 29ms, paint 29ms, style 22ms across the whole load. The one finding that is genuinely
ours — the docs page loads a single 1.3MB `app.js` with every element in it — is about the docs
site's loading strategy, not the package a consumer installs.

### The second trace: a 350ms layer commit on hover

The DevTools report led with INP 4,497ms, but its own breakdown reads **input delay 3,497ms,
processing 3ms**. Our handler took 3ms. The long wait is on the **Compositor** thread and contains
only short GPU tasks — an idle wait between the recording starting and the click, not blocking work.

The real finding is on the main thread: ten `Commit` → `UpdateLayer` tasks of 350–540ms, and **five
of them land within 1ms of a `pointerenter`**. Each carries a different `layerId`, so a new layer is
built per hover and discarded after. That is the hitch.

**Why:** the cover is a `preserve-3d` subtree under a `perspective`, and nothing told the browser
the transform was going to move, so it built the 3D layer tree on demand every time.
`will-change: transform` on `.wrap` keeps it between hovers. The package's own hero demo does the
same on its animated boxes.

### One reading of mine that was wrong, and how

I first measured frame gaps with `AnimationFrame::Presentation` and reported a 133ms gap as the
jerk. That is main-thread rAF, and our animation runs on the compositor: during that same gap the
trace shows **16 compositor frames submitted and presented**. Measuring `PipelineReporter` instead —
real presented frames — the worst gap during any hover is **17.5 ms**, a steady 60fps.

So the animation itself never dropped a frame. What Peter feels is the layer commit that fires
alongside it.

**Verified after the change:** 608 tests pass; book and book.dark hold at 0 hard, re-measured
(`will-change` does not alter a computed-style reading).

### `will-change` is NOT proven to fix it (2026-09-10)

With a Chrome DevTools MCP available I recorded my own A/B: 16 hovers with the change, 16 without,
same page, same driver.

| | worst `Commit` | main tasks >100ms | worst frame gap |
|---|---|---|---|
| Without `will-change` | **0.4 ms** | 0 | 17.4 ms |
| With `will-change` | 1.4 ms | 0 | 17.6 ms |

**The control shows no layer commit either.** So `will-change` did not fix what Peter's trace
showed — that environment simply does not reproduce here. His Chrome recorded a 4,253 ms `Commit`;
mine records 0.4 ms on the identical page.

What differs: his session carried **six browser extensions** and 145 wheel events (scrolling while
hovering); the MCP's Chrome has none of either. Scrolling is not the cause — the long commits
correlate with `pointerenter` (five within 1ms) far more than with wheel (two).

`will-change: transform` is kept because it is the correct hint for a `preserve-3d` box whose
transform animates, and the motion package's own demos use it. But it is **an unproven fix for the
hitch**, and saying otherwise would be wrong.

### Measured in Peter's own Chrome (2026-09-10)

Peter started Chrome with `--remote-debugging-port=9222`, so the same A/B ran against his browser
over CDP with real `Input.dispatchMouseEvent` moves — 16 hovers each way, over four books.

| | trace events | `Commit` total | `UpdateLayer` count | main tasks >50ms |
|---|---|---|---|---|
| Without `will-change` | 109,421 | **123.2 ms** | **13,880** | 0 |
| With `will-change` | 36,925 | **64.9 ms** | **5,285** | 0 |

So the hint does real work: **half the commit time and a third of the layer updates**, on the same
machine. That is worth keeping on its own merit.

It still does **not** reproduce the hitch. Neither run has a single main-thread task over 50ms,
where Peter's original trace had ten of 350–540ms. The profile is the difference: he launched with
`--user-data-dir=/tmp/chrome-profile-stable`, a clean profile with **zero extension targets**, while
the session that showed the hitch carried six extensions.

**The open question is now narrow:** whether those 350ms commits are the extensions or the element.
Answering it needs a trace from the everyday profile, with the extensions loaded and this build in
place.
