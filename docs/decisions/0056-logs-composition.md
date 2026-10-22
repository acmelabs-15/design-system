# Replace Logs with event-log examples

Remove the fixed-schema Logs component. Peter selected “Event-log examples” over a broader reusable Log Viewer. Preserve its useful presentation through Table or Accordion compositions with shared text/status parts.

Decided 2026-09-19 by Peter.

The inspected Logs accepted only time, HTTP method, status, host and path. It had no streaming controller, follow/pause, filtering or virtualization. The complete Pro event-log examples demonstrate richer Table and Accordion compositions without making those domain fields a design-system schema.

Distinguish static event history from a live stream. Preserve or deliberately replace the then-existing role=log announcement intent when migrating actual uses; a static table does not automatically provide appropriate live announcements. No broader streaming Log Viewer capability is selected. Exact live-use requirements must return to Peter if discovered.

Evidence: [closure review](../research/06-codebase-systematization.md#phase-2-closure-review), [answers](../verification/systematization/phase-2-closure-2026-09-19.json).
