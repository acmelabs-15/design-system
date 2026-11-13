---
id: DEC-134
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: true
  real-trade-off: true
from: IDEA-001#08 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-037] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-134: Progress is one component, linear or circular

DEC-133 put Progress and Progress Circle in the 1.0 list as two concepts and joined Spinner with Progress Circle. When the agent proposed the name Circular Progress for that concept, Peter decided otherwise: "not circular progress, I think what most libs do is the progress can be linear or circular". So 1.0 has one Progress component with a linear and a circular shape, and no component named Progress Circle, Circular Progress or Spinner.

## Consequences

- This changes the list of DEC-133 in one point: Progress Circle is no concept of its own. The list holds 145 concepts, and 37 are out.
- A loading spinner in 1.0 is Progress in its circular shape with no value. Peter said before: "I think circlular progress and spinner are the same".
- The matrix (RES-037) shows another picture than "most libs": four of the five systems have Spinner as a component of its own, and only Chakra UI has a circular progress, also as a component of its own. The agent told Peter. His decision is about how 1.0 is built, so it stands; by the count, DEC-130 would have put Spinner in.
- The design spec of Progress holds both shapes, and the state with no value for each (IDEA-002).
