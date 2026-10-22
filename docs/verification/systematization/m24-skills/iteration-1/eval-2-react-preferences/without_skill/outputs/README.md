# React baseline consumer evaluation

Uses the installed exact matching core and React wrapper packages at 0.2.0 with React/ReactDOM 19.3.0. Only package README, public declarations and published code informed implementation. No consumer skill was read.

Run from this directory:

```sh
bun build app.tsx --outdir dist --target browser
bun /Users/peterkloss/Dev/ACMElabs/design-system/node_modules/typescript/bin/tsc -p tsconfig.json
bun server.ts
```

Open http://localhost:4317. Run `bun verify.ts` while the server runs for the real Chromium keyboard, native AX, state and lifecycle checks.

`result.json` contains 14 passing browser assertions and the first failures/repairs. `first-browser-result.json` preserves the initial timing failure before the browser test waited for React's rendered state. `ax-initial.json` holds native accessibility evidence. `initial.png` and `verified.png` are screenshots. The app itself needed no repairs after its first successful build. No package code or dependencies were modified.
