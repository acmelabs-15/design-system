# Wrap complete names in multi-line ComboBox options

Long names in multi-line ComboBox options must wrap and remain fully readable. Rows grow to fit the content; fewer rows may fit in the visible list. Peter selected this over shortening names with an ellipsis.

Decided 2026-09-19 by Peter.

The browser probe found content overflow despite padding on both sides. Reducing the content's minimum width alone did not fix the unbroken text. Allowing wrapping removed the measured overflow. This was a behaviour selection; the original probe changed no source or generated style. Later [component contracts](../../spec/SPEC-design-system.md) record the implemented scope.

Evidence: [codebase analysis](../research/06-codebase-systematization.md#phase-1-extension-combobox-overflow) and [probe record](../verification/systematization/additional-probes-2026-09-19.json).
