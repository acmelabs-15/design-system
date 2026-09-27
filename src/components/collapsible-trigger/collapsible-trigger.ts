import { AcmeDisclosureTrigger } from "../../shared/disclosure-trigger";
/** Activates its owning collapsible.
 * @slot - Noninteractive trigger label.
 * @csspart trigger - Native button.
 * @csspart label - Label content.
 * @csspart indicator - Expansion indicator.
 */
export class AcmeCollapsibleTrigger extends AcmeDisclosureTrigger {}
declare global {
  interface HTMLElementTagNameMap {
    "acme-collapsible-trigger": AcmeCollapsibleTrigger;
  }
}
