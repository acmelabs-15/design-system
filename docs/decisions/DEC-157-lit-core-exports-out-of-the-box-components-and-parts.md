---
id: DEC-157
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: architecture # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: true
  surprising: true
  real-trade-off: true
from: IDEA-003#06 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-081, RES-069, RES-072, RES-042] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-157: The Lit core exports the out-of-the-box component beside its granular parts

A component of 1.0 has granular parts that a developer composes (DEC-152). Peter decided where the out-of-the-box component lives, the one that most people use when they need no customization: the Lit core exports both, the granular parts and the out-of-the-box component. His reason: developers of web components expect one element for a component, and with both in the core they "can use the components like they'd expect to".

## Context

- The kickoff prompt asks that every framework wrapper exports a convenience component, such as `Stepper`, and every subcomponent that builds it, such as `Stepper.Root`. It named Chakra UI as the model. RES-042 found that the package of Chakra UI holds only the parts, and that its tool copies the other form into the consumer's project.
- The agent first told Peter that no system ships both from one package. That statement held only for the five reference systems of RES-072 and the thirteen libraries of web components of RES-069. Peter doubted it and asked for research.
- RES-081 surveyed 37 design systems. 24 offer at least one component concept both ways from one package, and none has out-of-the-box components only. Mantine is the clearest case: `Modal` with props, and `Modal.Root`, `Modal.Header` and `Modal.Body` on the same export, with the simple one built on the parts. Peter: "I really like" this design.
- Among libraries of web components the picture is the reverse of React. Most export one element for a component, with slots and CSS parts, and they have no granular parts, not even inside. The dialog of Web Awesome is one template of plain HTML. So a developer of web components expects the out-of-the-box element, and a React developer expects the parts.
- The test is DEC-149: a user of the Lit version and a user of the React version are not surprised at how the components are built and put together.

## Decision

Peter, 2026-11-20, typed into the question dialog, to the question "Does the Lit core also hold the out-of-the-box components?": "you've just told me that the out-of-the-box component is what webomponent devs are expecting - so yes I think it makes sense to export both the out-of-the-box component so webcomponent devs can use the components like they'd expect to." IDEA-003, Notes, "Row 06 — resolved" holds his reply in full.

So the Lit core holds the part elements and, composed from them, the out-of-the-box elements. Each framework package wraps both, and the kickoff prompt gives the shape of that export: the out-of-the-box component and its parts under one name.

His view on the parts, from the reply before: "the most important thing for the lit core package to provide are the highly composable granual component parts", because each framework package needs them.

## Alternatives

- Only the parts in the Lit core, and each framework package composes its own out-of-the-box components. The costs that the question stated: each one is written once for each framework, and a plain HTML page must write every part.
- Parts only, as Base UI, React Aria Components and PrimeReact 11 do, with documentation on how to wrap them. Its cost is more code for most users, which Peter wants to avoid: "for ppl who don't want to write a shit load of boilerplate".
- The out-of-the-box form as code that the consumer copies, as Chakra UI and shadcn/ui do. Peter's view was that it exports from the same package as the parts.

## What this record does not decide

- Which components get an out-of-the-box component. In every surveyed system that differs by component. The review of the parts (IDEA-001#09) decides it for each component.
- The names of the two things in the glossary (IDEA-003#24). No source gives one standard name.
- The mechanism: how an out-of-the-box element uses the part elements in its template, and how the parts find their root (deferred row IDEA-003#23).

## Consequences

- The stated cost: more elements in the core to design, test and document. A component with both has two public forms that must stay in step.
- Almost no library of web components is a model for both forms across many components. Web Awesome has the pair for Toast only, and Carbon Web Components for about four concepts. The models are React and Vue libraries, Mantine first.
- A plain HTML page, and a page that an AI agent writes with no build step, gets the short form (DEC-119).
- One anatomy for each component, which its design spec in Figma defines, names three things: the part elements, the CSS parts of the out-of-the-box element, and its slots. This is the agent's reading of Peter's reply, for the spec to confirm.
- A framework package wraps elements only. It composes no out-of-the-box component of its own. This bears on IDEA-004#05.
