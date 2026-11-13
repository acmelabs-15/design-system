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
- Out of scope: MCP and skills (IDEA-005), devtools (IDEA-006) and the documentation website (IDEA-007). IDEA-003 owns the composition architecture.

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A spec for the framework packages: the chosen targets, the way each wrapper is produced, and its tests.

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas).

### Waits
- Row 01, the two follow-up questions of RES-029 — in the block of agent work that Peter approved on 2026-11-12, as two single research agents and not as workflow runs. Question 1 (React 19 and Redact on the client) is answered in RES-029 since 2026-11-12, by the researcher agent `a250484f13dcbb03c`. Question 2 (how named libraries make and test their wrappers) runs since 2026-11-12 in the same record; its agent ID is in IDEA-001, Notes, "Block of agent work". The list is in IDEA-001, Notes, "Block of agent work".
- Row 01 — running since 2026-11-12, after Peter's go (IDEA-001, Notes). Record: RES-029. Workflow run `wf_737727d2-447`, task `w9wlqmzrx`, from the script `.artifacts/v1/research/deep-research-opus-medium.js`. Its first agent's log records `claude-opus-5-5` and the effort `medium`. The run ended on 2026-11-12 with 104 agents and no error. RES-029 holds a partial answer: 14 findings on the runtimes and on TanStack Redact; nothing confirmed on how named libraries make and test their wrappers. Two narrower runs are named in RES-029, Next action. The agent holds these runs until the decision rows of this idea are next: the facts are about tools that change each month, and no decision that needs them is on the frontier. Peter can ask for them sooner.
- Row 01 — scope: DEC-127 of 2026-11-12 takes server rendering out of 1.0. The two follow-up runs leave it out.
- Row 02 — wait: IDEA-003#05 is resolved.

### Row 01 — resolved
- RES-029 is answered since 2026-11-12: the sweep, then one research agent for each of its two follow-up questions (`a250484f13dcbb03c` and `a4717c5e0e713bd19`; both logs record `claude-opus-5-5` and the effort `medium`).
- Facts for row 03: React 19 sets a prop as a property when the element has a property of that name at the moment of the write; this comes from React's source. Redact 0.3.1 has no branch for custom elements: it writes each prop as an attribute with a lower-case name and a string value, and it puts event names in lower case. So an array or an object prop does not arrive, and an event with capital letters in its name is not heard. No source of Redact states this; it comes from its source code, and no run observed it in a browser. Row 03 is that test, and RES-029 names the six points that it must observe.
- Facts for row 04: none of the six libraries ships a wrapper package for Preact or for Solid. Stencil generates only type declarations for both. Web Awesome's documentation calls its React wrappers legacy and says that React 19 needs none; it still ships them.
- Facts for row 05: each generated React wrapper in the five libraries that have one is a call to `createComponent` of `@lit/react`. The input is a Custom Elements Manifest (Web Awesome, Shoelace, Spectrum), compiler metadata (Stencil, Ionic), or the TypeScript source (Lit's own labs generator). Each library exports one flat component for each tag. None exports a component with members such as `Steps.Root`, so no library is a model for the export shape that the prompt asks for.
- Facts for row 06: Stencil and Ionic test their wrappers in a browser, in example applications; Ionic runs a React 18 and a React 19 application. `@lit/react` tests in three browsers against React 18.2. Web Awesome, Shoelace and Spectrum have no test of their wrappers.
- Limits of the record: nothing is observed in a browser; refs, children and slots in Preact and Solid were not researched; two findings on Preact and Solid rest on a 2-1 vote and on older documentation; no source has a wrapper test under Preact or Solid, or a test of `@lit/react` under React 19.

### Settled by the prompt
- The candidate targets are React, Preact, TanStack Redact and possibly Solid.
- The prompt describes Redact as a React-API-compatible runtime. RES-029 checked it: TanStack publishes `@tanstack/redact`, version 0.3.1 of 2026-11-04, before 1.0. Its repository claims "100% API compliancy", and its own compatibility pages list behaviour that it does not implement, mainly concurrency.
- The React package is tested on Redact unchanged before a separate build is planned.
- Each target is evaluated on three points: whether it is needed, how its wrapper is generated or written, and how it is tested.

### Evidence from other ideas
- RES-047 (IDEA-007#02), for rows 04 and 05: Web Awesome and Spectrum Web Components make their React wrappers with `@lit/react` from the Custom Elements Manifest. Web Awesome's documentation says that React 19 needs no wrapper, and it keeps its wrappers for React 18 and below. TanStack Virtual has no package for Preact; Table and Form have one for each of Lit, React, Preact and Solid.
- DEC-146 (IDEA-007#03), for row 04: each block of the documentation is written for plain HTML and for each framework target, and Peter named blocks that use TanStack packages with "maybe". So each target multiplies the work on the blocks.
- DEC-131 (Peter, 2026-11-12), for row 05: the layout components take style props with responsive values, as in Chakra UI. In React such a value is an object or a list, so a wrapper must pass it on to the Lit component. IDEA-003 rows 14 and 15 hold the mechanism.
- RES-042 (IDEA-003#01), for row 05: Chakra UI exports each part as a named component and adds `export * as Steps` for the short names. That namespace cannot be used as a component, so a wrapper that offers `Stepper` and `Stepper.Root` together needs another export shape.
- RES-043 (IDEA-003#02), for rows 01 and 05: a slot takes only the top-level children of its host, so a wrapper element that a framework adds around a part breaks the slot assignment. Events and context pass through such an element.
- DEC-119 (IDEA-001#03): 1.0 serves ACME Labs applications, AI-written artifacts, outside teams and marketing and content sites. It is evidence for row 04: outside teams use more frameworks than one company does. It settles no target.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | For React, Preact, TanStack Redact and Solid: how does each handle custom elements, how do other libraries generate or write wrappers for it, and how do they test those wrappers? | research | resolved | — | [RES-029](../research/RES-029-framework-wrapper-landscape.md) |
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
