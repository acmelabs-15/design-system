# Banner

A prominent message that spans the full width of its container to announce important information.

## Default

The wide row shows from 961px; below it one button holds the whole message. A page styles the row through ::part(banner) and the mobile button through ::part(mobile).

```html
<style>.padded::part(banner){padding:16px}</style>
<acme-banner class="padded" href="#" button="Read more">
  <b>Big News</b>
  – New components finally available
</acme-banner>
```

## `<acme-banner>`

Banner: a prominent message across the full width of its container, with one call to action.
From the wide breakpoint (961px) it is a centred row: an optional start place, the message (16/24
gray-900; a `<b>` inside is 600 gray-1000) and a small secondary rounded link button with an
arrow, labelled by `button`. Below it the row hides and one such button holds the whole message
(or the `mobile` slot's copy) as its label, centred at its fit width; the start place moves into it.
Slots: default (the message), `start` (an icon before the message), `mobile` (shorter copy for
the mobile button). Parts: `banner` (the wide row), `mobile` (the mobile button).

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `button` | `button` | `string` | `""` | The action button's label. |
| `href` | `href` | `string` | `""` | The action button's link. |

Slots: `(default)`, `mobile`, `start`

