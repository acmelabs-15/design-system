# Reference generation and measurement

Read this guide before changing extraction, reference maps, census configuration or comparison evidence. Read the [tooling glossary](../../tools/geist/CONTEXT.md) and [reference guidance](reference-sources.md) for the applicable concepts and source roles.

## Match the actual boxes

| Tool area | Responsibility |
|---|---|
| Corpus and stylesheet parser | Saved source assets and ordered reference rules |
| Extraction and committed specifications | Example structure, styles, children and states |
| Maps and generator | Explicit reference-to-component box roles, properties, children, parts and approved differences |
| Reconstruction | Rebuild comparison fixtures from saved metadata and configuration |
| Mirror and collector | Serve reference fixtures and preserve measured results |
| Census and diff | Measure configured roots/states and compare equivalent evidence |

Use the actual producers named in the [repository map](../agents/repository.md#generator-and-delivery-map). Historical extraction counts describe their recorded source state, not current coverage.

Map a reference node to the box that performs its layout role. Read the subtree and composed component structure. A matching class name or shared visual content does not establish equivalent boxes. Check the host's contribution to normal flow as well as paint and positioning.

When an approved control differs from its reference, do not map it onto an incompatible reference control. Preserve its own generated styles. Record the deliberate difference; an accurate unmapped-child report is not a defect to hide.

A map's ignore entry claims that the class contributes no applicable reference style. Support it with the winning selector and observed cascade. A documentation harness can cancel a real component declaration. Apparent inactivity in one preview is insufficient evidence.

## Collect valid evidence

Require equal, nonzero roots on both sides. Reject an empty or mismatched comparison before interpreting differences. Recover intended roots from saved metadata and configuration before changing selectors.

Map skip entries use the **reference** heading. Preserve that meaning when consumer documentation headings change.

The collector writes named measurements under `tools/geist/census/`; it has no output-directory override. Preserve existing measurements before a rerun can overwrite them. Keep committed historical captures immutable and retain new evidence with its provenance. Record the exact configuration and preserve each side's state setup. The [tool runbook](../../tools/geist/README.md) describes the actual collector destination.

```text
configuration
  reference side
    states
  component side
    states
```

The census reads states inside each side. A top-level states field does not configure both sides. A composed target must reach the intended control or part; a host's computed style can differ from its inner control. Preserve each hop through shadow trees and slots.

Match theme, viewport, container, state and rendered context where the comparison requires them. Identify harness differences and intended deviations. A hard/soft classification is measurement output, not independent acceptance of a product change.

## Preserve source ownership and limits

Change generated values through their producer inputs. Follow [style ownership](styles.md) for compilation and regeneration. A value derived from a reference is not immune to an approved token or component change; update its authoritative input and evidence.

Each report identifies source/revision, fixture and configuration, run scope, captured states, accepted differences and limits. Distinguish documentation, reconstructed fixtures and live behavior. A source-only or reconstructed comparison cannot certify an unobserved live state.

Reference defaults do not override current component decisions. Old port instructions about template copying, fixed fonts, exact page sections or deferred features are historical. Read the current component contract before interpreting a difference. Browser and platform acceptance follows [verification guidance](../agents/verification.md).
