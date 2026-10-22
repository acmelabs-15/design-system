# Elements earn their place through capability

Build the library from a small set of reusable primitives. The original test was that an element earns its place through capability an arrangement cannot provide, with fixed arrangements becoming documented recipes. The accepted qualification below also recognizes the value of a consistent named structure. Recipes have a pattern page and, where page-level, a `dashboard.css` recipe.

Decided 2026-09-10 by Peter; recorded 2026-09-19 from the systematization plan.

Each inventory entry states what it composes and what composes it. Capabilities required by several arrangements belong in their shared primitive when that is the correct design. The goal is a coherent system with less duplicated behaviour; a smaller element count alone is not proof of success.

This continues the composition decisions for the [copy button](0016-compose-the-copy-button.md) and [language switcher](0017-compose-the-language-switcher.md). The component inventory subsequently defined the concrete interfaces.

## Qualification accepted on 2026-09-19

Peter selected [Feedback as a component plus examples](0036-feedback-component.md) and accepted [keeping Empty State built from shared parts](0032-empty-state-component.md). A consistent named structure and common form experience can justify a component even when its parts can be composed. The earlier recipe-only recommendations applied the original rule too mechanically.

These are explicit retention decisions, not a blanket exemption for existing arrangements. Continue to assess each element's purpose, interface consistency, reusable behaviour and maintenance cost. Share the underlying primitives; use recipes for useful arrangements without a separately justified component. Detailed interfaces were not settled by this principle.

The unresolved implementation details above describe the selection-time scope. Later [component contracts](../../spec/SPEC-design-system.md) and [release evidence](../releases/0.3.2.md) record subsequent work and its verification limits.
