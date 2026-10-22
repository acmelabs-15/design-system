# Support both reading directions

Support left-to-right and right-to-left interfaces for whole pages and individual sections in Lit and React. Peter selected this over limiting the pass to left-to-right support. Cover layout, keyboard behaviour, appropriate icon mirroring and mixed-direction content. Applications supply translated content.

Decided 2026-09-19 by Peter.

Direction must affect behaviour as well as alignment. Preserve relevant exceptions for media, numbers, URLs and language-specific content; a global visual flip is not the implementation. The partial RTL handling inspected at selection time was not a verified library-wide contract.

Exact direction propagation, dynamic changes, icon metadata, locale-specific exceptions and per-component keyboard rules were left for later design reviews. Verify nested directions and actual interaction in Chromium, Firefox and WebKit before claiming complete support.

Evidence: [direction analysis](../research/07-design-foundations.md#right-to-left-support).

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
