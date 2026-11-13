---
id: DEC-123
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: true
  surprising: false
  real-trade-off: true
from: user # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-123: 1.0 has an Icon component and one component for each Material Symbols icon

Peter stated three things about icons on 2026-11-12, outside a map row. 1.0 has an Icon component. The icon library of the design system makes an actual component for each icon, built with the Icon component. The icons come from Material Symbols. He named the variations of Material Symbols as a point to consider, and he did not decide which of them 1.0 ships.

## Consequences

- The 1.0 component list holds Icon. The components for single icons are output of the icon library; they are not entries of the component list.
- The source agrees with DEC-121 and with DEC-060 of release 0.3.3, which chose Material Symbols.
- IDEA-002#21 researches the variations of Material Symbols. IDEA-002#22 decides which of them 1.0 ships and which a consumer can change on one icon.
- IDEA-003#12 decides how the library makes one component for each icon, after the composition architecture. The framework packages carry the icon components too; IDEA-004 holds that point.
