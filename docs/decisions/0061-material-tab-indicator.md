# Material primary-tab treatment and the additional Tabs variant

Take the indicator's anatomy, states, and behaviour from Material 3 primary tabs, including the horizontal slide when the selected tab changes. This reference applies to the indicator; it does not adopt Material for the rest of the library.

Decided 2026-09-10 by Peter; recorded 2026-09-19 from the systematization plan.

Peter selected [retaining `@lit-labs/motion`](0004-animation-package.md) after Phase 1.5 research on 2026-09-19. The existing [book motion decision](0065-motion-on-the-book.md) remains evidence for its capabilities, including interruption handling; its demonstrated capabilities are not reopened without new evidence.

The selected indicator requires exact values, behavior, sources and verification methods. The later [selection contract](../../spec/SPEC-selection.md) records those details.

The later [shared-indicator decision](0097-shared-selection-indicator.md) uses one shared active-indicator component for Tabs and other suitable single-selection groups. Lit Motion lives inside that component and owns indicator movement and resizing in both horizontal and vertical orientations. Tabs supplies its selected target and treatment; it does not keep a separate indicator animation. This retains the Material primary-tab appearance and state contract for that treatment. Each Tabs variant's supported orientations belong to the selection contract; the shared component must support both.

## Additional visual request, 2026-09-19

Peter requested an additional Tabs variant matching the supplied Source/Output reference: a white rounded outer surface with a light outline and an inset, rounded light-gray fill behind the selected label. He supplied icon-only segmented examples with the same visual treatment. The request adds a treatment; it does not replace the Material primary-tab treatment or choose a new default.

References: [Source/Output Tabs attachment](../verification/systematization/tabs-variant-reference-2026-09-19.png), [icon Segmented Control attachment](../verification/systematization/segmented-control-reference-2026-09-19.png). These are user-supplied visual references. At that request, exact variant names, dimensions, colors, radii, default selection and dark-theme values remained unspecified. The later selection contract defines primary and inset variants, with primary as the default. Both treatments use the shared indicator component.

The [analysis](../research/02-animation-package.md#shared-indicator-ownership-and-visual-references) and [Group evidence](../verification/systematization/group-review-2026-09-19.json) record the composition proposal, source comparison and remaining dependencies. No Tabs or Segmented Control implementation changed in that 2026-09-19 research. Later implementation and verification are recorded by the selection contract and [release record](../releases/0.3.0.md).
