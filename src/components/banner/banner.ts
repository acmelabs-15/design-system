import { AcmeMessageElement } from "../../shared/message-element";
/** A supplied page or application message with application-owned placement.
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
export class AcmeBanner extends AcmeMessageElement {
  protected get kind() {
    return "banner" as const;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-banner": AcmeBanner;
  }
}
