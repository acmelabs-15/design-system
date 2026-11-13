---
id: IDEA-003
status: define # define | specced | done | parked
result: # with status: done, the DEC-NNN or the commit SHA this idea produced
---
# IDEA-003: Lit core, composition-first

## Intent
- Outcome: Lit web components as the core implementation, on an architecture that lets every framework wrapper export a top-level convenience component and every subcomponent used to build it.
- User: Peter decides; this is his first Lit project. Developers compose custom versions from the subcomponents, and IDEA-004 wraps the core.
- Why now: Lit composes through slots, and React composes through children and context. The architecture must bridge both before any component is built.
- Success: Peter has chosen the architecture with its trade-offs explained; a prototype shows one component as `Stepper` and as `Stepper.Root`, `Stepper.Item` and `Stepper.Indicator` over the Lit core; a spec for the core build exists.
- Constraint: the architecture is settled with Peter before anything is built. Each Lit trade-off is explained in plain terms.
- Out of scope: framework packages beyond the prototype wrapper (IDEA-004), MCP and skills (IDEA-005) and devtools (IDEA-006). The component list (IDEA-001) and the design specs (IDEA-002) are inputs.

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A spec for the Lit core build: the chosen composition architecture, with its decision records and prototype evidence. Its plan then builds the components from the IDEA-001 list and the IDEA-002 specs.

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas).
- Standing preference: before each architecture question, explain the Lit concept and the trade-off in plain terms. Peter has not used Lit before.

### Waits
- Row 01 — running since 2026-11-12. Record: RES-042. Researcher agent `ae3a841db00a620a6`, started without a name; its log records `claude-opus-5-5` and the effort `medium` on each request.
- Row 02 — running since 2026-11-12. Record: RES-043. Researcher agent `a8a44290116cb20e5`, started without a name; its log records `claude-opus-5-5` and the effort `medium` on each request.
- Rows 01 and 02 started when DEC-127 resolved row 04: they are now the only rows that row 05 waits for, and row 05 shapes IDEA-003, IDEA-004 and IDEA-006.
- Row 09 — wait: IDEA-001 reaches `done`.
- Row 10 — wait: IDEA-002 resolves its rows 11 and 13. Row 09 is resolved by DEC-120.
- Row 12 — wait: IDEA-002#22 decides the variations of Material Symbols. DEC-123 holds Peter's decisions that each icon is a component built with the Icon component, and that the Icon component renders SVG, not an icon font.

### Settled by the prompt
- Lit web components are the core implementation.
- Every framework wrapper exports both the convenience component (for example `Stepper`) and every subcomponent (`Stepper.Root`, `Stepper.Item`, `Stepper.Indicator`), the way Chakra does.

### Evidence from other ideas
- DEC-119 (IDEA-001#03): 1.0 serves ACME Labs applications, AI-written artifacts, outside teams and marketing and content sites.
- Row 04 is resolved by DEC-127: 1.0 does not render on the server. Peter gave the answer in a message of his own on 2026-11-12. The evidence that content sites and outside teams often render pages on a server is in that record.
- For row 11: artifacts are often one HTML file that loads from a CDN, so 1.0 must work with no build step. DEC-119 states that need; row 11 decides the delivery.
- DEC-118 (IDEA-002#18): each design spec reaches the repo as Markdown that an agent pulls from Figma. Row 10 imports that format.
- RES-035 and RES-037 (IDEA-001#01), evidence for rows 01 and 06: the Chakra UI inventory marks 19 of 115 components as offered both as one ready-made component and as parts, 46 as parts only and 50 as one component.
- DEC-124 (IDEA-001#06), for rows 05 and 06: Peter decides the parts and the structure of each component by review, and he expects a mix of several systems. The architecture must not assume the structure of one reference system.
- DEC-128 (IDEA-002#24), for row 13: the typefaces are Google Sans Flex for text and Google Sans Code for code. Their license facts come from search excerpts; row 13 checks the license at its source first. Row 13 waits for row 11, because the delivery of the fonts follows the delivery of the components.
- RES-029 (IDEA-004#01), collected for row 04 before DEC-127 resolved it: Preact's server renderer does not write complex property values into the HTML; they reach the element at hydration. React's rule for properties on the server is not confirmed yet.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | How does Chakra UI export a convenience component beside its subcomponents, and how do the subcomponents share state? | research | in-progress | — | — |
| 02 | Which mechanisms does Lit give for composition between a parent and its parts (slots, light DOM children, context, shadow parts), and what are the limits of each? | research | in-progress | — | — |
| 04 | Must 1.0 render on the server? | interview | resolved | — | [DEC-127](../decisions/DEC-127-no-server-rendering-in-1-0.md) |
| 05 | Which composition architecture does the Lit core use? | prototype | open | 01, 02, 04 | — |
| 06 | Is the convenience component a Lit element in the core, or does it exist only in the framework wrappers? | interview | open | 05 | — |
| 07 | Which source gives the components their behaviour: state machine packages, ports of them, or our own logic? | interview | open | 05 | — |
| 08 | How do the token files from IDEA-002 reach the styles of the components? | interview | open | 05, 10 | — |
| 09 | Import the final component list from IDEA-001. | task | open | — | — |
| 10 | Import the design spec format and the token output from IDEA-002. | task | open | — | — |
| 11 | Which delivery lets one HTML page use 1.0 from a CDN with no build step, and does it cover every component? | interview | open | 05 | — |
| 12 | How does the icon library make one component for each icon from the Icon component, and how do the variations of an icon reach it? | interview | open | 05 | — |
| 13 | How do the typefaces of 1.0 reach a page: font files in the package, a link to Google Fonts, or the consumer's own loading? | interview | open | 11 | — |

## Not yet specified
These sharpen after row 05.

- The package layout and build tooling of the core.
- Form participation, element names and registration.
- The test strategy and the browser matrix.
- What replaces `docs/agents/verification.md` and `docs/agents/repository.md`, which describe the 0.3.3 code. Brain's place for a quality bar is `CONSTRAINTS.md`; package facts belong to the 1.0 specs.

## Out of scope
- Row 03, retired on 2026-11-12: "How does the 0.3.3 core compose its components and build its React bridge, and which limits do its records name?" DEC-125 takes release 0.3.3 out as input.
- Which components exist (IDEA-001) and how they look (IDEA-002).
- Which wrapper targets ship, and how wrappers are generated and tested. IDEA-004 owns them. The prototype wrapper in row 05 proves the export shape only.
- MCP and skills (IDEA-005) and devtools (IDEA-006).
