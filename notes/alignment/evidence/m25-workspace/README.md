# Core workspace installation evidence

Verified 2026-09-26. The supported topology is a private build workspace at the repository root and the public package at `packages/core`. Authored source and the generated runtime remain at the root. Explicit delivery links expose that one runtime from the core package.

| Bun | Former `file:.` override | Former `link:.` override | Real core workspace |
| --- | --- | --- | --- |
| 1.4.0 | Fails after workspace dependency change | Fails after workspace dependency change | Passes |
| 1.4.2 | Fails after workspace dependency change | Fails after workspace dependency change | Passes |

The exact failure is a nested `packages/mcp/node_modules/@acmelabs/design-system` link that targets `packages/mcp`. Changing MCP's Zod dependency triggers the nested installation. Fresh and unchanged installs alone do not detect the defect.

Bun assigns root resolutions a `.` source relative to the repository. Its hoisted installation branch then replaces the source directory with the requesting package directory. Both override forms become root resolutions. Existing-link verification checks directory existence, so reinstalling or forcing an install can retain the wrong link. The real workspace uses Bun's workspace resolution instead.

Sources read:

- [Bun 1.4.2 root resolution and installation](https://github.com/oven-sh/bun/blob/bun-v1.4.2/src/install/PackageInstaller.rs#L1529)
- [Branch that changes the source directory](https://github.com/oven-sh/bun/blob/bun-v1.4.2/src/install/PackageInstaller.rs#L1823)
- [Existing-link verification](https://github.com/oven-sh/bun/blob/bun-v1.4.2/src/install/PackageInstall.rs#L846)
- [Latest release checked: Bun 1.4.2](https://github.com/oven-sh/bun/releases/tag/bun-v1.4.2)
- [Related upstream report](https://github.com/oven-sh/bun/issues/25835) and [its merged tarball fix](https://github.com/oven-sh/bun/pull/38867). That fix does not resolve the reproduced root-link defect.

## Reproduce installation

Run from the repository root:

```sh
bun notes/alignment/evidence/m25-workspace/install-run.ts
```

Use `ACME_BUN_PATH` to select another Bun executable and `ACME_WORKSPACE_RESULTS` to select the output JSON. The runner copies manifests, patches and install configuration into isolated temporary directories. Former layouts reconstruct the old root-owned package and create their own lockfile; the supported layout starts with the current lockfile. No live workspace metadata changes.

Each case checks a fresh install, a frozen repeat, a React workspace dependency add, MCP dependency changes between Zod 3.25.76 and 4.6.5, and a final frozen repeat. Every workspace resolution runs in a fresh Bun process: an in-process resolver cache can conceal the changed link.

Saved full results: [Bun 1.4.0](bun-1.4.0.json), [Bun 1.4.2](bun-1.4.2.json). Both include runtime revision and executable SHA-256. The isolated 1.4.2 download was checked against GitHub's archive SHA-256; the dated summary records it. No global Bun upgrade occurred.

## Reproduce packed consumer

With the current production archive built:

```sh
bun run pack
bun notes/alignment/evidence/m25-workspace/consumer-run.ts
```

`ACME_CORE_ARCHIVE` selects another archive; `ACME_CONSUMER_RESULTS` selects the output JSON. The runner installs the archive into a fresh temporary consumer and bundles [consumer-entry.ts](consumer-entry.ts). It verifies public metadata, required package files, and the absence of development-only metadata.

[Packed consumer results](packed-consumer.json) record the tested archive hash, 4,319 component exports, 22 runtime dependencies and a successful browser bundle. The earlier retained consumer remains at `/tmp/acme-core-workspace-consumer`; it was not modified during evidence persistence. The portable runner creates and removes a different consumer.
