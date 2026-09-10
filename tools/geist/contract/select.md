# select: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Best Practices) Don’t wrap a labelled `<Select>` in a `Tooltip`; put the hint on a sibling icon button so the label stays announced.

## Guidance — read it, apply judgement, no test

- [ ] (Best Practices) Pick `<Select>` for short, fixed lists (under ~10 items) where typing adds nothing; switch to `Combobox` once filtering helps.
- [ ] (Best Practices) Use `MultiSelect` when more than one value can be chosen at once; use `Switch` for a 2–3 option segmented choice.
- [ ] (Best Practices) Group options past ~10 items with native `<optgroup>`; Geist `<Select>` has no `.Group` static.
- [ ] (Best Practices) Options are Title Case when short and match canonical branding (`Next.js`, not `NextJS`); keep the same register across the list.
- [ ] (Best Practices) Label is a short Title Case noun (`Framework`, `Region`); accept the prop directly on `<Select>`.
- [ ] (Best Practices) Placeholder is action-oriented (`Select a framework`), never `Choose one…`, `Pick`, or the label restated.
- [ ] (Best Practices) Validate on blur and pass a string to `error`; messages name the field and end in a period (`Select a framework.`).
