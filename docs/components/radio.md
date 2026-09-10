# Radio

One choice from a short set of options that the user can see all at once.

## Default

```html
<acme-radio-group label="Default Radio Example" value="one">
  <div class="vstack" style="gap:24px">
    <acme-radio value="one">Option 1</acme-radio>
    <acme-radio value="two">Option 2</acme-radio>
  </div>
</acme-radio-group>
```

## Radio disabled

```html
<acme-radio-group disabled label="Disabled Radio Example" value="one">
  <div class="vstack" style="gap:24px">
    <acme-radio value="one">Option 1</acme-radio>
    <acme-radio value="two">Option 2</acme-radio>
  </div>
</acme-radio-group>
```

## Radio required

```html
<form class="vstack" style="gap:24px;align-items:flex-start">
  <acme-radio-group label="Required Radio Example" required>
    <div class="vstack" style="gap:16px">
      <acme-radio value="one">Option 1</acme-radio>
      <acme-radio value="two">Option 2</acme-radio>
    </div>
  </acme-radio-group>
  <acme-button size="small" variant="primary">Submit</acme-button>
</form>
<script>const form = root.querySelector("form"); form.addEventListener("submit", (e) => e.preventDefault()); root.querySelector("acme-button").addEventListener("click", () => form.requestSubmit());</script>
```

## Radio headless

The group without its item markup: any label can wrap a bare radio.

```html
<acme-radio-group aria-label="Options" value="one">
  <div class="vstack" style="gap:24px">
    <label style="display:flex;justify-content:space-between">
      <span>Option 1</span>
      <acme-radio value="one"></acme-radio>
    </label>
    <label style="display:flex;justify-content:space-between">
      <span>Option 2</span>
      <acme-radio value="two"></acme-radio>
    </label>
  </div>
</acme-radio-group>
```

## Radio standalone

A single radio with no visible label, for custom UI.

```html
<li style="display:flex;gap:8px;list-style:none">
  <span>Option 1</span>
  <acme-radio aria-label="Option 1" value="one" checked></acme-radio>
</li>
```

## `<acme-radio-group>`

A group of acme-radio items with one value: a radiogroup that names itself through `label`
(read to screen readers, not shown) or `aria-label`. Arrow keys move the selection and skip
disabled items, Tab leaves the group; `disabled` reaches every item; `required` reports
through the form. Slot: default.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `label` | `label` | `string` | `""` | The group's name for assistive technology; not shown. |
| `aria-label` | `hiddenLabel` | `string` | `""` | Accessible name when there is no label. |
| `value` | `value` | `string` | `""` | The selected radio's value. |
| `name` | `name` | `string` | `""` | Shared input name; generated when unset. |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `required` | `required` | `boolean` | `false` |  |

Slots: `(default)`

Events: `acme-change`

## `<acme-radio>`

One choice of a set: a visually hidden radio, a 16px circle that fills with an 8px dot when
checked, and the text (13px). The root is a label when the element has text of its own, and a
plain span otherwise, so an outer label can wrap it. The root carries the interaction states
(data-hover, data-focus, data-active) and the own states (data-checked, data-disabled).
Form-associated and labelable; inside acme-radio-group the group sets its name, checked
state and Tab stop.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `checked` | `checked` | `boolean` | `false` |  |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `required` | `required` | `boolean` | `false` |  |
| `name` | `name` | `string` | `""` |  |
| `value` | `value` | `string` | `""` |  |
| `aria-label` | `label` | `string` | `""` | Accessible name for a radio with no visible text. |
| — | `groupDisabled` | `boolean` | `false` | Set by the group: disabled through the group. |
| — | `skipTab` | `boolean` | `false` | Set by the group: off the Tab sequence (roving tabindex); arrow keys reach it. |

Slots: `(default)`

Events: `acme-change`

## Best Practices

**When to use**

- One choice from two to six mutually exclusive options where seeing every option matters: deploy regions, plan tiers, billing cycle.
- Past six options, use Select or Combobox so the list does not take over the form.
- A binary on/off is a Toggle. An option with an icon, a description or a badge is a Choicebox.

**Behavior**

- Pre-select the safest default so the field reads as configured, never as required-but-empty. Leave it empty only when the choice has real consequences and a deliberate pick is wanted.
- required goes on the group, not on one option. A single required radio means nothing.
- Arrow keys move the selection inside the group and skip disabled options. Tab moves to the next field, not the next radio.

**Content**

- The group label is a Title Case noun such as Deployment Region or Billing Cycle, rendered as the legend or as a sibling label tied with aria-labelledby.
- Option labels are parallel: same part of speech, same length, same register. Monthly / Yearly, not Monthly / Pay yearly.
- A disabled option gets a Tooltip that says why (Available on Pro and Enterprise). A greyed radio with no reason looks broken.

**Accessibility**

- Related radios sit in a fieldset with a legend, so screen readers announce the group name before each option.
- A standalone radio with no visible label needs an aria-label that describes the choice. A radio never ships without an accessible name.
- Keep the focus ring and its offset. A CSS hack that drops them leaves keyboard users unsure which option has focus.

