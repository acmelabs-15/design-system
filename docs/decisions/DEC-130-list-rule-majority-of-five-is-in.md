---
id: DEC-130
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-001#07 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-037] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-130: A concept that most of the five systems have is in the list

For the first batch of the 1.0 list the agent proposed to leave out concepts with the reason "a plain HTML element or CSS does the job". Peter did not accept that reason and gave a rule: "my feeling is if the majority of the systems/libs we're auditing have a component for it we shoudl as well". So a concept that three or more of the five reference systems have is in the 1.0 list. By RES-037 that holds for 45 of the 182 concepts.

## Peter's words

"I don't like the idea so much of \"plain html or css does the job\" - for the layout helpers I want to keep all of those".

## Consequences

- The agent no longer proposes to leave a concept out because a plain HTML element or CSS can do its job.
- The rule puts a concept in. It puts no concept out: a concept that one or two systems have still gets a proposal with a reason, and Peter decides it (DEC-119, DEC-129).
- Portal is in by this rule, with three systems. The agent had proposed it out as a helper for React only, and it told Peter about the change.
- The layout helpers that Peter keeps are in by his own words, not by this rule: Box, Flex, Center, AbsoluteCenter, Float, Wrap and SimpleGrid have one or two systems each.
