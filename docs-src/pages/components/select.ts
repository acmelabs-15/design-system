// Docs page: Select — mirrors https://vercel.com/geist/select
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "select",
  title: "Select",
  lede: "Display a dropdown list of items.",
  tags: ["acme-select"],
  examples: [
    {
      h: "Size",
      html: `<div class="row" style="gap:16px;align-items:flex-start"><acme-select size="small" options='["Small"]' aria-label="Small"></acme-select><acme-select options='["Medium"]' aria-label="Medium"></acme-select><acme-select size="large" options='["Large"]' aria-label="Large"></acme-select></div>`,
    },
    {
      h: "Disabled",
      html: `<acme-select disabled options='["Disabled"]' style="max-width:220px"></acme-select>`,
    },
    {
      h: "Error",
      html: `<acme-select error="Select a framework." placeholder="Default with error" options='["Next.js","Astro"]' style="max-width:220px"></acme-select>`,
    },
    {
      h: "Label",
      html: `<acme-select label="My Label" options='["With label"]' style="max-width:220px"></acme-select>`,
    },
    {
      h: "With options and a placeholder",
      html: `<acme-select placeholder="Fruit" options='["Apple","Orange","Mango"]' style="max-width:220px"></acme-select>`,
    },
  ],
  practices: {
    "When to use": ["Short fixed lists under ~10 items; Combobox once filtering helps; MultiSelect for several values; Switch for a 2–3 option segmented choice."],
    Content: ["Title Case options that match canonical branding (Next.js); a short Title Case noun label; an action-oriented placeholder (Select a framework); validate on blur."],
  },
};
