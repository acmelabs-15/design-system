---
id: DEC-142
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-002#13 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-027, RES-028] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-142: A design spec holds twelve items; specs can be several and name what they depend on

The agent asked what one design spec must hold: the nine items of the kickoff prompt, twelve items, or twelve items and usage guidance. Peter chose no option and gave two rules instead: "can also be multiple specs - specs also have a deps graph so its clear when/what can be doen in parallele". So the content for one component can sit in more than one spec, and each spec names the specs that it needs first, so that the plan shows what can be made in parallel.

## What Peter decided

- More than one spec is allowed. The usage guidance of a component, which says when to use it and when not, is therefore a spec of its own and no item of the design spec. IDEA-007#04 decides where that text is written.
- The specs carry a dependency graph. Peter did not say whether he meant the design specs of the components or the specs that follow the seven ideas. The rule holds for both: the plan of IDEA-002 orders the design specs by what each one needs first, such as Icon before Icon Button, and the plan of each idea's spec has its blocking links.

## What the agent chose, and told Peter

The design spec of one component holds twelve items. Nine come from the kickoff prompt: anatomy and parts, variants, named sizes, states, tokens, slots, subcomponents, accessibility behaviour, and motion. Three follow from decisions of 2026-11-12:

- Props and events, each with its values and its default; for a layout component also the style props with a value for each breakpoint (DEC-131).
- The component in light and dark, and in left-to-right and right-to-left (DEC-137, DEC-138).
- The behaviour with long content and in a narrow space.

Where each item sits in Figma: variants, named sizes and states are properties of the component set; tokens are variables bound to its layers; parts are named layers, shown in one anatomy frame; all text is in the Specs document beside the component (DEC-118).

## Consequences

- With DEC-141 no approval comes before the last spec, so these twelve items are the standard that each agent-made spec is checked against.
- The plan of IDEA-002 needs the parts of each component (IDEA-001#09) to build the dependency graph of the design specs.
- Peter can change the twelve items until the first spec is drawn.
