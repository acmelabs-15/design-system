Decided 2026-09-19 by Peter.

# Require verification across three browser engines

Require Chromium, Firefox and WebKit checks for the new browser verification tier. Peter selected this over requiring Chromium alone with periodic checks of the other engines. Broader coverage costs more test time and maintenance, but catches platform differences that the existing unit environment cannot exercise.

Keep the Bun unit tier. WebKit is Safari's engine, not a substitute for actual Safari testing where device/browser integration matters. The runner, minimum browser versions, fixture matrix and CI implementation remain to be specified; this decision does not authorize source changes before the Phase 5 migration approval.

Evidence: [Lit practice review](../analysis/lit-practice-review.md) and [behaviour verification](../analysis/behaviour-verification-method.md). All 608 existing tests pass while native-browser probes expose state and form-contract gaps.
