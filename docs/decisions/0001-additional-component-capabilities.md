# Include Accordion, Show, Hover Card and suitable as support

Accordion, Show, Hover Card and defined native tag sets are part of the component scope. Native semantics and accessible naming remain explicit contracts because Lit retains a custom-element host.

Decided 2026-09-19 by Peter.

Peter directly requested Chakra-like Accordion, Show and Hover Card, plus as support where appropriate, including Box, Text and Heading. These additions were included in the systematization scope. FormatNumber and FormatByte are recorded in the [formatter decision](0042-format-components.md).

- **Accordion:** coordinated disclosure of related sections. The later [disclosure decision](0029-disclosure-components.md) also adds independent Collapsible and removes Collapse/Collapse Group. Parts, defaults and mounting were not yet specified at this decision.
- **Show:** conditional content with a fallback. Its mounting and state lifecycle must account for static HTML, Lit and React; CSS visibility alone is not equivalent to conditional rendering.
- **Hover Card:** supplementary hover previews. Preserve the [explicit-activation rule for interactive rich help](0088-rich-help-activation.md). The later [help-component decision](0076-overlay-help-components.md) adds Toggle Tip and removes Context Card. Focus/touch behaviour, detailed mappings and overlay composition were still inventory work at this decision.
- **as:** allow appropriate primitives to express the intended element semantics, such as section, paragraph or heading level. Lit retains its custom-element host, so the actual rendered element, wrapper, native attributes, focus and form behaviour need an explicit contract. Neither arbitrary React-component substitution nor asChild is selected by this request.

## Primitive tag sets and typography defaults

Peter selected defined, documented native tag sets per primitive. Heading supports h1 through h6. Text's set is now p, span and div, selected below. Box's [complete set](0009-box-primitive.md#native-tags-and-default-display) is div, span, section, article, main, nav, aside, header and footer, default div. Its default display is inline for span and block for the other tags, unless explicitly overridden. Dedicated controls retain interactive behaviour. Arbitrary HTML-tag or React-component substitution and asChild are not selected. Detailed attribute forwarding was still inventory work under the authoring direction below.

Text defaults to a native paragraph (p), with as="span" for inline phrases. Heading defaults to h2, with as selecting h1–h6 to fit document hierarchy. Heading's visual size remains independent of its semantic level. Lit retains the custom-element host around the native semantic element; the final implementation must verify layout, content models and accessible semantics rather than assume React's root substitution is equivalent.

Chakra's inspected source defaults Text to p and Heading to h2. Radix's inspected source defaults to span and h1 respectively and exposes restricted tag sets. The Pro source census found 917 literal Text tags across 938 indexed JSX/TSX files: 908 without explicit as, eight with span and one with h3. These counts establish source usage only. [Sources and six choices](../verification/systematization/layout-typography-review-2026-09-19.json).

## Text tag set and standard accessible naming

Decided 2026-09-20 by Peter: Text supports p, span and div, with p remaining the default. This adds a generic text block alongside paragraphs and inline phrases. Heading and Field retain their heading and form-label responsibilities. Radix's Text API supplies a comparison, not its complete tag set or default: Text does not add label through this choice.

Peter selected ordinary aria-label, aria-labelledby and aria-describedby inputs for naming/describing the inner semantic element of suitable primitives. Use shared forwarding that prevents duplicate wrapper names and supports the required element references. A separate custom naming-property interface was not selected. These inputs may need relocation in rendered DOM; the exact attribute/property, update, removal and reference-change contracts must be explicit in the component contract.

The Chromium probe distinguishes host placement, inner native heading semantics, duplicate named nodes and string-ID versus element-reference scope. Material Web's inspected forwarding helper addresses duplication but explicitly lacks ID-reference support. Its data-attribute storage and DOM-method overrides are not an approved mechanism; the selected state and implementation contracts still apply. Verify descriptions, dynamic references, as changes, nested roots and all three engines, with Heading/TOC and Field dependencies included. This selects authoring behaviour, not a complete forwarding implementation. [Answers and bounded evidence](../verification/systematization/primitive-interfaces-review-2026-09-20.json).

The request retained the selected state, motion, icons and generated-style contracts. Reference capabilities did not select another runtime or approve a complete implementation. Exact properties/defaults and verification were later consolidated in the [component contracts](../../spec/SPEC-design-system.md); the completed phase gates are historical.

Evidence: [targeted source review](../research/06-codebase-systematization.md#accelerated-capability-and-disposition-checkpoint), [request and coverage record](../verification/systematization/capability-checkpoint-2026-09-19.json).

## Shared structural tags for layout components

Decided 2026-09-20 by Peter: Flex, Stack/HStack/VStack, Grid, Simple Grid and Group share Box's native tag set: div, span, section, article, main, nav, aside, header and footer. The default is div. Peter selected “Share Box’s set (Recommended)” over limiting these layouts to div/span and adding a separate structural container.

Changing the native tag supplies HTML meaning while preserving the component's flex/grid arrangement. For example, Stack as="article" retains its column layout; the reviewed Pro Lesson View uses that composition. Box keeps its separately selected tag-based default display. span requires suitable phrasing content, and arbitrary tag/component substitution or asChild remains excluded.

Lit retains its real custom-element host and native inner element. This tag-set choice does not establish correct layout or accessibility through those boxes; geometry, attribute/reference forwarding and supported-browser checks were still required at selection time. [Answer and limits](../verification/systematization/layout-contract-selections-2026-09-20.json), [inventory](../../spec/SPEC-design-system.md#semantics-state-events-and-lifecycle).

## Structural semantic forwarding implementation — 2026-09-21

The 2026-09-21 implementation used Peter's [then-scoped execution delegation](0035-execution-delegation.md). Keep one actual native semantic target. Canonical role/label inputs remain readable through the host's authoring API while their physical ARIA role/name live on the inner root. Resolve string label/description IDs in the author's tree scope and supply native element references to the inner target. Rebind on reference, scope and document changes. Do not replace native accessible-name computation with copied text solely because an automation query does not support the native reference API.

[Implementation, plain-native comparison and limits](../verification/systematization/m07-box-2026-09-21.json); [analysis](../research/15-lit-practice-review.md#m07-native-structural-semantics--2026-09-21). This establishes Box's mechanism and does not certify every future control or screen reader.
