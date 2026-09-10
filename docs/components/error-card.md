# Error Card

A card used to communicate an error state with a title and message.

## Default

```html
<acme-error-card heading="No credits left" error='{"message":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"}'></acme-error-card>
```

## `<acme-error-card>`

Error card: a red surface for a section or resource that failed to load. A red-200 column with
a 1px red-400 border, radius 8 and padding 16; the head centres a 16px icon and the 16/24 title.
`retry` appends a plain Retry control (the base button reset alone, a medium 16/24 red-900
label) that dispatches `acme-retry`; `retry-label` is its accessible name. `error` takes the
failure itself: its digest and message go to the console, the title is what the user reads.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `heading` | `heading` | `string` | `""` | The title line; the default slot adds rich content to it. |
| `error` | `error` | `ErrorCardError \| null` | `null` | The failure, `{ "message", "digest" }` as JSON: logged to the console, never rendered. |
| `retry` | `retry` | `boolean` | `false` | Shows the Retry control; a click on it dispatches `acme-retry`. |
| `retry-label` | `retryLabel` | `string` | `""` | The Retry control's accessible name. |

Slots: `(default)`

Events: `acme-retry`

