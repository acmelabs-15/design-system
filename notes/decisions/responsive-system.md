Decided 2026-09-19 by Peter.

# Share responsive values across layout and appearance

Provide one responsive approach for layout, typography, component sizes and appropriate visual variants. Peter selected this over limiting responsive values to layout alone.

Use Material's five size bands as the default set, combined with Chakra-style responsive authoring capabilities. Peter selected Material bands separately from the authoring approach. Their reference transitions are 600, 840, 1200 and 1600.

Make thresholds scale with the browser's default font size. At a 16px initial font size, they match those reference widths; the direct rem conversion is 37.5, 52.5, 75 and 100. Page-authored font sizes do not themselves change media-query thresholds. Ordinary zoom also changes the available CSS viewport width.

The exact public names, attribute/property syntax, supported values, range definitions, custom breakpoint configuration and window/container-query contract remain for the inventory. Chakra's array syntax, shorthand aliases and ambiguous range descriptions are not automatically adopted. Existing component-specific limits require review rather than a blanket numerical replacement.

Evidence: [foundation analysis](../analysis/design-foundations.md#responsive-system) and [responsive findings](../alignment/evidence/responsive-review-2026-09-19.json). Source implementation still waits for Phase 5 approval.
