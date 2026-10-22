# Replace Biome with Oxlint and Oxfmt using Ultracite

Use Oxlint for JavaScript/TypeScript checks and Oxfmt for formatting, using Ultracite presets. Add Stylelint to preserve CSS checks, including CSS inside Lit templates. Peter selected this combined toolset over Biome with Ultracite.

Decided 2026-09-19 by Peter.

At the 2026-09-19 selection, Biome was still active. The migration changed scripts, generator formatting, editor setup and CI together; the [release record](../releases/0.3.2.md) records subsequent work. The decision did not authorize an automatic initializer over project instructions or blanket autofixes.

Review the preset against Lit, Bun and the generated-style pipeline. Its default generated-directory exclusions, 80-column width, ES5 trailing commas, import sorting and strict rules are not silently accepted project conventions. Do not remove held StoreSelector controllers just to satisfy an unused-member diagnostic.

Keep the existing TypeScript compiler check while verifying the TypeScript-Go-based checks. Preserve CSS correctness coverage; a passing JavaScript linter alone is insufficient. Resolve generator defects at their source and distinguish intentional CSS fallbacks from accidental duplication.

Versions tested, results and remaining limits: [developer-tooling analysis](../research/08-developer-tooling.md#oxlint-oxfmt-and-ultracite).
