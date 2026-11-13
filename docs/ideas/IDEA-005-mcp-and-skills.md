---
id: IDEA-005
status: define # define | specced | done | parked
result: # with status: done, the DEC-NNN or the commit SHA this idea produced
---
# IDEA-005: MCP and skills shipped in the package

## Intent
- Outcome: a decision on how 1.0 ships its MCP server and agent skills: inside the design system npm package with an `init` script, or as separate packages.
- User: Peter decides. Developers and their coding agents use the result in consumer projects.
- Why now: the MCP server and the skills must match the installed component version, and the inside-the-package direction is not tested yet.
- Success: research covers the packaging options; a test shows whether an `init` script from the package's `bin` installs a working MCP server and skills; Peter has chosen; a spec exists.
- Constraint: research comes first. Shipping inside the package is a direction to test, not a decision.
- Out of scope: devtools (IDEA-006). The content that the server and the skills describe comes from IDEA-001 to IDEA-004.

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A spec for the MCP server and the consumer skills of 1.0: where they ship, what `init` does, and what they contain.

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas).

### Waits
- Row 01 — running since 2026-11-12, after Peter's go (IDEA-001, Notes). Record: RES-030. Workflow run `wf_8bcd09ce-64d`, task `wm5cabubv`, from the script `.artifacts/v1/research/deep-research-opus-medium.js`. Its first agent's log records `claude-opus-5-5` and the effort `medium`. The run ended on 2026-11-12 with 105 agents and no error. RES-030 holds a partial answer: 10 findings on how seven projects ship and install MCP servers and skills; nothing confirmed from the agent hosts' own documentation. Two narrower runs are named in RES-030, Next action. The agent holds these runs until the decision rows of this idea are next: the facts are about tools that change each month, and no decision that needs them is on the frontier. Peter can ask for them sooner.

### Settled by the prompt
- The direction to test: the MCP server and the skills ship inside the design system npm package, so their versions always match the installed components.
- An `init` script, exposed through the package.json `bin`, installs the MCP server and the skills into a consumer's project.
- The alternative to evaluate is separate packages. Peter decides after the research.

### Evidence from 0.3.3
These records are evidence, not answers. Find them through the [decision index](../history/decision-index-0.3.md).

- The MCP server is a separate package with an exact peer version of the core (DEC-027 and DEC-116).
- Seven consumer skills ship in the core package, with TanStack Intent as their tooling (DEC-019 and DEC-048).

### Evidence from other ideas
- DEC-119 (IDEA-001#03): AI-written artifacts are one of the four audiences of 1.0. Such an agent often has no consumer project, so an `init` script from the package cannot reach it. Row 09 asks how it gets the guidance. It is also evidence for row 07: release 0.3.3 ships a skill named `html-artifacts`.
- DEC-118 (IDEA-002#18): each design spec reaches the repo as Markdown that an agent pulls from Figma. Row 06 decides whether the MCP server serves those records.

- RES-030, evidence for row 09: Nuxt UI runs a hosted MCP server over HTTP, which needs no install in a project. Evidence for row 04: TanStack Intent and Storybook 10.6 ship skills with the installed package, so the skills match the installed version.

### Boundary question
- Row 08: the kickoff prompt says the merge replaces the docs, but no idea names the documentation website. The row sits here because the MCP server serves the same records as the website.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | How do other libraries ship MCP servers and agent skills (inside the library package or apart), how do they install them into a consumer project, and how do agent hosts find them? | research | in-progress | — | — |
| 02 | How does release 0.3.3 ship its MCP server and consumer skills, and which limits do its records name? | research | open | — | — |
| 03 | Does an `init` script from the package's `bin` install a working MCP server and skills into a consumer project? | task | open | 01, 02 | — |
| 04 | Do the MCP server and the skills ship inside the design system package, or as separate packages? | interview | open | 01, 03 | — |
| 05 | What does `init` install, into which agent hosts, and how does it update on a new version? | interview | open | 04 | — |
| 06 | Which tools and records does the 1.0 MCP server serve? | interview | open | 04 | — |
| 07 | Which skills ship for consumers? | interview | open | 04 | — |
| 08 | Which idea owns the documentation website and its records? | interview | open | — | — |
| 09 | How does an agent that writes one HTML page, with no project and no package install, get the 1.0 guidance? | interview | open | 01, 04 | — |

## Not yet specified
- How `init` reaches a consumer who installs only a framework package. It sharpens after IDEA-004#07.
- Maintainer skills for this repo, as distinct from consumer skills.

## Out of scope
- Devtools (IDEA-006).
- The components, their design, the Lit core and the wrappers that the server and skills describe (IDEA-001 to IDEA-004).
