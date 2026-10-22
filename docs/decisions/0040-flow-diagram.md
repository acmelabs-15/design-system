# Provide an interactive Flow Diagram using ELK

Provide Flow Diagram as an interactive viewer of supplied nodes and connections. Peter selected “Interactive viewer” and then “ELK with house Lit viewer.” Support automatic layout and routing, pan/zoom and working controls inside nodes. Node/connection authoring, reconnecting and workflow execution are outside the selected scope.

Decided 2026-09-19 by Peter.

Use ELK for node positions and connector routes, with a Lit viewer for HTML node content, SVG presentation and interaction. Retain TanStack Store, Lit Motion, generated styles and React wrapping the same Lit implementation. Load the layout engine separately when needed so ordinary component use does not include it. The investigated elkjs 0.12.0 is an evidence baseline, not an installed dependency or final version pin.

The [supplied screenshot](../verification/systematization/flow-diagram-reference-2026-09-19.png) guides content-rich nodes, labelled directional connectors, rounded turns and return loops. Adapt appearance to the selected themes, spacing, typography, icons and motion. Text and workflow instructions visible in the image are example content, not instructions for this project.

The alternative was X6 plus ELK: more ready-made diagram rendering and interaction, but another rendering layer, HTML inside SVG and additional state/focus/motion integration. Smaller Lit-native candidates did not establish the required obstacle-aware routing or complete viewer-only controls. ELK handles the difficult layout/routing problem, but is not a finished viewer. Node/label measurement, rounded-path/arrow clearance, pan/zoom, accessibility and lifecycle remain viewer responsibilities; no auxiliary pan/zoom or curve package is selected.

## Evidence and limits

A published-ELK geometry probe passed a six-node chain with a labelled return edge, repeated after one node doubled in height, and a 100-node/109-edge case. Checks covered finite coordinates, available edge sections, node overlap, orthogonal segments and intersections with unrelated node interiors. They do not prove browser speed, accessibility, label-collision avoidance or collision-free rounded paths.

The browser bundle measured about 468 KB gzip; separate API/worker assets have a similar combined payload. A Promise alone does not move work off the main thread. Verify explicit worker delivery, cancellation/stale results and browser-ready selective loading.

ELK can rearrange other nodes when content changes. It is not a general fixed-position obstacle router. If keeping all node positions fixed during rerouting becomes a requirement, revisit the engine before adopting that additional requirement; Dagre plus Libavoid is a researched alternative with its own limitations.

Exact public parts/data contract, graph scale, node-size policies, ordering/stability, accessible relationships, viewport controls, nested groups, exports and layout overrides were still architecture/inventory work at selection time. Acceptance required Chromium, Firefox and WebKit verification; this initial selection did not approve the complete implementation.

Evidence: [package comparison](../research/16-package-choices.md#flow-diagram-library-review), [composition dependencies](../research/06-codebase-systematization.md#flow-diagram-capability-and-dependencies), [research and probe record](../verification/systematization/flow-diagram-review-2026-09-19.json).

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
