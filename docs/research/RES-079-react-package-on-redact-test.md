---
id: RES-079
status: resolved # in-progress | resolved
outcome: answered
kind: task
from: IDEA-004#03 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-20
---
# RES-079: Test of a React package over Lit elements on TanStack Redact

<!-- Add outcome: answered, partial or blocked to frontmatter when an answer or a block is known. Only answered work can become resolved. -->

## Question
Does the React package run on Redact unchanged? The row serves IDEA-004#04, which targets ship in 1.0, IDEA-004#05, generated or written wrappers, and IDEA-004#06, the tests of each wrapper.

## Answer
Answered on 2026-11-20. No: the React package does not run on Redact 0.3.1 unchanged. The same application code and the same wrappers give different readings at points 1, 2, 3, 4 and 7. The convenience form of Steps fails on Redact with a page error. The composed form and the custom composition of candidate A work on both runtimes, and their React state follows each step change. A changed wrapper (point 8) passed every point on both runtimes. The result file, with the table of each point side by side, is `.artifacts/v1/trial/IDEA-004-03/IDEA-004-03-result.md` (scratch, outside git).

The first capability check was blocked: the Chrome DevTools MCP could not reach a browser. The coordinator changed the brief on 2026-11-20 to a scripted headless Chrome. The run used that route; see Findings and the limits below.

Planned action: in the scratch folder `.artifacts/v1/trial/IDEA-004-03/`, run one application over Lit elements two times, on React 19 and on Redact, with the same application code. The elements are a copy of candidate A of the prototype of IDEA-003#05, with its React wrapper, and one small element made for the points below. The brief is `.artifacts/v1/briefs/IDEA-004-03.md` with `.artifacts/v1/briefs/common-task.md` (scratch, outside git).

Completion condition: the result file gives, for each of these points, the observed outcome on React 19 and on Redact side by side, or "not performed" with the reason.

1. An array prop and an object prop: property or attribute, and with which value.
2. A camelCase prop reaches the camelCase property.
3. An event name with a dash and a camelCase event name each call the handler.
4. `onChange` fires for a `change` event that does not bubble.
5. What a ref holds.
6. Children and `slot` attributes reach the element as written.
7. The Steps wrapper of candidate A works in its convenience form, its composed form and a custom composition, and the React state follows a step change.
8. For each point that differs on Redact: the smallest change of the wrapper that passes on both runtimes, observed on both, or "none found".

Steps that are safe to repeat: each of them. The task writes only inside its scratch folder, installs packages only there, publishes nothing and signs in to nothing.

## Findings
- Capability check, 2026-11-20: skills brain:source-driven-development and brain:browser-testing-with-devtools loaded; `npm --version` 11.19.0; pinned Bun 1.4.2; WebFetch read https://tanstack.com/redact/latest/docs/installation. Source: `.artifacts/v1/trial/IDEA-004-03/IDEA-004-03-progress.md` (scratch, outside git), checked 2026-11-20.
- Chrome DevTools MCP `list_pages` failed two times with "The browser is already running for /Users/peterkloss/.cache/chrome-devtools-mcp/chrome-profile. Use --isolated to run multiple browser instances." A Chrome 157.0.8103.79 process (pid 26656, up 2 h 28 min) holds that profile, and chrome-devtools-mcp servers of versions 1.6.0, 1.11.0 and `latest` run at the same time. Source: the tool's reply and `ps`, checked 2026-11-20.
- Redact's installation page says: install `@tanstack/redact`, keep the existing React dependencies, keep importing from `react` and `react-dom`; the Vite setup is on the quick-start page. Source: https://tanstack.com/redact/latest/docs/installation, checked 2026-11-20.
- Browser route used after the change of brief: the installed Chrome 157.0.8103.79, headless, driven by puppeteer-core 25.18.1 (Node v24.20.0), with a user data directory inside the scratch folder; proved by `scripts/prove-chrome.mjs` opening `about:blank`. No Chrome DevTools MCP tool was called after the change. Source: `.artifacts/v1/trial/IDEA-004-03/IDEA-004-03-progress.md`, checked 2026-11-20.
- Setup per Redact's quick-start: `plugins: [react(), redact()]` with `redact` from `@tanstack/redact/vite`; the React build has `plugins: [react()]`. Both build the same `src/main.jsx` with vite 8.3.8 and @vitejs/plugin-react 6.3.0. Runtimes: react and react-dom 19.3.1; @tanstack/redact 0.3.1, whose `React.version` reads "19.2.3". The Redact bundle holds `@tanstack/redact` and no `react-dom`. Source: https://tanstack.com/redact/latest/docs/quick-start and the result file, checked 2026-11-20.
- Point 1: on React 19 `items` and `config` arrive as properties (`el.items === array`, `el.config === object`, no attribute). On Redact they arrive as attributes `items="alpha,beta,gamma"` and `config="[object Object]"`; Lit's default converters give `null` for both, with no error. Source: `.artifacts/v1/trial/IDEA-004-03/observations/points-thin.json` (scratch, outside git), checked 2026-11-20.
- Point 2: on React 19 `someValue` is set as a property. On Redact it is written as the attribute `somevalue`, and reaches `el.someValue` only through Lit's default lower-cased attribute. Source: `.artifacts/v1/trial/IDEA-004-03/observations/points-thin.json` (scratch, outside git), checked 2026-11-20.
- Point 3: `onacme-change` calls the handler on both; React passes the native event, Redact an object that is not an `Event` and has `nativeEvent`. `onitemSelect` calls the handler on React 19 and not on Redact. Source: `.artifacts/v1/trial/IDEA-004-03/observations/points-thin.json` (scratch, outside git), checked 2026-11-20.
- Point 4: for a `change` event that does not bubble, `onChange` is not called on React 19 and is called on Redact. Source: `.artifacts/v1/trial/IDEA-004-03/observations/points-thin.json` (scratch, outside git), checked 2026-11-20.
- Point 5: on both the ref holds the element itself (`instanceof AcmeProbe`), passed through the wrapper's props. Point 6: on both the children and their `slot` attributes arrive as written, and each slot assigns its child. Source: `.artifacts/v1/trial/IDEA-004-03/observations/points-thin.json` (scratch, outside git), checked 2026-11-20.
- Point 7: on React 19 all three forms work and React state goes 0, 1 (Next), 2 (third trigger). On Redact the convenience form gets `steps` as the attribute `"[object Object],[object Object],[object Object]"`, `el.steps` is `null`, the page error "Cannot read properties of null (reading 'map')" occurs and nothing renders inside it; the composed form and the custom composition work with the same readings as React. `Steps.Content index` arrives on Redact as an attribute and Lit turns it into the number property. Source: `.artifacts/v1/trial/IDEA-004-03/observations/points-thin.json` (scratch, outside git), checked 2026-11-20.
- Point 8: the probe wrapper that assigns `items`, `config` and `someValue` as properties through a ref in `useLayoutEffect`, and adds `addEventListener` for `acme-change`, `itemSelect` and `change`, passed points 1 to 4 on both runtimes (each handler called once with the native event). Candidate A's wrapper with one change, `steps` of the convenience `Steps` assigned through a ref in `useLayoutEffect`, passed point 7 on both. Points 5 and 6 needed no change. Source: `.artifacts/v1/trial/IDEA-004-03/observations/points-fixed.json` and `.artifacts/v1/trial/IDEA-004-03/src/fixed/` (scratch, outside git), checked 2026-11-20.
- Limits: Chrome only, headless; production builds only; client rendering only; each prop set once, with no update after the first render; the probe uses Lit's default property options. Source: `.artifacts/v1/trial/IDEA-004-03/IDEA-004-03-result.md`, section Limits (scratch, outside git), checked 2026-11-20.

## Follow-ups
None.

## Next action
None for the task agent. The result waits for IDEA-004#04, #05 and #06.
