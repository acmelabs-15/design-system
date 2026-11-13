---
id: RES-030
status: in-progress # in-progress | resolved
kind: research
from: IDEA-005#01 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-12
---
# RES-030: How libraries ship MCP servers and agent skills, and how agent hosts find them

<!-- Add outcome: answered, partial or blocked to frontmatter when an answer or a block is known. Only answered work can become resolved. -->

## Question
How do other libraries ship MCP servers and agent skills (inside the library package or apart), how do they install them into a consumer project, and how do agent hosts find them?

## Answer
Not answered yet. A landscape sweep is running.

Needed by: IDEA-005#03 (the `init` trial), IDEA-005#04 (inside the package or separate packages) and IDEA-005#09 (guidance for an agent with no project).

Sufficient-answer condition:

- Named libraries and tools, each with where its MCP server and its skills ship: inside the library package, in a separate package, or on a hosted server.
- How each installs them into a consumer project, and which files the install writes.
- How each agent host finds MCP servers and skills.
- How each keeps the server and the skills in step with the installed library version.
- Both sides of each disagreement between sources.

The record gives facts, sources and disagreements only. It gives no recommendation.

### How the sweep runs
- Tool: a copy of Claude Code's built-in `deep-research` workflow, with `model: "opus"` and `effort: "medium"` on each of its five agent calls. Peter gave the go for this route on 2026-11-12 (IDEA-001, Notes).
- Script: `.artifacts/v1/research/deep-research-opus-medium.js` (scratch, outside git). It differs from the built-in script of Claude Code 2.1.323 in its name and in those two settings only.
- Limits of one run, from the script: at most 15 sources, at most 5 claims for each source, and the 25 highest-ranked claims go to three checking agents each.
- The workflow agents write no file. The main session files the report here.

### The question sent to the workflow
> As of November 2026, how do UI component libraries and developer tools ship MCP (Model Context Protocol) servers and agent skills for coding agents? (1) Where do they ship them: inside the library's own npm package, as separate packages, or as hosted servers? Name concrete projects and what each does, for example shadcn/ui, Chakra UI, MUI, Ant Design, Mantine, Storybook, Astro, Tailwind CSS, TanStack (including TanStack Intent), Nuxt UI, Vercel and Figma. (2) How do they install the server and the skills into a consumer project: an init command or a package.json bin script, and which files it writes, such as .mcp.json, AGENTS.md, CLAUDE.md, .claude/skills or .cursor/rules? (3) How do agent hosts find MCP servers and skills: Claude Code, Codex, Cursor, VS Code Copilot, Gemini CLI and Windsurf, including configuration files, plugins and marketplaces, and the Agent Skills format? (4) How do they keep the server and the skills in step with the installed version of the library, and how does an update reach a consumer project? Context: a design system plans to ship its MCP server and its agent skills inside its npm package, with an init script. Prefer primary sources: official documentation, source repositories and release notes, with their dates. Report facts and the disagreements between sources. Give no recommendation and no opinion.

## Findings
None yet.

## Follow-ups
None yet.

## Next action
Wait for the workflow run of 2026-11-12; its run ID is in the Notes of the idea. Then write the report's confirmed findings here, each with its source and date, mark what the limits of the run left out, and judge the sufficient-answer condition. If the run is lost, start the script again with the question above.
