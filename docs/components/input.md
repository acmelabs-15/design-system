# Input

Retrieve text input from a user.

## Default

```html
<div class="row" style="gap:16px;align-items:flex-start;justify-content:space-between">
  <acme-input placeholder="Small" size="small"></acme-input>
  <acme-input placeholder="Default"></acme-input>
  <acme-input placeholder="Large" size="large"></acme-input>
</div>
```

## Add-ons and in-field places

An add-on is attached to the outside of the field: its own ground, and a hairline where the two meet. A start or end sits inside the field's own box. Each place takes text or an element alike.

```html
<div class="vstack" style="gap:24px;align-items:flex-start">
  <acme-input placeholder="Default">
    <svg slot="start-addon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true">
      <use href="#i-arrow-circle-up"/>
    </svg>
  </acme-input>
  <acme-input placeholder="Default">
    <svg slot="end-addon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true">
      <use href="#i-arrow-circle-up"/>
    </svg>
  </acme-input>
  <acme-input placeholder="Default">
    <span slot="start-addon">https://</span>
    <span slot="end-addon">.com</span>
  </acme-input>
  <acme-input placeholder="Default">
    <svg slot="start" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true">
      <use href="#i-arrow-circle-up"/>
    </svg>
    <svg slot="end" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true">
      <use href="#i-arrow-circle-up"/>
    </svg>
  </acme-input>
  <acme-input placeholder="Default">
    <span slot="start-addon">vercel/</span>
    <svg slot="end" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true">
      <use href="#i-arrow-circle-up"/>
    </svg>
  </acme-input>
</div>
```

## Disabled

```html
<div class="vstack" style="gap:16px;align-items:flex-start">
  <acme-input disabled placeholder="Disabled with placeholder"></acme-input>
  <acme-input disabled value="Disabled with value"></acme-input>
  <acme-input disabled placeholder="Disabled with a start add-on">
    <svg slot="start-addon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true">
      <use href="#i-arrow-circle-up"/>
    </svg>
  </acme-input>
  <acme-input disabled placeholder="Disabled with an end add-on">
    <svg slot="end-addon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true">
      <use href="#i-arrow-circle-up"/>
    </svg>
  </acme-input>
  <acme-input disabled placeholder="Disabled with add-ons">
    <span slot="start-addon">https://</span>
    <span slot="end-addon">.com</span>
  </acme-input>
  <acme-input disabled placeholder="Disabled with in-field places">
    <svg slot="start" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true">
      <use href="#i-arrow-circle-up"/>
    </svg>
    <svg slot="end" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true">
      <use href="#i-arrow-circle-up"/>
    </svg>
  </acme-input>
</div>
```

## Search

Escape clears the field.

```html
<acme-search placeholder="Enter some text..."></acme-search>
```

## ⌘K

Shows the ⌘ K keycaps to say the field opens a command palette. Once the field has text, the keycaps turn into Esc.

```html
<acme-search cmdk placeholder="Enter some text..."></acme-search>
```

## Error

```html
<div class="vstack" style="gap:32px;align-items:flex-start">
  <div>
    <acme-input error="An error message." placeholder="long-error@gmail.com" size="small"></acme-input>
  </div>
  <div>
    <acme-input error="An error message." placeholder="long-error@gmail.com" size="medium"></acme-input>
  </div>
  <div>
    <acme-input error="An error message." placeholder="long-error@gmail.com" size="large"></acme-input>
  </div>
</div>
```

## Label

```html
<div class="vstack" style="align-items:flex-start">
  <acme-input label="Label" placeholder="Label"></acme-input>
</div>
```

## Rounded with add-ons

```html
<acme-input placeholder="Label example" rounded>
  <span slot="start-addon">www.</span>
  <span slot="end-addon">.com</span>
</acme-input>
```

## Rounded with in-field places

```html
<acme-input placeholder="Label example" rounded>
  <span slot="start">www.</span>
  <span slot="end">.com</span>
</acme-input>
```

## `<acme-input>`

A single-line text field. A flex wrapper (32 / 36 / 40px, radius 6, large 8) holds the field and
up to four places around it, each a slot:

  `start-addon` / `end-addon`  attached to the outside of the field: its own ground, and a
                               hairline where the two meet.
  `start` / `end`              inside the field's own box: the field's ground, no line.

A place is where a thing sits, not what it holds, so every slot takes text or an element alike.

The wrapper carries the size, `error`, `rounded`, the occupied places, and the interaction states
(data-hover, data-focus: focus within the field, data-active). `label` renders the text above the
field; `error` renders the message under it and marks the field invalid. Form-associated and
labelable.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `label` | `label` | `string` | `""` | The text above the field. |
| `placeholder` | `placeholder` | `string` | `""` |  |
| `value` | `value` | `string` | `""` |  |
| `type` | `type` | `string` | `"text"` |  |
| `name` | `name` | `string` | `""` |  |
| `size` | `size` | `InputSize` | `"medium"` |  |
| `error` | `error` | `string` | `""` | The message under the field; the wrapper turns red and the field reads as invalid. |
| `rounded` | `rounded` | `boolean` | `false` | The pill shape. |
| `clearable` | `clearable` | `boolean` | `false` | Set by a clearable field: the end place loses its right padding. |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `readonly` | `readonly` | `boolean` | `false` |  |
| `required` | `required` | `boolean` | `false` |  |
| `autocomplete` | `autocomplete` | `string` | `"off"` |  |
| `width` | `width` | `string` | `""` | A fixed width for the wrapper, as CSS. |
| `aria-label` | `ariaLabelText` | `string` | `""` |  |
| `aria-labelledby` | `ariaLabelledby` | `string` | `""` |  |

Slots: `(default)`

Events: `acme-input`, `acme-change`

## Best Practices

**When to use**

- Input takes one line of free text: a name, a domain, a token.
- Textarea takes over as soon as the content can wrap to more lines.
- Combobox is for a value from a known list the user filters by typing.
- An inline search box is Search Input with a scoped placeholder like Search projects; do not drop a Search Input into an unrelated form.

**Behavior**

- Validate on blur, not on every keystroke; pass the message as the error attribute.
- Trim leading and trailing whitespace before submit, so example.com and example.com resolve to one value.
- Keep the field focusable while saving; pair disabled with a spinner only when input is impossible.
- Do not wrap a labelled Input in a Tooltip; put the explainer on a sibling icon button so the label stays announced.

**Content**

- Labels are short Title Case nouns: Project Name, Domain, Environment Variable Name.
- Placeholders show an example value (my-awesome-project, example.com), never an instruction like Enter your project name.
- Helper text is sentence case, one sentence with a period, on a sibling element wired through aria-describedby.
- Validation names the field and the constraint, ends in a period and skips please: Project name is required. Code must be 6 digits.

**Accessibility**

- A label attribute needs an id on the element so the label and the control stay associated for screen readers.
- An icon-only affordance in a row of inputs is a circle svg-only Button with an aria-label, never a bare icon.
- A Search Input placeholder names the scope (Search projects) so the role is clear without sight.

