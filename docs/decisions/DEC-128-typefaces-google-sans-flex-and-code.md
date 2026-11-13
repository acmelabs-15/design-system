---
id: DEC-128
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-002#24 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-128: The typefaces are Google Sans Flex for text and Google Sans Code for code

The 1.0 look is a new design (DEC-126), so its typefaces were open. Peter set them in his reply on the visual start: "for the font we should be using google sans flex and for coding font google sans flex mono". No typeface has the name "Google Sans Flex Mono"; asked whether he means Google Sans Code, the typeface for code of the same family, he selected "Google Sans Code". So 1.0 uses Google Sans Flex for text and Google Sans Code for code.

## Considered options

- Choose the typeface for code in the design direction step, from two or three coding typefaces shown beside Google Sans Flex.

## Consequences

- The design direction step (IDEA-002#26) takes both typefaces as given. It still decides the type scale: sizes, line heights, weights and letter spacing.
- The license facts come from search excerpts of 2026-11-12, not from the full pages: both typefaces are open source under the SIL Open Font License, Google Sans Code since August 2025 and Google Sans Flex since 2025-11-18. IDEA-003#13 decides how the font files reach a page, and it checks the license at its source first.
