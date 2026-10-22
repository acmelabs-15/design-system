# Port behaviour into Lit with TanStack Store

Implement the selected controls as Lit components using the existing @tanstack/lit-store state approach. Use Zag's implementations and behaviour tests as source references, porting the needed control logic into our code. Peter explicitly rejected creating a Zag-to-Lit adapter and then rejected carrying Zag's createMachine/state-management mechanism into the Lit implementation.

Decided 2026-09-19 by Peter.

This supersedes the [earlier runtime-package/adapter decision](0115-zag-lit-integration.md) for Pin Input, Number Input, Scroll Area, Steps and resizable panes. Their selected user-facing capabilities remain. Do not run Zag machines, use @zag-js/vanilla or @zag-js/store for these ports, or recreate the Zag interpreter under another name. Pure algorithms and interaction rules can be adapted into ordinary TypeScript and Lit controllers where appropriate.

Use the established per-instance TanStack Store approach and its Lit lifecycle integration. Render with Lit html templates and generate styles through the style pipeline. The React integration wraps the same web components with @lit/react where appropriate; it does not port the behaviour again or introduce a second React state implementation.

Peter explicitly clarified that a port may create a **new Lit component**, rebuild an existing component or replace it outright. It does not have to fit an existing class or public interface. “Existing integration” means the TanStack/Lit state approach, not a requirement to reuse current component implementations. The later [component contracts](../../spec/SPEC-design-system.md) establish responsibilities and shared primitives.

Peter also explicitly requires the **full selected implementation approach**, not just its state package. Use Lit Motion and the selected motion roles for animation, the generator for shipped styles, and all other selected [packages](../development/stack.md) and conventions for forms, placement, dates/numbers, scrolling, focus, icons, events, accessibility and lifecycle cleanup. A port is not an exception to those rules. Adapt upstream behaviour and relevant tests to the Lit implementation; do not copy an upstream state, animation, styling or event framework wholesale. Independent utility reuse still follows the package-selection rules.

## Evidence and trade-off

The renewed check on 2026-09-19 found an official published @zag-js/vanilla 1.44.0, released 2026-09-13. The original premise that there is no vanilla implementation is therefore outdated. No @zag-js/lit package was found in npm at that check; the official Lit PR was an open, unmerged draft. The vanilla implementation uses @zag-js/store for machine state and context, so it does not satisfy Peter's clarified state requirement.

A direct port includes behaviour, lifecycle and accessibility, not merely changing JSX to html templates. We own the port's correctness and future fixes. Keep source-version/provenance and applicable license notices, carry over relevant tests, and correct known upstream defects rather than reproduce them. Existing Lit implementations remain comparison sources when they reveal a better platform-specific technique; they do not change the selected capabilities without review.

The prior Zag bundle measurements are not size estimates for the new ports. The completed migration evaluated per-control source dependencies and feasibility separately. This decision does not remove the separately selected @zag-js/remove-scroll utility or replace other chosen packages. The historical Phase 5 implementation gate is retired; the [release record](../releases/0.3.0.md) records later acceptance and its limits.

Evidence: [implementation-strategy review](../research/16-package-choices.md#native-lit-port-strategy).
