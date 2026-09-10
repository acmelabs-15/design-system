# combobox: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 9 time(s), so at least one demo here is interactive.

- [ ] onChange — wired in 4 examples. Our equivalent: 
- [ ] onClick — wired in 3 examples. Our equivalent: 
- [ ] onClickOutside — wired in 1 example. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Behavior) Keep arrow-key navigation through `<Combobox.Option>` items; don’t hijack Enter to submit the surrounding form while the list is open.
- [ ] (Accessibility) `<Combobox>` has no `label` prop; pair a sibling `<Label htmlFor>` with the root `id`, or set `aria-label` on the root for icon-only triggers.
- [ ] (Accessibility) The root accepts `aria-label` only; there is no `aria-labelledby` prop, so the sibling-label path is the way to reference visible text.
- [ ] (Accessibility) Trap focus inside the popover when nested in a `Modal` so Tab cycles options instead of the page behind it.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Show a loading state for async results; don’t collapse the list while the request is in flight.
- [ ] (Behavior) Render a custom empty state of the form `No {items} match "{query}"` rather than a bare `No results`.
- [ ] (Behavior) Inside a `Modal`, Geist switches to a Dialog on mobile automatically; don’t layer a second portal.
- [ ] (Content) Visible label is a short Title Case noun (`Region`, `Environment Variable Name`).
- [ ] (Content) Placeholder is the inline hint: `Search regions`, `DATABASE_URL`. Never bare `Search…` and never the label restated.
- [ ] (Content) Option text is Title Case for short values and matches canonical branding (`Next.js`, not `NextJS`); same register across the list.
- [ ] (Content) Validation names the field and constraint, sentence case with a period (`Select a region.`).
