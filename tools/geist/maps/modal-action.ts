// Maps the actions of acme-modal (src/components/modal): each is a small acme-button the consumer
// slots into the footer, so every class is the button's own except the full width of a lone action
// (`fullWidth`, the button's `block` attribute in ours), emitted through the footer's slot.
import type { GeistMap } from "../gen";
import { closed } from "./modal";

export const geist: GeistMap = {
  page: "modal",
  component: "ModalAction",
  element: "modal",
  root: "data-geist-modal-action",
  ours: 'slot[name="actions"]::slotted(acme-button)',
  extends: "button",
  skip: closed,
  props: { fullWidth: { true: "[block]" } },
};
