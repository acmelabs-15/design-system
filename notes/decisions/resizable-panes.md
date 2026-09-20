Decided 2026-09-19 by Peter.

# Provide resizable panes

Add user-resizable page sections, operated by dragging or keyboard. Peter chose this over layouts that only adapt automatically to window width. Implement them through the [native Lit/TanStack port strategy](zag-behaviour-ports.md), with Zag Splitter as a behaviour reference and React wrapping the same house implementation. A new Lit component is allowed.

The original @zag-js/splitter runtime/adapter choice is superseded. Window Splitter and Web Awesome Split Panel were alternatives in that comparison; neither is newly selected. The port remains unverified. The researched Zag release is 1.44.0, a source baseline rather than a future runtime pin. The following collapse and saving choices remain unchanged.

## Collapse and reopening

Collapse is optional per section. When enabled, a section can close completely and reopen at its previous open size, adjusted to fit current space and size limits. Peter selected restoring the previous size over restoring the application's default size or omitting collapse. Keyboard and pointer controls must give the same result.

## Saving preferences

The consuming application owns saving across page reloads. Expose complete preference state and change events for sizes, collapsed state and previous open sizes, with saving examples. Applications can use browser storage, account settings or no persistence. The component does not write to storage automatically. Peter chose this over optional built-in browser saving. The existing TanStack rule still governs state held inside the component; storage ownership does not replace it.

## Required corrections and verification

The published 1.44.0 connector reports the layout orientation as the separator orientation; side-by-side panes need a vertical separator. Its keyboard-step documentation says pixels, but the inspected sizing path uses percentage points. Correct and verify both before release. The keyboard collapse path also differs from the programmatic restore path; the house integration must deliver the selected previous-size behaviour consistently. No correction was implemented in this research.

Verify dragging, keyboard operation, size constraints, collapse/reopen, focus and hidden content, RTL, nested layouts and disconnect/reconnect in Chromium, Firefox and WebKit. The exact name, public fields, defaults, event payloads, storage example format and responsive restoration rules remain for architecture/inventory/migration review. No source work begins before Phase 5 approval.

Evidence: [pane behaviour](../analysis/design-foundations.md#resizable-panes), [package comparison](../analysis/package-choices.md#resizable-pane-package-comparison), and [probe record](../alignment/evidence/resizable-panes-2026-09-19.json).

## Shadcn composition reference

Peter subsequently requested [shadcn Base Resizable](https://ui.shadcn.com/docs/components/base/resizable) and its use where appropriate in other components/layouts. Inclusion is already covered by this decision. Add its Panel Group/Panel/Handle composition to the comparison, and examine suitable Sidebar, supporting-pane, editor and Scroll Area combinations. This does not make all those surfaces resizable by default.

The inspected wrapper uses react-resizable-panels, even though its documentation route says Base. Keep the selected shared Lit implementation and React wrapper; no separate React engine is adopted. Exact house names, parts and responsive/collapse/focus/scroll combinations remain inventory work. [Follow-up evidence](../analysis/design-foundations.md#shadcn-resizable-follow-up), [request record](../alignment/evidence/disposition-checkpoint-2026-09-19.json).
