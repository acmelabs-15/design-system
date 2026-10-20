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

## Inline content

Decided 2026-09-20 by Peter: Box supports as="span" for styling inline content alongside its block structural-container uses. Text retains typography responsibility. Radix Box supports div/span; the complete Pro source comparison also shows structural containers, but its arbitrary React substitutions are not the house contract.

Verify inline wrapping, spacing and borders through the retained Lit host and native inner element. The tag set and display default are now selected below; complete CSS target mapping remains inventory work. Use the selected [standard accessible naming direction](additional-component-capabilities.md#text-tag-set-and-standard-accessible-naming). The existing host-box rule remains; this does not authorize display:contents wrappers or arbitrary as substitution. [Initial answer and evidence](../alignment/evidence/primitive-interfaces-review-2026-09-20.json).

## Native tags and default display

Decided 2026-09-20 by Peter: Box supports div, span, section, article, main, nav, aside, header and footer, with div as its default. Forms, lists and tables retain their native HTML or dedicated components. This completes Box's native tag set; it does not allow arbitrary React substitutions or asChild.

Default display follows the selected native tag: span is inline, and the other eight supported tags are block-level. An explicit display value overrides that default. Changing as can therefore change layout. Peter chose this over Radix Box's always-block default; its inspected CSS sets display:block independently of its div/span choice. Inline behaviour still requires verification through the house's retained host and inner element.

## Parent placement and visual values

Peter selected responsive parent-placement properties on Box: flexBasis, flexGrow, flexShrink, alignSelf, justifySelf, gridArea and grid row/column placement. These affect the outer host, which participates in its parent's Flex/Grid layout. The reviewed Radix interface exposes these capabilities; the Pro lesson layout uses a growing Box, and the earlier Chromium probe distinguishes outer placement from an ineffective inner-only grid span. Exact types/defaults and the cross-framework handling of the subsequently selected declaration-order priority still require the full entry.

For colors, corners and shadows, Peter answered “Do what chakra does” to the token-versus-CSS input question. Accept category-appropriate theme tokens and valid explicit CSS values. This matches the selected spacing input approach. Theme values can follow the active theme; a fixed value such as #fff stays fixed, so consumers check their chosen contrast/theme behaviour. This scoped answer does not select every Chakra property, alias, opacity shorthand or pseudo-state object.

The candidate property list is a draft derived from the focused scope, full CSS naming, logical directions and inspected reference use. The four choices above do not approve all candidate names, token identifiers, CSS-part names or a complete Box row. [Answers, coverage and candidate groups](../alignment/evidence/box-contract-review-2026-09-20.json).

The later [shared default rule](layout-spacing-properties.md#omitted-styling-inputs-and-visual-defaults) is selected: absent CSS styling inputs read undefined, while CSS supplies their visual defaults. Box's as-based display remains the selected visible behaviour; it does not require a default value in the display getter. Native as retains its separately selected div default. Exact property types, token/style targets and the complete row remain open.
