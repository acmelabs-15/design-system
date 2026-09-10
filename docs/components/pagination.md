# Pagination

Two rail links that take the reader to the page before and the page after this one.

## Default

```html
<acme-pagination prev-title="Home" prev-href="#" next-title="Introduction" next-href="#"></acme-pagination>
```

## `<acme-pagination>`

Pagination. The previous and next sibling pages as two links in a full-width space-between
row: the 13px gray-900 direction label over the 16px medium title, with a chevron placed
outside the title (left of the previous, right of the next); hovering a link turns both dark.
The accessible name reads "Go to previous page: <title>". An end without a title renders no
link. The `center` slot sits between them, on viewports of 1200px and up.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `prev-title` | `prevTitle` | `string` | `""` | Destination page name of the previous link; empty hides the link. |
| `prev-href` | `prevHref` | `string` | `""` |  |
| `next-title` | `nextTitle` | `string` | `""` | Destination page name of the next link; empty hides the link. |
| `next-href` | `nextHref` | `string` | `""` |  |

Slots: `center`

## Best Practices

- Pagination moves between sibling pages in a sequence: docs articles, blog posts, onboarding steps. To reveal more rows of one data set, use Show More or a numbered pager.
- prev-title and next-title are the destination page names (Deploy Hooks, Environment Variables). The element adds the Previous / Next label, the chevron and the Go to {direction} page: {title} accessible name; no arrows or Go to in the title.
- At the start or end of a sequence, leave the slot empty instead of disabling it. An empty rail reads cleaner than a dimmed link that goes nowhere.
- Titles are Title Case and short enough to fit the rail on one line. A long name truncates, so the distinctive word goes first.
- No ordinal positions such as Page 3 of 10 in a title. Pagination is a sibling link, not a numbered pager.

