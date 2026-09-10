# Textarea

Retrieve multi-line user input.

## Default

```html
<acme-textarea aria-label="Default" placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." min-height="100"></acme-textarea>
```

## Disabled

```html
<acme-textarea aria-label="Disabled" disabled placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." min-height="100"></acme-textarea>
```

## Error

```html
<div class="vstack" style="gap:32px">
  <acme-textarea aria-label="With error (small)" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." error="There has been an error." size="small" min-height="100"></acme-textarea>
  <acme-textarea aria-label="With error (medium)" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." error="There has been an error." size="medium" min-height="100"></acme-textarea>
  <acme-textarea aria-label="With error (large)" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." error="There has been an error." size="large" min-height="100"></acme-textarea>
</div>
```

## Sizes

```html
<div class="vstack" style="gap:24px">
  <acme-textarea aria-label="Textarea" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." size="small" min-height="100"></acme-textarea>
  <acme-textarea aria-label="Textarea" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." size="medium" min-height="100"></acme-textarea>
  <acme-textarea aria-label="Textarea" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." size="large" min-height="100"></acme-textarea>
</div>
```

## Read Only

```html
<acme-textarea aria-label="Read only" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." readonly min-height="100"></acme-textarea>
```

## Rows

```html
<acme-textarea aria-label="Textarea with fixed rows" placeholder="Textarea with fixed number of rows" rows="5"></acme-textarea>
```

## `<acme-textarea>`

A multi-line text field: a full-width wrapper (radius 6, large 8) around a textarea padded
10 / 12 that does not resize by hand; `rows` fixes its height, `min-height` gives it a floor.
The wrapper carries the size and `error` modifiers and the interaction states (data-hover,
data-focus: focus within the field, data-active); `error` renders the message under it and
marks the field invalid. Form-associated and labelable.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `placeholder` | `placeholder` | `string` | `""` |  |
| `value` | `value` | `string` | `""` |  |
| `name` | `name` | `string` | `""` |  |
| `size` | `size` | `TextareaSize` | `"medium"` |  |
| `error` | `error` | `string` | `""` | The message under the field; the wrapper turns red and the field reads as invalid. |
| `rows` | `rows` | `number` | `0` | A fixed number of rows. |
| `min-height` | `minHeight` | `string` | `""` | The field's minimum height, as CSS (a number is px). |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `readonly` | `readonly` | `boolean` | `false` |  |
| `required` | `required` | `boolean` | `false` |  |
| `aria-label` | `ariaLabelText` | `string` | `""` |  |

Events: `acme-input`, `acme-change`

## Best Practices

- Use a Textarea for content that wraps to several lines (commit messages, descriptions, notes); an Input takes one value such as a name or a domain.
- Set a generous default rows and let the field grow only when the surface has vertical room; never push the primary actions below the fold.
- Validate on blur and pass a string to error to show the inline message; it replaces the helper text while the field is invalid.
- Trim leading and trailing whitespace on submit so a field of empty lines does not pass a required check.
- Labels are short Title Case nouns (Description, Release Notes); a placeholder shows an example value, not an instruction such as Enter a description.
- A validation message names the field and the constraint, ends with a period and skips please: Description is required. Release notes can’t exceed 500 characters.
- Helper text is one sentence in sentence case with a period, rendered as a sibling linked through aria-describedby.

