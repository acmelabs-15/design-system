Decided 2026-09-19 by Peter.

# Support both reading directions

Support left-to-right and right-to-left interfaces for whole pages and individual sections in Lit and React. Peter selected this over limiting the pass to left-to-right support. Cover layout, keyboard behaviour, appropriate icon mirroring and mixed-direction content. Applications supply translated content.

Direction must affect behaviour as well as alignment. Preserve relevant exceptions for media, numbers, URLs and language-specific content; a global visual flip is not the implementation. Existing partial RTL handling is not a verified library-wide contract.

Exact direction propagation, dynamic changes, icon metadata, locale-specific exceptions and per-component keyboard rules remain for the later design reviews. Verify nested directions and actual interaction in Chromium, Firefox and WebKit before claiming complete support.

Evidence: [direction analysis](../analysis/design-foundations.md#right-to-left-support).
