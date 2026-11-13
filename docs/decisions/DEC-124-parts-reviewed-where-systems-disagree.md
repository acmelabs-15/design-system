---
id: DEC-124
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-001#06 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-037] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-124: Peter reviews parts and structure where the systems disagree

The five reference systems agree much less on parts than on component names: two systems or more split 47 concepts into parts, and only 2 of the 47 have the same part names everywhere (RES-037). Peter decided that no rule and no single system picks the parts and the structure of a 1.0 component. Where the systems disagree, he goes over the cases with the agent, and he expects the result to combine things from several systems: "it won't be one system over another it will be a combination of things from several ssytems".

## Considered Options

- One name for each role in every component, chosen as the name that most of the five systems use. Rejected as a rule.
- The most-used name component by component. Rejected.
- The part names of one system for all components. Rejected.

## Consequences

- IDEA-001#09 is a review with Peter, not the result of a rule. The agent prepares each review: the parts of one family of components side by side for the five systems, with the points of disagreement.
- The agent reads Peter's words so: a part name that all systems share, such as Root, Trigger, Content or Item, needs no review. He did not say this in words; the first review confirms it.
- The words for the pieces are settled: Part, Subcomponent and Slot are in the glossary.
- Which parts a component can have also depends on the composition architecture of IDEA-003#05.
