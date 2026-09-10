# radio: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 10 time(s), so at least one demo here is interactive.

- [ ] onChange — wired in 5 examples. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Behavior) Arrow keys move selection within the group and skip disabled options. Tab moves to the next field, not the next radio.
- [ ] (Accessibility) Wrap related radios in `<fieldset>` + `<legend>` so screen readers announce the group name before each option.
- [ ] (Accessibility) Don’t replace the native focus ring with a CSS hack that drops outline-offset; keyboard users lose track of which option is focused.

## Read and judge — names an observable, but also carries guidance

- [ ] (Content) Group label is a Title Case noun like `Deployment Region` or `Billing Cycle`. Render it via `<legend>` or a sibling label tied with `aria-labelledby`.
- [ ] (Content) Disabled options need a Tooltip naming why (`Available on Pro and Enterprise`). A greyed-out radio with no reason reads as broken.
- [ ] (Accessibility) The standalone unlabeled radio (custom UI) needs an `aria-label` describing the choice. Never ship a radio with no accessible name.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Pre-select the safest default so the field reads as configured, never as required-but-empty. Skip the default only when the choice has real consequences and you want a deliberate pick.
- [ ] (Behavior) Required state goes on the `RadioGroup`, not on individual options. Required-against-a-single-radio is meaningless.
- [ ] (Content) Option labels are parallel: same part of speech, same length range, same register. `Monthly` / `Yearly`, not `Monthly` / `Pay yearly`.
