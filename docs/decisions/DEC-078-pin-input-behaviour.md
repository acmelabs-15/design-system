---
id: DEC-078
migrated: 0.8
kind: architecture
decided: 2026-10-21
---
# Provide a separate-field Pin Input

Implement Pin Input through the [native Lit/TanStack port strategy](DEC-114-zag-behaviour-ports.md), using Zag behaviour as a source reference. A new Lit component is allowed. Peter selected separate character fields with automatic focus movement, full-code paste, masking and code-autofill support, rather than limiting the control to one native text field.

Decided 2026-09-19 by Peter.

The earlier actual-package/adapter selection is superseded; the capability choice stands. At the 2026-09-19 decision, port and browser acceptance were unproven, and the capability choice did not approve implementation. The later [inputs/forms contract](../../specs/SPEC-006-inputs-forms/spec.md) defines the interface and defaults; the [release record](../releases/0.3.0.md) records verification with its own limits.

Evidence: [Zag Pin Input](https://zagjs.com/components/pin-input) and [package comparison](../research/RES-016-package-choices.md).
