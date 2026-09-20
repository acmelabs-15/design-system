Decided 2026-09-19 by Peter.

# Keep a focused Item family for content structure

Keep one focused Item family, like shadcn Item, to provide consistent placement of media, a heading, description, supporting information and actions. It replaces the overlapping Entity/Item purposes. Peter selected **Focused Item** after asking for a broader comparison of Item, Card, selection cards, Group, List, Sidebar, TOC and Tree View.

This supersedes the earlier **Composed examples only** answer. That answer was immediately qualified by a request to research whether such row components are common. The ten-system survey found genuine standalone examples and several different list/composition approaches; it did not establish a universal standard. Peter then found shadcn Item compelling and requested the joint composition review before making this selection.

A List may contain Items; a Card may contain one or several Items. Radio/Checkbox Cards, navigation links, Sidebar parts and Tree View nodes retain their own interaction and state contracts. They may reuse suitable content parts without introducing a second clickable wrapper. Item is not the universal owner of navigation, selection, forms, disclosure, collection focus or every settings row.

The value is a consistent reusable content structure, not merely fewer lines or a claim of community-wide prevalence. The alternative remains fully composed recipes without a public Item interface; Peter chose the focused family after the boundaries were narrowed.

Exact tags, parts, styles, root semantics, secondary-action structure and safe composition with other families remain for the inventory. Peter subsequently selected “Use List and Group”: remove Entity Content, Entity List and Items. Item parts provide content structure; List provides list semantics; Stack/HStack/VStack provide ordinary layout, Group supplies its specific presentation features and Card supplies a surface. Preserve useful border, separator and striped examples without a separate Item Group. Exact parts and markup remain inventory work. The later [settings-row decision](settings-row-composition.md) removes Setting Row and Setting Rows through Field/Item recipes. No alias or competing Entity interface should survive the approved replacement.

Evidence: [joint composition review](../analysis/codebase-systematization.md#joint-content-selection-and-navigation-review), [ten-system survey](../alignment/evidence/row-pattern-survey-2026-09-19.json), [comparison and selections](../alignment/evidence/joint-composition-review-2026-09-19.json). Source implementation still requires Phase 5 approval.
