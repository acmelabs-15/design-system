Decided 2026-09-19 by Peter.

# Support full visual themes on pages and sections

Support custom colours, fonts, spacing, corners and shadows. Peter selected full visual themes over colour-only customization, then selected support for both whole pages and individual sections.

Nested sections inherit settings they do not override. Controls and overlays must consistently use the relevant section's theme. Each custom theme needs contrast and layout checks.

The later [shared-value choice](layout-spacing-properties.md#signed-spacing-and-separate-size-values) gives numeric sizes and spacing separate theme categories with matching defaults. Consumers can override them independently. Negative spacing derives from the positive spacing value; spacing-only density remains a distinct policy with exact mappings still to specify.

The current theme store only selects auto, light or dark at the document root. Existing CSS-variable overrides are not a complete custom-theme contract. Theme names, authoring format, exported tokens, overlay context, runtime switching and validation remain for later design. The house theme remains the default; consumer themes can supply their own appearance.

Evidence: [foundation analysis](../analysis/design-foundations.md).

## Canonical fonts and full-color consumers, 2026-09-21

Under Peter's [delegation to finish with the recommendations](execution-delegation.md), the primary sans and mono families use --acme-font-sans and --acme-font-mono throughout emitted CSS. Remove the duplicate --sans/--mono/--font-sans/--font-mono aliases. Keep the distinct fallback-family settings. A registered main-family override must reach both ordinary content and component content.

Font weights use the six numeric weights actually present in the sources. Remove declarations that use font-family variables as font-weight; their normal effect was inherited weight, and changing a font family must not accidentally change weight. Generation owns these changes.

Color consumers use the full public color, retaining their specified alpha, instead of bypassing it through private HSL channel fields. Avatar Group's dark count and Tooltip's inverse surface keep their intended treatment and receive registered overrides through owned stylesheets; ordinary author CSS retains precedence. The six measured WebKit Select-ring changes use the public wide-gamut palette rather than the old HSL fallback. This is an intentional consistency correction, with [before/after evidence](../alignment/evidence/m05-theme-comparisons-2026-09-21.json); physical wide-gamut screenshot parity is not claimed.
