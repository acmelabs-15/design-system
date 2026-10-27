# Performance review (axis 5)

**Verdict for this axis:** no findings above FYI. The change adds no runtime code path.

Scope read: `diff-focused.patch` (manifests, lockfile, one test line, Markdown records). No source under `src/` or `packages/*/src` changes.

## Findings

### FYI (judgement): zod 4.6.5 to ^4.6.7 range in `packages/mcp/package.json`
The change swaps an exact pin for a caret range. The advisory (GHSA-mrhx-c7xc-m3w5) is a memory-exhaustion defect, so the bump lowers a performance and availability risk for the stdio server. The tool schemas are small and local, so no new hot path appears. No action.

### FYI (judgement): happy-dom 20.14.0 to 21.0.4 (root `package.json`, `bun.lock`)
Dev-only. The recorded full-suite run (1,126 tests, 132.64 s) is the only timing evidence. The diff does not include a 20.14.0 baseline for the same suite, so a speed regression or gain stays unmeasured. Optional: if the old timing exists in `docs/STATUS.md` or an earlier record, note it beside the new one. This does not block.

### FYI (judgement): `scripts/__tests__/workspace-install.test.ts`, line 47
```
-    for (const version of ["3.25.76", "4.6.5"]) {
+    for (const version of ["3.25.76", mcp.dependencies.zod]) {
```
The array is built once before the loop, so `mcp.dependencies.zod` holds the original range. The loop still runs two real `bun install` passes, the same count as before. The 120000 ms timeout still bounds it. No added cost. The second pass restores the range, which keeps the test's intent.

### FYI (judgement): lockfile transitive refreshes (body-parser, fast-uri, ip-address, qs, npm/undici)
Patch and minor moves on server-side or install-time packages. `npm/undici` 8.x is a lockfile entry only; the installed bundled copy stays 6.27.0 (issue 006). No runtime effect for consumers of the Lit components. `packages/mcp` is a local stdio server, so request-path cost is not a factor.

## Checked and clear
- Bundle size: the five component packages gain no new runtime dependency. Only `packages/mcp` changes ranges, and it is not a browser bundle.
- N+1, unbounded loops, pagination, sync-versus-async, re-renders, hot-path allocations: not applicable, no code changed.
- Caret ranges permit later patch versions at install time. That is a reproducibility matter for the other axes. The lockfile pins the resolved versions.
