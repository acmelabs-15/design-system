# Repository layout investigation

Phase 1.7, researched and reviewed 2026-09-19. **Selected:** [committed generated styles under src/generated](../decisions/generated-style-location.md) and [workflow-built website output excluded from Git](../decisions/documentation-publishing.md). The complete tree below remains a proposal for the migration plan; no files have moved. Peter subsequently selected a separate React integration package. The earlier single-package draft is superseded in that respect; site/_site and exact package paths remain proposals.

## What the code actually writes

`scripts/split-css.ts:13` reads `src/geist.css`, then appends `src/generated/theme.css` at line 189. It skips mapped families at line 208; it does not invoke the map generator. `tools/geist/gen.ts:1823` separately writes mapped component styles. The existing generated-file tables incorrectly suggest that all styles come from split and place the house sheet in tools/geist. This is an ownership error, not just an unattractive directory name.

The earlier plan's `package-lock.json` and `src/components/book.zip` are absent in the current checkout. Do not plan to remove files that are already gone.

## Reference-library survey

Read current repository listings and package manifests, not just homepages. The diversity matters: there is no single universal layout to copy.

| Library | Source, tools and docs | Generated/published boundary | Evidence |
|---|---|---|---|
| Web Awesome | `packages/webawesome/src`, `docs`, `scripts`; authored docs have an Eleventy layout | `dist`, `dist-cdn`, manifest and typed component exports; loader and SSR loader are separate entries | [Manifest](https://github.com/shoelace-style/webawesome/blob/next/packages/webawesome/package.json), [package tree](https://github.com/shoelace-style/webawesome/tree/next/packages/webawesome) |
| Spectrum Web Components | Current gen2 separates core, swc, icons and tools; swc has components, stylesheets, scripts and Storybook | Publishes `dist/`; typed per-component and pattern exports; manifest in dist | [Gen2 manifest](https://github.com/adobe/spectrum-web-components/blob/main/gen2/packages/swc/package.json), [tree](https://github.com/adobe/spectrum-web-components/tree/main/gen2/packages/swc) |
| Material Web | Component directories at root, separate catalog, docs and scripts | Generated `*.cssresult.ts` distinguishes CSS output; publication uses a detailed files allowlist and CEM | [Manifest](https://github.com/material-components/material-web/blob/main/package.json), [CSS generator](https://github.com/material-components/material-web/blob/main/scripts/css-to-ts.ts) |
| Lion | `packages/ui/components`, explicit export modules, separate docs and tooling | `dist-types`, CEM, definition modules under exports/define; explicit sideEffects list | [Manifest](https://github.com/ing-bank/lion/blob/master/packages/ui/package.json), [repository](https://github.com/ing-bank/lion) |
| Vaadin | Per-component packages with src and tests; root dev and api-docs tooling | Package entry modules, type declarations, CEM and web-types included explicitly | [Button manifest](https://github.com/vaadin/web-components/blob/main/packages/button/package.json), [root](https://github.com/vaadin/web-components) |
| Nord | Published metadata exposes Storybook, Rollup and manifest-generation tasks | Publishes `lib` and `custom-elements.json`; no exports map in the inspected package | [Versioned package manifest](https://cdn.jsdelivr.net/npm/@nordhealth/components@5.4.2/package.json) |

Nord's own homepage links `nordhealth/design-system`; that GitHub repository returned 404 through the API. Its unpublished repository layout is therefore **unverified**, rather than reconstructed from assumptions. Its package structure is verifiable. The package licence is restricted to Nordhealth work, so it is a packaging reference here, not a proposed dependency or a source to copy into this library.

### Follow-up: Radix, Chakra and Material Web style ownership

Peter requested these comparisons before selecting a location. [Radix Primitives](https://www.radix-ui.com/primitives/docs/guides/styling) is unstyled, so it is not a direct model for our generated presentation styles. [Radix Themes](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/button.css) keeps authored CSS beside component code. Its [CSS build](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/scripts/build-css.js) writes processed output separately at package-level paths, including styles.css, components.css and tokens/. Adjacent editable CSS is not equivalent to our adjacent generated styles.

Chakra keeps authored style definitions under [theme/recipes](https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/theme/recipes/button.ts) and generated TypeScript definitions under [styled-system/generated](https://github.com/chakra-ui/chakra-ui/tree/main/packages/react/src/styled-system/generated). The latter are generated types, not component CSS.

Material Web is the closest framework comparison. Its [build configuration](https://github.com/material-components/material-web/blob/main/package.json) compiles authored Sass into CSS and then `*.cssresult.ts` modules beside component code. [Filled Button](https://github.com/material-components/material-web/blob/main/button/filled-button.ts) imports those modules. Its [.gitignore](https://github.com/material-components/material-web/blob/main/.gitignore) excludes CSS, cssresult TypeScript and other build outputs. This demonstrates a viable adjacent-file layout; there is no universal requirement for a generated directory.

Our generated files already have warning headers, yet the recorded overwrite problem occurred. Our `.gitignore` also excludes `tools/geist/corpus/`, and `.github/workflows/publish-package.yml` builds from the committed styles. Peter chose a distinct generated directory while keeping these inputs committed. Source ownership, producer headers and reliable generation checks remain necessary; relocating files alone is not sufficient.

## Website source and build output

Live read-only inspection on 2026-09-19 (`gh api repos/acmelabs-15/design-system/pages`) returned legacy publishing from branch `main`, path `/docs`, with status `built`. `docs-src/site.ts` names `docs` as output, and the docs builder replaces that directory. No Pages setting was changed.

The reference comparison supports keeping source in Git and building the website output:

- **Chakra:** [apps/www](https://github.com/chakra-ui/chakra-ui/blob/main/apps/www/package.json) runs `next build`; its [.gitignore](https://github.com/chakra-ui/chakra-ui/blob/main/apps/www/.gitignore) excludes `.next`, `out` and `build`.
- **Radix:** the [website repository](https://github.com/radix-ui/website/blob/main/package.json) builds the search index and Next.js site; [.gitignore](https://github.com/radix-ui/website/blob/main/.gitignore) excludes those outputs. These files establish source/build separation, not the current production host configuration.
- **TanStack:** its [website repository](https://github.com/TanStack/tanstack.com) documents Cloudflare Workers deployment; package scripts and Vite configuration use TanStack Start and Vite. [.gitignore](https://github.com/TanStack/tanstack.com/blob/main/.gitignore) excludes build outputs. Product docs remain in individual project repositories and are fetched from GitHub in production, so not every page is simply built as a static file at deployment.
- **Material Web:** [catalog configuration](https://github.com/material-components/material-web/blob/main/catalog/package.json) creates `_dev` and `_prod` output. The [deployment workflow](https://github.com/material-components/material-web/blob/main/.github/workflows/firebase-hosting-merge.yml) builds the catalog before Firebase deployment, while those output folders are ignored.

Peter selected a GitHub Pages workflow-built site and removal of generated website pages from Git. The [supported Pages artifact workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) fits the existing static Lit site builder. Its configuration, trigger policy, complete path changes and validation remain for the migration plan. This is not approval to change hosts/frameworks or publish now.

## Proposed layout

```text
src/
  base.ts
  components/                  authored elements and adjacent __tests__
  shared/                      authored controllers, directives and helpers
  generated/
    components/                generated Lit style modules
    shared/                    generated shared style families
    theme.css                  generated source-system tokens
styles/
  house.css                    authored sheet, renamed out of src/geist.css
site/                          authored docs app, pages and doc components
tools/geist/                   maps, specs, sketches, census, extraction and generation
scripts/                       build and development entry points
notes/                         analysis, decisions and pass records
dist/                          package JS, declarations, bundles and final CSS
_site/                         built documentation website
```

Keep generated style inputs under version control while CI lacks the reference corpus. Give every generated file a producer header and mark generated paths in `.gitattributes` for review tooling. Keep `dist/` and `_site/` disposable. A source-of-truth manifest must name each writer and input, and generation checks must run where those inputs are available. Removing committed generated styles before making the corpus/rebuild path reproducible would break release builds.

This tree records the earlier single-package proposal. The selected separate React package now requires a revised package layout; exact workspace paths and release boundaries remain for the migration plan. Retain the generator pipeline and update source paths/imports together in an approved batch.

Package publication should allowlist dist, assets, licence and consumer documentation. Use explicit component and stylesheet exports, with separate registration and class-only modules if that route is approved. Moving root CSS into dist changes literal CDN URLs even if an npm export name remains stable; document that in the release note. Do not retain duplicate physical output as an accidental compatibility layer.

## Generated files

This is the **current** producer map and a README-ready replacement for the inaccurate table. The approved layout migration must update the paths together with the writers.

| Current generated path | Writer | Source of truth |
|---|---|---|
| `src/generated/theme.css` | `bun tools/geist/vars.ts` | Reference token rules read through tools/geist/tw.ts and the corpus |
| Mapped `src/components/<element>/<map>.styles.ts` | `bun tools/geist/gen.ts <map>` | tools/geist/maps and specs; some map names differ from element names |
| Unmapped component and generated shared `*.styles.ts` families | `bun run split` | `src/geist.css` and splitter routing |
| `tokens.css` | `bun run split` | Global rules from src/geist.css plus src/generated/theme.css |
| `dashboard.css` | `bun run build` | Recipe selection and extraction in scripts/build.ts |
| `dist/**` | `bun run build` | src, declarations, compiler, bundler; standalone bundle also reads tokens.css |
| `docs/**` | `bun run docs` | docs-src, dist, CSS and assets; includes HTML fragments and Markdown twins |
| Optional skill element reference at the supplied output path | `bun docs-src/skill-reference.ts <output.md>` | Same docs and extracted API; default writes outside the repo |

The proposed equivalent paths are src/generated for committed intermediate styles, dist for final CSS/package output, and _site for site output. This section belongs in both the consumer README and the pass entry point when that layout is approved; the current factual map is also included in the pass README now. The source-code freeze remains in force.

## Cost and acceptance

The selected separation makes ownership visible in paths, addressing a problem warning headers alone did not prevent here. Material Web shows that adjacent outputs can also work with an explicit rebuild boundary. Our move must update generator paths, imports, package files/exports, docs deployment and test fixtures together. Acceptance requires a clean isolated build, no missing package assets or declarations, a site built from the same code, and repeatable generation. The remaining path details and actual changes are Phase 5 work, not implementation authorized by these decisions.

## Phase 1 extension: framework packages

Peter selected [a separate React integration package](../decisions/react-integration.md). The earlier single-package tree is a historical proposal, superseded in that respect. Exact names, paths, exports and release coordination remain unapproved.

A bounded survey enumerated 25 active, public, non-fork TanStack repositories and inspected package directories plus representative core/adapter manifests: ai, charts, cli, config, db, devtools, form, highlight, hotkeys, intent, markdown, pacer, persist, query, ranger, redact, router, select, store, table, tanstack.com, template, time, virtual and workflow. This is not a claim to have audited every file or certified every adapter's release.

Common practice: a shared core with framework packages in one repository. Table, Form, Query, Store, Virtual, Hotkeys and others follow it. [Table packages](https://github.com/TanStack/table/tree/main/packages) supplied the central comparison. Charts also has framework subpaths alongside adapters; Markdown and Highlight use framework subpaths. No single packaging shape is a universal TanStack rule.

Important qualifications:
- Devtools core includes Solid dependencies; a generic integration API is not dependency-free.
- Some Workflow framework directories were templates at 0.0.0, not mature published adapters.
- Ranger/Persist marketing breadth did not match every package directory inspected.
- Time had a README but no package implementation at the inspected revision.
- Main-branch directories, peer metadata and npm releases are separate evidence.

The package-layout decision preserves one underlying component system. React-specific rendering, especially TanStack Table JSX cells, needs an explicit bridge rather than an assumed generic wrapper. [Lit practice findings](lit-practice-review.md#phase-1-extension-react-and-forms).

The completed [TanStack Config convention review](developer-tooling.md#tanstack-config) proposes package-artifact checks, explicit quality commands, release intent and dependency alignment. It does not select Nx, pnpm, Vite, ESLint or other new tooling. Consumer-skill/MCP and inspector packaging must be considered alongside the separate React package in the later layout review.
