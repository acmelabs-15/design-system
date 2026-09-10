# Sheet

Content in a side panel that slides in from an edge of the screen.

## Default

With the style overrides front apps use most (inset): the panel inset 12px from the edges, rounded 16, 512 wide on large screens, with a padded header, body and footer.

```html
<acme-sheet modal inset heading="Sheet Title">
  <acme-button slot="trigger">Open Sheet</acme-button>
  <p slot="header" class="text-copy-14 muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  Eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  <acme-button slot="footer" variant="secondary" data-close>Close</acme-button>
  <acme-button slot="footer">Next</acme-button>
</acme-sheet>
```

## With Side

The side attribute picks the edge the sheet slides in from.

```html
<div class="row" style="gap:16px;justify-content:center">
  <acme-sheet modal side="top" heading="Sheet from top">
    <acme-button slot="trigger">Open top</acme-button>
    <p slot="header" class="text-copy-14 muted">This sheet slides in from the top.</p>
  </acme-sheet>
  <acme-sheet modal side="right" heading="Sheet from right">
    <acme-button slot="trigger">Open right</acme-button>
    <p slot="header" class="text-copy-14 muted">This sheet slides in from the right.</p>
  </acme-sheet>
  <acme-sheet modal side="bottom" heading="Sheet from bottom">
    <acme-button slot="trigger">Open bottom</acme-button>
    <p slot="header" class="text-copy-14 muted">This sheet slides in from the bottom.</p>
  </acme-sheet>
  <acme-sheet modal side="left" heading="Sheet from left">
    <acme-button slot="trigger">Open left</acme-button>
    <p slot="header" class="text-copy-14 muted">This sheet slides in from the left.</p>
  </acme-sheet>
</div>
```

## `<acme-sheet>`

Sheet: a panel that slides in from one edge of the screen (`side`, right by default), for
context that stays tied to the page. The native dialog opens in the top layer; a `trigger` slot
opens it, `show()` and `close()` do the same. The panel holds the header (`heading` or the
`heading` slot, then the `header` slot), the body (the default slot, the dialog's description)
and the footer (the `footer` slot: buttons, one of them with `data-close` to close the sheet).
`modal` draws the overlay behind the panel and stops the page scrolling; `no-overlay` leaves the
overlay out. `inset` is the panel style front apps use most: inset 12px from the edges, rounded
16, 512 wide on large screens, with no padding of its own (the header, body and footer carry
theirs). The panel fades in over 200ms and out again before it leaves; the overlay fades with the
overlay motion. Escape and a press outside ask to close (`acme-dismiss`, cancelable). Focus goes
to the first tabbable element in the panel, else the panel, and returns to the opener on close.
`acme-open` fires on open, `acme-close` once the sheet has left.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `open` | `open` | `boolean` | `false` | Open state; `show()` and `close()` set it. |
| `side` | `side` | `SheetSide` | `"right"` | The edge the panel slides in from. |
| `modal` | `modal` | `boolean` | `false` | The overlay covers the page behind the panel and the page stops scrolling. |
| `no-overlay` | `noOverlay` | `boolean` | `false` | No overlay behind the panel. |
| `inset` | `inset` | `boolean` | `false` | The panel inset 12px from the edges, rounded, 512 wide on large screens, its parts padded. |
| `heading` | `heading` | `string` | `""` |  |

Slots: `trigger`, `heading`, `header`, `(default)`, `footer`

Events: `acme-close`, `acme-open`

## Best Practices

**When to use**

- Use a Sheet for context that stays tied to the page: deployment details, a log row, a member profile. The page behind it stays useful.
- Use Modal for a decision that must block the page. Use Drawer for a bottom sheet on mobile.
- Do not confirm a destructive action in a Sheet. The non-modal default keeps the page live, which makes a delete or revoke feel less serious than it is.

**Behavior**

- The Sheet is non-modal by default so toasts and other high-z elements stay reachable. Keep that unless the sheet owns the screen.
- Pick side from where the trigger sits: a row inspector from the right, a global filter from the left. Keep the side fixed for the session.
- A click outside does not close the sheet. Always render a visible close control and let Escape close it.

**Content**

- The title is Title Case and names the entity (Deployment Details, Member Profile), not the page action.
- The body is mostly read: sentence case prose with Title Case sub-headings. Action buttons are optional; when present, use Verb + Noun.
- Do not repeat the page header inside the sheet. The sheet is the detail layer.

**Accessibility**

- Trap focus inside the open sheet and return it to the trigger row on close, so keyboard users keep their place in the list.
- Show a close button labelled Close (or an icon button with aria-label="Close"), since an outside click does not dismiss.
- Point aria-labelledby at the title. Add aria-describedby only when the body is short and carries the meaning.

