---
id: RES-031
status: in-progress # in-progress | resolved
kind: research
from: IDEA-006#01 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-12
---
# RES-031: What TanStack Devtools offers for extension and a fork, and which other devtools bases exist

<!-- Add outcome: answered, partial or blocked to frontmatter when an answer or a block is known. Only answered work can become resolved. -->

## Question
What does TanStack Devtools offer for extension and for a fork, and which other bases for devtools exist?

## Answer
Not answered yet. A landscape sweep is running.

Needed by: IDEA-006#04 (built on TanStack Devtools, extended or forked, or built by us) and IDEA-006#05 (one tool on the custom elements, or an adapter for each framework).

Sufficient-answer condition:

- TanStack Devtools: its plugin API, how a custom panel is added, the frameworks it supports, its license, release status and version, and what a fork must maintain.
- Each other base: what it offers for live editing of component properties and for theming controls, its framework coverage, license and maintenance state.
- Both sides of each disagreement between sources.

The record gives facts, sources and disagreements only. It gives no recommendation.

### How the sweep runs
- Tool: a copy of Claude Code's built-in `deep-research` workflow, with `model: "opus"` and `effort: "medium"` on each of its five agent calls. Peter gave the go for this route on 2026-11-12 (IDEA-001, Notes).
- Script: `.artifacts/v1/research/deep-research-opus-medium.js` (scratch, outside git). It differs from the built-in script of Claude Code 2.1.323 in its name and in those two settings only.
- Limits of one run, from the script: at most 15 sources, at most 5 claims for each source, and the 25 highest-ranked claims go to three checking agents each.
- The workflow agents write no file. The main session files the report here.

### The question sent to the workflow
> As of November 2026: (1) What does TanStack Devtools offer for extension and for a fork: its plugin API, how a custom panel is added, the frameworks it supports, its license, its release status and version, and what a fork must maintain? (2) Which other bases exist for in-page developer tools of a UI component library that has a web-component core and is used from several frameworks? Cover, for example, browser-extension devtools, Lit and web-component devtools, Storybook controls and addons, Vue DevTools Kit, Nuxt DevTools Kit, the Astro dev toolbar, the Vercel toolbar, and custom in-page inspectors that read a Custom Elements Manifest. For each base, report what it offers for live editing of component properties and for theming or design-token controls, which frameworks it covers, its license and its maintenance state. Context: a design system plans one devtools package for all its framework versions, with live property switching on a selected component and theming controls. Prefer primary sources: official documentation, source repositories and release notes, with their dates. Report facts and the disagreements between sources. Give no recommendation and no opinion.

## Findings
None yet.

## Follow-ups
None yet.

## Next action
Wait for the workflow run of 2026-11-12; its run ID is in the Notes of the idea. Then write the report's confirmed findings here, each with its source and date, mark what the limits of the run left out, and judge the sufficient-answer condition. If the run is lost, start the script again with the question above.
