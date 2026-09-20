Decided 2026-09-19 by Peter.

# Add Box to the planned primitives

Add Box as a general container with the shared theme and responsive contract. Peter selected it over relying entirely on native HTML containers styled through CSS or helpers.

Box supplies general spacing, dimensions, visibility and surface styling. Flex, Stack and Grid supply child-arrangement rules. Card supplies a defined presentation for grouped content. Keep those responsibilities distinct in the inventory.

Chakra implements Box through its shared styling factory; Radix provides a more focused layout interface. Material Web has no equivalent Box in the inspected repository tree. The exact properties and composition remain to design. Do not assume every element must add a nested Box node, or that Chakra's as/asChild behaviour transfers unchanged to a Lit custom-element host.

Evidence: [Box comparison](../analysis/design-foundations.md#box-primitive). This adds an inventory candidate; it does not approve source implementation.

## Focused styling interface

Peter selected a focused shared styling set: spacing, dimensions, positioning, visibility and surface appearance, with theme values and the shared responsive contract. Uncommon rules use ordinary CSS. Broad support for every CSS property and state-style object as component properties is not selected. Flex, Stack and Grid add their own arrangement contracts; this does not remove their selected capabilities.

The comparison used Chakra's all-CSS-props Box and Radix's focused layout interface. A source census of all 938 indexed Pro JSX/TSX files found 479 literal Box tags across 240 files, with frequent background, positioning, spacing, border and sizing properties. This is authoring evidence, not browser validation or a count of aliases/runtime-generated tags. The exact house property names, values, token mappings and defaults remain to approve in the inventory. [Evidence and answer](../alignment/evidence/layout-typography-review-2026-09-19.json).

The later [shared layout/spacing convention](layout-spacing-properties.md) selects full CSS property names, logical directions, numbered spacing token keys and explicit CSS lengths alongside theme values. Apply that convention to Box's focused set; it does not approve the final per-property list or tokens.
