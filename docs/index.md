# ACME Design System

The house design system for building consistent web experiences.

## Foundations

- **Colors** — A high contrast, accessible color system. See `/colors`.
- **Typography** — Typeset with Google Sans Flex and Google Sans Code. See `/typography`.
- **Materials** — Presets for radii, fills, strokes, and shadows. See `/materials`.
- **Grid** — A core part of the house aesthetic. See `/components/grid`.

## Assets

- **Brand Assets** — Logos and brand guidelines. See `/components/brands`.
- **Icons** — An icon set for developer tools. See `/icons`.
- **Typeface** — Google Sans Flex and Google Sans Code. See `/typeface`.

## Components

Building blocks for any page, available as web components from a CDN with no build step, or from npm as `@acmelabs/design-system`. Every element is `acme-*` and registers on import.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400..700&family=Google+Sans+Code:wght@400..700&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@acmelabs/design-system@0.2.0/tokens.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@acmelabs/design-system@0.2.0/dist/bundle/design-system.min.js"></script>

<acme-button>Deploy</acme-button>
<acme-badge variant="green" contrast="low">Ready</acme-badge>
```

A host that admits a script from a CDN but no stylesheet from one takes the standalone bundle, which installs `tokens.css` on import:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@acmelabs/design-system@0.2.0/dist/bundle/design-system.standalone.min.js"></script>
```

From npm, one import registers every element; single elements import from `dist/components/<name>/<name>.js`.

```ts
import "@acmelabs/design-system";
import "@acmelabs/design-system/tokens.css";
```

Browse individual components under `/components/<component>` (for example `/components/button`). Source: https://github.com/acmelabs-15/design-system.

## Markdown for agents

Every docs page is available as Markdown: append `.md` to any URL (for example `/colors.md` or `/components/button.md`). The Markdown carries the same sections, the example markup and each element's API.

