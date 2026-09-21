Decided 2026-09-19 by Peter.

# Use Material Symbols SVG artwork

Use Google's current Material Symbols collection as actual SVG artwork, with one element per icon as [already selected](icon-element-shape.md). Support the Outlined, Rounded and Sharp families, using Google's official filled and unfilled artwork. Do not use an icon font. Two-tone is omitted; the plan does not require drawing our own filled versions.

Provide a library default, a way for consumers to change that default, individual style overrides, and separate imports for supported styles. Switching requires the selected artwork to be available. Peter selected **Rounded, unfilled** as the default in two follow-up answers on 2026-09-19. Other families and filled artwork remain available. Exact properties, exports, loading behaviour, supported weight/size variants and catalog coverage remain to be designed and verified.

The existing shared `glyphSized` helper in `src/base.ts` uses rounded stroke ends/joins and no fill. That supported the default recommendation as a design judgment, not a claim of exact visual parity across Material Symbols. Individual overrides and component states can use filled artwork; no rule making every selected state filled was decided.

Peter first considered classic Material Icons plus selected newer Symbols and house-drawn two-tone additions. He selected current Material Symbols after accepting the omission of two-tone and verifying that official filled SVGs already exist. This keeps one current artwork source across the chosen families and fill states. Lucide and Radix no longer meet the expanded multi-style requirement; Phosphor offers duotone but not separate Rounded and Sharp families.

Google publishes the artwork under Apache-2.0; retain the required licence and notices. Replacements of existing glyphs are named visual deviations. Verify required artwork, size, visual weight, accessibility and both themes before implementation acceptance. The Home SVG files were inspected across all three families and both fill states; that sample does not establish complete catalog coverage or final bundle costs.

Evidence: [icon investigation and SVG source links](../analysis/icon-library.md#material-svg-investigation-and-peters-selection), [Google's collection comparison](https://github.com/google/material-design-icons#material-symbols), and [Material Symbols guide](https://developers.google.com/fonts/docs/material_symbols). Source changes remain gated by Phase 5 approval.

## Pinned baseline catalog — 2026-09-21

Under Peter's execution delegation, package the complete 4,135-symbol catalog from Google revision 27e9ef1dbeedc13d682fece4a58e1eda4cb0961a at weight 400, grade 0 and optical size 24. All 24,810 baseline SVGs exist: three families multiplied by two fill states. The asset manifest records the source path and SHA-256 of every unmodified SVG; the Apache-2.0 license is retained. Fixed SVG sizes scale this artwork, without implying continuously variable font axes.

Retain separate icon/style imports. The main artifact must not acquire the whole catalog merely because optional per-icon entries exist. The base renderer owns no network loader. Missing requested artwork is an explicit visible marker, a bounded diagnostic and a localized accessible description. An explicit artwork import can resolve an already mounted marker. Library defaults use canonical TanStack state; explicit icon properties remain independent. Named images expose one SVG image name; unnamed artwork is decorative.

This is the catalog/base implementation checkpoint. Per-icon entry generation, package delivery, internal glyph migration and full M09 action acceptance are still in progress. [Implementation evidence](../alignment/evidence/m09-icon-foundation-2026-09-21.json).
