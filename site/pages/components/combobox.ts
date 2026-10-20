import type { Doc } from "../../site";

const options =
  '<acme-option value="apple" section="Fruit">Apple</acme-option><acme-option value="apricot" section="Fruit">Apricot</acme-option><acme-option value="asparagus" section="Vegetables">Asparagus</acme-option><acme-option value="pear" section="Fruit">Pear<span slot="description">Seasonal fruit</span></acme-option>';
export const doc: Doc = {
  id: "combobox",
  title: "ComboBox",
  lede: "Search a ranked collection and choose one value.",
  tags: ["acme-combobox", "acme-option"],
  examples: [
    { h: "Ranked search", html: `<acme-field><span slot="label">Produce</span><acme-combobox placeholder="Search produce">${options}</acme-combobox></acme-field>` },
    { h: "Current value", html: `<acme-combobox aria-label="Produce" value="pear">${options}</acme-combobox>` },
    { h: "Loading", html: `<acme-combobox aria-label="Produce" loading placeholder="Loading produce"></acme-combobox>` },
    {
      h: "Custom filtering",
      html: `<acme-combobox aria-label="Produce">${options}</acme-combobox>`,
      script: 'root.querySelector("acme-combobox").filter=(options,query)=>options.filter(option=>option.label.toLocaleLowerCase().startsWith(query.toLocaleLowerCase()));',
    },
    {
      h: "Native form",
      html: `<form><acme-field required><span slot="label">Produce</span><acme-combobox name="produce" required>${options}</acme-combobox></acme-field><acme-button type="submit">Save</acme-button><acme-button type="reset" variant="secondary">Reset</acme-button><output></output></form>`,
      script: 'root.querySelector("form").addEventListener("submit",event=>{event.preventDefault();root.querySelector("output").textContent=new FormData(event.target).get("produce");});',
    },
  ],
  practices: {
    Behavior: [
      "Use direct Option children. Rich noninteractive content belongs inside an Option. Use section for a plain-text group label.",
      "Built-in filtering ranks value and label with match-sorter. The displayed and keyboard order follow the returned results. Repeated section runs preserve that ranking.",
      "inputValue holds editable search text. value holds the committed option. Unmatched text is never submitted as a new choice.",
      "Arrow keys move the highlight. Enter selects. Escape restores the selected label. Native text-editing keys keep their platform behavior.",
      "Custom filters return a unique ordered subset of the supplied options. Applications own asynchronous loading and option updates.",
    ],
  },
};
