# button: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Best Practices) Pass `loading` instead of swapping in a spinner so the button stays focusable and announces the busy state to assistive tech.
- [ ] (Best Practices) Don’t set `aria-label` on a button that already has visible text; it overrides the label and creates a screen-reader mismatch.

## Read and judge — names an observable, but also carries guidance

- [ ] (Best Practices) Icon-only buttons require both `svgOnly` and `aria-label`; the validator throws without them. The `aria-label` names the action and the target (`Copy deployment URL`), not the icon (`Copy`).

## Guidance — read it, apply judgement, no test

- [ ] (Best Practices) Use `Button` for actions that mutate state (deploy, save, delete); use `ButtonLink` for navigation that changes the URL. Switch to a `Menu` or `Split Button` when more than one related action shares a row.
- [ ] (Best Practices) Default `Button` is primary. Pass `type="secondary"` for the supporting action and `type="error"` for destructive confirmations. `primary`, `success`, `ghost`, and `violet` are not valid `type` values.
- [ ] (Best Practices) For form submits, use `typeName="submit"`. The HTML `type` attribute lives on `typeName`, not on `type`, which controls the visual variant.
- [ ] (Best Practices) Disable a button only when the action is impossible right now (missing input, insufficient permission); pair with a `Tooltip` that explains why.
- [ ] (Best Practices) Title Case the label and name what happens: `Deploy Project`, `Invite Member`, `Rotate Key`. Avoid bare verbs (`Submit`) and generic confirms (`OK`, `Confirm`).
- [ ] (Best Practices) Destructive buttons follow `Verb + Noun` and pair 1:1 with their toast: `Delete Project` then `Project deleted`. Mode-switch buttons append `Instead`: `Use a Recovery Code Instead`.
