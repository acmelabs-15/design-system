# Choicebox

A large Radio or Checkbox: a bigger tap target with room for more detail.

## Single-select

```html
<acme-choicebox label="select a plan" type="radio" value="trial">
  <acme-choicebox-item description="Free for two weeks" title="Pro Trial" value="trial"></acme-choicebox-item>
  <acme-choicebox-item description="Get started now" title="Pro" value="pro"></acme-choicebox-item>
</acme-choicebox>
```

## Multi-select

```html
<acme-choicebox label="select a plan" type="checkbox">
  <acme-choicebox-item description="Free for two weeks" title="Pro Trial" value="trial"></acme-choicebox-item>
  <acme-choicebox-item description="Get started now" title="Pro" value="pro"></acme-choicebox-item>
</acme-choicebox>
```

## Disabled

```html
<div class="vstack" style="gap:24px;align-items:stretch">
  <acme-choicebox disabled label="Choicebox group disabled" show-label type="radio">
    <acme-choicebox-item description="Free for two weeks" title="Pro Trial" value="trial"></acme-choicebox-item>
    <acme-choicebox-item description="Get started now" title="Pro" value="pro"></acme-choicebox-item>
  </acme-choicebox>
  <acme-choicebox label="Single input disabled" show-label type="checkbox">
    <acme-choicebox-item description="Free for two weeks" disabled title="Pro Trial" value="trial"></acme-choicebox-item>
    <acme-choicebox-item description="Get started now" title="Pro" value="pro"></acme-choicebox-item>
  </acme-choicebox>
</div>
```

## Custom content

Content inside a tile shows once the tile is selected.

```html
<acme-choicebox label="select a plan" type="radio" value="trial">
  <acme-choicebox-item description="Free for two weeks" title="Pro Trial" value="trial">
    <div style="display:flex;justify-content:center;padding:8px">
      <acme-badge variant="trial">Trial</acme-badge>
    </div>
  </acme-choicebox-item>
  <acme-choicebox-item description="Get started now" title="Pro" value="pro">
    <div style="display:flex;justify-content:center;padding:8px">
      <acme-badge variant="blue">Pro</acme-badge>
    </div>
  </acme-choicebox-item>
</acme-choicebox>
```

## `<acme-choicebox>`

A group of acme-choicebox-item tiles with one value: a larger form of a radio group
(`type="radio"`, single-select: arrow keys move the choice, one tile is the Tab stop) or of a
set of checkboxes (`type="checkbox"`, multi-select: Space toggles a tile, `value` is a list).
A radiogroup or group that names itself through `label`, read to screen readers, or shown
above the list with `show-label` (a 13px label, as written); `disabled` reaches every tile;
`required` reports through the form. The list is a flex row of equal tiles, 12px apart
(`part="list"` to lay it out otherwise); `control-position` puts every tile's control at its
start. Form-associated: the chosen value(s) submit under `name`. Fires `acme-change` with
`{ value }`. Slot: default (acme-choicebox-item elements).

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `type` | `type` | `"radio" \| "checkbox"` | `"radio"` | radio (single-select) or checkbox (multi-select). |
| `label` | `label` | `string` | `""` | The group's name for assistive technology; shown above the list with `show-label`. |
| `show-label` | `showLabel` | `boolean` | `false` |  |
| `value` | `value` | `string \| string[]` | `""` | The chosen value; for a checkbox group a comma-separated list (an array on the property). |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `required` | `required` | `boolean` | `false` |  |
| `name` | `name` | `string` | `""` | Shared input name; generated when unset. |
| `control-position` | `controlPosition` | `"start" \| "end"` | `"end"` | Where every tile puts its control: `end` (default) or `start`. |

Slots: `(default)`

Events: `acme-change`

## `<acme-choicebox-item>`

One tile of an acme-choicebox: a bordered list item whose whole face is the label of its
control, a composed acme-radio or acme-checkbox at the row's end (or its start, set by the
group). The row holds the 14px title and description; a selected tile turns blue (border,
row background, text, control) and shows its slotted content under a divider. Hover and
press states are the tile's, keyed off attributes the Interaction controller sets
(data-hover, data-active, data-focus, data-focus-within); the selection and disabled states
are reflected off the group (data-checked, data-disabled). A disabled tile shows
`disabled-reason` in a tooltip; `interactive-content` renders the content beside the label,
so clicks inside it do not toggle the tile. The tile is a flex item of the group's row and
takes an equal share of it. Slot: default (the content shown while selected).

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `title` | `heading` | `string` | `""` | The tile's title (the `title` attribute is read into this property and removed, so no tooltip shows). |
| `description` | `description` | `string` | `""` |  |
| `value` | `value` | `string` | `""` |  |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `disabled-reason` | `disabledReason` | `string` | `""` | Shown in a tooltip over a disabled tile. |
| `interactive-content` | `interactiveContent` | `boolean` | `false` | The content sits beside the label: clicks inside it do not toggle the tile. |
| `checked` | `checked` | `boolean` | `false` | Set by the group: the tile is chosen. |
| — | `type` | `"radio" \| "checkbox"` | `"radio"` | Set by the group: radio or checkbox. |
| — | `name` | `string` | `""` | Set by the group: the shared input name. |
| — | `groupDisabled` | `boolean` | `false` | Set by the group: the whole group is disabled. |
| — | `controlPosition` | `"start" \| "end"` | `"end"` | Set by the group: where the control sits in the row. |
| — | `skipTab` | `boolean` | `false` | Set by the group: off the Tab sequence (roving tabindex); arrow keys reach it. |

Slots: `(default)`

Events: `acme-change`

## Best Practices

**When to use**

- A choice that gains from a larger tap target plus a description or an icon: a framework picker, a plan comparison, a deployment region with its latency.
- Single-select for choices that exclude each other, multi-select for choices that add up. Do not mix the two in one group.
- At most 4–6 tiles. Past that, use Select or Combobox so one field does not scroll the page. Plain text labels with no description are a Radio.

**Behavior**

- The whole tile is the click and focus target; a tap anywhere inside selects it. Do not nest buttons or links that would take the click.
- The selected state shows a check or a filled dot in the corner. The border highlight alone is not enough on a low-contrast screen.
- A disabled tile needs a Tooltip that says why (Available on Pro). A faded tile with no reason reads as broken.

**Content**

- Titles are parallel: one Title Case title and one sentence-case description per tile, ending in a period.
- The description does not repeat the title. It adds the differentiator ($20/mo · 100 GB bandwidth), not a synonym.
- An icon next to a title is decorative; when the icon is the only label, give the tile an aria-label that names the choice.

**Accessibility**

- Tiles are radios or checkboxes underneath, so keep them in a fieldset with a legend and screen readers announce the group.
- Arrow keys move within a single-select group; Space toggles in a multi-select group. Do not override those keys.
- Color is not the selection signal. The highlight border pairs with the corner check so colorblind users see what is active.

