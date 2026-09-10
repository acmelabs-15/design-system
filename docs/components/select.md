# Select

Display a dropdown list of items.

## Sizes

```html
<div class="row" style="flex-wrap:wrap;gap:0;align-items:stretch">
  <div style="display:flex;flex-direction:column;align-items:flex-start;flex:1;min-width:1px;max-width:100%">
    <acme-select aria-label="Small" placeholder="Small" size="small">
      <option>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
    </acme-select>
  </div>
  <div style="display:flex;flex-direction:column;align-items:flex-start;flex:1;min-width:1px;max-width:100%">
    <acme-select aria-label="Default" placeholder="Default">
      <option>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
    </acme-select>
  </div>
  <div style="display:flex;flex-direction:column;align-items:flex-start;flex:1;min-width:1px;max-width:100%">
    <acme-select aria-label="Large" placeholder="Large" size="large">
      <option>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
    </acme-select>
  </div>
</div>
```

## Prefix and suffix

```html
<div class="row" style="flex-wrap:wrap;gap:0;align-items:stretch">
  <div style="display:flex;flex-direction:column;align-items:flex-start;flex:1;min-width:1px;max-width:100%">
    <acme-select aria-label="Small" placeholder="Small" size="small">
      <svg slot="prefix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true">
        <use href="#i-arrow-circle-up"/>
      </svg>
      <svg slot="suffix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true">
        <use href="#i-arrow-circle-up"/>
      </svg>
    </acme-select>
  </div>
  <div style="display:flex;flex-direction:column;align-items:flex-start;flex:1;min-width:1px;max-width:100%">
    <acme-select aria-label="Default" placeholder="Default">
      <svg slot="prefix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true">
        <use href="#i-arrow-circle-up"/>
      </svg>
      <svg slot="suffix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true">
        <use href="#i-arrow-circle-up"/>
      </svg>
    </acme-select>
  </div>
  <div style="display:flex;flex-direction:column;align-items:flex-start;flex:1;min-width:1px;max-width:100%">
    <acme-select aria-label="Large" placeholder="Large" size="large">
      <svg slot="prefix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true">
        <use href="#i-arrow-circle-up"/>
      </svg>
      <svg slot="suffix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true">
        <use href="#i-arrow-circle-up"/>
      </svg>
    </acme-select>
  </div>
</div>
```

## Disabled

```html
<acme-select aria-label="Disabled" disabled placeholder="Disabled with placeholder"></acme-select>
```

## Error

```html
<div class="row" style="flex-wrap:wrap;gap:0;align-items:stretch">
  <div style="display:flex;flex-direction:column;align-items:flex-start;flex:1;min-width:1px;max-width:100%">
    <acme-select aria-label="Small with error" error="Please select a value." placeholder="Small" size="small"></acme-select>
  </div>
  <div style="display:flex;flex-direction:column;align-items:flex-start;flex:1;min-width:1px;max-width:100%">
    <acme-select aria-label="Default with error" error="Please select a value." placeholder="Default"></acme-select>
  </div>
  <div style="display:flex;flex-direction:column;align-items:flex-start;flex:1;min-width:1px;max-width:100%">
    <acme-select aria-label="Large with error" error="Please select a value." placeholder="Large" size="large"></acme-select>
  </div>
</div>
```

## Label

```html
<acme-select label="My label" placeholder="With label"></acme-select>
```

## With options

```html
<div class="row" style="gap:16px;align-items:flex-start">
  <div>
    <acme-select aria-label="Fruit" placeholder="Select a fruit">
      <option value="apple">Apple</option>
      <option value="orange">Orange</option>
      <option value="banana">Banana</option>
      <option value="grape">Grape</option>
    </acme-select>
  </div>
  <div>
    <acme-select aria-label="Fruit with default value" value="banana" placeholder="With default value">
      <option value="apple">Apple</option>
      <option value="orange">Orange</option>
      <option value="banana">Banana</option>
      <option value="grape">Grape</option>
    </acme-select>
  </div>
</div>
```

## Required

```html
<acme-select label="Required field" placeholder="Please select an option" required>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
  <option value="option3">Option 3</option>
</acme-select>
```

## `<acme-select>`

A native select with a styled face. A relative flex wrapper holds the field (32 / 36 / 40px,
radius 6, large 8, a hairline ring) and, at its sides, a prefix cell (the `prefix` slot) and a
suffix cell (the `suffix` slot, a chevron by default; `suffix="false"` drops the cell). Options
come from `<option>` children (an `<optgroup>` is kept) or the `options` property. The wrapper
carries the size, `error`, `disabled`, `type="secondary"` (no ring, the field shifted left) and
cell modifiers, and the interaction states (data-hover; data-focus for any focus of the field).
`placeholder` is a disabled first option; a value equal to it reads gray. `label` renders the
text above the field (capitalized unless `bypass-casing`), `with-label="false"` drops the label
element around the field, `error` renders the message under it and marks the field invalid,
`width` sizes the label element and the message. Form-associated and labelable; `acme-change`
carries the value.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `label` | `label` | `string` | `""` | The text above the field. |
| `placeholder` | `placeholder` | `string` | `""` | The disabled first option; its text is its value. |
| `value` | `value` | `string` | `""` |  |
| `name` | `name` | `string` | `""` |  |
| `size` | `size` | `SelectSize` | `"medium"` |  |
| `type` | `type` | `"default" \| "secondary"` | `"default"` | `secondary`: no ring, gray-900 text, the field shifted 12px left. |
| `error` | `error` | `string` | `""` | The message under the field; the field reads as invalid and its ring turns red. |
| `width` | `width` | `string` | `""` | A fixed width for the label element and the message, as CSS. |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `required` | `required` | `boolean` | `false` |  |
| `suffix` | `suffix` | `boolean` | `true` | `"false"` drops the suffix cell (the chevron). |
| `with-label` | `withLabel` | `boolean` | `true` | `"false"` renders the field without the label element around it. |
| `bypass-casing` | `bypassCasing` | `boolean` | `false` | Keeps the label text as written (no capitalization). |
| `aria-label` | `ariaLabelText` | `string` | `""` |  |
| `aria-labelledby` | `ariaLabelledby` | `string` | `""` |  |
| `aria-describedby` | `ariaDescribedby` | `string` | `""` |  |
| `options` | `options` | `SelectOption[]` | `[]` | Options set from script, in place of `<option>` children. |

Slots: `prefix`, `suffix`

Events: `acme-change`

## Best Practices

- Use a Select for a short fixed list, under about ten items, where typing adds nothing. Move to Combobox once filtering helps.
- Use Multi Select when more than one value can be picked. Use Switch for a segmented choice of two or three options.
- Group a list longer than about ten items with native optgroup; there is no group element of its own.
- Write short options in Title Case and keep brand names canonical (Next.js, not NextJS). Keep one register across the list.
- The label is a short Title Case noun (Framework, Region), passed with the label attribute.
- The placeholder names the action (Select a framework). Do not restate the label, and avoid Choose one… or Pick.
- Validate on blur and pass the message in error. The message names the field and ends with a period (Select a framework.).
- Keep a labelled Select out of a Tooltip. Put the hint on a sibling icon button so the label is still announced.

