---
id: RES-076
status: resolved # in-progress | resolved
kind: task
from: IDEA-010#04 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-13
outcome: answered
---
# RES-076: What the branch v1 holds, by area

## Question
List what the branch holds now, by area: code, packages, website, tools, CI, docs, research, specs, glossaries, agent context files and saved prompts, with the size of each area and what uses it.

Needed by IDEA-010#05, the decision what survives the removal of the old system, and IDEA-010#06, the decision when the removal happens. Peter, 2026-11-13: "Don't assume any of it stays or goes. List what's there, and we decide together before anything is removed."

## Answer
At revision `e25f8dc96`, the branch `v1` tracks 70,498 files: 248,745,913 bytes and 6,072,950 lines. The result file `.artifacts/v1/task/IDEA-010-04/IDEA-010-04-result.md` holds one table of 32 areas. Each tracked file is in exactly one area, and the file counts of the table add up to `git ls-files | wc -l`. For each area the table gives its paths, files, bytes, lines, kind, the files that name it, and whether the work on the new system names it.

Completion condition: observed. The sum of the table is 70,498, equal to `git ls-files | wc -l` at `e25f8dc96`. The raw list, one row per tracked file, is `.artifacts/v1/task/IDEA-010-04/raw-list.tsv`.

## Findings
- Three areas hold 95% of the tracked files: generated icon code with 41,359 files and 23.1 MB, icon artwork in `assets/material-symbols/` with 24,812 files and 21.5 MB, and verification evidence in `docs/verification/` with 1,107 files and 48.9 MB. Source: `.artifacts/v1/task/IDEA-010-04/IDEA-010-04-result.md` at `e25f8dc96`, checked 2026-11-13.
- The largest area by bytes is the generated geist measurements in `tools/geist/census/` and `tools/geist/spec/`, with 569 files, 139.0 MB and 4.28 million lines, and no file of the new-system work names it. Source: `.artifacts/v1/task/IDEA-010-04/IDEA-010-04-result.md` at `e25f8dc96`, checked 2026-11-13.
- Hand-written code holds component source 527 files, styles 146, packages 25, website 135, examples 30, scripts 130, geist tool code and inputs 288, CI workflows 3, consumer skills 10 and root config 16. Source: `.artifacts/v1/task/IDEA-010-04/IDEA-010-04-result.md` at `e25f8dc96`, checked 2026-11-13.
- Records of releases 0.1 to 0.3 are DEC-001 to DEC-116 (116 files), RES-001 to RES-022 (22), SPEC-001 to SPEC-015 (21 files), 4 release notes, 12 history files and 8 maintenance issues. Source: `.artifacts/v1/task/IDEA-010-04/IDEA-010-04-result.md` at `e25f8dc96`, checked 2026-11-13.
- Records of the new system are DEC-117 to DEC-150 (34), tracked RES-023 to RES-074 (33), IDEA-001 to IDEA-010 (10) and `docs/design/` (6, of which 3 are saved prompts of the owner). Source: `.artifacts/v1/task/IDEA-010-04/IDEA-010-04-result.md` at `e25f8dc96`, checked 2026-11-13.
- Agent context files number 11, `GLOSSARY.md` has 70 entries, `tools/geist/GLOSSARY.md` has 10, and `GLOSSARY-MAP.md` maps the two. Source: `.artifacts/v1/task/IDEA-010-04/IDEA-010-04-result.md` at `e25f8dc96`, checked 2026-11-13.
- No new-system file names `styles/` or the geist measurements, and only `AGENTS.md` or `docs/agents/` name the generated component entries, the development guides, the history files and the release notes. Source: `.artifacts/v1/task/IDEA-010-04/IDEA-010-04-result.md` at `e25f8dc96`, checked 2026-11-13.
- Git ignores `.artifacts/v1/` (7,199 files, 183.4 MB), and the pinned Bun 1.4.2 in the other checkout holds 3 files and 87.3 MB. Source: `.artifacts/v1/task/IDEA-010-04/IDEA-010-04-result.md` at `e25f8dc96`, checked 2026-11-13.
- The use column comes from a substring search for path tokens, so the generic tokens `package.json`, `README.md` and `skills/` give upper bounds, and the branch moved from `43122acef` through `023104c27` to `e25f8dc96` during the task. Source: `.artifacts/v1/task/IDEA-010-04/IDEA-010-04-result.md` at `e25f8dc96`, checked 2026-11-13.

## Follow-ups
None.

## Next action
IDEA-010#05 and IDEA-010#06 can use the table. They wait for Peter: what survives the removal, area by area, and when the removal happens.
