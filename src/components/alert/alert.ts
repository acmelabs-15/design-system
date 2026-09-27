import { AcmeMessageElement } from "../../shared/message-element";

export type { MessageSize, MessageVariant } from "../../shared/message-element";
/** A supplied section or form message; live urgency is explicitly authored.
 * @slot - Message content.
 * @slot heading - Authored heading content instead of heading text.
 * @slot start - Leading content instead of the decorative status icon.
 * @slot end - Supporting trailing content.
 * @slot actions - Application-owned action controls.
 * @csspart root - Message surface.
 * @csspart icon - Leading content.
 * @csspart heading - Heading region.
 * @csspart content - Message body.
 * @csspart end - Trailing content.
 * @csspart actions - Action region.
 * @csspart close - Explicit dismiss control.
 * @fires {CustomEvent<{action:"dismiss"}>} acme-request - Cancelable dismissal request; the application owns removal.
 */
export class AcmeAlert extends AcmeMessageElement {
  protected get kind() {
    return "alert" as const;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-alert": AcmeAlert;
  }
}
