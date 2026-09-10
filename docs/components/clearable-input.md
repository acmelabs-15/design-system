# Clearable Input

A text input with a clear button; Escape resets the value too.

## Default

```html
<acme-clearable-input aria-label="Demo clearable input" placeholder="Enter some text..."></acme-clearable-input>
```

## With Label

```html
<acme-clearable-input label="Email" placeholder="Enter your email..."></acme-clearable-input>
```

## With Cmdk

```html
<acme-clearable-input aria-label="Search with cmdk" cmdk placeholder="Search..."></acme-clearable-input>
```

## Disabled

```html
<acme-clearable-input aria-label="Disabled clearable input" disabled placeholder="Enter some text..." value="Some text"></acme-clearable-input>
```

## With Clear Callback

```html
<div class="vstack" style="gap:8px">
  <acme-clearable-input aria-label="Clearable input with callback" placeholder="Enter some text and clear..."></acme-clearable-input>
  <p class="text-copy-14" style="color:var(--ds-gray-900)">
    Cleared
    <output>0</output>
    times
  </p>
</div>
<script>let count = 0; root.querySelector('acme-clearable-input').addEventListener('acme-clear', () => { root.querySelector('output').textContent = String(++count); });</script>
```

## `<acme-clearable-input>`

A text field that clears itself: an acme-input whose suffix is a clear button with an Esc key
once the field has a value, and Escape clears too. `cmdk` shows ⌘ K keys instead, which slide
to Esc while the field has a value (`data-animate` on the field). Clearing fires `acme-input`
and `acme-clear` and returns focus to the field. Form-associated and labelable.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `string` | `""` |  |
| `placeholder` | `placeholder` | `string` | `""` |  |
| `label` | `label` | `string` | `""` | The text above the field. |
| `name` | `name` | `string` | `""` |  |
| `cmdk` | `cmdk` | `boolean` | `false` | Shows the ⌘ K keys, which slide to Esc while the field has a value. |
| `show-clear-button` | `showClearButton` | `boolean` | `true` | `"false"` hides the clear button. |
| `scroll-on-clear` | `scrollOnClear` | `boolean` | `true` | `"false"` keeps the page still when clearing returns focus to the field. |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `width` | `width` | `string` | `""` | A fixed width for the field, as CSS. |
| `aria-label` | `ariaLabelText` | `string` | `""` |  |

