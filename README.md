# @acmelabs/design-system

The house design system as web components. Geist foundations and every Geist component at
Geist's values, set in Google Sans Flex and Google Sans Code, plus the house parts the Vercel
dashboard adds. Built with [Lit](https://lit.dev), one directory per element, shadow DOM with a
shared global stylesheet.

Docs: <https://acmelabs-15.github.io/design-system/>

## Use it from a CDN

No build step. Import the elements the page uses:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400..700&family=Google+Sans+Code:wght@400..700&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@acmelabs/design-system@0.2/dist/styles/tokens.css">
<script type="module">
  import "https://cdn.jsdelivr.net/npm/@acmelabs/design-system@0.2/dist/cdn/define/button.js";
  import "https://cdn.jsdelivr.net/npm/@acmelabs/design-system@0.2/dist/cdn/define/badge.js";
</script>

<acme-button variant="primary">Deploy</acme-button>
<acme-badge variant="green" contrast="low">Ready</acme-badge>
```

A host that admits a script from a CDN but no stylesheet from one (the Claude artifact CSP is one)
takes the standalone bundle, which installs `tokens.css` into the document on import:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@acmelabs/design-system@0.2/dist/bundle/design-system.standalone.min.js"></script>
```

`tokens.css` is the global layer: the color scales, the semantic tokens, the reset, the type
classes and the layout utilities. Selective entries share runtime chunks and register their owned
component dependencies. The full `dist/cdn/all.js` entry registers every element and includes the
heavy component packages. The standalone bundle also installs tokens. `dashboard.css` carries the page-level recipes
the Vercel dashboard composes in light DOM.

## Install from npm

```sh
bun add @acmelabs/design-system
```

```ts
import "@acmelabs/design-system/define/button";
import "@acmelabs/design-system/styles/tokens.css";
```

The unbundled build under `dist/` keeps Lit as a dependency, so one copy of Lit serves the whole
app. Use `@acmelabs/design-system/define/<name>` to register an element and its owned dependencies.
Use `@acmelabs/design-system/all` for full registration. Import classes from
`@acmelabs/design-system/components/<name>` or the package root for explicit or scoped registration;
these entries do not register elements or change the document.

The package publishes its element API as `@acmelabs/design-system/custom-elements.json`.
The build generates this standard manifest from the element declarations and templates. The
website and Markdown reference read the same manifest.

## Numeric spacing and sizes

The token stylesheet supplies 35 spacing steps and 35 independent size steps. A step defaults
to its key multiplied by 0.25rem. For example, `--acme-spacing-4` is 1rem and
`--acme-size-8` is 2rem. Decimal keys use a hyphen: `--acme-spacing-0-5` is 0.125rem.

Overriding a spacing variable does not change the matching size variable. Use
`calc(var(--acme-spacing-2) * -1)` for a negative spacing value where CSS permits it.
The `@acmelabs/design-system/tokens.json` export lists all 70 numeric tokens, their defaults
and their source. Other theme categories are not yet included in this manifest.

## Layout

```
styles/                         authored house, component and shared CSS inputs
src/
  base.ts                       AcmeElement and shared helpers
  index.ts                      exports classes and authoring helpers
  all.ts, define/               generated registration entries
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
| `src/generated/tokens.json` and `dist/tokens.json` | `split`, then `build` | `src/shared/numeric-tokens.ts` through `scripts/numeric-tokens.ts` |
| `src/define/`, `src/all.ts`, component exports in package.json | `scripts/entries.ts` | tag-map declarations and owned component markup |
| `dist/styles/tokens.css` | `split`, then `build` | `styles/house.css`, the generated theme and the numeric token catalog |
| `dist/styles/dashboard.css` | `build` | compiled recipe inputs selected in `scripts/build.ts` |
| `dist/custom-elements.json` | `build` or `bun run manifest` | element declarations, templates and documented dynamic slots |
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
| `bun run manifest` | Generates the standard element API manifest used by documentation |
| `bun run entries` | Generates selective and full registration entries |
| `bun run pack` | Packs built outputs with production metadata into `.artifacts/packages/`; keeps development patch/configuration private |

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
