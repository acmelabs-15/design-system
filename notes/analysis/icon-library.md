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
