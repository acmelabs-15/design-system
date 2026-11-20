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

### Additional scope of 2026-11-13
Source: [Peter's additional scope](../design/v1-additional-scope.md) of 2026-11-13. IDEA-001, Notes, has the table of all items.

- Item 5, his words: "Research how other design systems build their skills and MCPs: which skills they ship and what they do, which tools their MCPs expose and what they do, and how they package and distribute them." RES-030 answers the last part, how they package and distribute. Row 10 holds the first two parts.
- Item 5, his words: "Study Storybook's skills and MCP, especially the MCP UI tools that return rendered UI. Find out who else does this, how it works, and what makes sense for us." Row 11 holds the research, and row 12 the decision. He asks for "what makes sense for us", so the record of row 11 can hold an assessment against the decisions of 1.0; it keeps that part apart from its facts.
- Item 2, an open question that he wants to settle: are the blocks exposed "through the MCP, a skill, or both?" Row 13 holds it. Since 2026-11-20 the blocks have an idea of their own, IDEA-011 (DEC-156); it owns their list, and row 13 stays here.
- Item 11: the design skill for Figma is an idea of its own, IDEA-009.

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

- RES-071 (IDEA-006#09), evidence for row 06: TanStack Devtools has a package, `devtools-webmcp`, that gives an agent in the browser a way to read a library's internals during development. The record did not read it further. Spectrum's site lists MCP servers and skills among its tools.

### Boundary with IDEA-007
- DEC-139, Peter, 2026-11-12: a seventh idea, IDEA-007, owns the documentation website, its pages, its examples, the blocks section and the records that this idea's MCP server also serves. Row 08 is resolved.
- Row 06 here and IDEA-007#04 are two views of one source of records. Decide them together.

### Row 11 — resolved
- RES-066, 2026-11-13, from the documentation and the published code of Storybook 10.6.7 and 11.0.0-beta.2, the MCP Apps specification and the repositories of other servers. No server ran in the research.
- Facts for row 12, tools that return rendered UI:
  - The mechanism is MCP Apps, an extension of MCP that its specification marks stable since 2026-01-26. A tool names a `ui://` resource, which is one HTML page. The host shows that page in a sandboxed iframe and sends it the result of the tool.
  - Storybook's `stories-preview` works this way. Its result holds only the addresses of the stories; the page loads each live story from the dev server on the developer's machine. So it needs a running Storybook.
  - NVIDIA Elements, a design system of Lit web components, does it with no running server: the page holds the component bundle and renders the markup that the tool result carries. It has three such views: an example preview, an icon list and a token explorer.
  - Host support differs. The community's list ticks Claude on the web, Claude Desktop, VS Code Copilot, ChatGPT and Cursor, among others. Claude Code has no tick, and Codex and Gemini CLI are not in the list. Row 14 checks those three.
  - The specification requires a text result for each tool with a view, so a view is an addition for some hosts and replaces nothing.
  - The other way to show UI is an image in the tool result, as Figma's `get_screenshot` does. For web components that needs a browser on the server's side.
- The record has an assessment against the decisions of 1.0, kept apart from its facts, as Peter asked for "what makes sense for us". It chooses nothing. Its open points: which hosts the agents of our users run in; whether a headless browser in the MCP server counts as rendering on the server (DEC-127); whether a view loads the components from a CDN or holds them; whether the views show the examples of the website or render their own.
- Facts for row 06, the tools of the server: Storybook's server has nine tools in three sets (development, documentation, tests). Its documentation tools need a components manifest, which a Storybook of web components does not get in 10.6. NVIDIA Elements' server has 17 tools and four prompts.
- Evidence for row 09, an agent with no project: the view of NVIDIA Elements needs no project and no server, and the hosts where such agents often run are ticked for MCP Apps.

### Row 10 — resolved
- RES-070, 2026-11-13, from the published packages and repositories of fifteen systems. No server was started. Fourteen ship an MCP server and eleven ship skills. Web Awesome, the only library of web components in the set, ships skills and `llms.txt` files and no MCP server.
- Facts for row 06, the tools of the server. The record joins every tool into concepts:
  - Nearly every server has: list the components; search the components or the documentation; get the documentation or the API of one component; get an example.
  - Many have: tokens and the theme; guidelines for usage and accessibility; icons; patterns, templates or blocks; a guide for a migration; several lookups in one call.
  - Six check the code that an agent wrote: for example Primer runs Stylelint, PrimeTek checks a usage against the API metadata, and Shopify checks each code block.
  - One system only: shadcn/ui returns the command that adds a component; Atlassian checks the accessibility of a running local page with a headless browser; MUI generates code on its own backend.
  - The number of tools goes from 3 (MUI) to 21 (Atlassian). Three servers also have prompts, and two have resources.
- Facts for row 07, the skills:
  - Most systems ship one umbrella skill, "build UI with this library". Some add skills for theming and design, for a migration between versions, and for a review of existing code.
  - Common steps inside a skill: read the project first (its framework, its installed components); ask the server or the command line tool before writing code; run a check before the work is called done.
- What the sources say about why, and what did not work:
  - The knowledge of a model is stale, so a server gives the current props and names.
  - Agents skip the server: MUI saw hosts choose their own edit tools, and Web Awesome writes "the agent never looked". Both answer with a block in the project's instructions file or with a skill.
  - The server gives the facts, and the skill says when to ask for them (Carbon).
  - Each tool costs context, about 200 to 500 tokens by Angular's count. Several systems answer with filters, batches and fewer tools.
- For IDEA-005#13, blocks for agents: Chakra UI, Nuxt UI and Primer have tools that list and return patterns, templates or blocks.
- Many of the servers are built on the same `llms.txt` files that the documentation website serves. That bears on IDEA-007#04, the source of the records.
- Limits of the record: no server ran, so no live list of tools was compared with the code. Fluent UI, Material Web and Vaadin were not checked.

### Row 03 — resolved
- RES-077 and its result file, 2026-11-13: a throwaway package with a small MCP server, two skills and an `init` command in its `bin`, installed from a local tarball into fresh projects. One machine, one run. Nothing was published.
- The answer to the row: yes, with limits. Facts for row 04, inside the package or apart:
  - `init` ran from the `bin` after an install with npm, with pnpm and with the pinned Bun, and wrote the same files each time.
  - The installed server answered over stdio by the exact command that `init` wrote.
  - After an update of the package with no new `init`, the server answered as the new version at once, and so did each skill that is a link to the installed package. So a pointer keeps the server and the skills in step with the installed components, which is the reason for the direction of the prompt.
- Facts for row 05, what `init` installs and how it updates:
  - A skill reaches a host as a link to the installed package where the host's documentation allows links (Claude Code, Codex), and as a copy where it does not say (Cursor, Gemini CLI, VS Code). A copy stays at the old version until `init` runs again.
  - A skill that a new version removes leaves a dead link or an old copy, because the trial's `init` only adds and replaces. Gemini CLI then served the removed skill from its old copy. So `init` needs a step that removes.
  - The command for the server is a path relative to the project root. A host that starts in a subfolder fails to connect.
  - A second run of `init` kept every other MCP server, setting and skill of the project.
  - Each host asks a person before it uses a server from a project: Claude Code lists it as "Pending approval", and Codex and Gemini CLI need a trusted folder. So `init` cannot make the server work with no step of the developer.
  - The current revision of the MCP specification, 2026-07-28, has no `initialize` handshake; Claude Code spoke the new form. A server of 1.0 must answer both forms for a time.
- Facts for IDEA-004#07 and for "How `init` reaches a consumer who installs only a framework package" under "Not yet specified": with only a package that depends on the first, npm and Bun make the `bin` available, and pnpm does not; `pnpm exec` fails with "Command not found".
- Not observed, and in row 15: a real approval by a person in the dialog of each host (the trial wrote the hosts' state files in a scratch home folder); a session in which a model uses a skill and calls the tool; Cursor, VS Code Copilot and Devin. The trial agent asks whether Peter wants these before rows 04 and 05. The main session's reading: they do not separate the two options of row 04, because they hold for a package of its own too. They bear on row 05, so row 15 blocks row 05.

### Row 04 — pending question
- Asked on 2026-11-20 through the question dialog: do the MCP server and the skills ship inside the design system package, or as separate packages? The question gives the result of the trial RES-077: a pointer from the project to the installed package keeps the server and the skills at the version of the installed components, with no step after an update.
- Options: "Inside the package (Recommended)"; "Separate packages".
- The agent recommends inside the package. Reason: it is the direction of the kickoff prompt, and the trial shows that its reason holds. Stated costs: the package grows for each consumer, also for one with no coding agent; a host that takes only a copy of a skill needs `init` again after an update; and a pnpm user who installs only a framework package does not get the `init` command.
- Not in this question: what `init` installs (row 05), and how an agent with no project gets the guidance (row 09).

### Row 04 — partial
- Source: Peter's reply of 2026-11-20, typed into the question dialog. His words in full:

  > okay so i asked you to do research to validate our disagreement on the implemenation - no decision has been made - we're waiting for more information - /deep-research in regards to where the mcp and agent skills live - I actually am not sure about this either - I do not want to use tanstack intent - I'd like you to research this - this does not have to be design system package specific - I'd like for the research here to have a large sample size - we always look to tanstack - but I don't want ot use intent here and they almost certain use it - but every large framework/package/library adn their moms are providing skills and mcps framework/package/library - so like storybook, ag-grid, chakra-ui, and so on - please be comprehensive

- The first part is about IDEA-003#06 and corrects the agent: no decision is made there. IDEA-003, Notes, "Row 06 — partial" holds it.
- Settled for this idea: 1.0 does not use TanStack Intent (DEC-154). He gives no reason. Conditions: none stated.
- Not settled: where the MCP server and the skills live. "I actually am not sure about this either". No question on row 04 is pending.
- Asked for by him: research with `/deep-research` on where the MCP servers and the agent skills of large frameworks, packages and libraries live. His conditions for it: a large sample; not only design systems; comprehensive. His examples: Storybook, AG Grid, Chakra UI. Row 16 holds it, and row 04 waits for it.
- What the records already hold, so that row 16 does not repeat it: RES-030 has how about twelve libraries ship and install, with the folders of each host; RES-070 has the skills and the tools of fifteen design systems; RES-077 has the trial of an `init` command. Row 16 widens the sample beyond them and beyond design systems.
- For the next ask: do not ask him to decide this row before row 16 is resolved. He decides from wide evidence.

### Row 04 — pending question, from the evidence of row 16
- Asked on 2026-11-20 through the question dialog, after the facts of RES-082 in chat: where do the MCP server and the guidance for agents of 1.0 live? The question gives the counts of the 112 projects.
- Options: "Guidance in the package, server as a thin package of its own (Recommended)"; "Everything inside the package"; "Everything apart".
- The agent recommends the first. Reasons: it is the shape that most surveyed projects have; the guidance inside the package matches the installed version with no step after an update, as about 23 projects do; a server that reads the installed package gives the same match, as about 16 projects do; and a consumer with no coding agent does not carry the server. Stated costs: two packages to release, and one more step to install the server. DEC-154 rules out TanStack Intent in each option.
- The kickoff prompt's direction is the second option. No surveyed project keeps its server only inside its main package; the trial RES-077 showed that it works.

### Row 04 — third reply, and the map by Peter's list of decisions
- Source: Peter's reply of 2026-11-20 to the question from the evidence of row 16, typed into the question dialog. He chose no option. His words: "I just read through the research document - lots of numbers, which is absolutely awesome - so it sounds like there are a handful of decisions that need to be made regarding skills and mcps - 1. How the mcp and skills stay at the version of the installed library. 2. Where the mcp server lives. 3. Where guidance for coding agents lives (this will almost certainly be "in several places"). 4. How the mcp and skills are installed. 5. How the mcp and skills get updated. 6. How the mcp and skills are distributed. If I left any decisions out or didn't accurate capture a decision please add it/update it - can you list all the decisions that need to be made, numbered - and then for each write down all of the respective solutions for each decision - then I'd like you to create a list of the the top idk 10-15 packages we hold in very high regard - I'm thinking like ag-grid, storybook, shadcn, stripe, turbo, prisma, next.js, vite, bun, apollo-client, vercel ai sdk, shopify, figma (if there any i didn't include in this list that you feel strongly should have been included please just add them) and with each of the solutions include which packages from taht list use which solution"
- Not settled: no decision of the six. His one view: the guidance "will almost certainly be" in several places.
- Done on 2026-11-20: the list is in RES-082, under "Decisions and their solutions, with the packages held in high regard". It has ten decisions: his six and four that the agent added (whether 1.0 has an MCP server at all and what its job is; which forms the guidance takes; which agent hosts; an agent with no project). It has his thirteen packages and four that the agent added: TanStack, Playwright, Ant Design and Web Awesome. The agent showed him the list in chat.
- The map follows his list since that day. Row 04 held two of his decisions and is superseded by rows 18 and 19. Row 05 held three and is superseded by rows 23, 24 and 25.

| Decision of the list | Row |
|---|---|
| 1. An MCP server at all, and its job | 17 |
| 2. Where the MCP server lives | 18 |
| 3. The forms of the guidance | 20 |
| 4. Where the guidance lives | 19 |
| 5. The version of the installed library | 21 |
| 6. Distribution | 22 |
| 7. Install | 23 |
| 8. Update | 24 |
| 9. Agent hosts | 25 |
| 10. An agent with no project | 09 |

- Rows 06, 07, 12 and 13 stay: what the server serves, which skills ship, rendered UI, and the blocks for agents. Their links now name rows 17 and 20.
- Peter, 2026-11-20, after he saw the list: "you don't need to include none or doesnt' do it anymore". The agent removed the rows for "none" and for what a package no longer does, in RES-082 and in chat. The list now holds only solutions that a package of his list uses today. The agent reads this as a rule for the list. Whether "no server" stays an option of row 17 is not said; the question of row 17 asks for the job of the server and names that point.
- Pending question, asked on 2026-11-20 through the question dialog: what is the job of the MCP server of 1.0 beside the guidance? Options: "Tools that files cannot give (Recommended)"; "The documentation and the API of the library"; "Both". The agent recommends the first: the documentation is guidance inside the package, where it matches the installed version, and the server does what a file cannot do, which is a search over all records, a check of code that an agent wrote, and a rendered preview. Its evidence: the packages that changed most recently moved their documentation into the package (Next.js, Turborepo, Prisma, the Vercel AI SDK, Web Awesome); six of fifteen design systems have tools that check written code (RES-070); a rendered view shows in some hosts only (RES-080). Stated cost: an agent host with no skills and no files, which is an agent with no project, gets less from such a server; row 09 holds that case.

### Row 16 — resolved
- RES-082, 2026-11-20: 112 projects, each record checked by a second agent. Its 183 agents ran on Opus 5.5 at `medium`, checked in the logs after the run; none ran `gh`. The main session read the facts across the records. It reads the record of a single project when a later row needs it.
- Facts for row 04, inside the package or apart:
  - The MCP server: 34 projects have none; 25 have several forms; 24 a package of its own; 18 a hosted server; 11 have it inside the command line tool or the dev server of the project, such as the Angular CLI, the Next.js dev server, the shadcn CLI and Playwright. No project has its server only inside its main library package.
  - The guidance for agents: 88 projects have it in several places; 2 only inside the main package, Web Awesome and Redux Toolkit; about 25 more have one part inside the main package, among them Next.js, Turborepo, Prisma, SolidJS, React Router, Base UI, tRPC, Panda CSS, Quasar, Playwright and Angular.
  - Reasons that maintainers state: inside the package so that versions match, about 25 projects; hosted so that the documentation stays current, about 11.
  - Against a server: Remotion dropped its server for cost, staleness and unreliable use; Shopify removed MCP from its plugin, because skills and MCP overlap; Playwright says that its command line tool with skills uses fewer tokens.
- Facts for row 05, what `init` installs and how it updates:
  - The `skills` command line tool, `npx skills add`, distributes skills for about 60 projects. Plugin marketplaces of agent hosts: about 47. An own command or `init`: about 35, such as `antd setup`, `ng new --ai-config`, Laravel's `boost:install` and `prisma skills sync`. TanStack Intent: 3, and DEC-154 rules it out for 1.0.
  - Guidance that points at the installed package needs no step after an update: about 23 projects. Prisma runs a script on install. About 20 ask for a command again, and about 16 update with a plugin.
  - MCP servers: about 16 read the installed package or the project; about 14 take a version as an argument; about 31 serve only the latest documentation.
- Lit, the base of the core of 1.0, has neither a server nor guidance for agents.
- Row 04 is free: its research is resolved.

### Row 16 — running
- Started on 2026-11-20 by the main session, on Peter's words `/deep-research` in his reply to row 04. Record: RES-082, which the main session fills from the result of the run.
- The run: `wf_48bdc7bd-7b0`, task `weew239hp`, from the script `.artifacts/v1/research/survey-by-subject.js` (scratch, outside git). The script is the `deep-research` workflow changed for a large sample, as Peter asked: the built-in script reads at most 15 sources and verifies at most 25 claims, and its run for IDEA-003#25 reached only six of twelve named systems. In the changed script four listers find projects by different routes, one agent researches each project from its primary sources, a second agent checks each record, a critic names notable projects that are missing, and one agent states the facts across all records.
- Sample: a seed list of 74 projects, among them Storybook, AG Grid and Chakra UI, with frameworks, component libraries, data grids, build tools, test tools and backend libraries; the listers add more; the cap is 84, and the critic can add 8.
- Each record has nine fields: the place of the MCP server, its detail, how it matches the installed version, the place of the guidance for agents, its detail, the install steps, the update, the tool that distributes the skills, and the reason that the maintainers state.
- Each agent runs on Opus 5.5 at the effort `medium`, set on each call of the script. The go is Peter's own `/deep-research` with "large sample size" and "please be comprehensive"; the agent chose the changed script, by the precedent of IDEA-001#01.
- Stopped and started again on 2026-11-20. Peter wrote: "use the git instead of gh". The agents of the first run read GitHub with `gh api`, which acts with his login: 23 of its 52 agents had done so. The main session stopped the run `wf_48bdc7bd-7b0` and kept its 43 first records and the candidates of its listers in `.artifacts/v1/research/RES-082-run1/`. The second run is `wf_1e4f16be-d04`, task `w7nqfxq8u`, from the same script with one more rule: read a repository through its public web pages or with `git`, never with `gh`. It has 106 subjects: the 43 with a first record go straight to the checking agent, and 63 get both steps, 32 of them found by the listers. RES-082, Next action, holds the detail.

### Row 14 — resolved
- RES-080, 2026-11-20, from the documentation, the release notes and the source code of each host, and from a test with a minimal server in a scratch home folder with no sign-in. The researcher agent `a3eeac1a7a9fad48f` ran on Opus 5.5 at `medium` on all 134 requests, checked after it ended. The main session read the record in full.
- Facts for row 12, tools that return rendered UI:
  - None of the three shows a view in its terminal use: Claude Code 2.1.329, Codex CLI 0.154.0 and Gemini CLI 0.58.0. Each connected to the server and listed the tool. None declared MCP Apps to the server, and none read the `ui://` page.
  - Claude Code's documentation names the rendering of such views only for Claude Desktop and claude.ai, and for an application that embeds Claude Code through the Agent SDK and renders the view itself.
  - Codex passes the declaration on to the server only when a client with a window declares it. Its terminal paths do not.
  - Gemini CLI has no mention of MCP Apps in its code, its documentation or its release notes.
  - The specification gives the fall-back: a host with no views treats the tool as a normal tool, and a tool "MUST return meaningful content array even when UI is available". So a view adds something for some hosts and replaces nothing.
- So for the coding agents in a terminal, a view does nothing today. It shows in the hosts that RES-066 lists as ticked, such as Claude on the web, Claude Desktop, VS Code Copilot, ChatGPT and Cursor.
- Not confirmed: what each host gives back to the model for the tool call, because each run with a model stopped at the missing sign-in; the interactive terminal of each host, which was not run.
- A follow-up of the record, and no row yet: whether the Code tab of Claude Desktop and Codex Desktop render a view from a local server. It matters only if row 12 turns on those two hosts.

### Third block of agent work
- Row 14 — running since 2026-11-20, on Peter's go of that day (IDEA-001, Notes, "Third block of agent work"). Researcher agent `a3eeac1a7a9fad48f`, started without a name; its log records Opus 5.5 and the effort `medium` at the first check. It claims its own record; find it by `from: IDEA-005#14`. Its test server and logs go to `.artifacts/v1/trial/IDEA-005-14/`. Brief: `.artifacts/v1/briefs/IDEA-005-14.md`. Check the log again when the agent ends, before the record is read.

### Second block of agent work
- Row 03 — done on 2026-11-13: task record RES-077, from the task agent `ac68d178289fa47aa`, started without a name. Its log records Opus 5.5 and the effort `medium` on all 126 requests, checked after the agent ended. Its result file is `.artifacts/v1/trial/IDEA-005-03/IDEA-005-03-result.md` (scratch, outside git), with the logs of each case and the trial packages. The main session read the result file and the record in full. It checked that the repo holds no new file except the record, and that no host file in the real home folder names the trial package.
- Row 10 — done on 2026-11-13: RES-070, from the researcher agent `ae876dde1bf071a5a`, started without a name. Its log records Opus 5.5 and the effort `medium` on all 176 requests, checked after the agent ended. It was the third start of the row; two starts of the same day ended in outages of the Claude login. The main session read the Answer, with its two tables, and the findings on MUI, Chakra UI and shadcn/ui in full. It reads the findings on each other system when rows 06 and 07 are next.
- Row 11 — done on 2026-11-13: RES-066, from the researcher agent `a390f05d09d1064c0`, started without a name. Its log records Opus 5.5 and the effort `medium` on all 108 requests, checked after the agent ended. It was the third start of the row; two starts of the same day ended in outages of the Claude login.

## Map

| # | Question | Type | Status | Blocked by | Result |
|---|---|---|---|---|---|
| 01 | How do other libraries ship MCP servers and agent skills (inside the library package or apart), how do they install them into a consumer project, and how do agent hosts find them? | research | resolved | — | [RES-030](../research/RES-030-mcp-and-skills-shipping-landscape.md) |
| 03 | Does an `init` script from the package's `bin` install a working MCP server and skills into a consumer project? | task | resolved | 01 | [RES-077](../research/RES-077-init-script-trial.md) |
| 04 | Do the MCP server and the skills ship inside the design system package, or as separate packages? | interview | superseded by 18 | 01, 03, 16 | — |
| 05 | What does `init` install, into which agent hosts, and how does it update on a new version? | interview | superseded by 23 | 15 | — |
| 06 | Which tools and records does the 1.0 MCP server serve? | interview | open | 17, 10 | — |
| 07 | Which skills ship for consumers? | interview | open | 20, 10 | — |
| 08 | Which idea owns the documentation website and its records? | interview | resolved | — | [DEC-139](../decisions/DEC-139-seventh-idea-owns-the-documentation-website.md) |
| 09 | How does an agent that writes one HTML page, with no project and no package install, get the 1.0 guidance? | interview | open | 01, 17 | — |
| 10 | Which skills do other design systems ship and what does each skill do, and which tools do their MCP servers expose and what does each tool do? RES-030 holds how they package and distribute them. | research | resolved | — | [RES-070](../research/RES-070-skills-and-mcp-tools-of-other-design-systems.md) |
| 11 | How do Storybook's skills and its MCP server work, and in particular its MCP tools that return rendered UI; who else returns rendered UI from an MCP tool, and how does that work? | research | resolved | — | [RES-066](../research/RES-066-storybook-mcp-and-rendered-ui-tools.md) |
| 12 | Does the 1.0 MCP server have tools that return rendered UI? | interview | open | 17, 11, 14 | — |
| 13 | Are the blocks exposed to agents through the MCP server, through a skill, or through both? | interview | open | 17, 20 | — |
| 14 | Do Claude Code, Codex and Gemini CLI show the view of a tool that uses MCP Apps: what does each host's own documentation say, and what does a test with a minimal server show? RES-066 found only that the community's list of hosts has no tick for them. | research | resolved | — | [RES-080](../research/RES-080-mcp-apps-views-in-three-agent-hosts.md) |
| 15 | In the trial project of RES-077, with Peter at the keyboard: does each host work after a real approval in its own dialog, does a model in a session use a skill and call the tool, and what do Cursor and VS Code Copilot show? Only Peter can approve in a host's dialog and sign in, so this is a step that he runs; the main session gives him the checklist when row 05 is next. | task | open | 03 | — |
| 16 | Where do the MCP servers and the agent skills of large frameworks, packages and libraries live, over a large sample that is not limited to design systems: inside the main package, in a package of their own, on a hosted server, in a repository or a marketplace of plugins; how does a consumer install each, and how does each stay at the version of the installed library? Peter asked for it with `/deep-research` on 2026-11-20 and named Storybook, AG Grid and Chakra UI as examples. RES-030 and RES-070 hold a smaller sample. | research | resolved | — | [RES-082](../research/RES-082-mcp-servers-and-skills-of-frameworks-and-libraries.md) |
| 17 | Does 1.0 have an MCP server, and what is its job beside the guidance for coding agents? | interview | open | 16 | — |
| 18 | Where does the MCP server live: a package of its own, the project's command line tool, the dev server, a hosted server, or the main package? | interview | open | 17 | — |
| 19 | Where does the guidance for coding agents live: the main package, a repository of skills, a plugin, a block in the instructions file of the consumer's project, the documentation site? | interview | open | 20 | — |
| 20 | Which forms does the guidance for coding agents take: skills, a managed block in AGENTS.md or CLAUDE.md, documentation inside the package, llms.txt, a plugin? | interview | open | 16 | — |
| 21 | How do the MCP server and the guidance stay at the version of the installed library? | interview | open | 18, 19 | — |
| 22 | How are the MCP server and the guidance distributed: npm, the `skills` command line tool, plugin marketplaces, an own command, a hosted address? | interview | open | 18, 19 | — |
| 23 | How does a consumer install the MCP server and the guidance, and which files does that write into the project? | interview | open | 22, 15 | — |
| 24 | How do the MCP server and the guidance get updated when the library is updated? | interview | open | 21, 22 | — |
| 25 | Which agent hosts does 1.0 support for the MCP server and the guidance? | interview | open | 16 | — |

## Not yet specified
- Google's A2UI, a declarative format for UI that a Google post joins with MCP Apps. RES-066 saw it in a search result and did not read it. It sharpens at row 12, if a second mechanism beside MCP Apps matters then.
- Which instructions file Claude Code reads at the start of a session: two libraries' guides disagree (RES-030, Follow-ups), and neither run read Claude Code's own documentation on it. It decides where `init` writes its block. Check it at its source when row 05 is next.
- How `init` reaches a consumer who installs only a framework package. It sharpens after IDEA-004#07.
- Maintainer skills for this repo, as distinct from consumer skills. Peter, 2026-11-12 (IDEA-002, Row 10 — partial): an internal skill that tells an agent how to bring the tokens in from Figma is acceptable for the work of the maintainers.

## Out of scope
- Row 02, retired on 2026-11-12: "How does release 0.3.3 ship its MCP server and consumer skills, and which limits do its records name?" DEC-125 takes release 0.3.3 out as input.
- Devtools (IDEA-006).
- The documentation website. IDEA-007 owns it (DEC-139).
- The design skill for Figma. IDEA-009 owns it.
- The components, their design, the Lit core and the wrappers that the server and skills describe (IDEA-001 to IDEA-004).
