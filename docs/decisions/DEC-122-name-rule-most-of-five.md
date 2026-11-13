---
id: DEC-122
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-001#05 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-037] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-122: The name that most of the five systems use wins; Peter decides ties after a survey

The five reference systems use different names for 26 of the 78 component concepts that two systems or more have (RES-037). Peter decided the rule for the 1.0 name: the name that most of the five systems use wins. For a tie, the agent surveys more sources and then puts the tie to Peter, who decides. The name that Geist uses has no priority, although the 1.0 look starts from the Geist-based look of 0.3.3 (DEC-121): "some of the component names that geist uses are not what the rest of the industry uses".

## Considered Options

- A wider survey for every concept with different names. It rests each name on more sources, and it delays all 26 names. Rejected.
- No rule, with a decision from Peter for each of the 26 names. Rejected.

## Consequences

- The rule settles 15 of the 26 names from the matrix. In 10 of them Geist alone has its own name, for example Modal, Toggle and Collapse.
- 11 concepts are ties. IDEA-001#10 surveys them; Peter decides each one in IDEA-001#08.
- A name becomes final only for a component that IDEA-001#07 puts in the list.
- The rule matches the rule of release 0.3.3 in DEC-082: the more widely used name, with the survey recorded.
