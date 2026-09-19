Decided 2026-09-10 by Peter; recorded 2026-09-19 from the systematization plan.

# Icons belong to a shared library

Move icons into an icon library. Elements compose that library rather than carrying their own inline glyph boilerplate. This gives the system one place to own icon definitions and their use.

The Phase 1.6 review resolved the public shape and artwork on 2026-09-19: [one element per icon](icon-element-shape.md), using [Material Symbols SVGs](material-symbols-icons.md), with **Rounded, unfilled** as the default. Exact interfaces, imports and catalog remain open. The [investigation](../analysis/icon-library.md) preserves the alternatives and evidence.
