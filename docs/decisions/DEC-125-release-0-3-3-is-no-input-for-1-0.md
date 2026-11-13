---
id: DEC-125
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: true
  real-trade-off: true
from: user # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-125: Release 0.3.3 is no input for 1.0

Until 2026-11-12 the six ideas used release 0.3.3, the current design system, as evidence: its component list, its names, its look and its decision and research records. Peter stopped the step that filed the 0.3.3 component list and decided: "I think we shouldnt' take the current acmelabs design system into consideration at all for this". Asked how far that goes, with three options, he answered: "I think everything". So no idea of the 1.0 work takes release 0.3.3 as input, and the look is included.

## Consequences

- DEC-121, which started the 1.0 look from the 0.3.3 look, is replaced by this record. IDEA-002#23 asks for the visual start again, with the look of one reference system and a new design as the options.
- Four research rows are retired: IDEA-001#02, IDEA-003#03, IDEA-005#02 and IDEA-006#02. The research record RES-038 is removed. The notes named "Evidence from 0.3.3" are out of the ideas.
- The decisions of 2026-11-12 that do not rest on 0.3.3 stand: DEC-117 to DEC-120 and DEC-122 to DEC-124.
- The motion system opens again with the look. The icon source stays Material Symbols, because Peter chose it directly in DEC-123.
- The glossary still holds the component names of release 0.3.3. IDEA-001#08 replaces them; until then they decide nothing for 1.0.
- `AGENTS.md` still tells a session to read the 0.3 decision and research records before it changes an area. For the 1.0 ideas this record comes first. Peter decides whether the instruction file changes.
- The notes on the working state of the repo stay. They describe how the 0.3.3 code on the branch is checked until 1.0 replaces it; they are no input to a 1.0 decision.
