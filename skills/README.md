# Consumer guidance

These seven skills describe the current release's consumer workflows. They are
separate from the repository's maintainer skills under `.agents/skills`.

Author task guidance in each `SKILL.md`. Keep API facts in the generated shared
references: `scripts/consumer-skills.ts` consumes the same release record as the
website and documentation MCP and writes `dist/skills`. Package staging places
that output at the installed package's `skills` path.

The generator requires every skill's `metadata.library_version` to match the
core package and documentation release. A new release requires an explicit
review/update of authored guidance. Generated `references/release.json` identifies
the version, documentation hash, skill hashes and shared record index.

Use the pinned TanStack Intent development CLI with Bun for `validate`, `list`
and `load`. Validate the installed package as well as the authoring directory.
Intent configuration, trust permissions and hooks remain consumer-owned. This
build does not run `install`, `setup` or `hooks install`.

`evals/evals.json` contains three artifact tasks and their outcome checks. Run each
with these skills and without them in separate agent contexts. Compile and test
the produced artifacts, record pass/fail evidence, then compare results. Structural
validation or successful loading alone does not establish guidance quality.
