import type { Doc } from "../../site";

const viewport = "<acme-toast-viewport></acme-toast-viewport>";
const setup = 'const viewport=root.querySelector("acme-toast-viewport"); const store=window.acme.createToastStore(); viewport.store=store;';
export const doc: Doc = {
  id: "toast",
  title: "Toast",
  lede: "Scoped notifications with application-owned actions, a limited stack and polite announcements.",
  tags: ["acme-toast", "acme-toast-viewport"],
  examples: [
    {
      h: "Default",
      html: "<acme-button>Save changes</acme-button>" + viewport,
      script: setup + 'root.querySelector("acme-button").addEventListener("click",()=>store.add({description:"Changes saved",variant:"success"}));',
    },
    {
      h: "Treatments",
      html:
        '<acme-h-stack><acme-button data-variant="default">Notice</acme-button><acme-button data-variant="success">Success</acme-button><acme-button data-variant="warning">Warning</acme-button><acme-button data-variant="error">Error</acme-button></acme-h-stack>' +
        viewport,
      script:
        setup +
        'root.querySelectorAll("acme-button").forEach(button=>button.addEventListener("click",()=>store.add({description:button.dataset.variant==="error"?"Could not save changes. Try again.":button.dataset.variant==="warning"?"Some changes need review":"Changes saved",variant:button.dataset.variant})));',
    },
    {
      h: "Application action",
      p: "The action reports its identifier. The application completes the work and decides when to dismiss.",
      html: "<acme-button>Archive project</acme-button>" + viewport,
      script:
        setup +
        'root.querySelector("acme-button").addEventListener("click",()=>store.add({id:"archive",heading:"Project archived",description:"You can undo this change",duration:0,action:{id:"undo",label:"Undo"}})); viewport.addEventListener("acme-request",event=>{if(event.detail.action==="toast-action"&&event.detail.actionId==="undo")store.update(event.detail.id,{description:"Project restored",heading:undefined,action:undefined,duration:5000});});',
    },
    {
      h: "Visible limit and expansion",
      p: "Three messages are visible. Focus or hover expands the stack. Older hidden records remain in the store until dismissed.",
      html: "<acme-button>Add five messages</acme-button>" + viewport,
      script: setup + 'root.querySelector("acme-button").addEventListener("click",()=>{for(let i=1;i<=5;i++)store.add({description:"Saved change "+i,duration:0});});',
    },
    {
      h: "Authored content",
      p: "A direct Toast child keeps its content nodes. The record supplies plain announcement text.",
      html: '<acme-button>Show custom content</acme-button><acme-toast-viewport placement="top-end"><acme-toast toast-id="custom"><acme-strong>Export ready.</acme-strong> The report includes all selected projects.</acme-toast></acme-toast-viewport>',
      script: setup + 'root.querySelector("acme-button").addEventListener("click",()=>store.add({id:"custom",description:"Export ready. The report includes all selected projects.",duration:0}));',
    },
    {
      h: "Keyboard access",
      p: "Use the viewport focus method from an application-owned control or shortcut. Escape dismisses the focused message when dismissal is enabled.",
      html: "<acme-h-stack><acme-button data-add>Add notification</acme-button><acme-button data-focus>Focus notifications</acme-button></acme-h-stack>" + viewport,
      script:
        setup +
        'root.querySelector("[data-add]").addEventListener("click",()=>store.add({description:"Ready for review",duration:0}));root.querySelector("[data-focus]").addEventListener("click",()=>viewport.focus());',
    },
  ],
  practices: {
    Scope: [
      "Create a store explicitly and assign it to a viewport. Separate application scopes can use separate stores. Importing an unrelated component creates no notification queue.",
      "Records contain plain text and serializable action identifiers. Supply rich content as authored Toast children.",
    ],
    Behavior: [
      "The default duration is 5000 milliseconds. Set duration to 0 for a persistent notification.",
      "Timers preserve their remaining duration while hovered, focused, in a background document or without a connected presentation.",
      "Swipe horizontally toward the viewport edge to dismiss. Vertical scrolling remains available.",
      "Use update(id, patch), dismiss(id) and clear() for application-owned changes. A canceled action does not dismiss its message.",
    ],
    Accessibility: [
      "New and changed visible messages are announced politely. Hidden records do not receive focus or announcements.",
      "Use Field errors for invalid form controls and persistent Alert or Banner content for conditions that need a lasting explanation.",
      "Keyboard access belongs to the application. Provide a visible notifications control when messages contain important actions.",
    ],
  },
};
