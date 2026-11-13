---
id: DEC-140
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-001#11 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-032] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-140: Recipes are blocks in the documentation, not components

DEC-129 counts the catalogs that a reference system has beside its components as recipes. The open question was whether 1.0 ships recipes and which idea holds their list. Peter decided both parts. 1.0 does not give a recipe out as a component; its documentation gets a blocks section, as shadcn/ui has one: "if they're recipes and aren't exported then we shouldn't - should just include a blocks section in the docs like they do". With DEC-139 he gave the documentation website, and its blocks section, to IDEA-007.

## Consequences

- The 1.0 packages export components only. A recipe is code that a developer copies from the documentation.
- The patterns of AI Elements, page sections, app layouts and charts are candidates for the blocks section. IDEA-007#03 decides which blocks 1.0 has, and whether the section is named Blocks or Recipes. The glossary has the term Recipe; "block" is the word of shadcn/ui.
- IDEA-001 holds components only, so its inventory record lists no recipes.
