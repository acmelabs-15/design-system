---
id: RES-040
status: resolved # in-progress | resolved
outcome: answered
kind: research
from: IDEA-002#21 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
date: 2026-11-12
---
# RES-040: Variations, formats and license of Material Symbols

## Question
Which variations does Material Symbols have today (the styles outlined, rounded and sharp; the axes fill, weight, grade and optical size), in which formats and under which license?

Settled context: [DEC-123](../decisions/DEC-123-icon-component-and-icon-library.md) gives 1.0 an Icon component and an icon library that makes one component for each icon, with icons from "the new material design symbols". It names the variations as a point to consider and decides nothing about them.

Needed by IDEA-002#22 (which variations 1.0 ships, and which of them a consumer can change on one icon) and IDEA-003#12 (how the icon library makes one component for each icon).

## Answer
On 2026-11-12 the main session took the part on release 0.3.3 out of this record, after Peter's decision DEC-125 that release 0.3.3 is no input for 1.0. The facts on Material Symbols are as the research agent wrote them.

Answered. The sufficient-answer condition was:

1. the styles and axes from Google's own documentation, each axis with its range, steps and default;
2. the number of icons today, and how Google versions and releases the set;
3. every official distribution format, with content and size, and for SVG the exact combinations that exist as files;
4. how a variation is selected with the variable font and with SVG;
5. the license, and what it requires of a library that redistributes the icons;
6. whether Google released a newer set or major update since 2025, and how Material Symbols differs from Material Icons;
8. both sides of each disagreement between sources.

The record gives facts and sources only. It gives no recommendation.

### 1. Styles and axes
Material Symbols has three styles: Outlined, Rounded and Sharp. There is no separate Filled style; fill is an axis in all three. There is no two-tone style.

| Axis | Tag | Range in the variable font | Default | Steps that exist as SVG files |
|---|---|---|---|---|
| Fill | FILL | 0 to 1 (continuous) | 0 | 0 and 1 |
| Weight | wght | 100 to 700 (continuous) | 400 | 100, 200, 300, 400, 500, 600, 700 |
| Grade | GRAD | -50 to 200 (continuous) | 0 | -25, 0, 200 |
| Optical size | opsz | 20 to 48 (continuous) | 24 | 20, 24, 40, 48 |

The sources disagree on some of these values; section 8 lists each disagreement.

### 2. Number of icons, versions and releases
The count depends on the source:

- Google Fonts icon metadata: 3,945 Material Symbols icons, each in all three styles.
- GitHub `symbols/web` at master: 4,157 icon directories.
- The variable-font codepoints file: 4,304 names for 4,004 distinct codepoints. Some names are aliases.
- The Google guide: "over 2,500" and "3,800+".

Google gives the set no release number. The GitHub repository receives an automated "Update Symbols" commit about once a week. Its last tagged release is Material Icons 4.0.0 from 2020. Each icon in the Google Fonts metadata carries its own integer version. The Google Fonts CSS API serves the font under a version path (v385 on 2026-11-12). Between the pinned revision (2026-09-18) and master (2026-10-23), 22 icon directories were added and none were removed.

### 3. Official distribution formats
| Format | Where | What it holds | Size |
|---|---|---|---|
| Variable fonts | GitHub `variablefont/` | One TTF and one WOFF2 for each style, each with the axes FILL, GRAD, opsz and wght, plus a codepoints file | WOFF2: Outlined 4.0 MB, Rounded 5.4 MB, Sharp 3.5 MB. TTF: 10.7, 15.2 and 8.9 MB |
| Hosted font | Google Fonts CSS API | A static instance or a variable range for each style, subset by `icon_names` | The guide: 295 KB for all icons at default axes, 1.7 KB for three icons, 7.9 MB for all axes in full |
| SVG | GitHub `symbols/web/NAME/materialsymbolsSTYLE/` | 168 files for each icon and style, so 504 for each icon | 12,496,389 bytes for the six weight-400, grade-0, 24 px files of all 4,135 icons at the pinned revision (RES-014) |
| SVG and PNG | fonts.google.com/icons | A download of one icon at the chosen axes | One icon at a time |
| Android Vector Drawable and Apple Symbols | `symbols/android`, `symbols/ios`; the guide | Platform formats | Not measured |

Google publishes no npm package for Material Symbols. The npm package `material-design-icons` is Google's last package, version 3.0.1 from 2016, and holds only the classic Material Icons. Google's README names packages by one third-party maintainer (marella) and says Google does not monitor or vet them:

| Package (version on 2026-11-12) | Holds | Unpacked size |
|---|---|---|
| `material-symbols` 0.49.0 | Three variable WOFF2 fonts with all axes, CSS, Sass and type definitions | 13.1 MB |
| `@material-symbols/font-100` to `font-700` | Fonts for one weight | 1.6 MB (font-400) |
| `@material-symbols/svg-100` to `svg-700` | SVGs at one weight, grade 0 and optical size 48, for three styles and two fill states. Paths are `STYLE/NAME.svg` and `STYLE/NAME-fill.svg` | 13.2 MB and 23,673 files (svg-400) |
| `material-icons`, `@material-design-icons/font`, `@material-design-icons/svg` | Classic Material Icons only | 2.2 MB, 0.9 MB, 4.2 MB |

SVG combinations that exist as files, for each icon and each of the three styles: 7 weights × 3 grades × 2 fill states × 4 optical sizes = 168. File names follow this pattern:

- `NAME_24px.svg` is weight 400, grade 0, fill 0.
- `NAME_fill1_24px.svg` is fill 1.
- `NAME_wght300grad200fill1_48px.svg` combines several non-default values.
- The grade suffixes are `gradN25` and `grad200`.

No SVG file exists for any weight, grade or optical size between those steps. No SVG file exists for fractional fill. The README states that only the 20 and 24 px designs align exactly with the pixel grid.

### 4. Selecting a variation
With the font, the style is chosen by the font family:

- Material Symbols Outlined, Rounded or Sharp.
- With the CSS classes `material-symbols-outlined`, `-rounded` or `-sharp`.

The axes are chosen in two places:

- When the font loads, as static values or `min..max` ranges in the CSS API URL.
- At run time, with `font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 48`.

The axes can be animated with CSS. The icon is chosen by a ligature (the name as text) or by a codepoint.

With SVG, each combination is a separate file. The style is chosen by directory. Fill, weight, grade and optical size are chosen by the file-name suffix. An SVG does not respond to `font-variation-settings`. CSS size only scales the fixed drawing.

### 5. License and redistribution
Material Symbols is licensed under Apache License 2.0. Section 4 of the license sets four conditions for redistribution:

- (a) give recipients a copy of the license;
- (b) mark modified files with prominent notices of the change;
- (c) keep the copyright, patent, trademark and attribution notices in source form;
- (d) include the attribution notices of a NOTICE file, if the work has one.

The repository has no NOTICE file. The README says attribution in an app's about screen is welcome but not required.

### 6. Newer set, and Material Symbols compared with Material Icons
Material Symbols is the current set. Google introduced it in April 2022. The Google Fonts icon library labels it "Material Symbols (new)". The Google Fonts icon metadata lists only two set families, Material Icons (5 styles) and Material Symbols (3 styles).

This research found no newer Google icon set since 2025. The Material 3 icons page still presents Material Symbols as current and names no other set. The Material 3 Expressive posts that the search found do not mention icons. UNVERIFIED: no exhaustive search of every Expressive announcement was made.

Comparison of the two sets:

- Material Icons has five styles: Filled, Outlined, Rounded, Sharp and Two tone.
- Material Icons has only regular weight and grade, no variable font and no animated fill.
- Material Icons has received no new icons since 2022.
- Material Symbols has three styles, the four variable axes and no two-tone.

### 8. Disagreements between sources
- **Grade range.** The README says -50 to 200. The guide's CSS URLs use -50..200. The Google Fonts library slider and the SVG files offer -25, 0 and 200. The README suggests -50 for reversed contrast. The guide and the library use -25 for that case.
- **Fill range.** The README says "0 to 100". The guide and the font's CSS API say 0 to 1.
- **Default optical size.** The README and the guide's optimization section say 24. The library default is also 24. The guide's "Static font with Google Fonts" section says the default is 48.
- **Number of axes.** The guide, the README and Material 3 name four axes. The guide's optimization section also names a fifth axis, ROND (roundness, 0..100, default 50). The repository fonts carry only FILL, GRAD, opsz and wght. The CSS API answered "400: Font family not found" to a request with ROND.
- **Icon count.** The counts in section 2 differ: 3,945 in the Google Fonts metadata, 4,157 in the repository, 4,304 names in the codepoints file, and "over 2,500" or "3,800+" in the guide. The third-party npm SVG package has 3,945 icons in each style.
- **Optical size in npm SVGs.** The third-party `@material-symbols/svg-*` packages hold 48 px drawings.
- **Formats.** The guide says the git repository has the complete set in SVG. The README says static icons "do not have all the variations available". Both hold: the SVG files cover the discrete steps in section 3, not the continuous axes.

## Findings
- The Material Symbols guide states three styles and four axes. Fill is 0 (default) or 1. Weight is 100 to 700. Optical size is 20 to 48 dp. Grade examples are -25 and 200. The page states "Last updated 2024-09-26 UTC". Source: https://developers.google.com/fonts/docs/material_symbols#what_are_material_symbols, checked 2026-11-12.
- The guide says the default static font has weight 400, optical size 48, grade 0 and fill 0 in one section. In its optimization section, the default static font is "weight 400, optical size 24, round 50, grade 0, fill 0". That section's full-axis URL includes `ROND@...0..100`. Source: https://developers.google.com/fonts/docs/material_symbols#use_in_web, checked 2026-11-12.
- The guide gives the variable range URL `opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200` and selects axes with `font-variation-settings`. It also allows icon selection by ligature or codepoint and subsetting by `icon_names`. Source: https://developers.google.com/fonts/docs/material_symbols#use_in_web, checked 2026-11-12.
- The guide states payloads of 295 KB for all icons at default axes, 1.7 KB for three icons and 7.9 MB for all axes in full. It counts "over 2,500" glyphs in one place and "3,800+" icons in another. Source: https://developers.google.com/fonts/docs/material_symbols, checked 2026-11-12.
- The guide states the Apache License 2.0 and SVG or PNG downloads from the library. It says the git repository has the complete set in SVG and names Android Vector Drawable and Apple Symbols formats. Source: https://developers.google.com/fonts/docs/material_symbols#getting_material_symbols, checked 2026-11-12.
- The README states the following facts. Material Symbols is the current set, introduced in April 2022, and Material Icons is no longer updated. The three variable fonts are Outlined, Rounded and Sharp, with no separate Filled font. Optical size is 20 to 48 with default 24. Weight is 100 to 700 with regular 400. Grade is -50 to 200 with default 0. Fill is "0 to 100" with default 0. Only the 20 and 24 px designs align exactly with the pixel grid. The only pre-made fonts are variable. There are no two-tone icons. Source: https://github.com/google/material-design-icons/blob/master/README.md, checked 2026-11-12.
- The README says Google maintains no npm package past v3 (2016). It names the marella packages and states that Google does not monitor or vet them. It describes Material Icons as five styles, regular weight and grade only, with no new icons since 2022. It says attribution is welcome but not required. Source: https://github.com/google/material-design-icons/blob/master/README.md, checked 2026-11-12.
- `variablefont/` holds `MaterialSymbols{Outlined,Rounded,Sharp}[FILL,GRAD,opsz,wght]` as TTF (10,744,832 / 15,235,612 / 8,918,100 bytes) and WOFF2 (4,001,808 / 5,402,952 / 3,540,764 bytes), plus codepoints files. Source: https://api.github.com/repos/google/material-design-icons/contents/variablefont, checked 2026-11-12.
- The Outlined codepoints file has 4,304 names and 4,004 distinct codepoints. Source: https://github.com/google/material-design-icons/blob/master/variablefont/MaterialSymbolsOutlined%5BFILL,GRAD,opsz,wght%5D.codepoints, checked 2026-11-12.
- `symbols/web/home/materialsymbolsrounded/` holds 168 SVG files. They cover weights 100 to 700 in steps of 100, grades N25, 0 and 200, fill 0 and 1, and sizes 20, 24, 40 and 48 px. Each style directory follows the same naming. Source: https://api.github.com/repos/google/material-design-icons/contents/symbols/web/home/materialsymbolsrounded, checked 2026-11-12.
- `symbols/web` has 4,157 directories at master and 4,135 at 27e9ef1. The 22 additions include `apps_plus`, `markdown_document` and `person_eye`; nothing was removed. Source: https://api.github.com/repos/google/material-design-icons/git/trees (trees of `symbols/web` at master and at 27e9ef1dbeedc13d682fece4a58e1eda4cb0961a), checked 2026-11-12.
- Recent master commits are weekly "Update Symbols" commits. The newest is 10ecc147 on 2026-10-23, and 27e9ef1 was on 2026-09-18. The newest release is 4.0.0 "Material Icons 4.0.0" of 2020-08-31. Source: https://api.github.com/repos/google/material-design-icons/commits and https://api.github.com/repos/google/material-design-icons/releases, checked 2026-11-12.
- The repository license is Apache-2.0. No NOTICE file exists at master (HTTP 404). Section 4 of the LICENSE sets the redistribution conditions (a) to (d). Source: https://github.com/google/material-design-icons/blob/master/LICENSE lines 90-112, checked 2026-11-12.
- The Google Fonts icon metadata lists eight families: five Material Icons and three Material Symbols. It lists 3,945 icons in each Symbols style, each with sizes 20, 24, 40 and 48 px. Every icon carries its own version number; the highest is 472. Source: https://fonts.google.com/metadata/icons?key=material_symbols&incomplete=true, checked 2026-11-12.
- The Google Fonts icon library labels the set "Material Symbols (new)". Its controls show Fill, Weight 100 to 700 (default 400), Grade -25 (low) to 200 (default 0) and Optical Size 20 to 48 px (default 24). It links a download of all three variable fonts. Source: https://fonts.google.com/icons, checked 2026-11-12.
- The CSS API serves the full four-axis range for Material Symbols Outlined from font version v385. A request that adds ROND returns "400: Font family not found". Source: https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200, checked 2026-11-12.
- The Material 3 icons page presents Material Symbols in Outlined, Rounded and Sharp with four axes: weight, fill, optical size and grade. It names no other icon set. Source: https://m3.material.io/styles/icons/overview, checked 2026-11-12.
- npm `material-design-icons` latest is 3.0.1 (2016-09-02), Apache-2.0, from Google's repository. Source: https://registry.npmjs.org/material-design-icons, checked 2026-11-12.
- `material-symbols` 0.49.0 (2026-11-12, maintainer marella, Apache-2.0) is 13,112,246 bytes unpacked. It holds three variable WOFF2 fonts, CSS, Sass and `index.d.ts`. Source: https://registry.npmjs.org/material-symbols and https://data.jsdelivr.com/v1/packages/npm/material-symbols@0.49.0, checked 2026-11-12.
- `@material-symbols/svg-400` 0.49.0 has 23,673 files and is 13,173,033 bytes unpacked. It holds 7,890 files in each of `outlined`, `rounded` and `sharp`. Its README says its SVGs are fill 0 and 1 at grade 0 and opsz 48, with packages `svg-100` to `svg-700` for each weight. Source: https://registry.npmjs.org/@material-symbols%2Fsvg-400 and https://cdn.jsdelivr.net/npm/@material-symbols/svg-400@0.49.0/README.md, checked 2026-11-12.
- `@material-symbols/font-400` 0.49.0 is 1,631,013 bytes unpacked. `material-icons` 1.13.14 is 2,233,857 bytes. `@material-design-icons/font` 0.14.15 is 870,233 bytes. `@material-design-icons/svg` 0.14.15 is 4,199,609 bytes. All are by marella and Apache-2.0. Source: https://registry.npmjs.org, checked 2026-11-12.
- assets/licenses/material-symbols.txt is byte-identical to Google's current LICENSE file. Source: comparison with https://raw.githubusercontent.com/google/material-design-icons/master/LICENSE, checked 2026-11-12.

## Follow-ups
None.

## Next action
None.
