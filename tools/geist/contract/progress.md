# progress: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 2 time(s), so at least one demo here is interactive.

- [ ] onClick — wired in 2 examples. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Accessibility) Component sets `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`; pass an accessible name through `aria-label` on the wrapper or a sibling `<label>` tied with `aria-labelledby`.
- [ ] (Accessibility) Throttle `aria-valuenow` updates to roughly once a second so screen readers don’t announce every increment of a fast upload.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Use `max` for the real ceiling (`max={files.length}`), not a hardcoded `100`. The component computes the percentage from `value / max`.
- [ ] (Behavior) Threshold colors via `dynamic colors` should mirror the same breakpoints used elsewhere (warning at the same threshold a quota note fires).
- [ ] (Behavior) Use stops for genuine multi-stage work and label the stage next to the bar (`Step 2 of 4 · Building`); a stop with no label is decorative noise.
- [ ] (Content) Pair the bar with text naming the work and units: `Uploading 12 of 30 files`, `Building · 1.2 GB / 4 GB`. The bar alone doesn’t say what’s progressing.
- [ ] (Content) Don’t append `successfully` or `complete` once the bar fills; swap to a completion state (toast, success row, redirect).
- [ ] (Content) For long operations, name the work in the surrounding copy (`Building deployment…`) instead of leaving a bare percentage.
- [ ] (Accessibility) Stops accept their own `ariaLabel`; name each one (`Build complete`, `Tests complete`) so the bar is navigable without sight.
