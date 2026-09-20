Decided 2026-09-19 by Peter.

# Use full words for named sizes

Use full-word named size tiers consistently: tiny, small, medium and large, with consistently named larger tiers where needed. Peter selected “Full words” over short forms above tiny. The earlier tiny decision stands. Remove abbreviated aliases during migration.

A size name is relative to its component; small does not promise the same pixel dimensions everywhere. Components can support a subset of tiers. Explicit numeric/CSS dimensions and density are different concepts. Density changes spacing without shrinking text.

The census found 23 size declarations with mixed long names, short names, aliases and numeric dimensions. Do not mechanically replace every small/large/compact boolean: some alter only an amount display or a layout arrangement. Exact supported tiers, larger-tier spellings, measurements and per-component mappings are inventory work under this full-word convention.

Evidence: [terminology record](../alignment/terms.md#named-size-dimensions-and-density), [census and answer](../alignment/evidence/phase-2-closure-2026-09-19.json).
