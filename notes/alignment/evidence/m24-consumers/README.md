# M24 actual archive acceptance — 2026-09-26

This record verifies the exact four package archives identified by SHA256 in the
accepted JSON. All four were explicitly installed in a separate Bun consumer,
with React and React DOM 19.3.0. The runtime checks use installed package imports.
They do not use maintainer-checkout component implementations or the earlier
synthetic MCP/Intent catalog.

From this repository, against such an installed consumer:

```sh
ACME_RELEASE_CONSUMER=/absolute/path/to/consumer \
bun notes/alignment/evidence/m24-consumers/package-tools-run.ts

ACME_RELEASE_CONSUMER=/absolute/path/to/consumer \
ACME_BROWSER_RUNTIME=/absolute/path/to/browser-checks \
ACME_CHROMIUM_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
bun notes/alignment/evidence/m24-consumers/packed-run.ts
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

The Devtools archive still declares its already-bundled dependencies. Runtime and
public declaration inspection found no external imports. Moving those declarations
to development dependencies and repacking needs a small follow-up metadata/delivery
check; it does not change this record's exact archive identity.

Independent baseline/with-skill artifact evaluations are separate and are not
claimed complete here. These checks establish loading, package integrity and
runtime behavior; they do not establish that agent guidance improves task outcomes.

## Table source-graph correction after the first evaluation round

`table-source-isolation-2026-09-26.json` records the targeted follow-up. The earlier
shared documentation registration entry pulled React sources into copied Lit
examples. Independent registration entries now serve Lit Table, React Table and
Lit Virtual Table; the documentation app aggregates them. The existing React
Virtual entry imports only its actual React consumer. The shared source-closure
helper remains the one producer of transitive local files.

Run `table-source-isolation.ts` with the browser runtime variables above. It starts
with empty per-example source directories, copies every displayed source file,
bundles each standalone main module, checks its input graph, and mounts all four
examples in all three browser engines. Lit and virtual-Lit bundles have zero React
inputs. React consumers retain the canonical Lit-based component implementation,
but do not load the Lit Table or Lit Virtual consumer adapters.

The five new source tests initially reported four failures; after correction, the
12 focused source/recipe tests pass with 419 assertions. All four source identities
match the executed authored modules. The original six agent evaluation outcomes
remain unchanged. The data-layouts skill now explains explicit action dispatch:
Pagination's page/page-size requests do not exhaust the requests that can bubble
from descendants, including a nested Select's close request.
