# drawer: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 4 time(s), so at least one demo here is interactive.

- [ ] onClick — wired in 2 examples. Our equivalent: 
- [ ] onDismiss — wired in 2 examples. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Accessibility) Trap focus inside the drawer while open and return focus to the trigger on close.
- [ ] (Accessibility) Escape closes the drawer; honor the system back gesture on mobile so users can dismiss without reaching for the close affordance.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Tap-outside and swipe-down dismiss by default; preserve both unless the form has dirty input.
- [ ] (Behavior) Use `verticalScroll` so the drawer body scrolls inside its frame instead of the page behind it.
- [ ] (Behavior) Cap content height with `customHeight` only when the default height clips the primary action; the action and `Cancel` must stay above the fold.
- [ ] (Content) `DrawerTitle` is a Title Case statement that names the entity (`Deployment Details`, `Filter Logs`).
- [ ] (Content) Body is sentence case prose. One primary `Verb + Noun` button and a literal `Cancel`; don’t cram a destructive cascade copy into the smaller frame.
- [ ] (Content) Don’t restate the page heading as the drawer title; name what this view does.
- [ ] (Accessibility) Lock body scroll on open and restore it on close so iOS rubber-band scroll doesn’t leak through.
