Decided 2026-09-19 by Peter.

# Rebuild Fieldset for form grouping

Keep Fieldset as a distinct form-group component and rebuild its current settings-card implementation. It groups related inputs under a shared label, provides group help/error text and supports group-disabled behaviour. Card supplies an optional visual container around the group. Peter favoured “Rebuild Fieldset” with “I think probably option 1 here,” while requiring recommendations to be checked against existing decisions. This selects the direction, not a finished interface or implementation.

The current div and Disabled Wall do not establish proper group semantics. Chakra treats Fieldset separately from Card; W3C documents meaningful form grouping; Material Web's Lit controls handle disabled form association through a callback. These are references to compare and adapt, not permission to import their implementation frameworks or copy their behaviour wholesale.

## Compatibility and remaining work

This direction fits [native forms with optional TanStack Form](native-and-managed-forms.md), the established TanStack Store rule, generated styles, Lit Motion where animation applies, and [React around the same Lit components](react-integration.md). Comparing Chakra/Ark or Material does not change the [reference-system and package boundaries](reference-systems.md). No prior capability decision needs reversal based on this review; the existing Fieldset implementation does need replacement.

Architecture and inventory must resolve shared-state ownership, group labels/help/errors, native form participation across component boundaries, effective versus individually configured disabled state, nested groups and dynamic children. Verify disabling and re-enabling without losing a control's own disabled setting; verify keyboard access, labels, value submission, reset and restoration in the required browsers. Group-invalid and individual-field-invalid states must not be conflated. The capability selection is not browser or assistive-technology proof.

Evidence: [Fieldset research](../analysis/codebase-systematization.md#fieldset-form-grouping-and-compatibility) and [Phase 2 review](../alignment/phase-2-review.md#container-decisions). Exact interfaces and source changes remain behind their existing approval gates.
