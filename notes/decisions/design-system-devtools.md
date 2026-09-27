Decided 2026-09-19 by Peter.

# Build a shared inspector using TanStack Devtools

Provide one shared design-system inspector with Lit and React integrations on TanStack Devtools. Peter confirmed the selection after clarification that the surrounding development interface is implemented with Solid.

Solid is an additional dependency of the optional developer tool. The normal production artifacts must exclude the inspector, the TanStack Devtools interface, Solid and its assets. Our component system remains Lit.

The proposed diagnostic scope covers public properties, events, active theme values and component state. The approved tooling inventory now defines the panels/packaging contract and selects read-only operation; instrumentation/source integration still requires implementation verification. No application inspection or remote event transport was implemented in the probe.

Synthetic Lit and React panels mounted, updated and cleaned up in Chrome 153. A Bun production probe excluded all devtools/font output. Packaged font URLs required a scoped build adjustment. These are feasibility results, not certification of the actual inspector or all browser engines.

Evidence: [developer-tooling analysis](../analysis/developer-tooling.md#tanstack-devtools) and [probe record](../alignment/evidence/devtools-probe-2026-09-19.json). Source implementation still requires the approved migration plan.

## Controlled styling input dependency

Peter subsequently selected [helper-managed styling inputs](layout-spacing-properties.md#external-writes-to-helper-managed-settings) that are reapplied on each helper/template render. Direct component-property writes still work immediately, but a later parent render can restore the supplied value. If inspector editing is included, account for this difference between a temporary property edit and a persistent input change. The whole-set approval excludes editing in this pass; no editing bridge, new state owner or bypass of the helper is authorized. Return to the dependency when defining the inspector panels and mutation capabilities.

## Approved read-only scope

Decided 2026-09-20 by Peter through “I approve all proposals.”

Peter's whole-set approval selects read-only properties, events, effective-theme and state diagnostics for this pass. Temporary editing, persistent editing and application-source rewriting are excluded. The approved mounting/disposal, bounded retention, redaction and production-exclusion contract is in the tooling inventory. The controlled-input dependency above remains useful context for any future editing proposal; it is no longer an open choice for this pass.

[Complete approval record](inventory-approval.md), [closed question register](../alignment/proposal-questions.md).

## Scoped TanStack Devtools UI — 2026-09-26

Implemented under Peter's [execution delegation](execution-delegation.md). Use
`@tanstack/devtools-ui` 0.7.1 with Solid 1.9.15 for the optional inspector surface.
The inspected `@tanstack/devtools` 0.14.2 shell always mounts a whole-page source
inspector and exposes SEO/Marketplace destinations without public exclusion
controls. Its UI components let us preserve the approved read-only, explicitly
scoped interface without those additional capabilities or global settings writes.
Lit and React mount the same observer and UI. This refines the integration package;
it does not introduce another component behavior or state implementation.

[Exact source evidence and verification scope](../analysis/developer-tooling.md#m24-inspector-scope-verification--2026-09-26).
