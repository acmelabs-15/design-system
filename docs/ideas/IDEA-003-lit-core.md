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
- Row 09 — wait: IDEA-001 reaches `done`.
- Row 10 — wait: IDEA-002 resolves its rows 09, 11 and 13.

### Settled by the prompt
- Lit web components are the core implementation.
- Every framework wrapper exports both the convenience component (for example `Stepper`) and every subcomponent (`Stepper.Root`, `Stepper.Item`, `Stepper.Indicator`), the way Chakra does.

### Evidence from 0.3.3
These records are evidence, not answers. Find them through the [decision index](../history/decision-index-0.3.md) and the [research index](../history/research-index-0.3.md).

- DEC-092 excludes server rendering.
- DEC-101 and DEC-114 keep element state in TanStack Store and port behaviour into Lit. DEC-115, on Zag packages through a Lit adapter, is superseded.
- DEC-081 publishes React support as a separate package.
- RES-015 reviews Lit practice. RES-019 covers the styling of slotted content.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | How does Chakra UI export a convenience component beside its subcomponents, and how do the subcomponents share state? | research | open | — | — |
| 02 | Which mechanisms does Lit give for composition between a parent and its parts (slots, light DOM children, context, shadow parts), and what are the limits of each? | research | open | — | — |
| 03 | How does the 0.3.3 core compose its components and build its React bridge, and which limits do its records name? | research | open | — | — |
| 04 | Must 1.0 render on the server? | interview | open | — | — |
| 05 | Which composition architecture does the Lit core use? | prototype | open | 01, 02, 03, 04 | — |
| 06 | Is the convenience component a Lit element in the core, or does it exist only in the framework wrappers? | interview | open | 05 | — |
| 07 | Which source gives the components their behaviour: state machine packages, ports of them, or our own logic? | interview | open | 03, 05 | — |
| 08 | How do the token files from IDEA-002 reach the styles of the components? | interview | open | 05, 10 | — |
| 09 | Import the final component list from IDEA-001. | task | open | — | — |
| 10 | Import the design spec format and the token output from IDEA-002. | task | open | — | — |

## Not yet specified
These sharpen after row 05.

- The package layout and build tooling of the core.
- Browser and CDN delivery. Release 0.3.3 has a separate browser package.
- Form participation, element names and registration.
- The test strategy and the browser matrix.
- What replaces `docs/agents/verification.md` and `docs/agents/repository.md`, which describe the 0.3.3 code. Brain's place for a quality bar is `CONSTRAINTS.md`; package facts belong to the 1.0 specs.

## Out of scope
- Which components exist (IDEA-001) and how they look (IDEA-002).
- Which wrapper targets ship, and how wrappers are generated and tested. IDEA-004 owns them. The prototype wrapper in row 05 proves the export shape only.
- MCP and skills (IDEA-005) and devtools (IDEA-006).
