---
id: DEC-152
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: architecture # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: true
  surprising: true
  real-trade-off: true
from: IDEA-003#05 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-042, RES-043, RES-069, RES-072] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-152: A part works at any depth below its root

The Lit core needs one composition architecture before any component is built. Peter decided its contract: a part of a component works at any depth below its root, so a developer can put an own element between two parts. He chose it because React developers expect it and the React reference systems work so, and a user of web components loses nothing.

## Context

- The kickoff prompt asks that every framework wrapper exports a convenience component and every subcomponent that builds it. Peter's reply of 2026-11-13 says the same in his own words: a developer composes the subcomponents "with something custom".
- A prototype built one Steps component in three candidates (IDEA-003, Notes). A: each part asks its root for the state. B: each parent reads its slot. C: one element with all parts in its shadow DOM.
- Peter asked for research on both sides before he chose. RES-072 has the React reference systems, and RES-069 has thirteen libraries of web components. RES-042 has Chakra UI, and RES-043 has the mechanisms of Lit.
- The test for the choice is DEC-149: a user of the Lit version and a user of the React version are not surprised at how the components are built and put together.
- By the placement of DEC-147, the idea phase decides the contract: what a developer can do with the parts. The mechanism inside is spec phase.

## Decision

Peter, 2026-11-20, selected "Yes, it works (Recommended)" in the question dialog, with no condition and no note.

- The question: "A component such as Steps has parts: a root and its items. A developer writes the parts to build a custom version. One case: the developer puts an own <div> around one item, inside the root. Should the item inside that <div> still work?" The question showed the markup: an `<acme-steps>` root, a `<div class="my-row">` inside it, and an `<acme-steps-item>` inside that `<div>`.
- The option: "A part works at any depth below its root. Radix and shadcn/ui work this way, and React developers expect it. Cost: more code in each component, and few web component libraries do it today."

So the contract of the Lit core is: each part that a developer can compose is an element, and it works at any depth below its root. An element of the developer between a part and its parent part breaks nothing.

## Alternatives

- "No, direct children only": a part must sit directly inside its parent part. This is candidate B as a contract. Most surveyed libraries of web components work so for tabs, an accordion and a stepper (RES-069). Its cost, as the option stated it: a wrapper around a part breaks the component, with no error message. The prototype showed that in two cases: a `<div>` of the page author, and a wrapper of a React developer.
- One closed element, candidate C. The dialog of 2026-11-20 did not offer it. The agent's reason, which the question of 2026-11-13 gave him: it cannot export the subcomponents that the prompt asks for, and no surveyed library builds such a component as one element with no part elements (RES-069).

## The reasons and the costs that Peter saw

- Reasons: each React system with public source lets a part read its root at any depth (RES-072, RES-042); react.dev calls a parent that reads its children "uncommon" and "fragile" (RES-072); direct children work as before, so a user of web components loses nothing.
- Costs: more code in each component; the library must handle the load order of the elements; few libraries of web components work this way today. RES-069 found context in production in three of thirteen.

## What this record does not decide

- The mechanism: how a part finds its root, how parts that need an order register with it, and how the library handles the load order with no step of the page author. Context alone does not give any depth; the parts must also register with their root (RES-069). It is the deferred row IDEA-003#23.
- Where the convenience component lives (IDEA-003#06), and which source gives the components their behaviour (IDEA-003#07).
- Which parts each component has, and how fine they are (IDEA-001#09). The two sides differ there: libraries of web components have few, coarse part elements, and React libraries have many fine parts (RES-069).
- The names of the pattern and of its two forms in the glossary (IDEA-003#24, by DEC-148).

## Consequences

- "Any depth" means below the root. It does not remove an ancestor that a part needs: an item of a list still needs its list. The React systems have the same limit (RES-072). The review of the parts names the ancestor that each part needs.
- Candidate A of the prototype met this contract in all eight cases with its repair on, in Chrome only. Candidate B does not meet it. The prototype is in `.artifacts/v1/prototype/IDEA-003-05/`, which is scratch and outside git; IDEA-003, Notes, holds its results.
- Each component with parts needs two tests of this contract: plain markup with an element between two parts, and a React composition with a developer's component between two parts.
- A framework wrapper adds no rule of its own on where a part sits. IDEA-004#02 imports this contract.
- The rows that waited for this decision are free: IDEA-003 rows 06, 07, 11 and 12, IDEA-001#09 and IDEA-004#02.
