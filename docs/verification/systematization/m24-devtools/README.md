# M24 optional inspector verification

This is a manual local compiled-consumer check. It remains distinct from the required installed-archive inspector check and from consumer-skill evaluation.

Run with pinned Bun 1.4.2 from the repository root after core/React and optional tooling builds:

```sh
ACME_BROWSER_RUNTIME=/absolute/path/to/browser-checks \
ACME_CHROMIUM_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
bun scripts/verification/devtools/browser-check.ts
```

The browser runtime directory must contain `node_modules/playwright` and its
`browsers` directory. All application, core and optional-package imports resolve
from this checkout. The fixture bundles the already-built optional runtime again,
which tests downstream font and renderer delivery. Results/screenshots are written
to `.artifacts/checks/devtools` without replacing the accepted record here.

`scripts/verification/devtools/fixtures/browser.ts` mounts real Lit and generated React Inputs plus a password
control inside an explicit root. A separate outside control proves scope. It
exposes only fixture state for Playwright assertions. The actual inspector uses
its public `createDesignSystemInspector` interface. `scripts/verification/devtools/fixtures/production.ts` proves
an application development branch does not include the optional runtime in its
production bundle.

The dated JSON stores engine outcomes, production exclusion, source/catalog
hashes and the optional runtime's dependency/font/correction provenance. Two
screenshots show the actual desktop and narrow surface after the null-key fix.
This is local compiled-consumer evidence. Final package archives and independent
consumer-skill artifact evaluation remain separate release checks.

## Workflow migration verification

The relocated checks are covered by [task 8 acceptance](../../workflow-migration/task-08.json) in local dirty-preparation scope. [Relevant run evidence](../../workflow-migration/runtime/checks/devtools/results.json) is separate from the historical results above. Final clean-candidate, live-caller and host-session acceptance remain tasks 10–12; no publication or actual-platform certification follows from this local run.
