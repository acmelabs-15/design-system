# gauge: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Accessibility) The component sets `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`. Don’t override those.

## Read and judge — names an observable, but also carries guidance

- [ ] (Accessibility) The adjacent label is the gauge’s accessible name. Tie it with `aria-labelledby` on the gauge wrapper so screen readers read “Uptime, 99 percent.”

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Use `arc="equal"` for true ratios so 50% reads as exactly half. Use the default `primary` arc for single-percentage usage where the filled portion is the story.
- [ ] (Behavior) Threshold colors should match the same numeric breakpoints used elsewhere in the product (`>=80%` warning, `>=95%` error). Don’t invent gauge-only thresholds.
- [ ] (Behavior) Pair `indeterminate` with explanatory copy nearby (`Calculating usage…`) so the user knows the value is loading, not zero.
- [ ] (Content) Always pair the gauge with an adjacent label or `Tooltip` naming what the number represents (`Build Cache Hit Rate`). The gauge alone is not self-describing.
- [ ] (Content) Don’t put units inside `children`; the label carries the unit (`Uptime · 99.97%`). `children` is reserved for an icon overlay.
- [ ] (Content) When `showValue` is on, the rendered number is the value only. Never inject a `%` or unit string into the prop.
- [ ] (Accessibility) Don’t use color to encode the threshold without redundant text; pair the warning tint with copy below or in the Tooltip.
