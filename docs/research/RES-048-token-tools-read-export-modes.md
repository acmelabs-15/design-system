---
id: RES-048
status: resolved # in-progress | resolved
outcome: answered
kind: task
from: IDEA-002#20 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-12
---
# RES-048: Do Terrazzo and Style Dictionary read the files of Export modes

## Question
Do Terrazzo and Style Dictionary read the files that "Export modes" writes, and what CSS does each write for two modes, an alias, a number with no unit, a string and a boolean?

The result is evidence for IDEA-002#11 (which token files the pipeline hands to the Lit core and the framework packages). This record gives observed facts only, and no recommendation or ranking.

## Answer
The completion condition is met. Both tools read `Light.tokens.json` and `Dark.tokens.json` of RES-028 as they are, with no hand edit and no plugin beyond each tool's own CSS output. Neither tool writes an error or a warning about the content of the files. Neither tool reads the two files as two modes by itself: given both files at once, each tool merges them and the Dark values win.

| | Style Dictionary | Terrazzo |
|---|---|---|
| Installed | `style-dictionary@5.8.0` | `@terrazzo/cli@2.10.0`, `@terrazzo/plugin-css@2.10.0` (parser 2.10.0) |
| Reads the files unchanged | Yes | Yes |
| Both files as one source | Builds; prints `Token collisions detected (42):`; one `:root` block with the Dark values | Builds (`✔  16 tokens built`); no warning; one `:root` block with the Dark values |
| Light and Dark in one output | One build for each mode file, each with its own `selector` option; two CSS files | One added resolver file (`tz/b-resolver/trial.resolver.json`) that names the two export files as the contexts of one modifier; one CSS file with two blocks |
| Change to the export files | None | None |

The extra configuration is the only change: two Style Dictionary configs, or one Terrazzo resolver file plus `permutations` in the CSS plugin. The trial folder holds each.

### The five cases, exact output lines

The lines come from `out/sd/b-per-mode/*.css` (Style Dictionary run B) and `out/tz/b-resolver/index.css` (Terrazzo run B), in `.artifacts/v1/trial/IDEA-002-20/`.

1. Two modes (`color.accent`, Light `#2563EB`, Dark `#60A5FA`):
   - Style Dictionary, `light.css`: `:root {` … `--color-accent: #2563eb;`; `dark.css`: `[data-theme="dark"] {` … `--color-accent: #60a5fa;`. The selector of each file comes from the config (`options.selector`); the tool has no notion of a mode.
   - Terrazzo, one file: `:root {` … `--color-accent: rgb(14.51% 38.824% 92.157%);` and `[data-theme="dark"] {` … `--color-accent: rgb(37.647% 64.706% 98.039%);`. The selector comes from `prepare` of each permutation; the resolver context names `Light` and `Dark` are the inputs.
2. Alias (`alias.button-ground` = `{color.accent}`):
   - Style Dictionary, default: the resolved value, `--alias-button-ground: #2563eb; /** Alias fixture for IDEA-002 row 19. */` (Dark: `#60a5fa`). With `outputReferences: true`: `--alias-button-ground: var(--color-accent); /** Alias fixture for IDEA-002 row 19. */`, moved to the end of the block.
   - Terrazzo, default: `--alias-button-ground: var(--color-accent);`, with the description on the line before as `/* Alias fixture for IDEA-002 row 19. */`. It writes the alias again in the dark block.
3. Number with no unit (`radius.small`, scope `CORNER_RADIUS`): both write `--radius-small: 4;`, with no unit, in each mode. Same for `spacing.*` (`--spacing-md: 16;`).
4. String (`text.label`, `$type: "string"`, not a DTCG type): both write `--text-label: Save;`, without quotes, and neither warns about the type.
5. Boolean (`flag.show-icon`, `$type: "number"` with `com.figma.type: "boolean"`): both write `--flag-show-icon: 1;` in Light and `--flag-show-icon: 0;` in Dark.

Colours: Style Dictionary writes lower-case hex (`#2563eb`); Terrazzo writes `rgb()` with percentages (`rgb(14.51% 38.824% 92.157%)`). Terrazzo documents a `legacyHex` option for hex output; the trial did not use it.

### Figma's own fields
- `$extensions` (`com.figma.variableId`, `com.figma.scopes`, `com.figma.codeSyntax`, `com.figma.type`) and the top-level `com.figma.modeName`: neither tool writes them to CSS. Both keep them in memory on each token (`scripts/inspect-extensions.mjs`), so a custom transform could read them, for example the scopes for a unit.
- `com.figma.codeSyntax` names such as `var(--trial-color-accent)` do not set the variable name. Both tools name variables from the token path: `--color-accent`, `--alias-button-ground` (the code syntax of that variable is `var(--trial-button-ground)`).
- `$description`: Style Dictionary writes it as a trailing comment `/** … */`; Terrazzo writes it as a comment line `/* … */` before the variable.

### Limits
- Only the 16-variable export was fed; the 13-variable archive is a subset and was not run.
- An alias to a variable in another collection, and a collection with one mode, were not in the export (RES-028) and were not tried.
- Both CLIs start through a `#!/usr/bin/env node` line, so `bun run` used Node v24.20.0. A second run of both "run B" builds with `bun --bun run` gave identical CSS.

### Planned action
1. Done: create this record.
2. Done: capability check (Bun 1.4.2, brain:source-driven-development, the official configuration pages).
3. Done: trial folder with its own `package.json`; install with the pinned Bun.
4. Done: feed the files to each tool with the smallest documented configuration.
5. Done: compare the five cases and Figma's fields.
6. Done: keep configurations, inputs and outputs in the trial folder; `git status` confirms the root `package.json` and `bun.lock` are unchanged.

### Completion condition
For each of the two tools, this record holds the installed version, the command, and the observed result for reading the export and for each of the five cases, or the exact error that stopped it.

### Safe to repeat
- Every step. Step 3 rewrites only the trial folder's `node_modules` and `bun.lock`; steps 4 and 5 overwrite only `out/` and the `out-*.log` files in the trial folder. The inputs are copies; the originals in `.artifacts/v1/trial/IDEA-002-19/` are not written.

## Findings
All paths are in `.artifacts/v1/trial/IDEA-002-20/` (scratch, outside git). `$B` is `/Users/peterkloss/Dev/ACMElabs/design-system/.artifacts/runtime/bun-1.4.2/bun-darwin-aarch64/bun`. All commands ran from the trial folder on 2026-11-12.

### Capability check and inputs
- The pinned Bun prints `1.4.2`. Source: `$B --version`, checked 2026-11-12.
- The skill brain:source-driven-development loaded from `/Users/peterkloss/.claude/plugins/cache/acmelabs/brain/0.13.0/skills/source-driven-development`. Source: Skill tool, checked 2026-11-12.
- The inputs are copies of `export-modes-16-variables/Light.tokens.json` (SHA-256 `35d72710…bcde`) and `Dark.tokens.json` (SHA-256 `a8aec2b4…5b14`), and of the archive (SHA-256 `fffce513…9dc4`, as in RES-028). Source: `shasum -a 256 input/*`, checked 2026-11-12.
- The two files differ only in the eight colour values, `flag.show-icon` (1 and 0) and `com.figma.modeName`. Source: `diff input/Light.tokens.json input/Dark.tokens.json`, checked 2026-11-12.

### Installation
- `$B add style-dictionary@latest @terrazzo/cli@latest @terrazzo/plugin-css@latest` installed `style-dictionary@5.8.0`, `@terrazzo/cli@2.10.0` and `@terrazzo/plugin-css@2.10.0`; the lock file names `@terrazzo/parser@2.10.0`. Source: command output and `bun.lock`, checked 2026-11-12.
- The npm registry gives 5.8.0, 2.10.0 and 2.10.0 as the current versions. Source: `npm view style-dictionary version`, `npm view @terrazzo/cli version`, `npm view @terrazzo/plugin-css version`, checked 2026-11-12.
- Both bin files start with `#!/usr/bin/env node`; `bun run` therefore ran them on Node v24.20.0. Source: `head -1 node_modules/.bin/style-dictionary node_modules/.bin/tz` and `node --version`, checked 2026-11-12.

### Documentation used for the configurations
- Style Dictionary reads token files from `source`, "will do a deep merge of all of the token files", and auto-detects the DTCG format (`usesDtcg`). Source: https://styledictionary.com/reference/config/#properties, checked 2026-11-12.
- `css/variables` takes `options.selector` and `options.outputReferences`. Source: https://styledictionary.com/reference/hooks/formats/predefined/#cssvariables, checked 2026-11-12.
- The `css` transform group holds `attribute/cti`, `name/kebab`, `time/seconds`, `html/icon`, `size/rem`, `color/css`, `asset/url`, `fontFamily/css`, `cubicBezier/css` and four shorthand transforms. Source: https://styledictionary.com/reference/hooks/transform-groups/predefined/, checked 2026-11-12.
- Style Dictionary says "the latest format 2025.10 does not have full support yet". Source: https://styledictionary.com/info/dtcg/, checked 2026-11-12.
- Terrazzo's `tokens` takes one or more files; "In the case of multiple files, they will be merged in array order (last will take precedence)". Source: https://terrazzo.app/docs/reference/config/#tokens, checked 2026-11-12.
- A DTCG resolver maps each context of a modifier to token files; the CSS plugin maps each input to a selector through `permutations` and `prepare`. Source: https://terrazzo.app/docs/guides/resolvers/#quickstart and https://terrazzo.app/docs/integrations/css/#resolvers, checked 2026-11-12.
- The CSS plugin page gives `"tokens.css"` as the default `filename`; the build wrote `index.css`. Source: https://terrazzo.app/docs/integrations/css/#config and `out/tz/a-both-files/index.css`, checked 2026-11-12.

### Style Dictionary
- Run A, both files in `source`: `$B run style-dictionary build --config sd/a-both-files.config.json` printed `Token collisions detected (42):` and `✔︎ out/sd/a-both-files/variables.css`; the file holds one `:root` block with the Dark values, such as `--color-accent: #60a5fa;` and `--flag-show-icon: 0;`. Source: `out-sd-a.log`, `out/sd/a-both-files/variables.css`, checked 2026-11-12.
- With `--verbose`, the 42 collisions are each colour component, hex and file of the eight colours, `flag.show-icon` ("Original value: 1, New value: 0") and the top-level `$extensions` ("Original value: Light, New value: Dark"). Source: `$B run style-dictionary build --config sd/a-both-files.config.json --verbose`, checked 2026-11-12.
- Run B, one build for each mode: `$B run style-dictionary build --config sd/b-light.config.json` and `… sd/b-dark.config.json` printed no warning and wrote `light.css`, `light.references.css`, `dark.css` and `dark.references.css`. Source: `out-sd-b-light.log`, `out-sd-b-dark.log`, checked 2026-11-12.
- `light.css` holds `:root {` with `--color-accent: #2563eb;`, `--radius-small: 4;`, `--spacing-md: 16;`, `--alias-button-ground: #2563eb; /** Alias fixture for IDEA-002 row 19. */`, `--text-label: Save;` and `--flag-show-icon: 1;`. Source: `out/sd/b-per-mode/light.css`, checked 2026-11-12.
- `dark.css` holds `[data-theme="dark"] {` with `--color-accent: #60a5fa;`, `--alias-button-ground: #60a5fa; /** Alias fixture for IDEA-002 row 19. */` and `--flag-show-icon: 0;`. Source: `out/sd/b-per-mode/dark.css`, checked 2026-11-12.
- With `outputReferences: true` the alias line is `--alias-button-ground: var(--color-accent); /** Alias fixture for IDEA-002 row 19. */`, placed last in the block. Source: `out/sd/b-per-mode/light.references.css` and `dark.references.css`, checked 2026-11-12.
- After reading, Style Dictionary keeps each token's `$extensions` and the top-level `$extensions` (`{"com.figma.modeName":"Light"}`) in `sd.tokens`. Source: `node scripts/inspect-extensions.mjs`, `out-inspect-extensions.log`, checked 2026-11-12.

### Terrazzo
- First try: with token paths relative to the config file, `$B run tz build --config tz/a-both-files/terrazzo.config.ts` stopped with `✗  config: Could not locate ../../input/Light.tokens.json. To create one, run \`npx tz init\`.`; the paths resolve from the working folder, and the config now uses `./input/…`. Source: command output, checked 2026-11-12.
- Run A, both files in `tokens`: the build printed `✔  16 tokens built 26ms` and no warning; `index.css` holds one `:root` block with the Dark values, such as `--color-accent: rgb(37.647% 64.706% 98.039%);` and `--flag-show-icon: 0;`. Source: `out-tz-a.log`, `out/tz/a-both-files/index.css`, checked 2026-11-12.
- `$B run tz check --config tz/a-both-files/terrazzo.config.ts` printed `✔  No errors`. Source: `out-tz-a-check.log`, checked 2026-11-12.
- Run B, a resolver with the modifier `mode` (contexts `Light` and `Dark`, each a `$ref` to one unchanged export file, default `Light`) and two permutations: `$B run tz build --config tz/b-resolver/terrazzo.config.ts` printed `✔  16 tokens built 19ms`. Source: `tz/b-resolver/trial.resolver.json`, `tz/b-resolver/terrazzo.config.ts`, `out-tz-b.log`, checked 2026-11-12.
- Run B's `index.css` holds `:root {` with `--color-accent: rgb(14.51% 38.824% 92.157%);`, `--radius-small: 4;`, `--spacing-md: 16;`, `--text-label: Save;`, `--flag-show-icon: 1;`, and `[data-theme="dark"] {` with `--color-accent: rgb(37.647% 64.706% 98.039%);` and `--flag-show-icon: 0;`. Source: `out/tz/b-resolver/index.css`, checked 2026-11-12.
- In both blocks the alias is `--alias-button-ground: var(--color-accent);` under the comment `/* Alias fixture for IDEA-002 row 19. */`. Source: `out/tz/b-resolver/index.css`, checked 2026-11-12.
- After parsing, Terrazzo keeps each token's `$extensions` and `$description`, holds the alias with its resolved `$value` and `aliasOf: "color.accent"`, and keeps `$type: "string"` for `text.label`. Source: `node scripts/inspect-extensions.mjs`, `out-inspect-extensions.log`, checked 2026-11-12.

### Runtime and repository
- A second run of both "run B" builds with `$B --bun run …` wrote CSS identical to the Node runs. Source: `diff -r` of the two output sets, checked 2026-11-12.
- `git status --short` lists no change to the root `package.json` or `bun.lock`; `.artifacts/` is ignored. Source: `git status --short` and `git status --short --ignored .artifacts`, checked 2026-11-12.

## Follow-ups
- IDEA-002#11 owns how a unit reaches a FLOAT token: both tools write `4` with no unit, and both hold `com.figma.scopes` in memory for a custom transform to read.
- How do the two tools treat an alias to a variable in another collection (`com.figma.aliasData`) once an export with one exists?

## Next action
None.
