# Systematization: final local acceptance

The approved implementation and local automated verification are complete. Publication, deployment and actual-platform certification are separate, unperformed gates. [Machine-readable acceptance](acceptance.json).

## Verified

| Area | Result |
| --- | --- |
| Unit suite | 963 passing tests, no failures; 190,339 assertions across 209 files |
| Source quality | Strict types; zero Oxlint and Stylelint diagnostics; formatting passes |
| Dependencies | No reported vulnerabilities across 640 installed packages |
| Reproducible build | Committed source rebuilds without generated-file drift under Bun 1.4.2 |
| Documentation | 125 pages, 4,319 documented elements and 17 recipe families |
| Component regressions | 1,446 passing results across Chromium, Firefox and WebKit |
| React | 4,319 elements and 743 documented defaults checked per engine; lifecycle cases pass |
| Defaults | 704 scalar restorations and 736 ARIA resets per engine |
| Scoped delivery | 17 cases per engine for both installed modules and direct CDN entries |
| Bundling | The original consumer passes both single and split output in all three engines |
| Managed forms | 48 fresh-consumer checks across Lit/React and all three engines |
| History | Actual Back navigation restores Input values in fresh documents in all three engines |
| Official Firefox | All 125 pages in sequence and 20 Flow lifecycle/navigation cycles |
| Consumer tools | Seven skills; all 4,343 release records, 4,319 contracts and 20 recipe/framework variants validated |
| Appearance | 72 real-font checks plus six narrow-screen checks covering both form implementations |
| Release mechanism | Local crypto proof and real read-only trust/integrity verification of the existing public release |

The four candidate archives are coordinated at 0.3.0 and built from clean commit c9eabeece. Their SHA-512 digests are in [release.json](release.json). Later commits correct the development server, strengthen a verification oracle and record the results; they do not change the archived library runtime.

## Combined run and corrected oracle

The initial shared browser run completed all 23 invocations. Twenty-two passed. One strict Intent comparison failed because Intent correctly rewrote the new README link, while the test expected only its original release-metadata link to be rewritten. The corrected oracle resolves every relative Markdown target within the installed package, checks that its file exists and still compares the entire loaded content.

The corrected tool check passed against an isolated copy of the same fresh installation, with the identical archive record and hashes. All seven skills and the complete MCP release were checked. The original failure remains in [browser-initial.json](browser-initial.json) and [browser-initial.log](browser-initial.log); [tooling-recheck.json](tooling-recheck.json), [Intent](intent.json) and [MCP](mcp.json) record the successful rerun. This is a combined acceptance result, not a claim that the original command exited successfully.

The shared command now contains the corrected oracle. Future runs execute every check and aggregate failures at the end. No assertion was removed, test skipped or threshold lowered.

## Corrections made during acceptance

Scoped rendering now preserves registry identity and native document ownership. Generated inert registration entries include owned private dependencies. Public defaults restore correctly after attribute removal. The primary Tabs indicator remains visible during hover/focus. Explicit root exports fix the reproduced single-bundle initialization failure. Worker examples carry their guarded declaration setup. Managed form examples demonstrate nested/array fields in both frameworks, preserve native validity and FormData, and fit at 320px.

The development server watches the examples that feed the site. It rejects encoded path traversal and malformed paths before file access and binds to loopback. This defect was reproduced only with a harmless fixture sentinel. [Dev-server regressions](../m26-dev-watch/README.md).

## Remaining release gates

- Genuine OS IME/dictation and browser autofill.
- Actual Safari and assistive-technology behavior, plus real OS background-window behavior.
- Linux GitHub Actions execution, future live OIDC/new signing, registry trusted-publisher setup and actual publication/deployment.
- The authorized Pages migration and removal of the frozen published documentation snapshot.

WebKit results do not certify actual Safari. Firefox 155's retained automation-runtime defect is not relabelled as passing: isolated page rendering and the mandatory official Firefox 156 navigation test have different scopes. These limits remain in [the full audit](../m26-audit/final-runtime-review.md).

No push, package publication, deployment or account configuration change occurred. Publishing and Pages remain disabled by default.

An npm token appeared in earlier tool output. No token is stored in this record or the repository. Its owner must revoke or replace it; no credential rotation was attempted.

## Reproduce

Use Bun 1.4.2 and the shared stages in scripts/check.ts. `bun scripts/check.ts all` performs the build, package and browser sequence in order. The browser stage owns port 4180; stop an existing preview before running it. Restart the ordinary watched preview with `bun scripts/dev.ts --no-build` after verification.
