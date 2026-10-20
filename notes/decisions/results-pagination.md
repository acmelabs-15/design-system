Decided 2026-09-19 by Peter.

# Provide reusable results pagination

Add reusable results pagination for tables and lists. Support numbered and compact navigation, including cases where the total number of pages is unknown. Document page-size and jump-to-page layouts by composing existing controls. Peter selected this over leaving every application to assemble all results pagination itself.

The application owns the current page, page size and data loading. These controls do not add a TanStack Table runtime dependency or process the application's rows. Consumer examples can connect them to TanStack Table or other application state.

Keep results pagination distinct from the existing Previous/Next documentation links with destination titles. This decision approves the capability; final names, element/recipe boundaries, link/button treatment, properties, events, labels and defaults remain for Phases 2–4. Unknown totals must not be represented as a fabricated last page.

Evidence: [pagination research](../analysis/documentation-site.md#results-pagination-capability).

## Review pending after the Chakra UI Pro example

**Resolved 2026-09-20:** the later [whole-set approval](inventory-approval.md) selects the coordinated parts described below. The following paragraph records the original request.

On 2026-09-19 Peter pointed to the event-log example's page-position text, page-size selector and navigation as capabilities that may belong in Pagination itself rather than a custom recipe. Evaluate optional coordinated parts in the Pagination family, reusing shared controls. This requests reconsideration of the earlier recipe boundary, not a final replacement interface. Application-owned page/page-size/data loading, unknown-total support and the absence of a house TanStack Table engine still stand. The [Pro review](../alignment/chakra-pro-review.md) and [follow-up analysis](../analysis/documentation-site.md#chakra-pro-pagination-review) carry the evidence and return point.

## Approved coordinated parts

Decided 2026-09-20 by Peter through “I approve all proposals.”

Peter's whole-set approval selects optional coordinated Pagination Position and Page Size parts in the Pagination family, reusing shared controls. This resolves the Pro-inspired boundary review above and supersedes the earlier page-size-recipe-only boundary. The application still owns page/page size, reset policy and data loading. Unknown totals do not create a fabricated last page. Jump-to-page remains the documented Number Input composition.

[Complete approval record](inventory-approval.md), [closed question register](../alignment/proposal-questions.md).
