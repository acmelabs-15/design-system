# Support discovered and explicit TOC entries

Provide TOC with both heading discovery from a specified content section and an explicit list of entries for curated navigation. Peter answered “I think it should support both” to the heading-source question.

Decided 2026-09-19 by Peter.

TOC uses real links to heading targets and tracks the current section for its line indicator. Current location remains distinct from form selection. The Pro toc-line/minimal/numbers/mobile examples provide visual and composition evidence; their click-only anchors and observer bookkeeping are not the selected implementation.

The later approved [TOC contract](../../spec/SPEC-navigation-disclosure.md#n-04-table-of-contents) defines precedence, levels, authored IDs, source/scroll-root and offset behavior. The original capability answer alone did not select those details; they are now covered by whole-set approval. Runtime discovery, fragment/focus behavior and any visual indicator reuse require the contract's verification. The [release record](../releases/0.3.0.md) records later acceptance and its limits.

The [primitive semantics probe](../verification/systematization/primitive-interfaces-review-2026-09-20.json) confirms that a document-level h1–h6 query does not discover headings inside shadow roots, although Chromium exposes their heading semantics. The approved TOC contract includes Heading discovery and public target IDs/focus. This is a dependency finding, not a selected traversal mechanism or a new default mode.

Evidence: [TOC research](../research/06-codebase-systematization.md#toc-and-current-location), [choice record](../verification/systematization/capability-checkpoint-2026-09-19.json). The historical Phase 4/5 gates are retired.

## Approved target ownership

Decided 2026-09-20 by Peter through “I approve all proposals.”

Peter's whole-set approval selects stable authored heading IDs. Discovery reports and omits missing targets rather than generating IDs on author content. Explicit items take precedence when supplied; otherwise discover within the supplied source. The owning Markdown renderer may generate IDs for its own output; that is distinct from TOC mutating someone else's headings. Preserve the approved native heading and Heading discovery and real-link requirements, with accessibility/fragment verification still required.

[Complete approval record](0049-inventory-approval.md), [closed question register](../design/systematization-decisions.md).
