# Share native form-control mechanics

Peter selected one shared native form-control module rather than separate family implementations with only small helpers. It owns form association, submission, reset, effective disabled state, validity reporting and restoration. Each control supplies its value conversion and control-specific rules.

Decided 2026-09-19 by Peter.

A composite control such as Radio Group owns one submitted value; its internal parts must not submit duplicates. Field owns label/help/error associations, not control values or native validity. Optional TanStack Form binds the same control contract rather than creating another independently writable value.

The 2026-09-19 controls repeated form callbacks and differed in validity/disabled handling. The browser findings recorded actual gaps. This supports sharing the lifecycle responsibility; that decision did not settle whether the callback bridge should be a controller, a small base, a mixin or a combination.

The interface investigation covered actual Lit implementations, cross-shadow labels/focus, native validity, reset/restoration and composite controls. Source observations, prior failures and later acceptance remain distinct. This initial architecture decision did not approve a new form runtime or implementation. Later [shared-lifecycle evidence](../verification/systematization/m06-shared-lifetimes-2026-09-21.json) and the [inputs/forms contract](../../spec/SPEC-inputs-forms.md) record the selected bridge and its scope.

[Native/managed scope](0067-native-and-managed-forms.md), [Field ownership](0037-field-component.md), [review](../history/systematization/architecture-review.md#evidence-audit), [answer record](../verification/systematization/phase-3-checkpoint-2026-09-19.json).
