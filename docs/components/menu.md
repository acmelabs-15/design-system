# Menu

A dropdown menu opened from a button, with typeahead and keyboard navigation.

## Default

The trigger is an acme-menu-button, a Button, in the trigger slot.

```html
<div style="min-height:60px;position:relative">
  <acme-menu width="200">
    <acme-menu-button slot="trigger">Actions</acme-menu-button>
    <acme-menu-item slot="items">One</acme-menu-item>
    <acme-menu-item slot="items">Two</acme-menu-item>
    <acme-menu-item slot="items">Three</acme-menu-item>
    <acme-menu-item slot="items" href="https://vercel.com">Test for Link</acme-menu-item>
    <acme-menu-item slot="items" variant="error">Delete</acme-menu-item>
  </acme-menu>
</div>
```

## With chevron

```html
<div style="min-height:60px;position:relative">
  <acme-menu width="200">
    <acme-menu-button slot="trigger" show-chevron variant="secondary">Actions</acme-menu-button>
    <acme-menu-item slot="items">One</acme-menu-item>
    <acme-menu-item slot="items">Two</acme-menu-item>
    <acme-menu-item slot="items">Three</acme-menu-item>
    <acme-menu-item slot="items" href="https://vercel.com">Test for Link</acme-menu-item>
    <acme-menu-item slot="items" variant="error">Delete</acme-menu-item>
  </acme-menu>
</div>
```

## Disabled items

```html
<div style="min-height:60px;position:relative">
  <acme-menu width="200">
    <acme-menu-button slot="trigger">Actions</acme-menu-button>
    <acme-menu-item slot="items">One</acme-menu-item>
    <acme-menu-item slot="items">Two</acme-menu-item>
    <acme-menu-item slot="items" disabled>Three</acme-menu-item>
    <acme-menu-item slot="items" variant="error">Delete</acme-menu-item>
    <acme-menu-item slot="items" disabled variant="error">Delete Forever</acme-menu-item>
  </acme-menu>
</div>
```

## Locked items

locked marks an action that needs more permissions: the item renders disabled with a lock suffix.

```html
<div style="min-height:60px;position:relative">
  <acme-menu width="200">
    <acme-menu-button slot="trigger">Actions</acme-menu-button>
    <acme-menu-item slot="items">View Details</acme-menu-item>
    <acme-menu-item slot="items">Edit</acme-menu-item>
    <acme-tooltip slot="items" text="You do not have the permissions to delete." style="display:flex;width:100%">
      <acme-menu-item locked>Delete</acme-menu-item>
    </acme-tooltip>
  </acme-menu>
</div>
```

## Link items

```html
<div style="min-height:60px;position:relative">
  <acme-menu width="200">
    <acme-menu-button slot="trigger">Links</acme-menu-button>
    <acme-menu-item slot="items" href="/design/menu#custom-trigger">One</acme-menu-item>
    <acme-menu-item slot="items" href="#">Two</acme-menu-item>
    <acme-menu-item slot="items" href="#">Three</acme-menu-item>
  </acme-menu>
</div>
```

## Custom trigger

variant="unstyled" wraps the trigger content in a bare button.

```html
<div style="min-height:60px;position:relative">
  <acme-menu width="200">
    <acme-menu-button slot="trigger" variant="unstyled">
      <acme-avatar size="30" username="evilrabbit"></acme-avatar>
    </acme-menu-button>
    <acme-menu-item slot="items">One</acme-menu-item>
    <acme-menu-item slot="items">Two</acme-menu-item>
    <acme-menu-item slot="items">Three</acme-menu-item>
  </acme-menu>
</div>
```

## Prefix and suffix

The prefix and suffix slots of an item take an icon.

```html
<div style="min-height:60px;position:relative">
  <div class="row" style="gap:24px;align-items:stretch;flex-wrap:nowrap">
    <acme-menu>
      <acme-menu-button slot="trigger" aria-label="Menu" shape="square" size="small" svg-only variant="secondary">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M3 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"/>
        </svg>
      </acme-menu-button>
      <acme-menu-item slot="items">
        <svg viewBox="0 0 16 16" width="16" height="16" slot="prefix" fill="currentColor" aria-hidden="true">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM8 3a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 8 3ZM4.5 6.25a.75.75 0 0 0 0 1.5H6.5V9l-1.2 3a.75.75 0 1 0 1.4.55L8 9.5l1.3 3.05a.75.75 0 1 0 1.4-.55L9.5 9V7.75h2a.75.75 0 0 0 0-1.5h-7Z"/>
        </svg>
        Left
      </acme-menu-item>
      <acme-menu-item slot="items">
        <svg viewBox="0 0 16 16" width="16" height="16" slot="prefix" fill="currentColor" aria-hidden="true">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM8 3a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 8 3ZM4.5 6.25a.75.75 0 0 0 0 1.5H6.5V9l-1.2 3a.75.75 0 1 0 1.4.55L8 9.5l1.3 3.05a.75.75 0 1 0 1.4-.55L9.5 9V7.75h2a.75.75 0 0 0 0-1.5h-7Z"/>
        </svg>
        Center
      </acme-menu-item>
      <acme-menu-item slot="items">
        <svg viewBox="0 0 16 16" width="16" height="16" slot="prefix" fill="currentColor" aria-hidden="true">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM8 3a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 8 3ZM4.5 6.25a.75.75 0 0 0 0 1.5H6.5V9l-1.2 3a.75.75 0 1 0 1.4.55L8 9.5l1.3 3.05a.75.75 0 1 0 1.4-.55L9.5 9V7.75h2a.75.75 0 0 0 0-1.5h-7Z"/>
        </svg>
        Right
      </acme-menu-item>
    </acme-menu>
    <acme-menu>
      <acme-menu-button slot="trigger" aria-label="Menu" shape="square" size="small" svg-only variant="secondary">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M3 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"/>
        </svg>
      </acme-menu-button>
      <acme-menu-item slot="items">
        Left
        <svg viewBox="0 0 16 16" width="16" height="16" slot="suffix" fill="currentColor" aria-hidden="true">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM8 3a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 8 3ZM4.5 6.25a.75.75 0 0 0 0 1.5H6.5V9l-1.2 3a.75.75 0 1 0 1.4.55L8 9.5l1.3 3.05a.75.75 0 1 0 1.4-.55L9.5 9V7.75h2a.75.75 0 0 0 0-1.5h-7Z"/>
        </svg>
      </acme-menu-item>
      <acme-menu-item slot="items">
        Center
        <svg viewBox="0 0 16 16" width="16" height="16" slot="suffix" fill="currentColor" aria-hidden="true">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM8 3a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 8 3ZM4.5 6.25a.75.75 0 0 0 0 1.5H6.5V9l-1.2 3a.75.75 0 1 0 1.4.55L8 9.5l1.3 3.05a.75.75 0 1 0 1.4-.55L9.5 9V7.75h2a.75.75 0 0 0 0-1.5h-7Z"/>
        </svg>
      </acme-menu-item>
      <acme-menu-item slot="items">
        Right
        <svg viewBox="0 0 16 16" width="16" height="16" slot="suffix" fill="currentColor" aria-hidden="true">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM8 3a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 8 3ZM4.5 6.25a.75.75 0 0 0 0 1.5H6.5V9l-1.2 3a.75.75 0 1 0 1.4.55L8 9.5l1.3 3.05a.75.75 0 1 0 1.4-.55L9.5 9V7.75h2a.75.75 0 0 0 0-1.5h-7Z"/>
        </svg>
      </acme-menu-item>
    </acme-menu>
  </div>
</div>
```

## Menu position

position sets the side and the alignment; the menu flips when the window bounds would clip it.

```html
<div style="min-height:60px;position:relative;display:flex;justify-content:flex-end">
  <acme-menu position="left-start" width="200">
    <acme-menu-button slot="trigger">Left Start</acme-menu-button>
    <acme-menu-item slot="items">One</acme-menu-item>
    <acme-menu-item slot="items">Two</acme-menu-item>
  </acme-menu>
</div>
```

## With section

```html
<div style="min-height:60px;position:relative">
  <acme-menu width="200">
    <acme-menu-button slot="trigger">Actions</acme-menu-button>
    <acme-menu-section slot="items" title="Section">
      <acme-menu-item>One</acme-menu-item>
      <acme-menu-item>Two</acme-menu-item>
    </acme-menu-section>
    <acme-menu-item slot="items">Three</acme-menu-item>
    <acme-menu-item slot="items" locked>Locked</acme-menu-item>
    <acme-menu-divider slot="items"></acme-menu-divider>
    <acme-menu-item slot="items" variant="error">Delete</acme-menu-item>
  </acme-menu>
</div>
```

## `<acme-menu>`

A menu of actions opened from a trigger: the `trigger` slot (an `acme-menu-button`, or any
button; the first unslotted child counts too) and rows in the `items` slot (`acme-menu-item`,
`acme-menu-section`, `acme-menu-divider`). The list floats `width` wide (150) at `position`
(bottom-start), 10px from the trigger, and flips or shifts when the window bounds would clip it;
it fades out over 150ms. A click on the trigger toggles it; Arrow Down, Arrow Up, Enter or Space
on the trigger open it on the first row. In the list the arrows move the highlight (past the
ends with `rotate`), Home and End jump, typed characters jump to the first row that starts with
them (`enable-typeahead="false"` turns that off), Enter or Space activate the highlighted row,
Escape (`acme-escape`, cancelable) closes and returns focus to the trigger, Tab is swallowed, a press outside
closes (`disable-interact-outside` keeps it open). A row's `acme-select` closes it unless
`close-on-select="false"`. `hover-mode` opens it while the pointer is over the menu and closes it
`hover-close-delay` ms after it leaves. Fires `acme-open` and `acme-close` (`detail.kind`).

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `open` | `open` | `boolean` | `false` |  |
| `position` | `position` | `MenuPosition` | `"bottom-start"` | Where the list opens: side, then alignment. |
| `width` | `width` | `number \| "auto"` | `150` | The list's width in px, or `auto` for the width of its rows. |
| `min-width` | `minWidth` | `number` | `0` | The list's least width in px, for an `auto` width. |
| `offset` | `offset` | `number` | `10` | The gap between the trigger and the list in px. |
| `height` | `height` | `number` | `0` | The list's greatest height in px; past it the rows scroll. |
| `close-on-select` | `closeOnSelect` | `boolean` | `true` | Whether a selected row closes the menu (`close-on-select="false"` keeps it open). |
| `rotate` | `rotate` | `boolean` | `false` | The highlight wraps past the first and last row. |
| `enable-typeahead` | `enableTypeahead` | `boolean` | `true` | Typed characters jump to a row (`enable-typeahead="false"` turns that off). |
| `disable-interact-outside` | `disableInteractOutside` | `boolean` | `false` | A press outside no longer closes the menu. |
| `hover-mode` | `hoverMode` | `boolean` | `false` | The menu opens while the pointer is over it. |
| `hover-close-delay` | `hoverCloseDelay` | `number` | `150` | In hover mode, the delay in ms before the menu closes after the pointer leaves. |

Slots: `trigger`, `(default)`, `items`

Events: `acme-escape`

## `<acme-menu-button>`

The button that opens a menu: an `acme-button` placed in the `trigger` slot of an `acme-menu`,
which sets `open` and the ARIA attributes on it. Takes every button property. The label holds
the content in a full-width row; `show-chevron` ends it with a chevron that turns while the
menu is open, and on the secondary variant the hovered trigger keeps a white fill and reads the
chevron in gray-1000. An icon-only trigger (an element as its content, or `svg-only`) is named
"Menu" unless `aria-label` says otherwise and reads gray-400 while the menu is open.
`variant="unstyled"` (or `type="unstyled"`) is a bare reset button around custom content (an
avatar), its label flush.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `show-chevron` | `showChevron` | `boolean` | `false` | A chevron at the end of the label that turns while the menu is open. |
| `open` | `open` | `boolean` | `false` | Whether the menu is open: the menu keeps it in step. |

Slots: `prefix`, `suffix`, `(default)`

## `<acme-menu-item>`

One row of a menu: a 36px `menuitem` (44 and 16px text below 601px) with the label in the
default slot, an icon in the `prefix` slot before it and one in the `suffix` slot at the end.
`href` renders an anchor (`external` opens it in a new tab); `variant="error"` reads red-900;
`disabled` reads gray-700 and takes no pointer; `locked` is a disabled row with a gray-700 lock
suffix, for an action that needs more permissions. The menu marks the highlighted row
(`selected`, the `data-selected` state: gray-alpha-100, red-100 on an error row) as the keys
and the pointer move over the rows. A click, Enter or Space fires `acme-select`.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `href` | `href` | `string` | `""` |  |
| `external` | `external` | `boolean` | `false` | Opens the link in a new tab. |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `variant` | `variant` | `"default" \| "error"` | `"default"` | `error` colors the row red for a destructive action. |
| `locked` | `locked` | `boolean` | `false` |  |
| `selected` | `selected` | `boolean` | `false` | The highlighted row; the menu sets it. |
| `value` | `value` | `string` | `""` | The text typeahead matches: the label's text unless set. |

Slots: `prefix`, `suffix`, `(default)`

Events: `acme-select`

## `<acme-menu-section>`

A titled group of rows inside a menu: the `title` (the native attribute is consumed, so it never
shows as a tooltip; `heading` is the same) in gray-800 over a plain group list of the slotted
`acme-menu-item`s.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `heading` | `heading` | `string` | `""` |  |

Slots: `(default)`

## `<acme-menu-divider>`

A 1px separator row between the rows of a menu, bleeding into the list's padding.

## Best Practices

**When to use**

- Menu is a visible trigger that opens a list of actions on one resource: a dots menu on a row, a dropdown on a primary entity.
- Right-click or long-press on a row is Context Menu. Global commands behind ⌘K are Command Menu. Two related primary actions are a split button, not a buried secondary action.
- Cap a Menu at about 10 items. Past that, group with a section or move secondary actions to a settings page.

**Behavior**

- Open on click, not on hover; hover-open menus collide with screen readers and trackpad scrolls.
- The position flips at the window bounds; do not hardcode a side that clips on a narrow viewport.
- Close on item activation, Escape and an outside click. Never close on hover-out.
- Use locked for a permission-gated action, so the lock icon and the disabled state explain why the row is inert.

**Content**

- Items are Title Case Verb + Noun (Rename Project, Duplicate Deployment). A bare Rename or Edit is wrong outside an obvious single-object context.
- End an item with … only when it opens a follow-up dialog (Rename…, Transfer to Team…).
- Destructive items go last, after a divider, and keep the Verb + Noun form (Delete Project, never a bare Delete).
- Section titles are Title Case, one or two words (Workspace, Recent Projects).

**Accessibility**

- Up and Down move the highlight through the items, Home and End jump to the first and last, Enter or Space activates.
- Typeahead jumps to the first item whose label starts with the typed characters; keep the visible label first so typeahead matches what the reader sees.
- Focus returns to the trigger on close, so a keyboard user keeps their place in the row.

