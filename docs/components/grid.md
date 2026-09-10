# Grid

Display elements in a grid layout.

## Grid

A non-responsive grid with no cells.

```html
<acme-grid-system debug guide-width="1" use-container>
  <acme-grid columns="5" height="preserve-aspect-ratio" rows="2"></acme-grid>
</acme-grid-system>
```

## Basic grid

A non-responsive single grid with auto flowing cells configuration.

```html
<acme-grid-system guide-width="1" use-container>
  <acme-grid columns="3" rows="2">
    <acme-grid-cell>1</acme-grid-cell>
    <acme-grid-cell>2</acme-grid-cell>
    <acme-grid-cell>3</acme-grid-cell>
    <acme-grid-cell>4</acme-grid-cell>
    <acme-grid-cell>5</acme-grid-cell>
    <acme-grid-cell>6</acme-grid-cell>
  </acme-grid>
</acme-grid-system>
```

## Solid cells

Using the solid attribute on cells will occlude the guides that the cell overlaps.

```html
<acme-grid-system guide-width="1" use-container>
  <acme-grid columns="3" rows="2">
    <acme-grid-cell column="1/3" row="1" solid>1 + 2</acme-grid-cell>
    <acme-grid-cell>3</acme-grid-cell>
    <acme-grid-cell>4</acme-grid-cell>
    <acme-grid-cell column="2/4" row="2" solid>5 + 6</acme-grid-cell>
  </acme-grid>
</acme-grid-system>
```

## Responsive grid

Grid with responsive rows and columns at all 3 breakpoints.

```html
<acme-grid-system use-container>
  <acme-grid columns='{"sm":1,"md":2,"lg":3}' rows='{"sm":6,"md":3,"lg":2}'>
    <acme-grid-cell>1</acme-grid-cell>
    <acme-grid-cell>2</acme-grid-cell>
    <acme-grid-cell>3</acme-grid-cell>
    <acme-grid-cell>4</acme-grid-cell>
    <acme-grid-cell>5</acme-grid-cell>
    <acme-grid-cell>6</acme-grid-cell>
  </acme-grid>
</acme-grid-system>
```

## Responsive Grid with responsive guide clipping cells

Grid with responsive rows and columns at all 3 breakpoints as well as guide clipping on specific cells.

```html
<acme-grid-system use-container>
  <acme-grid columns='{"sm":1,"md":2,"lg":3}' rows='{"sm":6,"md":3,"lg":2}'>
    <acme-grid-cell column='{"sm":"1","md":"1/3"}' row='{"sm":"1/3","md":1}' solid>1 + 2</acme-grid-cell>
    <acme-grid-cell>3</acme-grid-cell>
    <acme-grid-cell>4</acme-grid-cell>
    <acme-grid-cell column='{"sm":1,"md":"1/3","lg":"2/4"}' row='{"sm":"5/7","md":3,"lg":2}' solid>5 + 6</acme-grid-cell>
  </acme-grid>
</acme-grid-system>
```

## Grid with hidden row guides

```html
<acme-grid-system use-container>
  <acme-grid columns="12" height="preserve-aspect-ratio" hide-guides="row" rows="3"></acme-grid>
</acme-grid-system>
```

## Grid with hidden column guides

```html
<acme-grid-system use-container>
  <acme-grid columns="12" height="preserve-aspect-ratio" hide-guides="column" rows="3"></acme-grid>
</acme-grid-system>
```

## Grid with overlaying cells

Grid with cells that overlay another in various states.

```html
<acme-grid-system use-container>
  <acme-grid columns="12" rows="3">
    <acme-grid-cell column="1/3" row="1/3" solid>1</acme-grid-cell>
    <acme-grid-cell column="2/4" row="2/4">2</acme-grid-cell>
    <acme-grid-cell column="3/10" row="2/4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at felis</acme-grid-cell>
    <acme-grid-cell column="7/12" row="1/-1" solid>3</acme-grid-cell>
    <acme-grid-cell column="11/13" row="1/3" solid>4</acme-grid-cell>
  </acme-grid>
</acme-grid-system>
```

## Specific Grid with Guide Clipping

Grid with guide clipping enabled on specific cells.

```html
<acme-grid-system guide-width="1" use-container>
  <acme-grid columns="3" rows="4">
    <acme-grid-cell column="1/2" row="1/3" solid>1</acme-grid-cell>
    <acme-grid-cell column="3/4" row="1/2" solid>2</acme-grid-cell>
    <acme-grid-cell column="2/3" row="2/4">3</acme-grid-cell>
    <acme-grid-cell column="1/2" row="4/5" solid>4</acme-grid-cell>
    <acme-grid-cell column="3/4" row="3/5" solid>5</acme-grid-cell>
  </acme-grid>
</acme-grid-system>
```

## Grid with cross

```html
<acme-grid-system guide-width="1" use-container>
  <acme-grid columns="3" rows="2">
    <acme-grid-cross column="1" row="1"></acme-grid-cross>
    <acme-grid-cross column="4" row="1"></acme-grid-cross>
    <acme-grid-cross column="4" row="3"></acme-grid-cross>
    <acme-grid-cross column="1" row="3"></acme-grid-cross>
    <acme-grid-cell>1</acme-grid-cell>
    <acme-grid-cell>2</acme-grid-cell>
    <acme-grid-cell>3</acme-grid-cell>
    <acme-grid-cell>4</acme-grid-cell>
    <acme-grid-cell>5</acme-grid-cell>
    <acme-grid-cell>6</acme-grid-cell>
  </acme-grid>
</acme-grid-system>
```

## Dashed grid with cross

```html
<acme-grid-system dashed-guides guide-width="1" use-container>
  <acme-grid columns="1" rows="1">
    <acme-grid-cross column="1" row="1"></acme-grid-cross>
    <acme-grid-cross column="2" row="2"></acme-grid-cross>
    <acme-grid-cross column="2" row="1"></acme-grid-cross>
    <acme-grid-cross column="1" row="2"></acme-grid-cross>
    <acme-grid-cell>Content here</acme-grid-cell>
  </acme-grid>
</acme-grid-system>
```

## Dashed grid with grid page

```html
<acme-grid-page>
  <acme-grid-system dashed-guides guide-width="1">
    <acme-grid columns="1" rows="1">
      <acme-grid-cross column="1" row="1"></acme-grid-cross>
      <acme-grid-cross column="2" row="2"></acme-grid-cross>
      <acme-grid-cross column="2" row="1"></acme-grid-cross>
      <acme-grid-cross column="1" row="2"></acme-grid-cross>
      <acme-grid-cell>Content here</acme-grid-cell>
    </acme-grid>
  </acme-grid-system>
</acme-grid-page>
```

## `<acme-grid-system>`

The frame every `acme-grid` sits in: a box up to 1080px wide (368px at least) that draws the
outer guide border and gives its grids the guide width, the guide and cross colors and the
width they lay out from (the viewport, or with `use-container` the system's own container).
The first two children lay out in the box; the rest sit in a lazy-content box below them.
`debug` tints the guides amber and names the breakpoint in a corner overlay; `dashed-guides`
draws every guide dashed.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `guide-width` | `guideWidth` | `number \| string` | — | The guide line width: a number of px or a length. |
| `guide-color` | `guideColor` | `string` | — |  |
| `cross-color` | `crossColor` | `string` | — |  |
| `max-width` | `maxWidth` | `number \| string` | — | The widest the system lays out (1080px): a number of px or a length. |
| `min-width` | `minWidth` | `number \| string` | — | The narrowest the system lays out (368px): a number of px or a length. |
| `debug` | `debug` | `boolean` | `false` | Amber guides, tinted cells, and the breakpoint's name in the corner. |
| `dashed-guides` | `dashedGuides` | `boolean` | `false` |  |
| `use-container` | `useContainer` | `boolean` | `false` | The grids lay out from the system's own width, not the viewport's. |

Slots: `(default)`, `lazy`

## `<acme-grid>`

A grid of `columns` by `rows` tracks inside an `acme-grid-system`: the section takes the system's
width and draws a guide behind every track; the cells (`acme-grid-cell`) and crosses
(`acme-grid-cross`) are its slotted children. Both counts take one number or a value per breakpoint
(`{"sm":1,"md":2,"lg":3}`); the guides are then drawn once per breakpoint and shown by media query.
A solid cell clips the guides it covers. The system's debug and dashed modes reach the section as
`data-debug` and `data-dashed`.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `columns` | `columns` | `Responsive<number>` | `1` |  |
| `rows` | `rows` | `Responsive<number>` | `1` |  |
| `height` | `height` | `Responsive<string \| number>` | `"fit-content"` | `fit-content` (the default), `preserve-aspect-ratio` (square cells: the height follows the width and the counts), a number of px, or a `var()`. |
| `hide-guides` | `hideGuides` | `boolean \| "row" \| "column"` | `false` | Hides every guide (a bare attribute), the row guides or the column guides. |
| `dashed-guides` | `dashedGuides` | `boolean` | `false` | Draws the guides dashed. |
| `no-system-border` | `noSystemBorder` | `boolean` | `false` | Drops the section's bottom border. |
| `use-container` | `useContainer` | `boolean` | `false` | Reads the breakpoint from the system's container instead of the viewport. |

Slots: `(default)`

## `<acme-grid-cell>`

A cell of `acme-grid`: a padded box on the tracks its `row` and `column` name, a line number,
a `start/end` span or `auto` (flowing into the next free tracks), plain or per breakpoint as
JSON. A `solid` cell needs both, and clips the guides it covers. The cell draws over the guides;
`behind-grid` puts it under them; `no-padding` and `overflow` open the box; `hide` names the
breakpoints at which the cell is not displayed.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `row` | `row` | `Responsive<GridPosition>` | `"auto"` |  |
| `column` | `column` | `Responsive<GridPosition>` | `"auto"` |  |
| `solid` | `solid` | `boolean` | `false` | Clips the guides the cell covers. Needs an explicit `row` and `column`. |
| `no-padding` | `noPadding` | `boolean` | `false` |  |
| `overflow` | `overflow` | `boolean` | `false` | Lets content overflow the cell. |
| `behind-grid` | `behindGrid` | `boolean` | `false` | Draws the cell under the guides. |
| `hide` | `hide` | `Breakpoint[] \| Breakpoint` | `[]` | The breakpoints at which the cell is hidden. |

Slots: `(default)`

## `<acme-grid-cross>`

A cross on a guide intersection of `acme-grid`: `row` and `column` are grid line numbers (1 is
the first line, the count plus one the last), plain or per breakpoint as JSON. 21px wide on large
screens, 15px on medium, 11px on small; two lines in the cross color, as wide as the guides.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `row` | `row` | `Responsive<number>` | `1` |  |
| `column` | `column` | `Responsive<number>` | `1` |  |

## `<acme-grid-page>`

The page a grid system sits on: a background-200 column with 16px of vertical padding on
small screens, 32px on medium and 90px on large. A `banner` slot goes above the content and
takes the place of the top padding on large screens; `remove-padding-y` drops the padding,
`remove-bottom-margin` pulls the page up by the width of a guide.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `remove-padding-y` | `removePaddingY` | `boolean` | `false` |  |
| `remove-bottom-margin` | `removeBottomMargin` | `boolean` | `false` |  |

Slots: `banner`, `(default)`

## Best Practices

**When to use**

- Grid is for two-dimensional cell-and-guide layouts on marketing pages, docs landings and feature breakdowns, where the rule lines and cell borders are part of the design.
- Plain n-column content (cards, lists) is a CSS grid; Grid is too much when no guide is visible.
- Nest Grids one level at most. Deeper, the guides overlap into noise and the cell math breaks.

**Behavior**

- Set columns and rows at all three breakpoints so cells reflow the same way on mobile, tablet and desktop.
- A solid cell hides the guides behind it when content needs an opaque background; without it the guides run through the cell.
- Hide row or column guides only where their absence helps (single-axis layouts, hero rows). Hiding both usually means a plain CSS grid is the right tool.

**Accessibility**

- Guides are decorative and aria-hidden; the semantics live in the cell content.
- When a cell becomes tappable, give it its own focus ring and keep the tab order in reading order.
- Check guide contrast on both themes; the default tokens pass, custom borders can drop under 3:1.

