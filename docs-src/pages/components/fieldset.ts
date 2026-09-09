// Docs page: Fieldset — mirrors https://vercel.com/geist/fieldset
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "fieldset",
  title: "Fieldset",
  lede: "Groups related form controls inside a bordered card with optional footer actions.",
  tags: ["acme-fieldset"],
  examples: [
    {
      h: "Default",
      html: `<acme-fieldset heading="Account Settings"><p slot="description" class="desc">Manage your account preferences and profile information.</p><span slot="status">Need help? <a href="#">View documentation</a></span><acme-button slot="actions" size="small" variant="primary">Save Changes</acme-button></acme-fieldset>`,
    },
    {
      h: "With error text",
      html: `<acme-fieldset heading="API Configuration" status="Last checked: 5 minutes ago"><p slot="description" class="desc">Configure your API endpoints and authentication.</p><acme-error>API key validation failed. Check the key and try again.</acme-error><acme-button slot="actions" size="small" variant="primary">Verify API Connection</acme-button></acme-fieldset>`,
    },
    {
      h: "Error type",
      html: `<acme-fieldset variant="error" heading="Payment Failed" status="Payment failed on February 14"><p slot="description" class="desc">Your payment method was declined.</p><acme-button slot="actions" size="small">Contact Support</acme-button><acme-button slot="actions" size="small" variant="primary">Update Payment Method</acme-button></acme-fieldset>`,
    },
    {
      h: "Warning type",
      html: `<acme-fieldset variant="warning" heading="Trial Ending Soon" status="Trial expires: February 20"><p slot="description" class="desc">Your trial period will end in 3 days.</p><acme-button slot="actions" size="small">Remind Me Later</acme-button><acme-button slot="actions" size="small" variant="primary">Add Payment Method</acme-button></acme-fieldset>`,
    },
    {
      h: "Disabled wall",
      html: `<acme-fieldset disabled heading="Advanced Features" status="Upgrade to a Pro plan to unlock these features."><p slot="description" class="desc">Access premium capabilities.</p><div class="disabled-wall">This content is behind a plan gate.</div></acme-fieldset>`,
    },
  ],
};
