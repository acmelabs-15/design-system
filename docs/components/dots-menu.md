# Dots Menu

An overflow menu: a three-dot icon button that opens a dropdown of further actions.

## Default

```html
<acme-dots-menu>
  <acme-menu-item>View Build Logs</acme-menu-item>
  <acme-menu-item>View Projects</acme-menu-item>
  <acme-menu-item>View Analytics</acme-menu-item>
</acme-dots-menu>
```

## Sizes

icon-size sets the width of the dots; the trigger stays 32px square.

```html
<div class="row" style="gap:24px;align-items:flex-start">
  <acme-dots-menu icon-size="10">
    <acme-menu-item>View Build Logs</acme-menu-item>
    <acme-menu-item>View Projects</acme-menu-item>
    <acme-menu-item>View Analytics</acme-menu-item>
  </acme-dots-menu>
  <acme-dots-menu icon-size="12">
    <acme-menu-item>View Build Logs</acme-menu-item>
    <acme-menu-item>View Projects</acme-menu-item>
    <acme-menu-item>View Analytics</acme-menu-item>
  </acme-dots-menu>
  <acme-dots-menu icon-size="18">
    <acme-menu-item>View Build Logs</acme-menu-item>
    <acme-menu-item>View Projects</acme-menu-item>
    <acme-menu-item>View Analytics</acme-menu-item>
  </acme-dots-menu>
</div>
```

## Disabled

```html
<acme-dots-menu disabled>
  <acme-menu-item>View Build Logs</acme-menu-item>
  <acme-menu-item>View Projects</acme-menu-item>
  <acme-menu-item>View Analytics</acme-menu-item>
</acme-dots-menu>
```

## Disabled Menu Item

```html
<acme-dots-menu>
  <acme-menu-item>View Build Logs</acme-menu-item>
  <acme-menu-item disabled>View Projects</acme-menu-item>
  <acme-menu-item>View Analytics</acme-menu-item>
</acme-dots-menu>
```

## `<acme-dots-menu>`

An overflow menu: a small square tertiary `acme-menu-button` (named "Menu", or `label`) holding
three dots, `icon-size` wide (18), that opens an `acme-menu` at its bottom end, as wide as its
rows and at least 200px, of the `acme-menu-item` children (sections and dividers too). The open
trigger reads gray-alpha-100; `disabled` fades it and reads the dots gray under a not-allowed
cursor; `horizontal="false"` stacks the dots. `close-on-select="false"` keeps the menu open after
a row; `height` caps the list in px. `open` follows the menu, and `show()` and `close()` drive it.
Fires `acme-open` and `acme-close` (`detail.kind`) as the menu does. The trigger is the `trigger`
part; the menu's `floating` and `menu` parts are exported.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `disabled` | `disabled` | `boolean` | `false` |  |
| `icon-size` | `iconSize` | `number` | `18` | The dots icon's width and height in px. |
| `horizontal` | `horizontal` | `boolean` | `true` | The dots run across; `horizontal="false"` stacks them. |
| `close-on-select` | `closeOnSelect` | `boolean` | `true` | Whether a selected row closes the menu (`close-on-select="false"` keeps it open). |
| `height` | `height` | `number` | `0` | The list's greatest height in px; past it the rows scroll. |
| `label` | `label` | `string` | `"Menu"` | The trigger's accessible name. |
| `open` | `open` | `boolean` | `false` | Whether the menu is open: follows the menu, and opens or closes it when set. |

Slots: `(default)`

Events: `acme-escape`

## Best Practices

**When to use**

- A dots menu holds the secondary actions of one row or card: the primary action stays visible, the rest sits behind the dots.
- Two or three actions that all matter belong in view, as buttons; a dots menu hides them.
- A menu opened from a labelled button is Menu; a right-click on a row is Context Menu.

**Behavior**

- The list opens under the end of the trigger and flips when the window bounds would clip it.
- A selected row closes the menu; close-on-select="false" keeps it open for a row that toggles a setting.
- disabled fades the trigger and keeps the menu closed; a disabled row stays in the list but takes no pointer.

**Content**

- Rows are Title Case Verb + Noun (View Build Logs, Delete Project); a destructive row goes last, after a divider.
- Keep the trigger named Menu unless the row's name adds meaning (label="Deployment actions").

**Accessibility**

- The trigger is a button named Menu with aria-haspopup and aria-expanded; the list is a menu the arrow keys walk.
- Escape closes the menu and returns focus to the trigger.

