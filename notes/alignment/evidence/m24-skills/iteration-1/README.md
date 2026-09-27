# Consumer skill acceptance — iteration 1

Graded 2026-09-26 against the four original assertions for each prompt. The six runs provide useful consumer evidence, but the original evidence does **not** close every compound assertion.

| Prompt | With skills | Without skills | Remaining proof |
| --- | --- | --- | --- |
| HTML notification settings | 4/4 | 4/4 | Published CDN was outside the local check |
| React preferences | 3/4 | 2/4 | Native form value in both; detached callback cleanup in baseline |
| Lit virtual table | 3/4 | 3/4 | Duplicate event processing after remount in both |

These are one-run observations. They do not establish statistical superiority. Both Table consumers made and repaired the same nested-request dispatch error. Timing and token counts are unavailable. A failed assertion here can mean insufficient proof; it does not automatically mean a package defect.

[Static review viewer](review.html) shows saved source, screenshots, original results and independent grades. [Benchmark](benchmark.md) explains the comparison. [Structured benchmark](benchmark.json), [analysis](analysis.json), and each run's `grading.json` provide the exact evidence. Later probes must be saved separately and must not rewrite these original grades.

The React assertion says “form value,” but its prompt does not explicitly ask for a native form or submission. Both artifacts use `name="plan"` and exclusive selection, yet neither owns a native form or tests `FormData`. This prompt/assertion mismatch needs correction in the next evaluation. The React baseline measures editor cleanup and callbacks on a fresh instance, but does not dispatch an event on the detached wrapper. Both Table runs prove reconnect behavior; neither counts duplicate handler/model work after reconnect.

The original React skilled report claims the indicator remains under Source. That diagnosis was disproven. The actual indicator targets Output; a focused and hovered tab can cover its primary indicator with its background. The [corrected diagnosis and source regression](../../m24-tabs-indicator/README.md) document that package defect and its fix. At grading time, all 12 source-browser cases passed; the rebuilt installed-consumer check remained separate and pending. Original reports remain unchanged for provenance.

The grader inspected all six final source artifacts and screenshots, the verification programs and saved attempts, native accessibility evidence and exact package versions. The four React/Table TypeScript projects were independently rechecked with exit code 0. React and skilled Table projects use `skipLibCheck=true`; baseline Table uses strict checks with `skipLibCheck=false`. Full agent transcripts were not supplied, so undocumented read/process claims are not treated as independently proved. Native Chrome accessibility data does not establish screen-reader behavior.

## Archive and replay

Each run has:

- `outputs/`: original deliverable source, final screenshot, original result and an independent evaluation note.
- `archive/`: original verification/server/config files, attempts, logs, accessible trees and API/recipe records where supplied.
- `grading.json`: the unchanged four assertions and independent verdicts.
- `timing.json`: explicit unavailable metrics.

[archive-manifest.json](archive-manifest.json) records original paths, portable relative archive paths, byte sizes and SHA-256 values. No dependencies or build bundles are included. The Table baseline's generated `app.js` and generated `app.css` are omitted; its authored CSS is in `app.ts`. Original source/results/screenshots are byte-for-byte copies. Shared package manifests/locks and version records are under `inputs/`; HTML skilled also has its own package installation. The same version number can refer to different local development builds, so exact tarball inputs matter.

The archive is portable evidence. Application source uses normal package imports (HTML uses exact versioned URLs); the original support harnesses retain absolute machine paths for provenance. To run a saved artifact elsewhere, copy its `outputs/` and `archive/` files into a scratch directory, supply matching core/React tarballs and the exact dependencies in `inputs/`, then rebind the browser runtime, Chrome path, fixture path and TypeScript type roots in the scratch harness. Use the original README/build commands there. Run HTML with the local CDN route until the exact package is published. Running against a newly built package is a follow-up result, not reproduction of the old package binary.

The official `skill-creator/eval-viewer/generate_review.py`, with a documented [serialization correction in a temporary copy](viewer-tooling.md), generated `review.html` as external tooling; no Python is shipped in the package. The viewer is for review and does not execute the archived consumer source. Its displayed pass-rate deviation is across three different prompts, not repeat-run uncertainty. No feedback or approval is required to continue the delegated migration.
