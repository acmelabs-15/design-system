# @acmelabs/design-system

The house design system as web components. Geist foundations and every Geist component at
Geist's values, set in Google Sans Flex and Google Sans Code, plus the house parts the Vercel
dashboard adds. Built with [Lit](https://lit.dev), one directory per element, shadow DOM with a
shared global stylesheet.

Docs: <https://acmelabs-15.github.io/design-system/>

## Use it from a CDN

No build step. Two tags:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400..700&family=Google+Sans+Code:wght@400..700&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@acmelabs/design-system@0.2/tokens.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@acmelabs/design-system@0.2/dist/bundle/design-system.min.js"></script>

<acme-button variant="primary">Deploy</acme-button>
<acme-badge hue="green" subtle>Ready</acme-badge>
```

A host that admits a script from a CDN but no stylesheet from one (the Claude artifact CSP is one)
takes the standalone bundle, which installs `tokens.css` into the document on import:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@acmelabs/design-system@0.2/dist/bundle/design-system.standalone.min.js"></script>
```

`tokens.css` is the global layer: the color scales, the semantic tokens, the reset, the type
classes and the layout utilities. The bundle is self-contained (Lit and the labs packages are
inside it) and registers every `acme-*` element. `dashboard.css` carries the page-level recipes
the Vercel dashboard composes in light DOM.

## Install from npm

```sh
bun add @acmelabs/design-system
```

```ts
import "@acmelabs/design-system"; // every element registers on import
import "@acmelabs/design-system/tokens.css";
```

The unbundled build under `dist/` keeps Lit as a dependency, so one copy of Lit serves the whole
app. Single elements import from `@acmelabs/design-system/dist/components/<name>/<name>.js`.

## Layout

```
src/
  base.ts                       AcmeElement, the shared shadow reset, the icon glyphs
  index.ts                      re-exports every element
  shared/                       helpers used by several elements; element-less style families
  components/<name>/
    <name>.ts                   the element
    <name>.styles.ts            its Lit css`` module (GENERATED from the audited sheet; do not edit)
    __tests__/<name>.test.ts    bun:test with happy-dom
docs-src/                       the docs site: a Lit app on @lit-labs/router, one fragment per page
docs/                           the built site (GENERATED; GitHub Pages serves it)
scripts/                        split-css, build, dev server
tools/geist/                    the parity pipeline: specs, maps, sketches, generator, census
notes/                          hand-written analysis, decisions, and the current pass
tokens.css, dashboard.css       the global CSS layers (GENERATED)
```

## Generated files

These are committed but written by scripts. Editing them by hand is lost on the next run.

| Path | Written by | Edit instead |
|---|---|---|
| `tokens.css` | `bun run split` | the audited sheet in `tools/geist/` |
| `dashboard.css` | `bun run build` | `scripts/build.ts` |
| `src/components/<name>/<name>.styles.ts` | `bun run split` or `bun tools/geist/gen.ts <name>` | `tools/geist/maps/<name>.ts` |
| `docs/` | `bun run docs` | `docs-src/` |
| `dist/` (not committed) | `bun run build` | `src/` |

## Working on this repo

Start with `AGENTS.md`. It gives the reading order, the rules, and the current work.

## Scripts

| Command | What it does |
|---|---|
| `bun run build` | Transpiles `src/` with the Lit template compiler into `dist/`, then bundles `dist/bundle/design-system(.min).js` |
| `bun run docs` | Builds the docs site into `docs/` |
| `bun run dev` | Rebuilds on change and serves the docs at <http://localhost:4180> |
| `bun test` | Unit tests plus a render test of every docs page |
| `bun run lint` | Biome |
| `bun run split` | Regenerates `tokens.css` and the style modules from the audited house sheet |

## Release

Publishing runs in GitHub Actions through npm's Trusted Publisher (OpenID Connect), workflow
`publish-package.yml`, environment `publish-package`; no npm token anywhere.

```sh
npm version patch        # bumps package.json and tags v0.2.x
git push --follow-tags   # the tag starts the publish
```

## Conventions

- Every element is `acme-*`. Properties reflect from attributes; array and object values take
  JSON in the attribute. Events are `acme-change`, `acme-select`, `acme-toggle` and so on, and
  they bubble and are composed.
- Values come from vercel.com/geist. Where Geist has the component, Geist's value is the value.
- The type families never change: Google Sans Flex for text, Google Sans Code for numbers,
  labels and code.
- State is TanStack Store, which is signal-based underneath. State shared between elements (the theme,
  the toast queue) lives in `src/shared/state.ts`; an element's own state is a store created per
  instance, the way TanStack Form creates one per form and per field. Virtualization is TanStack virtual, syntax highlighting
  TanStack highlight, markdown TanStack markdown, forms TanStack form, charts TanStack charts,
  hotkeys TanStack hotkeys, and rate limiting TanStack pacer.
- Overlay placement is `@floating-ui/dom`, scroll lock `@zag-js/remove-scroll`, and dates
  `@internationalized/date`. Overlays use the native `<dialog>` element and the Popover API.
- Labs packages in use: `@lit-labs/router` (the docs app) and `@lit-labs/compiler` (build-time
  template compilation). `@lit-labs/motion` is installed and awaits the animation pass.
  `@lit-labs/testing` is not used: the package does not support SSR.
