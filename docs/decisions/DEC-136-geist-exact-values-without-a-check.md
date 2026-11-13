---
id: DEC-136
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: true
  real-trade-off: true
from: IDEA-002#27 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-041] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-136: 1.0 takes Geist's exact values, with no legal check

The 1.0 look is a new design with Geist as the first reference (DEC-126). RES-041 found that the Geist pages carry no license and no statement on reuse, and that Vercel's Terms of Service forbid "derivative works based on the Services" without naming Geist or its pages. Peter decided that Geist's published values go into the first Figma library as they are, with no legal check. He selected "Exact values now" after he read its cost: "the rights stay unclear for a system that outside teams use".

## Considered options

- Own values in Geist's structure: colour scales with a role for each step and materials for surfaces, with values made new for 1.0. The agent recommended this option.
- Exact values after a legal check by a person with legal knowledge.

## Consequences

- Where the design direction (IDEA-002#26) takes a part of the look from Geist, it takes Geist's values and not values that are only like them.
- The risk that Peter accepted: no source gives ACMElabs the right to reuse these values, and 1.0 goes to outside teams (DEC-119). The research draws no legal conclusion, and no person with legal knowledge has read Vercel's terms for this work.
- The values of spacing, control heights, motion and focus ring exist only in the CSS of Vercel's website, which is no published package and can change. IDEA-002#26 decides whether 1.0 takes those too, or the values of another system.
- Geist's 29 text styles are made for the Geist typeface. 1.0 uses Google Sans Flex (DEC-128), so IDEA-002#26 checks their sizes, line heights and letter spacing with that typeface.
- A later change of this decision is a change of token values in Figma (DEC-120).
