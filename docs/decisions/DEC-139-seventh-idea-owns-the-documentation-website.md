---
id: DEC-139
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-005#08 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-139: A seventh idea owns the documentation website

The kickoff prompt says that the merge of 1.0 replaces "components, packages, docs, MCP and skills", and it names six ideas, none of which owns the documentation website. Peter selected "A seventh idea (Recommended)": IDEA-007 owns the website, with its pages, its examples, the blocks section and the records that the MCP server also serves.

## Considered options

- IDEA-005 owns the website and becomes documentation, MCP and skills. It mixes the design of a website with the question of how the MCP server and the skills ship.

## Consequences

- The 1.0 work has seven ideas. The program rules in IDEA-001 hold for IDEA-007 too, and the check after every answer covers all seven maps.
- IDEA-005 keeps the MCP server and the skills. Which records the server serves (IDEA-005#06) and where the website takes its records from (IDEA-007#04) are two views of one source, so each row names the other.
- IDEA-007 holds the list of blocks (DEC-140).
