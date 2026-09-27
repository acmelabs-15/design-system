# Durable component browser checks

`bun scripts/component-browser-checks.ts` uses the installed compiled package selected by `ACME_RELEASE_CONSUMER`, or the local core workspace when omitted. Set `ACME_BROWSER_RUNTIME`; `ACME_CHROMIUM_PATH` is optional. `ACME_COMPONENT_SUITES` and `ACME_COMPONENT_ENGINES` select explicit diagnostic subsets; CI uses the full defaults.

The fixture coverage check accounts for all 31 colocated browser fixture files. Twenty-six preserved suites contain 357 named cases. `controls.json` adds the original Number Input, Pin Input and Slider editing/pointer driver tails and their required setup; their total result counts are 45, 33 and 44, including the newer slot checks. ComboBox contributes its keyed-child identity regression. Flow and JSON View each add one measurement record. This produces 482 result rows per engine. The dedicated Tabs four-treatment browser gate remains separate.

One shared build, HTTP server, compiled-runtime import mapping, browser lifecycle and result collector execute the suites. Generated case modules under `.artifacts/checks/components/generated` are compiled from committed local test records; no remote prose is evaluated and no historical temporary path is read. Original driver paths/hashes are provenance only. Every original assertion body is retained; source maps and public definitions use the same compiled component runtime. The generator uses complete registrations so owned children are defined.

`accepted-combined.json` combines successful rows from the complete first matrix and the documented focused follow-ups. It is explicitly not a new single-shot run. All 1,446 result rows pass, with no page errors. Final CI invokes the same command in one run against the final package archives. The unchanged original failed results stay in this directory.

Harness corrections:

- Chart's old `#chart svg` locator also found its now-defined disclosure icon. `svg.ts-chart` identifies the one existing chart renderer; expected plot counts are unchanged.
- WebKit's role lookup found a Close button inside a closed, zero-size nested Dialog. The full accessibility snapshot excludes it and visibility is false in both Chrome and WebKit (`help-visibility.json`). The two actions now target their owning Toggle Tip.
- The copied Number Input driver must preserve source block order. Its first attempt began with a later press-hold case before the custom increment part was created. The corrected extraction retains original ordering.
- The combined Number Input fixture published its initial results before its asynchronous slot regression completed. A fixture-ready signal now waits for both operations; no arbitrary delay is added. Partial completed assertions are retained even if a later driver operation throws.

The older Playwright-patched Firefox155 worker crash remains explicit. Flow case coverage uses the already-verified independent-browser case mode. This does not claim that browser's repeated navigation works. The separate official Firefox156.0.1 gate retains the sequential full-site and twenty-cycle Flow navigation tests.

This suite supplements earlier foundation, icon, framework and native-content evidence. It does not claim actual OS IME/dictation/autofill, actual Safari or assistive-technology certification.
