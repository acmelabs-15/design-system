import type { Doc } from "../../site";
const items = '<acme-segmented-control-item value="source">Source</acme-segmented-control-item><acme-segmented-control-item value="output">Output</acme-segmented-control-item>';
export const doc: Doc = {
  id: "segmented-control",
  title: "Segmented Control",
  tags: ["acme-segmented-control", "acme-segmented-control-item"],
  lede: "Select one value from a compact set of visible choices.",
  examples: [
    { h: "Default", html: '<acme-segmented-control aria-label="View" value="source">' + items + "</acme-segmented-control>" },
    {
      h: "Sizes",
      html:
        '<acme-h-stack gap="4">' +
        (["small", "medium", "large"] as const).map((size) => '<acme-segmented-control aria-label="View" size="' + size + '" value="source">' + items + "</acme-segmented-control>").join("") +
        "</acme-h-stack>",
    },
    {
      h: "Icons",
      html: '<acme-segmented-control aria-label="Layout" value="grid"><acme-segmented-control-item value="grid" aria-label="Grid"><acme-grid-view-icon></acme-grid-view-icon></acme-segmented-control-item><acme-segmented-control-item value="list" aria-label="List"><acme-view-list-icon></acme-view-list-icon></acme-segmented-control-item></acme-segmented-control>',
    },
    { h: "Vertical", html: '<acme-segmented-control orientation="vertical" aria-label="View" value="source">' + items + "</acme-segmented-control>" },
    { h: "Disabled", html: '<acme-segmented-control aria-label="View" value="source" disabled>' + items + "</acme-segmented-control>" },
    {
      h: "Native form",
      html:
        '<form id="segment-form"><acme-segmented-control aria-label="View" name="view" required>' +
        items +
        '</acme-segmented-control><acme-h-stack gap="2"><acme-button type="submit">Save view</acme-button><acme-button type="reset" variant="secondary">Reset view</acme-button></acme-h-stack><output></output></form>',
      script:
        'const form=document.querySelector("#segment-form");form.addEventListener("submit",event=>{event.preventDefault();form.querySelector("output").textContent=new FormData(form).get("view")??"No choice";});form.addEventListener("reset",()=>{form.querySelector("output").textContent="";});',
    },
  ],
  practices: {
    Selection: [
      "The root owns value, required validation and one form entry. Omitted value leaves the collection empty.",
      "Supply a unique nonempty value for each item. Programmatic writes stay silent; a user choice emits one acme-change with value.",
      "Use aria-label for icon-only items. Arrows and Space follow radio behavior; disabled choices are skipped.",
    ],
    Composition: [
      "Group provides the outline and arrangement. The shared visual indicator owns movement and resizing in both orientations.",
      "Use Tabs when choices select named panels. Use Switch for an on/off setting.",
      "Size belongs to the collection. Normal small/medium/large frame heights are 34/38/42px, including a one-pixel outline and four-pixel inset.",
    ],
  },
};
