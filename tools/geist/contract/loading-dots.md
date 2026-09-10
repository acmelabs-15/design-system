# loading-dots: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Accessibility) The dots are decorative; the surrounding text carries meaning, so don’t add `aria-label` to the component itself.

## Read and judge — names an observable, but also carries guidance

- [ ] (Accessibility) Mark the wrapping span with `aria-live="polite"` so screen readers pick up the in-progress label without interrupting.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Pass `size` (number, dot diameter in px) only when the default doesn’t match adjacent type size.
- [ ] (Behavior) Keep the trailing label specific to the work in flight (`Saving`, `Deploying`, `Uploading`) so a wait over ~1s still tells the user what’s happening.
- [ ] (Behavior) Don’t string Loading Dots after a completed verb (`Saved<LoadingDots />`); the dots imply ongoing work.
- [ ] (Accessibility) Honor `prefers-reduced-motion` and avoid pairing Loading Dots with another animated indicator on the same line.
