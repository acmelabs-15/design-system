# Official Firefox acceptance — 2026-09-26

`2026-09-26.json` records official Mozilla Firefox 156.0.1. Its original macOS archive matches Mozilla's SHA-512 list; codesign verification and the executable version check pass. The test uses a new isolated headless profile and removes it afterward. No personal browser profile, account or system setting is used.

All 125 built documentation routes pass in their original sequence, including Flow Diagram followed by Format Byte and the new managed-forms recipe. The oracle matches the shared documentation gate: a main heading, upgraded example buttons, no visible example error, no undefined HTML custom tag in previews and no uncaught page error. HTML namespace plus `:defined` includes documentation-only components and respects scoped definitions.

The same process then passes the original twenty Flow removal/reconnection/cancellation/navigation cycles. The existing timing sequence [0,5,10,16,30,60] repeats unchanged. No route is omitted, no retry hides a failure and no delay is introduced as a workaround. This resolves the supported-browser check; it does not establish the cause of the older Playwright-patched Firefox155 crash.

Commands:

```sh
bun scripts/official-firefox-checks.ts install
bun scripts/official-firefox-checks.ts
```

The runtime uses `ACME_BROWSER_RUNTIME` for verified browser artifacts and `ACME_RELEASE_CONSUMER` for compiled package fixtures. On macOS, the already isolated application/archive paths may be supplied through `ACME_OFFICIAL_FIREFOX_APP` and `ACME_OFFICIAL_FIREFOX_ARCHIVE`. On Linux, the installer downloads the exact version/platform archive from archive.mozilla.org, verifies SHA-512 and extracts a fresh copy before execution. Unsupported platforms, mismatched hashes or versions fail. Linux execution itself remains part of the unrun external CI gate.

The prior patched-Firefox full-page crash is retained by the main integration record. Its isolated rendering checks have a different scope. Actual Safari and assistive-technology checks remain separate.

Sources: [Mozilla version archive and checksums](https://archive.mozilla.org/pub/firefox/releases/156.0.1/SHA512SUMS), [Playwright 1.63.0 browser versions](https://github.com/microsoft/playwright/releases/tag/v1.63.0). Playwright's current stable release still bundles Firefox155; no verified maintained Playwright upgrade was available at this checkpoint.
