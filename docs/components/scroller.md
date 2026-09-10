# Scroller

Display an overflowing list of items.

## Vertical

```html
<acme-scroller height="220" overflow="y" width="100%">
  <div style="display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:16px;flex:0 1 auto;width:400px">
    <div style="background:var(--ds-gray-1000);width:256px;height:256px"></div>
    <div style="background:var(--ds-gray-1000);width:256px;height:256px"></div>
  </div>
</acme-scroller>
```

## Horizontal

```html
<acme-scroller height="100%" overflow="x" width="100%">
  <div style="display:flex;flex-direction:row;align-items:stretch;justify-content:flex-start;gap:16px;flex:0 1 auto;min-width:120%">
    <div style="background:var(--ds-gray-1000);width:256px;height:256px"></div>
    <div style="background:var(--ds-gray-1000);width:256px;height:256px"></div>
    <div style="background:var(--ds-gray-1000);width:256px;height:256px"></div>
    <div style="background:var(--ds-gray-1000);width:256px;height:256px"></div>
  </div>
</acme-scroller>
```

## Free

```html
<acme-scroller height="220" overflow="both" width="100%">
  <div style="display:grid;grid-auto-flow:column;grid-template-rows:repeat(2,minmax(0,1fr));gap:16px">
    <div style="background:var(--ds-gray-1000);width:384px;height:384px"></div>
    <div style="background:var(--ds-gray-1000);width:384px;height:384px"></div>
    <div style="background:var(--ds-gray-1000);width:384px;height:384px"></div>
    <div style="background:var(--ds-gray-1000);width:384px;height:384px"></div>
    <div style="background:var(--ds-gray-1000);width:384px;height:384px"></div>
    <div style="background:var(--ds-gray-1000);width:384px;height:384px"></div>
  </div>
</acme-scroller>
```

## Vertical with buttons

Buttons will automatically scroll to a given direct child.

```html
<style>.gap-4::part(content){gap:16px}</style>
<div style="display:flex;max-width:max-content;flex-direction:column;gap:16px">
  <acme-scroller class="gap-4" height="220" overflow="y" with-buttons>
    <div style="background:var(--ds-gray-1000);width:384px;height:240px"></div>
    <div style="background:var(--ds-gray-1000);width:384px;height:240px"></div>
    <div style="background:var(--ds-gray-1000);width:384px;height:240px"></div>
    <div style="background:var(--ds-gray-1000);width:384px;height:240px"></div>
  </acme-scroller>
</div>
```

## Horizontal with buttons

Buttons will automatically scroll to a given direct child.

```html
<style>.gap-4::part(content){gap:16px}</style>
<div style="display:flex;flex-direction:column;gap:16px">
  <acme-scroller class="gap-4" height="100%" overflow="x" width="100%" with-buttons>
    <div style="background:var(--ds-gray-1000);width:384px;height:256px;flex-shrink:0"></div>
    <div style="background:var(--ds-gray-1000);width:384px;height:256px;flex-shrink:0"></div>
    <div style="background:var(--ds-gray-1000);width:384px;height:256px;flex-shrink:0"></div>
    <div style="background:var(--ds-gray-1000);width:384px;height:256px;flex-shrink:0"></div>
  </acme-scroller>
</div>
```

## `<acme-scroller>`

Scroller. A viewport that scrolls along `x`, `y` or `both` (the default), `width` by `height`
(a number is px, any other value a CSS length; both default to 100%), with a 40px fade at
every edge the content lies past. The position is re-read 100ms after the last scroll or size
change; while an edge is past the viewport the host carries `data-overflowing`. `with-buttons`
adds two round secondary buttons that scroll to the previous or next direct child: above the
viewport for `y`, below it for `x`, none for `both`. `gradient` replaces the fade's stops;
`mobile-grid` lays the children out in two equal columns on viewports between 470 and 670px.
The children sit in the default slot; the container that holds them is the `content` part
(the place for a gap between them).

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `width` | `width` | `string` | `"100%"` | The viewport's width: a number in px, or any CSS length. |
| `height` | `height` | `string` | `"100%"` | The viewport's height: a number in px, or any CSS length. |
| `overflow` | `overflow` | `"x" \| "y" \| "both"` | `"both"` | The axes that scroll. |
| `with-buttons` | `withButtons` | `boolean` | `false` | Two round buttons that scroll to the previous or next direct child: above the viewport for `y`, below it for `x`; none for `both`. |
| `gradient` | `gradient` | `string` | `""` | The fade's colour stops (a gradient stop list), in place of the theme's white or black run. |
| `mobile-grid` | `mobileGrid` | `boolean` | `false` | Lays the children out in two equal columns on viewports between 470 and 670px. |

Slots: `(default)`

## Best Practices

**When to use**

- Scroller holds an overflowing list of peer items along one axis: chip rows, log streams, code snippets, command palettes.
- y for stacked feeds, x for chip and tile rails, both only when the content really scrolls both ways (logs with very long lines).
- A paginated or virtualized data set past a few hundred items renders through a virtualization library inside the Scroller, not as every node in the DOM.

**Behavior**

- The buttons target direct children only. Items wrapped in extra layout nodes are invisible to them.
- The clipped axis shows an edge fade so the user sees there is more content past the viewport.
- Item widths and gaps stay consistent in a horizontal scroller. Ragged edges break the rhythm and make the rail look broken.

**Accessibility**

- Tab order follows DOM order, so items sit in reading order whatever the visual scroll direction.
- The buttons carry an aria-label that names the direction and the content (Scroll customer logos left), not a bare Previous / Next.
- Focusing an off-screen item scrolls it into view. The browser does this by default; a custom focus trap can break it.

