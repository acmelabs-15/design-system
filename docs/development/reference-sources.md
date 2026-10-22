# Reference sources

Read this guide when applicable component work needs a reference comparison or source-backed recommendation. It preserves the selected source roles. Brain:source-driven-development owns the general research procedure.

## Select the relevant evidence

The [reference-systems decision](../decisions/0082-reference-systems.md) is the authority for these assignments and their extensions.

Use the current implementation together with the applicable authoritative source evidence when making a recommendation. Identify discrepancies before treating either as the selected contract.

| Source | Assigned role |
|---|---|
| Geist | Recorded visual baseline |
| Radix Themes and Chakra UI | Capabilities Geist lacks and names where Geist differs from common practice |
| Material Design 3 | Selected indicator, artwork, motion, shape, theme and responsive roles, as bounded by their individual decisions |
| Material Web | Actual Lit implementation, layout and build comparisons where an implementation exists |
| Chakra UI Pro blocks and supplied kits | Complete compositions and additional evidence for relevant comparisons |

Whenever a review considers Radix, Chakra, Material guidance or Material Web, also consult relevant Chakra Pro evidence. Search the recorded collection by capability as well as component name. Record the complete examples inspected. If none supplies relevant evidence, state that limit. The [collection review](../research/21-chakra-pro-collection.md) records the completed full review and searchable source location.

Pro examples and kits are additional sources, not an implementation checklist. A listed package, backend, visual treatment or placeholder does not select a capability. Material extensions likewise do not select every Material visual detail or the full shape catalogue. Compare value, implementation and compatibility with the existing decisions.

## Read complete Material guidance

Read a Material component's Overview, Specs and Guidelines tabs in full, including every subsection, table and example. Include Accessibility when available. Expand relevant token sets and inspect measurement diagrams. Continue truncated extraction; a navigation shell or collapsed widget is not the specification.

Read supporting Material guidance when the question depends on it, such as layout, density, breakpoints, input methods or state. Compare the actual Material Web implementation where available. Keep design guidance, tokens without a shipped component, stable exports and experimental Labs code distinct. Report missing implementations and uninspected visual states.

Label Material values as reference values. Keep dp, CSS pixels and rem distinct. Do not silently replace an approved spacing, density or other rule with a reference value.

## Apply and record findings

Identify the assigned source from decisions, not visual resemblance or dependency names. When that source settles the behavior, inspect its complete relevant documentation or source and apply it within existing decisions. Record the version, evidence and source-derived resolution. Discoverable reference facts do not need an additional preference vote.

Investigate discrepancies before raising a choice. An unresolved assignment, conflict or proposed departure follows the current user-choice workflow. A proposed revision identifies its benefit, cost, earlier decisions, affected components and relevant upcoming dependencies. The existing decision remains current until that revision is selected.

When names differ, use the recorded survey of common usage and the approved glossary. Exact port parity does not override accepted adaptations. A source reference neither imports that system's runtime nor replaces a selected package.

Keep source documentation, example source, rendered behavior, placeholders and local verification distinct. Name deliberate deviations and state which preview or source was actually inspected. Uninspected platforms remain unverified.

Geist citations belong in research and decision records outside `src/`, as required by [component source boundaries](components.md#styling-and-source-boundaries). Library and standards citations remain available. This source-location rule is not a general citation prohibition.
