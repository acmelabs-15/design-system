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
- Out of scope: devtools (IDEA-006) and the documentation website (IDEA-007). The content that the server and the skills describe comes from IDEA-001 to IDEA-004.

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A spec for the MCP server and the consumer skills of 1.0: where they ship, what `init` does, and what they contain.

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas).

### Waits
- Row 01, the two follow-up questions of RES-030 — in the block of agent work that Peter approved on 2026-11-12, as two single research agents and not as workflow runs. Question 1 (the agent hosts' own documentation) is answered in RES-030 since 2026-11-12, by the researcher agent `a24d9f4296e3e280c`. Question 2 (the libraries that the first run missed, and how in-package skills refresh after an update) runs since 2026-11-12 in the same record: researcher agent `a3a0147c45ccc9e1d`, started without a name.
- RES-030, from question 1, evidence for rows 03, 04 and 05: the documentation of no host says that it finds skills or MCP server definitions inside `node_modules`. Skills from a package reach a host through a copy or a symlink in a host folder, through a plugin, or through a VS Code extension. So a package that holds its skills needs a step that puts them where a host reads; the record has the folders of each host. Two facts in it are newer than the first run: VS Code's documentation calls `.vscode/mcp.json` the deprecated format, and Windsurf's documentation now redirects to Devin Desktop. The list is in IDEA-001, Notes, "Block of agent work".
- Row 01, the sweep — done on 2026-11-12, after Peter's go (IDEA-001, Notes). Record: RES-030. Workflow run `wf_8bcd09ce-64d`, task `wm5cabubv`, from the script `.artifacts/v1/research/deep-research-opus-medium.js`. Its first agent's log records `claude-opus-5-5` and the effort `medium`. The run ended on 2026-11-12 with 105 agents and no error. RES-030 holds a partial answer: 10 findings on how seven projects ship and install MCP servers and skills; nothing confirmed from the agent hosts' own documentation. Two narrower runs are named in RES-030, Next action. The agent holds these runs until the decision rows of this idea are next: the facts are about tools that change each month, and no decision that needs them is on the frontier. Peter can ask for them sooner.

### Row 01 — resolved
- RES-030 is answered since 2026-11-12: the sweep, then one research agent for each of its two follow-up questions (`a24d9f4296e3e280c` and `a3a0147c45ccc9e1d`; both logs record `claude-opus-5-5` and the effort `medium`).
- Facts for row 04, inside the package or apart:
  - The documentation of no agent host says that it finds skills or MCP server definitions inside `node_modules`. So "inside the package" always needs a step that puts a copy, a link or a pointer where a host reads.
  - Libraries that keep the guidance inside the installed package, so that it matches the version: TanStack Intent (skills in the package, read through its CLI), Next.js and the AI SDK (documentation inside the package), and Storybook 10.6 (its CLI prints each skill from the installed Storybook).
  - Libraries with a separate package or a hosted server, which do not match the installed version: MUI, Chakra UI, Mantine, Astro, Nuxt UI, Figma and the Vercel platform. Tailwind CSS ships no server and no skills.
- Facts for row 05, what `init` installs and how it updates:
  - `antd setup` of Ant Design is the closest model of an `init` script. For each host it writes the MCP config file, a copy of the skill and a marked block in the instructions file. RES-030 has the table of files for each host.
  - After an update, three ways bring the skills to the project again: nothing to refresh, because the project holds only a pointer and the host reads the package each time (TanStack Intent, Storybook 10.6, Next.js); a command that the developer runs again (`antd setup`, `storybook upgrade`); or a `prepare` script that links the skills again on each install (skills-npm).
  - The folders differ by host. `.agents/skills/` is read by Codex, Cursor, Gemini CLI and Devin; Claude Code reads `.claude/skills/`. The MCP file is `.mcp.json` for Claude Code and now also for VS Code Copilot.
- Facts for row 09, an agent with no project: Astro, Nuxt UI, Figma and the Vercel platform run a hosted MCP server over HTTP, which needs no install. Such a server serves the latest documentation and not an installed version.
- Limits of the record: host facts change each month, and the record says to check them again before row 03 uses them. The Storybook 11 behaviour comes from a beta.

### Settled by the prompt
- The direction to test: the MCP server and the skills ship inside the design system npm package, so their versions always match the installed components.
- An `init` script, exposed through the package.json `bin`, installs the MCP server and the skills into a consumer's project.
- The alternative to evaluate is separate packages. Peter decides after the research.

### Evidence from other ideas
- DEC-119 (IDEA-001#03): AI-written artifacts are one of the four audiences of 1.0. Such an agent often has no consumer project, so an `init` script from the package cannot reach it. Row 09 asks how it gets the guidance.
- DEC-118 (IDEA-002#18): each design spec reaches the repo as Markdown that an agent pulls from Figma. Row 06 decides whether the MCP server serves those records.

- RES-030, evidence for row 09: Nuxt UI runs a hosted MCP server over HTTP, which needs no install in a project. Evidence for row 04: TanStack Intent and Storybook 10.6 ship skills with the installed package, so the skills match the installed version.

### Boundary with IDEA-007
- DEC-139, Peter, 2026-11-12: a seventh idea, IDEA-007, owns the documentation website, its pages, its examples, the blocks section and the records that this idea's MCP server also serves. Row 08 is resolved.
- Row 06 here and IDEA-007#04 are two views of one source of records. Decide them together.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | How do other libraries ship MCP servers and agent skills (inside the library package or apart), how do they install them into a consumer project, and how do agent hosts find them? | research | resolved | — | [RES-030](../research/RES-030-mcp-and-skills-shipping-landscape.md) |
| 03 | Does an `init` script from the package's `bin` install a working MCP server and skills into a consumer project? | task | open | 01 | — |
| 04 | Do the MCP server and the skills ship inside the design system package, or as separate packages? | interview | open | 01, 03 | — |
| 05 | What does `init` install, into which agent hosts, and how does it update on a new version? | interview | open | 04 | — |
| 06 | Which tools and records does the 1.0 MCP server serve? | interview | open | 04 | — |
| 07 | Which skills ship for consumers? | interview | open | 04 | — |
| 08 | Which idea owns the documentation website and its records? | interview | resolved | — | [DEC-139](../decisions/DEC-139-seventh-idea-owns-the-documentation-website.md) |
| 09 | How does an agent that writes one HTML page, with no project and no package install, get the 1.0 guidance? | interview | open | 01, 04 | — |

## Not yet specified
- Which instructions file Claude Code reads at the start of a session: two libraries' guides disagree (RES-030, Follow-ups), and neither run read Claude Code's own documentation on it. It decides where `init` writes its block. Check it at its source when row 05 is next.
- How `init` reaches a consumer who installs only a framework package. It sharpens after IDEA-004#07.
- Maintainer skills for this repo, as distinct from consumer skills. Peter, 2026-11-12 (IDEA-002, Row 10 — partial): an internal skill that tells an agent how to bring the tokens in from Figma is acceptable for the work of the maintainers.

## Out of scope
- Row 02, retired on 2026-11-12: "How does release 0.3.3 ship its MCP server and consumer skills, and which limits do its records name?" DEC-125 takes release 0.3.3 out as input.
- Devtools (IDEA-006).
- The documentation website. IDEA-007 owns it (DEC-139).
- The components, their design, the Lit core and the wrappers that the server and skills describe (IDEA-001 to IDEA-004).
