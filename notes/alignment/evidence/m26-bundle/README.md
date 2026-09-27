# Static class and dynamic definition initialization

Verified 2026-09-26 under Bun 1.4.2.

The exact M08 consumer probe still failed when the unchanged 0.3.0 package snapshot was bundled with `splitting:false`. Chromium, Firefox and WebKit all read `AcmeHeading` as undefined before its dynamic definition import. All later registration and rendering checks passed. The same input with `splitting:true` passed all four checks in all three engines.

This snapshot preceded unrelated attribute-reset changes. Heading itself was unchanged. [Original results](archived-star-results.json) record the archive and exact probe hashes.

## Cause and controls

The failure reduces to plain JavaScript with no Lit, decorators or application state. All three conditions are needed in the tested reduction:

1. A package `sideEffects` allowlist excludes its class module and barrel.
2. The barrel uses `export *`.
3. The entry statically reads a class through the barrel before dynamically importing its definition module.

Bun's single output places the class initialization inside a lazy initializer. It calls that initializer only from the later dynamic import, after the static read. [Minimal source](minimal/probe.js) and [emitted output](minimal-single-output.js) preserve the example.

The 27-case matrix varies side-effect metadata, star/named/direct imports and plain/derived/decorated classes. Only the three pure-star cases fail. Native browser ESM passes in all three engines. The same minimal source bundled with splitting passes in all three; single output fails in all three. [Reduction](reduction-results.json), [native control](native-control-results.json).

Sources: [JavaScript import evaluation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and [Bun code splitting](https://bun.com/docs/bundler#splitting). No upstream issue or pull request was sent.

## Library change

`src/index.ts` now declares its public value and type exports explicitly. This is a normal static package interface. It does not register classes, add aliases or wrap initialization.

In a scratch copy of the actual archived package, replacing only the barrel with exact named exports made the original M08 probe pass in both build modes and every browser. [Named-barrel results](named-barrel-results.json). The original tarball was not changed; the result records the modified installed barrel hash separately.

A separate runtime probe checks every archived value export against its original module and checks Heading definition/class identity. All 201 archived values match in both modes and all three engines. [Runtime identity](runtime-identity-results.json).

The source-level TypeScript comparison preserves all remaining 251 exports: 199 values and 52 type-only symbols, with identical resolved declaration origins and symbol flags. The two separately approved obsolete base helpers, `assetsBase` and `setAssetsBase`, are excluded from this comparison. They explain the archived/current value-count difference. [Symbol comparison](symbol-preservation.json).

The integrated clean0.3 archive now passes the original consumer in single and split modes across all three engines. [Final archive result](../m26-final/bundle.json). The earlier results above isolate the barrel change.

## Replay

Use Bun 1.4.2 and a Playwright runtime directory. `ACME_CHROMIUM_PATH` optionally selects Chrome.

```sh
ACME_BROWSER_RUNTIME=/path/to/playwright-runtime ACME_CORE_ARCHIVE=/path/to/core.tgz bun notes/alignment/evidence/m26-bundle/run.ts
ACME_BROWSER_RUNTIME=/path/to/playwright-runtime bun notes/alignment/evidence/m26-bundle/native-control.ts
ACME_BROWSER_RUNTIME=/path/to/playwright-runtime bun notes/alignment/evidence/m26-bundle/reduce.ts
```

`run.ts` uses a fresh installed archive consumer by default. `ACME_KEEP_BUNDLE_CONSUMER=1` retains it for reduction. `ACME_BUNDLE_CONSUMER` reuses only a directory with the fixture's own package marker. `--supported` tests split output alone; the full comparison remains the default.

The retained scratch consumer for this run is `/var/folders/b6/2r9mrtsj70s3x013xbhxt2yr0000gn/T/acme-m26-bundle-3bIxJy`. It contains the named archived barrel. `named-runtime.ts` records the runtime rewrite, `named-source.ts` records the source/type comparison, and `runtime-identity.ts` checks complete runtime binding identity. No global installed package was modified.
