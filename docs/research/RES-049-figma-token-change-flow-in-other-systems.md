---
id: RES-049
status: resolved # in-progress | resolved
outcome: answered
kind: research
from: IDEA-002#28 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-12
---
# RES-049: How other design systems bring token changes from Figma into their repo

## Question
How do other design systems bring token changes from Figma into their repo (a script, a plugin, a CI job or by hand), on which Figma plan, and how do they name token versions?

## Answer
Sufficient-answer condition, set for IDEA-002#10:

- At least six named design systems that author tokens in Figma. For each: the route from Figma to the repo (plugin, REST API script, CI job, manual export), who or what starts it, how the change lands (pull request, direct commit, release of a token package), the Figma plan that the route needs, and how the system versions tokens (with the package, or with a version of its own). Each from the system's own repository, documentation or engineering posts.
- What a script can and cannot do on the Professional plan, step by step from the export in Figma to the built token output, with the source for each limit.
- The systems looked at that could not be confirmed.

The record gives facts and sources only. It gives no recommendation and no ranking. RES-026 covers the export routes and the token formats; this record does not repeat them.

The condition is met. Nine systems that author tokens in Figma are confirmed from their own public repositories, read on 2026-11-12 through the GitHub API (`gh api`) and Firecrawl search. Four more systems were found to author tokens in code and push them to Figma; they are listed as the other direction. No Figma call was made and no Figma access token was used. The skill brain:source-driven-development was loaded. `brain sdd-cache` does not exist in brain 0.13.0, so no cache validators are recorded.

### Systems that author tokens in Figma

| System | Route out of Figma | Who or what starts it | How the change lands | Figma plan the route needs | Token versions |
| --- | --- | --- | --- | --- | --- |
| Equinor EDS | (a) A REST API script, `sync-figma-to-tokens`, behind the package script `pnpm run update-tokens`. (b) Tokens Studio, with the `studio` CLI in CI | (a) A person runs the package script locally, or starts the GitHub Actions workflow by hand. (b) A release in Tokens Studio sends a `repository_dispatch` | A pull request from a fixed branch, in both routes | (a) Enterprise; the README says so. (b) A Tokens Studio platform plan; Figma plan not stated | The package `@equinor/eds-tokens`, by release-please from commit messages; now on a beta line, 3.0.0-beta.10 |
| Workday Canvas | A REST API script (`yarn fetch-tokens`, then `yarn parse-tokens`) in a GitHub Actions workflow | A person starts the workflow by hand and chooses the target branch | A commit on a new branch and a pull request | Enterprise (the endpoint `variables/local`); Workday states no plan | The package `@workday/canvas-tokens-web`, 4.5.1. A release runs on each push to `main` whose commit starts with `feat` or `fix` |
| Adobe Spectrum | Tokens Studio, through an outside repo `spectrum-tokens-studio-data` that converts the change | A designer in Tokens Studio; the outside repo opens the pull request | A pull request titled `feat: updates from spectrum-tokens-studio-data`; a workflow adds a changeset | Not stated | The package `@adobe/spectrum-tokens`, 15.7.0, by changesets. Adobe plans to retire this route and author tokens in code |
| PatternFly | A custom plugin, "Export Patternfly Tokens", run as a development plugin from the repo's `manifest.json` | A person with edit access runs it in the Figma desktop app, downloads `tokens.zip` and copies the files into the repo | A pull request, such as #154 "fix(tokens): pull in latest from figma" | A development plugin runs on every plan (RES-024); the guide asks for edit access to the file | The package `@patternfly/design-tokens`, by semantic-release on each push to `main`, on the `prerelease` channel: 1.16.5 |
| Moon (Coingaming) | A REST API call (`variables/local`) in a GitHub Actions workflow | A `repository_dispatch` of type `tokens_updated`, which the workflow comments tie to a Figma webhook, or a person by hand | A direct commit, "🤖 Figma Tokens Update"; a second workflow then runs Style Dictionary | Enterprise (the endpoint `variables/local`); Moon states no plan | The package `moon_tokens` on pub.dev, by release-please. Last push 2024-08-09 |
| NL Design System | Tokens Studio; the files are `figma/*.tokens.json` in Tokens Studio's types | A designer; CODEOWNERS names "tokens managed by Tokens Studio in Figma" | A pull request with a changeset, such as #1694 | Not stated | One package for each theme, by changesets, such as `@nl-design-system-unstable/start-design-tokens` 9.2.0 |
| Welcome UI (Welcome to the Jungle) | Figma's native export; the files carry `com.figma.variableId` | The design team puts the files in a Google Drive folder; a developer copies them into the repo and runs `yarn theme:generate` | A pull request, such as #3159 "Make theme generation work from figma native token export feature" | Not stated; the native export needs a paid plan (RES-026) | With the package `welcome-ui`, 10.7.5; a person runs `release-it` |
| DNB Eufemia | (a) A REST API script in a GitHub Actions workflow, which writes "the same format the Figma UI produces with 'Export Modes'". (b) As a fallback, "Export Modes" by hand | (a) A person starts the workflow by hand. (b) A person with edit access in Figma | (a) A draft pull request from a dated branch `tokens/automation-figma-sync-YYYYMMDD-HHMMSS`, with a token review report. (b) The person places the files | (a) Enterprise; the documentation says so. (b) Not stated | With the package `@dnb/eufemia`, 11.17.1, by semantic-release |
| CFPB | Figma's native export | A person exports from the Figma library and saves the files in the tokens folder; hand edits are also allowed | A feature branch and a pull request | Not stated | With the package `@cfpb/cfpb-design-system`, 5.10.3; a person runs `yarn release` and picks major, minor or patch |

Patterns across the nine:

- Routes: four use the REST API (Equinor, Workday, Moon, Eufemia). Three use Tokens Studio (Equinor's second route, Spectrum, NL Design System). One uses a custom development plugin (PatternFly). Three use the native export (Welcome UI, Eufemia's fallback, CFPB).
- Two systems state their Figma plan, and both name Enterprise for the REST route: Equinor and Eufemia. The REST route needs Enterprise by Figma's own documentation (RES-024). No system states a Professional plan.
- Starts: no route reads Figma on a timer. Every REST and Tokens Studio route starts by hand or by an event. Moon starts on an event that its workflow ties to a Figma webhook; the step from the webhook to the `repository_dispatch` is not in the repository.
- Landing: seven land through a pull request; Moon commits directly; Welcome UI's README says "commit & push" and its token changes in the history came through pull requests.
- Versions: every system versions tokens with an npm or pub.dev package. Six publish a separate token package (Equinor, Workday, Spectrum, PatternFly, Moon, NL Design System); three ship tokens inside the main package (Welcome UI, Eufemia, CFPB). No system names a token version after a Figma file version or library publish. The version comes from release-please, changesets, semantic-release or a person's choice at release.
- The three systems that use the native export (Welcome UI, Eufemia's fallback, CFPB) have a person take the files out of Figma; none has a script start the export.

### Systems that author tokens in code and push them to Figma

| System | Direction and evidence |
| --- | --- |
| IBM Carbon | Chose "Code → Figma" on 2026-09-07: `src/dtcg/` is the source, and a script is to push changes through the Variables REST API |
| Digdir Designsystemet | Tokens come from its CLI and theme builder; its own Figma plugin imports a config into Figma. The Figma UI kit takes the same version as the code packages through changesets |
| Red Hat Design System | A GitHub Actions workflow creates Figma collections from a Style Dictionary URL |
| Telefónica Mística | The token JSON in the repo updates Figma variables through the Figma API; an agent skill `update-tokens` edits the token JSON in the repo |

### What a script can and cannot do on the Professional plan

Each step from the export in Figma to the built token output:

1. Read the variables out of Figma: cannot. `GET /v1/files/:key/variables/local` and `variables/published` need Enterprise (RES-024), and the trial answered 403 on this team's Professional plan (RES-028).
2. Start "Export modes": cannot. The command is a right-click in the Variables view; Figma documents no API or other trigger (RES-026). A plugin cannot run in the background either (RES-026). A person or a browser agent runs it (DEC-120). A `use_figma` read script through the Figma MCP can read the values, but only an agent after a person's browser sign-in (RES-026, RES-028).
3. Learn that variables changed: can, in part. On Professional a file webhook can fire on a named version or a library publish; `LIBRARY_PUBLISH` lists the keys and names of created, changed and deleted variables, without values (RES-026). `GET file meta` and `GET file versions` answer on Professional (RES-028). A script can therefore notice a change and ask for an export, but not fetch the values.
4. Take the exported files: can. The export saves a ZIP named after the collection, with one `<Mode>.tokens.json` for each mode (RES-028). A script can unzip it and place the files. The files hold no collection name, so the script or the folder layout must supply it (RES-028, DEC-120).
5. Check the files: can. A script can check them against the DTCG format and against a list of expected modes; Eufemia's workflow fails when a listed mode is missing and skips an unlisted mode with a warning. A script cannot compare values with Figma, because step 1 is closed; the MCP check in DEC-120 needs an agent.
6. Build the token output: can. Style Dictionary or Terrazzo read DTCG files (RES-026); IDEA-002#20 tests them on the export. Welcome UI and CFPB build CSS from native exports with Style Dictionary.
7. Show what changed: can. Eufemia's workflow writes a report of changed resolved values and contrast pairs into its pull request.
8. Commit, open a pull request and set a version: can. Branches, commits, pull requests and package versions are Git and package-registry steps with no Figma plan in them; Workday, Eufemia and Equinor open pull requests from scripts, and the version tools above run without Figma.

So on Professional the first step from Figma to a file stays manual or agent-run, and a script can do every step after the file exists.

### Unknown

- No system states that it runs its Figma route on the Professional plan. Seven of nine state no plan.
- How Moon's Figma webhook becomes a `repository_dispatch`: its repository holds only the receiving workflow.
- Workday's MAINTAINING.md still describes a Tokens Studio sync workflow, `tokens-studio-sync.yml`, which is no longer in `.github/workflows`; the current workflow reads the REST API. See Findings.
- Systems looked at and not confirmed: Siemens iX (no token pipeline in the public repository); Kong `design-tokens` and Kiwi Orbit (their READMEs and file lists name no Figma route); Orange OUDS for Android (file names show a Figma icon, no flow read); The Washington Post WPDS and Nordhealth (the repositories named in search were not found); Shopify Polaris (the React repository is archived); GitLab Pajamas and Bitwarden (not read).

## Findings

### Equinor EDS
- The workflow "Sync Figma to tokens" runs on `workflow_dispatch` only, runs `pnpm run update:tokens` with the secret `GH_ACTION_VARIABLES_SYNC_FIGMA_TOKEN`, and opens a pull request with `peter-evans/create-pull-request@v8` on the branch `update-canonical-tokens`. Source: https://github.com/equinor/design-system/blob/main/.github/workflows/sync-figma-to-tokens.yml#L1-L49, checked 2026-11-12.
- Equinor's token guide says a person runs `pnpm run update-tokens`, which calls `sync-figma-to-tokens --file-key ...`, which calls `GET /v1/files/{fileKey}/variables/local` and writes one file for each collection and mode as `{Collection Name}.{Mode Name}.json`; the personal access token sits in a git-ignored `.env`. Source: https://github.com/equinor/design-system/blob/main/documentation/how-to/eds-tokens-guide/01-figma-sync.md#L24-L73, checked 2026-11-12.
- The `@equinor/eds-tokens` package defines `update-tokens` as package scripts that call `sync-figma-to-tokens` for five Figma file keys. Source: https://github.com/equinor/design-system/blob/main/packages/eds-tokens/package.json, checked 2026-11-12.
- The eds-tokens README says: "To use the 'Sync Figma variables to tokens' workflow, you must be a full member of an Enterprise org in Figma", in its section "Prerequisites". Source: https://github.com/equinor/design-system/blob/main/packages/eds-tokens/README.md#L520-L524, checked 2026-11-12.
- The workflow "Tokens Studio release" runs on a `repository_dispatch` of type `tokens-release`, which "the outbound CI trigger in Tokens Studio" sends when a release is created; it pulls with `studio tokens pull --ci`, runs saved Tokens Studio exports for CSS and DTCG, generates TypeScript, and opens a pull request. Source: https://github.com/equinor/design-system/blob/main/.github/workflows/tokens_studio_release.yaml#L1-L120, checked 2026-11-12.
- release-please versions `packages/eds-tokens` as `@equinor/eds-tokens` with `"versioning": "prerelease"` and `"prerelease-type": "beta"`; the newest changelog entry is 3.0.0-beta.10 of 2026-11-02. Source: https://github.com/equinor/design-system/blob/main/.github/release-please-config.json#L53-L64 and https://github.com/equinor/design-system/blob/main/packages/eds-tokens/CHANGELOG.md#L8, checked 2026-11-12.

### Workday Canvas
- The workflow "Tokens Sync automation" runs on `workflow_dispatch` with a choice of target branch (`main`, `prerelease/minor`, `prerelease/major`), runs `yarn fetch-tokens` and `yarn parse-tokens` with `FIGMA_ACCESS_TOKEN` and two file keys, commits "feat: Sync tokens from Figma" to `sync-tokens-from-figma-<branch>` when tokens changed, and opens a pull request. Source: https://github.com/Workday/canvas-tokens/blob/main/.github/workflows/figma-sync.yml#L1-L103, checked 2026-11-12.
- The fetch script calls `/files/${fileKey}/variables/local`, `/files/${fileKey}/styles` and `/files/${fileKey}/nodes`. Source: https://github.com/Workday/canvas-tokens/blob/main/scripts/utils/fetch-figma-variables.js#L54, checked 2026-11-12.
- The release workflow runs on pushes to `main`, `prerelease/major` and `prerelease/minor` when the head commit starts with `feat` or `fix`, or by hand with a `patch`, `minor` or `major` override; `@workday/canvas-tokens-web` is at 4.5.1. Source: https://github.com/Workday/canvas-tokens/blob/main/.github/workflows/release.yml#L1-L30 and https://github.com/Workday/canvas-tokens/blob/main/packages/canvas-tokens-web/CHANGELOG.md#L3, checked 2026-11-12.
- Disagreement: MAINTAINING.md says the Tokens Studio config "lives in Canvas Tokens Studio" and is synced by the "Tokens Studio Sync" workflow `tokens-studio-sync.yml`; that file is not in `.github/workflows`, whose token workflow is `figma-sync.yml` and reads the REST API. Source: https://github.com/Workday/canvas-tokens/blob/main/MAINTAINING.md#L39-L64 and https://github.com/Workday/canvas-tokens/tree/main/.github/workflows, checked 2026-11-12.

### Adobe Spectrum
- `adobe/spectrum-tokens` is renamed `adobe/spectrum-design-data`; the npm name `@adobe/spectrum-tokens` is unchanged. Source: https://github.com/adobe/spectrum-tokens/blob/main/README.md, checked 2026-11-12.
- "Designers author in Token Studio, an external `spectrum-tokens-studio-data` repo converts the change, and a PR (opened by `mrcjhicks`, titled `feat: updates from spectrum-tokens-studio-data`) lands here"; `enhance-sync-pr.yml` decorates that PR and runs `tools/token-changeset-generator`. Source: https://github.com/adobe/spectrum-design-data/blob/main/docs/token-studio-sunset.md#L7-L13, checked 2026-11-12.
- The same roadmap says Token Studio "is not the authoritative authoring surface", that a CLI, TUI and MCP path writes tokens directly and exports them to Figma Variables, and that Phase 3 retires the inbound sync. Source: https://github.com/adobe/spectrum-design-data/blob/main/docs/token-studio-sunset.md#L5-L67, checked 2026-11-12.
- `@adobe/spectrum-tokens` is at 15.7.0, and the release workflow runs changesets on each push. Source: https://github.com/adobe/spectrum-design-data/blob/main/packages/tokens/CHANGELOG.md#L3 and https://github.com/adobe/spectrum-design-data/blob/main/.github/workflows/release.yml#L16-L36, checked 2026-11-12.

### PatternFly
- The README says token JSON files are "exported from Figma" with a custom exporter and built with `yarn build:scss`. Source: https://github.com/patternfly/design-tokens/blob/main/README.md#L3-L11, checked 2026-11-12.
- The plugin guide: "Edit access to the Figma file is required to run the exporter"; a person imports the plugin from `manifest.json` under Plugins > Development, runs "Export Tokens", downloads `tokens.zip` and copies the `tokens` folder into `packages/module`. Source: https://github.com/patternfly/design-tokens/blob/main/packages/module/plugins/export-patternfly-tokens/README.md#L1-L26, checked 2026-11-12.
- The newest token commit, "fix(tokens): pull in latest from figma", came through pull request #154, merged 2026-06-23. Source: https://github.com/patternfly/design-tokens/pull/154, checked 2026-11-12.
- semantic-release publishes from `main` to the `prerelease` channel with tags `v${version}`; npm has `prerelease` 1.16.5 (2026-06-23) and `latest` 1.0.0. Source: https://github.com/patternfly/design-tokens/blob/main/packages/module/release.config.js and https://registry.npmjs.org/@patternfly/design-tokens, checked 2026-11-12.

### Moon (Coingaming)
- The README says tokens are "automatically fetched from Figma on publish event and converted to technology specific tokens via style-dictionary". Source: https://github.com/coingaming/moon-tokens/blob/main/README.md#L5, checked 2026-11-12.
- The workflow "Fetch tokens from Figma" runs on `repository_dispatch` of type `tokens_updated` or by hand, with the comment "Figma webhook can be spammy at times"; it calls `https://api.figma.com/v1/files/.../variables/local` and commits directly with the message "🤖 Figma Tokens Update". Source: https://github.com/coingaming/moon-tokens/blob/main/.github/workflows/fetch_tokens.yml#L1-L38, checked 2026-11-12.
- A second workflow runs Style Dictionary after the fetch, and release-please runs on pushes to `main`; the last push to the repository was 2024-08-09. Source: https://github.com/coingaming/moon-tokens/blob/main/.github/workflows/transform_with_sd.yml and https://github.com/coingaming/moon-tokens/blob/main/.github/workflows/release.yml, checked 2026-11-12.

### NL Design System
- CODEOWNERS has the rule "Changes to tokens managed by Tokens Studio in Figma" for `/packages/**/figma/*.tokens.json`, owned by the design and maintainer teams. Source: https://github.com/nl-design-system/themes/blob/main/.github/CODEOWNERS#L57-L58, checked 2026-11-12.
- The file `start.tokens.json` uses Tokens Studio types such as `fontFamilies` and `fontWeights`. Source: https://github.com/nl-design-system/themes/blob/main/packages/start-design-tokens/figma/start.tokens.json, checked 2026-11-12.
- Pull request #1694, merged 2026-11-10, changed token values after "a new release of Tokens Studio" and added a changeset; `@nl-design-system-unstable/start-design-tokens` is at 9.2.0. Source: https://github.com/nl-design-system/themes/pull/1694 and https://github.com/nl-design-system/themes/blob/main/packages/start-design-tokens/package.json, checked 2026-11-12.

### Welcome UI
- The theme README: download the token files from the design team's Google Drive folder, copy them into `lib/src/theme/tokens/`, run `yarn theme:generate`, check, lint, then "commit & push"; Style Dictionary v5 converts Figma colour objects and adds `px` or `rem` to numbers. Source: https://github.com/WTTJ/welcome-ui/blob/main/lib/src/theme/README.md#L42-L112, checked 2026-11-12.
- Pull request #3159, merged 2026-01-21, is titled "Make theme generation work from figma native token export feature"; the token files carry `com.figma.variableId`, `com.figma.scopes` and `com.figma.isOverride`. Source: https://github.com/WTTJ/welcome-ui/pull/3159 and https://github.com/WTTJ/welcome-ui/blob/main/lib/src/theme/tokens/primitives.json, checked 2026-11-12.
- The root package scripts release with `release-it`; the newest tag is v10.7.5 of 2026-11-10. Source: https://github.com/WTTJ/welcome-ui/blob/main/package.json#L25-L27 and https://github.com/WTTJ/welcome-ui/releases, checked 2026-11-12.

### DNB Eufemia
- The documentation page "Publish design tokens": a person runs the "Design Tokens" workflow on `main`; it reads the variables REST API, writes `*.tokens.json`, regenerates CSS and snapshots, and opens a draft pull request from `tokens/automation-figma-sync-YYYYMMDD-HHMMSS`; and the page says "The Figma variables API is only available to Enterprise organizations". Source: https://github.com/dnbexperience/eufemia/blob/main/packages/dnb-design-system-portal/src/docs/web/contribute/deploy/tokens.mdx#L24-L51, checked 2026-11-12.
- As a fallback a person right-clicks the collections and selects "Export Modes" and places the unzipped files; "You need edit permissions to see sub-collections". The API returns only the remote variables used in the file, a manual export the whole collection. Source: https://github.com/dnbexperience/eufemia/blob/main/packages/dnb-design-system-portal/src/docs/web/contribute/deploy/tokens.mdx#L49-L83, checked 2026-11-12.
- A mode in Figma that is not listed in `TOKEN_EXPORTS` is skipped with a warning, and a listed mode no longer in Figma fails the run. Source: https://github.com/dnbexperience/eufemia/blob/main/packages/dnb-design-system-portal/src/docs/web/contribute/deploy/tokens.mdx#L47, checked 2026-11-12.
- The extractor writes "W3C Design Token (DTCG) JSON files – the same format the Figma UI produces with 'Export Modes'". Source: https://github.com/dnbexperience/eufemia/blob/main/packages/dnb-eufemia/scripts/figma/tasks/tokensExtractor.ts#L1-L8, checked 2026-11-12.
- The token review lists changed resolved values and contrast pairs; "The sync workflow publishes the report in its job summary and PR comment". Source: https://github.com/dnbexperience/eufemia/blob/main/packages/dnb-eufemia/scripts/figma/TOKEN_REVIEW.md#L1-L20, checked 2026-11-12.
- The release workflow uses semantic-release; npm `latest` of `@dnb/eufemia` is 11.17.1. Source: https://github.com/dnbexperience/eufemia/blob/main/.github/workflows/release.yml#L12-L23 and https://registry.npmjs.org/@dnb/eufemia, checked 2026-11-12.

### CFPB
- "we are also centralizing our source of truth by exporting the tokens directly from our Figma library"; the example token has `com.figma.variableId`, `com.figma.scopes` and `com.figma.isOverride`. Source: https://github.com/cfpb/design-system/blob/main/docs/pages/design-tokens.md#L33-L66, checked 2026-11-12.
- CONTRIBUTING: tokens "are exported from Figma and then saved to the tokens directory"; a token can also be edited by hand; then a feature branch, a commit and a pull request. Source: https://github.com/cfpb/design-system/blob/main/CONTRIBUTING.md#L173-L195, checked 2026-11-12.
- A release is `yarn release` run by a person, who picks major, minor or patch; `@cfpb/cfpb-design-system` is at 5.10.3. Source: https://github.com/cfpb/design-system/blob/main/CONTRIBUTING.md#L91-L122, checked 2026-11-12.
- Pull request #2485 says "Our token JSON is DTCG‑style and sometimes stores aliases only in com.figma.aliasData", and adds a Style Dictionary transform for it. Source: https://github.com/cfpb/design-system/pull/2485, checked 2026-11-12.

### Systems that author tokens in code
- Carbon: "After investigation, we are going with **Code → Figma** as the sync direction, making src/dtcg/ the source of truth for @carbon/themes tokens", with token changes reviewed in pull requests. Source: https://github.com/carbon-design-system/carbon/issues/23250, checked 2026-11-12.
- Digdir: the Figma plugin "Imports a Designsystemet config ... into a Figma file as variable collections"; the UI kit and the plugin have "the same version as the code packages" through changesets, and a workflow notes that "Changes made in the Figma UI kit aren't in git". Source: https://github.com/digdir/designsystemet/blob/main/figma/plugin/README.md#L1-L3, https://github.com/digdir/designsystemet/blob/main/figma/README.md#L8-L10 and https://github.com/digdir/designsystemet/blob/main/.github/workflows/check-changeset-figma.yml#L1-L3, checked 2026-11-12.
- Red Hat: the "Figma" workflow takes a Figma file ID, a Figma API token and a Style Dictionary URL by hand and runs `brianferry/figma-create`. Source: https://github.com/RedHat-UX/red-hat-design-tokens/blob/main/.github/workflows/figma.yml#L1-L32, checked 2026-11-12.
- Telefónica Mística: "We use Figma API to update variables in our libraries", and the repository holds an agent skill `update-tokens` that edits the token JSON files. Source: https://github.com/Telefonica/mistica-design/blob/production/README.md and https://github.com/Telefonica/mistica-design/blob/production/.github/skills/update-tokens/SKILL.md#L1-L41, checked 2026-11-12.

### The Professional plan
- The Variables REST API endpoints are for Enterprise only. Source: docs/research/RES-024-figma-plans-and-prices.md:204-205, checked 2026-11-12.
- On this team's Professional plan, `GET variables/local` answered 403, while `GET file meta` and `GET file versions` answered 200. Source: docs/research/RES-028-figma-live-reads.md:61-63, checked 2026-11-12.
- "Export modes" is a right-click command with no documented other trigger, and plugins cannot run in the background. Source: docs/research/RES-026-figma-token-export-routes.md:87 and :126, checked 2026-11-12.
- File webhooks are available on Professional (150 in total), and `LIBRARY_PUBLISH` lists variable keys and names without values. Source: docs/research/RES-026-figma-token-export-routes.md:143-145, checked 2026-11-12.
- The export saves a ZIP named after the collection with one file for each mode, and the files hold no collection name. Source: docs/research/RES-028-figma-live-reads.md:80-94, checked 2026-11-12.

## Follow-ups
- Does "Export modes" write `com.figma.isOverride`, and `com.figma.aliasData` for an alias to another collection, on the Professional plan? Welcome UI and CFPB files carry `isOverride`, and CFPB reports aliases held only in `aliasData`; the trial of RES-028 saw neither.

## Next action
None.
