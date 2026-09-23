import { AcmeDisclosureContent } from "../../shared/disclosure-content";
/** Content for its owning accordion.
 * @slot - Ordinary content, or one inert template for controlled mounting.
 * @csspart content - Animated content wrapper.
 */
export class AcmeAccordionContent extends AcmeDisclosureContent {}
declare global {
  interface HTMLElementTagNameMap {
    "acme-accordion-content": AcmeAccordionContent;
  }
}
