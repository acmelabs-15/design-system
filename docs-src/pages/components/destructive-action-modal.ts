// Docs page: Destructive Action Modal — mirrors https://vercel.com/geist/destructive-action-modal
import type { Doc } from "../../site";

// The opener shows the modal.
const wire = "const m = root.querySelector('acme-destructive-modal');\nroot.querySelector('acme-button').addEventListener('click', () => m.show());";
// An open state: the modal opens as soon as the example mounts.
const show = "root.querySelector('acme-destructive-modal').show();";
const opener = (label: string) => `<acme-button size="small" variant="error">${label}</acme-button>`;
const project = (attrs = "") =>
  `<acme-destructive-modal heading="Delete Project" confirm-label="Delete Project" verification-label="project name" verification-phrase="my-project" irreversible-description="Deleting my-project cannot be undone."${attrs}>my-project and all its deployments will be permanently deleted.</acme-destructive-modal>`;
const boilerplate = `<acme-destructive-modal heading="Delete Project" confirm-label="Delete Project" verification-label="project name" verification-phrase="next-year-boilerplate" irreversible-description="Deleting next-year-boilerplate cannot be undone."><b>next-year-boilerplate</b> and all its deployments, domains, and environment variables will be permanently deleted.</acme-destructive-modal>`;
const reversible = `<acme-destructive-modal heading="Disable Vercel Authentication" confirm-label="Disable Vercel Authentication" verification-phrase="disable vercel authentication">Anyone will be able to view your deployments without being a member of your team.</acme-destructive-modal>`;

export const doc: Doc = {
  id: "destructive-action-modal",
  title: "Destructive Action Modal",
  lede: "A confirmation for destructive actions: the user must type a phrase before the primary button enables, and a red band can name what cannot be undone.",
  tags: ["acme-destructive-modal"],
  examples: [
    {
      h: "Default",
      p: "The primary button stays disabled until the typed text equals the phrase. The red band at the bottom names what cannot be undone.",
      html: `${opener("Delete Project")}${boilerplate}`,
      script: `${wire}\nm.addEventListener('acme-confirm', () => { m.loading = true; setTimeout(() => { m.loading = false; m.close(); }, 1500); });`,
    },
    {
      h: "Reversible",
      p: "Leave out irreversible-description when the action can be undone or re-enabled. The typed gate stays; the red band goes.",
      html: `${opener("Disable Vercel Authentication")}${reversible}`,
      script: `${wire}\nm.addEventListener('acme-confirm', () => m.close());`,
    },
    {
      h: "Loading",
      p: "loading disables both buttons and spins the primary one while the request runs. The caller owns open: the modal never closes itself on confirm.",
      html: `${opener("Delete Project")}${project(" loading")}`,
      script: wire,
    },
    {
      h: "With error",
      p: "error shows an inline message and keeps the modal open so the user can try again.",
      html: `${opener("Delete Project")}${project(' error="Couldn’t delete project. Try again."')}`,
      script: `${wire}\nm.addEventListener('acme-confirm', () => m.close());`,
    },
    {
      h: "Open",
      census: true,
      p: "The modal open on load: the 480px panel with the heading and the description, the red band, the prompt with the phrase above the empty verification input, and the footer with Cancel and the disabled red confirm.",
      html: boilerplate,
      script: show,
    },
    {
      h: "Open reversible",
      census: true,
      p: "A reversible action open: no red band; the typed gate stays.",
      html: reversible,
      script: show,
    },
    {
      h: "Open loading",
      census: true,
      p: "Loading: the input and both buttons disabled, the confirm showing its spinner.",
      html: project(" loading"),
      script: show,
    },
    {
      h: "Open with error",
      census: true,
      p: "With an error: the inline error line under the field; the modal stays open.",
      html: project(' error="Couldn’t delete project. Try again."'),
      script: show,
    },
    {
      h: "Open typed",
      census: true,
      p: "The verification phrase typed exactly: the confirm enables.",
      html: project(),
      script: `const m = root.querySelector('acme-destructive-modal');
m.show();
m.updateComplete.then(() => {
  const field = m.shadowRoot.querySelector('acme-input').input;
  field.value = 'my-project';
  field.dispatchEvent(new Event('input', { bubbles: true }));
});`,
    },
  ],
  practices: {
    "When to use": [
      "Prefer it over Modal when the action is destructive and deserves friction: delete, rotate, revoke, disconnect, downgrade, or disable a security setting. Typing the phrase proves intent.",
      "Use it for reversible actions too when the consequence is serious (disabling deployment protection, revoking a shared token). Keep the typed gate and leave out irreversible-description.",
      "Skip it for routine confirmations such as save draft, discard changes or close without saving; the typed gate is too heavy there. Use a plain Modal.",
    ],
    Behavior: [
      "The input gets focus on open so typing can start at once. The primary button stays disabled until the value equals verification-phrase exactly.",
      "Enter submits only when the gate is open; otherwise nothing happens. Cancel, a click outside and Escape all dismiss.",
      "loading disables both buttons. The caller owns open: close the modal after the request settles, or keep it open with an error so the user can retry.",
      "Match the success toast verb to the primary button: a Delete Project button gives a Project deleted toast, never Project removed.",
    ],
    Content: [
      "heading is Title Case, Verb + Noun, and a statement: Delete Project, not Delete this project?.",
      "The description is sentence case, names the consequence, and names the resource in bold: <b>my-project</b> and all its deployments will be permanently deleted. is stronger than a generic sentence.",
      "confirm-label equals the heading. Never Confirm, OK, Continue, or a bare verb such as Delete.",
      "cancel-label is Cancel unless Cancel is ambiguous, for example Keep Turn Running when the primary action is itself a cancellation.",
      'For an entity delete, the phrase is the resource name (my-project) with verification-label="project name", so the prompt reads To confirm, type the project name “my-project”. Use a lowercase verb phrase (disable vercel authentication) only when there is no entity to name.',
      "irreversible-description names the action and the resource and ends with cannot be undone.: Deleting my-project cannot be undone. Leave the attribute out for reversible actions.",
      "error carries the API failure in Vercel voice: Couldn't save settings. Try again. Never a raw error object.",
    ],
    Accessibility: [
      "The input's accessible name is the full prompt, and the prompt's for points at the field, so a screen reader announces To confirm, type the project name “my-project” on focus.",
      "The warning icon in the band is aria-hidden; the sentence carries the meaning.",
      "Focus stays inside the modal when an error appears, so the user can retry in place. After success, focus returns to the trigger.",
    ],
  },
};
