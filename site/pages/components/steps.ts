import type { Doc } from "../../site";
const steps = (linear = false) =>
  `<acme-steps aria-label="Account setup" ${linear ? "linear" : ""}><acme-step value="account"><acme-step-trigger>Account</acme-step-trigger></acme-step><acme-step value="profile"><acme-step-trigger>Profile</acme-step-trigger></acme-step><acme-step value="review"><acme-step-trigger>Review</acme-step-trigger></acme-step><acme-step-content slot="panels" value="account"><acme-field><span slot="label">Name</span><acme-input value="Alex"></acme-input></acme-field></acme-step-content><acme-step-content slot="panels" value="profile">Choose your profile details.</acme-step-content><acme-step-content slot="panels" value="review">Review your account.</acme-step-content><p slot="completed">Your setup is complete.</p><acme-steps-previous slot="actions"></acme-steps-previous><acme-steps-next slot="actions"></acme-steps-next></acme-steps>`;
export const doc: Doc = {
  id: "steps",
  title: "Steps",
  lede: "Progress through a named sequence with application-owned validation.",
  tags: ["acme-steps", "acme-step", "acme-step-trigger", "acme-step-content", "acme-steps-previous", "acme-steps-next"],
  examples: [
    { h: "Interactive steps", html: steps() },
    { h: "Linear progression", html: steps(true) },
    { h: "Vertical", html: steps(), script: 'root.querySelector("acme-steps").orientation="vertical";' },
    {
      h: "Validate before continuing",
      html: steps(true),
      script:
        'const steps=root.querySelector("acme-steps"),input=steps.querySelector("acme-input");input.value="";input.required=true;steps.addEventListener("acme-request",e=>{if(e.detail.previousValue===0&&e.detail.value>0&&!input.reportValidity())e.preventDefault();});',
    },
  ],
  practices: {
    Behavior: [
      "Give Steps an accessible name. Give each Step a unique key and each Step Content the matching value. Put content in the panels slot and navigation actions in the actions slot.",
      "value is a zero-based index. value=count explicitly means completion; completed reports that state and the completed slot becomes visible. Empty sequences are not complete. Indices beyond count report a diagnostic and block user progression.",
      "In non-linear mode, arrows, Home and End move focus without changing the step. Enter or Space activates the focused step. Linear mode uses Previous and Next for progression. Disabled steps are skipped.",
      "Before a user move, acme-request carries action=step, value and previousValue. Prevent the request to validate or await asynchronous work. Assign value after validation; programmatic writes stay silent. Accepted user moves emit one acme-change.",
      "Panel nodes stay mounted while hidden and inert, so form state survives navigation. Validate the active step explicitly. The component does not fetch, save or submit application data.",
      "Use Timeline for descriptive history or instructions that do not change an active panel.",
    ],
  },
};
