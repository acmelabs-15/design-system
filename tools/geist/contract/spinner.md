# spinner: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Accessibility) Set `aria-busy="true"` on the element wrapping the in-flight action so screen readers announce the state change.
- [ ] (Accessibility) Keep the trigger focusable while loading; swapping it for a separate spinner element loses keyboard focus.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Mount the Spinner only after the action starts. Pre-rendering and toggling visibility leaves a partial rotation visible at idle and reads as jank.
- [ ] (Behavior) Pair any wait longer than ~1s with copy that names the work (`Verifying…`, `Deploying…`) so the user knows what’s blocking.
- [ ] (Behavior) Match the Spinner size to the surrounding type or icon size, not the parent container.
- [ ] (Accessibility) Honor `prefers-reduced-motion` and skip stacking extra animation around the Spinner.
