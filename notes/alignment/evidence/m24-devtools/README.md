# M24 optional inspector verification

Run from the repository root after core/React and optional tooling builds:

```sh
ACME_BROWSER_RUNTIME=/absolute/path/to/browser-checks \
ACME_CHROMIUM_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
bun notes/alignment/evidence/m24-devtools/browser-run.ts
```

The browser runtime directory must contain `node_modules/playwright` and its
`browsers` directory. All application, core and optional-package imports resolve
from this checkout. The fixture bundles the already-built optional runtime again,
which tests downstream font and renderer delivery. Results/screenshots are written
to `.artifacts/m24-devtools` without replacing the accepted record here.

`browser-entry.ts` mounts real Lit and generated React Inputs plus a password
control inside an explicit root. A separate outside control proves scope. It
exposes only fixture state for Playwright assertions. The actual inspector uses
its public `createDesignSystemInspector` interface. `production-entry.ts` proves
an application development branch does not include the optional runtime in its
production bundle.

The dated JSON stores engine outcomes, production exclusion, source/catalog
hashes and the optional runtime's dependency/font/correction provenance. Two
screenshots show the actual desktop and narrow surface after the null-key fix.
This is local compiled-consumer evidence. Final package archives and independent
consumer-skill artifact evaluation remain separate release checks.
