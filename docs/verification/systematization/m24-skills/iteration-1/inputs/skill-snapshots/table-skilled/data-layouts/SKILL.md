---
name: data-layouts
description: Build data interfaces with @acmelabs/design-system Table, Pagination, Tree, cards, lists, charts and responsive layouts. Use when integrating TanStack Table or Virtual, composing results controls, or choosing data presentation semantics.
license: MIT
metadata:
  library: "@acmelabs/design-system"
  library_version: "0.2.0"
  type: "sub-skill"
---

# Data layouts

1. Match [release facts](../references/release.json). Read the selected component and data recipe records for the actual framework.
2. Keep Table as native table structure and presentation. The application can use TanStack Table for filtering, sorting, selection, grouping, expansion, pinning or other data behavior. Bind its output through the complete consumer recipe; the component does not contain that engine.
3. Use TanStack Virtual for virtualized Lit and React consumers. Follow the recipe for measurements, overscan, scroll ownership and teardown. Preserve semantic rows/cells and the correct total/count information.
4. Compose optional Pagination parts for page selection, page size and result summaries. Preserve the event payload distinction and one application data owner. Documentation Previous/Next links are navigation, not results Pagination.
5. Choose native List/Data List for their semantics, Item for rich content rows, Card for surfaces, and Tree for hierarchical navigation. Single-choice or multiple-choice cards keep Radio Group or Checkbox Group behavior when arranged by Group.
6. Use Stack/HStack/VStack for ordinary arrangement. Use Group when attachment, seams or common outer decoration are needed. Responsive list/detail and supporting-pane layouts follow their recipe and the design system's own breakpoint tokens.
7. Keep heavy chart/layout/worker code behind its documented imports. Check large data, empty results, changed data, keyboard focus, resizing and cleanup with real consumer behavior.

Do not add a second table, selection, focus or pagination state owner merely to connect a visual component.
