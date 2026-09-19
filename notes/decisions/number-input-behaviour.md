Decided 2026-09-19 by Peter.

# Provide formatted Number Input

Use the [native Lit/TanStack port strategy](zag-behaviour-ports.md), with Zag as a behaviour reference; a new or rebuilt Lit component is allowed. Peter selected the richer control over a browser-defined native number field: formatted numbers, decimal-safe stepping, limits and press-and-hold increment/decrement controls. Peter subsequently selected [@internationalized/number as an independent utility](number-utilities.md), keeping the house implementation and avoiding the rejected Zag machine runtime.

The earlier actual-package/adapter selection is superseded. The port still needs verification for locales, partially entered values, forms, disabled state, keyboard and pointer interaction, and cleanup. Exact properties and defaults belong in the inventory. This is not a tested implementation or permission to change source before Phase 5 approval.

Evidence: [Zag Number Input](https://zagjs.com/components/number-input) and [package comparison](../analysis/package-choices.md).
