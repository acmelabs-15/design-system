Decided 2026-09-19 by Peter.

# Add Box to the planned primitives

Add Box as a general container with the shared theme and responsive contract. Peter selected it over relying entirely on native HTML containers styled through CSS or helpers.

Box supplies general spacing, dimensions, visibility and surface styling. Flex, Stack and Grid supply child-arrangement rules. Card supplies a defined presentation for grouped content. Keep those responsibilities distinct in the inventory.

Chakra implements Box through its shared styling factory; Radix provides a more focused layout interface. Material Web has no equivalent Box in the inspected repository tree. The exact properties and composition remain to design. Do not assume every element must add a nested Box node, or that Chakra's as/asChild behaviour transfers unchanged to a Lit custom-element host.

Evidence: [Box comparison](../analysis/design-foundations.md#box-primitive). This adds an inventory candidate; it does not approve source implementation.
