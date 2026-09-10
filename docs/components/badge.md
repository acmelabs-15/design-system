# Badge

A label that marks an element that needs attention, or that sorts it with similar elements.

## Variants

```html
<div class="vstack" style="gap:8px">
  <div class="row" style="gap:4px">
    <acme-badge variant="gray">gray</acme-badge>
    <acme-badge variant="gray" contrast="low">gray-subtle</acme-badge>
  </div>
  <div class="row" style="gap:4px">
    <acme-badge variant="blue">blue</acme-badge>
    <acme-badge variant="blue" contrast="low">blue-subtle</acme-badge>
  </div>
  <div class="row" style="gap:4px">
    <acme-badge variant="purple">purple</acme-badge>
    <acme-badge variant="purple" contrast="low">purple-subtle</acme-badge>
  </div>
  <div class="row" style="gap:4px">
    <acme-badge variant="amber">amber</acme-badge>
    <acme-badge variant="amber" contrast="low">amber-subtle</acme-badge>
  </div>
  <div class="row" style="gap:4px">
    <acme-badge variant="red">red</acme-badge>
    <acme-badge variant="red" contrast="low">red-subtle</acme-badge>
  </div>
  <div class="row" style="gap:4px">
    <acme-badge variant="pink">pink</acme-badge>
    <acme-badge variant="pink" contrast="low">pink-subtle</acme-badge>
  </div>
  <div class="row" style="gap:4px">
    <acme-badge variant="green">green</acme-badge>
    <acme-badge variant="green" contrast="low">green-subtle</acme-badge>
  </div>
  <div class="row" style="gap:4px">
    <acme-badge variant="teal">teal</acme-badge>
    <acme-badge variant="teal" contrast="low">teal-subtle</acme-badge>
  </div>
  <div class="row" style="gap:4px">
    <acme-badge variant="inverted">inverted</acme-badge>
    <acme-badge variant="trial">Trial</acme-badge>
    <acme-badge variant="turbo">Turborepo</acme-badge>
  </div>
</div>
```

## Sizes

```html
<div class="row" style="gap:8px">
  <acme-badge size="sm">Small</acme-badge>
  <acme-badge size="md">Medium</acme-badge>
  <acme-badge size="lg">Large</acme-badge>
</div>
```

## With icons

```html
<div class="vstack" style="gap:8px">
  <div class="row" style="gap:4px">
    <acme-badge size="lg" variant="gray">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      gray
    </acme-badge>
    <acme-badge size="md" variant="gray">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      gray
    </acme-badge>
    <acme-badge size="sm" variant="gray">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      gray
    </acme-badge>
    <acme-badge size="sm" variant="gray" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      gray
    </acme-badge>
    <acme-badge size="md" variant="gray" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      gray
    </acme-badge>
    <acme-badge size="lg" variant="gray" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      gray
    </acme-badge>
  </div>
  <div class="row" style="gap:4px">
    <acme-badge size="lg" variant="blue">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      blue
    </acme-badge>
    <acme-badge size="md" variant="blue">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      blue
    </acme-badge>
    <acme-badge size="sm" variant="blue">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      blue
    </acme-badge>
    <acme-badge size="sm" variant="blue" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      blue
    </acme-badge>
    <acme-badge size="md" variant="blue" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      blue
    </acme-badge>
    <acme-badge size="lg" variant="blue" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      blue
    </acme-badge>
  </div>
  <div class="row" style="gap:4px">
    <acme-badge size="lg" variant="purple">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      purple
    </acme-badge>
    <acme-badge size="md" variant="purple">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      purple
    </acme-badge>
    <acme-badge size="sm" variant="purple">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      purple
    </acme-badge>
    <acme-badge size="sm" variant="purple" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      purple
    </acme-badge>
    <acme-badge size="md" variant="purple" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      purple
    </acme-badge>
    <acme-badge size="lg" variant="purple" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      purple
    </acme-badge>
  </div>
  <div class="row" style="gap:4px">
    <acme-badge size="lg" variant="amber">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      amber
    </acme-badge>
    <acme-badge size="md" variant="amber">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      amber
    </acme-badge>
    <acme-badge size="sm" variant="amber">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      amber
    </acme-badge>
    <acme-badge size="sm" variant="amber" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      amber
    </acme-badge>
    <acme-badge size="md" variant="amber" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      amber
    </acme-badge>
    <acme-badge size="lg" variant="amber" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      amber
    </acme-badge>
  </div>
  <div class="row" style="gap:4px">
    <acme-badge size="lg" variant="red">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      red
    </acme-badge>
    <acme-badge size="md" variant="red">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      red
    </acme-badge>
    <acme-badge size="sm" variant="red">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      red
    </acme-badge>
    <acme-badge size="sm" variant="red" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      red
    </acme-badge>
    <acme-badge size="md" variant="red" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      red
    </acme-badge>
    <acme-badge size="lg" variant="red" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      red
    </acme-badge>
  </div>
  <div class="row" style="gap:4px">
    <acme-badge size="lg" variant="pink">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      pink
    </acme-badge>
    <acme-badge size="md" variant="pink">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      pink
    </acme-badge>
    <acme-badge size="sm" variant="pink">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      pink
    </acme-badge>
    <acme-badge size="sm" variant="pink" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      pink
    </acme-badge>
    <acme-badge size="md" variant="pink" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      pink
    </acme-badge>
    <acme-badge size="lg" variant="pink" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      pink
    </acme-badge>
  </div>
  <div class="row" style="gap:4px">
    <acme-badge size="lg" variant="green">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      green
    </acme-badge>
    <acme-badge size="md" variant="green">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      green
    </acme-badge>
    <acme-badge size="sm" variant="green">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      green
    </acme-badge>
    <acme-badge size="sm" variant="green" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      green
    </acme-badge>
    <acme-badge size="md" variant="green" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      green
    </acme-badge>
    <acme-badge size="lg" variant="green" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      green
    </acme-badge>
  </div>
  <div class="row" style="gap:4px">
    <acme-badge size="lg" variant="teal">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      teal
    </acme-badge>
    <acme-badge size="md" variant="teal">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      teal
    </acme-badge>
    <acme-badge size="sm" variant="teal">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      teal
    </acme-badge>
    <acme-badge size="sm" variant="teal" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      teal
    </acme-badge>
    <acme-badge size="md" variant="teal" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      teal
    </acme-badge>
    <acme-badge size="lg" variant="teal" contrast="low">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      teal
    </acme-badge>
  </div>
  <div class="row" style="gap:4px">
    <acme-badge size="lg" variant="inverted">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      inverted
    </acme-badge>
    <acme-badge size="md" variant="inverted">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      inverted
    </acme-badge>
    <acme-badge size="sm" variant="inverted">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-shield"/>
      </svg>
      inverted
    </acme-badge>
  </div>
</div>
```

## Pill

A special link. It is less prominent than a button and takes the badge shape.

```html
<div class="vstack" style="gap:16px">
  <div class="row" style="gap:8px">
    <acme-pill href="#badge#pill" size="sm">Label</acme-pill>
    <acme-pill href="#badge#pill" size="md">Label</acme-pill>
    <acme-pill href="#badge#pill" size="lg">Label</acme-pill>
  </div>
  <div class="row" style="gap:8px">
    <acme-pill href="#badge#pill" size="sm">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-slack"/>
      </svg>
      Label
    </acme-pill>
    <acme-pill href="#badge#pill" size="md">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-slack"/>
      </svg>
      Label
    </acme-pill>
    <acme-pill href="#badge#pill" size="lg">
      <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
        <use href="#i-slack"/>
      </svg>
      Label
    </acme-pill>
  </div>
</div>
```

## `<acme-badge>`

Badge: a short capitalized label in a pill. The root carries the size, variant and contrast
classes; the text sits in its own span; an icon in the `icon` slot leads the text and is sized
per size (12 / 14 / 16). Sizes sm 20 · md 24 · lg 32. A hue variant is solid on the hue's
strong step with the contrast foreground; `contrast="low"` keeps the hue for the text over a
tinted layer. `inverted` is the foreground on the background; `trial` and `turbo` are gradients.
A circular glyph icon (`data-glyph="circular"`) pulls in closer; the slot mirrors the marker so
the root's rule sees it.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `variant` | `variant` | `BadgeVariant` | `"gray"` | gray · blue · purple · amber · red · pink · green · teal · inverted · trial · turbo. |
| `contrast` | `contrast` | `"high" \| "low"` | `"high"` | `low` is the subtle tint: the hue for the text over the hue's light layer. |
| `size` | `size` | `BadgeSize` | `"md"` | sm · md · lg. |

Slots: `icon`, `(default)`

## `<acme-pill>`

Geist Pill: the badge shape as a link, white with an inset ring, sm 20 · md 24 · lg 32; a logo may lead in the `icon` slot.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `size` | `size` | `"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large"` | `"md"` | sm · md · lg (small · medium · large also work). |
| `solid` | `solid` | `boolean` | `false` |  |
| `count` | `count` | `boolean` | `false` |  |
| `href` | `href` | `string` | `""` |  |

Slots: `icon`, `(default)`

## Best Practices

- A badge is short metadata next to the thing it describes: status, plan tier, environment or role. One badge per row; two side by side means the row needs a second column.
- A colored dot with no text is a Status Dot. A clickable filter chip that changes a query is the pill or a small Button.
- A badge is static. Do not attach a click handler; use a Button or a link when the user can act on the value.
- Badge content is text, or an icon plus text. Never two icons, and never a badge inside a badge.
- Pair a lifecycle badge (Alpha, Beta, Early Access) with a Tooltip that names the limit, such as "Alpha: API may change before GA".
- Title Case, one word when possible and two at most: Active, Pending, Pro, Enterprise Trial. Use the API or log term: Production not Prod, Deployed not Live, Canceled not Cancelled.
- No checkmark for success and no X for errors; the variant carries the signal. Green is healthy, red is error, amber is warning, blue is informational or production, gray is neutral. The subtle contrast tones any of them down on dense surfaces.
- No sentences inside a badge (Currently Active, You are on Pro); the row around it gives the context.
- Set a title on icon-only or ambiguous badges so screen readers announce the meaning. The text must read without the color.

