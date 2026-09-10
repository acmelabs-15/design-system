# modal: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 24 time(s), so at least one demo here is interactive.

- [ ] onClick — wired in 30 examples. Our equivalent: 
- [ ] onClickOutside — wired in 10 examples. Our equivalent: 
- [ ] onChange — wired in 4 examples. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Behavior) Allow Escape and outside-click to dismiss non-destructive Modals; gate dismissal on destructive ones with unsaved input.
- [ ] (Behavior) Trap focus inside the Modal while it’s open and return focus to the trigger after close. Restore body scroll on the same tick the Modal unmounts.
- [ ] (Accessibility) Set `aria-labelledby` to the `Modal.Title` id so screen readers announce the title on open.
- [ ] (Accessibility) After an error inside the Modal, keep focus inside so the user can retry; after success, return focus to the trigger.

## Read and judge — names an observable, but also carries guidance

- [ ] (Behavior) Default focus to `Cancel` on any destructive Modal. Enter must never trigger the destructive action without a typed confirmation.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) For high-stakes destructive actions (delete production resource, rotate signing key, downgrade plan), gate the primary button on a typed match of the resource name.
- [ ] (Content) `Modal.Title` is a Title Case statement, never a question. `Transfer Project` is correct; `Transfer Project?` is wrong.
- [ ] (Content) `Modal.P` body is sentence case, 1–3 sentences. State the consequence first, then any cascade.
- [ ] (Content) Primary button is `Verb + Noun` and matches the title verb (`Transfer Project` title pairs with `Transfer Project` button). Never `Confirm`, `OK`, or a bare verb on a destructive primary.
- [ ] (Content) Cancel literal stays `Cancel`. Acknowledgment-only Modals (after a key reveal, after a one-time-show) use `Done`, never `OK` or `Close`.
- [ ] (Content) Close irreversible bodies with `This cannot be undone.`; close cascade-only bodies with `Some effects cannot be undone.`. Don’t claim full irreversibility for a partial cascade.
- [ ] (Content) Pair the success toast verb 1:1 with the primary button: `Delete Project` button, `Project deleted` toast.
- [ ] (Accessibility) Keep the Cancel button literally `Cancel` so screen-reader users hear a stable dismissal label across destructive flows.
