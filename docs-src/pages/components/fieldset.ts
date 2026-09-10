// Docs page: Fieldset — mirrors https://vercel.com/geist/fieldset
import type { Doc } from "../../site";

const action = (t: string) => `<acme-button slot="actions">${t}</acme-button>`;
const secondary = (t: string) => `<acme-button slot="actions" variant="secondary">${t}</acme-button>`;
const box = `position:relative;margin-top:8px;padding:12px;border:1px solid var(--ds-gray-200);border-radius:4px`;

export const doc: Doc = {
  id: "fieldset",
  title: "Fieldset",
  lede: "Groups related form controls inside a bordered card with optional footer actions.",
  tags: ["acme-fieldset", "acme-disabled-wall"],
  examples: [
    {
      h: "Default",
      html: `<acme-fieldset heading="Account Settings"><span slot="subtitle">Manage your account preferences and settings</span><span slot="status">Need help? <a href="#">View documentation</a></span>${action("Save Changes")}</acme-fieldset>`,
    },
    {
      h: "Disabled",
      html: `<acme-fieldset heading="Transfer Project" disabled highlight><span slot="subtitle">Move this project to another team or account</span><span slot="footer">You need additional permissions to transfer projects.</span></acme-fieldset>`,
    },
    {
      h: "With Long Content",
      html: `<acme-fieldset heading="Privacy Policy"><span slot="subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam volutpat, nunc vel ultrices sollicitudin, dolor eros volutpat ex, et sagittis sem enim in eros. Curabitur eu consequat neque, non finibus odio. Donec vitae tellus eu mauris feugiat efficitur. Maecenas blandit sit amet tellus vel blandit. Phasellus ultrices vulputate arcu, vel dictum erat facilisis et.</span><span slot="status">Last updated: March 10, 2025</span>${secondary("Decline")}${action("Accept")}</acme-fieldset>`,
    },
    {
      h: "Multiple Fieldsets",
      html: `<div class="vstack" style="gap:24px"><acme-fieldset heading="Personal Information"><span slot="subtitle">Update your name and contact details</span><span slot="status">This information will be publicly visible</span>${action("Update")}</acme-fieldset><acme-fieldset heading="Security"><span slot="subtitle">Manage your password and authentication methods</span><span slot="status">Last password change: 30 days ago</span>${action("Change Password")}</acme-fieldset><acme-fieldset heading="API Access" disabled highlight><span slot="subtitle">Generate and manage API tokens for programmatic access</span><span slot="footer">You need a Pro account to access API features.</span></acme-fieldset></div>`,
    },
    {
      h: "Without Footer",
      html: `<acme-fieldset heading="Account Information"><span slot="subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquam nisl.</span></acme-fieldset>`,
    },
    {
      h: "Without Title",
      html: `<acme-fieldset><span slot="subtitle">This fieldset contains only a subtitle with no title. It can be used for informational sections or supplementary content.</span><span slot="status">Information only</span></acme-fieldset>`,
    },
    {
      h: "With Error Text",
      html: `<acme-fieldset heading="API Configuration"><span slot="subtitle">Configure your API endpoint and authentication</span><span slot="error">API key validation failed. Please check your credentials and try again.</span><span slot="status">Last checked: 5 minutes ago</span>${action("Verify API Connection")}</acme-fieldset>`,
    },
    {
      h: "With Warning Text",
      html: `<acme-fieldset heading="Database Settings"><span slot="subtitle">Configure your database connection parameters</span><span slot="warning">Changing these settings will require a restart of your application. Make sure to save any pending work.</span><span slot="status">Current status: Connected</span>${secondary("Cancel")}${action("Apply Changes")}</acme-fieldset>`,
    },
    {
      h: "With Disabled Wall",
      html: `<acme-fieldset heading="Advanced Features" disabled highlight><span slot="subtitle">Access premium capabilities and tools</span><div style="${box}"><p class="text-copy-14">This content is behind a disabled wall and not accessible to free users.</p><p class="text-copy-14" style="margin-top:8px">It contains advanced configuration options and premium features.</p><acme-disabled-wall></acme-disabled-wall></div><span slot="footer">Upgrade to a Pro plan to access these features.</span></acme-fieldset>`,
    },
    {
      h: "Error Type",
      html: `<acme-fieldset variant="error" heading="Payment Failed"><span slot="subtitle">Your payment method was declined. Please update your billing information to continue using the service.</span><span slot="status">Payment failed on February 10, 2026</span>${secondary("Contact Support")}${action("Update Payment Method")}</acme-fieldset>`,
    },
    {
      h: "Warning Type",
      html: `<acme-fieldset variant="warning" heading="Trial Ending Soon"><span slot="subtitle">Your trial period will end in 3 days. Add a payment method to continue accessing premium features without interruption.</span><span slot="status">Trial expires: February 13, 2026</span>${secondary("Remind Me Later")}${action("Add Payment Method")}</acme-fieldset>`,
    },
  ],
};
