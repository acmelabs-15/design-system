# choicebox: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Capabilities the reference's own examples demonstrate

Each callback below is wired in an example on the reference page. Ours needs an equivalent —
an event, a property, or a written reason it does not apply. This is where a control wired to
nothing shows up, which prose alone does not catch.

The reference's examples hold state 9 time(s), so at least one demo here is interactive.

- [ ] onChange — wired in 5 examples. Our equivalent: 

## Assert in a test — names something a test can observe

- [ ] (Behavior) The whole tile is the click and focus target; tapping anywhere inside selects it. Don’t place nested buttons or links inside a tile that would steal the click.
- [ ] (Content) Icons are decorative when paired with a title; if the icon is the only label, give the tile an `aria-label` naming the choice.
- [ ] (Accessibility) Tiles render as radios or checkboxes under the hood, so keep them inside a `<fieldset>` with a `<legend>` so screen readers announce the group.
- [ ] (Accessibility) Arrow keys move within a single-select group, Space toggles in multi-select. Don’t override those keys with custom handlers.

## Read and judge — names an observable, but also carries guidance

- [ ] (Behavior) Disabled tiles need a Tooltip naming why (`Available on Pro`). A faded tile with no reason reads as broken.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Selected state shows a check or filled dot in the corner. The border highlight alone isn’t enough on low-contrast screens.
- [ ] (Content) Titles are parallel: one Title Case title plus one sentence-case description per tile, ending in a period.
- [ ] (Content) Don’t restate the title in the description. The description adds the differentiator (`$20/mo · 100 GB bandwidth`), not a synonym.
- [ ] (Accessibility) Color is not the selection signal. Pair the highlight border with the corner check so colorblind users still see what’s active.
