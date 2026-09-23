import type { Doc } from "../../site";
export const doc: Doc = {
  id: "banner",
  title: "Banner",
  lede: "A supplied notice for a page or application.",
  tags: ["acme-banner"],
  examples: [
    {
      h: "Application notice",
      html: '<acme-banner heading="Planned maintenance" variant="warning">Service will be unavailable for a short time.<a slot="actions" href="#maintenance">View maintenance details</a></acme-banner>',
    },
    {
      h: "Optional action",
      html: '<acme-banner heading="New components available" variant="success">Explore the latest additions.<acme-button slot="actions" variant="secondary">Read the release notes</acme-button></acme-banner>',
    },
    {
      h: "Dismiss request",
      html: "<acme-banner dismissible>We updated the project settings.</acme-banner><output></output>",
      script:
        'root.querySelector("acme-banner").addEventListener("acme-request",event=>{event.preventDefault();root.querySelector("output").textContent="The application received the dismissal request.";});',
    },
  ],
  practices: {
    Placement: [
      "The application chooses page placement, sticky behavior and persistence. Banner owns neither routes nor a mobile copy of its message.",
      "One set of authored nodes remains in place at every viewport size. Message text and actions wrap without creating duplicate controls.",
      "Banner supports the same variant, size, heading, dismissible and content slots as Alert. It does not automatically become an ARIA banner landmark or live alert.",
      "Keep messages concise and include clear next steps. Put actions in the actions slot with their own native labels and events.",
    ],
  },
};
