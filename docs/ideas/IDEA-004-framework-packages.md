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
- Row 01 — running since 2026-11-12, after Peter's go (IDEA-001, Notes). Record: RES-029. Workflow run `wf_737727d2-447`, task `w9wlqmzrx`, from the script `.artifacts/v1/research/deep-research-opus-medium.js`. Its first agent's log records `claude-opus-5-5` and the effort `medium`. The run ended on 2026-11-12 with 104 agents and no error. RES-029 holds a partial answer: 14 findings on the runtimes and on TanStack Redact; nothing confirmed on how named libraries make and test their wrappers. Two narrower runs are named in RES-029, Next action. The agent holds these runs until the decision rows of this idea are next: the facts are about tools that change each month, and no decision that needs them is on the frontier. Peter can ask for them sooner.
- Row 01 — scope: DEC-127 of 2026-11-12 takes server rendering out of 1.0. The two follow-up runs leave it out.
- Row 02 — wait: IDEA-003#05 is resolved.

### Settled by the prompt
- The candidate targets are React, Preact, TanStack Redact and possibly Solid.
- The prompt describes Redact as a React-API-compatible runtime. RES-029 checked it: TanStack publishes `@tanstack/redact`, version 0.3.1 of 2026-11-04, before 1.0. Its repository claims "100% API compliancy", and its own compatibility pages list behaviour that it does not implement, mainly concurrency.
- The React package is tested on Redact unchanged before a separate build is planned.
- Each target is evaluated on three points: whether it is needed, how its wrapper is generated or written, and how it is tested.

### Evidence from other ideas
- DEC-131 (Peter, 2026-11-12), for row 05: the layout components take style props with responsive values, as in Chakra UI. In React such a value is an object or a list, so a wrapper must pass it on to the Lit component. IDEA-003 rows 14 and 15 hold the mechanism.
- RES-042 (IDEA-003#01), for row 05: Chakra UI exports each part as a named component and adds `export * as Steps` for the short names. That namespace cannot be used as a component, so a wrapper that offers `Stepper` and `Stepper.Root` together needs another export shape.
- RES-043 (IDEA-003#02), for rows 01 and 05: a slot takes only the top-level children of its host, so a wrapper element that a framework adds around a part breaks the slot assignment. Events and context pass through such an element.
- DEC-119 (IDEA-001#03): 1.0 serves ACME Labs applications, AI-written artifacts, outside teams and marketing and content sites. It is evidence for row 04: outside teams use more frameworks than one company does. It settles no target.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | For React, Preact, TanStack Redact and Solid: how does each handle custom elements, how do other libraries generate or write wrappers for it, and how do they test those wrappers? | research | in-progress | — | — |
| 02 | Import the composition architecture from IDEA-003. | task | open | — | — |
| 03 | Does the React package run on Redact unchanged? | task | open | 01, 02 | — |
| 04 | Which targets ship in 1.0? | interview | open | 01, 03 | — |
| 05 | Is each wrapper generated from component metadata or written by hand? | interview | open | 02, 04 | — |
| 06 | How is each wrapper tested? | interview | open | 04, 05 | — |
| 07 | Is each target its own npm package, or an entry of one package? | interview | open | 04 | — |

## Not yet specified
- Whether a framework package must load without an error in an app that renders its pages on a server, where the components then appear only in the browser. DEC-127 (IDEA-003#04) rules out server rendering itself and does not answer this point. It sharpens at row 04, with the targets.
- Typed JSX for the custom elements in each target.
- How the components for single icons (DEC-123) reach each framework package. It sharpens after IDEA-003#12.

## Out of scope
- The composition architecture. IDEA-003 owns it.
- The component list (IDEA-001) and the design specs (IDEA-002).
- MCP and skills (IDEA-005).
- Devtools, including any devtools adapter for one framework (IDEA-006).
