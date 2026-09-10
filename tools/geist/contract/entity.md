# entity: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 2 time(s), so at least one demo here is interactive.

- [ ] onChange — wired in 1 example. Our equivalent: 
- [ ] onClick — wired in 1 example. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Behavior) For multi-select rows, the leading `Checkbox` carries `aria-label="Select {entity name}"` so the row is selectable without relying on the visual label.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) The right column holds at most one or two controls. If the row needs more, move secondary actions into a `Dots Menu`.
- [ ] (Behavior) Render the Skeleton variant (`entity-with-skeleton`) during load instead of an empty row, and swap to real content once data resolves.
- [ ] (Content) Lead the left column with a scannable identifier: an `Avatar` or icon, a Title Case label, then sentence-case secondary metadata (`Member since Mar 14, 2026`).
- [ ] (Content) Keep right-column buttons Verb + Noun (`Remove Member`, `Resend Invite`). Bare verbs like `Remove` or `Confirm` lose context once the row scrolls offscreen.
