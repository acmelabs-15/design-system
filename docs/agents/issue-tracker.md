# Issue tracker: local Markdown

Adapted from mattpocock/skills, MIT, commit c55ee46, through brain's setup templates.

Issues live under .scratch/. Specifications and plans stay in spec/ and tasks/.

## Conventions

- One effort per directory: .scratch/effort/.
- One issue per numbered Markdown file under its issues/ directory. Existing maintenance records use three-digit identifiers; preserve those stable identifiers.
- A Status: line near the top uses the roles in [triage labels](triage-labels.md).
- Append comments under a Comments heading.
- An issue states its evidence, scope, owner, unresolved question and completion condition. A proposed fix is distinct from an approved task.

When a skill says to publish to the issue tracker, create the local issue file. When it says to fetch an issue, read the named file. To list a bucket, scan .scratch/*/issues/*.md and match Status:.

The [maintenance index](../../.scratch/maintenance/issues/README.md) links current migration follow-ups. It is an index; each issue owns its details.

## Wayfinding

Brain's user-started wayfinder uses one map and one file per ticket:

- Map: .scratch/effort/map.md, with Notes, Decisions so far and Fog.
- Ticket: a numbered file under .scratch/effort/issues/, with its question and a Type: of research, prototype, interview or task.
- Blocking: a Blocked by: line lists ticket identifiers. A ticket is unblocked when each listed ticket is resolved.
- Claim: set Status: claimed before starting work.
- Resolve: append the answer, set Status: resolved, then add its gist and link to Decisions so far in the map.

The frontier contains open, unblocked and unclaimed tickets. The lowest number comes first. Triage roles and wayfinder's claimed/resolved lifecycle have their separate meanings.
