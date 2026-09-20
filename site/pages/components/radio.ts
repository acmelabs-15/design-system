// Docs page: Radio — mirrors https://vercel.com/geist/radio
import type { Doc } from "../../site";

const options = (gap = 24) => `<div class="vstack" style="gap:${gap}px"><acme-radio value="one">Option 1</acme-radio><acme-radio value="two">Option 2</acme-radio></div>`;

export const doc: Doc = {
  id: "radio",
  title: "Radio",
  lede: "One choice from a short set of options that the user can see all at once.",
  tags: ["acme-radio-group", "acme-radio"],
  examples: [
    { h: "Default", html: `<acme-radio-group label="Default Radio Example" value="one">${options()}</acme-radio-group>` },
    { h: "Radio disabled", html: `<acme-radio-group disabled label="Disabled Radio Example" value="one">${options()}</acme-radio-group>` },
    {
      h: "Radio required",
      html: `<form class="vstack" style="gap:24px;align-items:flex-start"><acme-radio-group label="Required Radio Example" required>${options(16)}</acme-radio-group><acme-button size="small" variant="primary">Submit</acme-button></form>`,
      script: `const form = root.querySelector("form");
form.addEventListener("submit", (e) => e.preventDefault());
root.querySelector("acme-button").addEventListener("click", () => form.requestSubmit());`,
    },
    {
      h: "Radio headless",
      p: "The group without its item markup: any label can wrap a bare radio.",
      html: `<acme-radio-group aria-label="Options" value="one"><div class="vstack" style="gap:24px"><label style="display:flex;justify-content:space-between"><span>Option 1</span><acme-radio value="one"></acme-radio></label><label style="display:flex;justify-content:space-between"><span>Option 2</span><acme-radio value="two"></acme-radio></label></div></acme-radio-group>`,
    },
    {
      h: "Radio standalone",
      p: "A single radio with no visible label, for custom UI.",
      html: `<li style="display:flex;gap:8px;list-style:none"><span>Option 1</span><acme-radio aria-label="Option 1" value="one" checked></acme-radio></li>`,
    },
  ],
  practices: {
    "When to use": [
      "One choice from two to six mutually exclusive options where seeing every option matters: deploy regions, plan tiers, billing cycle.",
      "Past six options, use Select or Combobox so the list does not take over the form.",
      "A binary on/off is a Toggle. An option with an icon, a description or a badge is a Choicebox.",
    ],
    Behavior: [
      "Pre-select the safest default so the field reads as configured, never as required-but-empty. Leave it empty only when the choice has real consequences and a deliberate pick is wanted.",
      "<code>required</code> goes on the group, not on one option. A single required radio means nothing.",
      "Arrow keys move the selection inside the group and skip disabled options. Tab moves to the next field, not the next radio.",
    ],
    Content: [
      "The group label is a Title Case noun such as <code>Deployment Region</code> or <code>Billing Cycle</code>, rendered as the legend or as a sibling label tied with <code>aria-labelledby</code>.",
      "Option labels are parallel: same part of speech, same length, same register. <code>Monthly</code> / <code>Yearly</code>, not <code>Monthly</code> / <code>Pay yearly</code>.",
      "A disabled option gets a Tooltip that says why (<code>Available on Pro and Enterprise</code>). A greyed radio with no reason looks broken.",
    ],
    Accessibility: [
      "Related radios sit in a <code>fieldset</code> with a <code>legend</code>, so screen readers announce the group name before each option.",
      "A standalone radio with no visible label needs an <code>aria-label</code> that describes the choice. A radio never ships without an accessible name.",
      "Keep the focus ring and its offset. A CSS hack that drops them leaves keyboard users unsure which option has focus.",
    ],
  },
};
