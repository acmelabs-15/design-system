---
id: IDEA-002
status: define # define | specced | done | parked
result: # with status: done, the DEC-NNN or the commit SHA this idea produced
---
# IDEA-002: Design specs and tokens for 1.0

## Intent
- Outcome: a design spec for every component on the final list, made before any code. With Figma, the work also gives designers a way to use the system and a token pipeline with Figma as the source of truth.
- User: Peter decides. Designers use the result in their files, and IDEA-003 builds from the specs.
- Why now: 1.0 is built from specs, so the design of each component must be fixed before the Lit core starts.
- Success: Peter has chosen the medium; each listed component has a spec with anatomy and parts, variants, named sizes, states, tokens, slots and subcomponents, accessibility behaviour and motion; with Figma, the designer route and the token pipeline are decided.
- Constraint: no implementation happens in this idea. With Figma as the source, nobody maintains tokens by hand in code.
- Out of scope: the Lit core (IDEA-003), framework packages (IDEA-004), MCP and skills (IDEA-005) and devtools (IDEA-006). IDEA-001 owns the component list.

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A spec for the design work: the chosen medium, the format of one design spec, the designer route and the token pipeline. Its plan then produces one design spec for each component.

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas).

### Waits
- Row 16 — wait: Peter's Figma account and sign-in. RES-023 answers row 01 from documentation only; no live call was made. Its follow-ups (write quality for one component, whether `use_figma` counts against the rate limit, plugin version 2.2.157 against 2.2.207) are row 16. RES-023 finds that writing through the MCP needs a paid plan and a Full seat, so the trial also waits on the plan facts of row 15.
- Row 14 — wait: IDEA-001 reaches `done`.

### Research in progress
- Row 15: agent `res-idea002-15`, started 2026-11-12. Its record has `from: IDEA-002#15`. Peter asked on 2026-11-12 for direction on the Figma sign-up and on what to buy. The record holds facts only; the direction comes with rows 02, 07 and 09.

### Settled by the prompt
- A design spec covers anatomy and parts, variants, sizes, states, tokens, slots and subcomponents, accessibility behaviour and motion.
- Peter decides between Figma and spec documents in the repo after he sees the trade-offs.
- With Figma, tokens are authored in Figma and exported to the repo. Research comes first for the designer route and for the token pipeline.
- The token options to evaluate include Figma Variables through the REST API, a plugin such as Tokens Studio, and the W3C design tokens format transformed by Style Dictionary or a newer tool.
- The token research covers how changes reach the repo (manual export, CI job or pull request), how they are versioned, and how they feed the Lit core and every framework package.

### Conditions
- Rows 06 to 11 apply as written only when row 02 selects Figma. With spec documents in the repo, rows 06 and 07 go out of scope, and the token source in rows 08 to 11 becomes an open question.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | What can the Figma MCP read and write today (components, variants, variables, libraries), and what are its limits? | research | resolved | — | [RES-023](../research/RES-023-figma-mcp-capabilities.md) |
| 02 | Are the design specs made in Figma through the Figma MCP, or as spec documents in the repo? | interview | open | 01, 15, 16 | — |
| 03 | What is the visual starting point for 1.0: the 0.3.3 look, the look of one reference system, or a new design? | interview | open | — | — |
| 04 | Which theme dimensions must the tokens carry (colour scheme, density, accent, custom themes)? | interview | open | — | — |
| 05 | Which accessibility standard, reading directions and input modes do the specs target? | interview | open | — | — |
| 06 | How do a published Figma library and a custom Figma plugin each give components to designers, and how does each stay in sync with new versions? | research | open | 02 | — |
| 07 | Do designers get the system through a published library, a custom plugin, or both? | interview | open | 06 | — |
| 08 | Which routes export tokens from Figma to the repo, and how does each handle change flow and versions? | research | open | 02 | — |
| 09 | Which token export route does 1.0 use? | interview | open | 08 | — |
| 10 | How do token changes reach the repo (manual export, CI job or pull request), and how are they versioned? | interview | open | 09 | — |
| 11 | Which token files does the pipeline hand to the Lit core and the framework packages? | interview | open | 09 | — |
| 12 | Who makes each design spec, and who approves it? | interview | open | 02 | — |
| 13 | What must one design spec hold before a component can be built from it? | interview | open | 02 | — |
| 14 | Import the final component list from IDEA-001. | task | open | — | — |
| 15 | Which Figma plan and seat does each capability need (MCP use, variables and modes, library publishing, the Variables REST API, plugins), and what does each cost today? | research | in-progress | — | — |
| 16 | What does a live trial of one component made through the Figma MCP show: the number of calls, the manual cleanup, the errors, and whether `use_figma` counts against the rate limit? | task | open | 15 | — |

## Not yet specified
- The order and batch size of the component specs. The plan settles it.
- The icon set and the motion system. They sharpen after row 03.
- How a design spec records responsive behaviour.

## Out of scope
- The component list, names and part compositions. IDEA-001 owns them.
- How the Lit core reads the token files. IDEA-003#08 owns it.
- Framework packages (IDEA-004) and MCP and skills (IDEA-005).
- Theming controls in devtools. IDEA-006#06 owns them.
- Component code of any kind.
