# toast: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

- [ ] onClick — wired in 10 examples. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Accessibility) The toast region announces with `aria-live="polite"`; reserve `assertive` for blocking errors that interrupt a flow.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Default toasts auto-dismiss; pass `preserve` only when the user must read or act on the message before it disappears.
- [ ] (Behavior) Undo snackbars stay on screen for 5–10 seconds and pair the past-tense toast with a single `Undo` action button.
- [ ] (Behavior) Don’t stack toasts to narrate one async flow; emit the success or error toast at the terminal step.
- [ ] (Content) One sentence, sentence case, no trailing period when the toast is a single sentence.
- [ ] (Content) Completion toasts follow `{Noun} {past-participle}`: `Blob deleted`, `Domain added`, `Environment variable saved`. Never include `successfully`; the action name implies it.
- [ ] (Content) Error toasts are two sentences with periods and end with a recovery step: `Couldn’t verify domain. Try again.` Use `Couldn’t` for user-state errors and `Failed to` for system or infra errors; match adjacent shipped copy and don’t flip mid-flow.
- [ ] (Content) Pair the toast verb 1:1 with the destructive button verb (`Delete Project` then `Project deleted`, never `Project removed`).
- [ ] (Content) Undo snackbars use the literal label `Undo`, never `Restore`, `Bring Back`, or `Cancel`. Only use the pattern when the rollback is safe.
- [ ] (Accessibility) Don’t put primary navigation inside a toast; transient surfaces vanish before keyboard users can reach them.
