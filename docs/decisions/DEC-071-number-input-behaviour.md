---
id: DEC-071
migrated: 0.8
kind: architecture
decided: 2026-10-21
---
# Provide formatted Number Input

Use the [native Lit/TanStack port strategy](DEC-114-zag-behaviour-ports.md), with Zag as a behaviour reference; a new or rebuilt Lit component is allowed. Peter selected the richer control over a browser-defined native number field: formatted numbers, decimal-safe stepping, limits and press-and-hold increment/decrement controls. Peter subsequently selected [@internationalized/number as an independent utility](DEC-072-number-utilities.md), keeping the Lit implementation and avoiding the rejected Zag machine runtime.

Decided 2026-09-19 by Peter.

The earlier actual-package/adapter selection is superseded. At the 2026-09-19 decision, the port still needed verification for locales, partially entered values, forms, disabled state, keyboard and pointer interaction, and cleanup. The decision was not tested implementation evidence. The later [inputs/forms contract](../../specs/SPEC-006-inputs-forms/spec.md) records exact properties and defaults; the [release record](../releases/0.3.0.md) records verification. The historical Phase 5 gate is retired.

Evidence: [Zag Number Input](https://zagjs.com/components/number-input) and [package comparison](../research/RES-016-package-choices.md).
