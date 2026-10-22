# Use the published match-sorter package for ComboBox ranking

Use the published `match-sorter` package for ComboBox ranking. Peter selected the package over keeping our copy. This retains ranked filtering while allowing us to receive upstream fixes; it adds a dependency and requires compatibility checks on upgrades.

Decided 2026-09-19 by Peter.

The 2026-09-19 probe of the 8.3.0 candidate returned the same ordered results on all nine queries over 33 example labels. That small probe is not full compatibility proof or a universal performance ranking. Acceptance required the complete ranking fixtures, including keys, thresholds, ties and text normalization. Material differences required investigation rather than silent behavior changes. This decision does not change Command Menu's separate scorer.

Chakra's examples use `Intl.Collator`-based filtering; that is a different behaviour, not evidence that our ranked contract should be replaced. Exact dependency pinning and integration belonged to the completed migration. The later [selection contract](../../spec/SPEC-selection.md) records the selected interface; the [release record](../releases/0.3.0.md) records release verification. The earlier Phase 5 gate is retired.

Evidence: [filter comparison](../verification/systematization/filter-comparison.json), [package investigation](../research/16-package-choices.md), [upstream package](https://github.com/kentcdodds/match-sorter), and [Chakra ComboBox example](https://chakra-ui.com/docs/components/combobox#custom-objects).
