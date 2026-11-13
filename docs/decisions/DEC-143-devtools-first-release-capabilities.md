---
id: DEC-143
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-006#03 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-143: The first devtools release has six capabilities

The kickoff prompt gives devtools two capabilities: live prop switching on a selected component, and theming controls. Asked which further ones the first release must have, Peter selected all four that the agent offered and added one point: "Token inspector (Recommended), Accessibility checks, Event log, Breakpoint view, In addition to token inspection for components - prop inspection as well maybe?" The agent had recommended the token inspector only.

## The capabilities

1. Live prop switching on a selected component. It includes prop inspection: devtools lists the props of the selected component with their current values. This is how the agent reads Peter's "prop inspection as well maybe?", because a prop can be switched only when it is listed.
2. Theming controls, for light and dark and for the values of a custom theme (DEC-137).
3. Token inspector: the tokens that the selected component uses, with their values in light and dark.
4. Accessibility checks: the name, the role and the contrast of the selected component, with a mark for a failure of WCAG 2.2 level AA (DEC-138).
5. Event log: the events that the components fire, as they happen.
6. Breakpoint view: the style props of a layout component at each breakpoint, with a switch for the breakpoint (DEC-131).

## Consequences

- The base of devtools (IDEA-006#04) must carry all six. The research on TanStack Devtools and on other bases checks each base against this list.
- Capabilities 1, 3 and 6 need data about each component: its props, its tokens and its style props. Where that data comes from is open under "Not yet specified" in IDEA-006, together with the source of the MCP server's records.
- The first release is larger than the one the agent recommended.
