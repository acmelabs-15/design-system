---
id: DEC-126
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-002#23 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-126: The 1.0 look is a new design with Geist as the first reference

DEC-125 took release 0.3.3 out as input, so the design specs needed a new visual starting point before the first Figma library is drawn. Peter decided that 1.0 gets its own look: a new design that takes from Geist wherever he prefers Geist, and from another system or from new work where Geist leaves something out. He expects that Geist wins in most cases.

## Peter's words

- First reply: "I think a new design, there is a significant amount that I really like from Vercels geist that will probably win in most cases - but geist also leaves a lot of tihngs out that a lot of other design systems include - so i think option 1".
- Second message: "Or maybe certain things should be based on geist or be pulled from geist and other things should be a new design?"
- Asked which of two readings is his direction, he chose "New design, Geist first" with the words "option 1".

## Considered options

- The look of one reference system as a whole: Geist, shadcn/ui, Radix Themes or Chakra UI.
- Geist as the base: the first Figma library copies Geist's look as it is, and only what Geist leaves out gets a new design in the same style.

## Consequences

- A design direction step comes before the first Figma library. For colour, type, shape, density and motion, Peter chooses what comes from Geist, what comes from another system and what is new. IDEA-002 rows 25 and 26 hold that step.
- The decision covers the look only. DEC-122 and DEC-124 decide names and parts, and Geist has no authority over them.
- Every component gets its design in that one look, including a component that Geist does not have.
- The motion system is part of the design direction step. The icons stay Material Symbols (DEC-123).
- In the same reply Peter named the typefaces. IDEA-002 row 24 holds them.
