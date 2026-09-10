# error: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Behavior) For full-page route errors (`error.tsx`), return focus to the `Try Again` button on appearance so a keyboard user can retry without hunting for it.
- [ ] (Accessibility) When the error appears asynchronously (after a failed fetch), wrap the region in `aria-live="polite"` so it’s announced. Reserve `aria-live="assertive"` for true blocking errors that interrupt input.

## Read and judge — names an observable, but also carries guidance

- [ ] (Content) Render the stable ID on a monospace sub-line under a collapsed `<details>` so the user can copy-paste it into a support thread.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) The recovery action must do something concrete: a `Try Again` button when the operation is retry-safe, a named verb (`Reconnect GitHub`, `Update Payment Method`) when it isn’t.
- [ ] (Behavior) Don’t auto-retry in the background; the user came to this surface to decide.
- [ ] (Content) State what happened and what to do next, in that order. Cut apologetic preambles (`Unfortunately`, `Oops`, `We’re sorry`).
- [ ] (Content) Use `Couldn’t` or `Can’t` for user-state errors (`Couldn’t verify your passkey. Try again.`); use `Failed to` for system or infra errors that mirror CLI output (`Build failed. Bundle exceeds 50 MB.`). `Unable to` is banned.
- [ ] (Content) Don’t fall back to `Something Went Wrong` as a title; name the resource that failed (`Couldn’t Load Page`, `Couldn’t Load Deployments`).
- [ ] (Content) Never humor an error. Users hitting an error are frustrated; insincere copy makes it worse.
