# Add a shared Field component

Add a standalone Field component that connects one logical control to its label, helper text and error text. Support required and optional presentation, with vertical and horizontal arrangements. Peter selected “Add Field” in the shared Field decision question after asking us to evaluate Chakra Field and how Radix handles the same work.

Decided 2026-09-19 by Peter.

Field gives controls a consistent surrounding structure and accessible associations. It does not own their values or replace their native validity. Controls retain those responsibilities under the [native forms with optional TanStack Form decision](0067-native-and-managed-forms.md). Field must work without a TanStack Form controller. [Fieldset](0038-fieldset-form-group.md) remains distinct: it groups related controls under a shared label, which does not replace their individual labels.

Chakra Field and Radix Form.Field supply evidence for these shared associations. Radix TextField instead supplies an input and its visual container. These references do not prove compatibility with custom controls or shadow DOM. Verify labels, descriptions, error updates, required state, effective disabled state and focus in the required browsers and assistive technologies.

Exact parts, slots, properties, events and control-registration rules were still to be specified. This initial selection did not remove Input label or error properties; their replacement belonged to the later approved migration. Item's composition and Setting Row were separate review subjects. The initial review changed no source code.

The subsequent [focused Item decision](0050-item-content-family.md) settles the separate descriptive-content family. It does not transfer Field's associations or settle Setting Row and companion migrations.

Evidence: [Field and List composition review](../research/06-codebase-systematization.md#field-and-list-composition-review) and [source review record](../verification/systematization/field-list-review-2026-09-19.json).

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
