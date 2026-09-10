# Copy Button

A button that copies a given string to the clipboard and shows that it did.

## Default

```html
<acme-copy-button text-to-copy="lipsum" label="copy text"></acme-copy-button>
```

## `<acme-copy-button>`

Copy button. An icon-only button (secondary, square, medium by default) that writes
`text-to-copy` to the clipboard. Its icon is a stack of two layers, the check and the copy
glyph, that swap for one second after a successful copy (or while `copied` is set), with an
assertive status line for screen readers. A failed copy raises an error toast. Fires
`acme-copy` on success and `acme-copy-error` on failure; a slotted `icon` replaces the copy glyph.

The button inside is an `acme-button`, and its `button` part is forwarded with `exportparts`, so an
element that composes this one reaches the real button with `acme-copy-button::part(button)` rather
than landing on the host in between.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `text-to-copy` | `textToCopy` | `string` | `""` | The string that goes to the clipboard. |
| `label` | `label` | `string` | `""` | The accessible name: what is copied ("copy text"). |
| `title` | `title` | `string` | `""` | The native tooltip. |
| `variant` | `variant` | `ButtonVariant` | `"secondary"` |  |
| `shape` | `shape` | `"square" \| "circle" \| "rounded"` | `"square"` |  |
| `size` | `size` | `ButtonSize` | `"medium"` |  |
| `type` | `type` | `"button" \| "submit" \| "reset"` | `"button"` | The HTML button type. |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `copied` | `copied` | `boolean` | `false` | Shows the check instead of the copy glyph (controlled; the button also sets it for a second after a copy). |
| `normal` | `normal` | `ButtonColors` | — | Custom colors at rest; any of `normal`, `hover`, `active` switches the button to the custom variant. |
| `hover` | `hover` | `ButtonColors` | — |  |
| `active` | `active` | `ButtonColors` | — |  |

Slots: `icon`

Events: `acme-copy`, `acme-copy-error`

