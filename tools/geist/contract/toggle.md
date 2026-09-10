# toggle: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 7 time(s), so at least one demo here is interactive.

- [ ] onChange — wired in 14 examples. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Best Practices) Provide an accessible name through `children`, `aria-label`, or `aria-labelledby`. Geist warns in development if all three are missing.

## Read and judge — names an observable, but also carries guidance

- [ ] (Best Practices) Set `aria-label` only when the visible label sits elsewhere on the row; otherwise let `children` carry it so sighted and screen-reader copy stay aligned.

## Guidance — read it, apply judgement, no test

- [ ] (Best Practices) Use Toggle for a single boolean setting where ON takes effect immediately, like `Password Protection` or `Auto-Cancel Builds`. Switch to `Checkbox` for a multi-select list, or to `Switch` for 2–3 mutually exclusive views.
- [ ] (Best Practices) `checked` is required and the component is controlled. Own the state and update it from `onChange`.
- [ ] (Best Practices) Persist on change and surface the result in a `useToasts().success(…)` toast (`Password protection enabled`); don’t leave the user wondering whether the flip stuck. Pair with a form footer only when the setting needs an explicit `Save` step.
- [ ] (Best Practices) Disable Toggle only when the action is impossible (missing plan, locked policy); pair with helper text or a `Tooltip` that names the resolver.
- [ ] (Best Practices) The label is `children`, not a `label` prop. Title Case noun phrase, 1–4 words, naming what is true when ON: `Password Protection`, not `Enable Password Protection`.
- [ ] (Best Practices) Render an optional one-sentence description as a sibling under the label that explains ON only. Don’t describe OFF; it’s the negation.
- [ ] (Best Practices) Keep `labelCasing="title"` (the default) so labels match other Title Case surfaces. Use `labelCasing="normal"` only when sentence-case content sits inline next to the toggle.
