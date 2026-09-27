import { AcmeDisclosureContent } from "../../shared/disclosure-content";
/** Content for its owning collapsible.
 * @slot - Ordinary content, or one inert template for controlled mounting.
 * @csspart content - Animated content wrapper.
 */
export class AcmeCollapsibleContent extends AcmeDisclosureContent {}
declare global {
  interface HTMLElementTagNameMap {
    "acme-collapsible-content": AcmeCollapsibleContent;
  }
}
