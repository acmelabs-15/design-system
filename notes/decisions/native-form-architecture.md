Decided 2026-09-19 by Peter.

# Share native form-control mechanics

Peter selected one shared native form-control module rather than separate family implementations with only small helpers. It owns form association, submission, reset, effective disabled state, validity reporting and restoration. Each control supplies its value conversion and control-specific rules.

A composite control such as Radio Group owns one submitted value; its internal parts must not submit duplicates. Field owns label/help/error associations, not control values or native validity. Optional TanStack Form binds the same control contract rather than creating another independently writable value.

Current controls repeat form callbacks and differ in validity/disabled handling. Existing browser findings establish actual gaps. This supports sharing the lifecycle responsibility; it does not settle whether the best internal callback bridge is a controller, a small base, a mixin or a combination.

Compare actual Lit form-control implementations before finalizing the module's interface, especially cross-shadow labels/focus, native validity, reset/restoration and composite controls. Keep source observations, prior failures and future acceptance distinct. No new form runtime or implementation is approved.

[Native/managed scope](native-and-managed-forms.md), [Field ownership](field-component.md), [review](../alignment/phase-3-review.md#evidence-audit), [answer record](../alignment/evidence/phase-3-checkpoint-2026-09-19.json).
