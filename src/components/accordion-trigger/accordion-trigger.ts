import { AcmeDisclosureTrigger } from "../../shared/disclosure-trigger";
/** Activates its owning accordion.
 * @slot - Noninteractive trigger label.
 * @csspart trigger - Native button.
 * @csspart label - Label content.
 * @csspart indicator - Expansion indicator.
 */
export class AcmeAccordionTrigger extends AcmeDisclosureTrigger {}
declare global {
  interface HTMLElementTagNameMap {
    "acme-accordion-trigger": AcmeAccordionTrigger;
  }
}
