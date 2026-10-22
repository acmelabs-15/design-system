# Durable component browser checks

This record preserves the original checkpoint and its exact evidence. Current reproduction paths are maintained separately from saved results.

`bun scripts/component-browser-checks.ts` uses the installed compiled package selected by `ACME_RELEASE_CONSUMER`, or the local core workspace when omitted. Set `ACME_BROWSER_RUNTIME`; `ACME_CHROMIUM_PATH` is optional. `ACME_COMPONENT_SUITES` and `ACME_COMPONENT_ENGINES` select explicit diagnostic subsets; CI uses the full defaults.

The fixture coverage check accounts for all 31 colocated browser fixture files. Twenty-six preserved suites contain 357 named cases. `scripts/verification/component-browser/controls.json` adds the original Number Input, Pin Input and Slider editing/pointer driver tails and their required setup; their total result counts are 45, 33 and 44, including the newer slot checks. ComboBox contributes its keyed-child identity regression. Flow and JSON View each add one measurement record. This produces 482 result rows per engine. The dedicated Tabs four-treatment browser gate remains separate.

One shared build, HTTP server, compiled-runtime import mapping, browser lifecycle and result collector execute the suites. Generated case modules under `.artifacts/checks/components/generated` are compiled from committed local test records; no remote prose is evaluated and no historical temporary path is read. Original driver paths/hashes are provenance only. Every named behavior remains represented, with the explicit harness corrections below; source maps and public definitions use the same compiled component runtime. The generator uses complete registrations so owned children are defined.

`accepted-combined.json` combines successful rows from the complete first matrix and the documented focused follow-ups. It is explicitly not a new single-shot run. All 1,446 result rows pass, with no page errors. Final CI invokes the same command in one run against the final package archives. The unchanged original failed results stay in this directory.

Harness corrections:

- Chart's old `#chart svg` locator also found its now-defined disclosure icon. `svg.ts-chart` identifies the one existing chart renderer; expected plot counts are unchanged.
- WebKit's role lookup found a Close button inside a closed, zero-size nested Dialog. The full accessibility snapshot excludes it and visibility is false in both Chrome and WebKit (`help-visibility.json`). The two actions now target their owning Toggle Tip.
- The copied Number Input driver must preserve source block order. Its first attempt began with a later press-hold case before the custom increment part was created. The corrected extraction retains original ordering.
- The combined Number Input fixture published its initial results before its asynchronous slot regression completed. A fixture-ready signal now waits for both operations; no arbitrary delay is added. Partial completed assertions are retained even if a later driver operation throws.

The older Playwright-patched Firefox155 worker crash remains explicit. Flow case coverage uses the already-verified independent-browser case mode. This does not claim that browser's repeated navigation works. The separate official Firefox156.0.1 gate retains the sequential full-site and twenty-cycle Flow navigation tests.

This suite supplements earlier foundation, icon, framework and native-content evidence. It does not claim actual OS IME/dictation/autofill, actual Safari or assistive-technology certification.

Release Linux follow-up: the native date case formerly assumed at least two internal Tab stops. The case now measures every Tab stop in a plain native dialog on the same browser, then requires the component to match that complete sequence and reach its next control. Local Chromium/Firefox use three internal stops and macOS WebKit uses two; all27 dialog cases pass per engine. Linux confirmation was pending at that checkpoint. The later [0.3.2 closure](../../../../releases/0.3.2.md) records complete Linux release acceptance. The shared release driver also clears diagnostic suite/engine filters so inherited environment values cannot narrow certification. See [release finding](../../../releases/0.3.0/linux-browser-finding.json).

Worker shutdown follow-up: LinuxFirefox reported the worker as present after the old30ms pause. The disconnect test now subscribes to the real close event before removal, requires an initial worker and then requires zero workers. The worker-error test also awaits close events before asserting zero. Both use the existing12s event timeout, with no arbitrary delay. All13 local Flow cases pass in every engine; the complete Linux rerun was still required at that checkpoint and is covered by the later release closure.

The live committed case inputs are scripts/verification/component-browser/cases.json and scripts/verification/component-browser/controls.json. The historical combined results and failed attempts in this directory remain unchanged.

## Workflow migration verification

[Task 8](../../../workflow-migration/task-08.json) records a separate local dirty-preparation pass of all 1,446 cases. Local Hover Card activation passes; that result does not diagnose or erase the earlier Linux CI failure. Final clean-candidate/caller-switch/host-session checks remain tasks 10–12, and actual-platform limits remain open.
