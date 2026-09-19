Decided 2026-09-10 by Peter.

# Interface consistency is the main test of success

The systematization pass must make names, slots, and properties predictable across elements so agents can use the library consistently. Peter selected this as the main test of success over making composition or the rendered result the primary test. All three remain in scope; this priority does not remove composition, appearance, or behaviour requirements.

Peter confirmed the complete existing scope on 2026-09-19: a smaller Lit design system with consistent interfaces, shared building blocks, and the planned removals and rebuilds. It serves AI-generated static HTML artifacts. This closes the opening scope check; it does not approve the later element inventory or migration plan.

## What replaces exact parity

Geist remains the baseline for every element it has. A deliberate difference records its source system and the value or behaviour taken. Each affected element either records the difference in the census `ACCEPTED` table or leaves that sweep, with that choice stated explicitly. An element Geist lacks is checked against its source system's published values.

This supersedes the unconditional exact-parity requirements in [parity-scope.md](parity-scope.md). Its ordering for interface decisions remains: consistency within this library first, idiomatic Lit second, familiarity to a reference user third. The house fonts, package rules, and remaining settled decisions still apply.

The complete goal, research work, and approval steps remain in [the pass plan](../alignment/README.md). Source changes start after approval of the Phase 5 migration plan.
