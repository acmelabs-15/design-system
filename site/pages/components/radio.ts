import type { Doc } from "../../site";
export const doc: Doc = {
  id: "radio",
  title: "Radio",
  tags: ["acme-radio", "acme-radio-group", "acme-radio-card"],
  lede: "One choice from a visible set, with one selected value and one form owner.",
  examples: [
    { h: "No implicit choice", html: '<acme-radio-group aria-label="Plan"><acme-radio value="starter">Starter</acme-radio><acme-radio value="pro">Pro</acme-radio></acme-radio-group>' },
    {
      h: "Selected and disabled",
      html: '<acme-radio-group aria-label="Plan" value="starter"><acme-radio value="starter">Starter</acme-radio><acme-radio value="pro" disabled>Pro<span slot="description">Available after account verification.</span></acme-radio></acme-radio-group>',
    },
    {
      h: "Native form",
      html: '<form id="radio-form-example"><acme-radio-group aria-label="Plan" name="plan" required><acme-radio value="starter">Starter</acme-radio><acme-radio value="pro">Pro</acme-radio></acme-radio-group><acme-h-stack gap="2"><acme-button type="submit">Save plan</acme-button><acme-button type="reset" variant="secondary">Reset plan</acme-button></acme-h-stack><output></output></form>',
      script:
        'const form=document.querySelector("#radio-form-example");form.addEventListener("submit",event=>{event.preventDefault();form.querySelector("output").textContent=new FormData(form).get("plan")??"No choice";});form.addEventListener("reset",()=>{form.querySelector("output").textContent="";});',
    },
    {
      h: "Cards",
      html: '<div><acme-radio-group id="radio-card-example" aria-label="Billing" orientation="horizontal"><acme-group attached outline align-items="stretch" variant="secondary"><acme-radio-card value="monthly"><span slot="heading">Monthly</span><span slot="description">Pay each month.</span><acme-button id="billing-details" slot="actions" size="small" variant="tertiary">Billing details</acme-button></acme-radio-card><acme-radio-card value="yearly"><span slot="heading">Yearly</span><span slot="description">Pay once a year.</span></acme-radio-card></acme-group></acme-radio-group><output id="billing-output">No choice</output><p><output id="billing-help"></output></p></div>',
      script:
        'document.querySelector("#radio-card-example").addEventListener("acme-change",event=>{document.querySelector("#billing-output").textContent=event.detail.value;});document.querySelector("#billing-details").addEventListener("click",()=>{document.querySelector("#billing-help").textContent="The application owns billing details.";});',
    },
    {
      h: "Standalone name groups",
      html: '<form><acme-h-stack gap="4"><acme-radio name="standalone-plan" value="starter">Starter</acme-radio><acme-radio name="standalone-plan" value="pro">Pro</acme-radio></acme-h-stack></form>',
    },
    {
      h: "Right-to-left",
      html: '<acme-radio-group aria-label="Plan" dir="rtl" orientation="horizontal"><acme-radio value="starter">Starter</acme-radio><acme-radio value="pro">Pro</acme-radio></acme-radio-group>',
    },
  ],
  practices: {
    Selection: [
      "Supply a nonempty value for each option. Radio Group starts empty until value is supplied; it does not select the first item automatically.",
      "Use value/defaultValue on the group. A standalone Radio has checked/defaultChecked. Programmatic changes stay silent; user changes emit acme-change with value.",
      "Standalone Radio components coordinate only with other Radio components sharing their name, native form and tree scope. Use Radio Group for an explicit collection.",
    ],
    Keyboard: [
      "Tab enters the selected enabled option, or the first enabled option. Arrows select the next option and skip disabled members. Horizontal keys follow the current reading direction.",
      'loop defaults to true. Set loop="false" to stop at the edges. Space selects the focused radio.',
      "A Toolbar owns arrow navigation when it contains the radio collection; moving through a Toolbar must not change selection.",
    ],
    Forms: [
      "The group submits one selected enabled member. Owned members do not submit duplicates.",
      "Required follows native radio semantics: a selected disabled option satisfies the selection requirement but contributes no successful form entry. Applications should supply an enabled value when they require submitted data.",
      "Validate the group and supply an accessible name through aria-label, aria-labelledby or the surrounding form-group structure.",
    ],
    Composition: [
      "General Group supplies attachment and appearance. It never owns the radio value.",
      "Independent actions use the card actions slot and their own handlers. The native label surface holds selectable content only.",
    ],
  },
};
