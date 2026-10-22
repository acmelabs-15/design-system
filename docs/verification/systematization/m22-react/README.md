# React acceptance fixtures

Commands run from the repository root with pinned Bun 1.4.2. Saved acceptance records retain their original package/version scope.

Run `bun run build` first. Set `ACME_BROWSER_RUNTIME` to the directory containing `node_modules/playwright` and `browsers`. Set `ACME_CHROMIUM_PATH` only when using an installed Chrome executable.

- `bun scripts/verification/react/browser-check.ts` checks the workspace packages.
- Set `ACME_REACT_CONSUMER` to a fresh directory with the packed core and React packages installed to run the same checks against that installation.
- `bun scripts/verification/react/defaults-check.ts` audits every registered element and declared default in that fresh consumer.
- Copy `scripts/verification/react/fixtures/public-types.tsx` to the consumer and run TypeScript with strict mode, bundler resolution and React JSX. Its expected errors verify rejected inputs and event types.

New runtime reports go under .artifacts/checks/react/runtime/; the default audit writes .artifacts/checks/react/defaults-results.json. Saved evidence here is not overwritten. Runners own and close their loopback servers and browsers. The dated JSON acceptance record preserves results for each run and tested version.

## Workflow migration verification

The relocated checks are covered by [task 8 acceptance](../../workflow-migration/task-08.json) in local dirty-preparation scope. [Relevant run evidence](../../workflow-migration/runtime/checks/react/runtime/results.json) is separate from the historical results above. Final clean-candidate, live-caller and host-session acceptance remain tasks 10–12; no publication or actual-platform certification follows from this local run.
