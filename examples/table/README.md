# Table consumer examples

The application owns TanStack Table and TanStack Virtual. `acme-table` supplies appearance, a scrolling element and native-content styling. React and Lit each render their own native nodes.

- `lit.ts` and `react.ts`: the complete feature fixture, including grouped headings, selection, sorting/filtering, pinning, resizing, aggregation, spans, a custom review feature and Pagination.
- `grid-interaction.ts`: application-owned keyboard navigation and editor entry. Arrow keys move between cells. Enter opens a cell action. F2 enters its editor. Escape returns to its cell.
- `virtual-lit.ts` and `virtual-react.ts`: element virtualizers for both axes. The vertical recipe uses unmerged, independently measured rows. The horizontal recipe keeps native spans. Both preserve direct refs and logical row/column counts.
- `worker-session.ts`, `worker-lit.ts`, `worker-react.ts`, `table-worker.ts`: an application-owned experimental worker, failure/retry, manual server results and explicit cleanup. Compile the worker as a separate browser entry. Keep its URL relative to the application entry. Dispose the session when its owning application root is removed.

The compatibility baseline is Table 9.2.4 and Virtual 3.14.0. The combined custom-feature/experimental-worker type check uses the repository's two-line declaration patch for Table 9.2.4. Runtime JavaScript is unchanged. The patch makes both extension points augment the public type module. Remove it only after the combined type check passes against an upstream release.

The fixture intentionally registers every Table feature to test compatibility. Production applications should register only the features they use. Known totals and source data remain application-owned. These examples do not promise compatibility with every future release or every untested combination.
