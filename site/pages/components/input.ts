// Docs page: Input — mirrors https://vercel.com/geist/input
import type { Doc } from "../../site";

// A bare sprite icon (no utility class): the place sizes it, and it takes the color of its surroundings, as an icon does.
const up = (slot: string) =>
  `<svg slot="${slot}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" style="color:currentColor" aria-hidden="true"><use href="#i-arrow-circle-up"/></svg>`;
// Text in a place, which reads the same whether the place is attached to the field or inside it.
const text = (slot: string, s: string) => `<span slot="${slot}">${s}</span>`;

export const doc: Doc = {
  id: "input",
  title: "Input",
  lede: "Retrieve text input from a user.",
  tags: ["acme-input"],
  examples: [
    {
      h: "Default",
      html: `<div class="row" style="gap:16px;align-items:flex-start;justify-content:space-between"><acme-input placeholder="Small" size="small"></acme-input><acme-input placeholder="Default"></acme-input><acme-input placeholder="Large" size="large"></acme-input></div>`,
    },
    {
      h: "Add-ons and in-field places",
      p: "An add-on is attached to the outside of the field: its own ground, and a hairline where the two meet. A <code>start</code> or <code>end</code> sits inside the field's own box. Each place takes text or an element alike.",
      html: `<div class="vstack" style="gap:24px;align-items:flex-start">
  <acme-input placeholder="Default">${up("start-addon")}</acme-input>
  <acme-input placeholder="Default">${up("end-addon")}</acme-input>
  <acme-input placeholder="Default">${text("start-addon", "https://")}${text("end-addon", ".com")}</acme-input>
  <acme-input placeholder="Default">${up("start")}${up("end")}</acme-input>
  <acme-input placeholder="Default">${text("start-addon", "vercel/")}${up("end")}</acme-input>
</div>`,
    },
    {
      h: "Disabled",
      html: `<div class="vstack" style="gap:16px;align-items:flex-start">
  <acme-input disabled placeholder="Disabled with placeholder"></acme-input>
  <acme-input disabled value="Disabled with value"></acme-input>
  <acme-input disabled placeholder="Disabled with a start add-on">${up("start-addon")}</acme-input>
  <acme-input disabled placeholder="Disabled with an end add-on">${up("end-addon")}</acme-input>
  <acme-input disabled placeholder="Disabled with add-ons">${text("start-addon", "https://")}${text("end-addon", ".com")}</acme-input>
  <acme-input disabled placeholder="Disabled with in-field places">${up("start")}${up("end")}</acme-input>
</div>`,
    },
    {
      h: "Search",
      p: "Escape clears the field.",
      html: `<acme-search placeholder="Enter some text..."></acme-search>`,
    },
    {
      h: "⌘K",
      p: "Shows the ⌘ K keycaps to say the field opens a command palette. Once the field has text, the keycaps turn into Esc.",
      html: `<acme-search cmdk placeholder="Enter some text..."></acme-search>`,
    },
    {
      h: "Error",
      html: `<div class="vstack" style="gap:32px;align-items:flex-start">
  <div><acme-input error="An error message." placeholder="long-error@gmail.com" size="small"></acme-input></div>
  <div><acme-input error="An error message." placeholder="long-error@gmail.com" size="medium"></acme-input></div>
  <div><acme-input error="An error message." placeholder="long-error@gmail.com" size="large"></acme-input></div>
</div>`,
    },
    {
      h: "Label",
      html: `<div class="vstack" style="align-items:flex-start"><acme-input label="Label" placeholder="Label"></acme-input></div>`,
    },
    {
      h: "Rounded with add-ons",
      html: `<acme-input placeholder="Label example" rounded>${text("start-addon", "www.")}${text("end-addon", ".com")}</acme-input>`,
    },
    {
      h: "Rounded with in-field places",
      html: `<acme-input placeholder="Label example" rounded>${text("start", "www.")}${text("end", ".com")}</acme-input>`,
    },
  ],
  practices: {
    "When to use": [
      "Input takes one line of free text: a name, a domain, a token.",
      "Textarea takes over as soon as the content can wrap to more lines.",
      "Combobox is for a value from a known list the user filters by typing.",
      "An inline search box is Search Input with a scoped placeholder like Search projects; do not drop a Search Input into an unrelated form.",
    ],
    Behavior: [
      "Validate on blur, not on every keystroke; pass the message as the error attribute.",
      "Trim leading and trailing whitespace before submit, so  example.com and example.com resolve to one value.",
      "Keep the field focusable while saving; pair disabled with a spinner only when input is impossible.",
      "Do not wrap a labelled Input in a Tooltip; put the explainer on a sibling icon button so the label stays announced.",
    ],
    Content: [
      "Labels are short Title Case nouns: Project Name, Domain, Environment Variable Name.",
      "Placeholders show an example value (my-awesome-project, example.com), never an instruction like Enter your project name.",
      "Helper text is sentence case, one sentence with a period, on a sibling element wired through aria-describedby.",
      "Validation names the field and the constraint, ends in a period and skips please: Project name is required. Code must be 6 digits.",
    ],
    Accessibility: [
      "A label attribute needs an id on the element so the label and the control stay associated for screen readers.",
      "An icon-only affordance in a row of inputs is a circle svg-only Button with an aria-label, never a bare icon.",
      "A Search Input placeholder names the scope (Search projects) so the role is clear without sight.",
    ],
  },
};
