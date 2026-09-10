# One vocabulary for the places beside content: `start` and `end`

Decided 2026-09-10 by Peter, who noticed the button used `prefix`/`suffix` while the input uses
`start`/`end`, and asked for the button to match the input.

## The decision

**Every element uses `start` and `end`.** Peter chose the full sweep over renaming the button alone,
so the system has one word for one idea rather than two vocabularies.

`data-prefix` and `data-suffix` are removed everywhere.

## What was there

| Vocabulary | Elements |
|---|---|
| `prefix` / `suffix` | button, banner, command-item, combobox-option, feedback, menu-button, menu-item (+ combobox and multi-select internally) |
| `start` / `end` | input, select, search, textarea, topbar |

Nine elements moved. Renamed in each: the slot names, the `hasPrefix`/`hasSuffix` fields, the
internal `.prefix`/`.suffix` class names, the same names in each map, and the public attributes and
getters built on them — `truncate-prefix` → `truncate-start`, `no-input-prefix` → `no-input-start`,
`display-selected-suffix` → `display-selected-end`, `prefix-icon` → `start-icon`, `prefixNode` →
`startNode`.

## Why the attributes went

**No generated stylesheet ever read `data-prefix` or `data-suffix`.** The styles key off the
`.prefix`/`.suffix` classes instead. The attributes were inert markup copied from the reference,
so removing them changes nothing a rule can see. Checked before removing, not after.

## Three things the sweep found that were not the rename

1. **`acme-menu-button` was duplicating its base class's state.** It extends `AcmeButton`, and both
   declared their own private `hasStart`/`hasEnd`. The old names differed (`prefixed` against
   `hasPrefix`), which hid it; renaming made the two collide and the compiler said so. The base's
   fields are now `protected` and the subclass's copies are gone.

2. **A docs example was passing a slot that does not exist.** `search-input.ts` wrote
   `slot="prefix"` on an `acme-search`, which only accepts `start`, so the icon landed nowhere. A
   pre-existing bug, now fixed.

3. **Example headings are the reference's, not ours.** `menu`, `context-menu`, `select-label` and
   `input-label` maps carry "Prefix and suffix" in their `skip` / `CLOSED` arrays, and those match
   against the reference spec's headings. **They must not be renamed.** Our own docs headings are
   independent and were renamed where they are ours; where our page mirrors the reference's heading
   for parity (combobox's "With prefix icons"), the heading stays and only the slot changed.

## Verified

- 599 tests pass.
- Every affected census page holds at **0 hard**: button, badge, snippet, input, select, combobox,
  combobox-option, command-menu-item, menu-item, menu-list, menu-divider, multi-select,
  command-menu, feedback, banner.
- In the browser, where the unit tests are blind because `slotchange` does not fire under happy-dom:
  a button's `start` span renders with its content assigned and `data-prefix` is gone; a
  **late-slotted** icon makes the span appear and removing it makes the span go; an open menu item
  renders a 16×16 icon in its start place.
- The whole built docs site carries no `slot="prefix"`, `slot="suffix"`, `data-prefix` or
  `data-suffix`.

## One word that stays

`middle-truncate` uses `prefix`/`suffix` for the two halves of a truncated string. That is the
correct word for text, not a place beside content, so it is untouched.
