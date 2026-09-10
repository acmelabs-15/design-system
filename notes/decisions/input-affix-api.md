# Prefix and suffix are two named treatments, not one concept with booleans

Decided 2026-09-10 by Peter.

## The decision

An input's prefix and suffix are **two different things with two different names**, chosen by which
slot the content goes in. No boolean modifies a treatment.

The distinction is **where the thing sits**, not what it contains:

| | Where | How it reads |
|---|---|---|
| **Add-on** | attached to the outside of the field | its own ground, a hairline where they meet |
| **Prefix / suffix** | inside the field's own box | the field's ground, no line |

```html
<!-- Attached to the field -->
<acme-input placeholder="Default">
  <span slot="start-addon">https://</span>
  <span slot="end-addon">.com</span>
</acme-input>

<!-- Inside the field -->
<acme-input placeholder="Search">
  <svg slot="start">...</svg>
</acme-input>
```

An add-on is a **place**, not a content type, which is why both slots take any content.

**The name carries the place**, a consumer never writes a boolean to change one, and there is
nothing to override.

## The names

`start-addon` and `end-addon` for the attached places. Decided.

`start` and `end` for the places inside the field. Peter's instruction was to follow a suffixed form
if the field had settled on one; it has not. Read from each package's own custom-elements manifest:

| Naming | Libraries |
|---|---|
| Bare `start` / `end` | Web Awesome, Nord, Fluent, FAST, Ionic |
| `prefix` / `suffix` | Shoelace 2.x, Vaadin |
| `leading-icon` / `trailing-icon` | Material Web |

**No web component library uses a suffixed form.** `startAdornment` (MUI) and `startElement`
(Chakra) exist because React props share one flat namespace and need the noun to disambiguate. A
slot name has its own namespace, so every library that adopted the pattern dropped the noun.

`start`/`end` rather than `prefix`/`suffix` because the axis is **beside the field**, not *before
the text*. Shoelace's successor Web Awesome broke its API deliberately to make that rename, and
Nord, Fluent and FAST use the same pair. Reading "prefix" as *before the text* is what produced the
six-property API in the first place.

## What it replaces

Six properties for one concept, which interacted:

| Property | What it did |
|---|---|
| `prefix` / `suffix` | text in the cell |
| `prefix-styling` / `suffix-styling` | `"false"` removed the fill and hairline |
| `prefix-container` / `suffix-container` | `"false"` dropped the cell and slotted straight into the wrapper |

Plus `slot="prefix"` / `slot="suffix"` for element content. So "prefix" meant three different things
depending on which of four attributes were set, and an icon in the field was written
`suffix-container="false" suffix-styling="false"`.

## Why the old shape existed, and why that is not a defence

It is a faithful transcription of the reference's React props: `prefix={<Icon/>}`,
`prefixStyling={false}`, `suffixContainer={false}`. In React one prop takes a string or a node, so
one name covers both and booleans carry the rest.

That is an implementation, not a behaviour. **Parity is style, behaviour and functionality, never
implementation** (`parity-scope.md`). The idiomatic web-component spelling of "put this element
there" is a slot, and we already had slots — keeping the props as well is what produced six
properties.

## The evidence

Every prefix and suffix cell on the reference's input page, measured two ways: does it share the
field's ground, and is there a line between them?

**The two signals never disagree** — 0 cells of 20 mix them. A cell either shares the ground *and*
has no line, or has its own ground *and* a line. There is no third state.

| | Count |
|---|---|
| Attached to the field — own ground, line between | 11 |
| Part of the field — same ground, no line | 9 |

So the place is binary, and it is what the whole treatment follows from.

Cross-tabulated against content, all four cells are occupied:

| | text | element |
|---|---|---|
| **Attached** | 7 | 4 |
| **Inside** | 2 | 7 |

The reference puts an icon in an attached cell (its "prefix and suffix" example) and text inside the
field (its "rounded without styling" example). So the place is independent of the content type, and
two names express it because **the name carries the place and not the content**.

This is where the shape differs from Chakra, which ties the treatment to the name — `Addon` is
always the attached one, `Element` always the inside one — and therefore cannot express an icon
attached to the field.

## It also dissolved a styling problem

The old shape made a treatment out of undoing another: `prefix-styling="false"` painted a cell and
then unpainted it, and `suffix-container="false"` dropped the cell while leaving a positional rule
aimed at where it had been — so that rule landed on the consumer's own content instead. Our
`!important` then beat the author's inline colour, where the reference's plain class did not.

Naming the place removes both. There is no switched-off cell for a positional rule to miss, and
nothing to undo.

The cascade question the incident raised is real and stays open: 64 generated rules carry
`!important` on slotted content, and 11 of them need it. It is not settled here, because this change
removed the case that would have forced it. See
[../analysis/slotted-cascade.md](../analysis/slotted-cascade.md).

## Select takes the same convention

Peter: use the input's convention for the select too, rather than a second vocabulary.

The reference's select has **no attached places at all**. Measured across its 20 selects: 23
decorations, every one of them `position: absolute`, transparent, no line — inside the field. Icons
only, both sides.

So the select uses `start` and `end` and simply never uses `start-addon` / `end-addon`. Same
convention, fewer places occupied. That is a property of the element, not a second API.

### The chevron is the `end` place's default content

Its `end` place holds one thing at a time, and the reference shows all three states:

| State | Reference | Count |
|---|---|---|
| Default | the chevron | 16 selects |
| Replaced | a custom icon **instead of** the chevron | 3 selects |
| Empty | no end child at all | 1 select, its example headed "No suffix" |

That is slot fallback content, which is the idiomatic Lit spelling: the chevron is the slot's
fallback, and anything slotted replaces it.

The empty state still needs a way to say so, because slotting nothing shows the fallback. That is
the one place a property survives, and it is a property about **the element**, not about a
treatment — which is the distinction TAG §3.7 draws.

### What it replaces

`acme-select` today has `suffix = true`, a boolean that shows or hides the chevron. That is a third
meaning of the word "suffix" in our API: content on the input, a treatment switch on the input, and
a visibility switch on the select. The reference's select takes `suffix={<Icon/>}` — content, like
its input — and has no counterpart to our boolean.

## What was built

Both places on a side render **the same cell**, classed `.start` or `.end`. Only the ground and the
hairline differ, and the wrapper carries that as `start-inside` / `end-inside`. Measuring the
reference is what settled this: its in-field content sits in a `<label>` cell too, the same 38x36 box
with the same 12px padding as an add-on.

An add-on wins its side, so the two places never render together, and the inside class follows what
actually rendered rather than what was slotted.

| | Before | After |
|---|---|---|
| Properties for the concept | 6 | 0 on input, 1 on select (`end="false"`) |
| Ways to say "an icon in the field" | `suffix-container="false" suffix-styling="false"` | `slot="end"` |
| Vocabularies for the idea in the codebase | 3 | 1 |

The third vocabulary was 44 lines of dead CSS (`.select-wrap`, `.affix-l`, `.affix-r`), unreferenced
anywhere and removed with the routing rule that filed it.

### Both pages reach parity

| Page | Roots each side | Hard |
|---|---|---|
| input | 20 | 0 |
| select | 20 | 0 |
| search-input | 5 | 0 |

Two measurement faults surfaced on the way, both older than this work:

- **The input page never had matching root counts** — 22 reference against our 20, because two of its
  examples are search fields we render on their own page. So the four differences that started this
  thread were computed across misaligned roots. `previews` now names the seven shared examples.
- **The reference has one root with no cell at all**, its `suffixContainer={false}` example, where the
  icon reads 24x16 against the 14x14 every cell icon reads. Ours renders a cell either way, so the
  `svg` part is read inside its cell and that root has no counterpart rather than being compared
  against a different shape.

### One regression, found and fixed

`acme-search` forwards its glass through a slot of its own, so the icon lives in **search's** shadow
root rather than the input's. No rule in the input can reach it, by any selector — that is the shadow
boundary, not a selector problem. Its sizing already lived in search's own generated sheet, keyed on
the old slot name; renaming the map fixed it.

## Deferred, deliberately

- **A group element** for an attached control (a button on the end of a field), the way Chakra's
  `Group` and Bootstrap's `input-group` compose them as siblings. Peter: worth doing, not now. The
  reference has no such component among its 77 pages, so this is ours to design rather than port.
- **An icon element**. Peter: worth doing, not now.

## What would change this

Evidence of a third place on the reference — a cell that shares the field's ground but keeps a line,
or the reverse. Measured across all 20 of its cells, none does.
