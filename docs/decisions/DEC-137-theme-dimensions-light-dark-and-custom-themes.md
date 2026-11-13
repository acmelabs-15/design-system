---
id: DEC-137
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-002#04 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-041] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-137: The tokens carry light and dark, and custom themes

A theme dimension is one setting that changes the look of the whole interface, and each one multiplies the token values that every design spec must check. Peter selected two of four: "Light and dark (Recommended), Custom themes (Recommended)". So the tokens of 1.0 carry two colour schemes, and an outside team can replace the brand colour, the typeface and the corner radius with its own values through tokens that 1.0 documents.

## Considered options

- Density: two or three densities for the whole interface. Not selected.
- Accent choice: a built-in choice among several accent colours. Not selected. A custom theme lets a team set its own brand colour.

## Consequences

- Every colour token has a light and a dark value, and each design spec is checked in both (IDEA-002#13).
- The tokens keep the brand values apart from the rest, so that a custom theme replaces only those. 1.0 cannot guarantee the contrast of a team's own colour.
- 1.0 has one density and one accent colour of its own. A component can still take a colour for one use, such as red for a destructive Button; that is a variant of the component and no theme dimension.
- In Figma the colour scheme is one collection of variables with two modes (RES-024).
- The Theme component and the Theme Switcher of the list (DEC-133) work with these two colour schemes.
