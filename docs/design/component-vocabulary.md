# Component vocabulary decision record

Status: Resolved by Peter on 2026-09-19; historical naming/disposition census.

## Scope and interpretation

This record preserves selected meanings and the complete dated terminology census. It is not a current component specification or another glossary. The source counts describe pre-migration code. Later contracts and implementation determine current interfaces without erasing the original distinctions or corrections.

The dated findings below retain their source versions, measurements, corrections and verification limits. Old phase gates, source freezes, local-skill routing and task-specific permission grants describe the completed pass. They do not govern new work. The [current handoff](../STATUS.md) owns the next action.


Resolved 2026-09-19 by Peter through the final decision walk. This is the naming/disposition record, not the Phase 4 component specification. [Answers](../verification/systematization/phase-2-closure-2026-09-19.json), [complete enumerated source census](../verification/systematization/phase-2-terms-census-2026-09-19.json), [glossary](../../CONTEXT.md).

## Coverage

Enumerated all 649 project files across src/components (386), src/shared (27), docs-src (109) and tools/geist/maps (127), excluding Finder metadata. File paths and SHA-256 hashes are saved. The AST scan covers all 150 non-generated component implementation files and records 150 registered tags, 777 decorated property declarations plus one decorated accessor, 386 distinct property names, and 177 distinct explicitly named string attributes in the source review.

Literal template scanning finds 56 named slots at 128 occurrences. Final AST verification finds 31 distinct literal acme- event names at 74 construction sites and seven dynamically named Event/CustomEvent sites. This corrects the earlier broad report of 80 literal emission sites. Dynamic/shared event producers and inherited interfaces need separate inventory accounting.

The four surfaces reference 89 unique --acme-* and 218 --ds-* names. These are references to implementation variables, generated tokens and consumed values, not 307 approved public customization hooks. The census is pre-implementation source evidence; components selected for removal were still present at that checkpoint.

## Named size, dimensions and density

[Selected: full words](../decisions/0066-named-size-vocabulary.md). Use tiny, small, medium and large, with consistently named larger tiers where needed. Preserve the earlier tiny decision; remove short aliases. A component can support a subset; relative names do not promise identical pixels across families.

Twenty-three size declarations mix sixteen long-name scales, three short-name scales (one belongs to removed Loading Dots), one alias set and three numeric/CSS dimensions. Examples: Button size (src/components/button/button.ts:58), Badge short names (badge.ts:7), Spinner larger short tiers (spinner.ts:6), Pill aliases (pill.ts:11), Avatar dimension (avatar.ts:56).

Seven small/large booleans, two compact and one tight are not all synonyms. Item.large changes amount display; Calendar.compact changes arrangement; Snippet.compact changes the single-line treatment. The original Phase 4 review mapped them by meaning rather than mechanically converting all to size. Density remains the selected spacing-only concept, independent of text size and dimensions. Supported tiers, larger-tier spelling and exact measurements return in shared inventory conventions.

## Shape and corner treatment

[Selected: separate concepts](../decisions/0095-shape-vocabulary.md). Circle is circular, pill has fully rounded ends and square has equal sides. Corner radius is separate; a square may have rounded corners.

The census finds two shape properties, three rounded flags, two pill flags and one squared flag. Button exposes both shape=rounded and rounded; Skeleton pill/rounded have the same maximum-radius treatment; Input.rounded means fully rounded ends. Remove duplicate authoring paths. Shape eligibility, exact radius values and property design are Phase 4; the existing needs-based morphing decision stands.

## Interaction and value states

[Selected: meaning-specific names](../decisions/0102-state-vocabulary.md). Highlighted is the navigated option; selected is a chosen collection value; checked is checkbox/radio value state; pressed is a toggle button's persistent value; current is navigation location; focused is actual focus.

The source has five active, six selected, one chosen, seven checked and one pressed declarations. ComboBoxOption active/chosen and MenuItem selected demonstrate the highlight/value collision. Shared data-active represents transient interaction and must not become persistent Toggle Button state. Preserve native ARIA/CSS meaning; do not rename every match without context.

Invalid control state differs from error text/data. Loading and native aria-busy also have distinct roles. Existing Field/native-validity decisions settle responsibility; exact names, propagation, announcements and validation timing belong in the inventory.

## Text and content regions

[Selected: Heading](../decisions/0108-text-role-vocabulary.md). Heading names visible component headings; label names a control/option; description is supporting prose; metadata comprises structured facts. Header/footer are regions. Native HTML title retains its meaning. Heading terminology does not choose an HTML heading level.

The selected direction normalized genuine desc/description, head/header and foot/footer synonyms and expanded unexplained chev, crumbs and conv abbreviations where their concepts survived. Existing examples occur in Stat (stat.ts:44), Item (item.ts:26) and Appbar (appbar.ts:51). Do not collapse metadata/context/subtitle, action/actions/tools or role-specific media into one generic slot solely because positions resemble each other. The inventory recorded each slot's meaning, optionality, cardinality and markup, applying the selected vocabulary only where meanings matched.

## Open, expanded and visible

[Selected: distinguish the meanings](../decisions/0073-open-expanded-vocabulary.md). Open describes floating surfaces; expanded describes disclosure/hierarchy; visible describes actual presentation where needed. Closing content may remain visible for animation.

The source has seventeen open, two expanded and one visible declarations; one expanded property forwards native aria-expanded rather than owning disclosure state. Preserve native attributes. Exact collection root/item state and transition lifetime belong in the inventory, not multiple synonymous properties on every control.

## Events

[Selected: shared meaning-based acme- names](../decisions/0033-event-vocabulary.md). Distinguish live input, committed change, action requests, state notifications and completed transitions. No family prefix is added merely to distinguish equivalent public meanings.

Input's acme-input/acme-change, Select's acme-change, Menu's dynamic open/close, Modal's cancelable dismiss and post-exit close, and the Slider's variable event name show why the name alone does not establish timing or payload. The previous language-switcher duplicate-event defect proves that child propagation and wrapper redispatch require one public notification per action.

The original Phase 4 contract work defined public/internal events, detail shapes, cancelability, composed/bubbling flags, user/programmatic changes, transitions and event counts. These are explicit contract obligations under the selected vocabulary, not unresolved Phase 2 naming choices.

## Families, suffixes and abbreviations

The disposition register and final votes settle purposes:

- Item content parts replace Entity Content. Entity List/Items become semantic List and suitable layout/surface compositions.
- Stack/HStack/VStack supply ordinary spacing/alignment. Group is used for attached/shared-appearance or other Group-specific features. List remains semantic; Card remains a surface.
- Radio/Checkbox groups retain selection/form ownership; Accordion retains coordinated disclosure; Avatar Group retains member-count capabilities. Suffix alone does not justify replacing them with general Group.
- Segmented Control shares Radio Group, Group presentation and the shared indicator. Independent pressed buttons are Toggle Button; existing Toggle becomes Switch.
- Appbar/Topbar become App Bar. Side Nav/Subnav become navigation compositions; Tags becomes layout composition while Tag remains; Logs becomes event-log examples.
- Removed ricon, kv and fold disappear with their interfaces rather than receive renamed aliases.
- Spark's concept is Sparkline; public placement in Chart/Stat remains inventory work, not retention of the old implementation. Expand information-icon and usage-summary abbreviations in internal naming when those concepts survive. atom-state accurately describes TanStack Atom state.

Forms is a guide (docs-src/pages/components/forms.ts has tags=[]), not an acme-forms component. Preserve the guide and selected native/optional TanStack Form support; remove the false component-disposition entry.

## Other classified clusters

Position/side/align/offset are not one meaning: distinguish placement, alignment and offset from Toast's numeric stack index. Combined versus separate public properties is Phase 4 design.

Clearable/showClearButton/allowClear normalize only where they express the selected clear-button capability. Visibility, capability and interaction policy remain distinct; defaults/boolean conversion and negative-flag migration require per-component review.

Color CSS values, palette scales, semantic intent and numerical direction are distinct. Spinner.color, LegendItem.hue, StatDelta.tone and Spark.tone demonstrate the collision. The selected Stat direction-versus-desirability rule applies. This does not reopen variant/type or choose a new color API.

The original Phase 4 work classified public/private CSS properties and coordinated acme/ds namespaces with generated-style/theme contracts. Current references are not permission to expose every variable.

## Closure and return points

Phase 2 resolved component purposes and semantic naming. Record validation closed that phase, after which Peter separately started Phase 3. Architecture used these meanings and the selected state/motion/package rules. Original Phase 4 supplied interfaces, values, markup, event payloads and combined checks; Phase 5 approved migration before source work. These phase commands are historical.

At this capture, Material Progress token/diagram and actual Lit implementation review remained prerequisites for visual recommendations. Material Chips article text was read, but dynamic tokens and sixteen figures were not visually reviewed; no broad Chip family was adopted. Later records resolve assigned implementation work without converting this limited capture into a complete review.

No source, generated styles, runtime dependencies, exports or tests changed as part of this terminology capture.

## Source provenance

Converted 2026-10-21 from notes/alignment/terms.md. That path identifies the historical source record. Inline source references and saved evidence retain their stated scope; this conversion does not rerun the original checks.
