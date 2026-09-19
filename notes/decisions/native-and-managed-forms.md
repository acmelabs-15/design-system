Decided 2026-09-19 by Peter.

# Keep native forms and make TanStack Form optional

Controls must work with native HTML forms without a TanStack Form controller. Also provide optional TanStack Form integration for managed values, validation, field metadata, arrays and nested fields, and submission.

Peter selected native form support plus optional TanStack Form after requesting evaluation of both. This does not remove the standing TanStack Store rule for component state. The implementation must define ownership and synchronization, rather than maintain independently writable copies.

Native form value, validity, reset, disabled-fieldset and restoration behaviour require real-browser verification. The existing bindField directive is a starting point, not proof of complete compatibility.

Evidence: [Lit practice review](../analysis/lit-practice-review.md#phase-1-extension-react-and-forms).
