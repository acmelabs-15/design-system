// Docs page: Choicebox — mirrors https://vercel.com/geist/choicebox
import type { Doc } from "../../site";

const items = `<acme-choicebox-item description="Free for two weeks" title="Pro Trial" value="trial"></acme-choicebox-item><acme-choicebox-item description="Get started now" title="Pro" value="pro"></acme-choicebox-item>`;

export const doc: Doc = {
  id: "choicebox",
  title: "Choicebox",
  lede: "A large Radio or Checkbox: a bigger tap target with room for more detail.",
  tags: ["acme-choicebox", "acme-choicebox-item"],
  examples: [
    {
      h: "Single-select",
      html: `<acme-choicebox label="select a plan" type="radio" value="trial">${items}</acme-choicebox>`,
    },
    {
      h: "Multi-select",
      html: `<acme-choicebox label="select a plan" type="checkbox">${items}</acme-choicebox>`,
    },
    {
      h: "Disabled",
      html: `<div class="vstack" style="gap:24px;align-items:stretch"><acme-choicebox disabled label="Choicebox group disabled" show-label type="radio">${items}</acme-choicebox><acme-choicebox label="Single input disabled" show-label type="checkbox"><acme-choicebox-item description="Free for two weeks" disabled title="Pro Trial" value="trial"></acme-choicebox-item><acme-choicebox-item description="Get started now" title="Pro" value="pro"></acme-choicebox-item></acme-choicebox></div>`,
    },
    {
      h: "Custom content",
      p: "Content inside a tile shows once the tile is selected.",
      html: `<acme-choicebox label="select a plan" type="radio" value="trial"><acme-choicebox-item description="Free for two weeks" title="Pro Trial" value="trial"><div style="display:flex;justify-content:center;padding:8px"><acme-badge variant="trial">Trial</acme-badge></div></acme-choicebox-item><acme-choicebox-item description="Get started now" title="Pro" value="pro"><div style="display:flex;justify-content:center;padding:8px"><acme-badge variant="blue">Pro</acme-badge></div></acme-choicebox-item></acme-choicebox>`,
    },
    {
      h: "Control at start", census: true,
      p: 'control-position="start" puts every tile\'s control before its title; the title block then fills the row.',
      html: `<acme-choicebox control-position="start" label="select a plan" type="radio" value="trial">${items}</acme-choicebox>`,
    },
    {
      h: "Interactive content", census: true,
      p: "interactive-content renders the selected tile's content beside the label: clicks inside it do not toggle the tile.",
      html: `<acme-choicebox label="select a plan" type="radio" value="trial"><acme-choicebox-item description="Free for two weeks" interactive-content title="Pro Trial" value="trial"><div style="display:flex;justify-content:center;padding:8px"><acme-badge variant="trial">Trial</acme-badge></div></acme-choicebox-item><acme-choicebox-item description="Get started now" interactive-content title="Pro" value="pro"><div style="display:flex;justify-content:center;padding:8px"><acme-badge variant="blue">Pro</acme-badge></div></acme-choicebox-item></acme-choicebox>`,
    },
    {
      h: "Disabled with reason", census: true,
      p: "A disabled tile with disabled-reason shows the reason in a tooltip.",
      html: `<acme-choicebox disabled label="Choicebox group disabled" show-label type="radio"><acme-choicebox-item description="Free for two weeks" disabled-reason="Available on Pro" title="Pro Trial" value="trial"></acme-choicebox-item><acme-choicebox-item description="Get started now" disabled-reason="Available on Pro" title="Pro" value="pro"></acme-choicebox-item></acme-choicebox>`,
    },
    {
      h: "Custom content disabled", census: true,
      p: "A selected tile keeps showing its content while disabled; the divider under its row is drawn for enabled tiles only.",
      html: `<acme-choicebox disabled label="select a plan" type="radio" value="trial"><acme-choicebox-item description="Free for two weeks" title="Pro Trial" value="trial"><div style="display:flex;justify-content:center;padding:8px"><acme-badge variant="trial">Trial</acme-badge></div></acme-choicebox-item><acme-choicebox-item description="Get started now" title="Pro" value="pro"><div style="display:flex;justify-content:center;padding:8px"><acme-badge variant="blue">Pro</acme-badge></div></acme-choicebox-item></acme-choicebox>`,
    },
  ],
  practices: {
    "When to use": [
      "A choice that gains from a larger tap target plus a description or an icon: a framework picker, a plan comparison, a deployment region with its latency.",
      "Single-select for choices that exclude each other, multi-select for choices that add up. Do not mix the two in one group.",
      "At most 4–6 tiles. Past that, use Select or Combobox so one field does not scroll the page. Plain text labels with no description are a Radio.",
    ],
    Behavior: [
      "The whole tile is the click and focus target; a tap anywhere inside selects it. Do not nest buttons or links that would take the click.",
      "The selected state shows a check or a filled dot in the corner. The border highlight alone is not enough on a low-contrast screen.",
      "A disabled tile needs a Tooltip that says why (Available on Pro). A faded tile with no reason reads as broken.",
    ],
    Content: [
      "Titles are parallel: one Title Case title and one sentence-case description per tile, ending in a period.",
      "The description does not repeat the title. It adds the differentiator ($20/mo · 100 GB bandwidth), not a synonym.",
      "An icon next to a title is decorative; when the icon is the only label, give the tile an aria-label that names the choice.",
    ],
    Accessibility: [
      "Tiles are radios or checkboxes underneath, so keep them in a fieldset with a legend and screen readers announce the group.",
      "Arrow keys move within a single-select group; Space toggles in a multi-select group. Do not override those keys.",
      "Color is not the selection signal. The highlight border pairs with the corner check so colorblind users see what is active.",
    ],
  },
};
