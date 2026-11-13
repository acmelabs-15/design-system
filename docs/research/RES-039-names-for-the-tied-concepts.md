---
id: RES-039
status: resolved # in-progress | resolved
kind: research
from: IDEA-001#10
date: 2026-11-12
outcome: answered
---
# RES-039: Names that more sources use for the 11 tied concepts

## Question
For the 11 component concepts on which the five reference systems tie on a name, which name do more sources use?

## Answer
Sufficient answer: for each of the 11 concepts, a table of the survey sources that have the same concept, with the name each source uses and the link to its page; the count for each name; and a plain statement whether one name is used by more sources than any other or whether the survey also ends in a tie. The survey set is fixed: WAI-ARIA Authoring Practices (APG) patterns, native HTML, Base UI, React Aria Components, MUI (Material UI and MUI X), Mantine, Ant Design, Ark UI, Headless UI, Fluent UI React, Carbon Design System and Material Design 3. Facts only.

The condition is met. All 12 sources were checked for all 11 concepts on 2026-11-12.

### Method
- Each concept's purpose comes from RES-032 to RES-037. A source has the concept only when its documentation gives a component the same purpose.
- RES-037's matching rule applies here too. A part of another component, a prop or a mode of another component, and a component whose purpose only overlaps do not count. Such near matches are listed under "Not counted" so that Peter can see them.
- A sub-component with its own documented API counts, for example Ant Design Input.OTP and Mantine Checkbox.Card.
- APG counts a pattern. Native HTML counts an element, an input type or an attribute that names the concept.
- Names are counted as each source writes them, after removing code casing and dot notation. For example, Mantine "PinInput" counts as "Pin Input". A name that differs in any word counts as its own name.
- Each source counts once for each concept. When a source uses two names, both are reported and the source is counted under the name its component list uses.
- A source listed as "none" has no component with that purpose in its component index (see Findings).

### 1. Bleed (Chakra UI) or Inset (Radix Themes)
Purpose: a negative margin that lets content reach the edges of its container.

| Source | Name | Page |
| --- | --- | --- |
| All 12 sources | none | — |

Counts: Bleed 0, Inset 0. The survey ends in a tie. No survey source has this concept.

### 2. Resizable (shadcn/ui) or Splitter (Chakra UI)
Purpose: panels that the user resizes by dragging a handle between them.

| Source | Name | Page |
| --- | --- | --- |
| APG | Window Splitter | https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/ |
| Mantine | Splitter | https://mantine.dev/core/splitter/ |
| Ant Design | Splitter | https://ant.design/components/splitter |
| Ark UI | Splitter | https://ark-ui.com/react/docs/components/splitter |
| Other 8 sources | none | — |

Counts: Splitter 3, Window Splitter 1, Resizable 0. Splitter is used by more sources than any other name.

### 3. Item (shadcn/ui) or Entity (Geist)
Purpose: a standalone row that shows content (media, title, description) with related actions.

| Source | Name | Page |
| --- | --- | --- |
| All 12 sources | none | — |

Counts: Item 0, Entity 0. The survey ends in a tie.
Not counted: MUI ListItem is a part of the List component (https://mui.com/material-ui/react-list/). Under RES-037's rule a part of another component is a separate concept.

### 4. Copy Button (Geist) or Clipboard (Chakra UI)
Purpose: a control that copies a given value to the clipboard and shows that it was copied.

| Source | Name | Page |
| --- | --- | --- |
| Mantine | Copy Button (CopyButton) | https://mantine.dev/core/copy-button/ |
| Ark UI | Clipboard | https://ark-ui.com/react/docs/components/clipboard |
| Carbon | Copy Button (CopyButton) | https://react.carbondesignsystem.com/?path=/docs/components-copybutton--overview |
| Other 9 sources | none | — |

Counts: Copy Button 2, Clipboard 1. Copy Button is used by more sources than any other name.
Not counted: Ant Design has a copyable prop on Typography, not a component. React Aria and Mantine also have a useClipboard hook, which is not a component.

### 5. Checkbox Cards (Radix Themes) or Checkbox Card (Chakra UI)
Purpose: cards that the user selects or deselects, with more than one selection allowed.

| Source | Name | Page |
| --- | --- | --- |
| Mantine | Checkbox Card (Checkbox.Card) | https://mantine.dev/core/checkbox/ |
| Carbon | Selectable Tile (multi-select variant of Tile; React SelectableTile) | https://carbondesignsystem.com/components/tile/usage/ |
| Other 10 sources | none | — |

Counts: Checkbox Card 1, Selectable Tile 1, Checkbox Cards 0. Between the two tied names, Checkbox Card has 1 and Checkbox Cards has 0. Across all names the survey ends in a tie, 1 to 1.

### 6. Radio Cards (Radix Themes) or Radio Card (Chakra UI)
Purpose: cards from which the user selects exactly one.

| Source | Name | Page |
| --- | --- | --- |
| Mantine | Radio Card (Radio.Card) | https://mantine.dev/core/radio/ |
| Carbon | Radio Tile (single-select variant of Tile; React RadioTile) | https://carbondesignsystem.com/components/tile/usage/ |
| Other 10 sources | none | — |

Counts: Radio Card 1, Radio Tile 1, Radio Cards 0. Between the two tied names, Radio Card has 1 and Radio Cards has 0. Across all names the survey ends in a tie, 1 to 1.

### 7. Native Select (shadcn/ui) or Select (Native) (Chakra UI)
Purpose: a select control built on the browser's own select element.

| Source | Name | Page |
| --- | --- | --- |
| Native HTML | select (element) | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select |
| MUI | Native Select (NativeSelect) | https://mui.com/material-ui/react-select/#native-select |
| Mantine | Native Select (NativeSelect) | https://mantine.dev/core/native-select/ |
| Headless UI | Select | https://headlessui.com/react/select |
| Fluent UI React | Select | https://react.fluentui.dev/?path=/docs/components-select--docs |
| Carbon | Select | https://carbondesignsystem.com/components/select/usage/ |
| Other 6 sources | none | — |

Counts: Select 4 (HTML, Headless UI, Fluent UI React, Carbon), Native Select 2, Select (Native) 0. Select is used by more sources than any other name. Select is not one of the two tied names. Between the two tied names, Native Select has 2 and Select (Native) has 0.

### 8. Input OTP (shadcn/ui), One-Time Password Field (Radix Primitives) or Pin Input (Chakra UI)
Purpose: a group of single-character inputs for a one-time password or PIN code.

| Source | Name | Page |
| --- | --- | --- |
| Base UI | OTP Field | https://base-ui.com/react/components/otp-field |
| Mantine | Pin Input (PinInput) | https://mantine.dev/core/pin-input/ |
| Ant Design | Input OTP (Input.OTP; demo heading "OTP") | https://ant.design/components/input |
| Ark UI | Pin Input | https://ark-ui.com/react/docs/components/pin-input |
| Other 8 sources | none | — |

Counts: Pin Input 2, Input OTP 1, OTP Field 1, One-Time Password Field 0. Pin Input is used by more sources than any other name.
Not counted: native HTML has the autocomplete token "one-time-code". It is a hint on an input, not a control.

### 9. Password Input (Chakra UI) or Password Toggle Field (Radix Primitives)
Purpose: a field for a password, with a button that shows or hides the value.

| Source | Name | Page |
| --- | --- | --- |
| Native HTML | password (input type; no show or hide button) | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/password |
| Mantine | Password Input (PasswordInput) | https://mantine.dev/core/password-input/ |
| Ant Design | Input Password (Input.Password; demo heading "Password box") | https://ant.design/components/input |
| Ark UI | Password Input | https://ark-ui.com/react/docs/components/password-input |
| Carbon | Password Input (PasswordInput; "sub-variant of text input") | https://react.carbondesignsystem.com/?path=/docs/components-passwordinput--overview |
| Other 7 sources | none | — |

Counts: Password Input 3, Input Password 1, password input type 1, Password Toggle Field 0. Password Input is used by more sources than any other name. The HTML row lacks the show or hide button; without it the counts are Password Input 3, Input Password 1.

### 10. Status (Chakra UI) or Status Dot (Geist)
Purpose: a small indicator, often with a label, that shows the status of a process or state.

| Source | Name | Page |
| --- | --- | --- |
| Carbon | Shape Indicator (also Icon Indicator; both preview, under the pattern "Status indicators") | https://react.carbondesignsystem.com/?path=/docs/preview-statusindicators-preview-shapeindicator--overview |
| Other 11 sources | none | — |

Counts: Shape Indicator 1, Status 0, Status Dot 0. The survey ends in a tie between the two tied names, 0 to 0.
Not counted: Ant Design Badge has a status mode ("Standalone badge with status"), which is a mode of Badge. Fluent UI React PresenceBadge shows a person's presence, which only overlaps. Mantine Indicator places an element at the corner of another element, which is a different purpose.

### 11. Direction Provider (Radix Primitives) or Direction (shadcn/ui)
Purpose: sets the reading direction (left to right or right to left) for everything inside it.

| Source | Name | Page |
| --- | --- | --- |
| Native HTML | dir (global attribute) | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir |
| Base UI | Direction Provider | https://base-ui.com/react/utils/direction-provider |
| Mantine | Direction Provider (DirectionProvider) | https://mantine.dev/styles/rtl/ |
| Other 9 sources | none | — |

Counts: Direction Provider 2, dir 1, Direction 0. Direction Provider is used by more sources than any other name.
Not counted: Ant Design sets direction with a prop on ConfigProvider, not a component. React Aria I18nProvider and Ark UI LocaleProvider set the locale, and the direction follows from it. RES-037 keeps Chakra UI's LocaleProvider apart from Direction Provider, so locale providers are a separate concept here too.

### Summary
| Concept | Result of the survey |
| --- | --- |
| Bleed or Inset | Tie, 0 to 0 |
| Resizable or Splitter | Splitter, 3 (plus Window Splitter 1) to 0 |
| Item or Entity | Tie, 0 to 0 |
| Copy Button or Clipboard | Copy Button, 2 to 1 |
| Checkbox Cards or Checkbox Card | Checkbox Card 1 to 0; tie with Selectable Tile 1 |
| Radio Cards or Radio Card | Radio Card 1 to 0; tie with Radio Tile 1 |
| Native Select or Select (Native) | Native Select 2 to 0; Select leads all names with 4 |
| Input OTP, One-Time Password Field or Pin Input | Pin Input 2; Input OTP 1; One-Time Password Field 0 |
| Password Input or Password Toggle Field | Password Input, 3 to 0 |
| Status or Status Dot | Tie, 0 to 0 |
| Direction Provider or Direction | Direction Provider, 2 to 0 |

Limits: the matching of purpose is a reading of each page, as in RES-037. Mantine's Checkbox.Card and Radio.Card are single cards that work inside Checkbox.Group and Radio.Group; Chakra's Checkbox Card is also a single card. Carbon's tiles are variants on one Tile page, with separate React components. Carbon CopyButton shows the "Copied!" feedback; the copy itself runs in its onClick handler.

## Findings
- APG lists 30 patterns; the only one in scope is "Window Splitter", "a moveable separator between two sections, or panes, of a window that enables users to change the relative size of the panes". No APG pattern covers the other 10 concepts. Source: https://www.w3.org/WAI/ARIA/apg/patterns/ and https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/, checked 2026-11-12.
- Base UI lists these utilities: CSP Provider, Direction Provider, mergeProps and useRender. Its components include "OTP Field", "for one-time password and verification code entry". It has no Splitter, copy, card choice, native select, password, status, bleed or item component. Source: https://base-ui.com/llms.txt, checked 2026-11-12.
- Base UI Direction Provider is "a direction provider component that enables RTL behavior for Base UI components". Source: https://base-ui.com/react/utils/direction-provider.md, checked 2026-11-12.
- Base UI OTP Field is "a one-time password input composed of individual character slots". Source: https://base-ui.com/react/components/otp-field.md, checked 2026-11-12.
- React Aria Components has none of the 11 concepts in its component list. It has a useClipboard hook and an I18nProvider that "provides the locale for the application to all child components". Source: https://react-aria.adobe.com/llms.txt and https://react-aria.adobe.com/I18nProvider.md, checked 2026-11-12.
- Material UI documents a NativeSelect component in the section "Native select" of its Select page. Source: https://mui.com/material-ui/react-select.md, lines 401-425, checked 2026-11-12.
- Material UI's List page documents ListItem, ListItemAvatar, ListItemText and ListItemSecondaryAction as components of List. Source: https://mui.com/material-ui/react-list.md, checked 2026-11-12.
- Material UI and MUI X have no component for the other 9 concepts. Their right-to-left support is a guide, not a component. Source: https://mui.com/material-ui/llms.txt and https://mui.com/x/llms.txt, checked 2026-11-12.
- Mantine documents Splitter ("Resizable split pane layout"), CopyButton ("Copies given text to clipboard"), PinInput ("Capture pin code or one time password from the user"), PasswordInput ("Capture password data from user", with a visibility toggle) and NativeSelect ("Native select element based on Input"). It has no Bleed, Item, Status or Clipboard component. Source: https://mantine.dev/llms.txt and https://mantine.dev/llms/core-splitter.md, core-copy-button.md, core-pin-input.md, core-password-input.md, core-native-select.md, checked 2026-11-12.
- Mantine says "Checkbox.Card component can be used as a replacement for Checkbox to build custom cards/buttons/other things that work as checkboxes". Its Radio page says the same of Radio.Card for radios. Source: https://mantine.dev/core/checkbox/ and https://mantine.dev/core/radio/, checked 2026-11-12.
- Mantine's RTL page says "The DirectionProvider component is used to set direction for all components inside it". Source: https://mantine.dev/llms/styles-rtl.md, lines 9-18, checked 2026-11-12.
- Ant Design documents Splitter, "Resizable split panel layout". Source: https://ant.design/components/splitter.md, checked 2026-11-12.
- Ant Design's Input page has demos "OTP" and "Password box" and API sections "Input.Password" and "Input.OTP". Source: https://ant.design/components/input.md, lines 262, 442, 913 and 923, checked 2026-11-12.
- Ant Design Badge has a status prop for a "Standalone badge with status". ConfigProvider takes a direction prop. Neither is a separate component. Source: https://ant.design/components/badge.md, line 242, and https://ant.design/components/config-provider.md, line 317, checked 2026-11-12.
- Ant Design's component list has no card choice, Bleed, Item or copy component. Source: https://ant.design/llms.txt, checked 2026-11-12.
- Ark UI (v5.40.0) documents Clipboard ("A component to copy text to the clipboard"), Pin Input ("For pin or verification codes"), Password Input ("enter secure text like (passwords and api keys)") and Splitter ("divides your interface into resizable sections"). Its Locale utility is a "Locale provider for setting the locale and direction of the app". Ark UI has no card choice, Bleed, Item, native select or status component. Source: https://ark-ui.com/llms.txt and https://ark-ui.com/react/docs/components/clipboard, pin-input, password-input, splitter and https://ark-ui.com/react/docs/utilities/locale, checked 2026-11-12.
- Headless UI has 16 components. Its Select is "a light wrapper around the native select element". It has none of the other 10 concepts. Source: https://headlessui.com/ and https://headlessui.com/react/select, checked 2026-11-12.
- Fluent UI React's Select provides "a styled wrapper around the HTML select element". Source: https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-select/library/docs/Spec.md, checked 2026-11-12.
- Fluent UI React's Storybook lists none of the other 10 concepts as components. Its PresenceBadge shows a status such as available or away. Source: https://storybooks.fluentui.dev/react/index.json and https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-badge/library/README.md, checked 2026-11-12.
- Carbon's React Storybook documents CopyButton, PasswordInput, Select and Tile, and preview ShapeIndicator and IconIndicator components under StatusIndicators. Source: https://react.carbondesignsystem.com/index.json, checked 2026-11-12.
- Carbon's CopyButton docs say "The copy button should be accompanied by a tooltip" with the default feedback "Copied!". Its usage guideline is under the pattern "Common actions". Carbon's site has no separate copy-button page; /components/copy-button/usage/ returns "Page not found". Source: https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/react/src/components/CopyButton/CopyButton.mdx and https://carbondesignsystem.com/components/copy-button/usage/, checked 2026-11-12.
- Carbon's Text input page says "Password input is a sub-variant of text input", and that the user can toggle the visibility of the characters. Source: https://carbondesignsystem.com/components/text-input/usage/, checked 2026-11-12.
- Carbon's Select "list appearance will be determined by the browser being used", and its React Select renders a select element. Source: https://carbondesignsystem.com/components/select/usage/ and https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/react/src/components/Select/Select.tsx, line 301, checked 2026-11-12.
- Carbon's Tile page says "Selectable tiles can either have single-selection or multi-selection". The React code exports SelectableTile, with role checkbox, and a separate RadioTile. Source: https://carbondesignsystem.com/components/tile/usage/ and https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/Tile/Tile.tsx, lines 470 and 580, checked 2026-11-12.
- Carbon's "Status indicators" pattern says they "communicate severity-level information through distinct shapes and colors". It names Icon, Shape, Badge and Differential indicators. Source: https://carbondesignsystem.com/patterns/status-indicator-pattern/, checked 2026-11-12.
- None of the 11 concepts is among the components in the Material Design 3 components overview. Source: https://m3.material.io/components, checked 2026-11-12.
- Native HTML: the select element "represents a control that provides a menu of options"; the dir global attribute "sets the element's base text direction"; input type password provides "a way for the user to securely enter a password"; the autocomplete token one-time-code marks "A one-time password (OTP) for verifying user identity". Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select, .../Global_attributes/dir, .../Elements/input/password and .../Attributes/autocomplete, checked 2026-11-12.
- The purposes of the tied components come from the inventories: Radix Themes Inset (RES-034 line 101), Chakra UI Bleed (RES-035 line 107), shadcn/ui Item (RES-032 line 147), Geist Entity (RES-036 line 113), Geist Copy Button (RES-036 line 106), Chakra UI Clipboard (RES-035 line 120), Radix Themes Checkbox Cards and Radio Cards (RES-034 lines 87 and 109), Chakra UI Checkbox Card and Radio Card (RES-035 lines 117 and 181), shadcn/ui Native Select (RES-032 line 154), Chakra UI Select (Native) (RES-035 line 167), the OTP and password components (RES-032 line 146, RES-033 lines 89-90, RES-035 lines 171-172), Chakra UI Status (RES-035 line 198), Geist Status Dot (RES-036 line 151) and the direction components (RES-032 line 138, RES-033 line 106). Source: docs/research/RES-032 to RES-036, checked 2026-11-12.

## Follow-ups
None.

## Next action
None.
