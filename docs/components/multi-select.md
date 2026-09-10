# Multi Select

A keyboard-navigable dropdown for selecting multiple items with advanced focus management.

## Select Actions

The component provides different selection behaviors based on current state: checkbox focus + Enter/Space toggles the item; button focus + Enter/Space runs the smart selection (Only, Check All, or a toggle, by the state); the hidden action labels appear on hover or focus to show the available action.

```html
<div class="vstack" style="gap:16px">
  <acme-multi-select align="start">
    <span slot="trigger">2 items selected</span>
    <acme-multi-select-row name="Design System" value="design" checked></acme-multi-select-row>
    <acme-multi-select-row name="Components" value="components" checked></acme-multi-select-row>
    <acme-multi-select-row name="Design Tokens" value="tokens"></acme-multi-select-row>
  </acme-multi-select>
  <p class="text-copy-14" style="color:var(--ds-gray-900)">Hover over items to see action labels. Different actions appear based on selection state.</p>
</div>
<script>const ms = root.querySelector("acme-multi-select"); const text = root.querySelector("[slot=trigger]"); const label = () => { const n = ms.value.length; text.textContent = n === 0 ? "No items selected" : n === ms.rows.length ? "All items selected" : n + " items selected"; }; ms.addEventListener("acme-change", label); label();</script>
```

## Keyboard Navigation

Up and Down move between rows and keep the checkbox or button column; Left and Right switch between the checkbox and the button in the current row; Tab leaves the menu (natural tab behavior); Enter and Space act on what has focus.

```html
<div class="vstack" style="gap:16px">
  <acme-multi-select align="start">
    <span slot="trigger">1 category selected</span>
    <acme-multi-select-row name="Frameworks" value="frameworks" checked></acme-multi-select-row>
    <acme-multi-select-row name="Libraries" value="libraries"></acme-multi-select-row>
    <acme-multi-select-row name="Development Tools" value="tools"></acme-multi-select-row>
    <acme-multi-select-row name="Databases" value="databases"></acme-multi-select-row>
  </acme-multi-select>
  <p class="text-copy-14" style="color:var(--ds-gray-900)">Try keyboard navigation: ↑ ↓ for rows, ← → for checkbox/button focus, Tab to cycle through all elements</p>
</div>
<script>const ms = root.querySelector("acme-multi-select"); const text = root.querySelector("[slot=trigger]"); const label = () => { const n = ms.value.length; text.textContent = n === 0 ? "No categories selected" : n === ms.rows.length ? "All categories selected" : n === 1 ? "1 category selected" : n + " categories selected"; }; ms.addEventListener("acme-change", label); label();</script>
```

## Controlled State

Use controlled state to manage selections programmatically: set value from outside and the rows follow.

```html
<div class="vstack" style="gap:16px">
  <acme-multi-select align="start">
    <span slot="trigger">Selected: analytics</span>
    <acme-multi-select-row name="Analytics" value="analytics" checked></acme-multi-select-row>
    <acme-multi-select-row name="Monitoring" value="monitoring"></acme-multi-select-row>
    <acme-multi-select-row name="Security" value="security"></acme-multi-select-row>
    <acme-multi-select-row name="Performance" value="performance"></acme-multi-select-row>
  </acme-multi-select>
  <div class="vstack" style="gap:8px">
    <p class="text-copy-14" style="color:var(--ds-gray-900)">
      <a href="#" data-set="">Clear All</a>
      ,
      <a href="#" data-set="analytics,monitoring">Core Features</a>
      ,
      <a href="#" data-set="security,performance">Advanced Features</a>
    </p>
  </div>
</div>
<script>const ms = root.querySelector("acme-multi-select"); const text = root.querySelector("[slot=trigger]"); const label = () => { const n = ms.value.length; text.textContent = n === 0 ? "No features selected" : n === ms.rows.length ? "All features selected" : "Selected: " + ms.value.join(", "); }; ms.addEventListener("acme-change", label); for (const a of root.querySelectorAll("a[data-set]")) a.addEventListener("click", (e) => { e.preventDefault(); ms.value = a.dataset.set ? a.dataset.set.split(",") : []; label(); }); label();</script>
```

## `<acme-multi-select>`

A trigger that opens a list of rows to check several of them: `acme-multi-select-row` children,
the trigger's content in the `trigger` slot (the count, `3 regions selected`), and a chevron that
turns while the list is open. The list floats 8px under the trigger's end in the top layer, at
least the trigger's width and no taller than the room below it or 384px, and fades out over
200ms; `side` and `align` place it (`align-offset`, `collision-padding`, `avoid-collisions="false"`).
A click on the trigger toggles it; Arrow Down opens it. In the list Arrow Down and Arrow Up move
focus between the rows' buttons (around the ends) and keep the active column, Left makes the
checkbox column active and Right the button, Enter or Space act on the focused row (a toggle in
the checkbox column, the row's smart action otherwise), Escape closes and returns focus to the
trigger, Tab leaves, and a press or a focus outside closes. A row's `acme-select` (unless a
listener cancels it) toggles the row, checks it alone or checks every row; the list then fires
`acme-change` (`detail.value`, the checked rows' values, with `action` and `row`) and hands each
row its `selected-count` and `total-count`. `value` reads and sets the checked rows' values.
Fires `acme-open` and `acme-close`. Form-associated (an entry per checked row under `name`) and
labelable; `disabled` disables the trigger.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `open` | `open` | `boolean` | `false` |  |
| `name` | `name` | `string` | `""` |  |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `side` | `side` | `MultiSelectSide` | `"bottom"` |  |
| `align` | `align` | `MultiSelectAlign` | `"end"` |  |
| `align-offset` | `alignOffset` | `number` | `0` | Offset along the aligned edge, in px. |
| `avoid-collisions` | `avoidCollisions` | `boolean` | `true` | The list flips and shifts to stay in the window; `"false"` pins it. |
| `collision-padding` | `collisionPadding` | `number` | `0` | Space kept from the window's edges when the list moves, in px. |

Slots: `trigger`, `(default)`

Events: `acme-change`

## `<acme-multi-select-row>`

One row of a multi select: a 28px box holding an `acme-checkbox` (after the button with
`checkbox-position="end"`) and a button that fills the rest with the name (`name`, or the
default slot's content) after the `leading` slot's content, and the action hint at its end. The
hint names what a press does and shows while the button is hovered or focused: `Check All` on a
checked row and `Only` on an unchecked one while the selection is mixed, `Only` while every row
is checked, `Check` while none is; with the pointer over the checkbox (or Left pressed on the
row), `Check` or `Uncheck`. A press on the button runs that action; a press on the checkbox, or
Enter or Space with the checkbox column active, toggles the row; `show-action-label="false"`
drops the hint and makes every press a toggle. A disabled row fades the button to 60% under a
not-allowed cursor and takes no press. The row fires `acme-select` (cancelable; `detail.action`
is `toggle`, `selectOnly` or `selectAll`, with `name`, `value` and `checked`) and leaves the
selection to its multi select: `checked`, `selected-count`, `total-count`, `hovered` and
`checkbox-hovered` are set from outside. `value` is what the form takes for a checked row (the
name when unset); `checkbox-name` names the checkbox itself (the name when unset).

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `name` | `name` | `string` | `""` | The row's name: the button's accessible name, the checkbox's label, and the text when the default slot is empty. |
| `value` | `value` | `string` | `""` | The value the form takes while the row is checked; the name when unset. |
| `checked` | `checked` | `boolean` | `false` |  |
| `disabled` | `disabled` | `boolean` | `false` |  |
| `indeterminate` | `indeterminate` | `boolean` | `false` |  |
| `checkbox-name` | `checkboxName` | `string` | `""` | The checkbox's own name; the row's name when unset. |
| `checkbox-position` | `checkboxPosition` | `MultiSelectCheckboxPosition` | `"start"` | Where the checkbox sits: before the button, or after it (32px wide). |
| `show-action-label` | `showActionLabel` | `boolean` | `true` | The action hint at the button's end; `"false"` drops it and makes every press a toggle. |
| `selected-count` | `selectedCount` | `number` | `0` | Checked rows in the list; the multi select sets it. |
| `total-count` | `totalCount` | `number` | `0` | Rows in the list; the multi select sets it. |
| `hovered` | `hovered` | `boolean` | `false` | The row under the pointer or the keys; the multi select sets it. |
| `checkbox-hovered` | `checkboxHovered` | `boolean` | `false` | The checkbox column is the active one on the hovered row (the pointer over the checkbox, or Left pressed); the multi select sets it. |

Slots: `leading`, `(default)`

Events: `acme-select`

## Best Practices

**When to use**

- Pick a multi select when users pick more than one value from a known list (regions, scopes, tags).
- For a single value from a short list, use Select.
- When typing to filter is more important than seeing every option at once, use Combobox.
- Skip it for boolean settings; Toggle handles those.

**Behavior**

- Show the selected count in the trigger (3 regions selected); show the single name when only one is picked.
- Use controlled mode (value set from outside) when state lives in the URL or syncs to the server, so the trigger label and the stored value stay in lockstep.
- Keep checkbox focus and button focus distinct, so Up and Down navigate rows and Left and Right toggle between the row's checkbox and action button.
- For empty filters, render No {items} match "{query}" rather than No results.

**Accessibility**

- Each row checkbox needs an aria-label that names the item (Select us-east-1); a bare Select is unanchored for screen readers.
- The trigger button needs a stable accessible name even when zero items are selected; do not rely on the placeholder alone.
- Trap focus inside the menu while it is open and return focus to the trigger on close.
- Announce bulk actions (Select All, Select Only) through the visible button label, so the action matches what the screen reader speaks.

