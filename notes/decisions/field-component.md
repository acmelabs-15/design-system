Decided 2026-09-19 by Peter.

# Add a shared Field component

Add a standalone Field component that connects one logical control to its label, helper text and error text. Support required and optional presentation, with vertical and horizontal arrangements. Peter selected “Add Field” in the shared Field decision question after asking us to evaluate Chakra Field and how Radix handles the same work.

Field gives controls a consistent surrounding structure and accessible associations. It does not own their values or replace their native validity. Controls retain those responsibilities under the [native forms with optional TanStack Form decision](native-and-managed-forms.md). Field must work without a TanStack Form controller. [Fieldset](fieldset-form-group.md) remains distinct: it groups related controls under a shared label, which does not replace their individual labels.

Chakra Field and Radix Form.Field supply evidence for these shared associations. Radix TextField instead supplies an input and its visual container. These references do not prove compatibility with house custom controls or shadow DOM. Verify labels, descriptions, error updates, required state, effective disabled state and focus in the required browsers and assistive technologies.

Exact parts, slots, properties, events and control-registration rules remain for architecture and the Phase 4 inventory. This decision does not remove existing Input label or error properties. Their replacement and the full migration require the Phase 5 plan and approval. Item's exact composition and Setting Row remain separate review subjects. Source code is unchanged.

The subsequent [focused Item decision](item-content-family.md) settles the separate descriptive-content family. It does not transfer Field's associations or settle Setting Row and companion migrations.

Evidence: [Field and List composition review](../analysis/codebase-systematization.md#field-and-list-composition-review) and [source review record](../alignment/evidence/field-list-review-2026-09-19.json).
