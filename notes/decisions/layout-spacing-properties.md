Decided 2026-09-19 by Peter.

# Use numbered spacing tokens and full layout property names

Spacing properties accept theme spacing values and explicit valid CSS lengths/expressions. Use theme values for coordinated appearance; literal values are deliberate overrides and are not automatically rescaled by density. Per-property CSS validity still applies.

Use numbered spacing token keys. A number identifies a theme entry, not a pixel count; explicit CSS lengths carry units where CSS requires them. Component sizes retain their separately selected full-word names. The current house scale starts at 4px and has an 8px step 2, but this choice does not adopt all Chakra/Radix keys, values or units.

The focused shared layout properties use full CSS names and logical inline/block directions. JavaScript properties are camelCase and HTML attributes are kebab-case: paddingInline and padding-inline, for example. Do not add duplicate p/px/py/ps/pe aliases. This does not mechanically rename semantic component properties that are not CSS shorthands.

Exact supported spacing keys, default values, density mappings, CSS value grammar and the complete property lists remain inventory work. [Source comparison and answers](../alignment/evidence/layout-contract-review-2026-09-19.json).
