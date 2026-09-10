# Label

Accessible text label for form controls.

## Default

```html
<acme-label for="test-input" value="This is a label"></acme-label>
```

## With Input

with-input adds the spacing above the input; for focuses the input on click.

```html
<acme-label for="test-input" value="Email Address" with-input></acme-label>
<acme-input id="test-input" placeholder="Enter email address..."></acme-input>
```

## Bypass Casing

bypass-casing keeps the text as written.

```html
<acme-label bypass-casing for="test-input" value="Email address" with-input></acme-label>
<acme-input id="test-input" placeholder="Enter email address..."></acme-input>
```

## `<acme-label>`

Label: the text above a form control. The label element carries `for` and the modifier
classes; the text sits in a block of its own, 13px gray-900 with an 8px bottom margin,
capitalized unless `bypass-casing`. A click focuses the element `for` names, in the same
root as the label.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `string` | `""` | The label text; content in the default slot follows it. |
| `bypass-casing` | `bypassCasing` | `boolean` | `false` | Keeps the text as written. |
| `with-input` | `withInput` | `boolean` | `false` | The label of an input that follows. |
| `for` | `for` | `string` | `""` | The id of the control the label names. |

Slots: `(default)`

