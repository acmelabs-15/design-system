Decided 2026-09-19 by Peter.

# Replace Biome with Oxlint and Oxfmt using Ultracite

Plan to use Oxlint for JavaScript/TypeScript checks and Oxfmt for formatting, using Ultracite presets. Add Stylelint to preserve CSS checks, including CSS inside Lit templates. Peter selected this combined toolset over Biome with Ultracite.

This is a future migration direction. Biome remains installed and active until the approved migration changes the scripts, generator formatting, editor setup and CI together. Do not run an automatic initializer over project instructions or apply blanket autofixes.

Review the preset against Lit, Bun and the generated-style pipeline. Its default generated-directory exclusions, 80-column width, ES5 trailing commas, import sorting and strict rules are not silently accepted project conventions. Do not remove held StoreSelector controllers just to satisfy an unused-member diagnostic.

Keep the existing TypeScript compiler check while verifying the TypeScript-Go-based checks. Preserve CSS correctness coverage; a passing JavaScript linter alone is insufficient. Resolve generator defects at their source and distinguish intentional CSS fallbacks from accidental duplication.

Versions tested, results and remaining limits: [developer-tooling analysis](../analysis/developer-tooling.md#oxlint-oxfmt-and-ultracite).
