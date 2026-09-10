# Book

A responsive book cover.

## Default

```html
<acme-book title="The user experience of the Frontend Cloud"></acme-book>
```

## Variants

```html
<div class="row" style="gap:32px;align-items:baseline;justify-content:flex-start">
  <acme-book title="The user experience of the Frontend Cloud" variant="simple" width="196"></acme-book>
  <acme-book title="The user experience of the Frontend Cloud" variant="stripe" width="196"></acme-book>
</div>
```

## Custom color

```html
<div class="row" style="gap:32px;align-items:baseline;justify-content:flex-start">
  <acme-book color="#9D2127" title="How Vercel improves your website's search engine ranking"></acme-book>
  <acme-book color="#7DC1C1" text-color="white" title="Design Engineering at Vercel" variant="simple"></acme-book>
  <acme-book color="#FED954" title="The user experience of the Frontend Cloud"></acme-book>
</div>
```

## Custom icon

```html
<div class="row" style="gap:32px;align-items:baseline;justify-content:flex-start">
  <acme-book title="Vercel Platform Guide">
    <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
      <use href="#i-vercel"/>
    </svg>
  </acme-book>
  <acme-book title="Next.js Documentation">
    <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
      <use href="#i-next"/>
    </svg>
  </acme-book>
  <acme-book title="React Essentials">
    <svg class="ic" width="16" height="16" slot="icon" aria-hidden="true">
      <use href="#i-react"/>
    </svg>
  </acme-book>
</div>
```

## Custom illustration

```html
<div class="row" style="gap:32px;align-items:stretch;justify-content:flex-start">
  <acme-book title="The user experience of the Frontend Cloud">
    <svg slot="illustration" width="197" height="149" viewBox="0 0 197 149" aria-hidden="true">
      <rect width="197" height="149" fill="var(--ds-amber-600)"/>
      <line x1="-40" y1="0" x2="40" y2="149" stroke="var(--ds-amber-900)" stroke-width="1"/>
      <line x1="-16" y1="0" x2="64" y2="149" stroke="var(--ds-amber-900)" stroke-width="1"/>
      <line x1="8" y1="0" x2="88" y2="149" stroke="var(--ds-amber-900)" stroke-width="1"/>
      <line x1="32" y1="0" x2="112" y2="149" stroke="var(--ds-amber-900)" stroke-width="1"/>
      <line x1="56" y1="0" x2="136" y2="149" stroke="var(--ds-amber-900)" stroke-width="1"/>
      <line x1="80" y1="0" x2="160" y2="149" stroke="var(--ds-amber-900)" stroke-width="1"/>
      <line x1="104" y1="0" x2="184" y2="149" stroke="var(--ds-amber-900)" stroke-width="1"/>
      <line x1="128" y1="0" x2="208" y2="149" stroke="var(--ds-amber-900)" stroke-width="1"/>
      <line x1="152" y1="0" x2="232" y2="149" stroke="var(--ds-amber-900)" stroke-width="1"/>
      <line x1="176" y1="0" x2="256" y2="149" stroke="var(--ds-amber-900)" stroke-width="1"/>
      <line x1="200" y1="0" x2="280" y2="149" stroke="var(--ds-amber-900)" stroke-width="1"/>
      <line x1="224" y1="0" x2="304" y2="149" stroke="var(--ds-amber-900)" stroke-width="1"/>
      <line x1="248" y1="0" x2="328" y2="149" stroke="var(--ds-amber-900)" stroke-width="1"/>
      <line x1="272" y1="0" x2="352" y2="149" stroke="var(--ds-amber-900)" stroke-width="1"/>
    </svg>
  </acme-book>
  <acme-book title="The user experience of the Frontend Cloud" variant="simple">
    <svg slot="illustration" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 6l18 34H6z" fill="var(--ds-blue-700)"/>
      <circle cx="24" cy="30" r="6" fill="var(--ds-background-100)"/>
    </svg>
  </acme-book>
</div>
```

## Responsive

```html
<acme-book title="The user experience of the Frontend Cloud" width='{"sm":150,"md":196}'></acme-book>
```

## Width

```html
<div class="row" style="gap:32px;align-items:baseline;justify-content:flex-start">
  <acme-book title="The user experience of the Frontend Cloud" width="300"></acme-book>
  <acme-book title="The user experience of the Frontend Cloud" width="200"></acme-book>
  <acme-book title="The user experience of the Frontend Cloud" width="150"></acme-book>
</div>
```

## Textured

```html
<div class="vstack" style="gap:48px">
  <div class="row" style="gap:32px;align-items:baseline;justify-content:flex-start">
    <acme-book color="#7DC1C1" textured title="Design Engineering at Vercel"></acme-book>
    <acme-book color="#9D2127" textured title="Design Engineering at Vercel"></acme-book>
    <acme-book color="#FED954" textured title="Design Engineering at Vercel"></acme-book>
  </div>
  <div class="row" style="gap:32px;align-items:baseline;justify-content:flex-start">
    <acme-book color="#7DC1C1" text-color="white" textured title="Design Engineering at Vercel" variant="simple"></acme-book>
    <acme-book color="#9D2127" text-color="#ece4db" textured title="Design Engineering at Vercel" variant="simple"></acme-book>
    <acme-book color="#FED954" text-color="#9d3b05" textured title="Design Engineering at Vercel" variant="simple"></acme-book>
  </div>
</div>
```

## `<acme-book>`

Book: a cover in perspective that turns toward the reader on hover. `variant` is `stripe` (a
colored band above the title, an `icon` below it; amber by default) or `simple` (the whole cover
in `color`, an `illustration` below the title). `width` is a px number or a per-breakpoint
object (`{"sm":150,"md":196}`); the cover keeps a 49:60 ratio, the spine, the title size and
the gaps follow the width. `textured` lays a paper grain over the cover.

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `title` | `title` | `string` | `""` | The cover title. The attribute is read and removed, so the element shows no tooltip. |
| `variant` | `variant` | `"stripe" \| "simple"` | `"stripe"` | stripe (default): a band in `color` above the title and an icon below it · simple: the cover in `color`, an illustration below the title. |
| `color` | `color` | `string` | `""` | Any CSS color or token (`#9D2127`, `var(--ds-blue-700)`). A stripe is amber-600 by default; a simple cover is gray-200 with no color. |
| `text-color` | `textColor` | `string` | `""` | The title color; gray-1000 by default. |
| `width` | `width` | `BookWidth` | `196` | The cover width in px (default 196), or per breakpoint as JSON: `{"sm":150,"md":196}`. |
| `textured` | `textured` | `boolean` | `false` | A paper grain over the cover; the pages take a ribbed edge. |

Slots: `illustration`, `icon`

## Best Practices

**When to use**

- Marketing pages, docs landing covers and changelog hero shots, where the content wants the picture of a labeled volume.
- In-product cards and dashboard tiles use Card; a Book is too decorative for repeated rows.
- Choose simple when the title alone carries the cover, and stripe when an icon or a color stripe adds hierarchy or a category cue.

**Behavior**

- Set color from a token (var(--ds-blue-700), var(--ds-amber-600)) rather than a raw hex, so the cover follows the light and dark themes.
- Keep textured for hero shots; in a row of several books the texture fights the labels.
- Use width and width-sm to keep covers in proportion across breakpoints; a squashed aspect ratio breaks the metaphor.

**Accessibility**

- The cover is decorative chrome; the title lives in the heading element, so screen readers do not announce it twice.
- An inner illustration needs alt text only when it says something the title does not; otherwise mark it aria-hidden.
- When the book wraps a link, put the focus ring on the link, not on the cover, so keyboard users see the real target.

