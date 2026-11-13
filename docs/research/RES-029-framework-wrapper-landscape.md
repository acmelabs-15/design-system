---
id: RES-029
status: in-progress # in-progress | resolved
kind: research
from: IDEA-004#01 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-12
---
# RES-029: How React, Preact, TanStack Redact and Solid take custom elements, and how libraries wrap and test them

<!-- Add outcome: answered, partial or blocked to frontmatter when an answer or a block is known. Only answered work can become resolved. -->

## Question
For React, Preact, TanStack Redact and Solid: how does each handle custom elements, how do other libraries generate or write wrappers for it, and how do they test those wrappers?

## Answer
Not answered yet. A landscape sweep is running.

Needed by: IDEA-004#03 (does the React package run on Redact unchanged), IDEA-004#04 (which targets ship), IDEA-004#05 (generated or written by hand) and IDEA-004#06 (how each wrapper is tested).

Sufficient-answer condition:

- For each of the four runtimes: how it sets properties and attributes on a custom element, how it listens to custom events, and what it does on the server.
- The tools that generate wrappers and the libraries that use them, and the libraries that write wrappers by hand.
- How those libraries test their wrappers.
- What TanStack Redact is: publisher, stated compatibility with the React API, release status and version. The kickoff prompt calls it a React-API-compatible runtime; this record checks that against sources.
- Both sides of each disagreement between sources.

The record gives facts, sources and disagreements only. It gives no recommendation.

### How the sweep runs
- Tool: a copy of Claude Code's built-in `deep-research` workflow, with `model: "opus"` and `effort: "medium"` on each of its five agent calls. Peter gave the go for this route on 2026-11-12 (IDEA-001, Notes).
- Script: `.artifacts/v1/research/deep-research-opus-medium.js` (scratch, outside git). It differs from the built-in script of Claude Code 2.1.323 in its name and in those two settings only.
- Limits of one run, from the script: at most 15 sources, at most 5 claims for each source, and the 25 highest-ranked claims go to three checking agents each.
- The workflow agents write no file. The main session files the report here.

### The question sent to the workflow
> As of November 2026, for the UI runtimes React, Preact, TanStack Redact and Solid: (1) How does each runtime handle custom elements (web components)? Cover properties versus attributes, custom events, refs, children and slots, server rendering and hydration, and TypeScript JSX types for custom elements. (2) How do component libraries with a web-component core generate or hand-write wrapper packages for each runtime? Name the tools and the libraries that use them, for example @lit/react, Stencil output targets, Web Awesome and Shoelace, Spectrum Web Components, Fluent UI web components, Ionic, and generators that read a Custom Elements Manifest. (3) How do those libraries test their wrappers? (4) What is TanStack Redact: who publishes it, what it says about compatibility with the React API, its release status and version? Context: a design system with a Lit web-component core plans wrapper packages for these runtimes. Prefer primary sources: official documentation, source repositories and release notes, with their dates. Report facts and the disagreements between sources. Give no recommendation and no opinion.

## Findings
None yet.

## Follow-ups
None yet.

## Next action
Wait for the workflow run of 2026-11-12; its run ID is in the Notes of the idea. Then write the report's confirmed findings here, each with its source and date, mark what the limits of the run left out, and judge the sufficient-answer condition. If the run is lost, start the script again with the question above.
