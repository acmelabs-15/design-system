# Chart

A chart frame on TanStack Charts: pass rows and keys and it draws a line, bar or area chart in the house series colors with Geist's grid, mono axes and tooltip. A hand-drawn SVG still fits the default slot. House component; Geist has no page for it.

## Line chart

Two series from one row set: y takes a comma-separated list of keys. Hover for the tooltip.

```html
<acme-chart type="line" x="month" y="edge,serverless" points height="200" data='[{"month":"Jan","edge":42,"serverless":18},{"month":"Feb","edge":58,"serverless":21},{"month":"Mar","edge":76,"serverless":30},{"month":"Apr","edge":64,"serverless":27},{"month":"May","edge":81,"serverless":35},{"month":"Jun","edge":94,"serverless":38}]' aria-label="Requests by month">
  <acme-panel-head slot="head" heading="Requests" sub="Last 6 months"></acme-panel-head>
  <acme-legend slot="legend">
    <acme-legend-item series="1" value="94k">Edge</acme-legend-item>
    <acme-legend-item series="2" value="38k">Serverless</acme-legend-item>
  </acme-legend>
</acme-chart>
```

## Bar chart

```html
<acme-chart type="bar" x="month" y="edge" height="200" data='[{"month":"Jan","edge":42,"serverless":18},{"month":"Feb","edge":58,"serverless":21},{"month":"Mar","edge":76,"serverless":30},{"month":"Apr","edge":64,"serverless":27},{"month":"May","edge":81,"serverless":35},{"month":"Jun","edge":94,"serverless":38}]' aria-label="Edge requests by month"></acme-chart>
```

## Area chart

```html
<acme-chart type="area" x="month" y="edge,serverless" height="200" no-grid data='[{"month":"Jan","edge":42,"serverless":18},{"month":"Feb","edge":58,"serverless":21},{"month":"Mar","edge":76,"serverless":30},{"month":"Apr","edge":64,"serverless":27},{"month":"May","edge":81,"serverless":35},{"month":"Jun","edge":94,"serverless":38}]' aria-label="Requests by month, stacked area"></acme-chart>
```

## Custom plot

Without data, the default slot takes any SVG; the frame draws the head and the legend.

```html
<acme-chart height="160">
  <acme-panel-head slot="head" heading="Uptime" sub="Last 7 days"></acme-panel-head>
  <svg viewBox="0 0 600 160" preserveAspectRatio="none" style="width:100%;height:100%">
    <polyline fill="none" stroke="var(--chart-1)" stroke-width="2" points="0,120 100,90 200,100 300,60 400,70 500,30 600,40"/>
  </svg>
  <acme-legend slot="legend">
    <acme-legend-item series="1" value="99.98%">Uptime</acme-legend-item>
  </acme-legend>
</acme-chart>
```

## Legend list

```html
<acme-legend list>
  <acme-legend-item hue="green" value="82%">Ready</acme-legend-item>
  <acme-legend-item hue="amber" value="12%">Building</acme-legend-item>
  <acme-legend-item hue="red" value="6%">Error</acme-legend-item>
</acme-legend>
```

## `<acme-chart>`

House chart frame on TanStack Charts. Pass `data` (rows), `x` and one or more `y` keys and the
element draws a line, bar or area chart in the house series colors, with Geist's grid, mono
axes and the tooltip. Without `data`, the default slot takes a hand-drawn SVG as before.
Slots: head, default (custom plot), tip, legend.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `height` | `height` | `number` | `180` |  |
| `type` | `type` | `"line" \| "bar" \| "area"` | `"line"` | line, bar or area. |
| `data` | `data` | `Row[]` | `[]` | Rows as JSON. |
| `x` | `x` | `string` | `"x"` | The category or time key. |
| `y` | `y` | `string` | `"y"` | One key, or several separated by commas, each drawn as a series. |
| `points` | `points` | `boolean` | `false` | Show points on a line. |
| `no-grid` | `noGrid` | `boolean` | `false` | Hide the horizontal grid. |
| `no-tooltip` | `noTooltip` | `boolean` | `false` | Hide the tooltip. |
| `aria-label` | `label` | `string` | `""` |  |

Slots: `head`, `(default)`, `tip`, `legend`

## `<acme-legend>`

House legend: dot, label and a value; `list` stacks them. Items: acme-legend-item with `hue` or `series`.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `list` | `list` | `boolean` | `false` |  |

Slots: `(default)`

## `<acme-legend-item>`

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `hue` | `hue` | `string` | `""` |  |
| `series` | `series` | `number` | `0` |  |
| `value` | `value` | `string` | `""` |  |

Slots: `(default)`

## Best Practices

**When to use**

- A trend over time or a comparison across categories inside a panel or a stat. A Gauge for one ratio, a Progress for one fraction, a bar row for a labelled list of shares.

**Behavior**

- Series colors come from the chart tokens, so the same series keeps its color across a page and both themes.
- Points only when the reader must pick a value; the tooltip carries the exact figures.

