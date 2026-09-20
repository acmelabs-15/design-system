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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@acmelabs/design-system@0.2/styles/tokens.css">
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
import "@acmelabs/design-system/styles/tokens.css";
```

The unbundled build under `dist/` keeps Lit as a dependency, so one copy of Lit serves the whole
app. Single elements import from `@acmelabs/design-system/dist/components/<name>/<name>.js`.

## Layout

```
styles/                         authored house, component and shared CSS inputs
src/
  base.ts                       AcmeElement and shared helpers
  index.ts                      re-exports every element
  shared/                       shared behavior
  components/<name>/
    <name>.ts                   the element
    __tests__/<name>.test.ts    bun:test with happy-dom
  generated/
    css/                        canonical CSS inputs, compiled CSS and maps
    components/, shared/        generated Lit style modules
    style-manifest.json         producer/input/output fingerprints
site/                           authored documentation app and pages
_site/                          generated local site (not committed)
dist/                           package modules, bundles and document styles
scripts/                        split-css, build, dev server
tools/geist/                    the parity pipeline: specs, maps, sketches, generator, census
notes/                          hand-written analysis, decisions, and the current pass
```

## Generated files

Generated inputs under src/generated are committed. Package and site outputs are disposable. Edit the named sources; the build checks generated fingerprints.

| Path | Written by | Edit instead |
|---|---|---|
| `src/generated/css/` and Lit style modules | `split` or the mapped generator | `styles/` or `tools/geist/maps/` |
| `src/generated/style-manifest.json` | style producers | its recorded source inputs |
| `dist/styles/tokens.css` | `split`, then `build` | `styles/house.css` and the generated theme |
| `dist/styles/dashboard.css` | `build` | compiled recipe inputs selected in `scripts/build.ts` |
| `_site/` | `bun run docs` | `site/` |
| `dist/` | `bun run build` | `src/` and generated inputs |

Component CSS intermediates stay in the repository. The package's style directory contains document styles and maps. The unminified browser bundle includes CSS debugger maps; production JavaScript bundles omit them.

## Working on this repo

Start with `AGENTS.md`. It gives the reading order, the rules, and the current work.

## Scripts

| Command | What it does |
|---|---|
| `bun run build` | Transpiles `src/` with the Lit template compiler into `dist/`, then bundles `dist/bundle/design-system(.min).js` |
| `bun run docs` | Builds the docs site into `_site/` |
| `bun run dev` | Rebuilds on change and serves the docs at <http://localhost:4180> |
| `bun test` | Unit tests plus a render test of every docs page |
| `bun run lint` | Biome |
| `bun run split` | Compiles house/authored CSS into committed CSS, maps and Lit modules |

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
