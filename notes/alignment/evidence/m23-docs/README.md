# Documentation acceptance

Run against the built local site (`bun run docs`, then `bun scripts/dev.ts --no-build --no-watch`). Set `ACME_BROWSER_RUNTIME` to the directory containing `node_modules/playwright` and `browsers`. Set `ACME_CHROMIUM_PATH` to the Chrome executable when using system Chrome.

- `pages-run.ts`: all 123 routes, custom-element registration, visible setup errors and page exceptions. This is a smoke check, not an interaction claim.
- `recipes-run.ts`: thirteen explicit outcomes across the three engines, including native form submission, controlled pagination, keyboard selection and both real virtual-table consumers.
- `navigation-run.ts`: persistent links, measured clearance, narrow viewport/text zoom, mobile navigation and focus return.
- `recipe-accessibility-run.ts`: native Chromium accessibility tree and actual settings/pagination outcomes. Playwright's JavaScript name calculation misses element references and is not the accessibility oracle here.
- `copied-run.ts`: every HTML example's exact-version package URLs exist; representative copied scripts run through selective browser entries.
- `video-run.ts`: copied media examples load their embedded synthetic video and captions outside the documentation site.
- `icons-run.ts`: class purity, definition/class identity and shared records across copied artwork/family modules.

Dated JSON files preserve the specific accepted runs. External Google Fonts requests are blocked in site/source runs because external DNS was unavailable during the checkpoint. Navigation measurements use fallback fonts; they do not certify final font appearance. Copy/format regressions, including nested templates and backtick fences, live beside site source in `site/__tests__`.
