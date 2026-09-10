// Maps acme-modal (src/components/modal) to Geist Modal: the generator derives modal.styles.ts from
// this. The root is the panel (`[data-geist-modal]`, `.modal` in ours): the centred 540px box on
// desktop, or the bottom sheet the reference switches to at 600px and under (`.sheet`, read off
// the popup's classes). Inside it the body (padding 20 unless `padding={0}`, `.unpadded`), whose
// content wrapper holds the header (title, subtitle) and the slotted content, and whose two 1px
// probes tell the sticky header and footer when the body's ends scroll out of view: the reference
// toggles `group/sticky-top` and `peer/sticky-bottom` on the body for that, the attributes
// `data-top-hidden` and `data-bottom-hidden` on the panel in ours. The footer holds the slotted
// actions (modal-action.ts) and a div of them. The dialog, its backdrop and the inset are mapped
// on their own (modal-overlay.ts, modal-backdrop.ts, modal-inset.ts). Every open state is a sketch
// under tools/geist/sketch/modal.*.json; the page's own showcases render the closed opener only.
import { type GeistMap, has, type SpecNode } from "../gen";

export const closed = ["Default", "Sticky", "Single button", "Disabled actions", "Inset", "Control initial focus", "Focus an input on open", "Mobile sheet with inputs", "Combobox focus", "Toasts and focus trap"];
const bodyOf = (n: SpecNode) => n.children.find((c) => "data-geist-modal-body" in c.attrs);
const titleOf = (n: SpecNode) => bodyOf(n)?.children[0]?.children.find((c) => c.tag === "header")?.children.find((c) => c.tag === "h3");

export const geist: GeistMap = {
  page: "modal",
  component: "Modal",
  root: "data-geist-modal",
  ours: ".modal",
  skip: closed,
  defaults: { sheet: "false", padded: "true", center: "false" },
  derive: {
    sheet: (n) => String(has("pointer-events-auto")(n)),
    padded: (n) => String(!!bodyOf(n) && has("p-[var(--modal-padding)]")(bodyOf(n)!)),
    center: (n) => String(!!titleOf(n) && has("text-center")(titleOf(n)!)),
  },
  props: {
    sticky: { true: ".sticky" },
    allowOverflow: { true: ".overflow" },
    sheet: { true: ".sheet" },
    padded: { false: ".unpadded" },
    center: { true: ".center" },
    drawerVerticalScroll: { false: ".noscroll" },
  },
  // The body's runtime classes (its ends scrolled out of view) are the panel's attributes in ours.
  // A header that is the body's last child (nothing slotted after it): in ours a slot always follows it, so the element marks the case.
  states: { ".group/sticky-top": "[data-top-hidden]", ".peer/sticky-bottom": "[data-bottom-hidden]", ":last-child": "[data-last]" },
  // The sticky variant qualifies the header, title and body rules: the panel's own modifier.
  context: { ".sticky": ":where(.sticky)" },
  // The body's runtime classes carry no rules of their own: they are the states above.
  ignore: ["tailwind", "group/sticky-top", "peer/sticky-bottom"],
  // The consumer's content (paragraphs, a wrapper div) and the footer's action wrapper are slotted.
  slotted: ["div", "p"],
  children: [
    {
      ours: ".body",
      pick: (c) => "data-geist-modal-body" in c.attrs,
      children: [
        {
          ours: ".content",
          pick: 0,
          children: [
            {
              ours: ".header",
              pick: (c) => c.tag === "header",
              children: [
                { ours: ".title", pick: (c) => c.tag === "h3" },
                { ours: ".subtitle", pick: has("mt-2") },
              ],
            },
            // The inset is acme-modal-inset, mapped on its own; the rest is the consumer's slotted content.
            { ours: "", pick: (c) => c.tag !== "header", all: true, leaf: true },
          ],
        },
        { ours: ".probe-top", pick: has("absolute") },
        { ours: ".probe-bottom", pick: (c) => c.tag === "div" && !has("absolute")(c) && c.styles.length > 0 && c.children.length === 0 },
      ],
    },
    {
      ours: ".actions",
      pick: (c) => c.tag === "footer",
      // The actions are slotted acme-buttons (modal-action.ts), alone or in a div.
      children: [{ ours: "", pick: () => true, all: true, leaf: true }],
    },
    // The sheet's fade over its top edge, in a sticky wrapper (an inline style the element writes).
    { ours: ".fade-wrap", pick: (c) => (c.attrs.style ?? "").startsWith("position:sticky"), children: [{ ours: ".fade", pick: 0 }] },
  ],
};
