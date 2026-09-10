# input: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 4 time(s), so at least one demo here is interactive.

- [ ] onChange — wired in 2 examples. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Behavior) Keep the field focusable while saving; pair `disabled` with a spinner only when input is impossible.
- [ ] (Behavior) Don’t wrap a labelled `<Input>` in a `Tooltip`; put the explainer on a sibling icon button so the label stays announced.
- [ ] (Accessibility) Passing a string to `label` requires `id`; the `InputPropsWithStringLabelAndId` union won’t compile without it and screen readers lose the association.
- [ ] (Accessibility) For icon-only affordances inside a row of inputs, use `<Button shape="circle" svgOnly aria-label="…">` rather than an unlabeled icon.

## Read and judge — names an observable, but also carries guidance

- [ ] (Content) Placeholders show an example value (`my-awesome-project`, `example.com`), never instructions like `Enter your project name`.
- [ ] (Content) Helper text is sentence case, one sentence with a trailing period, on a sibling element wired through `aria-describedby`.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Validate on blur, not on every keystroke; surface the message by passing a string to `error`.
- [ ] (Behavior) Trim leading and trailing whitespace before submit so ` example.com` and `example.com` resolve to one value.
- [ ] (Content) Labels are short Title Case nouns: `Project Name`, `Domain`, `Environment Variable Name`.
- [ ] (Content) Validation names the field and the constraint, ends in a period, and skips `please` (`Project name is required.`, `Code must be 6 digits.`).
- [ ] (Accessibility) A `SearchInput` placeholder names the scope (`Search projects`) so the role is clear without sighted context.
