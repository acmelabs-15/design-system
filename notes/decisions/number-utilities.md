Decided 2026-09-19 by Peter.

# Use independent Adobe number utilities

Use @internationalized/number as an independent utility for Number Input parsing and formatting. Peter selected it over maintaining a house locale-aware parser. It supports regional number formats and incomplete input without introducing Zag or React state/rendering machinery.

The Lit implementation retains TanStack Store, Lit Motion, generated styles, native form behaviour and the other house conventions. A utility dependency does not revive the rejected Zag runtime. Parsing, editing state, numeric stepping and committed values remain distinct responsibilities.

Version 3.6.8 was researched and passed six isolated Bun API checks. That is not a future version pin or a browser/component/form/IME acceptance result. Exact formats, public options, precision and validation rules remain for the inventory. Installation and source changes wait for the approved migration.

Evidence: [parser evaluation](../analysis/package-choices.md#independent-number-parser-recommendation) and [probe record](../alignment/evidence/native-port-mapping-2026-09-19.json).
