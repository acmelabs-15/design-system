# Stat

The one component for a headline figure: label and context, the value with its unit and trend, then a delta, a description, a meter, a spark or a foot. House component; Geist has no page for it.

## Cells

Stats sit in the cells grid; each is a cell.

```html
<div class="cells" style="--cols:3">
  <acme-stat class="cell" label="Runway" context="cash + net severance" unit="mo">
    6.6
    <acme-trend slot="trend" direction="up">+1.4</acme-trend>
    <acme-stat-desc slot="desc">On $39,400.</acme-stat-desc>
  </acme-stat>
  <acme-stat class="cell" label="Cash today" meter="48" meter-label="$6,000 of $12,400">$8,429</acme-stat>
  <acme-stat class="cell" label="Burn">
    $6,000
    <acme-spark slot="spark" points="[1,3,2,5,4,6]"></acme-spark>
  </acme-stat>
</div>
```

## Delta, icon, foot

```html
<div class="cells" style="--cols:2">
  <acme-stat class="cell" label="Revenue" context="MTD">
    <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
      <use href="#i-dollar"/>
    </svg>
    $62,450
    <acme-stat-delta slot="delta" tone="good">
      <acme-trend pill direction="up" note="vs last month">+6.03%</acme-trend>
    </acme-stat-delta>
  </acme-stat>
  <acme-stat class="cell" label="Errors" title-label>
    14
    <acme-badge slot="end" hue="red" subtle size="small">Alert</acme-badge>
    <acme-stat-foot slot="foot" bar>3 new since yesterday</acme-stat-foot>
  </acme-stat>
</div>
```

## Meter warning

```html
<div class="cells" style="--cols:2">
  <acme-stat class="cell" label="Bandwidth" unit="GB" meter="92" meter-label="92 of 100 GB" meter-warn>92</acme-stat>
  <acme-stat class="cell" label="Seats" meter="40" meter-label="4 of 10">4</acme-stat>
</div>
```

## `<acme-stat>`

House Stat: the one component for a headline figure. Slots: label, context, icon, end, default (value), unit, trend, delta, desc, meter, spark, meta, foot.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `label` | `label` | `string` | `""` |  |
| `context` | `context` | `string` | `""` |  |
| `unit` | `unit` | `string` | `""` |  |
| `title-label` | `titleLabel` | `boolean` | `false` |  |
| `meter` | `meter` | `number` | `-1` |  |
| `meter-label` | `meterLabel` | `string` | `""` |  |
| `meter-warn` | `meterWarn` | `boolean` | `false` |  |

Slots: `icon`, `label`, `context`, `end`, `(default)`, `trend`, `delta`, `desc`, `meter-label`, `spark`, `meta`, `foot`

## `<acme-stat-delta>`

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `tone` | `tone` | `"" \| "good" \| "bad"` | `""` |  |

Slots: `(default)`

## `<acme-stat-desc>`

Slots: `(default)`

## `<acme-stat-foot>`

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `bar` | `bar` | `boolean` | `false` |  |

Slots: `(default)`

## `<acme-spark>`

Sparkline: pass `points` (numbers) and a `tone`.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `points` | `points` | `number[]` | `[]` |  |
| `tone` | `tone` | `"" \| "down" \| "flat"` | `""` |  |

