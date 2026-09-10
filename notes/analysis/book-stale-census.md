# Book's 142 differences are a stale measurement, and re-running it needs a settling step

Investigated 2026-09-10. **No element defect found.** The work stopped at a tooling gap, not a
verdict.

## What the saved census says

142 hard differences over 21 roots, split evenly between the base and `data-hover` passes, and
concentrated on **three roots**: example 3, "Custom icon". Those three carry every difference on
`band`, `bandIllustration`, `bandBind`, `body`, `bodyBind`, `content` and `icon`. The rest of the
page differs only on the two accepted wrapper-box entries.

The shape of it: the band reads 4px **too tall** and the body 4px **too short**, summing to the same
total, so one boundary is misplaced — and `icon.height` reads 20px against our 16px.

## What the live reference actually renders

Measured on the mirror, root 6 of 21 (the first custom-icon book):

| Part | Saved reference reading | Live reference | Ours |
|---|---|---|---|
| `icon` | 16×**20** | 16×**16** | 16×16 |
| `body` | 196×**109** | 196×**105** | 196×105 |
| `band` | 196×131 | (animating, see below) | 196×135 |

**Our values match the live reference. The saved reading does not.** The reference's page changed
after that census was taken, exactly as it did for badge, where their demo markup gained a
`class="relative"` the captured spec has never had.

One real difference remains, and it is expected: the reference's custom icon is an `<img>` logo pair
(a light and a dark file, one hidden), while ours is an inline `<svg>`. That accounts for
`color: transparent`, `aspect-ratio: auto 16/16`, `overflow: clip` and a border on their side. Both
render 16×16.

## Why re-measuring did not work, twice

1. **First attempt, 345 hard.** My `icon` part was `[slot=icon]`, which finds an icon only on the
   three books that slot one. Our book renders a slot with a **fallback svg beside it**, so the other
   eighteen read "missing on ours". The correct selector is `.content svg, .content img` on both
   sides — verified to find exactly one icon on all 21 roots per side, pairing root for root
   including the 36×56 illustration at index 1.

2. **Second attempt, 365 hard.** With the selector fixed, the `data-hover` pass caught the book
   **mid-animation**: the reference's band read
   `matrix3d(1.00171, 0, 0.364593, …)` against our identity matrix, and its rect read 195×266 against
   our 195×149. `book.styles.ts:77` is `transition: transform 0.25s ease-out`, and the census sets
   the state attribute, forces one synchronous reflow and reads immediately. The saved run captured
   the identity matrix, so it read the settled state; mine read the transition in flight.

Both attempts overwrote the saved results. A copy under `/tmp` restored them both times — the same
lesson already standing in `PLAN.md` after split-button, earned again here.

## What this needs

A census that waits for a transition to finish before reading a state, or a per-page way to say
"this root animates; settle for 250ms". The census deliberately avoids `setTimeout` because the
Browser pane may be hidden and timers do not fire there, so this is a real gap rather than an
oversight — the runbook says as much at step 6.

Until then book's 142 stand as a stale measurement with the cause known, not as element defects.
`book.config.json` is written and correct apart from that settling step, so a future run starts from
a verified config rather than a reconstruction.
