---
id: DEC-156
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-007#09 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-067] # the RES files this decision rests on
decided: 2026-11-20 by Peter
---
# DEC-156: The blocks get an idea of their own

DEC-139 gave the blocks section to IDEA-007, the documentation website. Peter's additional scope of 2026-11-13 then widened the blocks and said: "It may need its own idea; decide that with me." The work reaches four ideas: the list of the blocks and their place in the documentation (IDEA-007), their design in Figma (IDEA-002), how agents get them (IDEA-005) and the design skill for Figma (IDEA-009). Peter decided on 2026-11-20 that the blocks get an idea of their own, so that one owner makes the order across those ideas clear. The new idea is IDEA-011.

He selected "An idea of their own (Recommended)" in the question dialog, with no condition. The option read: "A new idea owns the blocks: their list, their source of truth, where they live, and their own spec and plan. The website idea keeps only the section that shows them."

## Considered Options

- The blocks stay in IDEA-007. One spec would then hold the website and all blocks, and the links to Figma, to the MCP server and to the design skill would stay spread over notes in four ideas.

## Consequences

- IDEA-011 owns three open questions that were rows of IDEA-007: which blocks 1.0 has by name (was row 11), whether Figma or code is the source of truth of a block (was row 12), and where the blocks live in the documentation and in the repository (was row 13). IDEA-007, "Out of scope", names where each went.
- IDEA-007 keeps the website, the section that shows the blocks, and the design of the website in Figma with its "documentation blocks" (deferred row 14).
- DEC-140 and DEC-146 stand: the library gives no block out as a component, and the Blocks section has four groups. IDEA-011 builds on both.
- The other ideas keep their own rows on the blocks: IDEA-002#30 imports the list for the work in Figma, and IDEA-005#13 decides how agents get the blocks. Each now names IDEA-011 as the owner of the list.
- The proposal for the list, made for IDEA-007#11, serves IDEA-011#01. It is in `.artifacts/v1/prep/IDEA-007-11/` (scratch, outside git) and keeps its file names.
- The work on 1.0 has eleven ideas.
