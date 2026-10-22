# Documentation acceptance

These are required documentation checks. Use pinned Bun 1.4.2 from the repository root; checkpoint counts and font conditions below remain historical.

Run against the built local site (`bun run docs`, then `bun scripts/dev.ts --no-build --no-watch`). Set `ACME_BROWSER_RUNTIME` to the directory containing `node_modules/playwright` and `browsers`. Set `ACME_CHROMIUM_PATH` to the Chrome executable when using system Chrome.

- `scripts/verification/documentation/pages.browser-check.ts`: all routes from the generated navigation index, custom-element registration, visible setup errors and page exceptions. The M23 checkpoint contained 123 routes. This is a smoke check, not an interaction claim.
- `scripts/verification/documentation/recipes.browser-check.ts`: thirteen explicit outcomes across the three engines, including native form submission, controlled pagination, keyboard selection and both real virtual-table consumers.
- `scripts/verification/documentation/navigation.browser-check.ts`: persistent links, measured clearance, narrow viewport/text zoom, mobile navigation and focus return.
- `scripts/verification/documentation/recipe-accessibility.browser-check.ts`: native Chromium accessibility tree and actual settings/pagination outcomes. Playwright's JavaScript name calculation misses element references and is not the accessibility oracle here.
- `scripts/verification/documentation/copied.browser-check.ts`: every HTML example's exact-version package URLs exist; representative copied scripts run through selective browser entries.
- `scripts/verification/documentation/video.browser-check.ts`: copied media examples load their embedded synthetic video and captions outside the documentation site.
- `scripts/verification/documentation/icons.browser-check.ts`: class purity, definition/class identity and shared records across copied artwork/family modules.

Dated JSON files preserve the accepted runs. New reports use .artifacts/m23-docs/. External Google Fonts requests were blocked in the recorded site/source runs because external DNS was unavailable during that checkpoint. Navigation measurements use fallback fonts; they do not certify final font appearance. Copy/format regressions, including nested templates and backtick fences, live beside site source in `site/__tests__`.

## Workflow migration verification

The relocated checks are covered by [task 8 acceptance](../../workflow-migration/task-08.json) in local dirty-preparation scope. [Relevant run evidence](../../workflow-migration/runtime/documentation/fullsite-results.json) is separate from the historical results above. Final clean-candidate, live-caller and host-session acceptance remain tasks 10–12; no publication or actual-platform certification follows from this local run.
