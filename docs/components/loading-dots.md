# Loading Dots

Indicate an action running in the background.

## Default

```html
<div class="vstack" style="gap:24px;align-items:flex-start">
  <acme-loading-dots size="sm"></acme-loading-dots>
  <acme-loading-dots size="md"></acme-loading-dots>
  <acme-loading-dots size="lg"></acme-loading-dots>
</div>
```

## With text

```html
<acme-loading-dots size="md">
  <p class="text-copy-14" style="color:var(--ds-gray-900)">Loading</p>
</acme-loading-dots>
```

## `<acme-loading-dots>`

Loading dots: three dots blinking in turn, after any content the element holds. The root
carries the size class and `aria-label="Loading"`; content sits in a wrapper with a right
margin, then the three dot spans (the second and third delayed). Dot sizes sm 2 · md 3 · lg 4,
or a number of pixels.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `size` | `size` | `"sm" \| "md" \| "lg" \| string` | `"md"` | `sm`, `md`, `lg`, or a dot diameter in pixels. |

Slots: `(default)`

## Best Practices

**When to use**

- Loading Dots sit in copy for a short indeterminate wait: Saving, Building.
- In a button, set the loading attribute on Button instead of dots in the label.
- A layout placeholder is Skeleton; known progress is Progress; an icon-sized indeterminate wait is Spinner.

**Behavior**

- Pass size (a dot diameter in pixels) only when the default does not match the type next to it.
- Keep the label specific to the work in flight (Saving, Deploying, Uploading), so a wait over about a second still says what happens.
- Never put Loading Dots after a completed verb (Saved); the dots mean work goes on.

**Accessibility**

- Mark the wrapping element aria-live polite, so a screen reader picks up the label without an interruption.
- The dots are decorative; the text carries the meaning, so the element takes no aria-label.
- The dots stop under prefers-reduced-motion. Do not pair them with another animated indicator on the same line.

