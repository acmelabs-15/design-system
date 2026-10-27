# Declare MCP runtime dependencies as caret ranges

The MCP package declares its two runtime dependencies as caret ranges that start at the reviewed fixed versions: `zod ^4.6.7` and `@modelcontextprotocol/sdk ^1.32.0`. Consumers then get upstream fixes through a normal install, without a design-system release. `bun.lock` keeps the exact tested versions for this repository's checks and release builds.

Decided 2026-10-27 by Peter, in reply to the dependency-declaration question for [issue #9](https://github.com/acmelabs-15/design-system/issues/9).

Release 0.3.2 pins both dependencies exactly. Every `zod` version below 4.6.6 has a high advisory, [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5). The exact pin stops consumers from installing the fix; the reporting project forces `zod` 4.6.7 through a Bun override until a new release ships. No earlier record explains the exact pins. The 0.3.2 release fixed an SDK advisory by moving the exact pin. The core package already declares most runtime dependencies as caret ranges.

Two alternatives were presented. Exact pins with `zod` moved to 4.6.7 deliver only tested versions, but each future advisory in either dependency needs another release. A caret range for `zod` alone leaves the same problem in the SDK.

The accepted cost: a consumer can resolve a newer version that this repository's checks did not test. A broken or compromised upstream release then reaches consumers without our review. `zod` reported a git credential compromise on 2026-09-21; its release notes state that no affected version reached npm. The locked 4.6.7 matches the registry integrity value and carries SLSA provenance from the upstream release workflow. Its Sigstore signature was not independently verified.

Evidence: [issue #9](https://github.com/acmelabs-15/design-system/issues/9), [zod 4.6.6 release notes](https://github.com/colinhacks/zod/releases/tag/v4.6.6).
