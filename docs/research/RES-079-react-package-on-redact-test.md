---
id: RES-079
status: in-progress # in-progress | resolved
outcome: blocked
kind: task
from: IDEA-004#03 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-20
---
# RES-079: Test of a React package over Lit elements on TanStack Redact

<!-- Add outcome: answered, partial or blocked to frontmatter when an answer or a block is known. Only answered work can become resolved. -->

## Question
Does the React package run on Redact unchanged? The row serves IDEA-004#04, which targets ship in 1.0, IDEA-004#05, generated or written wrappers, and IDEA-004#06, the tests of each wrapper.

## Answer
Blocked at the capability check on 2026-11-20. The Chrome DevTools MCP did not answer `list_pages`, so no point could be observed in a browser. Nothing was built and no package was installed. The result file is `.artifacts/v1/trial/IDEA-004-03/IDEA-004-03-result.md` (scratch, outside git).

Retry condition: `list_pages` of the Chrome DevTools MCP answers in the task agent's session.

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

## Follow-ups
None.

## Next action
Peter makes the Chrome DevTools MCP reachable for a task agent: either the session's server attaches to the browser that holds the shared profile, or it runs with `--isolated` or its own user data directory. Then the task agent starts again at the capability check of its brief.
