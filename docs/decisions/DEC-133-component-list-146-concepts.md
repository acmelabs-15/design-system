---
id: DEC-133
status: accepted # proposed | accepted | superseded by DEC-NNN
kind: decision # architecture exactly when all three adr-test answers are true
adr-test:
  hard-to-reverse: false
  surprising: false
  real-trade-off: true
from: IDEA-001#07 # a row (IDEA-NNN#NN, SPEC-NNN#NN), an idea or spec (IDEA-NNN, SPEC-NNN), or user
evidence: [RES-032, RES-037] # the RES files this decision rests on
decided: 2026-11-12 by Peter
---
# DEC-133: The 1.0 list holds 146 concepts of the matrix

The comparison matrix (RES-037) holds 182 component concepts. The agent proposed in or out for each one, and Peter reviewed the proposal in three questions on 2026-11-12 and changed it with two rules of his own (DEC-130, DEC-132). The 1.0 list holds 146 concepts, and 36 are out. The names below are the names of the matrix; IDEA-001#08 decides the final names.

Changed on the same day by DEC-134 in one point: Progress Circle is no concept of its own, because Progress is one component that is linear or circular. The list then holds 145 concepts, and 37 are out.

## In, 146

- Layout, 20: Separator, Aspect Ratio, Scroll Area, Card, Grid, Bleed, Container, Item, Resizable, Group, Section, Sidebar, Stack, Box, Flex, Center, AbsoluteCenter, Float, Wrap, SimpleGrid.
- Typography, 13: Kbd, Blockquote, Code, Em, Heading, Link, Text, Highlight, List, Mark, Prose, Quote, Strong.
- Buttons and actions, 12: Button, Copy Button, Icon Button, Toggle, Toggle Group, Action Bar, Toolbar, Button Group, Close Button, Load More Button, Split Button, Text With Copy Button.
- Form controls, 32: Checkbox, Radio Group, Select, Slider, Switch, Input, Textarea, Combobox, Input OTP, Label, Segmented Control, Checkbox Cards, Radio Cards, Field, Fieldset, Native Select, Password Input, Checkbox Group, Color Picker, Editable, File Upload, Input Group, Listbox, Number Input, Rating, Tags Input, Clearable Input, Search Input, Multi Select, Radio, Theme Switcher, Questionnaire.
- Menus and selection, 5: Dropdown Menu, Context Menu, Command, Menubar, Dots Menu.
- Navigation, 7: Tabs, Breadcrumb, Pagination, Navigation Menu, Skip Nav, Steps, Tab Nav.
- Overlays, 9: Dialog, Alert Dialog, Popover, Tooltip, Toggle Tip, Hover Card, Sheet, Drawer, Floating Panel.
- Disclosure, 3: Accordion, Collapsible, Show More.
- Feedback and status, 9: Alert, Banner, Toast, Progress, Progress Circle, Skeleton, Empty State, Error, Status.
- Data display, 15: Badge, Tag, Table, Data List, Stat, Timeline, Tree View, File Tree, Code Block, Snippet, Gauge, Color Swatch, QR Code, Attachment, Marker.
- Media and icons, 8: Avatar, Icon, Image, Video, Carousel, Marquee, Browser, Phone.
- Date and time, 4: Calendar, Date Picker, Date Input, Relative Time Card.
- Utilities, 5: Visually Hidden, Theme, Format Number, Format Byte, Portal.
- Other, 4: Bubble, Message, Message Scroller, Trace.

## Out, 36

- Another concept of the list does its job, 7: Scroller (Scroll Area), Description (Heading and Text), Link Overlay (a Card that is a link), Accessible Icon (Icon), Checkmark and Radiomark (Checkbox and Radio Group), Form (Field and Fieldset).
- The same concept as another one, under another name or look, 6: Choicebox (Checkbox Cards and Radio Cards), Spinner and Loading Dots (Progress Circle), Error Card (Error), Pie Gauge (Gauge), the Code of Geist (Code Block).
- It belongs to the styling of Radix Themes, 1: Reset.
- A helper for React only, 9: Slot, Direction Provider, Locale Provider, Environment Provider, Client Only, Presence, For, Show, Overlay Manager.
- Made for the product of Vercel, 7: Address Input, Destructive Confirmation Input, Feedback, Filter Params, Project Banner, Destructive Action Modal, Book.
- Too narrow for 1.0, 3: MiddleTruncate, Download Trigger, JSON View.
- It wraps a third-party engine, 3: Rich Text Editor (Tiptap), Chart (Recharts), Data Table (TanStack Table).

## Peter's answers

- Batch 1 (Layout, Typography, Utilities): he kept the layout helpers and gave the rule of DEC-130; DEC-131 holds his words on their props. For Em, Strong, Quote, Mark, Link Overlay and Reset he selected "Text marks in, helpers out (Recommended)".
- Batch 2 (Buttons and actions, Form controls): his answer is DEC-132. Ten concepts moved in.
- Batches 3 to 5 (the other nine categories): "I accept - I think circlular progress and spinner are the same - prefer circular progress - everyting else option 1 - all ai components from shadcn should be in".
- On the reach of "all ai components": "I THINK shadcn doesn't export the AI components - I think those are recipes? If it does export them then so should we - if they're recipes and aren't exported then we shouldn't - should just include a blocks section in the docs like they do".

## How the agent applied his last two answers

- Spinner and Progress Circle are one concept for Peter, and he prefers "circular progress". The list holds Progress Circle, and Spinner is no concept of its own. DEC-130 would have put Spinner in with its four systems; this is his direct decision. IDEA-001#08 holds his choice of the name.
- shadcn/ui describes AI Elements this way: "AI Elements are patterns for building agentic interfaces. Each one is a composition of shadcn/ui components that you copy into your project. There is no package to install." Source: https://ui.shadcn.com/docs/ai-elements, checked 2026-11-12. So the 21 patterns are recipes by Peter's rule, and they are not in the list.
- The same page names Questionnaire, a component of shadcn/ui, as the replacement of the question element of AI SDK Elements, and the documentation lists it under the package `@shadcn/react`. So it is an AI component that shadcn/ui gives out as a component, and it moved in. It had been out in batch 2 as too narrow.

## Readings of the agent that Peter saw and did not correct

- Portal is in by DEC-130, although it is a helper of React in the three systems that have it.
- Text With Copy Button is in: Peter wrote "copy button" at its place in his list, and DEC-132 covers a composition.
- Choicebox and Form stay out: he did not name them in batch 2.
- Description and Scroller went out in batch 1, before he gave the rule of DEC-132. By that rule they could come in. They stay out until he says otherwise.

## Consequences

- IDEA-001#08 names the 146 concepts and IDEA-001#09 decides their parts. Each one then needs a design spec (IDEA-002) and a Lit component (IDEA-003).
- A concept from outside the matrix can still enter, case by case (DEC-129). None has been proposed.
- Recipes, such as the patterns of AI Elements, belong to a blocks section of the documentation; IDEA-001#11 holds that point.
