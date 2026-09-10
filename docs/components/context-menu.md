# Context Menu

A menu of contextual actions, revealed on right click or long press.

## Default

```html
<acme-context-menu>
  <div class="text-copy-14" style="width:300px;padding:45px 0;border:1px dashed var(--ds-gray-alpha-600);border-radius:4px;text-align:center">Right click here</div>
  <acme-menu-item slot="items">Item one</acme-menu-item>
  <acme-menu-item slot="items">Item Two</acme-menu-item>
  <acme-menu-item slot="items">Item Three</acme-menu-item>
  <acme-menu-item slot="items">Item Four</acme-menu-item>
</acme-context-menu>
<script>root.querySelector('acme-context-menu').addEventListener('acme-select', () => console.log('value'));</script>
```

## Disabled items

```html
<acme-context-menu>
  <div class="text-copy-14" style="width:300px;padding:45px 0;border:1px dashed var(--ds-gray-alpha-600);border-radius:4px;text-align:center">Right click here</div>
  <acme-menu-item slot="items">Item one</acme-menu-item>
  <acme-menu-item slot="items" disabled>Item Two</acme-menu-item>
  <acme-menu-item slot="items" disabled>Item Three</acme-menu-item>
  <acme-menu-item slot="items">Item Four</acme-menu-item>
</acme-context-menu>
<script>root.querySelector('acme-context-menu').addEventListener('acme-select', () => console.log('value'));</script>
```

## Link items

```html
<acme-context-menu>
  <div class="text-copy-14" style="width:300px;padding:45px 0;border:1px dashed var(--ds-gray-alpha-600);border-radius:4px;text-align:center">Right click here</div>
  <acme-menu-item slot="items" href="/">Item one</acme-menu-item>
  <acme-menu-item slot="items" href="/">Item Two</acme-menu-item>
  <acme-menu-item slot="items" href="/">Item Three</acme-menu-item>
  <acme-menu-item slot="items" href="/">Item Four</acme-menu-item>
</acme-context-menu>
```

## Prefix and suffix

```html
<div class="row" style="gap:24px;align-items:stretch">
  <acme-context-menu>
    <div class="text-copy-14" style="width:300px;padding:45px 0;border:1px dashed var(--ds-gray-alpha-600);border-radius:4px;text-align:center">Right click here</div>
    <acme-menu-item slot="items" href="/">
      <svg viewBox="0 0 16 16" width="16" height="16" slot="prefix" fill="currentColor" aria-hidden="true">
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 4 4 7H4l4-7Z"/>
      </svg>
      Item one
    </acme-menu-item>
    <acme-menu-item slot="items" href="/">
      <svg viewBox="0 0 16 16" width="16" height="16" slot="prefix" fill="currentColor" aria-hidden="true">
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 4 4 7H4l4-7Z"/>
      </svg>
      Item Two
    </acme-menu-item>
    <acme-menu-item slot="items" href="/">
      <svg viewBox="0 0 16 16" width="16" height="16" slot="prefix" fill="currentColor" aria-hidden="true">
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 4 4 7H4l4-7Z"/>
      </svg>
      Item Three
    </acme-menu-item>
    <acme-menu-item slot="items" href="/">
      <svg viewBox="0 0 16 16" width="16" height="16" slot="prefix" fill="currentColor" aria-hidden="true">
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 4 4 7H4l4-7Z"/>
      </svg>
      Item Four
    </acme-menu-item>
  </acme-context-menu>
  <acme-context-menu>
    <div class="text-copy-14" style="width:300px;padding:45px 0;border:1px dashed var(--ds-gray-alpha-600);border-radius:4px;text-align:center">Right click here</div>
    <acme-menu-item slot="items" href="/">
      Item one
      <svg viewBox="0 0 16 16" width="16" height="16" slot="suffix" fill="currentColor" aria-hidden="true">
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 4 4 7H4l4-7Z"/>
      </svg>
    </acme-menu-item>
    <acme-menu-item slot="items" href="/">
      Item Two
      <svg viewBox="0 0 16 16" width="16" height="16" slot="suffix" fill="currentColor" aria-hidden="true">
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 4 4 7H4l4-7Z"/>
      </svg>
    </acme-menu-item>
    <acme-menu-item slot="items" href="/">
      Item Three
      <svg viewBox="0 0 16 16" width="16" height="16" slot="suffix" fill="currentColor" aria-hidden="true">
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 4 4 7H4l4-7Z"/>
      </svg>
    </acme-menu-item>
    <acme-menu-item slot="items" href="/">
      Item Four
      <svg viewBox="0 0 16 16" width="16" height="16" slot="suffix" fill="currentColor" aria-hidden="true">
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 4 4 7H4l4-7Z"/>
      </svg>
    </acme-menu-item>
  </acme-context-menu>
</div>
```

## `<acme-context-menu>`

A menu of contextual actions on the content in the default slot: a right click (the `contextmenu`
event, the keyboard's menu key included) or a 700ms press of a touch or pen pointer opens an
`acme-menu` of the `acme-menu-item` rows in the `items` slot (sections and dividers too), `width`
wide (160), 2px to the right of the point and level with it, flipped and shifted when the window
bounds would clip it. Over a link, the list starts with "Open in New Tab" and "Copy Link Address"
(a toast reports the copy), then a separator before the rows. The browser's own menu stays off
the content only. Arrow keys move the highlight, Enter or Space activate, Escape (`acme-escape`,
cancelable) and a press outside close, and so does a selected row; focus returns to where it was
unless a press outside closed it. The open menu is modal: the page stops scrolling and takes no
pointer events (a press outside only closes the list). The host is the inline wrapper around the
content, `data-state` open or closed; `disabled` keeps the menu shut. `open` follows the menu, and `show(x, y)` and
`close()` drive it. Fires `acme-open` and `acme-close` (`detail.kind`). The menu's `floating` and
`menu` parts are exported.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `open` | `open` | `boolean` | `false` | Whether the menu is open: follows the menu, and opens (at the last point) or closes it when set. |
| `width` | `width` | `number` | `160` | The list's width in px. |
| `disabled` | `disabled` | `boolean` | `false` | Nothing opens the menu. |

Slots: `(default)`, `items`

Events: `acme-escape`

## Best Practices

**When to use**

- A Context Menu gives power users shortcuts on right click or long press over a row, a file or a canvas object.
- It is never the only way to an action: every item also exists in a visible Menu trigger or row button, so mouse-only and keyboard-only users have the same reach.
- A global command palette is the Command Menu; a dropdown from a visible trigger is a Menu.

**Behavior**

- Right click on desktop and long press on touch open it; the native browser menu is suppressed on the trigger area only, never the whole page.
- The menu opens at the pointer; when it would overflow the viewport it flips horizontally, then vertically, before it clips.
- It closes on activation, Escape and outside click, and never on hover-out.

**Content**

- Items follow the Menu rules: Title Case Verb + Noun (Open in New Tab, Copy URL, Delete Deployment); a bare verb is wrong.
- An item ends with … only when activating it opens a follow-up dialog (Rename…, Move to Folder…).
- Destructive items sit last, after a divider, and keep the Verb + Noun label; Delete alone never ships.

**Accessibility**

- The keyboard menu key (Shift+F10 on Windows and Linux, the menu key, or the platform equivalent) opens the same menu without a right click.
- Up and Down move focus, Enter and Space activate, Escape closes and returns focus to the row.
- Destructive items stay out of nested submenus; one level keeps keyboard navigation predictable.

