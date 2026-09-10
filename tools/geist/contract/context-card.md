# context-card: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Behavior) Context Card opens on hover and keyboard focus and closes on cursor exit or blur. Preserve the ~150ms entry delay so it doesn’t flash on a fast mouse sweep.
- [ ] (Behavior) Don’t nest a Context Card inside a Tooltip or another Context Card; the second layer steals focus and traps keyboard users.
- [ ] (Accessibility) Card content is reachable by keyboard once the trigger has focus; Escape closes the card and returns focus to the trigger.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Cap interactive content at one primary action (`View Project`, `Open Settings`). More than one CTA reads as a menu and belongs in `Menu`.
- [ ] (Content) Lead with the entity name as a Title Case heading and one identifying line in sentence case underneath (team slug, owner, deployment URL).
- [ ] (Content) Follow with 2–4 metadata rows of `Label: value`. Keys are Title Case noun phrases (`Last Active`, `Created`, `Plan`); values follow the same formatting rules as table cells. Use the em-dash character `—` for unknown values, never `N/A` or `null`.
- [ ] (Content) Don’t restate what the trigger already showed. If the row already renders the deployment URL, don’t repeat it as the first card line.
- [ ] (Accessibility) The trigger keeps its own accessible name; the card is supplementary and shouldn’t replace it.
