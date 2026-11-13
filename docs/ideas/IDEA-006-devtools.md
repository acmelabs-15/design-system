---
id: IDEA-006
status: define # define | specced | done | parked
result: # with status: done, the DEC-NNN or the commit SHA this idea produced
---
# IDEA-006: Devtools for all framework versions

## Intent
- Outcome: a devtools package that works with every framework version of 1.0, with live prop switching on a selected component and theming controls.
- User: Peter decides. Developers use it while they build with 1.0.
- Why now: 1.0 replaces the 0.3.3 inspector, so its base is chosen again: TanStack Devtools, a fork of it, or our own.
- Success: research covers extending TanStack Devtools, forking it and building our own; Peter has chosen; the capability list is fixed; a spec exists.
- Constraint: research comes first, then Peter decides.
- Out of scope: the documentation website (IDEA-007). IDEA-002 owns the token pipeline, IDEA-003 the Lit core, IDEA-004 the wrappers and IDEA-005 the MCP server and skills.

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A spec for the 1.0 devtools package: its base, its capabilities, and how it reaches each framework version.

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas).

### Waits
- Row 01 — running since 2026-11-12, after Peter's go (IDEA-001, Notes). Record: RES-031. Workflow run `wf_40354acd-051`, task `w76opab21`, from the script `.artifacts/v1/research/deep-research-opus-medium.js`. Its first agent's log records `claude-opus-5-5` and the effort `medium`. The run ended on 2026-11-12 with 104 agents and no error. RES-031 holds a partial answer: 8 findings on TanStack Devtools (alpha, version 0.16.0, shell written in Solid.js, adapters for six frameworks, none for Lit or plain custom elements); no confirmed claim on any other base. Two narrower runs are named in RES-031, Next action. The agent holds these runs until the decision rows of this idea are next: the facts are about tools that change each month, and no decision that needs them is on the frontier. Peter can ask for them sooner.
- Row 07 — wait: IDEA-003#05 and IDEA-004#04 are resolved.
- Row 08 — ready: DEC-120 resolved IDEA-002#09 on 2026-11-12. The token files in the repo are Figma's exported DTCG files, and Figma stays the place where a token changes. Row 06 needs that fact.

### Evidence from other ideas
- DEC-137 (IDEA-002#04), for rows 03 and 06: the tokens carry light and dark, and custom themes with a team's own brand colour, typeface and corner radius. 1.0 has no density setting and no built-in accent choice. The theming controls work on these.
- DEC-127 (IDEA-003#04): 1.0 does not render on the server.

### Settled by the prompt
- One devtools package serves all the framework versions.
- Its capabilities include live prop switching on a selected component, and theming controls.
- The options to evaluate: TanStack Devtools (extend it, or fork it into something custom) against our own build. Research comes first.

### Row 03 — pending question
- Pending question, 2026-11-12, with more than one answer possible: which capabilities must the first devtools release have beside live prop switching and theming controls? Options: "Token inspector (Recommended)": the tokens that the selected component uses, with their values in light and dark; "Accessibility checks": the name, the role and the contrast of the selected component against WCAG 2.2 level AA; "Event log": the events that the components fire; "Breakpoint view": the style props of a layout component at each breakpoint. To choose none, he types "none".
- The agent's reasons: a custom theme changes token values (DEC-137), so a developer must see which tokens a component uses; each further capability makes the first release larger before its base is chosen (row 04).

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | What does TanStack Devtools offer for extension and for a fork, and which other bases for devtools exist? | research | in-progress | — | — |
| 03 | Which capabilities must the first devtools release have beyond live prop switching and theming controls? | interview | open | — | — |
| 04 | Is devtools built on TanStack Devtools (extended or forked), or built by us? | interview | open | 01, 03 | — |
| 05 | Does devtools work on the custom elements for every framework, or through an adapter for each framework? | interview | open | 04, 07 | — |
| 06 | Do the theming controls only preview token values, or do they also export changes? | interview | open | 03, 08 | — |
| 07 | Import the composition architecture from IDEA-003 and the wrapper targets from IDEA-004. | task | open | — | — |
| 08 | Import the token pipeline decision from IDEA-002. | task | open | — | — |

## Not yet specified
- How devtools stays out of production bundles.
- Whether devtools and the MCP server read component metadata from one source.

## Out of scope
- Row 02, retired on 2026-11-12: "What does the 0.3.3 devtools package do, and which limits do its records name?" DEC-125 takes release 0.3.3 out as input.
- The token pipeline (IDEA-002), the Lit core (IDEA-003) and the wrappers (IDEA-004).
- The MCP server and the skills (IDEA-005).
