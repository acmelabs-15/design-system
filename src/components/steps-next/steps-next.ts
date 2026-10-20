import { AcmeStepsAction } from "../../shared/steps-action";
/** Requests the next available step, including explicit completion.
 * @slot - Action label; defaults to localized Next.
 */
export class AcmeStepsNext extends AcmeStepsAction {
  constructor() {
    super("next");
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "acme-steps-next": AcmeStepsNext;
  }
}
