# Build and delivery investigation

Phase 1.8, measured and reviewed 2026-09-19. **Peter selected [selective component imports as the normal generated-HTML path](../decisions/selective-component-loading.md), retaining the complete standalone bundle as an explicit option.** Browser-ready selective delivery is still to build and verify. Keep Lit's working stylesheet sharing; [SSR is explicitly excluded](../decisions/server-rendering.md); its earlier probes remain historical evidence.

## Method and baseline

Copied authored build inputs to `/tmp/acme-phase1-build.PC2HHW` and ran `bun run split && bun run build && bun run docs` there. The checkout's source and generated outputs were not regenerated. Bun 1.4.0 on macOS arm64 emitted 330 modules, 128 compiled templates and a 104-page docs site covering 150 elements. The existing unit suite separately passed all 608 tests. No test, lint rule, or type check was weakened.

The fresh minified library is 1,339,348 bytes, 315,589 gzip. `tokens.css` is 267,541 bytes, 26,565 gzip; the standalone bundle is 1,540,694 bytes, 324,488 gzip. These reproduce the prior saved artifact sizes. Gzip is computed with Bun; bytes are decimal, and this is transfer-size evidence rather than a network or CPU timing claim.

## Entry-point experiments

Each probe uses freshly emitted JS, Bun's browser target, ESM and minification. All variants live in the temporary copy. [Exact measurements](../alignment/evidence/build-bundles.json).

| Probe | Minified bytes | Gzip bytes | Interpretation |
|---|---:|---:|---|
| Complete library | 1,339,348 | 315,589 | Every public export retained |
| Omit Chart export | 1,222,874 | 275,271 | 40,318 gzip bytes less |
| Omit Form helper export | 1,275,400 | 299,512 | 16,077 less |
| Omit Markdown export | 1,313,342 | 306,975 | 8,614 less; highlighting remains reachable elsewhere |
| Core: omit Chart, Form helper, Markdown, Code Block and Snippet | 1,101,673 | 244,051 | 71,538 less, or 22.7%; not a complete proposed core API |
| Button exported through root barrel | 1,273,009 | 298,278 | Side-effectful registration retains most of the library |
| Button exported from its direct module | 66,919 | 19,755 | 278,523 fewer gzip bytes than the barrel probe |

The savings are alternatives, not additive. The biggest result is selective loading, not assuming the four heavyweight packages explain the entire 1.34 MB bundle.

The walkthrough compared [Material Web's guide](https://github.com/material-components/material-web/blob/main/docs/quick-start.md): it supplies an all-components CDN example and individual definition imports for production builds. That supports offering both paths. Its bare-specifier/build guidance is not proof that our current unbundled modules work directly from an arbitrary CDN. Peter selected the desired authoring default; exact exports, registration/class separation, runtime sharing and optional heavyweight entries still need the delivery contract and tests.

## What the source establishes

- `src/index.ts:1` explicitly registers every element through re-exports; `package.json` declares blanket `sideEffects: true`. Changing the flag alone cannot safely make this barrel selective. Marking registration modules side-effectful still retains them when the root intentionally imports them.
- `scripts/build.ts:30` transpiles per file with Lit's template compiler, then emits declarations and bundles the complete index. Preserve the unbundled/CDN distinction supported by [Lit's publishing guidance](https://lit.dev/docs/tools/publishing/).
- Imports in the unbundled output retain extensionless relative specifiers. Bundlers resolve these; direct browser ESM delivery needs explicit `.js` paths or a rewriting CDN. Do not promise arbitrary unbundled CDN imports work merely because the complete bundle works.
- `docs-src/app/main.ts:3` and `docs-app.ts:8` import the root entry. The router fetches page HTML on demand, but JavaScript for the whole library is already loaded. Page-fragment caching does not solve that initial cost.
- In Chrome 153, two copy-button instances have three adopted stylesheets each and share the same base sheet object. We already benefit from Lit's static CSSResult/adoptedStyleSheets reuse. Replacing that with per-instance style injection would lose an existing benefit.

The documented artifact path loads the complete CDN bundle. With separate tokens CSS, its compressed-content estimate is 315,589 + 26,565 bytes before fonts/assets; with the standalone entry, tokens are installed by the script and the combined compressed bundle is 324,488 bytes. These are payload estimates from local compression, not observed CDN transfer timing. Both paths load the registration graph before the first custom-element render, even if the page uses only a button. Google Fonts and any used media add requests; their cache state and host policy affect first paint.

## Tokens and CSS delivery

There are 459 unique token names across 5,351 declarations. A static TS-source scan directly references 291; including docs and dependency chains reaches 306. The remaining 153 are **candidates**, not safe deletions: dynamic color names, complete public scales, and consumer use are not all expressed as literal `var(...)` calls. [Reachability data](../alignment/evidence/token-reachability.json).

The generator intentionally preserves light, dark and wide-gamut branches. First define the public token contract and trace dynamic roots, then prune unused private tiers through the generator. The entire current token file is only 26,565 gzip bytes, an upper bound on possible transfer savings; claiming a precise smaller result before that analysis would be false. Preserve shadow-root sheets per element and the shared reset; do not load all element styles into every shadow root.

## SSR readiness: measured, not assumed

**Scope update, 2026-09-19:** Peter [excluded SSR altogether](../decisions/server-rendering.md). The following measurements are historical and create no future implementation milestone.

Bare Bun import succeeds. Rendering Button or Calendar from the compiled published output using Lit SSR 4.1.0 fails on template strings. An isolated TypeScript-only control build, without the Lit template compiler transform, renders both with declarative shadow markup. Fieldset fails in both because its constructor initializes an unguarded MutationObserver. These tests distinguish an import from rendering and isolate a compiled-template problem from an element lifecycle problem. They do not establish hydration support.

[Lit SSR](https://lit.dev/docs/ssr/overview/) remains a separate renderer with documented limitations. Web Awesome publishes distinct SSR loading support; copying its promise without a matching build/test path would be wrong. The earlier suggestion to revisit SSR is superseded by Peter's explicit exclusion. Keep the compiler for the supported browser delivery path; do not plan server entries or hydration.

## Prioritized proposals and expected gains

1. **Explicit element imports and page-specific docs registration.** The Button probe demonstrates a 278,523-byte gzip difference. A whole-page saving depends on its element graph; measure each route after implementation.
2. **Separate heavyweight entries.** The measured core probe removes 71,538 gzip bytes. Define the actual core membership in the inventory, including transitive imports.
3. **Registration/class separation and a correct sideEffects list.** Lion demonstrates this shape. Expected gain is reliable consumer pruning; no independent additive byte estimate is asserted beyond the direct-entry probes.
4. **Token contract and pruning.** At most 26,565 gzip bytes are at stake before retaining required rules; measure the approved result. Fix ownership first.
5. **Lazy definition.** It can help docs routes, but a global observer can create late upgrades and layout changes; use explicit route dependencies first. SSR is outside scope.

No production Core Web Vitals, mobile CPU trace, cold-CDN first-paint figure, or cross-browser timing ranking is claimed. Bundle measurements and the actual first-load import graph establish the delivery problem. Browser loading/performance tests remain required acceptance work for the approved implementation.
