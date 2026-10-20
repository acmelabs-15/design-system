# M25 lint and formatter evidence

The toolchain runs under Bun. Versions: Oxlint 1.85.0, Oxfmt 0.70.0,
Ultracite 7.12.0, Stylelint 17.15.0 and postcss-lit 1.4.1.

[Final local results](2026-09-26.json): Bun 1.4.2, zero Oxlint/CSS diagnostics,
formatter pass and strict root types pass. Focused test logs are saved beside
the result. Root command/editor/CI cutover remains separate.

## Configuration and ownership

- [Exact rule mapping](policy.json) records each changed preset setting, its
  reason, and the scoped exceptions. `oxlint.config.ts` is the executable source.
- `oxfmt.config.ts` retains two spaces, 200 columns and all trailing commas.
  Imports and package metadata keep their order. Embedded template formatting
  is off. The style compiler and Stylelint own CSS.
- `tools/geist/gen.ts` uses 280 columns. At 200 columns Oxfmt attaches an existing
  inline JSDoc comment to a different syntax node; 280 preserves the original
  attachment. The CLI permits widths up to 320, unlike the programmatic API.
- Generated sources, registration entries, published docs, downloaded corpus,
  build outputs, notes and skills are outside formatter ownership.
- Stylelint checks authored CSS and canonical compiled CSS. Generated
  `.source.css` files are intermediate compiler inputs, not emitted output.
  Only actual `css`-tagged templates enter postcss-lit. A skipped template fails
  the check rather than silently reducing coverage.

## Reproduce

```sh
bun scripts/lint.ts check
bun scripts/lint.ts format
bun scripts/lint.ts audit
bun test scripts/__tests__/lint.test.ts scripts/__tests__/lint-files.test.ts scripts/__tests__/lint-lit-syntax.test.ts scripts/__tests__/lint-source-guard.test.ts scripts/__tests__/lint-policy.test.ts
```

`format-write` is the explicit formatter write mode. `check`, `css`, `format`
and `audit` do not rewrite source. Reports go to `.artifacts/lint/`.
The runner invokes package JavaScript entrypoints through the current Bun
executable. It does not invoke a Node shebang or install packages at check time.

## Verification boundaries

- The mechanical migration used only `curly` and `import/newline-after-import`
  fixes, followed by Oxfmt. The syntax guard checks declaration flags, optional
  chains, raw template text, JSDoc attachment, key order and reactive reads.
- Required live-collection snapshots, sparse-array fixtures, owner captures and
  Worker messaging retain their meaning. Policy tests show that ordinary
  invalid sparse arrays, missing Window target origins, unfinished functions,
  duplicate branches, eval and unused variables still fail.
- CSS probes catch an unknown property and accidental duplicate declarations
  in raw CSS and Lit templates. Different-value fallbacks remain supported.
- Output reports use a freshly truncated file descriptor. Tests prove that a
  shorter run cannot leave trailing JSON from an earlier larger report.
- TypeScript 5.9 remains the required type checker. These checks do not claim
  TypeScript-Go equivalence or replace native browser verification.

## Sources

- [Oxlint configuration](https://oxc.rs/docs/guide/usage/linter/config.html)
- [Oxfmt configuration](https://oxc.rs/docs/guide/usage/formatter/config.html)
- [Stylelint configuration](https://stylelint.io/user-guide/configure/)
- [postcss-lit syntax and interpolation limits](https://github.com/43081j/postcss-lit)
- The installed Ultracite 7.12.0 `oxlint/core` and `oxfmt` presets were read and
  evaluated directly. Its Stylelint preset is not adopted: it adds a separate
  Prettier formatting path, while this project uses Oxfmt plus explicit CSS
  correctness rules.
