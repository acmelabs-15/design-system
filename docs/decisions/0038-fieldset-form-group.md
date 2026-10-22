# Rebuild Fieldset for form grouping

Keep Fieldset as a distinct form-group component and replace its then-current settings-card implementation. It groups related inputs under a shared label, provides group help/error text and supports group-disabled behaviour. Card supplies an optional visual container around the group. Peter favoured “Rebuild Fieldset” with “I think probably option 1 here,” while requiring recommendations to be checked against existing decisions. This selects the direction, not a finished interface or implementation.

Decided 2026-09-19 by Peter.

The inspected div and Disabled Wall did not establish proper group semantics. Chakra treats Fieldset separately from Card; W3C documents meaningful form grouping; Material Web's Lit controls handle disabled form association through a callback. These are references to compare and adapt, not permission to import their implementation frameworks or copy their behaviour wholesale.

## Compatibility and remaining work

This direction fits [native forms with optional TanStack Form](0067-native-and-managed-forms.md), the established TanStack Store rule, generated styles, Lit Motion where animation applies, and [React around the same Lit components](0081-react-integration.md). Comparing Chakra/Ark or Material does not change the [reference-system and package boundaries](0082-reference-systems.md). No prior capability decision needs reversal based on this review; the then-existing Fieldset implementation needed replacement.

The remaining design work covered shared-state ownership, group labels/help/errors, native form participation across component boundaries, effective versus individually configured disabled state, nested groups and dynamic children. Verify disabling and re-enabling without losing a control's own disabled setting; verify keyboard access, labels, value submission, reset and restoration in the required browsers. Group-invalid and individual-field-invalid states must not be conflated. The capability selection is not browser or assistive-technology proof.

Evidence: [Fieldset research](../research/06-codebase-systematization.md#fieldset-form-grouping-and-compatibility) and [Phase 2 review](../history/systematization/scope-review.md#container-decisions). The initial selection did not approve exact interfaces or implementation.

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
