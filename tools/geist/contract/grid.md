# grid: behaviour contract

Extracted from the reference's own documentation by `bun tools/geist/contract.ts`. The extraction
is mechanical; deciding whether our element satisfies a statement is not. Mark each line as you
check it: `[x]` holds, `[ ]` open, `[-]` does not apply, with a reason.

## Assert in a test — names something a test can observe

- [ ] (Accessibility) Guides are decorative; mark them `aria-hidden="true"` and let semantics live on cell content.
- [ ] (Accessibility) When cells become tappable, give each its own focus ring and keep tab order matching reading order.

## Guidance — read it, apply judgement, no test

- [ ] (Behavior) Set `columns` and `rows` at all three breakpoints so cells reflow predictably between mobile, tablet, and desktop.
- [ ] (Behavior) Use `solid` cells to occlude guides behind a tile when content needs an opaque background; without it, guides render through the cell.
- [ ] (Behavior) Hide row or column guides only when their absence improves clarity (single-axis layouts, hero rows). Hiding both usually means a plain Tailwind grid is the right tool.
- [ ] (Accessibility) Confirm guide contrast on both themes; the default tokens are tuned, but custom borders can drop below the 3:1 minimum.
