# Progress

A bar that shows how far a task has come, or how much of a limit is used.

## Default

```html
<acme-progress value="30"></acme-progress>
```

## Custom max

```html
<acme-progress max="40" value="30"></acme-progress>
```

## Dynamic colors

```html
<div class="vstack" style="gap:24px;align-items:flex-start">
  <acme-progress value="0" colors='{"0":"var(--acme-foreground)","25":"var(--acme-error)","50":"var(--acme-warning)","75":"var(--acme-highlight-pink)","100":"var(--acme-success)"}'></acme-progress>
  <div class="row" style="gap:16px;align-items:stretch">
    <acme-button size="small" variant="primary">Increase</acme-button>
    <acme-button size="small">Decrease</acme-button>
  </div>
</div>
<script>const bar = root.querySelector("acme-progress"); const [inc, dec] = root.querySelectorAll("acme-button"); inc.addEventListener("click", () => { if (bar.value 100) bar.value += 10; }); dec.addEventListener("click", () => { if (bar.value > 0) bar.value -= 10; });</script>
```

## Themed

```html
<div class="vstack" style="gap:24px">
  <acme-progress type="success" value="100"></acme-progress>
  <acme-progress type="error" value="10"></acme-progress>
  <acme-progress type="warning" value="40"></acme-progress>
  <acme-progress type="secondary" value="70"></acme-progress>
</div>
```

## With Stops

```html
<acme-progress value="30" type="success" stops='[{"value":10,"tooltip":"10%"},{"value":20,"tooltip":"20%"},{"value":30,"tooltip":"30%"},{"value":40,"tooltip":"40%"},{"value":50,"tooltip":"50%"},{"value":60,"tooltip":"60%"},{"value":70,"tooltip":"70%"},{"value":80,"tooltip":"80%"},{"value":90,"tooltip":"90%"},{"value":95,"tooltip":"95%"}]'></acme-progress>
```

## Widths

```html
<div class="vstack" style="gap:24px">
  <acme-progress value="60" width="100"></acme-progress>
  <acme-progress value="60" width="200"></acme-progress>
  <acme-progress value="60" width="300"></acme-progress>
  <acme-progress value="60" width="50%"></acme-progress>
  <acme-progress value="60" width="100%"></acme-progress>
</div>
```

## Heights

```html
<div class="vstack" style="gap:24px">
  <acme-progress value="60" height="4"></acme-progress>
  <acme-progress value="60" height="10"></acme-progress>
  <acme-progress value="60" height="50"></acme-progress>
  <acme-progress value="60" height="200"></acme-progress>
</div>
```

## `<acme-progress>`

Progress: a native progress bar (radius 6, gray-200 track) inside a relative wrapper that
carries the width and height; the bar's colour is the `--fg` variable the wrapper sets from
`type` or `colors`. `stops` draw 1px ticks at values, each with a hover tooltip; a bar with
stops has square value corners.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `number` | `0` |  |
| `max` | `max` | `number` | `100` | The real ceiling; the bar shows `value / max`. |
| `type` | `type` | `ProgressType` | `""` | Hue by meaning: `success`, `error`, `warning`, `secondary`. |
| `height` | `height` | `number` | `10` | Bar height in px. |
| `width` | `width` | `string` | `""` | Bar width: a number in px or any CSS length (`50%`); unset is the full width. |
| `stops` | `stops` | `(number \| ProgressStop)[]` | `[]` | Ticks: `[{ value, tooltip? }]` or plain numbers. |
| `colors` | `colors` | `Record<string, string>` | `{}` | Bar colour by threshold: `{ "0": "var(--ds-gray-1000)", "50": "var(--ds-amber-700)" }`; the highest key at or under `value` wins. |
| `aria-label` | `label` | `string` | `""` |  |

## Best Practices

**When to use**

- Determinate work with a known total: file uploads, multi-step setup, build steps, batch deletions.
- A short wait with no known end (one to three seconds) is a Spinner; inline copy such as Saving uses Loading Dots.
- Usage against a quota or a ratio is a Gauge. The circle reads as health; the bar reads as progress.

**Behavior**

- max is the real ceiling (max="12" for twelve files), not a hard-coded 100. The bar shows value / max.
- Threshold colours in colors use the same breakpoints as the rest of the product, so the bar turns amber where the quota note fires.
- Stops mark real stages, with the stage named next to the bar (Step 2 of 4 · Building). A stop with no label is noise.

**Content**

- Text beside the bar names the work and the units: Uploading 12 of 30 files, Building · 1.2 GB / 4 GB. The bar alone says nothing about what is progressing.
- When the bar fills, switch to a completion state (toast, success row, redirect) instead of appending successfully or complete.
- A long operation names the work in the surrounding copy (Building deployment…) rather than showing a bare percentage.

**Accessibility**

- The element sets role="progressbar" with aria-valuemin, aria-valuemax and aria-valuenow. Give it a name with aria-label, or tie a sibling label with aria-labelledby.
- Update value about once a second during a fast upload so screen readers do not announce every increment.
- Each stop takes its own ariaLabel (Build complete, Tests complete), so the bar can be read without sight.

