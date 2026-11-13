---
id: IDEA-010
status: define # define | specced | done | parked
result: # with status: done, the DEC-NNN or the commit SHA this idea produced
---
# IDEA-010: CI/CD, deployment and build tooling

## Intent
- Outcome: a comprehensive plan for the CI/CD, the deployment and the build tools of 1.0, from research on what the reference systems and TanStack do. By the agent's placement it also holds the clean start of the branch and the root files of the repo.
- User: Peter decides. The maintainers and their agents work with the result each day.
- Why now: Peter, 2026-11-13: "Version one had slowness here."
- Success: open, rows 03, 05 and 06. A draft: the research is in the repo; Peter has chosen the tools, the pipeline, the release flow and the deployment; he has decided what survives the removal of the old system and when it happens; a spec exists.
- Constraint: research comes first. Nothing is removed from the repo before Peter has seen the list of what is there and decided (row 05).
- Out of scope: the component code (IDEA-003), the wrappers (IDEA-004), what the MCP server and the skills hold (IDEA-005), and the content of the website (IDEA-007).

<!-- After the user's explicit yes to this intent, add the line: Confirmed by <name> on <YYYY-MM-DD>. -->

## Destination
A spec for the repository of 1.0: its build tools, its checks in CI, its release flow and its deployment, with the decisions on the clean start. Peter's words: "a comprehensive plan".

## Notes
- Program rules: [IDEA-001, Program rules for all six ideas](IDEA-001-component-inventory.md#program-rules-for-all-six-ideas). They hold for this idea too.
- This idea is a stub, and it is a proposal. Peter, 2026-11-13: "This is new scope and probably its own idea; decide with me." Row 01 holds that decision. The agent made the file now, because no other idea covers this scope and he asked that nothing waits only in his message. Source: [Peter's additional scope](../design/v1-additional-scope.md) of 2026-11-13, item 7.
- His words for the research: "Research what the four reference systems and TanStack do for CI/CD, deployment and build tools, then put together a comprehensive plan."
- No research has started. A research agent needs Peter's go, as the program rules say.

### Placed here by the agent
- Item 10 of the additional scope, "Starting fresh": rows 04, 05 and 06. Reason: the removal changes the whole repository, its checks and its pipelines, and no other idea owns the repository. Peter asked for "a row in the right idea".
- Item 9, the research on the root AGENTS.md, CLAUDE.md and README.md: the deferred row 07. Reason for this idea: the three files belong to the repository root. Reason for `deferred`: the files exist in any case, and the research settles how to write them, not what 1.0 holds.
- If Peter decides in row 01 that this is no idea of its own, these rows move with the others.

### Starting fresh
- Peter, 2026-11-13: "This refactor doesn't reuse what's in the repo now. At some point, everything currently there needs to be removed so the new system starts clean on the branch. When that happens is an open question."
- Peter, same message: "What survives the wipe is also an open question to go over with me. That includes the docs directory, the research, the specs and the glossary, plus agent context files and saved prompts. Material from the old system may not be worth keeping at all. Don't assume any of it stays or goes. List what's there, and we decide together before anything is removed."
- DEC-125: release 0.3.3 is no input for 1.0. The kickoff prompt: nothing from the old system survives in code unless a decision record keeps it. Neither says when the removal happens or what happens to the records.

### Evidence from other ideas
- IDEA-003, "Not yet specified": the package layout and the build tooling of the core, and what replaces `docs/agents/verification.md` and `docs/agents/repository.md`, which describe the 0.3.3 code. Row 03 and row 05 here bear on both.
- IDEA-001, Notes, "Working state": no product check has run on `v1`; a verifier of the old layout still exists in `scripts/`. Other sessions hold branches that change the CI of the old system.
- RES-029 (IDEA-004#01), for row 03: how Stencil, Ionic and `@lit/react` test wrappers in CI, with their runners and browsers.
- RES-047 (IDEA-007#02), for row 03: where ten design systems host their documentation websites.

### Row 02 — resolved
- RES-068, 2026-11-13, from the files of each repository at a named commit, the public API of GitHub and the npm registry. Nothing was run. The component code of Geist is not public, so its row is empty apart from its font.
- Facts for row 03, from ten repositories (shadcn/ui, Radix Primitives, Radix Themes, Chakra UI, Ark UI, Zag.js, and TanStack Query, Router, Table and Form):
  - Monorepo tool: TanStack uses Nx with a remote cache and several machines for one run. shadcn/ui and Radix Themes use Turborepo with no remote cache in CI. Radix Primitives, Chakra UI and Zag.js use the workspaces of pnpm alone. Ark UI uses the workspaces of Bun 1.4.2, the version that this repo pins.
  - Package manager: pnpm in nine of the ten; Bun in Ark UI.
  - Bundler: tsdown (Zag.js, TanStack Query and Table), tsup (shadcn/ui), esbuild scripts (Radix), Rollup (Chakra UI), the library build of Vite (TanStack Router and Form, Ark UI).
  - Tests: Vitest in each repository that has unit tests. Where a browser runs in CI it is Chromium, except Radix Themes, which runs Chromium, Firefox and WebKit for its visual tests. Chakra UI, Ark UI and TanStack Query run no browser in CI.
  - Release: Changesets in each public repository except Radix Themes, which releases by hand. Most publish with npm's trusted publishing, which adds provenance; Chakra UI and Zag.js publish with a token.
  - Previews: the documentation sites of shadcn/ui, Radix, Chakra UI, Ark UI and Zag.js deploy on Vercel with a preview for each pull request. TanStack serves all documentation from one site on Cloudflare Workers that reads the docs of each repository from GitHub. TanStack publishes each pull request as a package preview through pkg.pr.new; shadcn/ui does it on request, by a label.
  - Time of the main workflow of a pull request, as the median of about 30 runs that passed: 1.6 minutes (Chakra UI), 2.3 (Radix Primitives), 3.0 (Ark UI), 3.4 (Radix Themes), 3.9 (Zag.js), 4.5 (TanStack Form), 7.9 (TanStack Query), 8.2 (TanStack Table), 12.5 (shadcn/ui) and 13.0 (TanStack Router).
  - Statements of maintainers: TanStack uses Nx only as a runner of scripts with a cache, and says that its extra machines "incur quite a significant startup delay". Zag.js moved from tsup to tsdown on 2026-11-02, because tsup's way to write type declarations does not work with TypeScript 7. Radix Primitives moved from ESLint and Prettier to oxlint and oxfmt, and from Cypress to Playwright, with no stated reason.
- Limits of the record: the times are wall time of runs that passed at the first attempt; for TanStack the share of the cache is visible only in Nx Cloud. Few maintainers state why they chose a tool.
- Peter asked for "a comprehensive plan" from this research. Row 03 is that decision; the agent prepares a proposal for the plan before it asks.

### Second block of agent work
- Row 04 — running since 2026-11-13, in the second block of agent work. Task agent `a2dfef76d0234e4bb`, started without a name; its log records Opus 5.5 and the effort `medium`. Its task record is RES-076, which the main session created before the start. Its brief is `.artifacts/v1/briefs/IDEA-010-04.md` with `common-task.md`, and its scratch folder is `.artifacts/v1/task/IDEA-010-04/`. The task reads the files of release 0.3.3, because the list is its purpose; it removes and changes nothing. Check the log again when the agent ends, before its record is read.
- Row 02 — done on 2026-11-13: RES-068, from the researcher agent `ae5fe8e4a588868c0`, started without a name. Its log records Opus 5.5 and the effort `medium` on all 140 requests, checked after the agent ended. It was the third start of the row; two starts of the same day ended in outages of the Claude login.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | Is CI/CD, deployment and build tooling an idea of its own, which is this one, or a part of another idea? | interview | open | — | — |
| 02 | What do shadcn/ui, Radix (Primitives and Themes), Chakra UI, Geist and TanStack use for CI/CD, deployment and build tools: the monorepo tool, the package manager, the bundler, the test runners and browsers in CI, caching, the release and publish flow and preview deployments, and how long do their pipelines take? | research | resolved | — | [RES-068](../research/RES-068-ci-cd-and-build-tools-of-the-reference-systems.md) |
| 03 | Which build tools, CI pipeline, release flow and deployment does 1.0 use? | interview | open | 02 | — |
| 04 | List what the branch holds now, by area: code, packages, website, tools, CI, docs, research, specs, glossaries, agent context files and saved prompts, with the size of each area and what uses it. | task | in-progress | — | — |
| 05 | What survives the removal of the old system: for each area of the list, does it stay, go or move? | interview | open | 04 | — |
| 06 | When is the old system removed from the branch? | interview | open | 04 | — |

## Deferred rows
Rows of the spec phase, by [the workspace rule](../agents/workspace.md#deferred-rows). They are not open and not on the frontier. Each one moves into the spec of this idea when its spec phase starts.

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 07 | What do other design system libraries, TanStack and other packages put in their root AGENTS.md, CLAUDE.md and README.md? The findings are used to write the three root files of 1.0. Source: Peter's additional scope of 2026-11-13, item 9. | research | deferred | — | — |

## Not yet specified
- Whether "deployment" covers only the documentation website, or also a CDN for the browser bundles and the hosted MCP server, if 1.0 has one. It sharpens with IDEA-003#11, IDEA-005#04 and IDEA-007#05.
- Who writes the new root AGENTS.md. DEC-125 leaves the change of the present file to Peter.

## Out of scope
- The component code and the styles. IDEA-003 owns them.
- Which framework targets ship. IDEA-004 owns it.
- Which tool builds the documentation website. IDEA-007#05 owns it; this idea owns how the website is deployed.
