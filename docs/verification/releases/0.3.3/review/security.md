# Security review (axis 4), main..HEAD f9dc599c8

Verdict from this axis: no Critical or Required findings. The change closes GHSA-mrhx-c7xc-m3w5 for this repo and, via the caret range, for consumers.

## packages/mcp/package.json

**FYI (judgement)** - the caret ranges are a deliberate, recorded trade-off (decision 0116).
```
-    "@modelcontextprotocol/sdk": "1.32.0",
-    "zod": "4.6.5"
+    "@modelcontextprotocol/sdk": "^1.32.0",
+    "zod": "^4.6.7"
```
Positive: the floor 4.6.7 is above the fixed 4.6.6, so no consumer can resolve a vulnerable zod. Residual supply-chain exposure: a bad upstream release reaches consumers unreviewed. The decision file states this and the 2026-09-21 zod credential event. The MCP server is local stdio only, which limits blast radius, but it runs with the user's privileges. No fix needed; the Peter-approved decision covers it.

**Optional (judgement)** - SDK `^1.32.0` pulls transitive HTTP packages (express, hono, body-parser, qs) that a stdio server never loads. Consumers will get whatever versions resolve. `bun.lock` does not ship to consumers, so only the floor of each transitive range protects them. Consider a note in the decision that the lockfile protects this repo's gates only.

## bun.lock

**FYI** - every changed entry keeps a registry sha512 integrity hash and no resolution points at a git or URL source. Bumps (body-parser 2.4.0 with qs `^6.16.1`, fast-uri 3.1.9, ip-address 10.7.5, qs 6.17.0, zod 4.6.7) are consistent: body-parser's new minimum for qs (6.16.1) is met by 6.17.0.

**Optional (judgement)** - `npm/undici` 8.12.3 and `npm/ip-address` 10.7.5 describe bytes Bun never installs (installed bundled undici is 6.27.0). The lock now clears the audit without describing reality. Issue 006 records this and says a refreshed entry does not close it. Acceptable; keep 006 open and make sure the audit still rejects unknown findings.

**Optional (judgement)** - happy-dom 20.14.0 to 21.0.4 is a major bump, dev only, not shipped. Security-relevant happy-dom 21 changes (the file and iframe loading defaults) are stricter, and scripts pass the older flags, which 21 still accepts. No new exposure. If the flags are removed in a later major, scripts that parse docs content would silently load nothing, not more.

## scripts/__tests__/workspace-install.test.ts

**Nit (judgement)** - the test loop now uses `mcp.dependencies.zod` (a range string) as one "version". It no longer exercises the pinned 4.6.5 case. This is a correctness or test-fidelity matter, not a security one; left to the correctness axis.

## docs and release bump

**FYI** - version 0.3.3 in all five packages plus peer ranges is consistent in the lock. No secrets, tokens or credentials appear in any hunk I read. Doc claims on provenance state the Sigstore signature was not verified, which is honest.

## What I could not verify
Registry integrity and SLSA claims were taken from the plan text. I did not run `bun audit` or the dependency-audit script (gate is running).
