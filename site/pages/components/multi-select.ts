import type { Doc } from "../../site";
const options =
  '<acme-option value="design">Design</acme-option><acme-option value="engineering">Engineering</acme-option><acme-option value="support">Support</acme-option><acme-option value="finance" disabled>Finance</acme-option>';
export const doc: Doc = {
  id: "multi-select",
  title: "Multi Select",
  lede: "Choose several values from one option collection.",
  tags: ["acme-multi-select"],
  examples: [
    { h: "Default", html: `<acme-field><span slot="label">Teams</span><acme-multi-select placeholder="Choose teams">${options}</acme-multi-select></acme-field>` },
    {
      h: "Clearable",
      html: `<acme-multi-select aria-label="Teams" clearable>${options}</acme-multi-select>`,
      script: 'root.querySelector("acme-multi-select").defaultValue = ["design", "engineering"];',
    },
    {
      h: "Native form",
      html: `<form id="multi-select-form-example"><acme-field required><span slot="label">Teams</span><acme-multi-select required name="teams" placeholder="Choose teams">${options}</acme-multi-select></acme-field><acme-button type="submit">Save</acme-button><acme-button type="reset" variant="secondary">Reset</acme-button><output></output></form>`,
      script: "root.querySelector('form').addEventListener('submit',event=>{event.preventDefault();root.querySelector('output').textContent=new FormData(event.target).getAll('teams').join(', ');});",
    },
  ],
  practices: {
    Behavior: [
      "The root owns one immutable string array. Options derive their selected state from it.",
      "The trigger opens a multiselectable listbox. Arrow keys move its highlight; Space toggles a choice. Selection keeps the list open.",
      "Native form data contains one entry per selected enabled option under the root name. Options do not submit separate checkboxes.",
      "Use Field for labels, help and errors. Use unique nonempty option values.",
    ],
  },
};
