# status-dot: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Accessibility) The component composes its own `aria-label` from `titlePrefix` plus the state message; don’t override it with a generic `aria-label="status"`.
- [ ] (Accessibility) When the dot sits inline with text that already names the state, mark the dot decorative with `aria-hidden` so screen readers don’t announce it twice.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) The dot animates while `BUILDING` or `QUEUED` and goes static once the deployment reaches a terminal state. Don’t add a separate spinner alongside it.
- [ ] (Behavior) Don’t flash the color through every transitional state on a polling tick; only update when the readyState changes.
- [ ] (Behavior) Pair with `RelativeTimeCard` when timing matters (`Building · 12s ago`); the dot alone doesn’t convey duration.
- [ ] (Content) `titlePrefix` is a noun phrase, not a sentence. Default `"This deployment"` works for single-deployment surfaces; in lists, pass the entity (`titlePrefix="vercel-site production"`). Don’t end with a verb or punctuation.
- [ ] (Content) Use `label` only when the dot stands alone without surrounding text; Geist sentence-cases the state for you (`Building`, `Ready`, `Error`).
- [ ] (Content) Don’t wrap the dot in extra prose like `Status: Ready`. The label already names the state.
- [ ] (Accessibility) Color is not the only signal: every state ships with a distinct title and label so colorblind users get the same information.
