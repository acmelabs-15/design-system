Decided 2026-09-19 by Peter.

# Include Accordion, Show, Hover Card and suitable as support

Peter directly requested Chakra-like Accordion, Show and Hover Card, plus as support where appropriate, including Box, Text and Heading. These additions are included in the planned scope; do not ask again whether to include them. FormatNumber and FormatByte are recorded in the [formatter decision](format-components.md).

- **Accordion:** coordinated disclosure of related sections. The later [disclosure decision](disclosure-components.md) also adds independent Collapsible and removes Collapse/Collapse Group. Exact parts, defaults and mounting remain to specify.
- **Show:** conditional content with a fallback. Define the mounting and state lifecycle deliberately for static HTML, Lit and React; CSS visibility alone is not assumed equivalent to Chakra's conditional rendering.
- **Hover Card:** supplementary hover previews. Preserve the [explicit-activation rule for interactive rich help](rich-help-activation.md). The later [help-component decision](overlay-help-components.md) adds Toggle Tip and removes Context Card. Focus/touch behaviour, detailed mappings and overlay composition remain inventory work.
- **as:** allow appropriate primitives to express the intended element semantics, such as section, paragraph or heading level. Lit retains its custom-element host, so the actual rendered element, wrapper, native attributes, focus and form behaviour need an explicit contract. Neither arbitrary React-component substitution nor asChild is selected by this request.

## Primitive tag sets and typography defaults

Peter selected defined, documented native tag sets per primitive. Heading supports h1 through h6; Text supports suitable text containers; Box supports suitable structural containers. Dedicated controls retain interactive behaviour. Arbitrary HTML-tag or React-component substitution and asChild are not selected. The exact Box/Text sets and attribute forwarding remain inventory work.

Text defaults to a native paragraph (p), with as="span" for inline phrases. Heading defaults to h2, with as selecting h1–h6 to fit document hierarchy. Heading's visual size remains independent of its semantic level. Lit retains the custom-element host around the native semantic element; the final implementation must verify layout, content models and accessible semantics rather than assume React's root substitution is equivalent.

Chakra's inspected source defaults Text to p and Heading to h2. Radix's inspected source defaults to span and h1 respectively and exposes restricted tag sets. The Pro source census found 917 literal Text tags across 938 indexed JSX/TSX files: 908 without explicit as, eight with span and one with h3. These counts establish source usage only. [Sources and six choices](../alignment/evidence/layout-typography-review-2026-09-19.json).

Retain the house state, motion, icons and generated-style rules. Reference capabilities do not select another runtime or approve implementation. Exact properties/defaults and required verification belong in the inventory, with source changes gated by Phase 5.

Evidence: [targeted source review](../analysis/codebase-systematization.md#accelerated-capability-and-disposition-checkpoint), [request and coverage record](../alignment/evidence/capability-checkpoint-2026-09-19.json).
