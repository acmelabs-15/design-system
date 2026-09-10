# Slider

Input to select a value from a given range.

## Default

```html
<form>
  <acme-slider value="[50]"></acme-slider>
</form>
```

## With label

```html
<form>
  <acme-slider label="Volume" value="[40]"></acme-slider>
</form>
```

## Range with inputs

```html
<form>
  <acme-slider show-end-input show-start-input value="[50, 75]"></acme-slider>
</form>
```

## Disabled range with inputs

```html
<form>
  <acme-slider disabled show-end-input show-start-input value="[50, 75]"></acme-slider>
</form>
```

## Commit on release

```html
<form>
  <acme-slider label="Drag then release" value="[50]"></acme-slider>
  <p class="text-copy-13" style="color:var(--ds-gray-900);margin-top:8px">
    Last committed:
    <output>—</output>
  </p>
</form>
<script>root.querySelector('acme-slider').addEventListener('acme-commit', e => { root.querySelector('output').textContent = e.detail.value[0] })</script>
```

## `<acme-slider>`

A slider picks one value, or a range between two thumbs, from a track. The root is a column:
the label (a label element with the text block of the Label element, 13px gray-900,
capitalized unless `bypass-casing`) above a row that holds the optional start field, the group (the
8px track, its blue fill and the 6×14 thumbs, each around a visually hidden range input) and
the optional end field, both 48px small acme-inputs. A thumb carries the focus states
(data-focus for a visible focus, data-focus-within for any focus) and data-dragging while it
is dragged; the group and its parts carry data-disabled. The pointer picks the nearest thumb
and drags it, pushing its neighbour along; the keyboard moves a thumb by `step` (Shift or
Page keys by `large-step`) and to its bounds with Home and End. `acme-change` fires on every
change, `acme-commit` when a drag ends and after every keyboard change. Form-associated: a
range submits `name` twice.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `number[]` | `[]` | One value (`[50]` or `50`) or a range (`[50, 75]`). Defaults to `min`. |
| `min` | `min` | `number` | `0` |  |
| `max` | `max` | `number` | `100` |  |
| `step` | `step` | `number` | `1` |  |
| `large-step` | `largeStep` | `number` | `10` | The step of Page Up/Down and of a Shift + arrow key. |
| `min-steps-between-values` | `minStepsBetweenValues` | `number` | `0` | The least number of steps two thumbs keep between them. |
| `name` | `name` | `string` | `""` | The form field name; a range submits it once per value. |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `label` | `label` | `string` | `""` | The text above the track. |
| `bypass-casing` | `bypassCasing` | `boolean` | `false` | Keeps the label text as written. |
| `full-width` | `fullWidth` | `boolean` | `false` | The group fills the row instead of keeping its 216px minimum. |
| `show-start-input` | `showStartInput` | `boolean` | `false` | A small numeric field before the track, bound to the first value. |
| `show-end-input` | `showEndInput` | `boolean` | `false` | A small numeric field after the track, bound to the second value. |
| — | `getAriaLabel` | `(index: number) => string` | — | The accessible name of a thumb, by index. |
| — | `getAriaValueText` | `(formatted: string, value: number, index: number) => string` | — | The spoken value of a thumb: `(formatted, value, index)`. A range says "50 start range" / "75 end range" by default. |

## Best Practices

- Use a slider for a numeric range where the shape and the nearness matter more than the exact figure: bandwidth caps, opacity, volume, color channels.
- For an exact value like a port or a memory limit, pair the slider with a numeric Input. Keyboard users type by default.
- Snap to a sensible step (1, 5, 10%) so a drag never lands on 47.83291. Clamp min and max to real product limits.
- Always show the live value next to the track in tabular numbers, and say what the number is (Sample Rate · 44 kHz). The track alone does not explain itself.
- Threshold colors (a warning or error tint past a limit) use the same break point the rest of the UI shows. Do not invent a slider-only threshold.
- Name the slider with a sibling label or aria-label, and leave the native arrow, Page Up/Down, Home and End keys alone.

