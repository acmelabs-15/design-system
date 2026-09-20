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

## Phase 3 style-production comparison

**Partial research, 2026-09-19. No production model selected.** Peter requested evidence of best practices and actual community implementations before deciding between parallel CSS-derived outputs and a generated Lit-style central artifact. The [evidence/quality rule](../decisions/evidence-and-implementation-quality.md) applies; the local ownership defect does not select its replacement. [Coverage snapshot](../alignment/evidence/style-pipeline-comparison-2026-09-19.json).

### Material Web

At source pin 56a486b147b8b7e95e6e8035fa02aed7e0009a85, the complete root build configuration, css-to-ts converter and TypeScript configurations were read. Sass emits compressed CSS; [the converter](https://github.com/material-components/material-web/blob/56a486b147b8b7e95e6e8035fa02aed7e0009a85/scripts/css-to-ts.ts#L26) generates a named Lit CSSResult and a default styles.styleSheet export. It escapes backslashes, backticks and template interpolation, and strips CSS sourceMappingURL comments. TypeScript then emits JavaScript, declarations and JavaScript maps. Those maps do not by themselves prove preservation of original Sass mappings through the embedding step.

[Build configuration](https://github.com/material-components/material-web/blob/56a486b147b8b7e95e6e8035fa02aed7e0009a85/package.json#L90), [output settings](https://github.com/material-components/material-web/blob/56a486b147b8b7e95e6e8035fa02aed7e0009a85/tsconfig.base.json#L20). Published 2.5.0 uses a different recorded git head; current source and published output must remain distinguished. Main component/theme consumption and property registration still need tracing in this comparison. The earlier Labs reads do not substitute for that work.

### Spectrum Web Components

At pin 18c1177b5352c89569eacfe95660fc0ab27030d7, the current tree separates first-generation and gen2 builds. Published Button/Theme 1.12.2 is first-generation; the inspected gen2 source package identifies 2.0.0-beta.3, whose publication was not verified.

The complete root/package configurations and two Vite configurations were read. [Gen2 configuration](https://github.com/adobe/spectrum-web-components/blob/18c1177b5352c89569eacfe95660fc0ab27030d7/gen2/packages/swc/vite.config.ts#L43) defines a component-CSS path through vite-plugin-lit-css and a separate standalone PostCSS path, excludes _lit-styles from standalone output, and rewrites CSS imports when flattening output. Token expansion, prefixing, selected preset-env features, external dependencies, preserved modules, maps and minification are configured. [Exports](https://github.com/adobe/spectrum-web-components/blob/18c1177b5352c89569eacfe95660fc0ab27030d7/gen2/packages/swc/package.json#L17) include per-component and global styles.

Plugin implementation/order and emitted artifacts remain uninspected. The configuration does not establish that both paths consume one identical normalized CSS artifact. First-generation build-css.js/css-tools.js/build-ts.js were located, not read. Complete representative component/theme/token chains and registration handling before making that claim.

### Web Awesome

At pin 6d29eb0a71ca6d4fb9a127940126a62a7668d59c, a second reader inspected the full [build script](https://github.com/shoelace-style/webawesome/blob/6d29eb0a71ca6d4fb9a127940126a62a7668d59c/packages/webawesome/scripts/build.js#L77), [Button module](https://github.com/shoelace-style/webawesome/blob/6d29eb0a71ca6d4fb9a127940126a62a7668d59c/packages/webawesome/src/components/button/button.ts#L53) and shared size stylesheet. The source uses reusable authored Lit CSS modules, copies global styles, emits bundled/unbundled output and generates CEM before dependent docs/wrappers. Only the Button-specific stylesheet header was inspected; no complete output-equivalence or maps claim is made.

### Supported conclusion and next work

Peter's subsequent stated preference is compiled CSS converted into generated Lit style modules. He explicitly clarified “leaning towards”; no final production-model selection follows from that wording.

CSS upstream of a generated Lit wrapper is an established approach; authored Lit CSS and separate global pipelines also exist. This is not evidence of a universal community preference, nor of which model best meets the house requirements. Keep every house CSS declaration under generator ownership regardless of artifact format.

Finish the missing source and published-output traces, compare global/recipe outputs, registration, maps, escaping, determinism and selective delivery, then return a recommendation to Peter. No dependency, build script or generated output changed during this comparison.

## Completed bounded style-pipeline comparison

The follow-up source and published-artifact checks support **compiled CSS converted into generated Lit style modules** for this house generator. Peter initially leaned toward it and subsequently [selected the direction](../decisions/style-production.md) after this comparison. [Updated evidence and probe](../alignment/evidence/style-pipeline-comparison-2026-09-19.json). The partial snapshot above records earlier coverage, superseded by this completed bounded comparison.

### Verified production paths

- **Material Web:** the main Filled Button composes shared, shared-elevation and filled generated CSSResult modules; Divider also consumes generated styles. In published 2.5.0, AST-decoded CSS from all three Button style modules exactly matches its compiled CSS after source-map-comment removal. Eight relevant shared/token Sass files match the inspected source. Token fallback chains remain CSS variables, so compilation does not freeze every theme value. [Filled Button](https://github.com/material-components/material-web/blob/56a486b147b8b7e95e6e8035fa02aed7e0009a85/button/filled-button.ts), [token module](https://github.com/material-components/material-web/blob/56a486b147b8b7e95e6e8035fa02aed7e0009a85/tokens/_md-comp-filled-button.scss).
- **Spectrum first generation:** Lightning CSS resolves/bundles/minifies authored CSS, css-tools emits generated Lit CSSResult TypeScript, and esbuild emits JavaScript. Button and Theme consume these outputs. Published 1.12.2 confirms generated stylesheet modules. [CSS tooling](https://github.com/adobe/spectrum-web-components/blob/18c1177b5352c89569eacfe95660fc0ab27030d7/1st-gen/scripts/css-tools.js), [Theme adoption](https://github.com/adobe/spectrum-web-components/blob/18c1177b5352c89569eacfe95660fc0ab27030d7/1st-gen/tools/theme/src/Theme.ts).
- **Spectrum second generation:** the Lit-CSS plugin wraps Vite's processed inline CSS as Lit JavaScript; generated TypeScript is not necessary for this delivery pattern. The separate global-elements generator deliberately transforms host/slot selectors, omits component-only rules and adds a cascade layer from shared CSS sources. Document output is not recovered from emitted Lit JavaScript. Published 2.0.0-beta.3 verifies component CSS modules plus global-button.css, tokens.css and swc.css. [Global generator](https://github.com/adobe/spectrum-web-components/blob/18c1177b5352c89569eacfe95660fc0ab27030d7/gen2/packages/tools/vite-global-elements-css/index.js), [Lit-CSS plugin](https://github.com/redfox-mx/vite-lit-css).
- **Web Awesome contrast:** its full 370-line Button stylesheet is authored Lit CSS with reusable styles; the build copies global CSS and emits bundled/unbundled distributions. It does not reverse-parse generated JavaScript to recover CSS. This remains a valid authored model, not a reason to abandon the house generator. [Stylesheet](https://github.com/shoelace-style/webawesome/blob/6d29eb0a71ca6d4fb9a127940126a62a7668d59c/packages/webawesome/src/components/button/button.styles.ts).

These are distinct source pipelines; two Spectrum generations are not two independent communities. The comparison establishes viable practice and requirements fit, not universal preference or measured performance superiority.

### Conversion and registration checks

The main Material converter was exercised in memory under Bun with mocked file I/O. All five cases preserve the expected Lit CSSResult text: custom properties/selectors, CSS Unicode escapes/backslashes, literal template syntax, data URLs/at-rules and source-map-comment removal. No repository file or full build was changed by the probe. This tests the inspected main converter, not the older release converter: 2.5.0 lacks its explicit backslash/backtick/interpolation escaping. The first-generation Spectrum wrapper also lacks an explicit comparable escaping step; that observation alone is not a reproduced defect.

Our generator already produces CSS plus property-registration metadata and escapes template syntax. Preserve both outputs. Material's converter does not extract/register properties; its Labs ripple does so separately. Spectrum's global swc.css contains nine prompt-field @property rules with a comment explaining shadow-root limitations; published output includes them. [Registration source](https://github.com/adobe/spectrum-web-components/blob/18c1177b5352c89569eacfe95660fc0ab27030d7/gen2/packages/swc/stylesheets/swc.css). One compiled initial color changes format and has not been browser-tested.

Source maps also need an explicit house policy. Material ships separate Sass-to-CSS and generated-TS-to-JS maps. Spectrum first-generation maps point at generated CSS TypeScript. The inspected gen2 Button map names authored CSS but has empty mappings; its global CSS has no accompanying map. Merely enabling sourcemap does not establish useful authored-CSS debugging.

### Evidence-supported recommendation

Keep generator-owned sources authoritative. Compile their CSS, then produce generated Lit style modules as one delivery form. Produce document tokens, approved global/recipe styles, registrations and metadata from the appropriate source records, with explicit scope conversion. Shared sources do not mean identical shadow and document CSS.

This fits the house's existing CSS outputs and removes dependency on reconstructing them from generated TypeScript syntax. It is an ownership and dependency argument, not a claim that one path compiles faster or takes less effort. It selects neither Sass, Vite, Lightning CSS nor a particular plugin. Generated-style placement/version control and the Bun requirement stand.

Before implementation approval, test representative house styles, exact escaping, CSS scope, registrations/conflicts, deterministic generation, invalid-input failures, selective imports and source maps. Verify rendered outcomes in all three engines. The comparison did not execute upstream builds or provide browser acceptance; large published artifacts received structural/content checks rather than a claim of exhaustive visual reading. Deeper token implementation and every library component remain outside this bounded study.

### Selection after comparison

Peter accepted the evidence-supported direction: compiled CSS feeds generated Lit style modules, with explicit document-style, registration and metadata output paths. [Decision](../decisions/style-production.md). Earlier partial/unselected statements above record the sequence of the investigation; this selection is current. No build tool or source implementation is selected by implication.

## Full proposal output boundaries

The [complete inventory set](../alignment/inventory.md#complete-proposal-set) proposes native author-owned Table/List/Data List content and component-owned native Markdown prose to preserve semantics and real fragment targets. Those families require generated scoped document CSS alongside shadow-style outputs; they must not rely on a shadow stylesheet styling unrelated light-DOM descendants.

This fits the selected explicit document-output direction, but it is not yet verified pipeline support. Include these representative cases in the existing pre-Phase-5 CSS scope/registration/selective-loading/source-map gate. The proposal does not select a new compiler, edit generated modules, import a React renderer or create a compatibility stylesheet for retired interfaces. [Family/code coverage and limits](../alignment/evidence/full-proposal-review-2026-09-20.json).

### Whole-set approval and Phase 5 handoff

On 2026-09-20 Peter said “I approve all proposals.” The [approval record](../decisions/inventory-approval.md) selects the complete set and the five stated recommendations. Earlier proposal/unselected statements above retain their historical evidence scope; current design status is approved. Peter subsequently [approved the migration plan](../decisions/migration-approval.md) through “approved”. M00 technical prerequisites remain active before dependent implementation. Production implementation has not started; approval is not a runtime result.

## M00 compiler and browser evidence, 2026-09-20

The [saved probe](../alignment/evidence/m00-prerequisites-2026-09-20.json) compares installed Bun 1.4.0 output with Lightning CSS 1.33.0 in a separate scratch package. Project dependencies and generator outputs remain unchanged. This is evaluation under the approved migration, not dependency adoption.

Bun.build was exercised with direct CSS and a TypeScript entry importing CSS, each with linked, external and inline sourcemaps. All six builds succeeded, but CSS output had no CSS map or sourceMappingURL. JavaScript maps were emitted where applicable. This is a reproduced gap in these modes/version, not proof that every Bun route or later version lacks CSS maps. [Bun CSS documentation](https://bun.com/docs/bundler/css) describes its compiler; broad full-stack map claims do not establish this build path.

Lightning CSS runs under Bun and provides parsed transformations plus CSS source maps. The candidate compiles existing Button and Separator CSS and small nesting/escaping/registration/container fixtures. Twelve build assertions pass: deterministic code/maps, original sourcesContent, invalid CSS rejection, explicit nesting lowering, duplicate/conflicting registration handling, exact CSS through the generated Lit template and a decoded selector mapping back to its original location. Probe targets are test settings, not a newly selected support policy.

All three engines render expected button dimensions/color, both separator orientations, a non-inheriting registered-property default, container rule, literal escaped content and scoped document-list color. The outside list is a negative scope control. No page errors occur.

Document CSS is explicitly authored for native content, not blindly rewritten from shadow selectors. Importing existing generated modules supplies representative house input only; production must start at generator-owned CSS. Sources: [Lightning CSS API](https://lightningcss.dev/docs.html), [bundling](https://lightningcss.dev/bundling.html), installed 1.33.0 types.

Recommendation: Lightning CSS is a concrete candidate because it supplies the missing map interface and passes these bounded checks. It is not yet selected. Continuous authored-CSS-to-Lit-to-final-JS debugging, final map packaging, full corpus integration and selective consumer delivery remain open. The results do not close all of M00.

## M00 compiler, map and package conclusions, 2026-09-20

The [completion evidence](../alignment/evidence/m00-completion-2026-09-20.json) supplies the remaining bounded compiler and package checks. Lightning CSS 1.33.0 remains a proposed build dependency; Peter has not yet selected it.

Both installed Bun 1.4.0 and isolated Bun 1.4.2 emit no CSS maps in the six tested direct-CSS/TS-import modes. esbuild documents CSS transforms and maps but does not expose a parsed-tree modification API. Lightning CSS supplies maps and a typed CSS visitor, so registration validation does not need a second parser. This is the evidence-based recommendation; no speed ranking is claimed. Sources: [esbuild CSS](https://esbuild.github.io/content-types/#css), [plugin limits](https://esbuild.github.io/plugins/#plugin-api-limitations), [Lightning transforms](https://lightningcss.dev/transforms.html).

Useful map delivery now passes the actual path: CSS input → compiler map → generated Lit template → minified Bun bundle → adopted stylesheet. Chromium's CSS debugger recognizes the original source URL, map and exact source content. All three engines render the bundled output correctly. This maps CSS directly to CSS; JavaScript breakpoints inside CSS strings are not the debugging interface. Firefox/WebKit map UIs were not automated. Debug maps remain separate from minimal production delivery.

A complete syntax scan covers 166 existing style modules plus the house sheet. It exposes one real generator fault: command-menu-input emits an intermediate ::part(list) before a descendant selector. In tools/geist/gen.ts, retail() includes a part for every mapped segment even though mapped descendants live under the custom-element host. A scratch change retains the part only on the final segment. The baseline generator fails strict compilation; the corrected generator reports no unresolved rules and all 167 outputs compile without warnings. With actual Breadcrumbs/Breadcrumb components at 320px, each browser shows the first crumb's intended 12px margin only after the correction; the second stays at 0. Production generator edits belong in M02, not in the generated module.

Packed representative HTML, Lit and React consumers pass 152 assertions, including 21 browser cases across the three engines. Class imports register nothing; definition imports register required dependencies; @lit/react wraps the same actual class. Object/native-child identity, events, token CSS, document-style scope and unmount work. Metafiles show one retained Lit/TanStack implementation and no optional heavy engines or debug maps. The current root's named Button import retains Chart/Table and 497 modules; that red comparison supports the approved class/definition split.

An initial fixture omitted token CSS and produced a transparent default Button; the repaired packed example checks a concrete nontransparent result. Bun packs workspace:^ as ^0.0.1 and workspace:* as exact 0.0.1 after workspace installation. A direct local-tarball peer install tried public npm; a loopback registry verifies the intended matching-version registry route. No public package was published.

These checks establish representative M00 feasibility. Final generated exports, every rebuilt family, release versions, actual CDN behavior and complete consumer acceptance remain with M03/M22/M26. They are not additional design questions.

## Compiler selection and first migration slice

Peter selected option A on 2026-09-20: Lightning CSS 1.33.0 as a build-only dependency. [Decision](../decisions/style-production.md#compiler-selected-2026-09-20). The preceding candidate-status statements describe the investigation before that reply; the compiler is now selected and installed.

The first M01 slice moves the audited stylesheet unchanged to styles/house.css and updates split/development consumers. Development changes to the authored sheet run split before build/docs; changes to generated styles rebuild consumers without rerunning split. This avoids a regeneration loop while preserving independently regenerated styles. Two scratch-server integration tests check served output, split count and failure preservation; the old watcher fails the source-change oracle.

Build and documentation generation pass with no generated package/site CSS changes. The focused scripts pass strict TypeScript and Biome. The broader repository TypeScript command reports the same 13 diagnostics as a separately built HEAD checkout; no new diagnostic is introduced. [Complete slice evidence](../alignment/evidence/m01-house-style-path-2026-09-20.json). Remaining M01 paths and M02 compiler delivery are next, not declared complete.

## M01/M02 implemented, 2026-09-20

[Implementation and verification](../alignment/evidence/m02-css-pipeline-2026-09-20.json) close the local directory and CSS-production work. There are 296 generated style entries: 166 relocated modules, 128 extracted static library CSS blocks and two document outputs. All producers emit canonical CSS inputs, compiled CSS/maps and Lit modules through scripts/styles.ts. The old formatter and TypeScript reverse-parser are removed. Only four document CSS/map files enter dist/styles and the site; component intermediates remain under src/generated.

The input manifest verifies committed sources and outputs. It records the three reference CSS files and 76 HTML files used to establish stylesheet order. A present reference input tree must match the recorded file set; the complete input tree may be absent in a clean build. The simplifier now follows the same linked CSS order and ignores sidecar files. A regression proves sidecar @property text cannot alter defaults. The real defaults did not change.

The implementation exposed two compiler integration faults. Ownership must be assigned before optimization merges equal rules from different families. Constant line-height calculations must retain their browser-evaluated ratio: upstream [Lightning CSS issue 949](https://github.com/parcel-bundler/lightningcss/issues/949) rounds a ratio to 1.42857, causing a 20px line to occupy 19.9844px in Chromium. The narrow preservation transform respects CSS strings, comments, nested rules, function/bracket depths and custom-property value blocks. Its same-length temporary name preserves input columns; source maps restore the original CSS text. Tests retain both failures and their corrected outcomes.

The first comparison found 1,738 style differences from that rounding. The final comparison finds zero differences and zero errors over 114 cases: 19 component pages, light/dark, Chromium/Firefox/WebKit, 91,278 visible node pairs. This is not a claim that every future component/state has passed final acceptance. All 128 extracted style inputs also match their original literal inputs after compilation.

Build, documentation and 624 unit tests pass. The changed scripts pass strict types; the whole-repository strict check retains nine earlier errors, with four touched generator errors resolved. A separate build without the reference corpus passes. The independent review approved the bounded change. Generated output hashes remain unchanged after the final input/locking corrections, preserving the browser comparison's relevance.

The obsolete development-server process was stopped. Its source watcher reacted to a temporary lock inside src/generated and repeatedly rebuilt dist. The lock now lives outside watched directories; writers cannot overwrite one another's manifest update. During coordinated migration, port 4180 serves verified output with --no-build --no-watch; restore normal watching after coordinated generation ends. The live Pages configuration still serves main/docs. The tracked docs snapshot remains untouched until the separate publishing switch.

## M03 registration and packed delivery, 2026-09-20

The entry generator reads existing HTMLElementTagNameMap declarations, class inheritance and owned Lit template/element-creation tags. The resulting 149 definition entries include 56 owned dependency edges. Utility and type-only imports do not add registration dependencies. App Bar now includes Theme Switcher; Code Block includes Split Button Item; inherited Search/Menu Button dependencies are explicit. Unknown owned tags, unresolved dynamic tags, missing class exports and cycles stop generation. Unchanged outputs are not rewritten, avoiding source-watch rebuild loops. The entry command and the build update package exports from the same records.

Text Copy has no component consumers and was already approved for removal in the coverage map. Its unrestricted dynamic tag blocked complete dependency analysis. That isolated M04 deletion was pulled forward rather than create a temporary dependency exception. Its class, tests, map, authored/generated styles, splitter routing, exports and documentation page are removed; Copy Button remains its approved destination. Source API count is now 149, and documentation count is 103. The approved 150-tag coverage map remains the original migration census.

Class entries perform no registration or document mutation. Explicit definitions register owned children; all is the full-library entry. CDN entries share one module graph. Three-engine checks verify class import purity, a rendered selective Button/Spinner, selective plus full loading without duplicate definitions, and representative dependency closure. Button's tested graph contains 43 input modules and 68,651 bytes across twelve output files, with no Chart, Markdown, Highlight, Form, Table, Devtools, Solid or ELK input. These are local graph sizes, not CDN transfer measurements.

Registered CSS defaults now attach to CSSResult metadata and are installed for the connected element's document, including adoption. Runtime conflicts fail; invalid registrations propagate; the platform's already-registered-name error remains tolerated. All 114 baseline comparisons across nineteen pages, two themes and three engines still have zero differences and zero page errors. ComboBox's document listeners and Theme Switcher's root effects now follow connected component lifetimes.

### Patch delivery defect and correction

A fresh direct tarball install failed because development package metadata referenced omitted patch files. Adding patch files did not fix transitive delivery: tarball installs searched the consumer root, while normal registry installs succeeded without applying the runtime patch. All three engines reproduced the reconnect failure after registry installation. M00's representative consumer supplied its own patch, so that earlier evidence did not establish transitive patch delivery. The development analyzer patch also caused a Bun crash when a consumer separately installed the same analyzer version. These are newly verified packaging defects, not a reopened design choice.

The production packer stages only declared files and runtime package fields, preserving private package status. It omits scripts, development dependencies, local overrides, workspaces and patch settings without editing the authoring manifest. The existing TanStack helpers now own one per-host connection hook; TanStack still owns atoms, selectors and subscriptions. The runtime patch is removed. A fresh staged package installs 78 dependencies without consumer configuration. Packed browser checks in all three engines verify all root exports, inert class imports, token-backed Button rendering, repeated Theme Switcher moves and catch-up after detached state changes.

Bun 1.4.0 has a separately reproduced diagnostic limitation: directly bundling a named side-effect-free package entry can emit undefined named reexports. The same unchanged package works through ordinary external namespace/export-star consumers and selective named imports. The delivered root modules are unbundled; explicit definition/all entries supply browser bundles. Preserve the minimal failure and verify actual packed consumers rather than weakening side-effect metadata or changing the public API for this diagnostic path.

React, Devtools and MCP are private workspace skeletons at this stage. They reserve the approved package boundaries; no wrapper, inspector or server implementation is claimed. Exact core peers, a local file:. override and Bun's hoisted linker provide a live root build. Fresh/repeated frozen installs, dist replacement and singleton/bundler identity pass. A linker transition can leave stale package-local links; a clean install removed them. No global link configuration is used. The [M03 closure record](../alignment/evidence/m03-delivery-2026-09-20.json) preserves all checks and their source.

The final website smoke check also caught the production side-effect metadata pruning a bare documentation-app import. All four local documentation elements now register explicitly in site/app/main.ts. Their class module carries no registration decorators. The rebuilt site passes real browser navigation/API checks and all 104 site tests.
