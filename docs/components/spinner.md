# Spinner

Shows an action running in the background. Unlike Loading Dots, use it as feedback to something the user did: a button, a pagination step, a retry.

## Default size

```html
<acme-spinner></acme-spinner>
```

## Sizes

```html
<div class="row" style="gap:16px;align-items:flex-end">
  <acme-spinner size="sm"></acme-spinner>
  <acme-spinner size="md"></acme-spinner>
  <acme-spinner size="lg"></acme-spinner>
  <acme-spinner size="xl"></acme-spinner>
  <acme-spinner size="2xl"></acme-spinner>
  <acme-spinner size="3xl"></acme-spinner>
  <acme-spinner size="4xl"></acme-spinner>
</div>
```

## Colors

```html
<div class="vstack" style="gap:16px">
  <div class="row" style="gap:16px">
    <span style="width:96px">Default:</span>
    <acme-spinner></acme-spinner>
  </div>
  <div class="row" style="gap:16px">
    <span style="width:96px">Red:</span>
    <acme-spinner color="var(--ds-red-700)"></acme-spinner>
  </div>
  <div class="row" style="gap:16px">
    <span style="width:96px">Green:</span>
    <acme-spinner color="var(--ds-green-700)"></acme-spinner>
  </div>
  <div class="row" style="gap:16px">
    <span style="width:96px">Blue:</span>
    <acme-spinner color="var(--ds-blue-700)"></acme-spinner>
  </div>
</div>
```

## `<acme-spinner>`

Spinner: blades fading in turn around a square box. The root carries the size class,
`role="status"` and `aria-label="Loading"`; each blade is an absolutely positioned child with
its rotation, cycle and delay as inline style; a visually hidden "Loading..." follows. Sizes
sm 12 · md 16 · lg 20 · xl 24 · 2xl 32 · 3xl 40 · 4xl 56. The blades take the current colour
(gray-700 by default); `color` sets it. The host carries `data-glyph="circular"`, so a badge
or button icon slot pulls the round glyph in like any other.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `size` | `size` | `SpinnerSize` | `"md"` | sm · md · lg · xl · 2xl · 3xl · 4xl. |
| `color` | `color` | `string` | `""` | Any CSS colour for the blades. |

## Best Practices

**When to use**

- Use a Spinner for a wait of about one to three seconds with no known end, tied to one action: a submit button, an inline icon refresh, a row-level retry.
- On a submit button, set the Button loading attribute so the spinner, the size and the busy state stay in step. Do not place a Spinner inside a button by hand.
- Use Skeleton when async data fills a known layout, Loading Dots for inline copy, and Progress when the total work is known.

**Behavior**

- Mount the Spinner only once the action starts. A spinner that is rendered early and toggled shows a partial rotation at idle and reads as jank.
- Pair any wait over about a second with copy that names the work (Verifying…, Deploying…) so the user knows what blocks.
- Match the Spinner size to the type or icon next to it, not to the parent container.

**Accessibility**

- Set aria-busy="true" on the element that wraps the in-flight action so screen readers announce the change.
- Keep the trigger focusable while it loads. Swapping it for a separate spinner element drops keyboard focus.
- Honor prefers-reduced-motion and do not stack extra animation around the Spinner.

