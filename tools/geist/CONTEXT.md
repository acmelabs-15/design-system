# Generation and comparison tools

The descriptions and measurements used to generate styles and compare the library with its references. Component, primitive, recipe and message names are defined in the [component glossary](../../CONTEXT.md).

## Language

**Root**:
One measured box in a comparison. A page can contain several roots.
_Avoid_: Page or component as a synonym for one measured box.

**Page**:
One documentation URL containing examples. A saved measurement's page label identifies a result set and need not be that URL.
_Avoid_: Assuming a result label means one URL or one root.

**Spec**:
The extracted description of a reference page, including the states available for generation and comparison.
_Avoid_: Measurement result as a synonym for a spec.

**Sketch**:
A constructed description of a reference state that the captured page does not contain.
_Avoid_: Treating a sketch as proof that the state was measured in a browser.

**Map**:
The correspondence between the reference description and the house component's boxes, treatments and content places.
_Avoid_: Matching boxes by name alone when their roles differ.

**Generator**:
The tool that produces styles from the reference descriptions and their maps.
_Avoid_: Treating generated styles as their own source of truth.

**Census**:
A collection of browser measurements of corresponding roots and states for comparison.
_Avoid_: Screenshot comparison or unit test as a synonym for a census.

**Hard difference**:
A measured difference requiring investigation as a possible defect. Stale results, unequal comparison conditions and documentation-page styling can also cause it.
_Avoid_: Calling every hard difference a confirmed component defect before checking its cause.

**Soft difference**:
A difference classified by the comparison as expected from the differing fonts.
_Avoid_: Treating any unexplained difference as soft.

**Accepted leftover**:
A known comparison difference retained with an explicit reason.
_Avoid_: Uninvestigated difference or missing measurement as an accepted leftover.
