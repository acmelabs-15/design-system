# Command Menu

Launch a set of actions as a full-screen overlay.

## Default

```html
<acme-button>Open Command Menu</acme-button>
<acme-command-menu placeholder="What do you need?">
  <acme-command-group heading="Suggestions">
    <acme-command-item>Figma Import</acme-command-item>
  </acme-command-group>
  <acme-command-group heading="Commands">
    <acme-command-item>Import Extension</acme-command-item>
    <acme-command-item>Manage Extensions</acme-command-item>
  </acme-command-group>
  <acme-command-group heading="Collaboration">
    <acme-command-item>Flags Explorer</acme-command-item>
  </acme-command-group>
</acme-command-menu>
<script>root.querySelector("acme-button").addEventListener("click", () => root.querySelector("acme-command-menu").show());</script>
```

## With divider

```html
<acme-button>Open Command Menu</acme-button>
<acme-command-menu placeholder="What do you need?">
  <acme-command-item>Item 1</acme-command-item>
  <acme-command-item>Item 2</acme-command-item>
  <acme-command-divider></acme-command-divider>
  <acme-command-item>Item 3</acme-command-item>
  <acme-command-group heading="Group 1">
    <acme-command-item>Grouped Item 1</acme-command-item>
    <acme-command-item>Grouped Item 2</acme-command-item>
  </acme-command-group>
</acme-command-menu>
<script>root.querySelector("acme-button").addEventListener("click", () => root.querySelector("acme-command-menu").show());</script>
```

## With suffix

```html
<acme-button>Open Command Menu</acme-button>
<acme-command-menu placeholder="What do you need?">
  <acme-command-group heading="Group 1">
    <acme-command-item>
      <p class="text-copy-14" slot="end" style="color:var(--ds-gray-700)">USA</p>
      United States of America
    </acme-command-item>
    <acme-command-item>
      <p class="text-copy-14" slot="end" style="color:var(--ds-gray-700)">ESP</p>
      Spain
    </acme-command-item>
    <acme-command-item>
      <p class="text-copy-14" slot="end" style="color:var(--ds-gray-700)">FRA</p>
      France
    </acme-command-item>
  </acme-command-group>
  <acme-command-group heading="Group 2">
    <acme-command-item>
      <p class="text-copy-14" slot="end" style="color:var(--ds-gray-700)">AUT</p>
      Austria
    </acme-command-item>
    <acme-command-item>
      Switzerland
      <svg viewBox="0 0 16 16" width="16" height="16" slot="end" style="color:var(--ds-gray-700)" aria-hidden="true">
        <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-4.4-2.5-1.1-1.1L7 7.9 5.5 6.4 4.4 7.5 7 10.1l4.6-4.6Z"/>
      </svg>
    </acme-command-item>
    <acme-command-item>
      <p class="text-copy-14" slot="end" style="color:var(--ds-gray-700)">GER</p>
      Germany
    </acme-command-item>
  </acme-command-group>
</acme-command-menu>
<script>root.querySelector("acme-button").addEventListener("click", () => root.querySelector("acme-command-menu").show());</script>
```

## `<acme-command-menu>`

A set of actions launched as a full-screen overlay: the native dialog opens in the top layer
(focus stays inside it, the page behind is inert and stops scrolling), the backdrop fades in and
the 640px box scales in 15% from the top; on close both animate out and the menu leaves. The box
holds the input block (the searchbox with `placeholder`, the Esc chip) over the list of the
slotted `acme-command-group`, `acme-command-item` and `acme-command-divider` children. Typing
scores every row's value against the query (`filter`, the vendored command score by default;
`should-filter="false"` leaves the rows as they are): a row that scores 0 hides, the rest sort
by score, a group with no match hides, dividers hide, and the empty message shows the query
when nothing matches. The arrows move the highlight (`value`, the highlighted row's value) while
focus stays in the searchbox (Alt jumps a group, Meta to an end; Ctrl+N/P/J/K work too), Home
and End jump, Enter selects the highlighted row, the pointer highlights the row under it, a click
selects it. `pages` is the page stack (`{ label, placeholder }` each): the crumbs above the
searchbox show it, the last page's placeholder replaces the searchbox's, rows keep to their
`page` (a row without one belongs to the root page), Backspace on an empty searchbox goes up a
page, a crumb goes back to its page; `addPage()` and `setPages()` move through the stack. Escape,
the Esc chip and a press on the backdrop close the menu; `hotkey` (`Mod+K` by default; `"false"`
turns it off) toggles it from anywhere on the page. `loading` shows a shimmering bar under the
input block; `infinite-scrolling-threshold` with `infiniteScrollingCb` loads more rows as the list
nears its end. `label` names the dialog; `description` is its screen-reader description. Fires
`acme-open`, `acme-close` (once the menu has left), `acme-input` (the query), `acme-highlight`
(the highlighted value), `acme-pages` (the page stack, from `addPage()`, `setPages()`, Backspace
or a crumb); a row's `acme-select` bubbles through, and the menu closes on it unless the row keeps
it open or the event is canceled.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `open` | `open` | `boolean` | `false` | Open state; `show()` and `close()` set it. |
| `label` | `label` | `string` | `""` | The dialog's accessible name. |
| `placeholder` | `placeholder` | `string` | `""` | The searchbox's placeholder while no page sets its own. |
| `description` | `description` | `string` | `"Use the command menu to navigate the site."` | The dialog's screen-reader description. |
| `pages` | `pages` | `CommandMenuPage[]` | `[]` | The page stack; the last page is the active one. |
| `loading` | `loading` | `boolean` | `false` | A shimmering bar under the input block while rows load. |
| `should-filter` | `shouldFilter` | `boolean` | `true` | The query narrows and sorts the rows; `"false"` leaves them as they are. |
| — | `filter` | `CommandMenuFilter` | `commandScore` | Scores a row's value against the query. |
| `value` | `value` | `string` | `""` | The highlighted row's value. |
| `hotkey` | `hotkey` | `string` | `"Mod+K"` | The key combo that toggles the menu from anywhere on the page; `"false"` turns it off. |
| `infinite-scrolling-threshold` | `infiniteScrollingThreshold` | `number` | `0` | Within this many px of the list's end, `infiniteScrollingCb` runs. |
| — | `infiniteScrollingCb` | `() => boolean \| Promise<boolean>` | — | Loads more rows as the list nears its end; a truthy result scrolls the list to its end. |

Slots: `(default)`

Events: `acme-close`, `acme-open`

## `<acme-command-group>`

A group of command menu rows under a `heading` (Title Case, one or two words): a 36px row of
13px gray text over the slotted `acme-command-item` rows. The menu hides the group while no row
in it matches the query. `page` keeps the group, rows included, to one page of the menu.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `heading` | `heading` | `string` | `""` |  |
| `page` | `page` | `string` | `""` | The page of the menu the group belongs to; unset, the root page. |

Slots: `(default)`

## `<acme-command-item>`

One row of a command menu: the label as content (a Title Case verb phrase), an optional icon in
the `start` slot (a 20px box), an optional `keybind` (keys separated by spaces, `Meta K`; kbd
chips at the end of the row) and optional content in the `end` slot at the end. `value` is
what the query is scored against and what a selection reports (the label, lowercased, when
unset); `disabled` keeps the row out of the keys and the pointer; `page` keeps the row to one
page of the menu. The menu highlights the row under the keys or the pointer (`selected`); a
click or Enter selects it: `acme-select` fires (cancelable; `detail.value`), and the menu closes
unless `close-on-callback="false"`.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `value` | `string` | `""` | The value the query is scored against and a selection reports; the label, lowercased, when empty. |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `keybind` | `keybind` | `string` | `""` | Keys separated by spaces (`Meta K`), shown as kbd chips at the end of the row. |
| `close-on-callback` | `closeOnCallback` | `boolean` | `true` | The menu closes on a selection; `"false"` keeps it open. |
| `page` | `page` | `string` | `""` | The page of the menu the row belongs to; unset, the root page. |
| `selected` | `selected` | `boolean` | `false` | The highlighted row; the menu sets it. |

Slots: `start`, `(default)`, `end`

## `<acme-command-divider>`

A hairline between command menu rows, 8px above and below, spanning the list's padding. The
menu hides it while a query narrows the list, unless `always-render`. `page` keeps it to one
page of the menu.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `always-render` | `alwaysRender` | `boolean` | `false` | The line stays while a query narrows the list. |
| `page` | `page` | `string` | `""` | The page of the menu the line belongs to; unset, the root page. |

## Best Practices

**When to use**

- The Command Menu is the global, keyboard-first palette that finds resources and runs actions across the app.
- A menu opened from a visible trigger on one resource is a Menu; a right click on a row is a Context Menu.
- Split items into pages (Projects, Team Settings) once a flat list would pass about 30 items or mix resource types.

**Behavior**

- ⌘K on macOS and Ctrl+K elsewhere open it; the binding is global and never reused for an in-page filter.
- It opens on the root page and keeps the query when the user steps back from a sub-page.
- Focus stays inside the overlay while open and returns to the element that had it on close.
- An empty input shows recent or default items, so the menu is useful before the first keystroke.

**Content**

- Items are Title Case verb phrases (Deploy Project, Invite Team Member); a command acts, so navigation phrasing such as Go to project page is out.
- A page label is Title Case and names the scope (Projects, Team Settings).
- A page placeholder is sentence case, action-oriented and ends with … (Search projects…); a bare Search… names no scope.
- A group heading is Title Case, one or two words (Actions, Recent).

**Accessibility**

- The result count is aria-live="polite", so a screen reader hears the list narrow as the user types.
- Up and Down move the highlight, Enter activates, Escape closes; Backspace in an empty input pops the page stack.
- An item's shortcut is shown as a Kbd, so sighted users find it and a screen reader announces it as a label.

