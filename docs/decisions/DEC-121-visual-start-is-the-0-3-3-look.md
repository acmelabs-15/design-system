---
id: DEC-121
status: superseded by DEC-125 # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-002#03 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-121: The 1.0 look starts from the 0.3.3 look

The design specs need a visual starting point before the first Figma library is drawn. Peter decided that 1.0 starts from the look of release 0.3.3: the Geist baseline of DEC-082, the blue accent of DEC-008, the Material Symbols icons of DEC-060, the Material motion of DEC-059 and the Google Sans Flex fonts. He chose its parts one by one, and no record says that the look is the problem of 0.3.3. The look of one reference system and a new design were the other options.

## Conditions that Peter gave

- The decision covers the look only. It gives Geist no authority over the component list or over names: "I don't want to just assume that the name geist uses for a component is the correct one - part of this is standardizing names".
- Geist does not have every component that 1.0 needs. A component with no example in the 0.3.3 look gets its design in the same visual language.

## Consequences

- The first Figma library copies the current look, and the 0.3.3 token values go into Figma. A change of the look then happens in Figma.
- The icon set and the motion system of 0.3.3 are the starting point; they do not open again as questions of their own.
- IDEA-001 owns the component list and the names. IDEA-001#05 holds Peter's words on names as a partial answer.
