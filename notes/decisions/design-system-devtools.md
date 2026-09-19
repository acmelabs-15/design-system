Decided 2026-09-19 by Peter.

# Build a shared inspector using TanStack Devtools

Provide one shared design-system inspector with Lit and React integrations on TanStack Devtools. Peter confirmed the selection after clarification that the surrounding development interface is implemented with Solid.

Solid is an additional dependency of the optional developer tool. The normal production artifacts must exclude the inspector, the TanStack Devtools interface, Solid and its assets. Our component system remains Lit.

The proposed diagnostic scope covers public properties, events, active theme values and component state. Exact panels, read-only versus editing capabilities, instrumentation, source navigation and packaging remain for later design. No application inspection or remote event transport was implemented in the probe.

Synthetic Lit and React panels mounted, updated and cleaned up in Chrome 153. A Bun production probe excluded all devtools/font output. Packaged font URLs required a scoped build adjustment. These are feasibility results, not certification of the actual inspector or all browser engines.

Evidence: [developer-tooling analysis](../analysis/developer-tooling.md#tanstack-devtools) and [probe record](../alignment/evidence/devtools-probe-2026-09-19.json). Source implementation still requires the approved migration plan.
