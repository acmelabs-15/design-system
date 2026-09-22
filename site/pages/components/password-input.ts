import type { Doc } from "../../site";
export const doc: Doc = {
  id: "password-input",
  title: "Password Input",
  house: true,
  lede: "A native password field with a labelled visibility action.",
  tags: ["acme-password-input"],
  examples: [
    { h: "Default", html: '<acme-field><span slot="label">Password</span><acme-password-input name="password" autocomplete="current-password"></acme-password-input></acme-field>' },
    {
      h: "New password",
      html: '<acme-field required><span slot="label">New password</span><acme-password-input required minlength="12" autocomplete="new-password"></acme-password-input><span slot="help">Use at least 12 characters.</span></acme-field>',
    },
    { h: "Without reveal", html: '<acme-password-input revealable="false" aria-label="Secret token"></acme-password-input>' },
  ],
  practices: {
    Behavior: [
      "Reveal changes presentation and keeps the current value and selection.",
      "The visibility action emits acme-visible-change with visible.",
      "Use native autocomplete tokens for the intended credential flow.",
    ],
  },
};
