Decided 2026-09-19 by Peter.

# Keep layout Grid and Simple Grid only

Provide Grid and Simple Grid for ordinary content layout. Remove the current decorative Grid implementation and its Grid Cell, Grid Cross, Grid System and Grid Page interfaces. Dedicated guide lines, crosses and guide-clipping features are not retained as a separate family.

Peter selected “Keep layout grids only” over the recommendation to retain a separately named Decorative Grid. The simpler scope removes a specialised visual family while keeping responsive layout. Chakra and Radix use Grid for content layout; Geist's current Grid combines layout with a specialised guide-line treatment.

The new layout Grid replaces the old same-named implementation outright. Do not preserve the old breakpoint rules, helper exports or decorative child contracts as compatibility interfaces. Exact layout parts, responsive properties and remaining Simple Grid details follow the selected house responsive and spacing rules.

Evidence: [grid review](../analysis/codebase-systematization.md#disclosure-layout-and-smaller-component-dispositions), [selection record](../alignment/evidence/disposition-checkpoint-2026-09-19.json).

## Simple Grid sizing modes

Peter selected both an explicit responsive column count and automatic columns based on a minimum child width. He then chose Chakra's precedence: when both valid settings are supplied, minChildWidth selects automatic fitting and columns does not control that instance. Do not reject that combination as conflicting input.

Chakra's inspected source selects a truthy minChildWidth branch and uses CSS auto-fit/minmax; its count mode uses repeat with equal fractional tracks. The house choice selects valid-setting precedence, not every absent, invalid or zero-value parsing detail. The source-defined overflow and mode-selection details below now follow Peter's standing reference instruction; house numeric/JSON edge cases still require the complete inventory contract.

The Pro census found 83 literal SimpleGrid tags across the 938 indexed JSX/TSX files: 82 specify columns, one specifies minChildWidth and none directly specify both. The complete charts-02/block.tsx minimum-width example was re-read. [Evidence and answers](../alignment/evidence/query-stack-grid-review-2026-09-19.json).

## Source-defined sizing details

Recorded 2026-09-20 under Peter's [standing reference instruction](reference-systems.md#follow-the-established-reference-without-another-preference-question), not a separate preference vote. The complete pinned Chakra SimpleGrid source already supplies these details:

- Minimum-width mode uses repeat(auto-fit, minmax(width, 1fr)) with no implicit clamp to the container. Honor the authored minimum, including possible overflow in a narrower container. An author can supply an explicit fitting expression when needed. The queued clamp-versus-honor question is retired.
- The component chooses minimum-width mode before mapping responsive values. While that valid input is supplied, columns does not become a fallback at widths where minChildWidth has no active value. Clear the minimum-width input to return to column-count mode. This corrects the later draft's per-width mode switching and follows the existing valid-setting precedence decision.
- The source declares no columns=1 default. Preserve absence of an explicit track setting rather than introduce a house one-column override; native implicit Grid behavior supplies layout. Default row flow with ordinary unplaced children normally forms one implicit column, but child placement can add tracks.

The selected house numeric size tokens and responsive serialization still differ from React inputs. Do not infer a settled zero/invalid-value policy from JavaScript truthiness, nor add a new renderer merely to copy React source structure. Browser verification of track geometry, sparse responsive inputs and retained Lit boxes remains required. Source: [Chakra SimpleGrid at the reviewed commit](https://github.com/chakra-ui/chakra-ui/blob/1ff9873754e9913fc3d849d23c0844a628f5f20d/packages/react/src/components/simple-grid/simple-grid.tsx). This resolves supported details within the proposal; the complete entry and migration plan remain unapproved.
