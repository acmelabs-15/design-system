# @acmelabs/design-system

Lit web components and shared design tokens for consistent interfaces. Built with [Lit](https://lit.dev), using Google Sans Flex and Google Sans Code, one directory per element, shadow DOM and a shared global stylesheet.

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

<acme-button>Deploy</acme-button>
<acme-badge variant="green" contrast="low">Ready</acme-badge>
```

A host that admits a script from a CDN but no stylesheet from one (the Claude artifact CSP is one)
can use the browser bootstrap, which installs `tokens.css` into the document on import:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@acmelabs/design-system@0.2/dist/cdn/standalone.js"></script>
```

`tokens.css` is the global layer: the color scales, the semantic tokens, the reset, the type
classes and the layout utilities. Selective entries share runtime chunks and register their owned
component dependencies. The `dist/cdn/all.js` entry registers the component library and includes the
heavy component packages. The standalone bundle also installs tokens. `dashboard.css` carries the page-level recipes
the Vercel dashboard composes in light DOM. Import configuration helpers from `dist/cdn/configure.js` when using browser modules. The bootstrap, configuration helpers, definitions and optional artwork share one runtime graph.

`dist/bundle/design-system.standalone.min.js` loads the component library and tokens. Keep its generated chunks and assets beside it: Flow Diagram loads its layout engine and worker on demand; textured Book loads its packaged image when used. Use the shared CDN graph when adding optional icons or artwork.

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
Use `@acmelabs/design-system/all` for component registration. Import classes from
`@acmelabs/design-system/components/<name>` or the package root for explicit or scoped registration;
these entries do not register elements or change the document.

The package publishes its element API as `@acmelabs/design-system/custom-elements.json`.
The build generates this standard manifest from the element declarations and templates. The
website and Markdown reference read the same manifest.

## SVG icons

Import each icon definition explicitly. The component entry includes its required icons; the optional catalog stays separate.

```ts
import "@acmelabs/design-system/define/home-icon";
import "@acmelabs/design-system/icons/artwork/sharp/filled/home";
import { configureIcons } from "@acmelabs/design-system";
configureIcons({ family: "sharp", filled: true });
```

Use `<acme-home-icon label="Home"></acme-home-icon>`. Omit `label` for decorative artwork inside a named control. Rounded, unfilled artwork is the default. Explicit `family` and `filled` properties override library defaults. Import another style before using it; missing artwork has an explicit marker and never starts a network request.

Class-only imports use `@acmelabs/design-system/icons/home`. Browser definition entries use `dist/cdn/define/home-icon.js`; browser artwork entries use `dist/cdn/generated/icons/artwork/sharp/filled/home.js`. `icons/all` explicitly registers the entire catalog, and `icons/families/<family>/<filled|unfilled>` installs an entire style. These are larger, optional imports.

The complete pinned catalog has 4,135 symbols and all six baseline family/fill combinations. `@acmelabs/design-system/icons/catalog` exposes its source revision, asset hashes and licensing facts. SVG size scales the fixed 24px artwork; it is not a variable-font axis.

## Numeric spacing and sizes

The token stylesheet supplies 35 spacing steps and 35 independent size steps. A step defaults
to its key multiplied by 0.25rem. For example, `--acme-spacing-4` is 1rem and
`--acme-size-8` is 2rem. Decimal keys use a hyphen: `--acme-spacing-0-5` is 0.125rem.

Overriding a spacing variable does not change the matching size variable. Use
`calc(var(--acme-spacing-2) * -1)` for a negative spacing value where CSS permits it.
The `@acmelabs/design-system/tokens.json` export maps 413 theme keys across colors, fonts,
font sizes, font weights, line heights, spacing, sizes, radii, shadows and motion. Numeric
spacing and size entries include their independent defaults. Each entry identifies its CSS
property, grammar and source role.

## Theme scopes

Use `acme-theme` around a page or section. Nested omitted settings inherit. Explicit
`appearance="auto"` follows the system; explicit `density="normal"` overrides compact density.
Native `lang` and `dir` remain native attributes. Applications own preference persistence.

```html
<acme-theme appearance="dark">
  <acme-button>Dark section</acme-button>
  <acme-theme appearance="light">Light section</acme-theme>
</acme-theme>
```

Register a named definition before selecting it. With declarative named-theme markup, register
before loading the definition entry; the class entry is inert:

```js
import { registerTheme } from "@acmelabs/design-system";
registerTheme("brand", {
  colors: { "ds-blue-700": "#0068d6" },
  fonts: { "acme-font-sans": "serif" },
  spacing: { 2: "0.75rem" },
});
await import("@acmelabs/design-system/define/theme");
```

A partial definition inherits default values. Repeating the same registration is harmless;
changing an existing definition fails. Ordinary CSS custom properties supply local overrides.
The Theme Switcher emits `acme-request` with `{ action: "appearance", value }`; handle it in
the application and update the switcher's `value` and the relevant theme scope's `appearance`.

## Layout

```
styles/                         authored base, component and shared CSS inputs
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
    icons/                      per-icon classes and explicit artwork entries
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
| `src/generated/tokens.json` and `dist/tokens.json` | `split`, then `build` | Numeric and theme catalogs through `scripts/numeric-tokens.ts` |
| `src/generated/theme-properties.ts` | `split` | `scripts/theme-tokens.ts`, token sources and local palette styles |
| `src/generated/responsive-styles.ts` | `split` | `scripts/responsive-styles.ts` and the common style schema |
| `assets/material-symbols/` | `scripts/material-symbols.ts import` | the pinned upstream SVG checkout |
| `src/generated/icons/`, `dist/icons.json` | `scripts/icon-entries.ts`, then `build` | the verified SVG catalog and shared icon renderer |
| `src/define/`, `src/all.ts`, component exports in package.json | `scripts/entries.ts` | tag-map declarations and owned component markup |
| `dist/styles/tokens.css` | `split`, then `build` | `styles/house.css`, the generated theme and the numeric token catalog |
| `dist/styles/dashboard.css` | `build` | compiled recipe inputs selected in `scripts/build.ts` |
| `dist/shared/date.js` and `dist/licenses/` | `scripts/date-runtime.ts` during build | exact patched date dependency and `src/shared/date.ts` |
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
| `bun run split` | Compiles base/component CSS into committed CSS, maps and Lit modules |
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

- Every element is `acme-*`. Use the generated element API for its properties, attributes and
  explicitly supported JSON inputs. Public events bubble and are composed.
- Values come from vercel.com/geist. Where Geist has the component, Geist's value is the value.
- The type families are Google Sans Flex for text and Google Sans Code for numbers,
  labels and code. Custom themes can replace those families.
- State is TanStack Store. Theme scopes own their canonical settings and use Lit context to
  deliver read-only sources; `createToastStore()` creates an explicit notification scope. An element's own state is a store created per
  instance, the way TanStack Form creates one per form and per field. Virtualization is TanStack virtual, syntax highlighting
  TanStack highlight, markdown TanStack markdown, forms TanStack form, charts TanStack charts,
  hotkeys TanStack hotkeys, and rate limiting TanStack pacer.
- Overlay placement is `@floating-ui/dom`, scroll lock `@zag-js/remove-scroll`, and dates
  `@internationalized/date`. Overlays use the native `<dialog>` element and the Popover API.
- Labs packages in use: `@lit-labs/router` (the docs app) and `@lit-labs/compiler` (build-time
  template compilation). `@lit-labs/motion` is installed and awaits the animation pass.
  `@lit-labs/testing` is not used: the package does not support SSR.
