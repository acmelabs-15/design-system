# Icon library investigation

Phase 1.6, researched and reviewed 2026-09-19. **Peter selected [one element per icon](../decisions/icon-element-shape.md) and [Material Symbols SVG artwork](../decisions/material-symbols-icons.md), with Rounded, unfilled defaults.** These decisions supersede the initial single-element/Lucide recommendation after Peter requested multiple artwork styles. Detailed interfaces and delivery remain open. No source or dependency changed.

## Current implementation

`src/base.ts:220` starts the icon helpers and inline path registry. Other elements carry their own SVG markup; the initial source scan found 32 literal SVG occurrences in 26 non-style TypeScript files, including the shared helpers. This is a search count, not a count of distinct glyphs. Select also imports the shared `paths` object and writes its own SVG wrapper (`select/select.ts:15`). The docs have a separate `docs-src/symbols.html` sprite. An icon library must cover internal glyphs, consumer slots and docs examples together.

## Two public shapes

| Concern | Named element with explicit registry | One element per icon |
|---|---|---|
| Consumer markup | `<acme-icon slot="start" name="arrow-up"></acme-icon>` | `<acme-arrow-up-icon slot="start"></acme-arrow-up-icon>` |
| Unbundled imports | Import renderer plus only the icon definitions to register | Import only the defining modules for the required tags |
| CDN bundle | Include a documented curated registry; arbitrary names outside it are unavailable | Include a documented curated set of definitions; other tags remain undefined |
| Tree-shaking | Works when registrations have explicit imports; fails for unrestricted all-icons lookup | Works with selective definition imports; an all-icons barrel retains every definition |
| Authoring | One renderer, accessible-label contract and icon-name list | Generate and maintain a tag declaration, module and metadata per icon |
| Runtime changes | Change one name property | Change the rendered tag or choose another predeclared element |
| Main cost | Must define missing-icon behaviour and registry ownership | More custom-element definitions and a much larger tag namespace |

The tag shape does not itself determine tree-shaking. The import graph does. A single renderer does not require importing every icon. Peter chose the per-icon element shape. Its shared implementation can keep size, colour and accessible-label rules consistent across those tags. Changing style within an icon is separate from changing which icon the tag represents.

## Measured asset cost

With Lucide 1.47.0, exporting just ArrowUp and Check retains 133 minified bytes, 125 gzip. Looking up arbitrary names through Lucide's complete `icons` namespace retains 421,010 bytes, 93,687 gzip. These probes measure **icon data**, not the proposed house renderer or registration wrapper. The comparison isolates the cost of an unrestricted registry; it is historical candidate evidence, not a measurement of the selected Material Symbols implementation. [Raw measurements](../alignment/evidence/package-bundles.json).

Iconify's registering runtime measures 22,967 minified bytes, 8,507 gzip before icon data. Its [official documentation](https://iconify.design/docs/iconify-icon/) supports Lit, local `addIcon`/`addCollection`, and on-demand network loading. The default network path adds availability and content-policy requirements to static artifacts. It is a reasonable alternative if broad icon-set discovery is required, but a local curated set is a better fit for the current contract.

## Icon sets and licence evidence

| Set | Evidence | Assessment |
|---|---|---|
| Lucide | [Official vanilla guide](https://lucide.dev/guide/lucide/); package 1.47.0 declares ISC; exports individual icon data | Initially recommended for an outline collection; not selected after the multi-style requirement. The [licence page](https://lucide.dev/license) also lists MIT notices for Feather-derived icons. |
| Radix Icons | `@radix-ui/react-icons` 1.3.2 declares MIT; [official icons](https://www.radix-ui.com/icons) | Smaller alternative with a different visual grid; do not import its React runtime into Lit |
| Geist assets | The public registry request for `@vercel/geistcn-assets` returned 404; earlier source investigation also found it private | Do not choose a private package with no verified reusable distribution or asset licence |
| Iconify | Runtime declares MIT, but each supplied icon set retains its own licence | Useful infrastructure rather than one unified visual set |

The source set changes vector geometry, so it is a named visual deviation wherever a Geist icon is replaced. Keep the evidence in notes/tooling, preserve licence notices, and verify sizes and stroke weight in both themes. Do not assume an icon scaled to the same bounding box is geometrically identical.

## Reference-system practice

[Web Awesome's icon element](https://github.com/shoelace-style/webawesome/blob/next/packages/webawesome/src/components/icon/icon.ts) uses one named element, a library resolver, a cache, and an accessible label. Its [button examples](https://github.com/shoelace-style/webawesome/blob/next/packages/webawesome/docs/docs/components/button.md) use that element in `start` and `end` slots. This informed the initial recommendation; Peter chose separate tags instead. Shared slot and accessible-label rules remain useful. The subsequent multi-style requirement now needs a family/fill interface, which was absent from the initial proposal.

Keep one canonical icon-name vocabulary. Generate the icon catalog and types from the same approved set. Internal elements should depend explicitly on the icons they require. Selective icon/style imports and the complete artifact entry must be designed together so changing the library default also reaches icons inside components.

## Material SVG investigation and Peter's selection

Peter requested one collection with multiple styles, a library-wide default and switch, individual overrides, and imports for supported styles. The sources below were read during the 2026-09-19 walkthrough:

- [Google's collection comparison](https://github.com/google/material-design-icons#material-symbols) distinguishes current Material Symbols from classic Material Icons. Symbols has Outlined, Rounded and Sharp families with filled/unfilled forms, but no two-tone. Classic has the five named styles, including two-tone, and stopped receiving new icons in 2022.
- [The Material Symbols guide](https://developers.google.com/fonts/docs/material_symbols) provides SVG distribution and describes fill, weight, grade and optical size. SVGs use selected drawings; they do not acquire continuous font-axis behaviour from CSS font settings.
- [Phosphor web components](https://github.com/phosphor-icons/webcomponents#styling) offer per-icon imports with Thin, Light, Regular, Bold, Fill and Duotone. They do not supply separate Rounded and Sharp families. [Phosphor's core assets](https://github.com/phosphor-icons/core#assets) expose SVGs by style.

Actual source inspection confirmed Home SVGs in each of Google's three Symbols families, both unfilled and filled, and classic filled/two-tone Home. All eight raw-file requests returned HTTP 200. Representative pairs:

| Family | Unfilled SVG | Filled SVG |
|---|---|---|
| Outlined | [home_24px.svg](https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web/home/materialsymbolsoutlined/home_24px.svg) | [home_fill1_24px.svg](https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web/home/materialsymbolsoutlined/home_fill1_24px.svg) |
| Rounded | [home_24px.svg](https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web/home/materialsymbolsrounded/home_24px.svg) | [home_fill1_24px.svg](https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web/home/materialsymbolsrounded/home_fill1_24px.svg) |
| Sharp | [home_24px.svg](https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web/home/materialsymbolssharp/home_24px.svg) | [home_fill1_24px.svg](https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web/home/materialsymbolssharp/home_fill1_24px.svg) |

The [classic filled Home](https://raw.githubusercontent.com/google/material-design-icons/master/src/action/home/materialicons/24px.svg) and [classic two-tone Home](https://raw.githubusercontent.com/google/material-design-icons/master/src/action/home/materialiconstwotone/24px.svg) are also SVGs. The two-tone file uses separate paths, with opacity 0.3 on the interior. A new two-tone drawing requires intentional regions; changing the SVG fill colour cannot create them. Symbols' filled paths are already supplied by Google, so no house-drawn filled version is needed for these samples.

Peter selected **Material Symbols SVGs**, accepting the omission of two-tone. Use the official Outlined, Rounded and Sharp families and official filled/unfilled artwork, with no icon font. This selects one current source instead of mixing classic icons with new Symbols and maintaining house-drawn two-tone additions. Google's [Apache-2.0 licence](https://github.com/google/material-design-icons/blob/master/LICENSE) applies; retain required licence and notices.

## Decided capabilities and remaining work

- **Decided:** per-icon elements; Material Symbols SVGs; three families; filled/unfilled forms; no icon font or two-tone; a library default, consumer switching, individual overrides and separate style imports. Peter then selected **Rounded** and **unfilled** in separate follow-up answers.
- **Default evidence:** the existing `glyphSized` helper in `src/base.ts` uses rounded stroke ends/joins and `fill="none"`. That informed a design judgment about continuity; it is not a verified full-collection visual match. Other families and filled artwork remain available. No automatic filled treatment for every selected component state was decided.
- **Still to design:** exact properties, names, import paths, supported weight/size variants, catalog and delivery granularity. A style must be available before it can render; whether and how to load missing artwork remains open. Do not silently register competing implementations for the same tag.
- **Still to verify:** complete required-icon coverage, every offered style, size/visual-weight matching, theme behaviour, accessibility, global changes reaching internal icons, selective-import output and final bundle costs. The Home sample is not a full catalog or visual acceptance test.

The inventory and migration plan must resolve those details before source implementation. This review does not select an npm distribution or approve shipping the entire upstream catalog by default.

## M09 catalog and shared renderer — 2026-09-21

The complete public upstream tree at revision 27e9ef1dbeedc13d682fece4a58e1eda4cb0961a has 4,135 symbol directories. Its web tree includes 2,084,040 files across all axes/sizes. Exactly 24,810 files match the chosen default-weight/default-grade 24px filled/unfilled variants. Their combined original source is 12,496,389 bytes. The full baseline census finds exactly one svg and one path per asset, and no script, foreignObject, remote href, event attribute or additional element. 402 assets omit viewBox; the renderer derives their equivalent viewport from the original width and height.

The importer copies the six SVGs for every symbol, preserves their license and records per-file source paths, sizes and hashes. Verification reads the complete baseline again, rejects unknown files and checks all six variant identities. The strict parser accepts this audited grammar; it does not execute arbitrary markup. Google’s current [repository](https://github.com/google/material-design-icons) and [Symbols guide](https://developers.google.com/fonts/docs/material_symbols) were read for source, axes and licensing. The guide's illustrative count is not used as a catalog census.

The shared renderer uses native SVG/path nodes, currentColor, generated size styles and the existing canonical store/lifecycle mechanisms. The browser fixture uses all six actual Home geometries as available data, with explicit installations for the requested variants. Ten checks per engine cover drawing, decorative/name semantics, size, color, missing artwork, late installation, explicit false fill, reconnect and adoption. These certify the shared mechanism only. They do not certify every catalog image visually or claim the per-icon package entries and internal replacement work are complete.

Seven focused unit tests cover owned geometry/defaults, SVG safety, identifier generation and rendering/state behavior. The build passes. Per-icon generation, complete catalog metadata/export integration, selective payload measurements, consumer delivery and internal glyph migration remain in M09. Full action/Spinner acceptance follows; no stop for a preference question is required.

### Full catalog delivery and analyzer scaling

Per-icon classes, default records, six explicit artwork entry paths per symbol, whole-family entries and an optional all-icons registration entry are generated from the verified catalog. Icon classes have explicit icons/<symbol> imports; the main root does not re-export thousands of optional classes. The main component registration entry excludes optional icons except those reached through an owned component dependency. Browser entries share the same chunk graph, including explicit artwork installations. Source SVGs stay in the repository; the package ships compiled artwork, the catalog and licenses, rather than duplicate raw files.

The first standard-analyzer run included all generated leaves in one global inheritance pass. The installed analyzer repeatedly scans all modules for each inherited member. A full runtime-metadata test took 165.23 seconds while another analysis ran; it still passed all 111,496 assertions. A separately timed version with public-only metadata took 71.15 seconds total, including 61.06 seconds inside the analyzer. Removing private/protected implementation details also avoids repeating private controllers thousands of times in the public manifest.

The standard analyzer now runs the core with its actual ancestors and generated icon leaves in batches of 128 with their actual ancestors. It merges all leaf and definition records, rejects inconsistent duplicate partitions and normalizes the resulting complete manifest. No custom field/type extractor replaces the selected analyzer. The timed result is 8.43 seconds for all 4,254 elements, including 1.61 seconds in the analyzer. The metadata suite passes eight tests and 111,504 assertions, including an authored component inheriting from an optional generated icon. The runs were not isolated hardware benchmarks; the order-of-magnitude change and unchanged API checks justify the bounded partition rather than a claim about a small timing difference.

Every one of the 24,810 SVGs was instantiated and measured in Chromium, Firefox and WebKit. All have finite, nonempty geometry. Thirty-one upstream paths extend beyond their source viewBox. Treating that as invalid artwork was an incorrect first oracle. All 31 were then compared against the unmodified source SVG: geometry, dimensions and clipping match in all engines. The house renderer preserves those paths and native clipping. This is full geometry/viewport coverage, not a claim of a human aesthetic review of every image.

### Delivery acceptance and concrete failures

The complete public surface contains 4,254 elements: 119 existing component tags plus 4,135 optional icon tags. The partitioned manifest's public records match the original monolithic manifest exactly for all 4,254 elements. Its public-only output is 19 MB rather than 54 MB with repeated private controllers. The site has 93 pages and no undocumented element; the icon page covers the complete catalog while showing the shared API once.

Definition-only imports originally erased their class import from the declaration file. A clean TypeScript reproduction therefore inferred HTMLElement and rejected family/filled. Registration entries now retain a side-effect class-module import, so their declaration files also load HTMLElementTagNameMap. The exact failing consumer now passes. This fixes all definition entries, without adding runtime registration to class-only imports.

A configure browser entry and a token-installing shared-graph bootstrap allow static artifacts to configure and extend the same runtime that owns their icons and components. The existing single-file bundle remains a self-contained choice. The shared bootstrap, explicit icon/artwork imports, Theme locale, and runtime configuration pass together; the full optional icon entry registers all 4,135 names without re-registering an already loaded Home.

Ten CDN checks and five fresh packed-consumer checks pass in each engine. They include both theme colors, no network request from a missing-artwork state, explicit late artwork installation, class purity, declaration reachability and shared configuration identity. The selective icon-plus-configuration fixture loads approximately 109 KB of uncompressed resource bodies; it does not load the complete catalog. The complete production tarball is approximately 18 MB. These are local payload measurements, not field-performance claims.

Full-suite testing exposed Bun 1.4.0's macOS discovery/descriptor boundary. Unrooted discovery plus core/analyzer imports holds 10,477 descriptors (maximum 10,485) and reproduces EBADF from posix_spawn. The same reproduction with generated assets, built output and reference corpora excluded holds 1,768 descriptors (maximum 1,772) and passes. Rooted paths also pass. The [upstream mechanism](https://github.com/oven-sh/bun/issues/32067) and [directory-descriptor report](https://github.com/oven-sh/bun/issues/39783) support the diagnosis; the [official discovery exclusion](https://bun.sh/docs/test/configuration#path-ignore-patterns) exists in the installed CLI. bunfig.toml now excludes those non-test trees. No authored test is skipped: all 893 tests across 131 files pass, with 119,159 assertions. The unmodified failing spawn tests also pass separately.

Import verification now compares every SVG and the license with the pinned Git tree's blob identities, rather than trusting only the checkout's HEAD name. This prevents modified working files being described as pinned upstream artwork. All 24,810 SVGs and the license pass that verification.

A separate full-generated-module experiment measured the existing TypeScript/Lit transpile path at 7.68 seconds and Bun.Transpiler at 0.36 seconds for 33,088 inputs. No second emitter was introduced: this stage is a small part of the full build, and the existing common compiler path remains straightforward. The verified analyzer improvement addresses the measured scaling failure without changing output semantics.

### Internal consumer replacement in progress

The source glyph/path/sprite helpers are removed. Their consumers use named icon elements, and private action/search/navigation glyphs are also being replaced. The documentation's generic sprite is replaced with canonical named icons; its service brand marks have a separate brand-only asset. Visualization geometry, overlay tips and illustrative/brand content remain owned by their features. Checkbox's combined check/indeterminate indicator is part of its M10 replacement.

Native tests reproduced an ambient-stroke defect in all engines: an ancestor's stroke CSS reached the new filled-path artwork. The generated icon stylesheet now explicitly sets stroke:none. Eleven renderer checks per engine pass after that fix. Structural tests now assert the selected icon identity and size; they no longer assert a removed private path string or direct SVG child.

The first composition fixture imported unpublished src/all through a bundler; distribution side-effect metadata allowed that source-only import to be removed. The fixture now uses the compiled distribution consistently. A separate real documentation-build failure occurred when a new generated entry imported an otherwise unreferenced side-effect-only app module. The docs app now exports an explicit startDocs function which the entry calls. Native page bootstrap verification is required before closing this slice; a nonempty app.js alone is not a sufficient oracle.

### Glyph replacement acceptance — 2026-09-21

The shared paths, glyph, glyphSized and sprite-icon helpers are deleted from base.ts. Their action, navigation, file, status and code consumers use named Material Symbol elements. Private search/menu/theme/feedback glyphs also use those elements. Documentation examples use canonical icon names; the generic sprite is deleted. A separate brand-only sprite preserves service marks. Brand/illustrative content and visualization/overlay geometry are not alternative generic icon libraries. Checkbox's check/indeterminate indicator remains with its M10 family replacement; Avatar's service-specific core behavior remains with its M09 identity replacement.

The final suite passes 896 tests across 132 files, with 119,166 assertions. Eleven native renderer checks, ten compiled component-composition checks, and three actual documentation-app interactions pass in each engine. The latter load the routed Icons page, click the named chevron to open a code example, then navigate to Colors and verify all six icon examples, including explicit filled artwork.

The documentation entry derives required icon definitions and artwork imports from parsed markup. It handles quoted attributes correctly and rejects unknown names. Its generated entry calls startDocs explicitly; this fixes the observed tree-shaking failure of a side-effect-only source-app import. Relative paths keep machine-specific locations out of generated entry source. Definition imports in fragment tests use the same parsed requirements.

Composition checks verify internal default changes after explicit artwork imports, late author icon replacement, 14px Browser control geometry and foreground color, file/folder/search/theme symbols, and keyboard activation of the Description illustration's Tooltip. The first focus-only oracle did not match the current Tooltip contract: its default opens on Enter/Space, while focus-only opening uses its own sticky trigger. The corrected test uses a trusted Enter and checks the visible popover. Final Tooltip focus behavior remains an M17 obligation; this slice does not certify that later contract.
