# Show more

A styled control that shows content as expanded or collapsed.

## Default

The element is controlled: the owner flips expanded on click.

```html
<acme-show-more></acme-show-more>
<script>const el = root.querySelector("acme-show-more"); el.addEventListener("click", () => { el.expanded = !el.expanded; });</script>
```

## Expanded

```html
<acme-show-more expanded></acme-show-more>
```

## No border

```html
<acme-show-more no-border></acme-show-more>
```

## `<acme-show-more>`

Show more. A hairline rule with a small rounded secondary button in the middle that reads
"Show More", or "Show Less" once `expanded`; the chevron turns with it. The element is
controlled: a click bubbles as a native `click`, and the owner sets `expanded`. `loading` shows
the spinner while expanded; `no-border` hides the rule; slotted content replaces the text.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `expanded` | `expanded` | `boolean` | `false` |  |
| `loading` | `loading` | `boolean` | `false` | The spinner, while expanded (the text reads "Show More" meanwhile). |
| `no-border` | `noBorder` | `boolean` | `false` | Hides the rule. |

Slots: `(default)`

## Best Practices

- Use Show More to reveal the rest of one long list or block: recent activity, repo branches, attached resources. Use Pagination for sibling pages of one data set and Collapse for optional sections.
- Show enough rows to convey the shape of the list before you truncate; five to ten is typical. A cut at two rows feels performative.
- Put the hidden count on the trigger so the cost of expanding is clear (Show 12 More, then Show Less once open). Both labels are Title Case.
- Do not flip between Show More and Show Less on the same data mid-flow. Collapsing rows the user opened scrolls them away from where they read.
- Render hidden rows in the DOM when the count is small so find-in-page works. Lazy-load only when the data set is large enough to slow the first render.
- The trigger is a button with aria-expanded and aria-controls pointing at the list. After expanding, move focus to the first revealed row.

