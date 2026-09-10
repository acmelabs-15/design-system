# Load More Button

A full-width button that appends more items to a paginated list, with a loading state and layout variants.

## Default

```html
<acme-load-more>Load More</acme-load-more>
```

## Loading

```html
<acme-load-more loading>Loading...</acme-load-more>
```

## No Gap

no-gap removes the space above the button.

```html
<acme-load-more no-gap>Load More</acme-load-more>
```

## No Border Radius

no-border-radius squares the corners so the button sits flush with the list.

```html
<acme-load-more no-border-radius>Load More</acme-load-more>
```

## Custom Text

```html
<acme-load-more>Show More Results</acme-load-more>
```

## `<acme-load-more>`

Load more button. A full-width secondary submit button that appends more items to a list,
16px below it; the slot is the text, "Load More" by default. `loading` shows the spinner and
disables it; `no-gap` removes the space above; `no-border-radius` squares the corners so it
sits flush with the list; `placeholder` renders an empty block of the same height instead.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `loading` | `loading` | `boolean` | `false` |  |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `no-gap` | `noGap` | `boolean` | `false` |  |
| `no-border-radius` | `noBorderRadius` | `boolean` | `false` |  |
| `placeholder` | `placeholder` | `boolean` | `false` | An empty block of the button's height, while the list loads. |

Slots: `(default)`

