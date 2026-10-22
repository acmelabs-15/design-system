# Use independent Adobe number utilities

Use @internationalized/number as an independent utility for Number Input parsing and formatting. Peter selected it over maintaining a custom locale-aware parser. It supports regional number formats and incomplete input without introducing Zag or React state/rendering machinery.

Decided 2026-09-19 by Peter.

The Lit implementation retains TanStack Store, Lit Motion, generated styles, native form behaviour and the other selected conventions. A utility dependency does not revive the rejected Zag runtime. Parsing, editing state, numeric stepping and committed values remain distinct responsibilities.

On 2026-09-19, version 3.6.8 was researched and passed six isolated Bun API checks. That is not a future version pin or a browser/component/form/IME acceptance result. Exact formats, public options, precision and validation rules were left to the later [inputs/forms contract](../../spec/SPEC-inputs-forms.md). Installation and implementation belonged to the completed migration; its former gate is retired.

Evidence: [parser evaluation](../research/16-package-choices.md#independent-number-parser-recommendation) and [probe record](../verification/systematization/native-port-mapping-2026-09-19.json).
