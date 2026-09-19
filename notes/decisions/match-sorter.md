Decided 2026-09-19 by Peter.

# Use the published match-sorter package for ComboBox ranking

Replace the locally maintained `src/shared/match-sorter.ts` implementation with the published `match-sorter` package during the approved migration. Peter selected the package over keeping our copy. This retains ranked filtering while allowing us to receive upstream fixes; it adds a dependency and requires compatibility checks on upgrades.

The measured 8.3.0 candidate returned the same ordered results on all nine queries over 33 example labels. That small probe is not full compatibility proof or a universal performance ranking. Before replacing the local copy, verify the complete ranking fixtures, including keys, thresholds, ties and text normalization. Investigate material differences rather than silently changing behaviour. This decision does not change Command Menu's separate scorer.

Chakra's examples use `Intl.Collator`-based filtering; that is a different behaviour, not evidence that our ranked contract should be replaced. Exact dependency pinning and integration remain part of the migration plan. No source changes are authorized before Phase 5 approval.

Evidence: [filter comparison](../alignment/evidence/filter-comparison.json), [package investigation](../analysis/package-choices.md), [upstream package](https://github.com/kentcdodds/match-sorter), and [Chakra ComboBox example](https://chakra-ui.com/docs/components/combobox#custom-objects).
