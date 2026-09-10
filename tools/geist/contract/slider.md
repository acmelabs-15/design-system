# slider: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 11 time(s), so at least one demo here is interactive.

- [ ] onValueChange — wired in 5 examples. Our equivalent: 
- [ ] onValueCommitted — wired in 1 example. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Best Practices) Give the slider an accessible name through a sibling `<label htmlFor>` or `aria-label`, and let the native arrow-key, Page Up/Down, Home/End behavior do the keyboard work. Don’t intercept those keys.

## Guidance — read it, apply judgement, no test

- [ ] (Best Practices) Use a slider for ranged numeric input where shape and proximity matter more than precision: bandwidth caps, opacity, audio volume, color channels.
- [ ] (Best Practices) For exact values like a port number or memory limit, pair the slider with a numeric `Input`; keyboard users default to typing.
- [ ] (Best Practices) Snap to a sensible step (`1`, `5`, `10%`) so dragging never produces values like `47.83291`. Clamp `min` and `max` to real product limits.
- [ ] (Best Practices) Always render the live value next to the track in tabular nums, and label what the number represents (`Sample Rate · 44 kHz`). The track alone is not self-describing.
- [ ] (Best Practices) Threshold colors (warning, error tints past a limit) should match the same numeric breakpoint surfaced elsewhere in the UI; don’t invent a slider-only threshold.
