---
id: DEC-129
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-001#04 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-032, RES-035, RES-037] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-129: A concept outside the matrix enters case by case; the catalogs are recipes

The comparison matrix (RES-037) holds 182 concepts from the component pages of the five reference systems, and it leaves out the catalogs that two systems have beside their components: AI Elements, Blocks and Charts of shadcn/ui, and Charts of Chakra UI. Peter decided two things. A concept that no reference system has can enter the 1.0 list, case by case. The catalogs are recipes, not components of the design system, so they do not enter the list as a group.

## Peter's words

"I'm open to a concept potentially being allowed to enter the list I do not want to include all of the blocks and charts and stuff that these components have those are really specifically for like those are really representative representative of recipes not design system components".

## Considered options

- Any concept that an audience needs can enter, each with Peter's approval. Peter took this option for single concepts.
- The five systems with their catalogs: a concept can come from the matrix or from a catalog, and from nowhere else.
- The matrix only: the list is a part of the 182 concepts.

## Consequences

- At IDEA-001#07 the agent can propose a concept from outside the matrix, with its reason and the audience of DEC-119 that needs it. Peter approves each one. Such a concept needs its own research for its name and parts, because the five systems give none.
- No research run adds the catalogs to the matrix.
- Peter named blocks and charts and added "and stuff". He did not name AI Elements. A single pattern from a catalog can still be proposed as a component, case by case, like any other concept outside the matrix.
- Peter's words place page sections, app layouts and charts with the recipes. Whether 1.0 ships recipes, and which idea holds their list, is IDEA-001#11.
