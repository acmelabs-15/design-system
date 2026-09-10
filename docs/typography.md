# Typography

Rules of typesetting throughout the system.

## Usage

The type styles are classes in tokens.css. Each class presets a combination of font-size, line-height, letter-spacing and font-weight. The families are Google Sans Flex for text and Google Sans Code for labels, numbers and code; the scale, the weights and the line heights are the system's.
For the Subtle and Strong modifiers, nest a &lt;strong&gt; element inside the element that carries the class:
&lt;p class="text-copy-16"&gt;
Copy 16 &lt;strong&gt;with Strong&lt;/strong&gt;
&lt;/p&gt;

## Headings

Used to introduce pages or sections.
Example · Class name · Usage
Heading 72 · text-heading-72 · —
Heading 64 · text-heading-64 · —
Heading 56 · text-heading-56 · —
Heading 48 · text-heading-48 · —
Heading 40 · text-heading-40 · —
Heading 32 with Subtle · text-heading-32 · —
Heading 24 with Subtle · text-heading-24 · —
Heading 20 with Subtle · text-heading-20 · —
Heading 16 with Subtle · text-heading-16 · —
Heading 14 · text-heading-14 · —

## Buttons

Only to be used within components that render buttons.
Example · Class name · Usage
Button 16 · text-button-16 · Largest button.
Button 14 · text-button-14 · Default button.
Button 12 · text-button-12 · Only used when a tiny button is placed inside an input field.

## Label

Designed for single lines, with ample line height for highlighting and for sitting beside icons.
Example · Class name · Usage
Label 20 · text-label-20 · —
Label 18 · text-label-18 · —
Label 16 with Strong · text-label-16 · Used in titles to help differentiate from regular.
Label 14 with Strong · text-label-14 · Most common text style of all. Used in many menus.
Label 14 Mono · text-label-14-mono · Largest form of mono, to pair with larger (&gt;14) text.
Label 13 with Strong, and Tabular (123) · text-label-13 · Used as a secondary line next to other labels. Tabular is used when conveying numbers for consistent spacing.
Label 13 Mono · text-label-13-mono · Used to pair with Label 14, as the smaller mono size looks better in that pairing.
Label 12 with Strong, AND CAPS · text-label-12 · Used for tertiary level text in busy views, like Comments, Show More and the capitals in Calendars.
Label 12 Mono · text-label-12-mono · —

## Copy

Designed for multiple lines of text, with a higher line height than Label.
Example · Class name · Usage
Copy 24 with Strong · text-copy-24 · For hero areas on marketing pages.
Copy 20 with Strong · text-copy-20 · For hero areas on marketing pages.
Copy 18 with Strong · text-copy-18 · Mainly for marketing, big quotes.
Copy 16 with Strong · text-copy-16 · Used in simpler, larger views like Modals where text can breathe.
Copy 14 with Strong · text-copy-14 · Most commonly used text style.
Copy 13 · text-copy-13 · For secondary text and views where space is a premium.
Copy 13 Mono · text-copy-13-mono · Used for inline code mentions.

