# Keyboard Input

Display keyboard input that triggers an action.

## Modifiers

```html
<acme-kbd meta></acme-kbd>
<acme-kbd shift></acme-kbd>
<acme-kbd alt></acme-kbd>
<acme-kbd ctrl></acme-kbd>
```

## Combination

```html
<acme-kbd meta shift></acme-kbd>
```

## Small

```html
<acme-kbd small>/</acme-kbd>
```

## `<acme-kbd>`

Keyboard input: a key cap. The root carries the small class; each modifier (⌘ ⇧ ⌥ ⌃, in
that order, ⌘ as Ctrl and ⌥ as Alt off Apple platforms) is its own span, the meta span an
inline block of 1em, and the key given as content is a span after them. 24px high (small 20),
radius 4, the background colour with a 1px ring, a 4px (small 2px) left margin. The host is an
inline box, so the key cap keeps its inline-flex box in the line of text around it.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `small` | `small` | `boolean` | `false` |  |
| `meta` | `meta` | `boolean` | `false` |  |
| `shift` | `shift` | `boolean` | `false` |  |
| `alt` | `alt` | `boolean` | `false` |  |
| `ctrl` | `ctrl` | `boolean` | `false` |  |

Slots: `(default)`

## Best Practices

- Use the element for shortcut hints in prose, menu items and button suffixes. Long-form docs that narrate a shortcut write the ⌘ K shortcut as text, so the page copies to plain text unchanged.
- Pass modifiers as the boolean attributes meta, shift, alt and ctrl. The element swaps ⌘ for Ctrl on Windows and Linux; a hard-coded Cmd+K ships the wrong glyph to half the readers.
- The content is one key, digit or named key (K, 7, Enter, Esc). Keep its case, keep modifiers out of it, and never pack a sentence into the element.
- Use small in dense surfaces (menu rows, command-bar items, table cells) where the default size crowds the text next to it.
- Punctuation stays outside the element: Press ⌘ K to open the command menu. Periods, commas and or separators live in the prose, so a screen reader does not read them as keys.

