# Icons belong to a shared library

Move icons into an icon library. Elements compose that library rather than carrying their own inline glyph boilerplate. This gives the system one place to own icon definitions and their use.

Decided 2026-09-10 by Peter; recorded 2026-09-19 from the systematization plan.

The Phase 1.6 review resolved the public shape and artwork on 2026-09-19: [one element per icon](0046-icon-element-shape.md), using [Material Symbols SVGs](0060-material-symbols-icons.md), with **Rounded, unfilled** as the default. At that checkpoint, exact interfaces, imports and catalog remained open. The later [pinned catalog and delivery decisions](0060-material-symbols-icons.md#pinned-baseline-catalog--2026-09-21) and [actions contract](../../spec/SPEC-actions.md) record their resolution. The [investigation](../research/14-icon-library.md) preserves the alternatives and evidence.
