---
id: IDEA-004
status: define # define | specced | done | parked
result: # with status: done, the DEC-NNN or the commit SHA this idea produced
---
# IDEA-004: Framework packages over the Lit core

## Intent
- Outcome: a decision for each wrapper target (React, Preact, TanStack Redact and possibly Solid): whether 1.0 needs it, how its wrapper is generated or written, and how it is tested.
- User: Peter decides. Developers use 1.0 from each chosen framework.
- Why now: the wrappers carry the composition contract of IDEA-003 to consumers, and each extra target adds cost to every release.
- Success: each target has a decision with evidence; a test shows whether the React package runs on Redact unchanged; a spec for the framework packages exists.
- Constraint: test the React package on Redact before any plan for a separate Redact build.
- Out of scope: MCP and skills (IDEA-005) and devtools (IDEA-006). IDEA-003 owns the composition architecture.

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A spec for the framework packages: the chosen targets, the way each wrapper is produced, and its tests.

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas).

### Waits
- Row 01 — wait: the deep research skill. See the waits in IDEA-001.
- Row 02 — wait: IDEA-003#05 is resolved.

### Settled by the prompt
- The candidate targets are React, Preact, TanStack Redact and possibly Solid.
- The prompt describes Redact as a React-API-compatible runtime. Row 01 checks that description against sources.
- The React package is tested on Redact unchanged before a separate build is planned.
- Each target is evaluated on three points: whether it is needed, how its wrapper is generated or written, and how it is tested.

### Agent choices
- Row 03 can run first against the 0.3.3 React package as an early signal. The row resolves only with the 1.0 wrapper from the IDEA-003 prototype.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | For React, Preact, TanStack Redact and Solid: how does each handle custom elements, how do other libraries generate or write wrappers for it, and how do they test those wrappers? | research | open | — | — |
| 02 | Import the composition architecture from IDEA-003. | task | open | — | — |
| 03 | Does the React package run on Redact unchanged? | task | open | 01, 02 | — |
| 04 | Which targets ship in 1.0? | interview | open | 01, 03 | — |
| 05 | Is each wrapper generated from component metadata or written by hand? | interview | open | 02, 04 | — |
| 06 | How is each wrapper tested? | interview | open | 04, 05 | — |
| 07 | Is each target its own npm package, or an entry of one package? | interview | open | 04 | — |

## Not yet specified
- Server rendering for each target. It depends on IDEA-003#04.
- Typed JSX for the custom elements in each target.

## Out of scope
- The composition architecture. IDEA-003 owns it.
- The component list (IDEA-001) and the design specs (IDEA-002).
- MCP and skills (IDEA-005).
- Devtools, including any devtools adapter for one framework (IDEA-006).
