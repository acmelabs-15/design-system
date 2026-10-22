# Workflow rule dispositions

The approved workflow replaces the old pass instructions. This file closes task 2's rule audit and supplies task 9's ownership map.

Status: finalized migration evidence. Activation: none. The current entry points stay active until the coordinated cutover. This file neither grants permission nor changes the product.

Audit date: 2026-10-21. The input audit cites the source state read at `0a379170fe91a35a0786811d8cff48b9655de5f3`, with then-present approved specification, plan and status edits. Finalization reads the approved specification and plan at `2ca045ffe9e6d765551442af75f8ba0e5c795569`. Decision destinations come from decision-audit.json. The coordinator owns the ledger, status and cutover.

## Evidence and interpretation

Paths without a prefix are relative to this repository. These aliases identify the inspected external files:

| Alias | Root |
|---|---|
| B | `/Users/peterkloss/.codex/plugins/cache/acmelabs/brain/0.6.0` |
| A | `/Users/peterkloss/.codex/plugins/cache/agent-skills/agent-skills/0.6.13` |
| CLI | `/Users/peterkloss/Dev/ACMElabs/cli` |
| DND | `/Users/peterkloss/Dev/dnd-modules` |

The audit reads the full approved specification and plan, root AGENTS, PLAN section 1, pass README, consumer README, both glossaries, the two named workflow decisions, all five local skills and every Markdown reference within those skills. It also reads both reference repositories' AGENTS, CLAUDE and all three docs/agents files. Installed brain source reads cover using-brain, writing-for-agents, domain-modeling and ADR format, ask-user-question and both host contracts, incremental-implementation, planning-and-task-breakdown, spec-driven-development, source-driven-development, API design, migration, and setup-brain with its local-tracker templates. Setup is inspected as source; it is not invoked.

Agent-skills' using-agent-skills is read in full. Full-file diffs compare its API, migration and incremental skills with the brain copies. Migration is byte-identical; API differs only in an unrelated throw example. Incremental differs materially in focused checks, glossary routing and task-end review. No browser or cold-session behavior is certified by this document audit.

The core package manifest has a large generated export map. Only its parsed public metadata and dependency roles are relevant here. The report does not claim a full semantic review of every generated icon export.

| Evidence key | Applicable installed guidance |
|---|---|
| B-route | B/skills/using-brain/SKILL.md:18–87, 223–236: lifecycle, vocabulary, host-specific entry points |
| B-write | B/skills/writing-for-agents/SKILL.md:10–52, 76–81: strong pointers, complete bounds, one owner, environment facts |
| B-question | B/skills/ask-user-question/SKILL.md:23–46, 72–132: inspect first, one user choice, permitted surface, no inferred answer |
| B-domain | B/skills/domain-modeling/SKILL.md:10–74; ADR-FORMAT.md:1–45: context routing, glossary only, sparse numbered decisions |
| B-plan | B/skills/planning-and-task-breakdown/SKILL.md:80–88, 139–153, 173–194: expand/migrate/contract, approval, preserve incomplete plans |
| B-slice | B/skills/incremental-implementation/SKILL.md:36–46, 205–217, 246–255: focused checks per slice; full suite and review at closure |
| B-spec | B/skills/spec-driven-development/SKILL.md:22–109, 234–255: approved requirements, test seams, keep current specification alive |
| B-api | B/skills/api-and-interface-design/SKILL.md:22–35, 125–144, 352–360: public consumers and compatible evolution |
| B-migrate | B/skills/deprecation-and-migration/SKILL.md:37–56, 69–118, 231–239: measure consumers, prove replacement, remove after migration |
| B-source | B/skills/source-driven-development/SKILL.md:8–25, 40–97, 176–216: exact versions, relevant official sources, explicit verification limits |
| A-route | A/skills/using-agent-skills/SKILL.md:43–73: older assumption wording permits proceeding after a correction invitation; brain's answer rule takes precedence |
| Reference continuity | CLI/AGENTS.md:7–30 and DND/AGENTS.md:7–30: explicit startup and status rewriting, supplied by repository instructions |

Target owners below identify the one place that will carry each retained meaning. They are allocation destinations, not activated instructions. Decision paths use the exact stable identifiers from decision-audit.json; numbering does not imply chronology. A retired process has no new active owner; its cited source in Git retains its history. References to old paths in this evidence file identify source material, not active startup targets.

Completed systematization replacements remain final in the current product interfaces. Retired interfaces gain no compatibility aliases, deprecated exports, fallback implementations or legacy modes through this workflow migration. Their selected replacements, rationale and verification stay recorded. Only the blanket future permission and dated no-consumers premise retire. Publication alone does not establish actual usage or select a permanent compatibility policy. Future API changes follow their separately approved scope and applicable brain workflow.

Global user preferences remain untouched. Retiring a duplicate repository procedure changes only that repository copy. It neither weakens the global preference nor transfers another repository's commit or publication grant.

### Root rules and source ownership

| ID | Source | Disposition | Rule, reason and reconciliation | Sole target owner |
|---|---|---|---|---|
| R01 | AGENTS.md:3–5 | Rewrite | Keep product identity. Replace completed-pass status with a pointer to the current handoff. B-write separates stable identity from mutable status. | AGENTS.md |
| R02 | AGENTS.md:9–15 | Retire | Mandatory pass README, PLAN and every decision/analysis file conflict with selective startup. The selected file must still be read completely. | Git history |
| R03 | AGENTS.md:17 | Retire | The completed systematization delegation cannot govern the new workflow or future work. | Git history |
| R04 | AGENTS.md:21 | Retain | Use component names directly. Compatible domain language, with no competing origin category. | docs/agents/domain.md |
| R05 | AGENTS.md:23 | Retire | Retire only the duplicate repository procedure. Peter's global best-path preference remains unchanged; B-question/B-source supply the compatible workflow. Product-specific reasons stay in their decisions. | Existing global user preferences (unchanged) |
| R06 | AGENTS.md:24 | Rewrite | Inspect code and relevant authoritative references before recommendations. Requiring code, community and reference comparisons for every trivial item duplicates and overextends B-source. Preserve selected reference obligations only for applicable component work. | docs/development/reference-sources.md |
| R07 | AGENTS.md:25 | Rewrite | New evidence updates its existing research owner in the same task. Retire the old path and automatic full-research restart. | docs/agents/workflow.md |
| R08 | AGENTS.md:26 | Rewrite | Route user-owned choices to brain:ask-user-question. Let the installed skill own question composition and host contracts. | AGENTS.md |
| R09 | AGENTS.md:27; PLAN.md:184–189; spec/SPEC-maintainer-workflow.md:91–93,126 | Rewrite | Keep completed systematization replacements final in current interfaces, with no retired-API aliases or legacy implementations. Retire the unmeasured no-consumers premise and blanket permission for future changes. Actual usage is unknown; future scope is separately decided. | docs/development/components.md |
| R10 | AGENTS.md:28 | Rewrite | Explain material Lit/platform trade-offs when needed. The dated “first Lit project” claim is not a permanent product fact. | docs/agents/domain.md |
| R11 | AGENTS.md:32 | Rewrite | Update the fact's one current owner when it changes. B-write rejects duplicating the same fact across every plan and note. | docs/agents/workflow.md |
| R12 | AGENTS.md:33, decision format | Rewrite | Use numbered decision records and retain original approval dates and qualifications. B-domain allows short records with optional useful sections. | docs/agents/domain.md |
| R13 | AGENTS.md:33, website ownership | Retain | site/ is authored; _site/ is generated. This is an implementation fact, not an old workflow exception. | docs/agents/repository.md |
| R14 | AGENTS.md:34 | Retire | The old pass directory is not an active work destination. | Git history |
| R15 | AGENTS.md:35 | Rewrite | The handoff test survives with docs/STATUS.md as sole current owner and selective indexes. | AGENTS.md |
| R16 | AGENTS.md:37–49 | Retire | Delete the five local implementations and routing table. Brain owns lifecycle routing and the corresponding disciplines. | Installed brain:using-brain |
| R17 | AGENTS.md:53–55 | Rewrite | Author CSS in the recorded producer inputs, including styles/, maps and committed specs. Fix the producer that owns the defect. “Fix every defect in tools/geist” is too narrow for the current pipeline. | docs/development/styles.md |
| R18 | AGENTS.md:56 | Retain | No Geist names in src code, comments or JSDoc. B-source citations remain possible in research and decision records; this does not ban Lit or standards citations. | docs/development/components.md |
| R19 | AGENTS.md:57 | Rewrite | Preserve approved package responsibilities. Manifests and lockfile own current versions. An actual stack gap uses B-source and the question workflow. | docs/development/stack.md |
| R20 | AGENTS.md:58 | Retain | Wrapper boxes remain real. The historical display:contents exception below is not revived. | docs/development/components.md |
| R21 | AGENTS.md:59 | Retain | Bun runtime; colocated <file>.test.ts using bun:test. Generic npm/pytest examples in B-slice are examples, not a stack mandate. | docs/agents/verification.md |
| R22 | AGENTS.md:61–85 | Rewrite | Preserve the producer map with the additional README rows below. Store one maintained map, reached before editing generated areas. | docs/agents/repository.md |
| R23 | AGENTS.md:88 | Retain | Pages consumes verified _site/ output; generated website files are not tracked. | docs/agents/repository.md |
| R24 | AGENTS.md:90 | Rewrite | Preserve authored/generated distinctions. Replace notes/ and local-skill authorship with new docs/spec/tasks ownership. | docs/agents/repository.md |
| R25 | AGENTS.md:92 | Retire | CLAUDE is currently a verified relative symlink. Replace it with the approved real import file at cutover. | CLAUDE.md |
| R26 | AGENTS.md:94 | Rewrite | Preserve dependency order; docs requires dist. B-slice chooses check scope. The full repository gate includes more than this historical short command. | docs/agents/verification.md |
| R27 | AGENTS.md:96 | Retain | packages/core/package.json owns public metadata; root package.json owns private build tooling. Use scripts/core-package.ts and the shared runtime. | docs/agents/repository.md |
| R28 | AGENTS.md:98 | Retain | Browser manifest/links are distinct; core excludes browser delivery; both use one build. Preserve the 60,000-entry archive budget. | docs/agents/repository.md |
| R29 | AGENTS.md:100 | Retain | Mapped producer, split, stale-input rejection, generated entry/export refresh and production-only packing retain their owners. | docs/agents/repository.md |

### PLAN section 1 and old pass rules

| ID | Source | Disposition | Rule, reason and reconciliation | Sole target owner |
|---|---|---|---|---|
| P01 | PLAN.md:3–18 | Retire | Closed port, old phase state and delegation are history. Current approved workflow has its own spec and plan. | docs/history/parity-port-plan.md |
| P02 | PLAN.md:24–26 | Rewrite | Keep library identity/Bun/Pages; remove stale path casing and 0.2.0/0.3.0 publication state. Current manifest is 0.3.2. | docs/agents/repository.md |
| P03 | PLAN.md:28–53 | Rewrite | Preserve self-consistent, idiomatic Lit interfaces and approved source adaptations. Exact port parity is historical, not a universal acceptance rule. | docs/development/components.md |
| P04 | PLAN.md:55–70 | Rewrite | Behavior and working examples need actual outcome checks. The hidden-browser/own-Chrome distinction does not replace Chromium/Firefox/WebKit and named actual-platform limits. | docs/agents/verification.md |
| P05 | PLAN.md:72–79 | Retain | Default fonts, own class names, no Geist identity in src, selected packages. Custom themes retain their approved override contract. | docs/development/components.md |
| P06 | PLAN.md:81–94 | Rewrite | Preserve package responsibility list, but use current manifests and later selected packages rather than the incomplete historic list. | docs/development/stack.md |
| P07 | PLAN.md:98 | Rewrite | Native Lit behavior ports use selected stack; no Zag component machine/store/runtime. Retire completed Phase 5 gate wording. | docs/development/stack.md |
| P08 | PLAN.md:99–102 | Retain | Published match-sorter, Adobe number utility, shared Lit/React behavior, native forms and current lint stack remain selected. | docs/development/stack.md |
| P09 | PLAN.md:104–110 | Rewrite | Preserve selected motion/theme/density/RTL/shape contracts and browser-only scope. Completed phases, pending-adoption language and pass permissions are historical. | spec/README.md |
| P10 | PLAN.md:112 | Retain | Applications own TanStack Table/data processing; TanStack Virtual serves Lit and React virtualization; ELK serves Flow layout. | docs/development/stack.md |
| P11 | PLAN.md:114–121 | Retain | Use the selected capability package; adapt its vanilla interface to Lit where needed. Compatible with B-source's actual-stack discovery. | docs/development/stack.md |
| P12 | PLAN.md:123–125 | Rewrite | A selected dependency is not removed merely because an import scan is empty. Verify its approved role and actual consumers. The claim that the port has not reached it is historical. | docs/development/stack.md |
| P13 | PLAN.md:127–131 | Rewrite | Research a genuine complex stack gap, using maintained authoritative sources and current versions. B-question owns the user choice; no second package-selection interview procedure. | docs/development/stack.md |
| P14 | PLAN.md:133 | Retain | Query/DB data layer remains deferred scope. Do not promote it into an active task or install it during workflow migration. | spec/README.md |
| P15 | PLAN.md:135–137 | Rewrite | Preserve single-source package ownership; include the later browser package. Exact package metadata remains in manifests. | docs/agents/repository.md |
| P16 | PLAN.md:141,149; spec/SPEC-maintainer-workflow.md:89–93 | Rewrite | Preserve the approved product contracts and completed replacement outcomes. Retire the old phase queue and execution delegation as future authority; the current specification and task plan own new work. | spec/README.md |
| P17 | PLAN.md:142 | Retain | TanStack owns canonical state; React wraps the same Lit behavior; application-owned Table/Virtual/Form responsibilities stay explicit. | docs/development/components.md |
| P18 | PLAN.md:143–144 | Retain | Preserve producer-owned CSS. The real-wrapper-box constraint shares R20's component owner; it is referenced rather than copied into a second technical rule. | docs/development/styles.md |
| P19 | PLAN.md:145; notes/decisions/agent-skills-workflow.md:13–17 | Rewrite | Current consumer documentation describes the supported interface. Completed removals remain complete, without retired-interface aliases or legacy modes. Future migration scope is separately approved; this audit creates no permanent compatibility policy. | docs/development/components.md |
| P20 | PLAN.md:146 | Retain | Pinned Bun 1.4.2, colocated tests, strict TypeScript and current lint/format/style checks. Preserve controller registrations and live-collection snapshots. | docs/agents/verification.md |
| P21 | PLAN.md:147 | Rewrite | Preserve generation dependencies and full release checks. Apply B-slice's focused-per-slice/full-at-closure policy. Local preparation is not publication. | docs/agents/verification.md |
| P22 | PLAN.md:148 | Retain | Execute displayed example source, clean up on reset/removal, and assert outcomes. Old reference-page section matching is obsolete. | docs/development/documentation.md |
| P23 | PLAN.md:156–166 | Rewrite | Generator ownership and evidence for map ignore entries remain useful to tooling work. Dated code-block observations stay historical. | docs/development/generation.md |
| P24 | PLAN.md:167–173 | Retire | Historical display:contents exceptions conflict with the current real-box rule and include removed elements. | docs/history/parity-port-plan.md |
| P25 | PLAN.md:174 | Retain | Link-capable actions use href; preserve the approved Button interface. This specific rule comes from PLAN, not the separate parity-scope naming decision, so its current owner is component guidance. | docs/development/components.md |
| P26 | PLAN.md:175–178 | Retain | Component-local focus-ring ownership remains selected; retain its evidence rather than the claim that reference behavior alone decides current design. | docs/decisions/0041-focus-ring-ownership.md |
| P27 | PLAN.md:179–180 | Retire | Exact reference documentation sections and census-only extras belong to the closed port. | docs/history/parity-port-plan.md |
| P28 | PLAN.md:181–183 | Rewrite | Test placement remains; user questions route to brain. Historical commit-only-on-request wording cannot override the new approved local-commit scope. | AGENTS.md |
| P29 | PLAN.md:190–194 | Retain | Equal, nonzero comparison roots are still necessary for valid census evidence. This is a tooling invariant, not a product-wide completion test. | docs/development/generation.md |
| P30 | PLAN.md:195–207 | Rewrite | Use inspected evidence and state verification limits. B-source owns generic source research. The old “reference always wins” clause is superseded by approved component adaptations. | docs/development/reference-sources.md |
| P31 | PLAN.md:208–216 | Rewrite | Preserve regeneration and dependent-consumer checking. Update docs output, tool packages, generated entry/metadata owners and full gate. API changes no longer affect only four places. | docs/agents/verification.md |
| P32 | PLAN.md:217–223 | Rewrite | Preserve reactive-controller registrations and browser tests for slot behavior. Biome and claims that the field is always unused are historical. | docs/development/components.md |
| P33 | PLAN.md:224–239 | Rewrite | Match mapped boxes by layout role and verify composed host flow. Retain examples as dated evidence, not current component structure. | docs/development/generation.md |
| P34 | PLAN.md:240–243 | Rewrite | StoreSelector owns render observation; StoreEffect owns non-render consequences. Remove the old migration queue naming collapse-group/toaster/theme. | docs/development/components.md |
| P35 | PLAN.md:244–259 | Rewrite | Retain Book's accepted state/animation contract and real-pointer/cancellation test lessons under its decision. Do not impose its census mechanism on every future animation. | docs/decisions/0065-motion-on-the-book.md |
| P36 | PLAN.md:260–266 | Rewrite | Preserve start/end vocabulary and the shared place owner; historical migration counts and middle-truncate naming are dated. | docs/decisions/0099-start-and-end-places.md |
| P37 | PLAN.md:267–279 | Retain | Map skip headings name the reference; save evidence before reruns; state-side configuration and composed-target hops matter. | docs/development/generation.md |
| P38 | PLAN.md:280–284 | Retain | Another organization's brand identity is not a design-system capability. Preserve the recorded removal and its provenance. This specific constraint comes from PLAN rather than the broader non-canonical disposition note. | docs/development/components.md |
| P39 | PLAN.md:285–299 | Rewrite | Components own their positioning context; shadow styles require supported properties; distinguish docs harness differences. Old component names remain evidence only. | docs/development/components.md |
| P40 | PLAN.md:300–317 | Rewrite | Do not map a deliberately different control to an incompatible reference node. Generated values change through inputs. Remove unconditional immunity from approved token changes. | docs/development/generation.md |
| P41 | PLAN.md:318–327 | Rewrite | Read a composed component's actual variant/event contract. Avoid duplicate notifications according to its current propagation contract, not a universal stopPropagation command. | docs/development/components.md |
| P42 | PLAN.md:328–334 | Rewrite | Record decisions immediately in the correct owner. Retire PLAN as an index of everything and the old note paths. | docs/agents/workflow.md |
| P43 | PLAN.md:336–345 | Rewrite | Tool roles remain useful for generation work; freeze numeric extraction counts as historical evidence. | docs/development/generation.md |
| P44 | PLAN.md:347–396 | Retire | Old global pointer list and “docs is build output” conflict with the approved layout. Convert useful documents and keep provenance in the ledger. | Git history |
| P45 | notes/alignment/README.md:3–41 | Rewrite | Split current handoff from release history, verification evidence and machine-specific setup facts. Keep exact red baseline and unperformed-platform caveats visible. | docs/STATUS.md |
| P46 | notes/alignment/README.md:45–70,98–165 | Rewrite | Dated implementation checkpoints retain dates and limits. Remove their present-tense next actions from active guidance; preserve source decisions in their allocated records. | docs/history/systematization-pass.md |
| P47 | notes/alignment/README.md:245–256 | Retire | Local skill routing, preferred local question-copy rule and old project-over-plugin override conflict with selected brain routing. | Git history |
| P48 | notes/alignment/README.md:262 | Rewrite | Keep no agent deadline and unanswered-state semantics. Retire unconditional multiple-choice/chat prohibition; B-question uses the current permitted host surface. | Installed brain:ask-user-question |
| P49 | notes/alignment/README.md:263,275–490 | Retire | Completed phase gates, per-inventory interviews, old queues and M00 prerequisites do not restart after migration. | docs/history/systematization-pass.md |
| P50 | notes/alignment/README.md:264–269 | Rewrite | Product source selection and evidence obligations stay scoped to component decisions. Generic interview/proposal procedure belongs to brain. | docs/development/reference-sources.md |
| P51 | notes/alignment/README.md:270–273 | Rewrite | Removal/rename audits reach actual owned source, styles, entries, metadata and callers. Record platform naming constraints. Ask only unresolved user choices. | docs/development/components.md |
| P52 | notes/alignment/README.md:492–522 | Rewrite | Keep producer pointer and exact dated evidence; retire stale active worktree, next-step and permission language. | docs/history/systematization-pass.md |

### Local skills and completed delegation

| ID | Source | Disposition | Rule, reason and reconciliation | Sole target owner |
|---|---|---|---|---|
| L01 | .agents/skills/codebase-design/SKILL.md:6–114 | Retire | Generic architecture vocabulary/procedure duplicates brain:codebase-design. Component remains a valid project-domain word; module is used when discussing architectural depth. | Installed brain:codebase-design |
| L02 | .agents/skills/codebase-design/DEEPENING.md:1–37 | Retire | Dependency categories, seam discipline and test strategy belong to the installed skill. No project-specific rule needs rescue. | Installed brain:codebase-design |
| L03 | .agents/skills/codebase-design/DESIGN-IT-TWICE.md:1–44 | Retire | Alternative-interface delegation is generic plugin procedure, not standing permission to spawn workers for every task. | Installed brain:codebase-design |
| L04 | .agents/skills/domain-modeling/SKILL.md:8–42 | Rewrite | Remove old note paths and false docs-output claim. Preserve two-context routing and one decision store. | docs/agents/domain.md |
| L05 | .agents/skills/domain-modeling/SKILL.md:44–76 | Retire | Glossary refinement, scenarios, inline capture and decision threshold duplicate B-domain. | Installed brain:domain-modeling |
| L06 | .agents/skills/domain-modeling/ADR-FORMAT.md:1–41 | Retire | Slug-only names conflict with approved numbering. Useful concise format and sparse threshold already exist in brain's ADR reference. Preserve old dates during conversion. | Installed brain:domain-modeling |
| L07 | .agents/skills/domain-modeling/CONTEXT-FORMAT.md:1–60 | Retire | Generic glossary format duplicates the plugin. The actual two glossaries stay at their current paths. | Installed brain:domain-modeling |
| L08 | .agents/skills/grill-me/SKILL.md:8–77,121–132 | Retire | Interview ordering, questions, readiness and domain capture are supplied by brain:interview-me, specification and question skills. Do not preserve a second lifecycle. | Installed brain:interview-me |
| L09 | .agents/skills/grill-me/SKILL.md:78–119 | Retire | Old PRD path, fixed template and compulsory EARS syntax compete with the approved specification format. Preserve existing requirements, not this authoring procedure. | Installed brain:spec-driven-development |
| L10 | .agents/skills/improve-codebase-architecture/SKILL.md:1–73 | Retire | Completed Phase 3 trigger and local routing disappear. Architecture discussion uses brain:codebase-design; review uses brain:code-review-and-quality. No identical standalone command is claimed. | Installed brain:codebase-design |
| L11 | .agents/skills/improve-codebase-architecture/HTML-REPORT.md:1–123 | Retire | Mandatory Tailwind/Mermaid temp-report scaffolding is a local presentation procedure, not a product requirement. | Git history |
| L12 | .agents/skills/wait-what/SKILL.md:1–14 | Retire | Plain-language repair moves to user-started brain:wait-what. Global plain-talk guidance already supplies ordinary communication. | Installed brain:wait-what |
| L13 | .agents/skills/*/agents/openai.yaml | Retire | All five selector metadata files refer to deleted local implementations. Delete with their skill directories. | Git history |
| D01 | notes/decisions/agent-skills-workflow.md:1–11 | Rewrite | Preserve dated installation/pass adoption as history. Version 0.6.10 and “pack supplements old process” are superseded by approved brain ownership. | docs/decisions/0002-agent-skills-workflow.md |
| D02 | notes/decisions/agent-skills-workflow.md:13–17; spec/SPEC-maintainer-workflow.md:91–93 | Rewrite | Retain the completed pass's no-alias selections as final current interfaces, together with rationale and removal evidence. Retire only its blanket future override and dated no-consumers premise. The present workflow migration separately requires complete old-path removal. | docs/decisions/0002-agent-skills-workflow.md |
| D03 | notes/decisions/agent-skills-workflow.md:19–27 | Rewrite | Preserve why Peter rejected repeated implementation-detail interviews. Completed queue/proposal metrics and Phase 4/5 gates become history. B-question already keeps discoverable facts with the agent. | docs/decisions/0002-agent-skills-workflow.md |
| D04 | notes/decisions/agent-skills-workflow.md:29–35 | Rewrite | Preserve whole-proposal assembly as a completed pass decision. Do not turn it into a new all-project batching rule. | docs/decisions/0002-agent-skills-workflow.md |
| D05 | notes/decisions/execution-delegation.md:3–9 | Retire | The no-further-questions grant is limited to completed systematization work. Retain its approval provenance in the historical decision, with explicit closed scope. | docs/decisions/0035-execution-delegation.md |
| D06 | notes/decisions/execution-delegation.md:11–31 | Rewrite | Retain default-true attributes, typography/platform-name corrections, message catalogs, Heading registration and Spinner semantics as product resolutions. Their old pending-verification wording is dated evidence. | docs/decisions/0035-execution-delegation.md |
| D07 | notes/decisions/execution-delegation.md:33–45 | Rewrite | Retain native submitter/activation, loading/focus, Copy feedback, Avatar and passive-size resolutions. Remove present-tense authorization framing. | docs/decisions/0035-execution-delegation.md |
| D08 | notes/decisions/execution-delegation.md:47–69 | Rewrite | Retain actions-slot separation, selection notifications, appearance inheritance, private indicator delivery, springs and segmented/switch contracts. | docs/decisions/0035-execution-delegation.md |
| D09 | notes/decisions/execution-delegation.md:71–87 | Rewrite | Retain Tabs relationships/mounting, native Fieldset parentage and Field association semantics with original browser limits. | docs/decisions/0035-execution-delegation.md |
| D10 | notes/decisions/execution-delegation.md:89–111 | Rewrite | Retain raw reset values, affix slots, Number Input notation/action limits and Menu navigation/composition semantics. | docs/decisions/0035-execution-delegation.md |
| D11 | notes/decisions/execution-delegation.md:114–138 | Rewrite | Retain owned selection triggers, ranked Option projection, thumbLabels/platform collision, exact private date runtime and Slider completion semantics. | docs/decisions/0035-execution-delegation.md |
| D12 | notes/decisions/execution-delegation.md:141–151 | Rewrite | Retain focus-trap role, native modality, actual-platform limits, logical Inset edges and adjacent-pane resizing. | docs/decisions/0035-execution-delegation.md |

Retiring D05's active grant does not delete D06–D12's product decisions. The conversion must preserve every section and caveat. Later contracts may resolve dated gates; they must link the resolution rather than erase the original limit.

### Closed rule conflicts

| ID | Source | Disposition | Exact conflict and supported resolution | Sole target owner |
|---|---|---|---|---|
| C01 | PLAN.md:184–189; B-api:125–144; B-migrate:37–118; spec/SPEC-maintainer-workflow.md:89–93,126 | Rewrite | Closed: keep current completed replacements and their no-alias outcomes. Retire the unmeasured no-consumers premise and blanket future permission. The approved workflow migration removes old paths after consumers move. Future API scope remains separately decided; publication establishes no usage or permanent compatibility policy. | docs/development/components.md |
| C02 | PLAN.md:182–183; CLI/AGENTS.md:25–30; DND/AGENTS.md:25–30; tasks/plan.md:168–176 | Rewrite | Closed: the approved plan authorizes this migration's verified local commits. Neither reference repository's standing permission transfers. New outward actions use actual authorization and are asked once when not already authorized. Status records the current grant and pending action. | AGENTS.md |
| C03 | notes/alignment/README.md:262; B-question:80–96; spec/SPEC-maintainer-workflow.md:288–292 | Rewrite | Closed: use the current permitted question surface. Brain permits plain text when no permitted tool exists. Unanswered choices remain pending with no agent deadline. Today's host mode and timer facts stay dated, not universal project restrictions. | Installed brain:ask-user-question |
| C04 | B/skills/domain-modeling/SKILL.md:40; spec/SPEC-maintainer-workflow.md:95–147 | Rewrite | Closed: the plugin's keep-existing-folder fallback yields to Peter's explicit new layout. Numbered docs/decisions records replace notes/decisions, with dates, meaning and provenance preserved. | docs/agents/domain.md |
| C05 | CLI/AGENTS.md:62–64; DND/AGENTS.md:72–74; B-slice:205–255; spec/SPEC-maintainer-workflow.md:200–206; tasks/plan.md:132–166 | Rewrite | Closed: use touched tests and types per slice, then the full suite and review to close the task. Preserve this repository's required browser, consumer and release checks. Do not import the reference repositories' full-gate-before-every-commit rule. | docs/agents/verification.md |
| C06 | B/skills/setup-brain/SKILL.md:1–5,33–60; CLI/CLAUDE.md:24; DND/CLAUDE.md:26; spec/SPEC-maintainer-workflow.md:74,285 | Retain | Closed: setup remains user-started. The approved migration uses its guidance as reference and already selects local issues and two contexts. It does not invoke setup or change global settings. Shared instructions keep the user-started boundary; CLAUDE supplies only its host command spelling. | AGENTS.md |
| C07 | B/skills/using-brain/SKILL.md:73; CLI/AGENTS.md:18–21; DND/AGENTS.md:18–21; spec/SPEC-maintainer-workflow.md:110–119; tasks/plan.md:86–101 | Rewrite | Closed: this approved layout places intent/interview records in docs/design. Record that output adapter once; the installed plugin retains its interview procedure. | docs/agents/workflow.md |
| C08 | B/skills/api-and-interface-design/SKILL.md:146–154; PLAN.md:42–51; spec/SPEC-maintainer-workflow.md:279–285 | Retain | Closed: generic REST naming examples do not rename approved Lit properties or enums. The applicable component contract and domain glossary retain their names. This migration changes no product interface. | docs/development/components.md |
| C09 | B/skills/source-driven-development/SKILL.md:146–170; AGENTS.md:56; PLAN.md:72–79 | Retain | Closed: Geist provenance remains in research/decision records outside src. Exact-version official library and standards evidence remains available. This source-location constraint is not a general citation prohibition. | docs/development/reference-sources.md |

## Task 9 ownership composition and preserved implementation map

The following composition records the approved task 9 implementation target. It is migration evidence and does not activate these instructions:

1. Root AGENTS owns startup, task-end handoff, user-choice routing, actual authorization, user-started skill boundaries and pointers. Brain owns the lifecycle and wins shared skill names. Codex receives the same shared rules.
2. Real CLAUDE begins with `@AGENTS.md`. It contains Claude command names and project plugin setup. The five user-started skills are setup-brain, wait-what, handoff, triage and wayfinder; their shared boundary belongs to AGENTS, and CLAUDE records its command spellings.
3. docs/agents/domain.md routes the existing two contexts and applicable numbered decisions. It maps shared terms once. It does not create five package glossaries.
4. docs/agents/workflow.md owns repository output adapters: specs, current plan/tasks, completed plans, numbered research/decisions, docs/design intent, local issues and worker result files. Plugin procedures are referenced, not copied.
5. docs/agents/repository.md owns the authored/generated/package map below. Every task selects authored inputs, generated outputs, affected packages and checks from that map.
6. docs/agents/verification.md owns the pinned-runtime command map, baseline validity rule, browser/consumer requirements and test evidence fields. Status links the known failing case and named limits.
7. docs/development documents retain compatible technical constraints and their provenance. Root pointers specify when each is mandatory: component changes, CSS/generator changes, dependency changes, docs/example changes, or reference comparisons.

Unactivated startup wording for task 9 to adapt without duplicating plugin procedure:

> From any package directory, use the repository root for this workflow. Read docs/STATUS.md, CONTEXT-MAP.md and the task's glossary in full. Then read spec/README.md and the active specification, plan and task list named by status in full. Before editing, read repository/verification guidance and the decisions and research that cover that area. Inspect Git state and the pinned runtime. Preserve other sessions' changes. Reuse check evidence only for the same applicable revision, inputs and scope; run missing or invalidated checks. Report phase, last step, next step, red checks and pending decisions in five lines or fewer. Continue the next approved task when Peter asks to continue. Keep an incomplete plan when the request changes.

Unactivated task-end wording for task 9:

> Update the task's acceptance record and any changed specification. Record commands, outcomes, revision and verification limits. Rewrite docs/STATUS.md with the next action and exact user-started command when required. State committed, uncommitted, pushed and approval-pending work using this repository's actual authorization. A fresh session must resume without conversation history.

Use a pointer at the package entry only if fresh-session testing proves root instructions are missed. Package-local rules are justified only by a real local difference. Do not fork status, plans or lifecycle by package.

### Exact source and generator ownership to preserve

All rows have disposition **Retain** and one maintained documentation owner: docs/agents/repository.md. The implementation remains owned by the named source/script; the workflow migration does not move product source.

| Generated output or delivery path | Authoritative input and writer | Source evidence |
|---|---|---|
| src/generated/css/ | styles/, maps and committed specs through style producers | AGENTS.md:67; README.md:228 |
| src/generated/components/ and shared/ | Compiled CSS through scripts/styles.ts | AGENTS.md:68 |
| src/generated/style-manifest.json | Producer input/output fingerprints and registration definitions | AGENTS.md:69 |
| src/generated/tokens.json; dist/tokens.json | Numeric/theme catalogs through scripts/numeric-tokens.ts; split then build | AGENTS.md:70; README.md:230 |
| src/generated/theme-properties.ts | scripts/theme-tokens.ts, token sources and palette inputs; split | README.md:231 |
| src/generated/responsive-styles.ts | scripts/responsive-styles.ts and shared style schema; split | README.md:232 |
| assets/material-symbols/ | Pinned upstream SVG checkout through scripts/material-symbols.ts import | README.md:233 |
| src/generated/icons/; dist/icons.json | Verified SVG catalog and shared renderer through scripts/icon-entries.ts and build | README.md:234 |
| src/define/, src/register/, internal counterparts, src/all.ts, core component exports | Tag maps, internal annotations, owned markup and literal scoped factories through scripts/entries.ts | AGENTS.md:71 |
| dist/shared/date.js; dist/licenses/ | Exact patched date dependency and src/shared/date.ts through scripts/date-runtime.ts | AGENTS.md:72 |
| dist/custom-elements.json | Component declarations/templates/annotations through scripts/manifest.ts | AGENTS.md:73 |
| dist/**/*.d.ts | TypeScript declarations and generated closed entry interfaces through scripts/declarations.ts | AGENTS.md:74 |
| dist/styles/ | Compiled document/token/recipe CSS and maps through split/build | AGENTS.md:75; README.md:236–237 |
| dist/cdn/; dist/bundle/ | One browser runtime graph and selective definitions through build | AGENTS.md:76; README.md:36 |
| dist/browser-licenses/ | Exact bundled dependency notices and pinned metadata through scripts/browser-package.ts | AGENTS.md:77; scripts/browser-package.ts:17–25,155–211 |
| packages/core/{dist,assets,README.md,skills} | Explicit links to root dist, assets, README and dist/skills through scripts/core-package.ts | AGENTS.md:78; scripts/core-package.ts:4–19 |
| packages/browser/{dist,styles,bundle,licenses} | Explicit links to CDN, styles, bundle and three notice sources through scripts/browser-package.ts | AGENTS.md:79; scripts/browser-package.ts:17–25 |
| packages/react/.build-src/; packages/react/dist/ | CEM plus authored React bridge through scripts/react.ts | AGENTS.md:80 |
| dist/skills/; MCP documentation/release records | Authored consumer skills, CEM and site records through docs | AGENTS.md:81 |
| packages/devtools/src/generated/metadata.ts | Public CEM and token metadata through scripts/devtools-metadata.ts | AGENTS.md:82 |
| packages/{mcp,devtools}/dist/ | Authored tooling sources and generated metadata through build:tooling | AGENTS.md:83 |
| .artifacts/packages/ | Built output plus production-only package metadata through pack | AGENTS.md:84 |
| _site/ | site/ plus dist through site/build.ts; Pages deploys this verified artifact | AGENTS.md:85–88 |
| dist/ | src/ and verified generated inputs through build; gitignored | AGENTS.md:86 |

README's generation table adds four owners missing from the root AGENTS table: theme properties, responsive styles, imported SVG artwork and generated icon entries. Carry all four into the maintained map. The README remains the consumer README linked into core. Maintainer links there must resolve from the published package, normally through repository URLs; do not add a second package README.

### Stale claims and acceptance limits

| Claim | Correct treatment |
|---|---|
| PLAN.md:26 says 0.2.0 published and 0.3.0 prepared | Historical release state. Current manifest and release record report 0.3.2. |
| PLAN.md:351–352 and local domain/grill skills say docs/ is generated | Retire. site/ is authored; _site/ is generated; docs/ now holds maintainer records. |
| Old pass says Phase 6 active, ports incomplete, worktrees pending or no publication occurred | Keep as dated history; do not place those instructions in the new handoff. |
| agent-skills-workflow says 0.6.10 installed | Historical observation. This audit inspects brain 0.6.0 and agent-skills 0.6.13; these are not permanent version pins. |
| Old rules say no consumers exist | Do not repeat as current fact. Five packages are publicly released; actual usage is not measured by this audit. |
| Old rules say all CSS fixes belong in tools/geist | Use the actual producer map, including authored styles and build scripts. |
| Prior M26/local release results prove today's branch green | False. Preserve revision and scope. Current baseline includes the Chromium Hover Card failure described in the approved spec. |
| Automated WebKit proves actual Safari or assistive technology | False. Carry genuine OS IME/dictation/autofill, actual Safari/assistive technology and background-window checks as unperformed. |
| Release authentication is pending because credential rotation is open | Distinct facts. Release completion does not close the owner-controlled token-rotation follow-up. |
| Source citations or valid settings prove fresh host startup | Unverified. Task 12 must test root/package cold starts, interruption, changed request, missing approval and red baseline on actual hosts. |

All nine conflict rows close with supported retain/rewrite dispositions. No unresolved user-owned choice remains in this rule audit. Task 9 authors the destinations; task 11 activates them; task 12 verifies actual host behavior.

No global preference/configuration, reference repository, published consumer skill, product source or permission grant changes are made by this audit. The known browser failure and actual-platform limits remain verification work, not unresolved rule choices.

### Audit input identity

| Input | SHA-256 |
|---|---|
| docs/verification/workflow-migration/rule-audit-input.md | 583186de8a060a54abba7434df9ac6a4f8239ad2ba7ed4a506a05030cd003223 |
| docs/verification/workflow-migration/decision-audit.json | aa93c37285aadeb3b8a6ab23420b00ce9dd5c37c3a2dc6b89ac907dcdcf1cf7d |
