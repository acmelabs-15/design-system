# Text With Copy Button

Display text alongside a button that copies the text to the clipboard.

## Default

```html
<acme-text-copy ellipsis success-message="Copied to clipboard" text-label="Copy" text-to-copy="lipsum"></acme-text-copy>
```

## With Small and Tertiary

```html
<acme-text-copy ellipsis success-message="Copied hashed digest to clipboard" text-label="Copy config digest" text-to-copy="edgeConfigData.digest"></acme-text-copy>
```

## `<acme-text-copy>`

Text with copy button. A full-width text button: the label (a `p` by default; `as` picks the
tag) beside a 16px icon that swaps from the copy glyph to a check for one second after a copy.
The leaving layer shrinks and fades (`data-phase="exiting"`) while the next one mounts. Renders
nothing without `text-to-copy`. `ellipsis` truncates the label; `show-tooltip` shows the text
to copy on hover; `success-message` goes out as a toast after a copy, and a failed copy raises an
error toast. Fires `acme-copy` on success. The label is the `text` part.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `text-to-copy` | `textToCopy` | `string` | `""` | The string that goes to the clipboard; without it the element renders nothing. |
| `text-label` | `textLabel` | `string` | `""` | The visible label. |
| `success-message` | `successMessage` | `string` | `""` | The toast after a successful copy. |
| `ellipsis` | `ellipsis` | `boolean` | `false` | Truncates the label with an ellipsis. |
| `show-tooltip` | `showTooltip` | `boolean` | `false` | Shows the text to copy in a tooltip on hover. |
| `as` | `as` | `string` | `"p"` | The label's tag. |

Events: `acme-copy`

