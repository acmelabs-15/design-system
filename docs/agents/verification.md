# Verification

Read this guide before selecting checks or reusing earlier evidence. It owns repository-specific commands and evidence requirements. Brain's incremental-implementation skill owns check scheduling within the task lifecycle.

## Runtime and commands

Use **Bun 1.4.2**, as enforced by the [runtime policy](../../scripts/release-policy.ts), [.bun-version](../../.bun-version) and [package manifest](../../package.json). Put the selected Bun executable's directory on `PATH` so nested commands use it too. Run repository commands from the repository root. This is a Bun project; Node-compatible imports do not select a Node runtime.

Tests use `bun:test` and live beside their source:

```text
<source-directory>/__tests__/<original-filename>.test.ts
```

Use the affected test files for focused checks. The full unit command is:

```sh
bun test
```

Generation dependencies run in this order. Documentation needs the built runtime; tooling needs documentation and metadata.

```sh
bun run split
bun run build
bun run docs
bun run build:tooling
```

| Purpose | Command | Scope |
|---|---|---|
| Static checks | `bun run check:static` | Oxlint/Ultracite, Stylelint and Oxfmt checks |
| Types | `bun run check:types` | Root strict TypeScript and the check runner's runtime/verification script program |
| Required browsers | `bun run test:browser` | Built site and validated coordinated packages; requires prepared archives and browser installation |
| Local archives | `bun run release:prepare` | Coordinated package preparation with source identity |
| Archive validation | `bun run release:validate` | Prepared archive set, versions, metadata and contents |
| Release checks | `bun run release:verify` | Release smoke and trust checks |
| Complete gate | `bun run check` | Static, build, types, unit, dependency audit, packages, browser installation, browsers and release checks |

The [check runner](../../scripts/check.ts) owns the stage list and required browser plan. Its build stage checks generated source for tracked, staged and untracked drift. Select affected producers and packages from the [repository map](repository.md).

The root [TypeScript configuration](../../tsconfig.json) covers source, reference tools and site code. The check runner adds a strict program for check, component-browser, declaration, audit and release scripts, plus every TypeScript file under `scripts/verification/`. This includes relocated drivers and their fixtures. A changed script outside both programs still needs an explicit strict typecheck. Preserve the applicable JSX and decorator settings, including experimental decorators and disabled define semantics for class fields. Apply lint/style checks to changed authored files as well.

## Evidence and browser requirements

Reuse evidence only when revision, relevant inputs and scope still match. An earlier green release does not make a changed checkout green. A partial or failed run remains partial or failed.

Each acceptance record identifies:

- Source revision and dirty or clean state; relevant input and archive identities.
- Exact commands, runtime and output paths.
- Planned and completed coverage, outcomes and failing cases.
- Required versus manual checks, inspected artifacts and unperformed limits.

Unit fixtures use Happy DOM and test shims. Browser checks must establish the actual outcome: a submission completes, focus moves correctly, a selected item changes, or copied code runs. Metadata equality and a screenshot alone do not prove these results.

Use the runner's complete browser plan for the full gate. It includes component engines, packed consumers, React, native forms, documentation, scoped module/CDN modes, Flow distributions and bundle identity. The current plan expands to 24 invocations. Do not reduce it through diagnostic suite or engine filters when claiming the complete gate.

Required engine coverage includes Chromium, Firefox and WebKit. The runner uses matching Playwright browsers and separately checks official Firefox. Its verified browser runtime policy currently requires Playwright 1.63.0. Packed checks use the coordinated archives and a fresh consumer. Source-mode success does not establish package success. The runner records all outcomes and rejects an empty plan.

Runnable profiles live under [scripts/verification](../../scripts/verification/). Their durable summaries live under [verification evidence](../verification/systematization/). Keep manual appearance, action-label, table-isolation, inspector, workspace/install and fresh React type checks distinct from the required plan. Run them when their covered behavior changes. Write new captures to scratch output; preserve historical captures and their provenance.

## Limits and closure evidence

Regeneration can affect registration, exports, declarations, CEM, styles, site examples, consumer skills and tool packages. Verify each affected consumer through its actual delivery path. Keep controller registrations and live-collection behavior covered by applicable tests.

A local browser pass does not diagnose an earlier CI failure. In particular, later local Hover Card success does not establish the cause of the earlier Linux CI failure. [STATUS](../STATUS.md) owns the current baseline; dated evidence owns each observed result.

Automated WebKit is not an actual Safari session. Genuine OS IME, dictation, autofill, assistive technology and background-window behavior need their named platform checks. Record them as unperformed until evidence exists. For screenshots, record whether inspection occurred and who performed it. Agent image review and human inspection are distinct evidence.

Local dirty preparation, a clean committed candidate, published package validation and actual host sessions are different scopes. Retain that distinction in acceptance records. Credential rotation is an owner-controlled follow-up; release success does not close it. The [migration runtime report](../verification/workflow-migration/task-08.json) is evidence for its stated preparation scope, not a permanent green baseline.
