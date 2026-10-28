# CI duration measurements, 2026-10-27

Source: quality runs 40589927785 (PR #10 head 09a5bbc5a) and 39771017002 (main 5488580a6), ubuntu-24.04 standard runners. Step durations from the GitHub jobs API; browser-step timeline from the timestamped job log of 40589927785.

## Runs per release

One release verifies the same source tree four times, each a full quality run:

| Trigger | Workflow | Why it runs |
| --- | --- | --- |
| PR | quality | pull_request |
| Push to main | quality | push to main |
| Push to main | documentation-pages | calls quality.yml as its verify job |
| Tag v* | publish-package | calls quality.yml as its verify job |

The merge tree equals the PR head tree (0.3.3: c792543c8 for both).

## Step durations (seconds)

| Step | PR run | Main run |
| --- | --- | --- |
| Checkout, setup, install | 13 | 12 |
| Static | 4 | 3 |
| Build stage (split, build, docs, tooling, drift) | 211 | 144 |
| Strict types | 54 | 37 |
| Unit | 114 | 81 |
| Audit | 0 | 0 |
| Packages | 20 | 16 |
| Browser installation | 50 | 44 |
| Browser stage | 1212 | 870 |
| Release | 3 | 3 |
| Total job | about 28 min | about 20 min |

Caching would save under one minute: install already takes 1–2 s; browser installation takes 44–50 s.

## Browser stage timeline (run 40589927785)

| Seconds from step start | Part |
| --- | --- |
| 0–8 | Clean consumer install from the five archives |
| 8–29 | React checks |
| 29–447 | Documentation pages: Chromium sequential navigation ends at 66; Firefox isolated render of 125 pages ends at 376 (about 310 s); WebKit sequential navigation ends at 447 |
| 447–577 | Navigation, recipes, recipe accessibility, video, copied examples, icons, tabs, packed consumer tools |
| 577–628 | Intent, MCP, managed forms, native forms, removals, table patch, public defaults |
| 628–706 | Scoped registration (two modes), Flow distributions, bundling, worker consumer |
| 706–1139 | Component checks: Chromium about 93 s, Firefox about 208 s, WebKit about 132 s |
| 1139–1212 | Official Firefox checks |

## Floors

- One job per browser check: critical path is about build (4 min) plus documentation pages (7 min), so about 11–12 min.
- Split the two long checks by engine: longest piece is Firefox documentation pages, about 5 min; critical path about 10 min.
- Split documentation pages and component checks into page or component groups as well: longest piece about 1.5–2 min; with static, types and unit in parallel to the build, the critical path is about 6–7 min.
- Records-only changes (docs/, tasks/, .scratch/): skip build and browsers only if no build input reads them. Needs a dependency proof from the repository map; site/recipes.ts links decision paths.

## Open questions

- Target duration for a code change and for a records-only change.
- Whether the main-push run can reuse the PR run's artifacts when the trees are identical.
- Larger GitHub runners cost money; not assessed.

## Type checker options (searched 2026-10-27 with Exa)

| Compiler | Language and status | Reported speed | Source |
| --- | --- | --- | --- |
| TypeScript 7 | Go, official, stable 2026-07-08; no programmatic API until 7.1 | 8–12x TypeScript 5/6 | https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/ |
| TypeScript 7.1 beta | Go, 2026-10-20 | Up to 2.5x TypeScript 7.0 | https://blog.cloudflare.com/typescript-rust-port/ |
| tsrs | Rust, Cloudflare with VoidZero/Oxc; experimental npm release 2026-10-20; tracks TypeScript main; diagnostics order differs; no Windows; partial LSP | Up to 8x TypeScript 7.0 at equal worker count; about 70% less memory | https://blog.cloudflare.com/typescript-rust-port/ ; https://fervorai.dev/articles/tsrs-rust-typescript-checker-run-it-beside-tsc/ |
| tsc-rs | Rust, ping.gg; merging into tsrs | 2.1x TypeScript 7 geometric mean on six apps (16 vCPU) | https://github.com/pingdotgg/ts-rust |
| tsz, ts-r | Rust, pre-release | Claims 2–3.5x TypeScript 7 | https://tsz.dev/ ; https://ts-r.dev/ |

Microsoft chose Go for a structurally similar port; Rust needed rethinking memory management (https://github.com/microsoft/typescript-go/discussions/411).

Effect here: the types step takes 37–54 s on TypeScript 5.9. TypeScript 7 alone brings it to about 5 s; a Rust port would save a further 2–3 s at most. Check which build tools import the TypeScript API before an upgrade.
