# Keep native forms and make TanStack Form optional

Controls must work with native HTML forms without a TanStack Form controller. Also provide optional TanStack Form integration for managed values, validation, field metadata, arrays and nested fields, and submission.

Decided 2026-09-19 by Peter.

Peter selected native form support plus optional TanStack Form after requesting evaluation of both. This does not remove the standing TanStack Store rule for component state. The implementation must define ownership and synchronization, rather than maintain independently writable copies.

Native form value, validity, reset, disabled-fieldset and restoration behaviour require real-browser verification. The bindField directive inspected on 2026-09-19 was a starting point, not proof of complete compatibility. The later [inputs/forms contract](../../spec/SPEC-inputs-forms.md) records the selected integration.

Evidence: [Lit practice review](../research/15-lit-practice-review.md#phase-1-extension-react-and-forms).
