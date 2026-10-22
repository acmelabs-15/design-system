# Use Material Symbols SVG artwork

Use Google's current Material Symbols collection as actual SVG artwork, with one element per icon as [already selected](0046-icon-element-shape.md). Support the Outlined, Rounded and Sharp families, using Google's official filled and unfilled artwork. Do not use an icon font. Two-tone is omitted; the plan does not require drawing our own filled versions.

Decided 2026-09-19 by Peter.

Provide a library default, a way for consumers to change that default, individual style overrides, and separate imports for supported styles. Switching requires the selected artwork to be available. Peter selected **Rounded, unfilled** as the default in two follow-up answers on 2026-09-19. Other families and filled artwork remain available. At the 2026-09-19 decision, exact properties, exports, loading behavior, supported weight/size variants and catalog coverage remained to be designed and verified.

The then-existing shared `glyphSized` helper in `src/base.ts` uses rounded stroke ends/joins and no fill. That supported the default recommendation as a design judgment, not a claim of exact visual parity across Material Symbols. Individual overrides and component states can use filled artwork; no rule making every selected state filled was decided.

Peter first considered classic Material Icons plus selected newer Symbols and custom-drawn two-tone additions. He selected current Material Symbols after accepting the omission of two-tone and verifying that official filled SVGs already exist. This keeps one current artwork source across the chosen families and fill states. Lucide and Radix no longer meet the expanded multi-style requirement; Phosphor offers duotone but not separate Rounded and Sharp families.

Google publishes the artwork under Apache-2.0; retain the required licence and notices. Replacements of existing glyphs are named visual deviations. Verify required artwork, size, visual weight, accessibility and both themes before implementation acceptance. The Home SVG files were inspected across all three families and both fill states; that sample does not establish complete catalog coverage or final bundle costs.

Evidence: [icon investigation and SVG source links](../research/14-icon-library.md#material-svg-investigation-and-peters-selection), [Google's collection comparison](https://github.com/google/material-design-icons#material-symbols), and [Material Symbols guide](https://developers.google.com/fonts/docs/material_symbols). The historical Phase 5 gate is retired.

## Pinned baseline catalog — 2026-09-21

The delegated implementation selected the complete 4,135-symbol catalog from Google revision 27e9ef1dbeedc13d682fece4a58e1eda4cb0961a at weight 400, grade 0 and optical size 24 for packaging. All 24,810 baseline SVGs exist: three families multiplied by two fill states. The asset manifest records the source path and SHA-256 of every unmodified SVG; the Apache-2.0 license is retained. Fixed SVG sizes scale this artwork, without implying continuously variable font axes.

Retain separate icon/style imports. The main artifact must not acquire the whole catalog merely because optional per-icon entries exist. The base renderer owns no network loader. Missing requested artwork is an explicit visible marker, a bounded diagnostic and a localized accessible description. An explicit artwork import can resolve an already mounted marker. Library defaults use canonical TanStack state; explicit icon properties remain independent. Named images expose one SVG image name; unnamed artwork is decorative.

This dated catalog/base checkpoint left per-icon entry generation, package delivery, internal glyph migration and full M09 action acceptance in progress. [Implementation evidence](../verification/systematization/m09-icon-foundation-2026-09-21.json).

## Entry and configuration delivery — 2026-09-21

The delegated delivery decision keeps icon classes in explicit icons/<symbol> entries and generate definitions and artwork imports from the full pinned catalog. The main component entry loads only owned icon dependencies. An explicit icons/all entry registers the complete optional catalog; whole-family imports are also explicit. The catalog remains searchable in the documentation and available as package metadata.

Expose the shared configuration functions through a browser configure entry. A shared-graph standalone bootstrap installs tokens while remaining compatible with selective icon/artwork modules. Retain the self-contained single-file bundle as a separate delivery mode. Consumers use one graph per page. This supports the selected script-only static-artifact use case without duplicating the icon state or Theme context.

Registration declarations retain their class module so a definition-only import carries the native tag-to-class types. The standard analyzer processes independent generated icon leaves with their real ancestors in bounded partitions; all public records are compared against the complete analyzer baseline. Private/protected controller details are omitted from the public manifest.

[Delivery evidence](../verification/systematization/m09-icon-delivery-2026-09-21.json) closed these prerequisites. At that checkpoint, internal glyph replacement, Spinner, action controls and identity families remained M09 work. Split Button's Menu composition remained M13; Theme Switcher remained M10. An icon replacement required its internal consumer to stop using the earlier glyph implementation.

Later records cover [glyph replacement](../verification/systematization/m09-glyph-replacement-2026-09-21.json), [Spinner and Icon Tile](../verification/systematization/m09-spinner-tile-2026-09-21.json), [actions](../verification/systematization/m09-actions-2026-09-21.json), [identity](../verification/systematization/m09-identity-2026-09-21.json), and the [actions](../../spec/SPEC-actions.md) and [selection](../../spec/SPEC-selection.md) contracts. Those records retain their own verification scope.
