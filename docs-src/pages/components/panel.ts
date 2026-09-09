// Docs page: Panel (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "panel",
  title: "Panel",
  lede: "The dashboard card: radius 6, a shadow border, a 56px head, a body, a footer. Panels lays several out in columns.",
  tags: ["acme-panel", "acme-panel-head", "acme-panel-foot", "acme-panels"],
  house: true,
  examples: [
    {
      h: "Default",
      html: `<acme-panel heading="Environment Variables" sub="Values are encrypted at rest." when="Updated 2h ago"><acme-button slot="actions" size="small">Add</acme-button><p class="text-copy-14">Three variables in Production.</p><acme-panel-foot slot="footer" tinted>Learn more about <a href="#">environment variables</a>.<acme-button slot="actions" size="small" variant="primary">Save</acme-button></acme-panel-foot></acme-panel>`,
    },
    {
      h: "Variants",
      html: `<acme-panels columns="2"><acme-panel variant="danger" heading="Delete Project" sub="This cannot be undone."><acme-panel-foot slot="footer" tinted><acme-button slot="actions" size="small" variant="error">Delete</acme-button></acme-panel-foot></acme-panel><acme-panel variant="warning" heading="Trial Ending Soon" sub="3 days left."><acme-panel-foot slot="footer" tinted><acme-button slot="actions" size="small" variant="primary">Add Payment Method</acme-button></acme-panel-foot></acme-panel></acme-panels>`,
    },
    {
      h: "Chart panel and a bare head",
      html: `<acme-panel chart tight><acme-panel-head slot="head" heading="Requests" sub="Last 24 hours"><acme-switch slot="actions" size="small" value="1d" aria-label="Range" options='[{"value":"1d","label":"1d"},{"value":"7d","label":"7d"}]'></acme-switch></acme-panel-head><acme-chart height="120"><svg viewBox="0 0 600 120" preserveAspectRatio="none" style="width:100%;height:100%"><polyline fill="none" stroke="var(--chart-1)" stroke-width="2" points="0,100 150,60 300,80 450,30 600,50"/></svg></acme-chart></acme-panel>`,
    },
  ],
};
