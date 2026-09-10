# skeleton: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Accessibility) Wrap the loading region in `aria-busy="true"` and announce completion with `aria-live="polite"` on the destination container, not the skeleton itself.

## Read and judge — names an observable, but also carries guidance

- [ ] (Accessibility) Skeletons are decorative; avoid placing focusable controls inside them while loading.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Set `width` and `height` to match the final content so the layout doesn’t shift when data resolves. A 200×20 block becoming an 80×16 string reads as a glitch.
- [ ] (Behavior) Pick `pill`, `rounded`, or `squared` to mirror the eventual element’s shape (avatars `pill`, buttons and chips `rounded`, image tiles `squared`).
- [ ] (Behavior) When the skeleton wraps children, keep dimensions stable so the reveal swap doesn’t reflow surrounding content.
- [ ] (Accessibility) Disable the shimmer with the `no animation` variant on low-power surfaces and respect `prefers-reduced-motion`.
