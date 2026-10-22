# Repository ownership

Read this guide before editing source, generated areas, package delivery or build producers. Select the authoritative input first.

## Source and package boundaries

The repository builds Lit web components with the `acme-` prefix. The root [package manifest](../../package.json) is private build tooling. The public core manifest is [packages/core/package.json](../../packages/core/package.json). Read public metadata through [core-package.ts](../../scripts/core-package.ts); the generated export map is not a second source tree.

| Package | Owned delivery |
|---|---|
| [Core](../../packages/core/package.json) | Components, shared runtime, definitions, registration, CSS, assets, metadata and consumer skills |
| [Browser](../../packages/browser/package.json) | Self-contained browser modules, bundles, styles and notices from the same build |
| [React](../../packages/react/package.json) | Generated wrappers and the authored bridge to the same Lit behavior |
| [MCP](../../packages/mcp/package.json) | Bun documentation/API server and generated documentation records |
| [Devtools](../../packages/devtools/package.json) | Optional inspector and generated public metadata |

The manifests and lockfile own versions and dependencies. Package roles live in [stack guidance](../development/stack.md). All five releases use coordinated versions and one build tree. Normal workspace resolution uses that tree without root-package overrides.

Authored areas include component/shared source, styles, site, scripts, examples, package source, reference tools, docs, spec and tasks. Generated exceptions appear below. The committed generated source is reviewable output. Build and website output are disposable.

## Generator and delivery map

This is the maintained ownership map. Change the listed input or producer, then use [verification guidance](verification.md) to select dependent checks.

| Group | Output or delivery path | Authoritative input and writer |
|---|---|---|
| Compiled CSS and Lit styles | `src/generated/css/`, `src/generated/components/`, `src/generated/shared/`, `src/generated/style-manifest.json` | Authored styles, maps and committed specifications through [split-css.ts](../../scripts/split-css.ts) or [gen.ts](../../tools/geist/gen.ts), then [styles.ts](../../scripts/styles.ts). The manifest records fingerprints and registration definitions. |
| Reference token CSS | `src/generated/theme.css` | Ordered corpus CSS and token declarations through [vars.ts](../../tools/geist/vars.ts). |
| Numeric tokens | `src/generated/tokens.json`, `dist/tokens.json` | Numeric, theme and motion catalogs through [numeric-tokens.ts](../../scripts/numeric-tokens.ts); split writes, build verifies and copies. |
| Theme properties | `src/generated/theme-properties.ts` | Palette CSS and token catalogs through [theme-tokens.ts](../../scripts/theme-tokens.ts). |
| Responsive styles | `src/generated/responsive-styles.ts` | Shared style-input schema through [responsive-styles.ts](../../scripts/responsive-styles.ts). |
| Imported artwork | `assets/material-symbols/` | Pinned upstream SVG checkout, catalog and license through [material-symbols.ts](../../scripts/material-symbols.ts). |
| Icon entries | `src/generated/icons/`, `dist/icons.json` | Verified SVG catalog and shared renderer through [icon-entries.ts](../../scripts/icon-entries.ts); build copies the catalog. |
| Byte prefixes | `src/generated/byte-prefixes.ts`, `assets/licenses/unicode.txt` | Pinned CLDR units and parent locales through [byte-prefixes.ts](../../scripts/byte-prefixes.ts). Build verifies the result. |
| Registration and exports | `src/define/`, `src/register/`, internal counterparts, `src/all.ts`, generated core exports/side effects | Tag maps, internal annotations, owned markup and literal scoped factories through [entries.ts](../../scripts/entries.ts). Other core manifest fields remain authored. |
| Runtime JavaScript | `dist/**/*.js` | Source TypeScript through [build-modules.ts](../../scripts/build-modules.ts), using the Lit compiler. |
| Declarations | `dist/**/*.d.ts` | TypeScript and closed generated entry interfaces through [declarations.ts](../../scripts/declarations.ts). |
| Custom Elements Manifest | `dist/custom-elements.json` | Component declarations, templates and annotations through [manifest.ts](../../scripts/manifest.ts). |
| Date runtime | `dist/shared/date.js`, date notices under `dist/licenses/` | Exact patched date dependency and shared date source through [date-runtime.ts](../../scripts/date-runtime.ts). |
| Worker assets | `dist/shared/elk-worker.js`, ELK notices under `dist/licenses/` | Pinned unmodified worker and license through [browser-assets.ts](../../scripts/browser-assets.ts). Browser builds also rebase the worker and Book texture URLs. |
| Document styles | `dist/styles/` | Compiled document, token and recipe CSS/maps through [build.ts](../../scripts/build.ts). |
| Browser graph | `dist/cdn/`, `dist/bundle/` | One runtime graph, selective definitions and optional artwork through [build.ts](../../scripts/build.ts), [browser-build.ts](../../scripts/browser-build.ts) and [browser-modules.ts](../../scripts/browser-modules.ts). |
| Bundled notices | `dist/browser-licenses/` | Actual bundled inputs and pinned package metadata through [browser-package.ts](../../scripts/browser-package.ts). Preserve its recorded upstream license/source-binding limits. |
| Core workspace links | `packages/core/{dist,assets,README.md,skills}` | Explicit root build, asset, README and consumer-skill links through [core-package.ts](../../scripts/core-package.ts). |
| Browser workspace links | `packages/browser/{dist,styles,bundle,licenses}` | Explicit CDN, style, bundle and three notice-source links through [browser-package.ts](../../scripts/browser-package.ts). |
| React wrappers | `packages/react/.build-src/`, `packages/react/dist/` | CEM plus the authored bridge through [react.ts](../../scripts/react.ts). |
| Consumer skills | `dist/skills/` | Authored consumer skills and release projection through [consumer-skills.ts](../../scripts/consumer-skills.ts), called by the site build. |
| Documentation records | `.artifacts/documentation.json`, `packages/mcp/dist/documentation.json` | CEM, site records, recipes and complete example sources through [site/release.ts](../../site/release.ts) and [site/build.ts](../../site/build.ts). |
| Inspector metadata | `packages/devtools/src/generated/metadata.ts` | Public CEM and token metadata through [devtools-metadata.ts](../../scripts/devtools-metadata.ts). |
| Tool packages | `packages/{mcp,devtools}/dist/` | Authored tool source and generated metadata through [tooling.ts](../../scripts/tooling.ts). |
| Package staging | `.artifacts/packages/` | Built output and production metadata through [package.ts](../../scripts/package.ts). |
| Local release evidence | `.artifacts/release/` | Five coordinated archives, source identity and digests through [release.ts](../../scripts/release.ts) and [release-policy.ts](../../scripts/release-policy.ts). |
| Website | `_site/` | Authored site plus built runtime, examples and assets through [site/build.ts](../../site/build.ts). |
| Build tree | `dist/` | Authored source and verified generated inputs through [build.ts](../../scripts/build.ts). This tree is gitignored. |

## Delivery constraints

Core excludes browser delivery from its production allowlist. Browser delivery has a separate manifest and explicit links. Use its metadata helper rather than assuming core package paths apply.

Packing materializes approved links into self-contained output. Development patch settings stay in the authoring workspace. Every archive must pass the **60,000-entry project budget** before release validation. This is a project limit, not a claimed registry limit.

The core README links to the root consumer README. Maintain one copy; use published-package-resolvable links for maintainer material. Published consumer skills are separate from maintainer workflow skills.

The [Pages workflow](../../.github/workflows/pages.yml) deploys the verified website artifact from its dependent quality job. Website output is not tracked. Local release preparation records its source state; it does not establish publication or a clean candidate. Current work and release state belong in [STATUS](../STATUS.md).
