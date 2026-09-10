# Calendar

A calendar from which the user picks a date or a range of dates.

## Default

```html
<div style="display:flex;justify-content:center;padding:48px 0">
  <acme-calendar allow-clear></acme-calendar>
</div>
<script>const iso = (d) => d.toLocaleDateString('en-CA'); const now = new Date(); for (const c of root.querySelectorAll('acme-calendar[allow-clear]')) { c.minValue = iso(new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())); c.maxValue = iso(new Date(now.getFullYear(), now.getMonth() + 2, now.getDate())); }</script>
```

## Horizontal Layout

horizontal-layout lays the form and the month grid side by side inside the popover.

```html
<div style="display:flex;justify-content:center;padding:48px 0">
  <acme-calendar allow-clear horizontal-layout show-time-input="false" popover-alignment="center"></acme-calendar>
</div>
```

## Sizes

medium (the default) or small.

```html
<div class="vstack" style="gap:48px;padding:48px 0">
  <div>
    <p style="font-family:var(--mono);font-size:14px;line-height:20px;color:var(--ds-gray-900);margin-bottom:16px">small</p>
    <div class="row" style="gap:16px 16px;row-gap:48px;align-items:flex-start">
      <acme-calendar allow-clear size="small"></acme-calendar>
      <acme-calendar allow-clear compact size="small" presets='{"last-3-days":{"text":"Last 3 Days","days":3},"last-7-days":{"text":"Last 7 Days","weeks":1},"last-14-days":{"text":"Last 14 Days","weeks":2},"last-month":{"text":"Last Month","months":1}}'></acme-calendar>
      <acme-calendar allow-clear stacked size="small" presets='{"last-3-days":{"text":"Last 3 Days","days":3},"last-7-days":{"text":"Last 7 Days","weeks":1},"last-14-days":{"text":"Last 14 Days","weeks":2},"last-month":{"text":"Last Month","months":1}}'></acme-calendar>
      <acme-calendar size="small" presets='{"last-3-days":{"text":"Last 3 Days","days":3},"last-7-days":{"text":"Last 7 Days","weeks":1},"last-14-days":{"text":"Last 14 Days","weeks":2},"last-month":{"text":"Last Month","months":1}}'></acme-calendar>
    </div>
  </div>
  <div>
    <p style="font-family:var(--mono);font-size:14px;line-height:20px;color:var(--ds-gray-900);margin-bottom:16px">default / medium</p>
    <div class="row" style="gap:16px 16px;row-gap:48px;align-items:flex-start">
      <acme-calendar allow-clear></acme-calendar>
      <acme-calendar allow-clear compact presets='{"last-3-days":{"text":"Last 3 Days","days":3},"last-7-days":{"text":"Last 7 Days","weeks":1},"last-14-days":{"text":"Last 14 Days","weeks":2},"last-month":{"text":"Last Month","months":1}}'></acme-calendar>
      <acme-calendar allow-clear stacked presets='{"last-3-days":{"text":"Last 3 Days","days":3},"last-7-days":{"text":"Last 7 Days","weeks":1},"last-14-days":{"text":"Last 14 Days","weeks":2},"last-month":{"text":"Last Month","months":1}}'></acme-calendar>
      <acme-calendar presets='{"last-3-days":{"text":"Last 3 Days","days":3},"last-7-days":{"text":"Last 7 Days","weeks":1},"last-14-days":{"text":"Last 14 Days","weeks":2},"last-month":{"text":"Last Month","months":1}}'></acme-calendar>
    </div>
  </div>
</div>
<script>const iso = (d) => d.toLocaleDateString('en-CA'); const now = new Date(); for (const c of root.querySelectorAll('acme-calendar[allow-clear]')) { c.minValue = iso(new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())); c.maxValue = iso(new Date(now.getFullYear(), now.getMonth() + 2, now.getDate())); }</script>
```

## Presets

Common ranges as buttons.

```html
<div style="display:flex;justify-content:center;padding:48px 0">
  <acme-calendar presets='{"last-3-days":{"text":"Last 3 Days","days":3},"last-7-days":{"text":"Last 7 Days","weeks":1},"last-14-days":{"text":"Last 14 Days","weeks":2},"last-month":{"text":"Last Month","months":1}}'></acme-calendar>
</div>
```

## Compact

```html
<div style="display:flex;justify-content:center;padding:48px 0">
  <acme-calendar compact presets='{"last-3-days":{"text":"Last 3 Days","days":3},"last-7-days":{"text":"Last 7 Days","weeks":1},"last-14-days":{"text":"Last 14 Days","weeks":2},"last-month":{"text":"Last Month","months":1}}'></acme-calendar>
</div>
```

## Stacked

```html
<div style="display:flex;justify-content:center;padding:48px 0">
  <acme-calendar presets='{"last-3-days":{"text":"Last 3 Days","days":3},"last-7-days":{"text":"Last 7 Days","weeks":1},"last-14-days":{"text":"Last 14 Days","weeks":2},"last-month":{"text":"Last Month","months":1}}' stacked></acme-calendar>
</div>
```

## Presets with default value

Common ranges, with one of them selected from the start.

```html
<div style="display:flex;justify-content:center;padding:48px 0">
  <acme-calendar preset-index="2" presets='{"last-3-days":{"text":"Last 3 Days","days":3},"last-7-days":{"text":"Last 7 Days","weeks":1},"last-14-days":{"text":"Last 14 Days","weeks":2},"last-month":{"text":"Last Month","months":1}}' stacked></acme-calendar>
</div>
```

## Min and max dates

The earliest and latest dates the user can pick.

```html
<div style="display:flex;justify-content:center;padding:48px 0">
  <acme-calendar></acme-calendar>
</div>
<script>const iso = (d) => d.toLocaleDateString('en-CA'); const c = root.querySelector('acme-calendar'); c.minValue = iso(new Date(Date.now() - 864e5)); // yesterday c.maxValue = iso(new Date(Date.now() + 864e5)); // tomorrow</script>
```

## Pinned timezone

pinned-timezone locks the calendar to one timezone. It shows as read-only text instead of a select.

```html
<div style="display:flex;justify-content:center;padding:48px 0">
  <acme-calendar pinned-timezone="America/Los_Angeles" popover-alignment="center"></acme-calendar>
</div>
```

## `<acme-calendar>`

Geist Calendar: a date-range picker behind a secondary trigger labelled with the chosen range; a 280px popover with Start / End inputs, a timezone select, Apply, and the month grid (32px cells, blue-900 selection). Presets are real buttons; `compact` and `stacked` join a period combobox to the trigger; `horizontal-layout` puts the form beside the grid.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `string` | `""` | The start date (ISO `YYYY-MM-DD`). |
| `end` | `end` | `string` | `""` | The end date (ISO). |
| `min-value` | `minValue` | `string` | `""` | The earliest pickable date (ISO or any Date string). |
| `max-value` | `maxValue` | `string` | `""` | The latest pickable date. |
| `single` | `single` | `boolean` | `false` | Pick one date instead of a range. |
| `allow-clear` | `allowClear` | `boolean` | `false` | A clear button next to the trigger once a value is set. |
| `horizontal-layout` | `horizontalLayout` | `boolean` | `false` | Form beside the month grid instead of above it. |
| `compact` | `compact` | `boolean` | `false` | Joins a period combobox to the left of the trigger. |
| `stacked` | `stacked` | `boolean` | `false` | Stacks the period combobox above the trigger. |
| `size` | `size` | `"medium" \| "small"` | `"medium"` | medium (default) or small: a 32px trigger and 28px day cells. |
| `presets` | `presets` | `CalendarPresets` | `{}` | Common ranges: `{ "last-7-days": { "text": "Last 7 Days", "days": 7 } }` or an array; `start`/`end` may be fixed dates. |
| `preset-index` | `presetIndex` | `number` | `-1` | The preset selected at first render (0-based). |
| `show-time-input` | `showTimeInput` | `boolean` | `true` | Start and end time inputs in the form; `show-time-input="false"` hides them. |
| `popover-alignment` | `popoverAlignment` | `"start" \| "center" \| "end"` | `"start"` | Where the popover aligns to the trigger: start · center · end. |
| `pinned-timezone` | `pinnedTimezone` | `string` | `""` | Locks the timezone; it shows as read-only text instead of a select. |
| `open` | `open` | `boolean` | `false` |  |
| `static` | `static` | `boolean` | `false` | Renders the popover inline and always open (for docs and tests). |
| `placeholder` | `placeholder` | `string` | `"Select Date"` |  |

Events: `acme-change`

## Best Practices

**When to use**

- Analytics ranges, and any picker where the day of the week and the month matter.
- For an ISO date pasted whole, or shorthand like 7d, use a free-form Input.
- Give presets for the common ranges (Last 7 Days, Month to Date) so the user lands on the right window in one click.
- Pair the horizontal layout with live results next to the calendar; in a narrow surface such as a sidebar, use the stacked layout.

**Behavior**

- Set min-value and max-value to the data window so nobody picks outside the retention range.
- Default to the user's locale and timezone; never show UTC to a US-Pacific viewer without saying so.
- The trigger label is the chosen range (Apr 1 – Apr 28, 2026); once a value is set, it never falls back to Pick a date.
- The range stays when the popover closes and opens again, so the user can change the end date without picking the start again.

**Accessibility**

- Focus stays inside the popover: Tab cycles the day cells and the presets, not the page behind.
- Arrow keys move by day, Shift + arrow by week, Page Up and Page Down by month.
- A polite live region announces the range (From Apr 1 to Apr 28) after the second click.
- Each preset is a real button with a Title Case label (Last 30 Days), not a menu item without keyboard handling.

