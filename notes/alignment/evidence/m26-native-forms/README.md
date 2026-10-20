# Native form history evidence

Verified 2026-09-26 against the current 0.3.0 built browser modules, with Bun 1.4.2. This is a local macOS browser check, not a Linux CI result.

`history-run.ts` serves a real document containing a native input and AcmeInput in one form. Playwright fills both inputs, follows a link to another document, and uses browser Back. The runner reads the public value, shadow input value, and actual FormData. It does not invoke or replace a form restoration callback.

All three browser engines passed:

| Engine | Version | Observed return | Native value | AcmeInput value and FormData |
|---|---|---|---|---|
| Chrome | 154.0.8037.57 | New document; `back_forward`; `pageshow.persisted=false` | Restored | Restored |
| Playwright Firefox | 155.0 | New document; `back_forward`; `pageshow.persisted=false` | Restored | Restored |
| Playwright WebKit | 26.6 | New document; `back_forward`; `pageshow.persisted=false` | Restored | Restored |

`history-results.json` records both document identifiers, both snapshots, browser versions, built registration entry hash, and the run time. Different document identifiers establish that these passes test fresh-document history restoration, rather than retained document state. No special browser flags force this mode. The native input is the platform control in each case.

This closes local Input history restoration. It does not establish bfcache retention, password-manager autofill, session recovery after browser restart, other form-control families, or actual Safari behavior. Official Firefox sequential documentation/Flow coverage is a separate gate.

Run after the normal core build:

```sh
ACME_BROWSER_RUNTIME=/path/to/browser-runtime \
ACME_CHROMIUM_PATH=/path/to/chrome \
bun notes/alignment/evidence/m26-native-forms/history-run.ts
```

Omit `ACME_CHROMIUM_PATH` to use the installed Playwright Chromium. `ACME_HISTORY_RESULTS` selects the result destination. The shared browser gate uses `.artifacts/checks/history.json`; the committed result preserves this initial local run.
