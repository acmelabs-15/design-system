# Breadcrumbs

Navigation aid that shows the user's location within a site's hierarchy, with text and menu variants.

## Default

```html
<div class="vstack" style="gap:16px">
  <acme-breadcrumbs type="text">
    <acme-breadcrumb>Home</acme-breadcrumb>
    <acme-breadcrumb>Dashboard</acme-breadcrumb>
    <acme-breadcrumb>Overview</acme-breadcrumb>
  </acme-breadcrumbs>
  <acme-breadcrumbs type="menu">
    <acme-breadcrumb>Home</acme-breadcrumb>
    <acme-breadcrumb>Dashboard</acme-breadcrumb>
    <acme-breadcrumb>Overview</acme-breadcrumb>
  </acme-breadcrumbs>
</div>
```

## Active

```html
<acme-breadcrumbs>
  <acme-breadcrumb>Home</acme-breadcrumb>
  <acme-breadcrumb active>Dashboard</acme-breadcrumb>
  <acme-breadcrumb>Overview</acme-breadcrumb>
</acme-breadcrumbs>
```

## Disabled

```html
<acme-breadcrumbs>
  <acme-breadcrumb>Home</acme-breadcrumb>
  <acme-breadcrumb disabled>Dashboard</acme-breadcrumb>
  <acme-breadcrumb>Overview</acme-breadcrumb>
</acme-breadcrumbs>
```

## `<acme-breadcrumbs>`

Breadcrumbs: where the page sits in the site's hierarchy, as a row of `acme-breadcrumb`
crumbs. `type="text"` (the default) is a labelled navigation list, 14px crumbs 6px apart with
a chevron after each but the last; `type="menu"` is a row of 12px chips 8px apart that scrolls
sideways on a narrow screen. The list hands its type to the crumbs.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `type` | `type` | `"text" \| "menu"` | `"text"` | `text`: a navigation list with chevrons between the crumbs; `menu`: a row of chips. |

Slots: `(default)`

## `<acme-breadcrumb>`

One crumb of an `acme-breadcrumbs`. In a text list it is a 14px gray-900 list item with a
16px chevron after it (hidden on the last crumb): gray-1000 when `active` (the current page)
or hovered, gray-700 with a not-allowed cursor when `disabled`. In a menu it is a chip: a 12px
bordered button on the background-200 fill that darkens on hover, white with a gray-600 border
when active, a gray-alpha-200 fill and a disabled button when disabled; a chip whose text is cut
off shows the full text in a tooltip on hover (desktop only). `href` makes the crumb a link:
an anchor around the text in a list, the chip itself in a menu.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `active` | `active` | `boolean` | `false` | The current page. |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `href` | `href` | `string` | `""` | Renders the crumb as a link: an anchor around the text in a list, the chip itself in a menu. |
| `target` | `target` | `string` | `""` | The link's target and rel. |
| `rel` | `rel` | `string` | `""` |  |
| `menu` | `menu` | `boolean` | `false` | The chip form; set by the list for `type="menu"`. |

Slots: `(default)`

