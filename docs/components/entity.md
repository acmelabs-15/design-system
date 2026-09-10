# Entity

Displays up-to-two columns of content. The left column can contain arbitrary content, and the right column typically contains controls or actions related to the content in the left column.

## Default

```html
<acme-entity>
  <acme-avatar slot="left" size="32" username="evilrabbit"></acme-avatar>
  <acme-entity-content description="Glenn Hitchcock (@gln)" fill title="Evil Rabbit"></acme-entity-content>
  <p slot="right" class="text-copy-14" style="color:var(--ds-gray-900)">Connected 1h ago</p>
</acme-entity>
```

## Entity with Skeleton

```html
<acme-entity>
  <div style="display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:8px;flex:1">
    <acme-skeleton height="20" width="100%"></acme-skeleton>
    <div style="display:flex;flex-direction:row;align-items:center;justify-content:flex-start;gap:8px;flex:0 1 auto">
      <acme-skeleton height="20" width="70"></acme-skeleton>
      <acme-skeleton height="20" width="60"></acme-skeleton>
      <acme-skeleton height="20" width="68"></acme-skeleton>
    </div>
  </div>
</acme-entity>
```

## Entity with List

```html
<acme-entity-list>
  <acme-entity as="li">
    <acme-entity-content description="Last used just now" title="GitHub Desktop on MacBook Pro"></acme-entity-content>
    <acme-button slot="right" size="small" variant="secondary">Decline</acme-button>
  </acme-entity>
  <acme-entity as="li">
    <acme-entity-content description="Last used 10min ago" title="VS Code on Windows 11"></acme-entity-content>
    <acme-button slot="right" size="small" variant="secondary">Decline</acme-button>
  </acme-entity>
  <acme-entity as="li">
    <acme-entity-content description="Last used 25min ago" title="Terminal on Ubuntu 24.04"></acme-entity-content>
    <acme-button slot="right" size="small" variant="secondary">Decline</acme-button>
  </acme-entity>
</acme-entity-list>
```

## Entity with List and Checkbox

A clickable row is a button: the page toggles the row's checkbox on its click (a click on the checkbox itself already did).

```html
<acme-entity-list>
  <acme-entity as="button">
    <acme-checkbox slot="left" aria-label="GitHub Desktop on MacBook Pro" checked></acme-checkbox>
    <acme-entity-content description="Last used just now" title="GitHub Desktop on MacBook Pro"></acme-entity-content>
  </acme-entity>
  <acme-entity as="button">
    <acme-checkbox slot="left" aria-label="VS Code on Windows 11"></acme-checkbox>
    <acme-entity-content description="Last used 10min ago" title="VS Code on Windows 11"></acme-entity-content>
  </acme-entity>
  <acme-entity as="button">
    <acme-checkbox slot="left" aria-label="Terminal on Ubuntu 24.04"></acme-checkbox>
    <acme-entity-content description="Last used 25min ago" title="Terminal on Ubuntu 24.04"></acme-entity-content>
  </acme-entity>
</acme-entity-list>
<script>for (const row of root.querySelectorAll('acme-entity')) { const box = row.querySelector('acme-checkbox'); row.addEventListener('click', (e) => { if (!e.composedPath().includes(box)) box.checked = !box.checked; }); }</script>
```

## Entity with Fill

```html
<acme-entity-list>
  <acme-entity>
    <acme-entity-content fill description="This is a simple description"></acme-entity-content>
    <acme-entity-content description="This is a simple description"></acme-entity-content>
  </acme-entity>
</acme-entity-list>
```

## Entity with Column ClassNames

The columns are the left and right parts: a page styles them through ::part(left) and ::part(right).

```html
<style>.dashed::part(left),.dashed::part(right){border:1px dashed var(--ds-gray-300);border-radius:6px;padding:8px}</style>
<acme-entity-list>
  <acme-entity class="dashed">
    <acme-avatar slot="left" placeholder size="50"></acme-avatar>
    <acme-entity-content description="Entity with dashed borders"></acme-entity-content>
    <span slot="right" class="text-copy-14" style="color:var(--ds-gray-900)">[some action]</span>
  </acme-entity>
</acme-entity-list>
```

## `<acme-entity>`

Entity: one padded row of up to two columns. The left column holds the `left` slot (an avatar,
a checkbox) and the default slot (the content, usually an acme-entity-content); the right column
appears with the `right` slot (one or two controls) and sits at the row's end; a `footer` slot
follows the columns. `as="button"` makes the row a full-width button that inherits the list's
background, tints on hover and emits `click` on the host. The columns are the `left` and `right`
parts, for a consumer's own border or padding.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `as` | `as` | `EntityTag` | `"li"` | `li` (default) · `button` for a clickable row · `div`. |

Slots: `left`, `(default)`, `right`, `footer`

## `<acme-entity-content>`

Entity content: the text of an entity row, the title (14px semibold) over the description
(14px gray-900), each truncated to one line, with an optional avatar after the text (the
`avatar` slot). `fill` takes the free width of the row; without it the content is as wide as
its text. A title or description that is not plain text goes in the `title` or `description`
slot instead of the attribute.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `title` | `title` | `string` | `""` | The title line. |
| `description` | `description` | `string` | `""` | The line under the title. |
| `width` | `width` | `string` | `""` | Written to the content's `--width` variable. |
| `fill` | `fill` | `boolean` | `false` | Takes the free width of the row. |

Slots: `title`, `description`, `avatar`

## `<acme-entity-list>`

Entity list: a list in the page background, ringed by the border shadow, radius 5, clipping its
rows; every row but the last carries a 1px divider. The rows are acme-entity elements in the
default slot. A `header` slot stacks a heading over the list (12px apart); the list then rounds
its bottom corners only.

Slots: `header`, `(default)`

## Best Practices

**When to use**

- Use an Entity for a row of descriptive content paired with one or two controls: member rows, integration rows, domain rows.
- For tabular data with sortable columns and a shared row shape, use Table instead.
- For a static key/value metadata block on a detail page, use Description.

**Behavior**

- The right column holds at most one or two controls. If the row needs more, move secondary actions into a Dots Menu.
- For multi-select rows, the leading Checkbox carries aria-label="Select {entity name}" so the row is selectable without relying on the visual label.
- Render the Skeleton variant during load instead of an empty row, and swap to real content once data resolves.

**Content**

- Lead the left column with a scannable identifier: an Avatar or icon, a Title Case label, then sentence-case secondary metadata (Member since Mar 14, 2026).
- Keep right-column buttons Verb + Noun (Remove Member, Resend Invite). Bare verbs like Remove or Confirm lose context once the row scrolls offscreen.

