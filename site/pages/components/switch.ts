import type { Doc } from "../../site";

export const doc: Doc = {
  id: "switch",
  title: "Switch",
  tags: ["acme-switch"],
  lede: "Turn one setting on or off.",
  examples: [
    { h: "Default", html: '<acme-h-stack gap="4"><acme-switch>Notifications</acme-switch><acme-switch checked>Product updates</acme-switch></acme-h-stack>' },
    {
      h: "Sizes",
      html: '<acme-h-stack gap="4"><acme-switch size="small">Small</acme-switch><acme-switch size="medium">Medium</acme-switch><acme-switch size="large">Large</acme-switch></acme-h-stack>',
    },
    { h: "Label position", html: '<acme-v-stack gap="2"><acme-switch label-position="start">Label first</acme-switch><acme-switch label-position="end">Control first</acme-switch></acme-v-stack>' },
    { h: "Disabled", html: '<acme-h-stack gap="4"><acme-switch disabled>Unavailable</acme-switch><acme-switch disabled checked>Enabled elsewhere</acme-switch></acme-h-stack>' },
    {
      h: "Native form",
      html: '<form id="switch-form"><acme-switch name="updates" required value="yes">Product updates</acme-switch><acme-h-stack gap="2"><acme-button type="submit">Save setting</acme-button><acme-button type="reset" variant="secondary">Reset setting</acme-button></acme-h-stack><output></output></form>',
      script:
        'const form=root.querySelector("#switch-form");form.addEventListener("submit",event=>{event.preventDefault();form.querySelector("output").textContent=new FormData(form).get("updates")??"Off";});form.addEventListener("reset",()=>{form.querySelector("output").textContent="";});',
    },
    { h: "Optional ripple", html: "<acme-switch ripple>Enable animation previews</acme-switch>" },
  ],
  practices: {
    State: [
      "checked is the current Boolean value. defaultChecked supplies the native reset value. The application owns persistence.",
      "Programmatic assignments stay silent. User actions emit acme-change with checked after the native form state is synchronized.",
      "An unchecked or disabled Switch contributes no form entry. Required uses native checkbox validation.",
    ],
    Access: [
      "Supply visible label text or aria-label. Keep the same label in both states.",
      "Space toggles the native control. The thumb respects live reduced-motion preferences; optional ripple does not own its movement.",
    ],
  },
};
