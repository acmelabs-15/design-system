# checkbox: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 2 time(s), so at least one demo here is interactive.

- [ ] onChange — wired in 1 example. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Accessibility) Wrap related checkboxes in `<fieldset>` with a `<legend>` so screen readers announce the group name before each option.
- [ ] (Accessibility) Row-select checkbox in a table has no visible label. Set `aria-label="Select {row name}"` so the row stays identifiable out of context.

## Read and judge — names an observable, but also carries guidance

- [ ] (Behavior) Disabled checkboxes still need a Tooltip naming the reason; a greyed box with no explanation reads as a bug.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Indeterminate is a visual state, not a third value. Drive it from a parent that knows partial selection, and clear it as soon as every child is fully checked or unchecked.
- [ ] (Behavior) Validation on a required acknowledgment fires on submit, not on blur, so checking and unchecking shouldn’t flash an error.
- [ ] (Content) Group label above a `<fieldset>` is a Title Case noun like `Notifications` or `Required Permissions`. No trailing colon.
- [ ] (Content) Acknowledgment label is a full sentence ending in a period: `I agree to the Terms of Service.`
- [ ] (Content) Indeterminate copy names the partial count next to the group label (`3 of 5 selected`). Never leave the dash state unlabeled.
- [ ] (Accessibility) The click target already extends to the label. Don’t override the `<label>`/`htmlFor` association with a custom wrapper that breaks the click region.
