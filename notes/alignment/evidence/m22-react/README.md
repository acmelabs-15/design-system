# React acceptance fixtures

Run `bun run build` first. Set `ACME_BROWSER_RUNTIME` to the directory containing `node_modules/playwright` and `browsers`. Set `ACME_CHROMIUM_PATH` only when using an installed Chrome executable.

- `bun notes/alignment/evidence/m22-react/run.ts` checks the workspace packages.
- Set `ACME_REACT_CONSUMER` to a fresh directory with the packed core and React packages installed to run the same checks against that installation.
- `bun notes/alignment/evidence/m22-react/defaults-run.ts` audits every registered element and declared default in that fresh consumer.
- Copy `types.tsx` to the consumer and run TypeScript with strict mode, bundler resolution and React JSX. Its expected errors verify rejected inputs and event types.

Reports go under `.artifacts/m22-react/`. Runners own and close their loopback servers and browsers. The dated JSON acceptance record preserves results for each run and tested version.
