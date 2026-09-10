# description: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Best Practices) Geist renders `<dl>`/`<dt>`/`<dd>` so screen readers announce each key/value pair as a definition. Don’t wrap the component in extra paragraphs that break the list semantics.

## Read and judge — names an observable, but also carries guidance

- [ ] (Best Practices) Title slot is Title Case noun (`Last Deployed`, `Build Duration`); content is sentence case unless the value is a literal identifier, ID, or timestamp that should be preserved verbatim.

## Guidance — read it, apply judgement, no test

- [ ] (Best Practices) Use `<Description>` for definition-list metadata: a short Title Case key paired with a single value (`Last Deployed`, `Region`, `Plan`). For inline help under a form field, use the input’s helper-text slot instead.
- [ ] (Best Practices) Pass `tooltip` only when the title alone is ambiguous and a one-sentence definition resolves it. The tooltip text is sentence case and ends with a period.
- [ ] (Best Practices) Don’t put interactive controls in the title slot. Buttons, menus, and links belong in the content (`<dd>`) or in the parent layout, not the label (`<dt>`).
