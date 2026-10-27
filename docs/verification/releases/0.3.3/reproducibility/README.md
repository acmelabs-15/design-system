# Archive reproducibility for 0.3.3

Three independent Linux builds produce byte-identical archives for all five packages:

| Run | Commit built | Record |
| --- | --- | --- |
| PR quality [40589927785](https://github.com/acmelabs-15/design-system/actions/runs/40589927785) | 609fcd7f3, GitHub's test merge of PR #10 | [pr-run-release.json](pr-run-release.json) |
| Main quality [40593786268](https://github.com/acmelabs-15/design-system/actions/runs/40593786268) | 998d72c8c, the merge commit | [main-run-release.json](main-run-release.json) |
| Publish [40593827273](https://github.com/acmelabs-15/design-system/actions/runs/40593827273) | 998d72c8c at tag v0.3.3 | [tag-run-release.json](tag-run-release.json) |

Each record lists the same `sha512` for every package; only the `commit` field differs. The public tarballs equal the publish run's archives ([public verification](../public-verification.json)).

The local macOS gate archives of f9dc599c8 differ for three packages (core, MCP and browser). They are local preparation evidence, not the published bytes.
