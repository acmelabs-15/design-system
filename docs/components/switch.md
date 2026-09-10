# Switch

Choose between a set of options.

## Default

Give every control enough width so the group does not jump when the active option changes.

```html
<div class="vstack" style="align-items:flex-start">
  <acme-switch name="default">
    <acme-switch-control default-checked label="Source" value="source"></acme-switch-control>
    <acme-switch-control label="Output" value="output"></acme-switch-control>
  </acme-switch>
</div>
```

## Disabled

```html
<div class="vstack" style="align-items:flex-start">
  <acme-switch name="view-mode">
    <acme-switch-control default-checked label="Source" value="source" disabled></acme-switch-control>
    <acme-switch-control label="Output" value="output" disabled></acme-switch-control>
  </acme-switch>
</div>
```

## Sizes

```html
<div class="row" style="align-items:flex-start;gap:24px">
  <acme-switch name="sizes-small" size="small">
    <acme-switch-control default-checked label="Source" value="source"></acme-switch-control>
    <acme-switch-control label="Output" value="output"></acme-switch-control>
  </acme-switch>
  <acme-switch name="sizes-default">
    <acme-switch-control default-checked label="Source" value="source"></acme-switch-control>
    <acme-switch-control label="Output" value="output"></acme-switch-control>
  </acme-switch>
  <acme-switch name="sizes-large" size="large">
    <acme-switch-control default-checked label="Source" value="source"></acme-switch-control>
    <acme-switch-control label="Output" value="output"></acme-switch-control>
  </acme-switch>
</div>
```

## Full width

A control directly inside the group takes the group's size; its own size applies only when another element wraps it.

```html
<acme-switch name="full-width" style="width:100%">
  <acme-switch-control default-checked label="Source" value="source" size="large"></acme-switch-control>
  <acme-switch-control label="Output" value="output" size="large"></acme-switch-control>
</acme-switch>
```

## Tooltip

```html
<div class="vstack" style="align-items:flex-start">
  <acme-switch name="view-mode">
    <acme-tooltip desktop-only text="View Source">
      <acme-switch-control default-checked label="Source" name="tooltip" size="large" value="source"></acme-switch-control>
    </acme-tooltip>
    <acme-tooltip desktop-only text="View Output">
      <acme-switch-control label="Output" name="tooltip" size="large" value="output"></acme-switch-control>
    </acme-tooltip>
  </acme-switch>
</div>
```

## Icon

```html
<div class="row" style="align-items:flex-start;gap:24px">
  <acme-switch name="icons-small" size="small">
    <acme-switch-control default-checked label="Grid" value="source">
      <svg slot="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <use href="#i-grid"/>
      </svg>
    </acme-switch-control>
    <acme-switch-control label="List" value="output">
      <svg slot="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <use href="#i-list"/>
      </svg>
    </acme-switch-control>
  </acme-switch>
  <acme-switch name="icons-default">
    <acme-switch-control default-checked label="Grid" value="source">
      <svg slot="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <use href="#i-grid"/>
      </svg>
    </acme-switch-control>
    <acme-switch-control label="List" value="output">
      <svg slot="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <use href="#i-list"/>
      </svg>
    </acme-switch-control>
  </acme-switch>
  <acme-switch name="icons-large" size="large">
    <acme-switch-control default-checked label="Grid" value="source">
      <svg slot="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <use href="#i-grid"/>
      </svg>
    </acme-switch-control>
    <acme-switch-control label="List" value="output">
      <svg slot="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <use href="#i-list"/>
      </svg>
    </acme-switch-control>
  </acme-switch>
</div>
```

## `<acme-switch>`

Segmented selector for two or three mutually exclusive views, with radio semantics. Children:
acme-switch-control with `value` and `label`. The group owns the selection: it hands every
direct control its `name`, `size` and `checked-color` (a control wrapped in another element,
such as a tooltip, keeps its own size), keeps one control checked, moves the selection with
the arrow keys, and reports the value to its form. Sizes small 32 / medium 36 / large 40.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `string` | `""` | The checked control's value. |
| `name` | `name` | `string` | `""` | Groups the radios; the form value is submitted under this name. |
| `size` | `size` | `SwitchSize` | `"medium"` |  |
| `hide-border` | `hideBorder` | `boolean` | `false` | Drops the hairline ring around the group. |
| `checked-color` | `checkedColor` | `string` | `""` | Background of the checked control (default gray-100), handed to every control. |

Slots: `(default)`

Events: `acme-change`

## `<acme-switch-control>`

One option of an acme-switch: a visually hidden radio and a padded label box. The root carries
the interaction states (data-hover, data-focus, data-active) and the own states (data-checked,
data-disabled); the box holds the text, or the `icon` slot with the text read to screen readers
only. The icon is sized 16px, 20px in a large control. A control directly inside a group takes
the group's size; a wrapped one (a tooltip) uses its own.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `string` | `""` |  |
| `label` | `label` | `string` | `""` | The text; read to screen readers when the `icon` slot carries the meaning. |
| `name` | `name` | `string` | `""` | Own radio name; the group's name wins inside a group. |
| `checked` | `checked` | `boolean` | `false` |  |
| `default-checked` | `defaultChecked` | `boolean` | `false` | Checked on first mount; the group then owns the state. |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `size` | `size` | `"" \| "small" \| "medium" \| "large"` | `""` | Own size, for a control the group does not reach directly. |
| `checked-color` | `checkedColor` | `string` | `""` | Background of the box when checked (default gray-100). |

Slots: `icon`, `(default)`

Events: `acme-switch-select`

## Best Practices

- A Switch is a segmented selector for two or three mutually exclusive views of the same surface, such as Source and Output.
- A boolean on/off setting is a Toggle. A Switch has radio semantics, so its options exclude each other instead of reading as checkboxes.
- Past three options, or when a label grows past a couple of words, move to Tabs or a Select.
- Pass a name so the radios form one group; without it more than one option can look selected.
- Set default-checked (or the group's value) on exactly one control so the group starts in a defined state.
- Pad each control so the widest label fits without the active pill resizing on selection. Test with the longest label in the set.
- Title Case each label. Keep labels to one or two words and parallel: Source / Output, not Source / Show output.
- Give every control a label, even when an icon carries the meaning; the element reads it to screen readers and hides it visually for icon-only controls.
- Pair an icon-only Switch with a Tooltip on each control so sighted users get the same label assistive tech receives.

