Decided 2026-09-19 by Peter.

# Support full visual themes on pages and sections

Support custom colours, fonts, spacing, corners and shadows. Peter selected full visual themes over colour-only customization, then selected support for both whole pages and individual sections.

Nested sections inherit settings they do not override. Controls and overlays must consistently use the relevant section's theme. Each custom theme needs contrast and layout checks.

The current theme store only selects auto, light or dark at the document root. Existing CSS-variable overrides are not a complete custom-theme contract. Theme names, authoring format, exported tokens, overlay context, runtime switching and validation remain for later design. The house theme remains the default; consumer themes can supply their own appearance.

Evidence: [foundation analysis](../analysis/design-foundations.md).
