---
id: RES-026
status: resolved # in-progress | resolved
outcome: answered
kind: research
from: IDEA-002#08
date: 2026-11-12
---
# RES-026: Routes that export tokens from Figma to a repo

## Question
Which routes export design tokens from Figma to a repo, and how does each handle change flow and versions?

## Answer
Sufficient-answer condition, set for IDEA-002#09, IDEA-002#10 and IDEA-002#11:

- Each route by which variables can leave Figma, with the plan it needs: the native JSON export of modes; the Plugin API through a custom plugin or through a `use_figma` read script of the Figma MCP; the Variables REST API; plugins such as Tokens Studio (free and paid tiers, prices, sync targets such as GitHub); any official Figma export to the W3C design tokens format; any official GitHub integration.
- For each route: the output format, whether it runs unattended in a CI job or needs a person or an agent in the Figma app or a browser, and its limits.
- The state of the W3C Design Tokens Community Group format today: version, status, and which tools read it.
- Tools that transform token files into CSS custom properties and TypeScript: Style Dictionary (current version, support for the W3C format) and newer alternatives, each with maintenance state and license.
- How changes reach a repo in each route (manual export, CI job, or a pull request opened by a tool), and how each route versions tokens.
- Both sides of each disagreement between sources.

The record gives facts, sources and disagreements only. It gives no recommendation. RES-023 and RES-024 settle the Figma MCP tools, plans, seats and prices; this record does not repeat them.

The condition is met. All sources were read on 2026-11-12: vendor documentation, official repositories, npm and the community group's own pages. No Figma call was made, and the Figma access token was not used. The skill brain:source-driven-development was loaded. The tools that answered were Firecrawl scrape and search, `curl` to the GitHub API, the npm registry, the Figma help center API and the community group's site, and reads of the installed Figma plugin files. Each statement below has a line under Findings, except the lines that name RES-023 or RES-024 and the lines marked UNVERIFIED.

### Routes out of Figma

| Route | Plan | Output | Who or what runs it | How a change reaches the repo |
| --- | --- | --- | --- | --- |
| 1. Native "Export mode" and "Export modes" | Professional, Education, Organization, Government, Enterprise | A JSON file. The import side requires DTCG 2025.10; the export side names only "a JSON file". | A person in the Variables view of Figma Design. No API or trigger is documented. | A person saves the file; the commit happens outside Figma. |
| 2a. A custom plugin on the Plugin API | Every plan can build and run a plugin in development (RES-024). Private publication needs Organization or Enterprise (RES-024). | Any format the plugin code writes. The API gives `valuesByMode` (aliases not resolved), `codeSyntax`, `scopes`, `description`. | A person starts it in an open file. "It's not possible to build plugins that run in the background." | The plugin can call a web API that answers with CORS `*`, or save a file. |
| 2b. A `use_figma` read script through the remote Figma MCP | The plans that RES-023 lists for `use_figma` | The JSON value that the script returns; at most 20 KB for each call (RES-023) | An agent, after a person's browser sign-in (RES-023) | The agent writes and commits the files. |
| 3. Variables REST API | Enterprise only (RES-024) | Figma's own JSON (`meta.variables`, `meta.variableCollections`), not DTCG | A CI job with a personal access token, unattended | Figma's example GitHub Actions workflow opens a pull request. |
| 4. Tokens Studio plugin | Plugin free; Team €39 a month for each editor, billed annually; Organization €499 a month | Tokens Studio "legacy" JSON (default) or "W3C DTCG" JSON; one file, or a folder of files on the paid plan | A person runs "Import Variables", then "Push" | The plugin commits; the person completes a pull request in the browser. |
| 5. Other Community plugins, such as "Design Tokens" by Lukas Oppermann | The plans that run plugins (RES-024) | That plugin: its "Standard" format, based on a DTCG draft; variables export is BETA | A person in the plugin | A `repository_dispatch` call starts a GitHub Actions workflow, or a direct commit. |

Without Enterprise, the REST API gives variables only as `VariableAlias` IDs on nodes, and Terrazzo's `tz import` reads Styles only. No source read describes an unattended route to variable values on the Professional plan.

Figma has no official integration that syncs variables to GitHub. The Figma GitHub app serves code layers, Figma Make and Code Connect UI. Figma's official repository `figma/variables-github-action-example` is an example that needs Enterprise.

### Change flow and versions

- Figma side: paid plans keep the full version history. A person can name a version, and each library publish makes a version. Branching needs Organization or higher.
- Figma can notify a server. `FILE_VERSION_UPDATE` fires on a named version. `LIBRARY_PUBLISH` lists the keys and names of created, changed and deleted variables, without values. The Professional plan allows 150 file webhooks.
- Route 1: each export is a manual step. The repo keeps versions through Git commits of the exported files.
- Route 3, Figma's example: a person starts the workflow by hand with a file key. The workflow writes one tokens file for each collection and mode, and opens a pull request on branch `update-tokens`. It does not delete files of removed collections or modes.
- Route 4: each push is a commit with a message. Branches from the plugin need the Team plan, and each branch can use a different token format.
- Route 5, "Design Tokens": a POST starts a GitHub Actions workflow or makes a commit.
- No source read describes a route that gives tokens a semantic version number. Each route ends in a file or a Git commit.

### The DTCG format today

- The newest stable version is 2025.10, published on 2025-10-28. Its status is "Final Community Group Report" and "Stable". It is not a W3C Standard.
- 2025.10 has a Format Module, a Color Module and a Resolver Module. The recommended file extensions are `.tokens` and `.tokens.json`.
- Tools that read it:
  - Figma import reads a subset of types, with units `px` and `s` only.
  - The Tokens Studio plugin has a DTCG option and says that more DTCG types will come.
  - Style Dictionary has DTCG support since version 4 and partial support for 2025.10.
  - Terrazzo's changelog claims full 2025.10 support, resolvers included.
  - The community group lists more than 20 adopters, Figma, Penpot, Sketch and Supernova among them.

### Tools that write CSS custom properties and TypeScript

| Tool | Version and date | License | DTCG 2025.10 | CSS custom properties | TypeScript | Reads Figma directly |
| --- | --- | --- | --- | --- | --- | --- |
| Style Dictionary | 5.8.0, 2026-11-03 | Apache-2.0 | Partial; issue 1590 open | `css/variables` | `typescript/es6-declarations`, `typescript/module-declarations` | No |
| Terrazzo | 2.10.0, 2026-10-21 | MIT | Full, with resolvers, by its own changelog | `@terrazzo/plugin-css`, modes as selectors or media queries | `@terrazzo/plugin-js` writes `.d.ts` beside a resolver API for server use | `tz import` through the REST API; variables need Enterprise |
| `@tokens-studio/sd-transforms` | 2.0.3, 2025-12-10 | MIT | Converts Tokens Studio types to DTCG types for Style Dictionary | Through Style Dictionary | Through Style Dictionary | No |

All three repositories are active and not archived.

### Unknown

- UNVERIFIED: the exact shape of the file that "Export modes" writes, such as which DTCG types, the alias syntax, the `com.figma` extensions, and one file for each mode or for each collection. Figma's procedure for extended collections imports an exported file again, and that import requires DTCG. No Figma page states the export format.
- UNVERIFIED: whether an agent can use the remote Figma MCP server from a CI job without a person's browser sign-in. No Figma page names another sign-in.
- UNVERIFIED: whether the free Tokens Studio plugin still syncs with GitHub. The pricing page and the sync guide disagree.
- Not researched: platforms that pull tokens from Figma, such as Supernova, Specify, zeroheight and Knapsack.
- Seven disagreements between sources are under Findings, in "Disagreements between sources".

## Findings

### Route 1: the native JSON export and import of modes in Figma Design

- The "Modes for variables" article lists Professional, Education, Organization, Government and Enterprise plans under "Who can use this feature"; the article was last edited on 2026-10-30. Source: https://help.figma.com/api/v2/help_center/en-us/articles/15343816063383.json, checked 2026-11-12.
- "You can export variable modes to a JSON file": in the Variables view, a person right-clicks one mode and chooses "Export mode", or right-clicks a collection and chooses "Export modes"; the article names no other trigger. Source: https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables#h_01KAH0DGH825NZDAV9DBPT3HMX, checked 2026-11-12.
- The export section does not name the format of the exported JSON file; the import section says imported tokens "must be in a JSON file and follow the Design Tokens Community Group (DTCG) format" and links the 2025.10 version of the format. Source: https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables#h_01KAGYPSFC984XDB4YWBCNRZJ7, checked 2026-11-12.
- Import supports the DTCG types color (sRGB and HSL color spaces), dimension (unit `px` only), fontFamily (a single font name, no array), duration (unit `s` only) and number (a boolean with the `com.figma.type: "boolean"` extension), plus a `string` type that "is not an officially defined DTCG token type". Source: https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables#h_01KAGYPSFC984XDB4YWBCNRZJ7, checked 2026-11-12.
- Figma extension keys in `$extensions` start with `com.figma`; `com.figma.aliasData` (with `targetVariableID`, `targetVariableSetID`, `targetVariableSetName`, `targetVariableName`) makes an alias to a variable in another collection on import. Source: https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables#h_01KAGYPSFC984XDB4YWBCNRZJ7, checked 2026-11-12.
- On import, Figma turns nested group names into slash names (`color.accent.light` becomes `color/accent/light`), and keeps only the first of two tokens with the same normalized name. Source: https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables#h_01KAGYPSFC984XDB4YWBCNRZJ7, checked 2026-11-12.
- Import into a new collection makes one mode for each imported file and creates variables only for tokens that are in all imported files with the same supported `$type`; "Import mode" on an existing mode updates the variables whose names and types match. Source: https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables#h_01KAGYPSFC984XDB4YWBCNRZJ7, checked 2026-11-12.
- Figma's Schema 2025 post (2025-10-28) says Figma held off on native import and export, and released an open-source import/export plugin instead, until the Design Tokens Community Group finished its 1.0 release; "The community group spec is now officially at 1.0, along with native import and export support in Figma", and "Variables import and export will be available in November". Source: https://www.figma.com/blog/schema-2025-design-systems-recap/#importing-and-exporting-variables, checked 2026-11-12.
- The help center article "What's new from Schema 2025", which the post links for details, returns HTTP 404. Source: https://help.figma.com/hc/en-us/articles/35794667554839-What-s-new-from-Schema-2025, checked 2026-11-12.
- Figma's release notes page shows its 60 newest entries, and none of them names variable import or export. Source: https://www.figma.com/release-notes/, checked 2026-11-12.
- Figma's article "Extend a variable collection" (Education K-12, Government and Enterprise plans) tells a person to "Export mode" for each brand mode ("The variables will be exported to a JSON file"), and later to "Import mode" with "the corresponding JSON file"; the import section of "Modes for variables" requires the DTCG format. Source: https://help.figma.com/hc/en-us/articles/36346281624471-Extend-a-variable-collection, checked 2026-11-12.
- A search of Figma's help center articles for "export modes", "export variables JSON" and "DTCG" finds only these two articles, and neither states the format of the exported file. Source: https://help.figma.com/api/v2/help_center/articles/search.json?query=DTCG&locale=en-us, checked 2026-11-12.

### Versions and review inside Figma

- Figma records a checkpoint every 30 minutes; people with edit access can create and name versions; Figma also creates a version "any time you published changes to a library"; drafts and the Starter plan show only 30 days of version history, and paid plans show the full history. Source: https://help.figma.com/hc/en-us/articles/360038006754-View-a-file-s-version-history, checked 2026-11-12.
- Branching (create, share, update, request review, merge) is for Education (K-12), Organization, Government and Enterprise plans. Source: https://help.figma.com/hc/en-us/articles/360063144053-Guide-to-branching, checked 2026-11-12.

### Figma's own GitHub integration

- The Figma GitHub app (Starter to Enterprise, admins only) enables three things: cloning repositories in code layers and Figma Make, Figma Make's push to GitHub, and Code Connect UI; the article names no variable or token sync, and GitHub Enterprise Server is not supported. Source: https://help.figma.com/hc/en-us/articles/37516294384919, checked 2026-11-12.

### Disagreements between sources

- Release date of native import and export: Figma's Schema post said "Variables import and export will be available in November" 2025; on 2025-12-04 a Figma Community Support reply in the Figma forum said the feature was "still being rolled out". Source: https://www.figma.com/blog/schema-2025-design-systems-recap/#importing-and-exporting-variables and https://forum.figma.com/ask-the-community-7/native-variable-export-feature-47831, checked 2026-11-12.
- Format of the native export: the Schema post ties native import and export to DTCG 1.0, and Figma's extended-collection procedure re-imports an exported file through an import that requires DTCG; the "Export modes" section itself names only "a JSON file". Source: https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables#h_01KAH0DGH825NZDAV9DBPT3HMX, checked 2026-11-12.
- DTCG version of Figma's own examples: the import article links the 2025.10 format; Figma's sample plugin (last changed 2024-02-21) and its GitHub Actions example (last push 2025-03-08) follow earlier drafts, the example "with deviations". Source: https://github.com/figma/variables-github-action-example/blob/main/README.md#prerequisites, checked 2026-11-12.
- Git sync in the free Tokens Studio plugin: the pricing page lists "direct Git-sync" among the paid plugin features of the Team plan; the GitHub sync guide says single-file storage "might work for you if: You are using the free version of Tokens Studio" and marks only folder (multi-file) storage as pro. Source: https://tokens.studio/pricing and https://docs.tokens.studio/token-storage/remote/sync-git-github#plugin-settings-for-github, checked 2026-11-12.
- Style Dictionary and 2025.10: the community group's announcement calls Style Dictionary a reference implementation of 2025.10; Style Dictionary's own page says 2025.10 "does not have full support yet", and issue 1590 is open. Source: https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/ and https://styledictionary.com/info/dtcg/, checked 2026-11-12.
- Terrazzo and 2025.10: Terrazzo's getting-started page says "support for resolvers and other 2025.10 features coming in 2.0!"; its changelog says 2.0.0 (2026-03-17) has "Full support for the DTCG v2025.10 spec, including resolvers", and npm is at 2.10.0. Source: https://terrazzo.app/docs/#comparison and https://github.com/terrazzoapp/terrazzo/blob/main/packages/cli/CHANGELOG.md, checked 2026-11-12.
- Status label of the 2025.10 format: the same document calls itself a "Final Community Group Report" and says it "was published by the DTCG as a Candidate Recommendation"; the technical reports index calls it "Stable". Source: https://www.designtokens.org/TR/2025.10/format/ and https://www.designtokens.org/technical-reports/, checked 2026-11-12.

### Route 2: the Plugin API, through a custom plugin or a `use_figma` read script

- Figma's official sample plugin `figma/plugin-samples/variables-import-export` "imports and exports Variables formatted using the W3C Design Tokens spec"; its known limits are one collection and one mode for each import, and only `color`, `number` and alias tokens. Source: https://github.com/figma/plugin-samples/blob/main/variables-import-export/README.md, checked 2026-11-12.
- The sample's export reads `figma.variables.getLocalVariableCollectionsAsync()` and `figma.variables.getVariableByIdAsync()`, and its menu has the commands "Import Variables" and "Export Variables"; the last change to the sample folder is dated 2024-02-21. Source: https://github.com/figma/plugin-samples/tree/main/variables-import-export, checked 2026-11-12.
- The sample is "distributed strictly for educational purposes" and is "purely a starting point". Source: https://github.com/figma/plugin-samples/blob/main/variables-import-export/README.md, checked 2026-11-12.
- The Plugin API reads variables through `figma.variables`: `getLocalVariableCollectionsAsync`, `getVariableCollectionByIdAsync`, `getLocalVariablesAsync` (optionally filtered by resolved type) and `getVariableByIdAsync`; extended variable collections are "limited to the Enterprise plan". Source: https://developers.figma.com/docs/plugins/working-with-variables/#get-variables, checked 2026-11-12.
- A `Variable` exposes `id`, `name`, `description`, `key`, `variableCollectionId`, `resolvedType`, `valuesByMode`, `scopes`, `codeSyntax` (platforms `WEB`, `ANDROID`, `iOS`), `remote` and `hiddenFromPublishing`; `valuesByMode` "will not resolve any aliases". Source: https://developers.figma.com/docs/plugins/api/Variable/, checked 2026-11-12.
- The Plugin API reaches only content that is in the file or imported into it; file version history, team, location and permissions are readable only through the REST API. Source: https://developers.figma.com/docs/plugins/#plugin-api-access, checked 2026-11-12.
- "Plugins run in files and perform one or more user actions. These user actions are usually short-lived and must be initiated by the user"; "It's not possible to build plugins that run in the background". Source: https://developers.figma.com/docs/plugins/#user-actions, checked 2026-11-12.
- A plugin makes network requests with Figma's Fetch API; plugin iframes have a null origin, so CORS allows only APIs that answer with `Access-Control-Allow-Origin: *`; the manifest's `networkAccess.allowedDomains` limits the domains, and `["*"]` needs a `reasoning` text. Source: https://developers.figma.com/docs/plugins/making-network-requests/, checked 2026-11-12.
- Plugin code runs on the main thread in a sandbox without browser APIs such as `fetch`; an `<iframe>` has the browser APIs but not the document, and the two exchange messages. Source: https://developers.figma.com/docs/plugins/how-plugins-run/, checked 2026-11-12.
- After Figma approves a Community plugin, later updates publish at once without review, every user gets the update, and users cannot go back to an earlier version. Source: https://developers.figma.com/docs/plugins/#plugin-management, checked 2026-11-12.
- A `use_figma` script sends data back only through `return`; the return value "is JSON-serialized automatically", and `console.log()` output is not returned. Source: /Users/peterkloss/.claude/plugins/cache/claude-plugins-official/figma/2.2.157/skills/figma-use/SKILL.md:24-29, checked 2026-11-12.

### Route 3: the REST API and webhooks

- `GET /v1/files/:file_key/variables/local` returns `meta.variables` (each with `id`, `name`, `key`, `variableCollectionId`, `resolvedType` of `BOOLEAN`, `FLOAT`, `STRING` or `COLOR`, `valuesByMode` that can hold a `VariableAlias`, `description`, `hiddenFromPublishing`, `scopes`, `codeSyntax`) and `meta.variableCollections` (each with `modes`, `defaultModeId`, `variableIds`, and extension fields); this is Figma's own JSON shape, not the DTCG format. Source: https://developers.figma.com/docs/rest-api/variables-endpoints/#get-local-variables-endpoint, checked 2026-11-12.
- The same page says `GET /v1/files/:file_key` "now returns a boundVariables property, containing the variableId of the bound variable", and that the variables endpoint is needed for "the full variable or variable collection object". Source: https://developers.figma.com/docs/rest-api/variables-endpoints/#get-local-variables-endpoint, checked 2026-11-12.
- In the file endpoint, a node's `boundVariables` maps each field to a `VariableAlias`, and `explicitVariableModes` maps a collection ID to a mode ID. Source: https://developers.figma.com/docs/rest-api/files/#global-properties, checked 2026-11-12.
- Figma's repository `figma/variables-github-action-example` (MIT license, last push 2025-03-08, not archived) holds GitHub Actions workflows that sync "bi-directional" between Figma variables and token files through the Variables REST API. Source: https://github.com/figma/variables-github-action-example, checked 2026-11-12.
- Its "Sync Figma variables to tokens" workflow needs "a full member of an Enterprise org" and a personal access token with the read-only Variables scope, stored as a repository secret; the reverse workflow also needs an editor seat and the read-and-write Variables scope. Source: https://github.com/figma/variables-github-action-example/blob/main/README.md#prerequisites, checked 2026-11-12.
- The example's token files follow "the draft W3C spec for Design Tokens" with deviations listed in `src/token_types.ts`, one tokens file "per variable collection and mode". Source: https://github.com/figma/variables-github-action-example/blob/main/README.md#prerequisites, checked 2026-11-12.
- Both workflows run manually (`workflow_dispatch` with a file key) "for demonstration purposes"; the Figma-to-tokens workflow then opens a pull request with `peter-evans/create-pull-request@v5` on branch `update-tokens`, and opens none when nothing changed. Source: https://github.com/figma/variables-github-action-example/blob/main/.github/workflows/sync-figma-to-tokens.yml, checked 2026-11-12.
- The Figma-to-tokens workflow does not remove a tokens file when its collection or mode is removed in Figma; the tokens-to-Figma workflow does not remove variables or collections and matches them by name. Source: https://github.com/figma/variables-github-action-example/blob/main/README.md#sync-figma-variables-to-tokens, checked 2026-11-12.
- Webhooks attach to a team, a folder or a file; a team admin creates team webhooks, and a person with `Can edit` creates folder or file webhooks; Figma has no interface for webhooks, only the Webhooks API. Source: https://developers.figma.com/docs/rest-api/webhooks/#getting-started, checked 2026-11-12.
- Webhook limits are 20 for each team, 5 for each folder and 3 for each file; file webhooks in total are 150 on Professional, 300 on Organization and 600 on Enterprise. Source: https://developers.figma.com/docs/rest-api/webhooks/#getting-started, checked 2026-11-12.
- Figma retries a failed webhook delivery three times, 5 minutes, 30 minutes and 3 hours after failures. Source: https://developers.figma.com/docs/rest-api/webhooks/#configure-your-server-to-handle-post-requests-with-a-json-payload, checked 2026-11-12.
- `LIBRARY_PUBLISH` fires when a library file is published and lists `created_variables`, `modified_variables` and `deleted_variables` as `LibraryItemData` (the example shows `key` and `name`); one publish can arrive as several events, one for each asset type and more for large publishes. Source: https://developers.figma.com/docs/rest-api/webhooks-events/#library-publish-event, checked 2026-11-12.
- `FILE_VERSION_UPDATE` fires when a person creates a named version in a file's version history and carries `version_id`, `label` and `description`; `FILE_UPDATE` fires "within 30 minutes of editing inactivity in a file". Source: https://developers.figma.com/docs/rest-api/webhooks-events/#file-version-update-event, checked 2026-11-12.

### Route 4: Tokens Studio

- Tokens Studio has three plans: Free (€0; the Studio platform with 1 editor, 1 project, 1 export configuration; "Does not include Pro in Tokens Studio for Figma"), Team (€39 per month billed annually, €39 per month for each extra editor up to 150, "Access to all paid Figma plugin features (direct Git-sync, multi-dimensional theming in Figma, on-canvas documentation, and many more)", 5 projects) and Organization (€499 per month billed annually, 5 editors included, €49 per month for each extra editor). Source: https://tokens.studio/pricing, checked 2026-11-12.
- The pricing page says the former Starter Plus, Pro and Essential plans are folded into Team, including "all paid features of the Figma plugin"; viewers are unlimited and do not count as paid seats; the Studio platform has a 14-day free trial. Source: https://tokens.studio/pricing, checked 2026-11-12.
- The plugin's sync providers are Git providers (GitHub, GitLab, Bitbucket and Azure DevOps each have a setup guide), cloud storage (JSONBin, Supernova, the Tokens Studio platform) and locally hosted storage; by default the plugin stores tokens in the Figma file. Source: https://docs.tokens.studio/token-storage/remote/, checked 2026-11-12.
- The GitHub sync is two-way: the plugin pushes token JSON files to a repository and pulls them into any Figma file; it needs a GitHub personal access token with `repo` scope (classic) or Contents read and write (fine-grained), a branch, and a file or folder path; the repository must not be empty. Source: https://docs.tokens.studio/token-storage/remote/sync-git-github, checked 2026-11-12.
- Storage in a folder of several JSON files (one file for each token set, plus a `themes` file) "is a pro feature", and tokens are read-only for team members without a Team plan; a single JSON file "might work for you if: You are using the free version of Tokens Studio". Source: https://docs.tokens.studio/token-storage/remote/sync-git-github#plugin-settings-for-github, checked 2026-11-12.
- A push needs a commit message and makes a commit; afterwards the plugin may offer "Create a Pull Request", which opens a web browser at the Git provider where the person completes the pull request. Source: https://docs.tokens.studio/token-storage/remote-push-pull-changes#push-changes, checked 2026-11-12.
- Creating and switching Git branches from inside the plugin is for Team plan subscribers. Source: https://docs.tokens.studio/token-storage/remote/#sync-providers, checked 2026-11-12.
- "Import Variables" creates one token for each Figma variable and one token set for each mode; slash groups become dot groups; with a Team plan it also makes a theme group for each collection and a theme for each mode; a person repeats the import to take later changes, and names connect variables to tokens. Source: https://docs.tokens.studio/figma/import/variables/, checked 2026-11-12.
- Known limits of "Import Variables": Figma's 4 variable types map to Tokens Studio's 24 token types only by the import options, so token types can need manual edits; styles backed by variables do not keep their references; open issue 3287 says an import of changes creates new token sets and themes instead of updating them. Source: https://docs.tokens.studio/figma/import/variables/#known-limitations, checked 2026-11-12.
- The plugin writes either its "legacy" format (the default) or the "W3C DTCG" format, with `$value`, `$type` and `$description`; "The DTCG specifies additional token types ... which we will support in future releases"; different Git branches can use different formats. Source: https://docs.tokens.studio/manage-settings/token-format, checked 2026-11-12.
- The Tokens Studio plugin repository `tokens-studio/figma-plugin` has the MIT license and released 2.13.3 on 2026-11-12; its transform package `tokens-studio/sd-transforms` (MIT) released v2.0.3 on 2025-12-10. Source: https://github.com/tokens-studio/figma-plugin/releases, checked 2026-11-12.

### Route 5: other Community plugins

- The "Design Tokens" plugin by Lukas Oppermann (repository `lukasoppermann/design-tokens`, MIT, not archived, last push 2026-02-16, newest release v6.9.0 on 2023-09-25) exports variables "to generic design tokens" as a BETA feature, only in its "Standard" format, which is "based on the current spec draft" of the community group. Source: https://github.com/lukasoppermann/design-tokens/blob/main/README.md#variables-beta, checked 2026-11-12.
- That plugin's "Send Design Tokens to Url" sends a `POST` to a server URL; for GitHub it calls `https://api.github.com/repos/:username/:repo/dispatches` to start a GitHub Actions workflow, or commits files directly with the `github_commit` auth type; the server must answer with `Access-Control-Allow-Origin: *`. Source: https://github.com/lukasoppermann/design-tokens/blob/main/README.md#push-to-server, checked 2026-11-12.
- Figma Community search results show more plugins that describe a DTCG export of variables, such as "tokenhaus - Variable Import/Export with Links" ("Export variables to DTCG") and "Design Token Exporter" ("exports your tokens to JSON following the ... (DTCG)"). Source: https://www.figma.com/community/plugin/1578065513743190845/tokenhaus-variable-import-export-with-links, checked 2026-11-12.

### The Design Tokens Community Group format

- The Design Tokens Community Group lists one stable report, 2025.10, published 2025-10-28, and three earlier editors' drafts (2021-09-23, 2022-06-14, 2025-07-21). Source: https://www.designtokens.org/technical-reports/, checked 2026-11-12.
- The 2025.10 Format Module is a "Final Community Group Report"; it "is not a W3C Standard nor is it on the W3C Standards Track", was "published by the DTCG as a Candidate Recommendation", and "is considered stable", with updates to come "in superseding specifications". Source: https://www.designtokens.org/TR/2025.10/format/, checked 2026-11-12.
- The Format Module recommends the file extensions `.tokens` and `.tokens.json` and the media type `application/design-tokens+json`; it defines the types color, dimension, fontFamily, fontWeight, duration, cubicBezier and number, and the composite types strokeStyle, border, transition, shadow, gradient and typography. Source: https://www.designtokens.org/TR/2025.10/format/, checked 2026-11-12.
- 2025.10 has a separate Color Module and Resolver Module; Figma's import article links the color, dimension, fontFamily, duration and number types of the 2025.10 format. Source: https://www.designtokens.org/TR/2025.10/, checked 2026-11-12.
- The community group's announcement of 2025.10 names theming and multi-brand support, CSS Color Module 4 color spaces, and aliases as new; it names Style Dictionary, Tokens Studio and Terrazzo as "reference implementations" and names Penpot, Figma, Sketch, Framer, Knapsack, Supernova and zeroheight among tools that "already support or are implementing the standard". Source: https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/, checked 2026-11-12.
- The community group's home page lists as adopters and participants Abstract, Adobe, Project Wallace, Design Token Validator (Anima), Design Tokens Language Server, Figma, Framer, Knapsack, Marvel, Penpot, Pinwheel, Sketch, Style Dictionary, Superposition, Supernova, Terrazzo, Toolabs, TokensBrücke, Tokens Studio, Universal Design Tokens, Zeplin, zeroheight and Engramma. Source: https://www.designtokens.org/, checked 2026-11-12.

### Tools that turn token files into CSS custom properties and TypeScript

- Style Dictionary is at version 5.8.0 (npm, 2026-11-03), under the Apache-2.0 license, in the repository `style-dictionary/style-dictionary`, which is not archived and had releases 5.7.0, 5.7.1 and 5.8.0 in October and November 2026. Source: https://github.com/style-dictionary/style-dictionary/releases, checked 2026-11-12.
- "As of version 4, Style Dictionary has first-class support for the DTCG format", but "the latest format 2025.10 does not have full support yet in Style Dictionary" and the work is in progress in v5. Source: https://styledictionary.com/info/dtcg/, checked 2026-11-12.
- Issue 1590 "Support for DTCG v2025.10" is open (last updated 2026-10-12); its checklist marks color, border, shadow and dimension done, gradient and duration in progress, and the resolver module not marked done. Source: https://github.com/style-dictionary/style-dictionary/issues/1590, checked 2026-11-12.
- Style Dictionary 5.7.0 (2026-10-16) added support for DTCG 2025.10 `duration` token values. Source: https://github.com/style-dictionary/style-dictionary/releases/tag/v5.7.0, checked 2026-11-12.
- Style Dictionary 5.5.5 and 5.7.1 fixed two prototype pollution advisories (GHSA-cr3w-v879-f973 and GHSA-m4pr-rgwp-x36r) in the `convertTokenData` utility. Source: https://github.com/style-dictionary/style-dictionary/releases, checked 2026-11-12.
- Style Dictionary's predefined formats include `css/variables` (a CSS file of variable definitions, with an `outputReferences` option), `javascript/es6`, `javascript/esm`, `typescript/es6-declarations` and `typescript/module-declarations`, among 44 formats. Source: https://styledictionary.com/reference/hooks/formats/predefined/, checked 2026-11-12.
- Terrazzo (`@terrazzo/cli` 2.10.0 on npm, 2026-10-21, MIT license, repository `terrazzoapp/terrazzo` not archived) "takes DTCG design token JSON and generates code" for CSS, Sass, JS/TS and more, and can run "as part of your CI process". Source: https://terrazzo.app/docs/, checked 2026-11-12.
- Terrazzo 2.0.0 (npm, 2026-03-17) lists "Full support for the DTCG v2025.10 spec, including resolvers" and "New and improved native Figma import". Source: https://github.com/terrazzoapp/terrazzo/blob/main/packages/cli/CHANGELOG.md, checked 2026-11-12.
- Terrazzo's CSS plugin outputs CSS variables named after token IDs and maps resolver contexts (such as light and dark modes) to CSS selectors or media queries; its JS plugin generates a resolver API "better-suited for server-side rendering" and always writes `.d.ts` files beside the `.js` files. Source: https://terrazzo.app/docs/integrations/css, checked 2026-11-12.
- Terrazzo's `tz import` reads a Figma file through the REST API with a personal access token or OAuth token; Variables need the `file_variables:read` scope and "An Enterprise plan" ("with free accounts, only Styles are importable"); it writes a `*.resolver.json` file that the guide says to check into Git, and it pulls the published library version unless `--unpublished` is set. Source: https://terrazzo.app/docs/guides/import-from-figma, checked 2026-11-12.

## Follow-ups
- What exact file does "Export modes" write for a collection with light and dark modes: which DTCG types, which alias syntax, which `com.figma` extensions, and one file for each mode or for each collection? A person's trial export in the Professional plan settles it.
- Can an agent use the remote Figma MCP server from a CI job without a person's browser sign-in?
- Does the free Tokens Studio plugin still sync with GitHub after Tokens Studio folded its plans into Team?
- RES-023 marks the general availability of the MCP read server as UNVERIFIED. Figma's Schema 2025 post (2025-10-28) says the Figma MCP server "is out of beta and generally available" (https://www.figma.com/blog/schema-2025-design-systems-recap/#figma-mcp-server). Does RES-023 need that line?

## Next action
None.
