# Domain documentation

This repository has two linked contexts. Packages share those contexts; package count does not create more glossaries.

Before naming a domain concept, read [the context map](../../CONTEXT-MAP.md) and the glossary it selects:

- [Component library](../../CONTEXT.md): components, primitives, recipes, content and interaction names.
- [Generation and comparison tools](../../tools/geist/CONTEXT.md): reference descriptions, generated styles and measured comparisons.

Shared component terms are defined once in the component glossary. Tooling records refer to them there. Use the glossary's term and respect its words to avoid. A missing or unclear concept goes through brain:domain-modeling; implementation details belong in specifications or research.

Use component names directly. Every component belongs to the same design system. Explain a material Lit or platform trade-off when the task needs it.

## Decisions and requirements

[Numbered decision records](../decisions/README.md) serve both contexts. Read the records relevant to the changed area in full. Keep their original dates, authors, evidence and supersession relationships. A short record can be a title and a few sentences; add sections when they preserve useful reasons or qualifications.

The [specification index](../../spec/README.md) routes current requirements. A code difference does not silently change an approved contract. Identify the conflict and use brain's applicable decision workflow.

The [research index](../research/README.md) separates source observations, experiments, proposals and selected outcomes. Historical counts and a passing prototype prove only their recorded scope.
