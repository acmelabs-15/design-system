# Require verification across three browser engines

Require Chromium, Firefox and WebKit checks for the new browser verification tier. Peter selected this over requiring Chromium alone with periodic checks of the other engines. Broader coverage costs more test time and maintenance, but catches platform differences that the existing unit environment cannot exercise.

Decided 2026-09-19 by Peter.

Keep the Bun unit tier. WebKit is Safari's engine, not a substitute for actual Safari testing where device/browser integration matters. The runner, minimum browser versions, fixture matrix and CI implementation were not specified by this initial selection. Later [release evidence](../releases/0.3.2.md) records implementation and verification limits.

Evidence: [Lit practice review](../research/15-lit-practice-review.md) and [behaviour verification](../research/03-behaviour-verification-method.md). At selection time, all 608 existing tests passed while native-browser probes exposed state and form-contract gaps.
