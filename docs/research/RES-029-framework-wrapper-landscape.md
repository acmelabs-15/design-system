---
id: RES-029
status: in-progress # in-progress | resolved
outcome: partial
kind: research
from: IDEA-004#01 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-12
---
# RES-029: How React, Preact, TanStack Redact and Solid take custom elements, and how libraries wrap and test them

<!-- Add outcome: answered, partial or blocked to frontmatter when an answer or a block is known. Only answered work can become resolved. -->

## Question
For React, Preact, TanStack Redact and Solid: how does each handle custom elements, how do other libraries generate or write wrappers for it, and how do they test those wrappers?

## Answer
Partly answered. The sweep of 2026-11-12 established how Preact and Solid set properties and attributes and listen to custom events, how React 19 listens to custom events, what Preact does with complex values on the server, the TypeScript types for custom elements in Preact and Solid, which community tools read a Custom Elements Manifest, and what TanStack Redact is. The sufficient-answer condition is not met; see "Still open".

Needed by: IDEA-004#03 (does the React package run on Redact unchanged), IDEA-004#04 (which targets ship), IDEA-004#05 (generated or written by hand) and IDEA-004#06 (how each wrapper is tested).

Sufficient-answer condition:

- For each of the four runtimes: how it sets properties and attributes on a custom element, how it listens to custom events, and what it does on the server.
- The tools that generate wrappers and the libraries that use them, and the libraries that write wrappers by hand.
- How those libraries test their wrappers.
- What TanStack Redact is: publisher, stated compatibility with the React API, release status and version. The kickoff prompt calls it a React-API-compatible runtime; this record checks that against sources.
- Both sides of each disagreement between sources.

The record gives facts, sources and disagreements only. It gives no recommendation.

### What the run established
The summary of the run's report, in its own words:

> The 22 claims that survived verification answer only parts of the question. They cover how React, Preact and Solid handle events, properties, attributes, Preact server rendering and Preact and Solid TypeScript types. They also answer most of sub-question 4 on TanStack Redact. On wrappers (sub-question 2), the only surviving evidence is the community generators listed on open-wc's Custom Elements Manifest analyzer page. No claim survived about @lit/react, Stencil output targets, Shoelace or Web Awesome, Spectrum Web Components, Fluent UI or Ionic. No claim survived about how those libraries test their wrappers (sub-question 3) either. TanStack publishes Redact under the npm name @tanstack/redact; the latest version is 0.3.1, published 2026-11-04, so it is pre-1.0. Its sources disagree on compatibility: the repository's About text claims "100% API compliancy", while its README and compatibility docs list behaviors it does not implement, mainly concurrency.

### Still open
- React's rule for a property or an attribute on a custom element, on the client and on the server, and React's JSX types for custom elements. Two claims on the rule were refuted.
- Refs, children and slots in every runtime, and server rendering and hydration in React and Solid.
- How `@lit/react`, Stencil output targets, Web Awesome and Shoelace, Spectrum Web Components, Fluent UI and Ionic make their wrappers.
- How those libraries test their wrappers. No claim on this survived.
- Whether Redact handles custom elements as React 19 does.

The report's own caveats:

> The evidence covers the question unevenly. No claim survived on: React's rule for property versus attribute (two claims were refuted), React's server rendering of custom elements, React's TypeScript JSX types, refs, or children and slots in any runtime. Also missing: Solid's server rendering and hydration of custom elements beyond attr:, and any statement about how Redact handles custom elements. For sub-question 2 there is nothing on @lit/react, Stencil output targets, Shoelace or Web Awesome, Spectrum Web Components, Fluent UI or Ionic; open-wc's list of community generators is the only evidence. Sub-question 3 has no evidence on how component libraries test their wrappers; the Redact test suite is a runtime compatibility suite. The Preact evidence is mostly from the v10 guide, while v11 (11.2.0) is current; v11 was confirmed only for naming and TypeScript. The Solid docs describe 1.x. Redact is pre-1.0 and changed version six times in about a week. The launch post names 0.2.0, but npm shows 0.3.1, and a claim that 0.2.0 is current was refuted. Its 'no code change' and '100% API' statements come from the vendor. Two findings (Preact event casing, Solid on:) rest on 2-1 votes. The verifiers fetched pages on 2026-11-12/13, so this is a snapshot.

### Claims that the check refuted
These are not findings. Two of three checking agents or more voted against each one.

- By default React passes JSX values to custom elements as attributes, and serializes non-string values to strings, for example an array becomes 1,2,3. Vote 1-2. Claimed source: https://react.dev/reference/react-dom/components
- React sets a value as a property, not an attribute, only when the property name exists on the element instance during construction. Vote 0-3. Claimed source: https://react.dev/reference/react-dom/components
- Redact 0.2.0 is the current release. It has stable browser integrations for TanStack Start, Vite, Vinext and Next.js, including the App Router and the Pages Router. The version is still pre-1.0. Vote 0-3. Claimed source: https://tanstack.com/blog/introducing-tanstack-redact

### The run in numbers
- Run `wf_737727d2-447`, 2026-11-12: 104 agents, all finished, 7,105,782 tokens.
- 5 search angles, 22 sources read, 110 claims taken from them, 25 claims checked, 22 confirmed, 3 refuted, 0 without a verdict.
- 85 claims were never checked, because one run checks 25 at most. 5 search results were not read, because one run reads about 15 sources.
- The full result is in `.artifacts/v1/research/IDEA-004-01-sweep-wf_737727d2-447.json` (scratch, outside git).

### Sources that the run read
- https://react.dev/reference/react-dom/components (primary, 5 claims)
- https://preactjs.com/guide/v10/web-components/ (primary, 5 claims)
- https://preactjs.com/guide/v11/typescript/ (primary, 5 claims)
- https://docs.solidjs.com/reference/jsx-attributes/attr (primary, 5 claims)
- https://docs.solidjs.com/configuration/typescript (primary, 5 claims)
- https://www.npmjs.com/package/@tanstack/redact (primary, 5 claims)
- https://github.com/tanstack/redact (primary, 5 claims)
- https://tanstack.com/blog/introducing-tanstack-redact (primary, 5 claims)
- https://tanstack.com/redact/latest/docs/compatibility (primary, 5 claims)
- https://custom-elements-manifest.open-wc.org/analyzer/plugins/intro/ (primary, 5 claims)
- https://lit.dev/docs/frameworks/react/ (primary, 5 claims)
- https://stenciljs.com/docs/react (primary, 5 claims)
- https://wc-toolkit.com/integrations/react/ (primary, 5 claims)
- https://nvidia.github.io/elements/docs/integrations/custom-elements/ (primary, 5 claims)
- https://github.com/stencil-community/stencil-react-output-target (primary, 5 claims)
- https://cdn.jsdelivr.net/npm/@awesome.me/webawesome@3.8.0/dist/skills/webawesome/references/frameworks/react.md (primary, 5 claims)
- https://opensource.adobe.com/spectrum-web-components/using-swc-react (primary, 5 claims)
- https://learn.microsoft.com/de-de/fluent-ui/web-components/integrations/react (primary, 5 claims)
- https://github.com/ionic-team/stencil-ds-output-targets (primary, 5 claims)
- https://custom-elements-everywhere.com/ (secondary, 5 claims)
- https://github.com/ionic-team/ionic-framework/blob/d72cae590fac35ec80dd92c6003d1e37d411eeed/react/src/components/__tests__/createComponent.spec.tsx (primary, 5 claims)
- https://ionic.io/blog/the-quest-for-ssr-with-web-components-a-stencil-developers-journey (blog, 5 claims)

### How the sweep runs
- Tool: a copy of Claude Code's built-in `deep-research` workflow, with `model: "opus"` and `effort: "medium"` on each of its five agent calls. Peter gave the go for this route on 2026-11-12 (IDEA-001, Notes).
- Script: `.artifacts/v1/research/deep-research-opus-medium.js` (scratch, outside git). It differs from the built-in script of Claude Code 2.1.323 in its name and in those two settings only.
- Limits of one run, from the script: at most 15 sources, at most 5 claims for each source, and the 25 highest-ranked claims go to three checking agents each.
- The workflow agents write no file. The main session files the report here.

### The question sent to the workflow
> As of November 2026, for the UI runtimes React, Preact, TanStack Redact and Solid: (1) How does each runtime handle custom elements (web components)? Cover properties versus attributes, custom events, refs, children and slots, server rendering and hydration, and TypeScript JSX types for custom elements. (2) How do component libraries with a web-component core generate or hand-write wrapper packages for each runtime? Name the tools and the libraries that use them, for example @lit/react, Stencil output targets, Web Awesome and Shoelace, Spectrum Web Components, Fluent UI web components, Ionic, and generators that read a Custom Elements Manifest. (3) How do those libraries test their wrappers? (4) What is TanStack Redact: who publishes it, what it says about compatibility with the React API, its release status and version? Context: a design system with a Lit web-component core plans wrapper packages for these runtimes. Prefer primary sources: official documentation, source repositories and release notes, with their dates. Report facts and the disagreements between sources. Give no recommendation and no opinion.

## Findings
- React (the current React 19 docs) listens for a custom element's CustomEvents through an on-prefixed JSX prop that keeps the exact event name: onspeak listens for 'speak', and onsay-hi listens for 'say-hi'. The verifier noted that React 18 and earlier did not attach these listeners; a ref plus addEventListener was needed. Evidence: The react.dev section 'Listening for events on custom elements' gives the example &lt;my-element onspeak={e => ...}> and says event names are case-sensitive. The React 18 limit comes from the verifier's own knowledge, not from the page. Confidence high; vote 3-0. Source: https://react.dev/reference/react-dom/components, checked 2026-11-12.
- How React chooses between a property and an attribute on a custom element is unresolved. Two claims were refuted: that React passes values as attributes by default and turns non-strings into strings (vote 1-2), and that React sets a property only when the name exists on the instance during construction (vote 0-3). Evidence: Both statements were voted down against the same react.dev page. No replacement wording survived. Confidence low; vote refuted 1-2 and 0-3. Source: https://react.dev/reference/react-dom/components, checked 2026-11-12.
- Preact (the v10 guide) decides for each prop whether to set a DOM property or an attribute by inspecting the element. When the element defines a setter for that name, Preact uses the property. Preact never changes the case of a prop name, so someProperty must be spelled exactly; someproperty and some-property do not work. The v11 guide has the same naming note. Evidence: The guide text was quoted word for word. The v10 page carries a banner saying v11 is current (v11.2.0 is linked). From memory of Preact's source, a verifier said the real check is 'name in dom', which matches any property, not only setters, and works only once the element is upgraded. The verifier did not re-check this. Confidence high; vote 3-0 (both claims). Source: https://preactjs.com/guide/v10/web-components/ and https://preactjs.com/guide/v11/web-components, checked 2026-11-12.
- Preact registers an event prop it does not recognize with the exact casing written after 'on'. onTabChange listens for 'TabChange', and ontabchange listens for 'tabchange'. Evidence: The v10 guide gives this exact example. The vote was split, and nobody confirmed whether v11 behaves the same way. Confidence medium; vote 2-1. Source: https://preactjs.com/guide/v10/web-components/, checked 2026-11-12.
- In server rendering with preact-render-to-string, complex property values such as objects are not automatically serialized into the HTML. They reach the element only when the client hydrates. Evidence: The guide sentence was quoted word for word. Nobody checked what the renderer actually writes for such a value. Confidence high; vote 3-0. Source: https://preactjs.com/guide/v10/web-components/, checked 2026-11-12.
- In Preact v11 TypeScript, an undeclared custom element tag is a type error: "Property 'loading-bar' does not exist on type 'JSX.IntrinsicElements'". The guide says module augmentation is needed: declare global { namespace preact.JSX { interface IntrinsicElements { 'loading-bar': {...} } } }, with export {} in the file. Evidence: The official v11 TypeScript guide, section 'Extending IntrinsicElements for custom elements'. The page carries no date. Confidence high; vote 3-0 (two duplicate claims merged). Source: https://preactjs.com/guide/v11/typescript/, checked 2026-11-12.
- In Solid, attr:name={value} forces a value to be written as an attribute, with the prefix stripped (&lt;my-element attr:status={value} />). prop: forces property assignment and keeps objects and arrays as they are. bool: appears in examples. Types come from augmenting JSX.ExplicitProperties, ExplicitAttributes and ExplicitBoolAttributes in the 'solid-js' module. In the DOM runtime, null or undefined removes the attribute, and server rendering writes the stripped name with an escaped value. Evidence: The attr reference page was last updated 4/28/26. The TypeScript page shows &lt;my-web-component attr:name attr:count bool:disabled>. A verifier added a nuance: the docs type 'count' as a number for attr:, so attr: accepts values that are not strings, and the attribute itself ends up as a string. Confidence high; vote 3-0 (three claims merged). Source: https://docs.solidjs.com/reference/jsx-attributes/attr and https://docs.solidjs.com/configuration/typescript, checked 2026-11-12.
- In Solid, custom events are attached with on:Name. They are typed by augmenting JSX.CustomEvents, where the key matches the name exactly. Native events used with on: also need CustomEvents to be extended. Since v1.9.0, a handler can be an object that carries listener options. Evidence: Quoted from the official docs. The vote was split, and the docs describe Solid 1.x. Nobody checked whether a Solid 2.x pre-release changes on:. Confidence medium; vote 2-1. Source: https://docs.solidjs.com/configuration/typescript, checked 2026-11-12.
- The open-wc Custom Elements Manifest analyzer page lists community tools that read the manifest. cem-plugin-reactify and custom-element-react-wrappers generate React wrappers. custom-element-jsx-integration generates JSX types for projects that use JSX but not React. custom-element-solidjs-integration generates SolidJS types. The two integration tools generate types only, not wrappers. Evidence: The page's Community Plugins table, scraped live. Outside authors add entries by pull request, so a listing does not mean the tool is endorsed or maintained. Confidence high; vote 3-0 (two claims merged). Source: https://custom-elements-manifest.open-wc.org/analyzer/plugins/intro/, checked 2026-11-12.
- TanStack publishes TanStack Redact in the TanStack/redact GitHub repository, created 2026-04-20, as npm @tanstack/redact. The latest version is 0.3.1, published 2026-11-04T05:08Z, out of 18 GitHub releases. The 'next' dist-tag still points to 0.0.19. Releases come quickly, from 0.2.2 on 10-28 to 0.3.1 on 11-04. The project began as 'tanstack-dom', whose alpha packages @tanstack/react, @tanstack/react-dom and others were published under the next tag. Evidence: Checked against the live npm registry and the GitHub API on 2026-11-12. The npm maintainers are tannerlinsley, alemtuzlak and kevinvandy. Confidence high; vote 3-0 (three claims merged). Source: https://www.npmjs.com/package/@tanstack/redact and https://github.com/tanstack/redact, checked 2026-11-12.
- TanStack describes Redact as 'an alternative runtime for React apps, with a smaller footprint and synchronous rendering'. Apps keep their components, hooks and imports, and integrations exist for TanStack Start, Vite, Vinext and Next.js. A Vite plugin (@tanstack/redact/vite) redirects React imports. The README says Redact is 'not a new direction for React or a replacement for the project'. Tanner Linsley's launch post (2026-10-26) calls it 'a smaller replacement for React and React DOM in the browser' that needs no change to application code. Evidence: The wording differs between sources. 'Not a replacement' refers to the React project. 'Drop-in replacement' and 'smaller replacement' refer to the react and react-dom modules; the repository's first commit uses 'drop-in replacement'. 'No change to application code' is TanStack's own statement and has not been tested independently. Confidence high; vote 3-0, 3-0 and 2-1 (claims merged). Source: https://www.npmjs.com/package/@tanstack/redact and https://github.com/tanstack/redact and https://tanstack.com/blog/introducing-tanstack-redact, checked 2026-11-12.
- The sources disagree on Redact's compatibility. The repository's About text claims 'An alternative logical projection of React with 100% API compliancy'. The README and the compatibility docs say 'API availability is not a promise of every React behavior'. They also say React's APIs and behavior are the reference, but the default Vite setup renders synchronously. Listed exceptions: no time slicing, interruptible renders or priority scheduling (transitions, Activity, Suspense); full Fizz prerender and resume APIs are not implemented; legacy class lifecycles and the Profiler callback do nothing; the deprecated ReactDOM.render, ReactDOM.hydrate, unmountComponentAtNode and findDOMNode are not implemented. Evidence: The repository was fetched live at commit 782d829 (2026-11-11), and the compatibility page (v0) on 2026-11-12. Confidence high; vote 3-0 (two claims merged). Source: https://github.com/tanstack/redact and https://tanstack.com/redact/latest/docs/compatibility, checked 2026-11-12.
- With Next.js and Vinext, React still does server rendering and Server Components, and the framework keeps routing, caching and Server Action transport. Redact takes over only hydration and client rendering. The Next.js integration uses withRedact and keeps react and react-dom installed. Evidence: The launch post and the official Next.js integration page say the same thing. Confidence high; vote 3-0. Source: https://tanstack.com/blog/introducing-tanstack-redact and https://tanstack.com/redact/latest/docs/next, checked 2026-11-12.
- Redact's documented compatibility testing runs packed packages in Chromium. It compares React 18.0.0, 18.2.0, 18.3.1, 19.0.0 and 19.3.1 against Redact in development and production bundles, covering createRoot, server rendering, hydration, refs, context, portals, lazy loading and external stores. Commands: REACT_VERSION=18.3.1 pnpm test:react18 and pnpm test:compatibility:size. This is the only testing practice in the evidence; the page does not publish results. Evidence: Quoted word for word from the v0 docs. The page describes what the tests cover, not their results. It says nothing about custom elements. Confidence high; vote 3-0. Source: https://tanstack.com/redact/latest/docs/compatibility, checked 2026-11-12.

## Follow-ups
None. The open points belong to this same question; they are under "Still open".

## Next action
More runs of the same script with narrower questions, one for each open group. They wait for Peter's go, asked on 2026-11-12:

1. One run on React 19 and Redact with custom elements: the rule for properties and attributes on the client and on the server, JSX types, refs, children and slots, and what Redact does.
2. One run on wrapper production and wrapper tests in named libraries: `@lit/react`, Stencil output targets, Web Awesome, Spectrum Web Components, Fluent UI web components and Ionic, for React, Preact and Solid.

Add the confirmed findings of each run to this record, then judge the sufficient-answer condition again.
