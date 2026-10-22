# M24 actual archive acceptance — 2026-09-26

This record preserves the original checkpoint and its exact evidence. Current reproduction paths are maintained separately from saved results.

This record verifies the exact four package archives identified by SHA256 in the
accepted JSON. All four were explicitly installed in a separate Bun consumer,
with React and React DOM 19.3.0. The runtime checks use installed package imports.
They do not use maintainer-checkout component implementations or the earlier
synthetic MCP/Intent catalog.

Current reproduction uses pinned Bun 1.4.2 from this repository against a fresh installed consumer. Install the coordinated current package set, including the separate browser package when exercising browser delivery; the four-archive identity above remains historical:

```sh
ACME_RELEASE_CONSUMER=/absolute/path/to/consumer \
bun scripts/verification/consumer-tools/package-check.ts

ACME_RELEASE_CONSUMER=/absolute/path/to/consumer \
ACME_BROWSER_RUNTIME=/absolute/path/to/browser-checks \
ACME_CHROMIUM_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
bun scripts/verification/consumer-tools/packed-browser-check.ts
```

The tooling runner uses the root's pinned Intent CLI with the consumer as cwd. It
modifies only that disposable consumer's explicit trust configuration and restores
its original package.json. It reads the installed core package version, loads all
seven installed skills, checks every shared reference, and verifies an empty
allowlist denies loading. Intent rewrites package-relative Markdown reference
links to resolvable installed paths; that documented transformation is accounted
for in content equality checks.

The MCP check launches the installed CLI with Bun and uses the installed SDK
client. Every component declaration must equal the installed core CEM declaration
plus its module location. All resources and recipe/framework variants are read.
Schema bounds, absent/unknown versions, unavailable frameworks, unknown IDs,
filesystem URI rejection and startup version mismatch are exercised.

The browser fixture imports only public installed core, React and inspector
entries. Its assertions read the actual inspector surface, not a separate source
observer. The inspector is bundled again with the consuming app. The three-engine
checks cover scope/redaction, reactive data in both frameworks, event ownership
and bounds, external theme changes, lifecycle, keyboard operation, null labels,
fonts, and narrow layout. The production branch excludes the inspector, Solid and
font output.

At this checkpoint, the Devtools archive still declared already-bundled dependencies. Runtime/public declarations had no external imports. A later metadata/delivery correction moved those dependencies to development metadata, as recorded in [final review](../m26-audit/final-runtime-review.md). That later correction does not change this record's exact archive identity.

Independent baseline/with-skill evaluations are separate; [iteration 1](../m24-skills/iteration-1/README.md) retains their original grades and limits. These checks establish loading, package integrity and
runtime behavior; they do not establish that agent guidance improves task outcomes.

## Table source-graph correction after the first evaluation round

`table-source-isolation-2026-09-26.json` records the targeted follow-up. The earlier
shared documentation registration entry pulled React sources into copied Lit
examples. Independent registration entries now serve Lit Table, React Table and
Lit Virtual Table; the documentation app aggregates them. The existing React
Virtual entry imports only its actual React consumer. The shared source-closure
helper remains the one producer of transitive local files.

The manual source-isolation check uses `scripts/verification/documentation/table-source-isolation.browser-check.ts` with the browser runtime variables above. It starts
with empty per-example source directories, copies every displayed source file,
bundles each standalone main module, checks its input graph, and mounts all four
examples in all three browser engines. Lit and virtual-Lit bundles have zero React
inputs. React consumers retain the canonical Lit-based component implementation,
but do not load the Lit Table or Lit Virtual consumer adapters.

At the original 2026-09-26 checkpoint, the five new source tests reported four failures; after correction, the
12 focused source/recipe tests pass with 419 assertions. All four source identities
match the executed authored modules. The original six agent evaluation outcomes
remain unchanged. The data-layouts skill now explains explicit action dispatch:
Pagination's page/page-size requests do not exhaust the requests that can bubble
from descendants, including a nested Select's close request.

## Workflow migration verification

The relocated checks are covered by [task 8 acceptance](../../workflow-migration/task-08.json) in local dirty-preparation scope. [Relevant run evidence](../../workflow-migration/runtime/checks/documentation-table-source-isolation/results.json) is separate from the historical results above. Final clean-candidate, live-caller and host-session acceptance remain tasks 10–12; no publication or actual-platform certification follows from this local run.
