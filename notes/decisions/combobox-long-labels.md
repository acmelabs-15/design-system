Decided 2026-09-19 by Peter.

# Wrap complete names in multi-line ComboBox options

Long names in multi-line ComboBox options must wrap and remain fully readable. Rows grow to fit the content; fewer rows may fit in the visible list. Peter selected this over shortening names with an ellipsis.

The browser probe found content overflow despite padding on both sides. Reducing the content's minimum width alone did not fix the unbroken text. Allowing wrapping removed the measured overflow. This is a behaviour decision; no source or generated style was changed.

Evidence: [codebase analysis](../analysis/codebase-systematization.md#phase-1-extension-combobox-overflow) and [probe record](../alignment/evidence/additional-probes-2026-09-19.json).
