# Bun records lockfile versions for bundled dependencies it does not install

Status: needs-triage
Type: task
Owner: maintainer investigation

## Observed result

On 2026-10-27, with Bun 1.4.2, the dependency audit reports high `undici` advisories for `npm/undici@8.11.2` in bun.lock. The advisory range is `>=8.0.0 <8.12.2`.

The pinned `npm` 12.0.2 development tool lists `undici` among its bundled dependencies. Its tarball contains `node-gyp` 13.0.0, which requires `undici ^6.25.0`. The installed files are these bundled copies:

| Path | bun.lock | Installed |
| --- | --- | --- |
| `node_modules/npm/node_modules/node-gyp` | 13.0.2 | 13.0.0 |
| `node_modules/npm/node_modules/undici` | 8.11.2 | 6.27.0 |

So bun.lock records a resolution of npm's declared ranges that Bun never installs, and `bun audit` reads that recorded resolution. The installed `undici` 6.27.0 is outside the advisory range. The same pattern appears for `npm/ip-address`.

[Issue #9](https://github.com/acmelabs-15/design-system/issues/9) work refreshes the `npm/undici` entry to 8.12.3 with `bun update undici`. That clears the finding without an audit disposition, but the lockfile entry still does not describe the installed bytes.

## Open questions

- Does Bun document this lockfile behaviour for bundled dependencies, or does an upstream issue track it?
- Can the audit evaluate installed bundled versions instead of recorded resolutions, without weakening the rejection of unknown findings?
- Does a future `npm` release change the bundled `node-gyp` and `undici` versions, and does that affect the reviewed `http-cache-semantics` disposition?

## Completion

Confirm the behaviour against Bun's documentation or source, and find or report the upstream issue. Decide through the applicable workflow whether the audit needs a change. A refreshed lockfile entry alone does not close this issue.

## Comments

2026-10-27: recorded during the issue #9 dependency upgrade.
