# Material Symbols SVG source

Source: https://github.com/google/material-design-icons

Pinned revision: `27e9ef1dbeedc13d682fece4a58e1eda4cb0961a`.

This catalog includes all 4,135 symbols at weight 400, grade 0 and optical size 24. Each symbol has Rounded, Outlined and Sharp artwork, each filled and unfilled: 24,810 SVG files in total. `catalog.json` records original source paths and SHA-256 hashes. The SVG files are unmodified upstream files.

The license is [Apache-2.0](../licenses/material-symbols.txt). Google supplies no separate NOTICE file at this revision.

`bun scripts/material-symbols.ts` verifies every catalogued asset. To import from a checkout at the pinned revision, run `bun scripts/material-symbols.ts import /absolute/path/to/material-design-icons`. The importer accepts only the audited path-only SVG grammar and rejects extra markup or attributes.

The baseline SVGs have two coordinate systems. Where the original omits viewBox, its native width/height supply the equivalent renderer viewport. A CSS size scales this fixed artwork; it does not select a different font optical-size or weight axis.
