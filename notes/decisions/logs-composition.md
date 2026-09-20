Decided 2026-09-19 by Peter.

# Replace Logs with event-log examples

Remove the fixed-schema Logs component. Peter selected “Event-log examples” over a broader reusable Log Viewer. Preserve its useful presentation through Table or Accordion compositions with shared text/status parts.

Current Logs accepts only time, HTTP method, status, host and path. It has no streaming controller, follow/pause, filtering or virtualization. The complete Pro event-log examples demonstrate richer Table and Accordion compositions without making those domain fields a design-system schema.

Distinguish static event history from a live stream. Preserve or deliberately replace the current role=log announcement intent when migrating actual uses; a static table does not automatically provide appropriate live announcements. No broader streaming Log Viewer capability is selected. Exact live-use requirements must return to Peter if discovered.

Evidence: [closure review](../analysis/codebase-systematization.md#phase-2-closure-review), [answers](../alignment/evidence/phase-2-closure-2026-09-19.json).
