# scroller: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Accessibility) Tab order follows DOM order, so place items in reading order regardless of visual scroll direction.
- [ ] (Accessibility) Scroller buttons need `aria-label`s that name the direction and content (`Scroll customer logos left`), not bare `Previous`/`Next`.
- [ ] (Accessibility) Make sure focusing an off-screen item scrolls it into view; the default browser behavior covers this, but custom focus traps can break it.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Auto-scroll buttons target direct children only. If items are wrapped in extra layout nodes the buttons won’t find their target.
- [ ] (Behavior) Show edge fade or shadow affordances on the clipped axis so users see there’s more content past the viewport.
- [ ] (Behavior) Keep item widths and gaps consistent in horizontal scrollers; ragged edges break the snap rhythm and make the rail feel broken.
