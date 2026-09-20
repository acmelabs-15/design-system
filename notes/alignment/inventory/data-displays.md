# Tables, pagination, charts and diagrams — R11

**Approved 2026-09-20 by Peter as part of the full proposal set.** The stated recommendations are selected. Technical verification remains required; implementation awaits the Phase 5 migration plan. [Approval](../../decisions/inventory-approval.md).

**Approved family contract.** Data processing stays with the application. Keep the [selected TanStack Table boundary](../../decisions/tanstack-table-compatibility.md), TanStack Virtual in both frameworks, TanStack Charts and [ELK viewer scope](../../decisions/flow-diagram.md). This page supplies concrete interfaces and acceptance, not a claim of verified compatibility.

## D-01 Table

**Root:** acme-table; React Table wraps that same Lit container. Props variant: default|striped|bordered=default; size small|medium|large=medium; stickyHeader=false; loading=false. Shared theme/density/RTL apply. No rows, columns, sort, selected-index array, filter or table instance is owned by the root.

**Content:** one author-owned native table with caption/colgroup/thead/tbody/tfoot/tr/th/td inside the root's default slot. Native tags are the table parts; do not insert custom row/cell wrappers that break native table structure. Generated, scoped document CSS styles those native parts, with explicit delivery alongside the root's shadow styles. Root parts root/viewport; native hooks data-acme-table-part and state attributes identify header/body/footer/row/cell without private shadow queries.

**Methods:** getScrollElement(): HTMLElement; getTableElement(): HTMLTableElement|null. The application keeps direct refs to every native header/row/cell/resize handle, can measure them and set standard span/ARIA attributes. Public CSS hooks cover column width, sticky inline/block offsets, row height and virtual spacers. Consumer inline measurements are CSS variables/explicit styles, not a second generated design-token source. Do not hide needed measurements behind closed wrappers.

**State/events:** loading controls busy presentation only; application renders skeleton/error/empty content and data. Row/cell selection/current/sort state is expressed through standard ARIA and documented styling attributes. Native clicks/keys/pointers reach the application's handlers; no fabricated acme-row/acme-select duplicate. Table does not infer row identity from visual index or run worker recovery.

### Complete consumer capability contract

| Capability | Table must permit | Acceptance oracle |
| --- | --- | --- |
| Cell selection | Direct cell identity/refs, selected/focused/range-edge styles and keyboard/pointer handlers | Consumer selects a range after reorder/virtual scroll; announcement/focus tracks the logical cell |
| Cell spanning | Native colspan/rowspan and omission of covered cells; virtual layout can set corresponding grid spans | Headers/body remain aligned; no duplicate accessible covered cells |
| Column faceting | Application-defined filter controls and count content | Counts supplied by consumer remain unchanged by the design system |
| Column filtering | Arbitrary filter UI outside/inside headers | Manual server results are not refiltered locally |
| Global filtering | External search/filter state | Updated supplied rows render without an internal search state |
| Column grouping | Multiple header levels, colSpan/rowSpan and placeholder cells | Group headers align after visibility/reorder changes |
| Row aggregation | Custom summary/group/footer markup | Consumer-calculated summaries and empty groups display correctly |
| Column ordering | Framework-owned native order and stable keys | Header/body/footer all reflect the new order and preserve focus |
| Column pinning | Logical sticky offsets and backgrounds/layers | Start/end pins work with RTL, scrolling and resized columns |
| Column resizing | Accessible native handles and live width updates | Pointer/keyboard changes update all sections without losing events |
| Column sizing | Fixed/min/max widths and explicit table layout | Intrinsic long content and constrained widths behave predictably |
| Column visibility | Author omission plus logical column indices | Hidden columns leave correct counts/spans and no stale focus target |
| Row expanding | Arbitrary detail/group rows with correct spans | Expanded content retains controls/state under both pagination policies |
| Row pagination | Supplied current-page data and separate Pagination | Known/unknown/manual page modes work without data slicing by Table |
| Row pinning | Native/styled pinned rows and logical offsets | Pinning combines with selection/expansion and scrolling |
| Row selection | Checkbox/Radio composition, stable IDs and selected styling | Select/filter/page/reorder retains consumer-owned selected IDs |
| Sorting | Header Button/Icon Button, aria-sort and arbitrary sort indicators | Multi/single/manual sorting remains consumer-owned and correctly announced |

Custom features must work through the same native content/events/styles. Experimental worker data can show pending/error/recovery states; the application owns worker lifecycle. No universal future-version compatibility promise is made.

### Virtualization and framework ownership

Applications connect TanStack Virtual to getScrollElement() and native measurement refs. Lit renders Lit rows/cells; React renders React rows/cells directly. A React renderer is not passed through TanStack's Lit renderer. Table contributes scrolling/appearance/measurement access, not another virtualizer instance.

Vertical, horizontal and combined virtualization need finite layout sizes, row/column counts, aria-rowindex/colindex and focus restoration for offscreen logical cells. Native table versus CSS grid geometry is an explicit consumer layout recipe using the same semantic nodes; browser/assistive-tech checks must establish that CSS changes preserve meaning. Do not claim cell spans/pinned rows work merely because a minimal virtual list passed.

**Required combination tests:** ordering+visibility+grouped headers; resizing+pinning+RTL; selection+pagination+filtering; expansion+virtualization+dynamic heights; spanning+pinned/virtual columns; custom feature+sorting/filtering; worker pending/error+manual data. All in Chromium/Firefox/WebKit, Lit/React, packaged imports. [Research checklist](../../analysis/codebase-systematization.md#capability-checklist-for-later-acceptance).

## D-02 Results Pagination

Proposed family acme-pagination, acme-pagination-previous, acme-pagination-next, acme-pagination-item, acme-pagination-ellipsis, acme-pagination-position, acme-pagination-page-size. Root page=1, pageSize=10, count?: nonnegative integer, hasNextPage?: boolean for unknown totals, loading=false, disabled=false, variant: numbered|compact=numbered. The application owns these inputs and data loading. No local Table import or automatic page reset after filters.

Items carry page: positive integer and optional href; previous/next can render real anchors from an application-provided URL mapping or native buttons for local actions. Never invent a last page when count absent. acme-request { action:"page", page } or { action:"page-size", pageSize } requests changes; root does not silently fetch, slice data or change application state. Proposed page-size options default [10,25,50] only when that optional part is included.

Position reads root context and renders known "page x of y" or unknown-total text without a fake y. Page-size part reuses Select and an associated label. Jump-to-page remains a Number Input recipe. Root/default slot composes optional parts; parts root/navigation/item/position/page-size. Navigation uses labelled nav and aria-current=page; ellipsis is non-action content.

Q15 is closed: Position and Page Size are optional coordinated public parts of Pagination. Both keep application-owned reset/loading. The complete Pro event-log source supports the design; Peter's whole-set approval resolves the earlier boundary revision.

Acceptance: zero/one/many results, out-of-range supplied page, unknown totals, explicit next availability, loading/failure/retry, changed sizes/filters, URL actions, focus and localization. [Decision and pending revision](../../decisions/results-pagination.md), [complete Pro comparison](../../analysis/documentation-site.md#chakra-pro-pagination-review).

## D-03 Chart

acme-chart props type: line|bar|area=line; data: readonly `Record<string,unknown>`[]=[], x="x", series: readonly { key, label, color?, formatter? }[] (empty means no plotted series); height: CSS dimension="180px" baseline; points=false; grid=true; tooltip=true; label required. The application owns data and transforms. Use TanStack Charts and shared state; no alternative plotting package.

Slots header/legend/tooltip/empty; parts root/plot/axes/grid/tooltip. Tooltip content is author-owned and safe; axis/value formatting follows supplied formatters/locale. acme-request { action:"point", seriesKey, index } only when a documented interaction is enabled; a static chart is not an automatic selection control.

Keyboard/accessible summary and data alternative are required. Loading/empty/error/zero datasets remain distinct. Gaps/missing data are not zeros. Multiple series, numerical/time/category axes and combined interactions must use supported installed package APIs; extensions beyond the reviewed three types require new evidence. Retain house visual baseline and explicit shadow/tooltip rules.

## D-04 Sparkline and Legend

acme-sparkline props values: readonly number[]=[], label="", direction?: up|down|flat; sentiment: positive|negative|neutral=neutral proposed. root/line/fill parts; no axes/actions by default. Use the same chart/formatting primitives as Chart; a missing/nonfinite value creates a documented gap, not silent zero. Remove Spark name. An accessible label/summary is required unless decorative inside an already named Stat.

acme-legend contains acme-legend-item; root orientation horizontal|vertical=horizontal, item value:string required, label="", color?:CSS color, hidden=false. Default item content; root/item/swatch/label parts. Passive by default. An interactive legend is composed from Checkbox/Toggle Button and emits those controls' events; Legend does not create a second series-selection store. Data links to Chart remain application-owned.

Acceptance: multiple/empty series, colors versus labels, line direction independent of favorable meaning, keyboard alternatives, contrast and resizing. Current Chart/Spark/Legend declarations and [Stat decision](../../decisions/stat-family.md) are the local baseline.

## D-05 Flow Diagram

Family acme-flow-diagram and acme-flow-node. Root nodes: readonly { id:string, label:string, ports?:readonly {id,side?:start|end|top|bottom}[], width?:number,height?:number }[]=[], edges: readonly { id:string, source:string, target:string, sourcePort?:string,targetPort?:string,label?:string }[]=[], direction: right|down=right, zoom=1, minZoom=.25, maxZoom=2, fitOnLoad=true. Dimensions/zoom are explicit viewer units, not theme size tokens.

Node part nodeId required, default slot holds author-owned HTML/Lit/React content; data label is the safe fallback when no node content is supplied. Root owns measured geometry and ELK results, not application controls inside nodes. Edges use SVG paths/arrowheads and labels with house tokens; rounded corners respect clearance and do not cut through unrelated nodes. No new editing, drag-node, reconnect, execution or persistence behavior.

Methods fit(), zoomTo(scale), panTo({x,y}), layout(): `Promise<void>`. Events acme-change { viewport:{x,y,zoom} } for user pan/zoom, acme-request { action:"node", id } for explicit node activation, acme-error { code:"layout",message }. Internal form controls retain their own focus/keyboard/pointer events; pan begins only on the intended background gesture. Keyboard buttons offer accessible fit/zoom controls; diagram relationships have a structured text/list alternative.

ELK loads separately with explicit worker asset delivery and cancellation/stale-result rejection. Promise wrapping on the main thread is insufficient. Resize/font/content changes trigger bounded relayout; keyed node content is not remounted just to move it. The selected engine can move other nodes on relayout; fixed-position rerouting is not promised and would reopen package evaluation.

Validate unique IDs/ports/references, finite geometry, empty/disconnected/cyclic graphs, parallel/back edges and labels. Initial package research covered a 100-node case, not a general performance budget. Q16 is engineering-owned: retain the recorded small/100-node fixtures, add a larger stress case, measure responsiveness and report tested sizes rather than inventing a capability guarantee or making Peter choose a graph limit.

Parts root/viewport/background/node/edge/edge-label/controls; no raw SVG/ELK mutation API exposed as public state. No auxiliary pan/zoom/curve package is selected. Source [ELK decision/probe](../../decisions/flow-diagram.md) and supplied screenshot determine viewer scope; the user image's workflow text is sample content.

## Complete consumer example shape

```html
<acme-table aria-label="Deliveries">
  <table>
    <caption>Recent deliveries</caption>
    <thead><tr><th scope="col">Endpoint</th><th scope="col">Status</th></tr></thead>
    <tbody><tr><td>Order created</td><td>Delivered</td></tr></tbody>
  </table>
</acme-table>
<acme-pagination page="1" page-size="10" count="42">
  <acme-pagination-position></acme-pagination-position>
  <acme-pagination-previous></acme-pagination-previous>
  <acme-pagination-next></acme-pagination-next>
  <acme-pagination-page-size></acme-pagination-page-size>
</acme-pagination>
```

The runnable Lit/React acceptance examples create their own TanStack Table/Virtual instances and render native table content. Static HTML needs neither package for ordinary content. The code above is a proposal illustration; the current package does not implement these new contracts.
