---
id: RES-087
status: resolved # in-progress | resolved
outcome: answered
kind: task
from: IDEA-004#10 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-20
---
# RES-087: The React package on Preact, and a wrapper of @lit/react on three runtimes

## Question
Does the React package over Lit elements run on Preact through `preact/compat`, and does a wrapper made with `createComponent` of `@lit/react` pass on React 19, on Redact and on Preact?

Peter decided on 2026-11-20 that the framework targets of 1.0 are React, Redact and Preact (DEC-168). The test RES-079 ran one application on React 19 and on Redact and found one changed wrapper that passes on both. It did not run Preact, and it did not use `@lit/react`.

Needed by: IDEA-004#05, whether each wrapper is generated or written by hand; IDEA-004#06, the tests of each wrapper; IDEA-004#07, whether each target is its own package or an entry of one package.

## Answer
Answered on 2026-11-20. The same application code runs on Preact 11.2.0 through `preact/compat`, set up with `@preact/preset-vite` as Preact's documentation says. With the unchanged wrapper of RES-079, Preact passed points 1 to 7; on that wrapper React 19 differs at point 4 and Redact at points 1, 2, 3, 4 and 7, as in RES-079. The changed wrapper of RES-079 passed points 1 to 7 on React 19, Redact and Preact. The wrapper made with `createComponent` of `@lit/react` 1.0.8 passed points 1 to 7 on all three. On Redact and Preact it leaves the attribute `suppresshydrationwarning` on every element; one added wrapper layer removed it on all three. On Preact, `useState` and `useEffect` of the application work, and the page logged no warning or error of `preact/compat` or `preact/debug`. The result file, with one table per wrapper and the three runtimes side by side, is `.artifacts/v1/trial/IDEA-004-10/IDEA-004-10-result.md` (scratch, outside git).

Planned action: in the scratch folder `.artifacts/v1/trial/IDEA-004-10/`, start from a copy of the application of `.artifacts/v1/trial/IDEA-004-03/`. Run the same application code on three runtimes: React 19, Redact, and Preact through `preact/compat`. Run it with three wrappers: the unchanged wrapper of RES-079, its changed wrapper, and a wrapper made with `createComponent` of `@lit/react`. The brief is `.artifacts/v1/briefs/IDEA-004-10.md` with `.artifacts/v1/briefs/common-task.md` (scratch, outside git).

Completion condition: the result file gives, for each of the eight points of RES-079 and for each of the three wrappers, the observed outcome on React 19, on Redact and on Preact side by side, or "not performed" with the reason. It also says, for Preact, whether a hook of the application works and what a ref holds.

Steps that are safe to repeat: each of them. The task writes only inside its scratch folder, installs packages only there, publishes nothing and signs in to nothing.

## Findings
- Capability check, 2026-11-20: skills brain:source-driven-development and brain:browser-testing-with-devtools loaded; `npm --version` 11.19.0; pinned Bun 1.4.2; WebFetch read Preact's getting-started page; `scripts/prove-chrome.mjs` opened `about:blank` in the installed Chrome 157.0.8103.79, headless, driven by puppeteer-core 25.18.1. No Chrome DevTools MCP tool was called. Source: `.artifacts/v1/trial/IDEA-004-10/IDEA-004-10-progress.md` (scratch, outside git), checked 2026-11-20.
- Preact's setup: "we need to point all `react` and `react-dom` imports to Preact"; "If you're using Vite (via `@preact/preset-vite`) ... these aliases are automatically handled for you by default." The page covers 11.x (v11.2.0). Source: https://preactjs.com/guide/v11/getting-started#aliasing-react-to-preact, checked 2026-11-20.
- Preact sets a property when the element has it and "makes no assumptions over naming schemes"; it registers unknown event props "using their casing exactly as specified"; it has no synthetic events. Source: https://preactjs.com/guide/v11/web-components and https://preactjs.com/guide/v11/differences-to-react, checked 2026-11-20.
- `createComponent` takes `tagName`, `elementClass`, `react` and `events`; a prop found by an `in` check is set as a property, an event prop with `addEventListener()`, other props as attributes; the page says the `react` option "can also be an import of preact-compat". Source: https://lit.dev/docs/frameworks/react/, checked 2026-11-20.
- Versions run: preact 11.2.0 with @preact/preset-vite 2.10.6 (aliases `react` and `react-dom` to `preact/compat`); @lit/react 1.0.8; react and react-dom 19.3.1; @tanstack/redact 0.3.1; vite 8.3.8. `React.version` read from the pages: "19.3.1", "19.2.3" and "19.0.0" (Preact). The Preact bundle holds Preact and no `react-dom` or `@tanstack/redact`. Source: the result file, section Versions, checked 2026-11-20.
- Unchanged wrapper on Preact: `items` and `config` arrive as properties with the same identity, `someValue` as a property, no attributes; the dash, camelCase and `onChange` handlers are each called once with an `Event` instance that also has a `nativeEvent` property; the ref holds the element; children and slots arrive as written; the three Steps forms work and the state goes 0, 1, 2. Source: `.artifacts/v1/trial/IDEA-004-10/observations/points-thin.json` (scratch, outside git), checked 2026-11-20.
- Unchanged wrapper on React 19 and Redact: the readings of RES-079 repeat. React 19 does not call `onChange` for the `change` that does not bubble. Redact writes `items`, `config` and `someValue` as attributes, does not call the camelCase handler, and the convenience form fails with "Cannot read properties of null (reading 'map')". Source: `.artifacts/v1/trial/IDEA-004-10/observations/points-thin.json` (scratch, outside git), checked 2026-11-20.
- Changed wrapper of RES-079: points 1 to 7 pass on React 19, Redact and Preact with the same readings; each handler is called once with the native event. On Redact only, `acme-a-steps-content` carries an `index` attribute and the convenience element a `label` attribute. Source: `.artifacts/v1/trial/IDEA-004-10/observations/points-fixed.json` and `observations/extra.json` (scratch, outside git), checked 2026-11-20.
- `createComponent` wrapper: points 1 to 7 pass on all three with the same readings as the changed wrapper. `createComponent` 1.0.8 always passes `suppressHydrationWarning: true` to `createElement`; on Redact every element carries `suppresshydrationwarning=""`, on Preact `suppresshydrationwarning="true"`, on React none. Source: `.artifacts/v1/trial/IDEA-004-10/observations/points-litreact.json`, `observations/extra.json` and `node_modules/@lit/react/create-component.js` (scratch, outside git), checked 2026-11-20.
- Point 8 for the `createComponent` wrapper: wrapping each `createComponent` result once more, in a `forwardRef` component that forwards the ref and removes `suppresshydrationwarning` in a `useLayoutEffect` after each render, left no such attribute on React, Redact or Preact, before and after a re-render; points 1 to 7 passed on all three. Source: `.artifacts/v1/trial/IDEA-004-10/observations/points-litreact2.json` and `observations/extra.json` (scratch, outside git), checked 2026-11-20.
- Preact hooks and warnings: `useEffect` ran once and stored the ref; each `useState` followed the step changes; `useRef`, `useLayoutEffect`, `useCallback` and `forwardRef` of the wrappers ran on `preact/compat`. The production pages logged nothing. In the Vite dev server, with `preact/debug` loaded, no message came from Preact; two came from Lit's dev mode. Source: `.artifacts/v1/trial/IDEA-004-10/observations/` and the result file, checked 2026-11-20.
- Limits: Chrome only, headless; production builds for points 1 to 8; client rendering only, so hydration was not tested; props set once except the re-render after a step change; the Steps element classes for `createComponent` came from `customElements.get()`. Source: `.artifacts/v1/trial/IDEA-004-10/IDEA-004-10-result.md`, section Limits (scratch, outside git), checked 2026-11-20.

## Follow-ups
None.

## Next action
None for the task agent. The result waits for IDEA-004#05, #06 and #07.
