---
id: DEC-135
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-001#08 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-037, RES-039] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-135: The final names of the 145 components

The 1.0 list holds 145 concepts (DEC-133, DEC-134), and each one needs its final name. Three sources give the names: the rule of DEC-122 where the systems use different names, Peter's answers of 2026-11-12 for the ten ties that the rule leaves to him, and the name of the one system for a concept that only one system has.

## The names

- Layout, 20: Separator, Aspect Ratio, Scroll Area, Card, Grid, Bleed, Container, Item, Resizable, Group, Section, Sidebar, Stack, Box, Flex, Center, Absolute Center, Float, Wrap, Simple Grid.
- Typography, 13: Kbd, Blockquote, Code, Em, Heading, Link, Text, Highlight, List, Mark, Prose, Quote, Strong.
- Buttons and actions, 12: Button, Copy Button, Icon Button, Toggle, Toggle Group, Action Bar, Toolbar, Button Group, Close Button, Load More Button, Split Button, Text With Copy Button.
- Form controls, 32: Checkbox, Radio Group, Select, Slider, Switch, Input, Textarea, Combobox, Pin Input, Label, Segmented Control, Checkbox Card, Radio Card, Field, Fieldset, Native Select, Password Input, Checkbox Group, Color Picker, Editable, File Upload, Input Group, Listbox, Number Input, Rating, Tags Input, Clearable Input, Search Input, Multi Select, Radio, Theme Switcher, Questionnaire.
- Menus and selection, 5: Dropdown Menu, Context Menu, Command, Menubar, Dots Menu.
- Navigation, 7: Tabs, Breadcrumb, Pagination, Navigation Menu, Skip Nav, Steps, Tab Nav.
- Overlays, 9: Dialog, Alert Dialog, Popover, Tooltip, Toggle Tip, Hover Card, Sheet, Drawer, Floating Panel.
- Disclosure, 3: Accordion, Collapsible, Show More.
- Feedback and status, 8: Alert, Banner, Toast, Progress, Skeleton, Empty State, Error, Status.
- Data display, 15: Badge, Tag, Table, Data List, Stat, Timeline, Tree View, File Tree, Code Block, Snippet, Gauge, Color Swatch, QR Code, Attachment, Marker.
- Media and icons, 8: Avatar, Icon, Image, Video, Carousel, Marquee, Browser, Phone.
- Date and time, 4: Calendar, Date Picker, Date Input, Relative Time Card.
- Utilities, 5: Visually Hidden, Theme, Format Number, Format Byte, Portal.
- Other, 4: Bubble, Message, Message Scroller, Trace.

## Peter's decisions on the ties

- By the lead of the survey RES-039, which he accepted with "Mostly accept option 1 as is": Password Input (not Password Toggle Field), Copy Button (not Clipboard), Pin Input (not Input OTP or One-Time Password Field), Native Select (not Select (Native)).
- Where the survey gives no lead, by the agent's proposal, accepted with the same words: Bleed (not Inset), Item (not Entity), Status (not Status Dot), Checkbox Card and Radio Card (not Checkbox Cards and Radio Cards).
- Against the lead of the survey: Resizable (not Splitter). The survey found Splitter in three libraries and "Window Splitter" in the WAI-ARIA Authoring Practices, and Resizable in none. Peter asked "what is a splitter", got the explanation, and selected "Resizable".
- The eleventh tie, Direction Provider or Direction, needs no answer: the concept is out of the list.

## Names by the rule and by the one system

- DEC-122 gives these names, which most of the five systems use: Kbd, Radio Group, Switch, Input, Segmented Control, Dropdown Menu, Command, Breadcrumb, Dialog, Hover Card, Sheet, Accordion, Alert, Toast and Empty State.
- A concept that all its systems name alike keeps that name.
- A concept that one system has keeps that system's name. Peter saw these names in the three questions on the list and changed none.
- The agent writes each name as separate words: Absolute Center and Simple Grid, where Chakra UI writes AbsoluteCenter and SimpleGrid.

## Consequences

- Two names can mislead and stay as the rule gives them. Toggle is the button with an on and an off state; Geist uses that word for Switch. Sheet is the panel from the side; Chakra UI calls it Drawer, and Drawer is another component of the list.
- The glossary takes these names. Its entries from release 0.3.3 that name a component outside the list wait for IDEA-001#09 and the end of the idea.
- The tag name of each element and the export name in each framework package follow from these names; IDEA-003 and IDEA-004 decide their form.
