Decided 2026-09-19 by Peter.

# Use Material Symbols SVG artwork

Use Google's current Material Symbols collection as actual SVG artwork, with one element per icon as [already selected](icon-element-shape.md). Support the Outlined, Rounded and Sharp families, using Google's official filled and unfilled artwork. Do not use an icon font. Two-tone is omitted; the plan does not require drawing our own filled versions.

Provide a library default, a way for consumers to change that default, individual style overrides, and separate imports for supported styles. Switching requires the selected artwork to be available. Peter selected **Rounded, unfilled** as the default in two follow-up answers on 2026-09-19. Other families and filled artwork remain available. Exact properties, exports, loading behaviour, supported weight/size variants and catalog coverage remain to be designed and verified.

The existing shared `glyphSized` helper in `src/base.ts` uses rounded stroke ends/joins and no fill. That supported the default recommendation as a design judgment, not a claim of exact visual parity across Material Symbols. Individual overrides and component states can use filled artwork; no rule making every selected state filled was decided.

Peter first considered classic Material Icons plus selected newer Symbols and house-drawn two-tone additions. He selected current Material Symbols after accepting the omission of two-tone and verifying that official filled SVGs already exist. This keeps one current artwork source across the chosen families and fill states. Lucide and Radix no longer meet the expanded multi-style requirement; Phosphor offers duotone but not separate Rounded and Sharp families.

Google publishes the artwork under Apache-2.0; retain the required licence and notices. Replacements of existing glyphs are named visual deviations. Verify required artwork, size, visual weight, accessibility and both themes before implementation acceptance. The Home SVG files were inspected across all three families and both fill states; that sample does not establish complete catalog coverage or final bundle costs.

Evidence: [icon investigation and SVG source links](../analysis/icon-library.md#material-svg-investigation-and-peters-selection), [Google's collection comparison](https://github.com/google/material-design-icons#material-symbols), and [Material Symbols guide](https://developers.google.com/fonts/docs/material_symbols). Source changes remain gated by Phase 5 approval.
