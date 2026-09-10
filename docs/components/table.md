# Table

A semantic HTML table component.

## Basic table

```html
<acme-table columns='[{"key":"c1","label":"Col 1"},{"key":"c2","label":"Col 2"},{"key":"c3","label":"Col 3"}]' rows='[{"c1":"Value 1.1","c2":"Value 1.2","c3":"Value 1.3"},{"c1":"Value 2.1","c2":"Value 2.2","c3":"Value 2.3"},{"c1":"Value 3.1","c2":"Value 3.2","c3":"Value 3.3"}]'></acme-table>
```

## Striped table

```html
<acme-table striped columns='[{"key":"c1","label":"Col 1"},{"key":"c2","label":"Col 2"},{"key":"c3","label":"Col 3"}]' rows='[{"c1":"Value 1.1","c2":"Value 1.2","c3":"Value 1.3"},{"c1":"Value 2.1","c2":"Value 2.2","c3":"Value 2.3"},{"c1":"Value 3.1","c2":"Value 3.2","c3":"Value 3.3"}]'></acme-table>
```

## Bordered table

```html
<acme-table bordered columns='[{"key":"c1","label":"Col 1"},{"key":"c2","label":"Col 2"},{"key":"c3","label":"Col 3"}]' rows='[{"c1":"Value 1.1","c2":"Value 1.2","c3":"Value 1.3"},{"c1":"Value 2.1","c2":"Value 2.2","c3":"Value 2.3"},{"c1":"Value 3.1","c2":"Value 3.2","c3":"Value 3.3"}]'></acme-table>
```

## Interactive table

```html
<acme-table interactive columns='[{"key":"c1","label":"Col 1"},{"key":"c2","label":"Col 2"},{"key":"c3","label":"Col 3"}]' rows='[{"c1":"Value 1.1","c2":"Value 1.2","c3":"Value 1.3"},{"c1":"Value 2.1","c2":"Value 2.2","c3":"Value 2.3"},{"c1":"Value 3.1","c2":"Value 3.2","c3":"Value 3.3"}]'></acme-table>
```

## Full featured table

```html
<acme-table interactive striped columns='[{"key":"product","label":"Product","width":"44%"},{"key":"usage","label":"Usage","width":"22%"},{"key":"price","label":"Price","width":"22%"},{"key":"charge","label":"Charge","width":"11%"}]' rows='[{"product":"Brake Pads Set","usage":"100 sets","price":"$50 per set","charge":"$5,000.00"},{"product":"Oil Filters","usage":"200 filters","price":"$10 per filter","charge":"$2,000.00"},{"product":"Car Batteries","usage":"50 batteries","price":"$100 per battery","charge":"$5,000.00"},{"product":"Headlight Bulbs","usage":"300 bulbs","price":"$15 per bulb","charge":"$4,500.00"},{"product":"Windshield Wipers","usage":"250 pairs","price":"$20 per pair","charge":"$5,000.00"},{"product":"Spark Plugs","usage":"500 sets","price":"$5 per set","charge":"$2,500.00"}]' footer='[{"text":"Subtotal","colspan":3},{"text":"$24,000.00"}]'></acme-table>
```

## Virtualized table

```html
<div style="position:relative">
  <acme-table interactive striped virtualize columns='[{"key":"product","label":"Product","width":"44%"},{"key":"usage","label":"Usage","width":"22%"},{"key":"price","label":"Price","width":"22%"},{"key":"charge","label":"Charge","width":"11%"}]' rows="[]"></acme-table>
  <div data-fade style="position:absolute;left:0;bottom:0;width:100%;height:30%;border-radius:6px;background:linear-gradient(to top,var(--ds-background-100),transparent);opacity:.8;pointer-events:none"></div>
</div>
<acme-show-more no-border style="margin-top:16px"></acme-show-more>
<script>const items = [{"product":"Brake Pads Set","usage":"100 sets","price":"$50 per set","charge":5000},{"product":"Oil Filters","usage":"200 filters","price":"$10 per filter","charge":2000},{"product":"Car Batteries","usage":"50 batteries","price":"$100 per battery","charge":5000},{"product":"Headlight Bulbs","usage":"300 bulbs","price":"$15 per bulb","charge":4500},{"product":"Windshield Wipers","usage":"250 pairs","price":"$20 per pair","charge":5000},{"product":"Spark Plugs","usage":"500 sets","price":"$5 per set","charge":2500}]; const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "usd", maximumFractionDigits: 2 }); const all = Array.from({ length: 5000 }, (_, i) => ({ ...items[i % items.length], charge: money.format(items[i % items.length].charge) })); const table = root.querySelector("acme-table"), more = root.querySelector("acme-show-more"), fade = root.querySelector("[data-fade]"); const apply = () => { table.rows = more.expanded ? all : all.slice(0, 9); fade.hidden = more.expanded; }; more.addEventListener("acme-toggle", apply); apply();</script>
```

## `<acme-table>`

A semantic HTML table. The root is a horizontal scroll box around a native table of 14px
gray-900 text: a header row of 36px medium cells, a 12px spacer body, the body and an
optional footer. `striped` shades every odd row, `bordered` draws a hairline under every row
but the last, `interactive` highlights the row under the pointer (mouse and pen, not touch;
the row carries data-hover) and reports a click on it as `acme-row`. `density="compact"`
shortens the rows to 30px; `remove-spacing` drops the spacer body. `virtualize` renders only
the rows in the window (plus `overscan` pixels above and below): the body keeps its full
height and hidden spacer rows hold the place of the rows left out, so the page scrolls as it
would with every row. `selectable` composes a checkbox column: the header checkbox selects
every row (indeterminate while only some are), each row's toggles its index in `selected`,
and a change is reported as `acme-select`. A cell with no value shows an em dash.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `columns` | `columns` | `Column[]` | `[]` | `[{ key, label, width?, numeric?, render? }]`. |
| `rows` | `rows` | `Row[]` | `[]` |  |
| `footer` | `footer` | `FooterCell[]` | `[]` | Footer cells: `[{ text, colspan? }]`. |
| `striped` | `striped` | `boolean` | `false` | Shades every odd row. |
| `bordered` | `bordered` | `boolean` | `false` | A hairline under every row but the last. |
| `interactive` | `interactive` | `boolean` | `false` | Highlights the row under the pointer and reports a click on it as `acme-row`. |
| `virtualize` | `virtualize` | `boolean` | `false` | Renders only the rows in the window; the body keeps its full height. |
| `overscan` | `overscan` | `number` | `150` | Pixels rendered beyond the window above and below while virtualized. |
| `density` | `density` | `TableDensity` | `"default"` | Row height: `default` (40px) or `compact` (30px). |
| `remove-spacing` | `removeSpacing` | `boolean` | `false` | Drops the 12px spacer between the header and the body. |
| `selectable` | `selectable` | `boolean` | `false` | A leading checkbox column; the selection is `selected`, a change is `acme-select`. |
| `selected` | `selected` | `number[]` | `[]` | Indices of the selected rows. |

Events: `acme-row`, `acme-select`

## Best Practices

**When to use**

- Use a Table for rows that share one shape, where at least one column can be sorted or compared across rows.
- A row of descriptive content with a single action (a member, an integration) is an Entity.
- A key/value block on a detail page is a Description, not a two-column table.

**Behavior**

- When the list is empty (filter cleared, nothing created yet), show an Empty State outside the table instead of an empty body.
- Render — in a cell whose value is unknown or does not apply. Never N/A, null or an empty string.
- A sortable header is a button. Its label stays Title Case; the arrow is decorative and the button announces the next sort state.
- Give numeric columns tabular numerals (or the mono face) so digits line up for comparison.

**Content**

- Column headers are Title Case nouns or noun phrases: Last Used, Requests (7d), Created, Status. Never sentences.
- Cells use the short relative time (2m ago, 5h ago) and switch to Mar 14, 2026 past seven days. See Relative Time Card.
- Pagination labels are Previous and Next. Page copy reads Page 2 of 7 or 21–40 of 142, with an en dash inside the range.

