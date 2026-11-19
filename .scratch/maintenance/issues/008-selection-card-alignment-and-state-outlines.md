# Checkbox Card and Radio Card: content alignment and state outlines

Status: ready-for-agent
Type: task
Owner: agent implementation; Peter selected the target behavior on 2026-11-19

## Scope

Checkbox Card and Radio Card in release 0.3.3. Both cards use the shared [selection-card styles](../../../styles/shared/selection-card.css). Checkbox Card also uses the [checkbox structure styles](../../../styles/components/checkbox/checkbox-structure.css), which plain Checkbox shares.

## Observed result

Evidence: `@acmelabs/design-system-browser@0.3.3` in Chrome, 2026-11-19, measured with `getBoundingClientRect` and `getComputedStyle` in each card's shadow root.

### 1. Start, end and indicator sit above the first text line

`.activation` aligns its items to `flex-start`. The first content line is a 20px line box (`--acme-form-line-height`, 1.25rem) at every size. Shorter items sit at its top.

| Item | small | medium | large |
| --- | --- | --- | --- |
| Start slot with a 16px icon | 2px high | 2px high | 2px high |
| Indicator (14, 16, 20px) | 3px high | 2px high | aligned |
| End slot | aligned only when its content is 20px tall | same | same |

Both cards show the same offsets.

### 2. Invalid and checked show two outlines

`.card[data-invalid]` changes the border to red. The checked rule still adds its 1px blue inset ring, so an invalid checked or indeterminate Checkbox Card shows a red border with a blue ring inside it.

In this test, an invalid Field around a Radio Group did not set `data-invalid` on its Radio Card, and Radio Group has no `invalid` property in the 0.3.3 record. Radio Card therefore did not show this combination. The shared fix also covers it if Radio Card gets an invalid state.

### 3. Disabled cards keep the checked and invalid outlines

`.card[data-disabled]` changes only text color and background. A disabled checked or indeterminate card keeps the blue border and ring; a disabled invalid card keeps the red border. This affects both cards, including cards disabled through a disabled Checkbox Group or Radio Group.

### 4. A disabled checked Checkbox Card mark stays blue

The checked indicator rule in checkbox-structure.css has the same specificity as the shared disabled indicator rule and loads later. A disabled checked or indeterminate mark therefore keeps the accent background. Radio Card is not affected: radio-structure.css already sets a gray dot and border for disabled checked radios.

## Selected behavior

Peter selected these on 2026-11-19:

- Start, end and indicator center on the first content line at every size.
- Invalid with checked or indeterminate shows only the red outline, at the 2px weight of the checked outline.
- Disabled shows the gray disabled outline whatever its checked, indeterminate or invalid state.
- A visible disabled indicator uses the disabled colors.

## Proposed changes

These are proposals for the implementing task. They were verified only as an injected stylesheet appended after each card's own styles (the cascade order they will have in the files). Generated styles come from these authored files through the [style producers](../../../docs/agents/repository.md#generator-and-delivery-map).

### styles/shared/selection-card.css

Alignment. Use `1lh`, the element's computed line height, so the rule follows the line-height token, theme overrides and a future size-specific line height. Use a minimum, not a fixed height, so taller start or end content (a 24px badge, an avatar, a button) still fits. The indicator is the painted square, so it keeps its size and gets block margins instead of a height.

```css
.affix { display:inline-flex; align-items:center; flex:none; min-block-size:1lh; }

.activation > .indicator { inline-size:16px; block-size:16px; flex:none; position:relative; z-index:1; margin-block:calc((1lh - 16px) / 2); }
.card[data-size=small] .activation > .indicator { inline-size:14px; block-size:14px; margin-block:calc((1lh - 14px) / 2); }
.card[data-size=large] .activation > .indicator { inline-size:20px; block-size:20px; margin-block:calc((1lh - 20px) / 2); }
```

An alternative for the indicator is a wrapper with `block-size:1lh` that centers it, as plain Checkbox does with `.control`.

State outlines. Place the invalid rule after `.card[data-invalid]`, then the disabled rules after it, all before `.card:has(.native:focus-visible)` so the focus ring still wins. The disabled checked rule must follow the invalid checked rule because both have the same specificity.

```css
.card[data-invalid] { border-color:var(--warn-solid); }
.card[data-invalid]:is([data-checked],[data-indeterminate]) { box-shadow:inset 0 0 0 1px var(--warn-solid); }
.card[data-disabled] { color:var(--ds-gray-700); background:var(--comp); border-color:var(--border); }
.card[data-disabled]:is([data-checked],[data-indeterminate]) { border-color:var(--border); box-shadow:inset 0 0 0 1px var(--border); }
```

### styles/components/checkbox/checkbox-structure.css

```css
.selection-label[data-disabled]:is([data-checked],[data-indeterminate]) .indicator { background:var(--comp); color:var(--ds-gray-700); border-color:var(--border); }
```

This file also styles plain Checkbox, so a disabled checked Checkbox mark becomes gray too. That matches Radio and the selected behavior; confirm it in review.

## Prototype results

With the changes above injected into all 139 Checkbox Cards of a variations gallery and into Radio Cards at each size:

- Start, end and indicator centers were within 0.5px of the first line's center at small, medium and large, with heading-first and default-first content.
- Invalid checked: red border and red ring.
- Disabled checked, indeterminate, invalid and invalid checked: gray border; checked and indeterminate keep a gray ring.
- Disabled checked Checkbox Card mark: gray background and gray glyph.

Gallery artifacts (owner-only): [current 0.3.3](https://claude.ai/artifact/7WwUt2LAQMJ5CKHtDqo5uc) and [with these fixes](https://claude.ai/artifact/TfTawCucfjUmx94cwmKAqP).

## Open questions

- A disabled checked secondary card keeps its light blue fill. Should disabled override the fill too? Not decided; this issue does not change it.
- Large cards use 16px text on the 20px form line height; `--acme-form-large-line-height` (1.5rem) exists but the card does not use it. Out of scope here; the `1lh` rules stay correct if that changes.
- Can Radio Card become invalid through Field or Radio Group? The test above found no path in 0.3.3.

## Completion

Implement the selected behavior in the authored styles, regenerate the styles and add browser checks for alignment at three sizes and for the computed outline and indicator colors of the combinations above, for both cards and in Chromium, Firefox and WebKit. Update the selection specification if it gains these visual rules. Record the verification commands and results here before closing. The prototype results above do not close this issue.

## Comments

2026-11-19: recorded from a review of the Checkbox Card variations gallery with Peter.
