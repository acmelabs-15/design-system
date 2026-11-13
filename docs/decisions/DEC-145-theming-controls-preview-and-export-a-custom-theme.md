---
id: DEC-145
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-006#06 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-044] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-145: The theming controls preview a custom theme and export it

Figma is the one place where a token of 1.0 changes (DEC-120), so devtools cannot write the 1.0 tokens into the repo. An outside team can make a custom theme with its own brand colour, typeface and corner radius (DEC-137). Peter selected "Preview and export of a custom theme (Recommended)": a developer tries those values in devtools, sees them live, and saves them as a theme file for the project. The other option was a preview that saves nothing.

## Consequences

- The export holds only the values of a team's custom theme. It never changes a token of 1.0 itself.
- 1.0 must define the format of a custom theme file. The token output of IDEA-002#11 and the way the styles take the tokens in IDEA-003#08 set it.
- The first devtools release must write that file, so its base (IDEA-006#04) must allow a download or a write to disk.
- The Theming page of the website (DEC-144) documents the theme file.
