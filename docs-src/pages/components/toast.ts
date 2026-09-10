// Docs page: Toast — mirrors https://vercel.com/geist/toast
import type { Doc } from "../../site";

const button = `<acme-button>Show Toast</acme-button>`;
const show = (call: string) => `root.querySelector("acme-button").addEventListener("click", () => window.acme.toasts.${call});`;
/** A message with markup: a node the toast takes as its text. */
const markup = (inner: string) => `Object.assign(document.createElement("span"), { innerHTML: '${inner}' })`;
const one = "The Evil Rabbit jumped over the fence.";
const twice = "The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence again.";

// Census: every state the reference draws on the client, one viewport per example on a queue of its own; the census run fills them.
const viewport = `<acme-toaster></acme-toaster>`;
const own = `root.querySelector("acme-toaster").queue = window.acme.createToastQueue();`;

export const doc: Doc = {
  id: "toast",
  title: "Toast",
  lede: "A succinct message that is displayed temporarily.",
  tags: ["acme-toast", "acme-toaster"],
  examples: [
    { h: "Default", html: button, script: show(`message({ text: "${one}" })`) },
    {
      h: "Multi-line",
      html: button,
      script: show(`message({ text: "The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the fence." })`),
    },
    {
      h: "With jsx",
      html: button,
      script: show(`message({ text: ${markup('<span style="font-weight:600;letter-spacing:-.28px">The Evil Rabbit</span> jumped over the fence.')}, preserve: true })`),
    },
    {
      h: "With a link",
      html: button,
      script: show(`message({ text: ${markup('The Evil Rabbit jumped over the fence. The Evil Rabbit jumped over the <a href="/geist">fence again</a>.')}, preserve: true })`),
    },
    { h: "Preserve", html: button, script: show(`message({ text: "${one}", preserve: true })`) },
    { h: "Action", html: button, script: show(`message({ text: "${twice}", action: "Undo" })`) },
    { h: "Undo", html: button, script: show(`message({ text: "${twice}", onUndoAction: () => 0 })`) },
    { h: "Success", html: button, script: show(`success("${one}")`) },
    { h: "Warning", html: button, script: show(`warning("${one}")`) },
    { h: "Error", html: button, script: show(`error("${one}")`) },
    { h: "Single", census: true, p: "One default toast at rest.", html: viewport, script: own },
    { h: "Success toast", census: true, p: "The success toast: a blue fill with the contrast foreground.", html: viewport, script: own },
    { h: "Warning toast", census: true, p: "The warning toast: an amber fill with the gray-1000 foreground.", html: viewport, script: own },
    { h: "Error toast", census: true, p: "The error toast: a red fill with the contrast foreground.", html: viewport, script: own },
    { h: "Action and cancel", census: true, p: "A toast with an action and a named cancel action: the row of two small buttons replaces the dismiss control.", html: viewport, script: own },
    { h: "Error action", census: true, p: "The action row on an error toast.", html: viewport, script: own },
    { h: "Warning action", census: true, p: "The action row on a warning toast.", html: viewport, script: own },
    { h: "Undo control", census: true, p: "An undo handler adds a square tertiary undo button before the dismiss control.", html: viewport, script: own },
    { h: "Without close", census: true, p: "hideX drops the dismiss control and the message spans the row.", html: viewport, script: own },
    { h: "Visual", census: true, p: "A visual block above the message; the toast clips its content.", html: viewport, script: own },
    { h: "Full bleed visual", census: true, p: "fullBleed drops the padding.", html: viewport, script: own },
    { h: "Centered", census: true, p: "The centered viewport.", html: `<acme-toaster center></acme-toaster>`, script: own },
    { h: "Stack", census: true, p: "Three toasts: the newest in front, the others collapsed behind it.", html: viewport, script: own },
    { h: "Stack expanded", census: true, p: "The pointer over the area expands the stack.", html: viewport, script: own },
    { h: "Entering", census: true, p: "A toast just mounted, before its entry transition.", html: viewport, script: own },
    { h: "Leaving", census: true, p: "A toast on its way out.", html: viewport, script: own },
  ],
  practices: {
    "When to use": [
      "A toast is a non-blocking acknowledgment of an action the user started: Domain added, Project archived, Deployment canceled.",
      "A billing failure, a permission denial or a build failure the user must triage needs more than a toast: pair a toast of six words or fewer (Build failed) with a persistent row that carries the recovery step and a stable identifier.",
      "Field validation belongs on the Input, not in a toast. A persistent configuration warning belongs in a Note or a Banner.",
      'Pick the method by how the user experienced the event, not by HTTP status. A user-canceled deploy is <code>toasts.message("Deployment canceled")</code>, not success; a partial deploy with skipped routes is <code>toasts.warning(...)</code>.',
    ],
    Behavior: [
      "Toasts auto-dismiss by default; pass <code>preserve</code> only when the user must read or act on the message first.",
      "An undo snackbar stays 5–10 seconds and pairs the past-tense message with a single Undo button.",
      "Do not narrate one async flow with a stack of toasts; emit the success or error toast at the last step.",
    ],
    Content: [
      "One sentence, sentence case, no trailing period when the toast is a single sentence.",
      "A completion toast reads {Noun} {past participle}: Blob deleted, Domain added, Environment variable saved. Never successfully; the verb implies it.",
      "An error toast is two sentences with periods and ends with a recovery step: Couldn’t verify domain. Try again. Use Couldn’t for user-state errors and Failed to for system errors, and keep one form through a flow.",
      "Match the toast verb to the destructive button verb (Delete Project, then Project deleted; never Project removed).",
      "An undo snackbar uses the literal label Undo, never Restore, Bring Back or Cancel, and only when the rollback is safe.",
    ],
    Accessibility: [
      'The toast region announces with <code>aria-live="polite"</code>; keep assertive for blocking errors that interrupt a flow.',
      "No primary navigation inside a toast; a transient surface is gone before a keyboard user reaches it.",
    ],
  },
};
