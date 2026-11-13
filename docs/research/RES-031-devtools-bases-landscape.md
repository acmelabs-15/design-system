---
id: RES-031
status: in-progress # in-progress | resolved
outcome: partial
kind: research
from: IDEA-006#01 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-12
---
# RES-031: What TanStack Devtools offers for extension and a fork, and which other devtools bases exist

<!-- Add outcome: answered, partial or blocked to frontmatter when an answer or a block is known. Only answered work can become resolved. -->

## Question
What does TanStack Devtools offer for extension and for a fork, and which other bases for devtools exist?

## Answer
Partly answered. The sweep of 2026-11-12 established the first half of the question: the plugin API of TanStack Devtools, how a custom panel is added, its framework adapters, its license, its release status and versions, and what a fork must maintain. The sufficient-answer condition is not met; see "Still open".

Needed by: IDEA-006#04 (built on TanStack Devtools, extended or forked, or built by us) and IDEA-006#05 (one tool on the custom elements, or an adapter for each framework).

Sufficient-answer condition:

- TanStack Devtools: its plugin API, how a custom panel is added, the frameworks it supports, its license, release status and version, and what a fork must maintain.
- Each other base: what it offers for live editing of component properties and for theming controls, its framework coverage, license and maintenance state.
- Both sides of each disagreement between sources.

The record gives facts, sources and disagreements only. It gives no recommendation.

### What the run established
The summary of the run's report, in its own words:

> Every verified claim covers part (1), TanStack Devtools. No claim about the other bases in part (2) passed verification, so this report does not answer that part. TanStack Devtools (github.com/TanStack/devtools, MIT license) calls itself a framework-agnostic devtools panel. The panel hosts TanStack's own library devtools and custom plugins. On 2026-10-29 the core package @tanstack/devtools was at 0.16.0, and the docs label the project alpha with an API subject to change. A custom panel is a plugin object in the plugins array of the devtools component, with the fields name, render, an optional id and an optional defaultOpen. Data moves through a typed, framework-agnostic EventClient from @tanstack/devtools-event-client. With the Vite plugin, that client can bridge to a server bus. The shell and its shared UI library are written in Solid.js, so a fork of the shell would maintain Solid.js code. The repository holds adapter packages for React, Preact, Solid, Vue, Svelte and Angular. No Lit or web-component adapter appears in the repository, and TanStack Table's devtools page says Lit has no dedicated table devtools adapter. No verified claim says the TanStack sources describe live property editing or theming and design-token controls.

### Still open
- The whole second half: no claim about another base survived. Not covered: browser-extension devtools, Lit and web-component devtools, Storybook controls and addons, Vue DevTools Kit, Nuxt DevTools Kit, the Astro dev toolbar, the Vercel toolbar, and inspectors that read a Custom Elements Manifest.
- Whether a TanStack Devtools panel can be a custom element or plain DOM code. The docs show a `render(el, props)` form, and no source documents that use.
- Whether any TanStack source describes live editing of properties or controls for themes and tokens. No verified claim says so.

The report's own caveats:

> The report covers only part (1). No claim about the other part (2) bases passed verification: browser-extension devtools, Lit or web-component devtools, Storybook controls and addons, Vue DevTools Kit, Nuxt DevTools Kit, the Astro dev toolbar, the Vercel toolbar, and inspectors that read a Custom Elements Manifest. Nothing here describes their live-editing features, theming controls, framework coverage, licenses or maintenance state. Part (2) needs a separate research pass. All TanStack evidence is first-party: official docs, the GitHub repository and the npm registry. No independent secondary source was consulted. The project is alpha and 0.x, so package names, plugin types and the version figures (dated 2026-10-29 and checked 2026-11-12) may change. Several docs pages disagree with each other: on the adapter list (Overview names 4, docs index 7, README 3 plus 'and more', repository 6), on how far production stripping reaches, and in the devtools-vite changelog heading. Most docs fetches came from a Firecrawl cache dated 2026-11-13, one day after the stated check date. The plugin type is verified only for the React adapter. No verified source describes live editing of component properties or theming and design-token controls in TanStack Devtools or its Table plugin. No source tested the 'framework-agnostic' label beyond the vendor's own description.

### Claims that the check refuted
These are not findings. Two of three checking agents or more voted against each one.

- @tanstack/devtools-utils provides plugin factories for four frameworks only: React, Solid, Vue and Preact. They pass a light or dark theme prop and return a [Plugin, NoOpPlugin] tuple so production builds can tree-shake the devtools out. No Lit or web-component factory is listed. Vote 0-3. Claimed source: https://tanstack.com/devtools/latest/docs/building-custom-plugins
- TanStack Devtools ships official framework adapters for exactly four frameworks: React, Vue, Solid and Preact. The page lists no adapter for Lit, web components, Angular or Svelte. Vote 0-3. Claimed source: https://tanstack.com/devtools/latest/docs/overview

### The run in numbers
- Run `wf_40354acd-051`, 2026-11-12: 104 agents, all finished, 7,763,294 tokens.
- 5 search angles, 22 sources read, 110 claims taken from them, 25 claims checked, 23 confirmed, 2 refuted, 0 without a verdict.
- 85 claims were never checked, because one run checks 25 at most. 7 search results were not read, because one run reads about 15 sources.
- The full result is in `.artifacts/v1/research/IDEA-006-01-sweep-wf_40354acd-051.json` (scratch, outside git).

### Sources that the run read
- https://tanstack.com/devtools/latest/docs/building-custom-plugins (primary, 5 claims)
- https://github.com/TanStack/devtools (primary, 5 claims)
- https://tanstack.com/devtools/latest/docs/framework/react/adapter (primary, 5 claims)
- https://tanstack.com/devtools/latest/docs/framework/react/guides/custom-plugins (primary, 5 claims)
- https://tanstack.com/table/latest/docs/devtools (primary, 5 claims)
- https://github.com/TanStack/devtools/releases (primary, 5 claims)
- https://tanstack.com/devtools/latest/docs/overview (primary, 5 claims)
- https://tanstack.com/devtools/latest/docs/event-system (primary, 5 claims)
- https://tanstack.com/devtools/latest/docs/vite-plugin (primary, 5 claims)
- https://github.com/TanStack/devtools/blob/main/packages/devtools-vite/CHANGELOG.md (primary, 5 claims)
- https://github.com/TanStack/form/issues/2132 (forum, 5 claims)
- https://devtools.vite.dev/kit/dock-system (primary, 5 claims)
- https://devtools.vuejs.org/guide/migration (primary, 5 claims)
- https://devtools.nuxt.com/module/utils-kit (primary, 5 claims)
- https://docs.astro.build/en/reference/dev-toolbar-app-reference (primary, 5 claims)
- https://matsuuu.github.io/web-component-devtools/ (primary, 5 claims)
- https://open-wc.org/guides/tools/web-component-devtools/ (secondary, 5 claims)
- https://github.com/open-wc/api-viewer-element (primary, 5 claims)
- https://api-viewer.open-wc.org/docs/guide/using-demo/ (primary, 5 claims)
- https://storybook.js.org/docs/essentials/themes (primary, 5 claims)
- https://frontendmasters.com/blog/the-missing-link-for-web-components/ (blog, 5 claims)
- https://github.com/mariohamann/wc-storybook-helpers (primary, 5 claims)

### How the sweep runs
- Tool: a copy of Claude Code's built-in `deep-research` workflow, with `model: "opus"` and `effort: "medium"` on each of its five agent calls. Peter gave the go for this route on 2026-11-12 (IDEA-001, Notes).
- Script: `.artifacts/v1/research/deep-research-opus-medium.js` (scratch, outside git). It differs from the built-in script of Claude Code 2.1.323 in its name and in those two settings only.
- Limits of one run, from the script: at most 15 sources, at most 5 claims for each source, and the 25 highest-ranked claims go to three checking agents each.
- The workflow agents write no file. The main session files the report here.

### The question sent to the workflow
> As of November 2026: (1) What does TanStack Devtools offer for extension and for a fork: its plugin API, how a custom panel is added, the frameworks it supports, its license, its release status and version, and what a fork must maintain? (2) Which other bases exist for in-page developer tools of a UI component library that has a web-component core and is used from several frameworks? Cover, for example, browser-extension devtools, Lit and web-component devtools, Storybook controls and addons, Vue DevTools Kit, Nuxt DevTools Kit, the Astro dev toolbar, the Vercel toolbar, and custom in-page inspectors that read a Custom Elements Manifest. For each base, report what it offers for live editing of component properties and for theming or design-token controls, which frameworks it covers, its license and its maintenance state. Context: a design system plans one devtools package for all its framework versions, with live property switching on a selected component and theming controls. Prefer primary sources: official documentation, source repositories and release notes, with their dates. Report facts and the disagreements between sources. Give no recommendation and no opinion.

## Findings
- Plugin architecture: a custom plugin has two parts. The first is an EventClient from @tanstack/devtools-event-client. It is a typed, framework-agnostic event emitter and listener, subclassed with a pluginId and an event map, and it carries data between the app and the devtools. The second is a panel component that renders in the devtools UI. Same-page communication needs no server. A panel written in the adapter's framework makes the plugin specific to that framework. One React guide says the framework-agnostic panel approach will be explained in 'coming docs'. Evidence: Docs, read 2026-11-12: 'A plugin consists of two parts: 1. An EventClient ... 2. A panel component ... The EventClient is framework-agnostic.' 'It is built on EventClient, a type-safe event emitter/listener from @tanstack/devtools-event-client. It is completely framework-agnostic.' The React guide adds: 'write the devtools in the framework that the adapter is, be aware that this will make the plugin framework specific.' The same site lists 'Building Custom Plugins', 'Using devtools-utils' and 'Bidirectional Communication' guides, which may cover the deferred approach. The verifiers did not open them to confirm. Confidence high; vote 3-0 on all merged claims ([0],[7],[9],[18]). Source: https://tanstack.com/devtools/latest/docs/building-custom-plugins and https://tanstack.com/devtools/latest/docs/framework/react/guides/custom-plugins and https://tanstack.com/devtools/latest/docs/event-system, checked 2026-11-12.
- Adding a custom panel: a plugin object goes in the plugins array prop of the devtools component, and each object is one sidebar tab. React adapter type: { id?: string; name: string | PluginRender; render: PluginRender; defaultOpen?: boolean }. name is the tab title. If id is omitted, it is generated from name. defaultOpen opens the panel on first load. render takes a JSX element (React, Preact) or a component reference (Vue, Solid). In React, render can also be a function (el: HTMLElement, { theme, devtoolsOpen }) => JSX.Element, which gives raw DOM access to the container. Evidence: React adapter page: 'Each plugin describes a tab in the devtools panel' and 'render can be a JSX element ... or a function that receives the container element and current { theme, devtoolsOpen } props.' The custom-plugins page: 'The render field accepts a JSX element (React, Preact) or a component reference (Vue, Solid), depending on your adapter.' The type definition is documented only for React, so other adapters' plugin object shapes were not verified. One verifier dissented on [1] without a recorded reason, and the guide points to a Plugin Lifecycle page for the full interface. The function form passes the container element and a theme value. Read from that, it could host a non-React renderer, such as a custom element. No source documents that. Confidence high; vote [1] 2-1; [5],[6],[8] 3-0. Source: https://tanstack.com/devtools/latest/docs/building-custom-plugins and https://tanstack.com/devtools/latest/docs/framework/react/adapter and https://tanstack.com/devtools/latest/docs/framework/react/guides/custom-plugins, checked 2026-11-12.
- Hosting for third-party libraries: other libraries add their panels as plugin factories. TanStack Table v9 provides framework-specific devtools adapters. The app mounts &lt;TanStackDevtools plugins={[tableDevtoolsPlugin()]} /> at its root and registers each table with useTanStackTableDevtools(table), or injectTanStackTableDevtools in Angular. The docs say Octane, Lit, Svelte, Alpine and vanilla have no dedicated table devtools adapter. The Table devtools page describes inspecting state, options, rows and columns. It does not describe editing properties live. Evidence: 'TanStack Table provides framework-specific devtools adapters that plug into the TanStack Devtools multi-panel UI.' 'Octane, Lit, Svelte, Alpine, and vanilla do not currently ship dedicated table devtools adapters.' On 2026-11-12 the npm registry had no @tanstack/lit-table-devtools or @tanstack/svelte-table-devtools. A framework-agnostic core, @tanstack/table-devtools 9.3.1, exists. Each table needs a key option. The adapters do nothing in production unless the app imports the /production entry points. Confidence high; vote 3-0 ([10],[11],[12]). Source: https://tanstack.com/table/latest/docs/devtools, checked 2026-11-12.
- Framework coverage: the README names React, Solid and Vanilla JS, 'and more'. The repository's packages/ directory and npm hold six framework adapters: react-devtools, preact-devtools, solid-devtools, vue-devtools, svelte-devtools and angular-devtools. Each depends on @tanstack/devtools 0.16.0. Sources disagree on this list. The Overview page names React, Vue, Solid and Preact as adapters. The docs index adds Svelte, Angular and Vanilla. The repository topics name only react and solidjs. No Lit or web-component adapter exists. Evidence: README: 'Works with React, Solid, Vanilla JS, and more.' Commit 7be3776 (PR #397, 2026-05-13): 'remove-devtools now recognizes preact/vue/svelte/angular packages.' The GitHub contents API lists the six adapter folders. npm has @tanstack/angular-devtools 0.0.13. Confidence high; vote [3],[4] 3-0; [14] 2-1. Two claims that there were 'exactly four adapters' were refuted 0-3. Source: https://github.com/TanStack/devtools and https://github.com/TanStack/devtools/releases and https://tanstack.com/devtools/latest/docs/overview, checked 2026-11-12.
- License: the repository is MIT-licensed (LICENSE: 'Copyright (c) 2025 TanStack'). The npm manifests of the react, preact, solid, vue and svelte adapters also declare MIT. Evidence: The GitHub API reports license key mit (SPDX MIT). The verifier checked the adapter manifests on npm. The license fields of the core, event-client, event-bus, utils, ui and vite packages were not checked one by one. Confidence high; vote [2] 3-0; [14] 2-1. Source: https://github.com/TanStack/devtools, checked 2026-11-12.
- Release status and versions: TanStack Devtools is pre-1.0 and labelled alpha. On 2026-10-29 the versions were @tanstack/devtools 0.16.0, react-devtools 0.10.14, preact-devtools 0.10.15, solid-devtools 0.8.14, vue-devtools 0.2.28, svelte-devtools 0.1.8 (the GitHub 'Latest' release), angular-devtools 0.0.13 and @tanstack/devtools-vite 0.8.6. Releases were frequent through 2026, and the repository was last pushed on 2026-11-12. Evidence: Docs: 'TanStack Devtools is currently in alpha and its API is subject to change.' The npm latest tags were published 2026-10-29 at about 17:08–17:16Z by the automated 'Version Packages' commit 8f62544 (#558). Earlier devtools-vite releases were #506 (2026-08-19) and #512 (2026-08-20). The devtools-vite CHANGELOG's top heading says '@tanstack/devtools-event-client', which does not match its folder. Confidence high; vote 3-0 ([13],[15],[22]). Source: https://github.com/TanStack/devtools/releases and https://tanstack.com/devtools/latest/docs/overview and https://github.com/TanStack/devtools/blob/main/packages/devtools-vite/CHANGELOG.md, checked 2026-11-12.
- What a fork would maintain: the shell @tanstack/devtools is built in Solid.js and provides the plugin system, tab navigation, settings panel and trigger button. The shared UI library @tanstack/devtools-ui is Solid.js too. Each framework adapter is a thin wrapper that mounts the core shell. The other packages are @tanstack/devtools-event-client (typed events), @tanstack/devtools-event-bus (WebSocket/SSE transport), @tanstack/devtools-utils (plugin factory helpers for each framework), @tanstack/devtools-vite (Vite plugin) and @tanstack/devtools-bundler-core. Together with the six adapters, this is the set of packages a fork would maintain. Evidence: '@tanstack/devtools — The devtools shell UI built in Solid.js. Provides the plugin system, tab navigation, settings panel, and trigger button.' '@tanstack/devtools-ui — Shared Solid.js UI component library.' '@tanstack/devtools-utils — Plugin factory helpers for each framework.' The step from these facts to a fork maintaining Solid.js code is an inference from the documented facts, not a quoted statement. The devtools-vite 0.8.6 changelog bumps @tanstack/devtools-bundler-core to 0.1.4. Confidence high; vote 3-0 ([16],[17]). Source: https://tanstack.com/devtools/latest/docs/overview and https://github.com/TanStack/devtools/blob/main/packages/devtools-vite/CHANGELOG.md, checked 2026-11-12.
- Server-side features and build stripping: when eventBusConfig sets connectToServerBus: true, the client bus connects to a ServerEventBus. The Vite plugin starts that bus on port 4206 by default. The server bus enables console piping and an in-devtools plugin marketplace, which installs plugins through npm, pnpm or yarn and injects their imports into the devtools setup file. Both work only while the Vite dev server runs. By default (removeDevtoolsOnBuild: true) the Vite plugin replaces devtools imports with empty modules in production builds. The two docs pages disagree on which packages that covers. Evidence: The vite-plugin page lists @tanstack/react-, vue-, solid- and preact-devtools and @tanstack/devtools, with no Lit, Angular or Svelte package. The Architecture page says the remove-devtools-on-build transform acts on any import from `@tanstack/*-devtools`, a wildcard that would include Angular and Svelte. Commit 7be3776 says Preact, Vue, Svelte and Angular packages are now recognized. The transform source was not opened, so the actual scope is unconfirmed. Confidence medium; vote [19],[20] 3-0; [21] 2-1. Source: https://tanstack.com/devtools/latest/docs/event-system and https://tanstack.com/devtools/latest/docs/vite-plugin and https://tanstack.com/devtools/latest/docs/architecture, checked 2026-11-12.

## Follow-ups
None. The open points belong to this same question; they are under "Still open".

## Next action
More runs of the same script with narrower questions, one for each open group. They wait for Peter's go, asked on 2026-11-12:

1. One run on the other in-page bases: Storybook controls and addons, Vue DevTools Kit, Nuxt DevTools Kit, the Astro dev toolbar and the Vercel toolbar, each for live property editing, theming controls, framework coverage, license and maintenance state.
2. One run on devtools for web components: browser extensions for web components and Lit, inspectors that read a Custom Elements Manifest, and a framework-agnostic panel in TanStack Devtools.

Add the confirmed findings of each run to this record, then judge the sufficient-answer condition again.
