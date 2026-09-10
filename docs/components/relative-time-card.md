# Relative Time Card

Popover to show a given date in local time.

## Default

```html
<acme-relative-time side="top">
  <acme-button>Hover Me</acme-button>
</acme-relative-time>
<script>root.querySelector("acme-relative-time").date = Date.now();</script>
```

## `<acme-relative-time>`

Relative time card: a moment shown as its age, with a hover card that gives the moment in full in
UTC and in the reader's zone. The trigger is the slotted content (a button, a link, a name) or,
with nothing slotted, the short age the element draws itself (`3 days ago`, `2 hours ago`,
`5 minutes ago`, `Just now`; refreshed every minute) as a 14px label in gray-900. The card is a
composed context card: it opens on hover after the card's own delay, on `side` (right by default)
at `align` (centre), `side-offset` (16) from the trigger and `align-offset` (0) along it; `shown`
opens it (the open bits, 1 for a hover), `disable-triggers` ignores the pointer, `hide` keeps it
closed, `inactive-timeout-ms` (250) is how long it stays after the pointer leaves, `no-padding`
drops its padding and `ignore-card-pointer-events` lets the pointer pass through it. Inside, a
column at least 300px wide: the full age in up to three units (`1 hour, 2 minutes, 3 seconds ago`,
in tabular figures, refreshed every second while the card can be seen), then a row per zone, UTC
first and the local zone second, each with the zone's abbreviation in a small monospace chip, the
date (`September 9, 2026`) and the clock time (`08:15:30 AM`) at the row's end. Dates and zones
read through `@internationalized/date`. `date` is the moment in epoch milliseconds; without one,
the slotted content stands alone and no card opens.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `date` | `date` | `number` | `0` | The moment, in epoch milliseconds. |
| `side` | `side` | `RelativeTimeSide` | `"right"` |  |
| `align` | `align` | `RelativeTimeAlign` | `"center"` |  |
| `side-offset` | `sideOffset` | `number` | `16` | The card's distance from the trigger, in pixels. |
| `align-offset` | `alignOffset` | `number` | `0` | The card's shift along the trigger, in pixels. |
| `ignore-card-pointer-events` | `ignoreCardPointerEvents` | `boolean` | `false` | The pointer passes through the card. |
| `no-padding` | `noPadding` | `boolean` | `false` | The card's content sits flush to its edge. |
| `hide` | `hide` | `boolean` | `false` | Keeps the card closed. |
| `inactive-timeout-ms` | `inactiveTimeoutMs` | `number` | `250` | How long the card stays after the pointer leaves, in milliseconds. |
| `shown` | `shown` | `number` | `0` | The card's open bits (1 for a hover); 0 leaves it to the pointer. |
| `disable-triggers` | `disableTriggers` | `boolean` | `false` | Ignores the pointer, so the card opens through `shown` alone. |

Slots: `(default)`

## Best Practices

- Use it wherever a recent timestamp appears in a scannable surface: Table cells, Entity rows, deploy lists, activity feeds. A static date older than seven days in body prose renders as Mar 14, 2026 directly.
- date is a number: epoch milliseconds. Do not pre-format it, and do not replace the trigger with a formatted string. The element's short age (2 minutes ago, 5 hours ago, 3 days ago) is the canonical form.
- No ago after the element. The short age already reads 2 minutes ago, so an extra word gives 2 minutes ago ago.
- Slotted content is for labels that are not times (Just now, Pending, Queued), where the formatter cannot describe the state.
- Add a leading label when the row is ambiguous on its own: Last deploy followed by the element. The card already shows absolute UTC and local time, so that copy does not repeat elsewhere on the row.

