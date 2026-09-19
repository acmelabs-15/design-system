Decided 2026-09-19 by Peter.

# Give each icon its own element

Use one element per icon, with a distinct tag and selective import. Peter selected this over a single `acme-icon` element with a `name` property. The icon is explicit in the tag; the cost is a larger public tag and module catalog. Both approaches can support selective imports, so this choice alone does not establish a bundle-size advantage.

Share rendering and the rules for size, colour, accessible labels and composition across the icon elements. Changing an icon's style must not require changing its identity. The [Material Symbols decision](material-symbols-icons.md) supplies the artwork families and fill states.

Exact tag names, properties, module paths and the generated catalog remain part of the inventory and migration plan. Examples used during the comparison illustrate the shape, not an approved naming map. This decision does not authorize source changes before Phase 5 approval.

Evidence and alternatives: [icon investigation](../analysis/icon-library.md). The earlier single-element recommendation is superseded by Peter's selection.
