Decided 2026-09-19 by Peter.

# Support discovered and explicit TOC entries

Provide TOC with both heading discovery from a specified content section and an explicit list of entries for curated navigation. Peter answered “I think it should support both” to the heading-source question.

TOC uses real links to heading targets and tracks the current section for its line indicator. Current location remains distinct from form selection. The Pro toc-line/minimal/numbers/mobile examples provide visual and composition evidence; their click-only anchors and observer bookkeeping are not the house implementation.

The later approved [TOC contract](../alignment/inventory/navigation-disclosure.md#n-04-table-of-contents) defines precedence, levels, authored IDs, source/scroll-root and offset behavior. The original capability answer alone did not select those details; they are now covered by whole-set approval. Runtime discovery, fragment/focus behavior and any visual indicator reuse still need their assigned verification.

The [primitive semantics probe](../alignment/evidence/primitive-interfaces-review-2026-09-20.json) confirms that a document-level h1–h6 query does not discover headings inside shadow roots, although Chromium exposes their heading semantics. Bring Heading discovery and public target IDs/focus into the TOC inventory contract before approval. This is a dependency finding, not a selected traversal mechanism or a new default mode.

Evidence: [TOC research](../analysis/codebase-systematization.md#toc-and-current-location), [choice record](../alignment/evidence/capability-checkpoint-2026-09-19.json). Exact interfaces and source changes retain the Phase 4/5 gates.

## Approved target ownership

Decided 2026-09-20 by Peter through “I approve all proposals.”

Peter's whole-set approval selects stable authored heading IDs. Discovery reports and omits missing targets rather than generating IDs on author content. Explicit items take precedence when supplied; otherwise discover within the supplied source. The owning Markdown renderer may generate IDs for its own output; that is distinct from TOC mutating someone else's headings. Preserve the approved native/house Heading discovery and real-link requirements, with accessibility/fragment verification still required.

[Complete approval record](inventory-approval.md), [closed question register](../alignment/proposal-questions.md).
