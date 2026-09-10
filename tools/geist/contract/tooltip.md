# tooltip: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Behavior) Tooltips open on hover and on keyboard focus. Keep the default ~150ms entry delay so the tooltip doesn’t flicker on a sweeping mouse.
- [ ] (Accessibility) An icon-only trigger needs an `aria-label` that names the action; the Tooltip body adds context, it doesn’t replace the label.
- [ ] (Accessibility) Escape closes the tooltip and returns focus to the trigger.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Don’t wrap a labelled `Input` in a Tooltip. The trigger lands on the `<label>`, not the field, and the tooltip text becomes a second invisible label for screen readers. Put help on a sibling icon button.
- [ ] (Behavior) Keep primary actions outside the Tooltip; touch users can’t reach a hover-revealed control.
- [ ] (Content) One sentence or fragment in `text`. Sentence case, no period for a single fragment.
- [ ] (Content) Skip tooltips that repeat the visible label (`text="Rate Limit"` on a `Rate Limit` button) or describe the interaction (`text="Click to override"`).
- [ ] (Content) Lifecycle Tooltips follow `{Label}: {one-line meaning}. {Specific limit}.` For a paid Beta feature, combine the lifecycle and pricing in one Tooltip rather than stacking two badges.
